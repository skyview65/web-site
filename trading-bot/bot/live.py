"""Paper/live trading loop.

Each cycle runs once per closed bar: fetch the latest closed bars, rebuild
features exactly as in training, predict with the saved ensemble, then manage
the position (barrier exits first, then possible entry). Bookkeeping always
lives in the local PaperBroker state file; in live mode fills are mirrored to
the exchange as market orders.
"""
from __future__ import annotations

import time
from datetime import datetime, timezone

import pandas as pd
from rich.console import Console

from .broker import CcxtBroker, PaperBroker
from .config import BotConfig
from .data import fetch_recent, timeframe_ms
from .features import build_features
from .model import predict_proba
from .pipeline import load_bundle, model_dir
from .risk import KillSwitch, position_size

console = Console()
WARMUP_BARS = 600  # enough history for the longest rolling window (384) + margin


def run_cycle(
    cfg: BotConfig, symbol: str, bundle: dict, broker: PaperBroker, live_broker: CcxtBroker | None
) -> dict:
    df = fetch_recent(cfg.data, symbol, n_bars=WARMUP_BARS)
    if len(df) < 450:
        raise RuntimeError(f"Only {len(df)} bars fetched; need >=450 for feature warmup.")
    feats, _ = build_features(df)
    row = feats.iloc[-1]  # latest CLOSED bar
    X = feats[bundle["feature_cols"]].iloc[[-1]]
    prob = float(predict_proba(bundle["models"], X)[0])
    price = float(row["close"])
    ts = feats.index[-1]

    kill = KillSwitch.from_dict(cfg.risk, broker.state.get("kill", {}))
    equity = broker.mark(price)
    if kill.peak_equity == 0.0:
        kill.peak_equity = equity
    kill.update(equity, ts)

    action = "hold"
    detail = ""
    if broker.in_position:
        bars_held = broker.tick_holding()
        state = broker.state
        if float(row["low"]) <= state["stop"]:
            trade = broker.close(state["stop"], ts, "stop")
            action, detail = "exit", f"stop hit, pnl={trade['pnl']:.2f}"
        elif float(row["high"]) >= state["target"]:
            trade = broker.close(state["target"], ts, "target")
            action, detail = "exit", f"target hit, pnl={trade['pnl']:.2f}"
        elif bars_held >= bundle["label_config"]["max_holding"] or kill.halted:
            reason = "kill_switch" if kill.halted else "time"
            trade = broker.close(price, ts, reason)
            action, detail = "exit", f"{reason} exit, pnl={trade['pnl']:.2f}"
        if action == "exit" and live_broker is not None:
            live_broker.market_sell(symbol, trade["qty"])
    elif prob >= bundle["threshold"] and kill.allows_entry:
        atr_val = float(row["atr"])
        stop = price - bundle["label_config"]["sl_atr"] * atr_val
        target = price + bundle["label_config"]["tp_atr"] * atr_val
        qty = position_size(
            equity, broker.state["cash"], price, stop, cfg.risk, cfg.backtest.fee_bps
        )
        if qty * price >= 10.0 and stop > 0:
            fill = broker.open_long(price, qty, ts, stop, target)
            if fill > 0:
                action, detail = "enter", f"qty={qty:.6f} stop={stop:.2f} target={target:.2f}"
                if live_broker is not None:
                    live_broker.market_buy(symbol, qty)

    broker.state["kill"] = kill.to_dict()
    broker._save()
    equity = broker.mark(price)
    result = {
        "ts": str(ts),
        "symbol": symbol,
        "price": price,
        "prob": round(prob, 4),
        "threshold": bundle["threshold"],
        "action": action,
        "detail": detail,
        "equity": round(equity, 2),
        "in_position": broker.in_position,
        "halted": kill.halted,
    }
    console.log(result)
    return result


def trading_loop(cfg: BotConfig, live: bool = False, once: bool = False) -> None:
    symbol = cfg.data.symbols[0]
    bundle = load_bundle(cfg, symbol)
    if not bundle.get("tradeable", False):
        verdict = bundle.get("verdict", "model has no validated out-of-sample edge")
        if live:
            console.print(f"[bold red]REFUSING live mode:[/bold red] {verdict}")
            return
        console.print(f"[yellow]Warning:[/yellow] {verdict}")
    state_dir = cfg.path(cfg.state_dir)
    state_dir.mkdir(parents=True, exist_ok=True)
    mode = "live" if live else "paper"
    broker = PaperBroker(
        state_dir / f"{mode}_{symbol.replace('/', '-')}_{cfg.data.timeframe}.json",
        cfg.backtest.initial_cash,
        cfg.backtest.fee_bps,
        cfg.backtest.slippage_bps,
    )
    live_broker = CcxtBroker(cfg.data.exchange) if live else None
    console.print(
        f"[bold]{mode.upper()}[/bold] loop for {symbol} {cfg.data.timeframe} "
        f"(threshold={bundle['threshold']}, model trained {bundle['trained_at']})"
    )

    while True:
        try:
            run_cycle(cfg, symbol, bundle, broker, live_broker)
        except Exception as exc:  # network hiccups etc. — log and retry next bar
            console.print(f"[red]cycle error:[/red] {exc}")
        if once:
            break
        tf_s = timeframe_ms(cfg.data.timeframe) / 1000
        now = datetime.now(timezone.utc).timestamp()
        sleep_s = tf_s - (now % tf_s) + 20  # wake shortly after the next bar closes
        console.print(f"sleeping {sleep_s / 60:.1f} min until next closed bar...")
        time.sleep(sleep_s)
