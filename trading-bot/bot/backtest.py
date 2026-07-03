"""Event-driven long-only backtest with realistic frictions.

Timing model (mirrors how the live loop trades — no lookahead):
  - The model produces prob[t] from features of bar t, available at t's close.
  - If prob[t] >= threshold and we are flat, we buy at bar t+1's OPEN
    (plus slippage), with stop/target barriers anchored at close[t] just like
    the training labels.
  - Barriers are checked on every bar's high/low; when both fall in one bar
    the STOP is assumed to fill first (pessimistic, consistent with labeling).
  - Fees are charged on both sides; slippage is applied adversely on fills.
"""
from __future__ import annotations

from dataclasses import dataclass, field

import numpy as np
import pandas as pd

from .config import BacktestConfig, LabelConfig, RiskConfig
from .metrics import summarize
from .risk import position_size


@dataclass
class BacktestResult:
    equity: pd.Series
    trades: list[dict]
    metrics: dict
    kill_switch_triggered: bool = False
    threshold: float = 0.0
    equity_series_note: str = ""
    extra: dict = field(default_factory=dict)


def run_backtest(
    df: pd.DataFrame,
    prob: pd.Series,
    threshold: float,
    label_cfg: LabelConfig,
    bt_cfg: BacktestConfig,
    risk_cfg: RiskConfig,
    bars_per_year: float,
) -> BacktestResult:
    """`df` needs open/high/low/close and an `atr` column; `prob` is aligned to df
    (NaN where the model has no out-of-sample prediction)."""
    open_ = df["open"].to_numpy()
    high = df["high"].to_numpy()
    low = df["low"].to_numpy()
    close = df["close"].to_numpy()
    atr = df["atr"].to_numpy()
    p = prob.reindex(df.index).to_numpy()
    n = len(df)

    fee = bt_cfg.fee_bps / 10_000
    slip = bt_cfg.slippage_bps / 10_000

    cash = bt_cfg.initial_cash
    qty = 0.0
    stop = target = entry_fill = 0.0
    entry_i = -1
    max_holding = label_cfg.max_holding
    pending_entry = False
    pending_stop = pending_target = 0.0

    peak_equity = cash
    halted = False
    equity_curve = np.empty(n)
    trades: list[dict] = []

    def close_position(i: int, fill: float, reason: str) -> None:
        nonlocal cash, qty, entry_i
        proceeds = qty * fill * (1 - fee)
        cost = qty * entry_fill * (1 + fee)
        pnl = proceeds - cost
        trades.append(
            {
                "entry_time": df.index[entry_i],
                "exit_time": df.index[i],
                "entry": entry_fill,
                "exit": fill,
                "qty": qty,
                "pnl": pnl,
                "ret": proceeds / cost - 1.0,
                "reason": reason,
                "bars_held": i - entry_i,
            }
        )
        cash += proceeds
        qty = 0.0
        entry_i = -1

    for i in range(n):
        # 1) Execute an entry signaled on the previous bar at this bar's open.
        if pending_entry and not halted:
            fill = open_[i] * (1 + slip)
            equity_now = cash  # flat, so equity == cash
            size = position_size(equity_now, cash, fill, pending_stop, risk_cfg, bt_cfg.fee_bps)
            if size * fill >= 10.0:  # ignore dust entries
                qty = size
                entry_fill = fill
                stop, target = pending_stop, pending_target
                entry_i = i
                cash -= qty * fill * (1 + fee)
        pending_entry = False

        # 2) Manage an open position on this bar (entry bar included).
        if qty > 0:
            if low[i] <= stop:  # pessimistic ordering: stop before target
                close_position(i, stop * (1 - slip), "stop")
            elif high[i] >= target:
                close_position(i, target * (1 - slip), "target")
            elif i - entry_i >= max_holding:
                close_position(i, close[i] * (1 - slip), "time")
            elif halted:
                close_position(i, close[i] * (1 - slip), "kill_switch")

        # 3) Mark to market at the close.
        equity = cash + qty * close[i]
        equity_curve[i] = equity
        peak_equity = max(peak_equity, equity)
        if not halted and equity / peak_equity - 1 <= -risk_cfg.max_drawdown_pct:
            halted = True

        # 4) Signal for next bar's open.
        if (
            qty == 0.0
            and not halted
            and i < n - 1
            and np.isfinite(p[i])
            and p[i] >= threshold
            and np.isfinite(atr[i])
            and atr[i] > 0
        ):
            pending_entry = True
            pending_stop = close[i] - label_cfg.sl_atr * atr[i]
            pending_target = close[i] + label_cfg.tp_atr * atr[i]
            if pending_stop <= 0:
                pending_entry = False

    equity_series = pd.Series(equity_curve, index=df.index, name="equity")
    buy_hold = bt_cfg.initial_cash * df["close"] / df["close"].iloc[0]
    metrics = summarize(equity_series, trades, bars_per_year, buy_hold)
    metrics["kill_switch_triggered"] = halted
    metrics["threshold"] = round(threshold, 3)
    return BacktestResult(
        equity=equity_series,
        trades=trades,
        metrics=metrics,
        kill_switch_triggered=halted,
        threshold=threshold,
    )


def tune_threshold(
    df: pd.DataFrame,
    prob: pd.Series,
    label_cfg: LabelConfig,
    bt_cfg: BacktestConfig,
    risk_cfg: RiskConfig,
    bars_per_year: float,
    grid: np.ndarray | None = None,
    min_trades: int = 30,
) -> tuple[float, list[dict]]:
    """Pick the probability threshold with the best OOS Sharpe (needs >= min_trades).
    Runs only over the out-of-sample region so flat pre-OOS bars don't dilute stats."""
    valid = prob.dropna()
    if valid.empty:
        return 0.6, []
    oos_df = df.loc[valid.index[0] :]
    grid = grid if grid is not None else np.round(np.arange(0.50, 0.751, 0.01), 2)
    rows: list[dict] = []
    best_thr, best_sharpe = None, -np.inf
    for thr in grid:
        res = run_backtest(oos_df, prob, float(thr), label_cfg, bt_cfg, risk_cfg, bars_per_year)
        row = {"threshold": float(thr), **res.metrics}
        rows.append(row)
        if res.metrics["n_trades"] >= min_trades and res.metrics["sharpe"] > best_sharpe:
            best_sharpe = res.metrics["sharpe"]
            best_thr = float(thr)
    return (best_thr if best_thr is not None else 0.6), rows
