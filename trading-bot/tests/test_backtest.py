"""Backtest motoru: maliyet muhasebesi, geleceğe bakma yok, devre kesiciler."""

import numpy as np
import pandas as pd

from tradingbot.config import Config
from tradingbot.backtest.engine import run_backtest
from tradingbot.backtest.metrics import max_drawdown, compute_metrics


def _frame(prices, target_weight, atr_frac=0.02):
    idx = pd.date_range("2022-01-01", periods=len(prices), freq="1h", tz="UTC")
    close = pd.Series(prices, index=idx, dtype=float)
    return pd.DataFrame(
        {
            "close": close,
            "high": close * 1.001,
            "low": close * 0.999,
            "atr": close * atr_frac,
            "target_weight": pd.Series(target_weight, index=idx, dtype=float),
        }
    )


def test_zero_cost_buy_and_hold_matches_price_return():
    prices = [100, 101, 103, 102, 105, 110]
    frame = _frame(prices, target_weight=1.0)
    cfg = Config()
    cfg.backtest.fee_bps = 0.0
    cfg.backtest.slippage_bps = 0.0
    cfg.risk.max_drawdown_halt = 0.0
    cfg.risk.max_daily_loss = 0.0
    cfg.risk.stop_loss_atr = 0.0
    cfg.risk.take_profit_atr = 0.0
    cfg.risk.hold_to_exit = False
    res = run_backtest(frame, cfg)
    ratio = res.equity.iloc[-1] / cfg.backtest.initial_cash
    assert abs(ratio - prices[-1] / prices[0]) < 1e-9


def test_costs_reduce_return():
    prices = [100, 101, 100, 101, 100, 101]
    # flip-flop weight forces trading every bar
    weights = [1.0, 0.0, 1.0, 0.0, 1.0, 0.0]
    cfg = Config()
    cfg.risk.max_drawdown_halt = 0.0
    cfg.risk.max_daily_loss = 0.0
    cfg.risk.stop_loss_atr = 0.0
    cfg.risk.take_profit_atr = 0.0
    cfg.risk.hold_to_exit = False  # let the flip-flop weights actually trade

    cfg.backtest.fee_bps = 0.0
    cfg.backtest.slippage_bps = 0.0
    free = run_backtest(_frame(prices, weights), cfg).equity.iloc[-1]

    cfg.backtest.fee_bps = 50.0
    cfg.backtest.slippage_bps = 50.0
    costly = run_backtest(_frame(prices, weights), cfg).equity.iloc[-1]

    assert costly < free, "trading costs must reduce final equity"


def test_no_lookahead_position_earns_next_bar():
    # Price jumps up only at the last bar; a signal that only turns on AT that
    # last bar cannot capture the jump (it acts at close, earns the *next* bar).
    prices = [100, 100, 100, 100, 200]
    weights = [0, 0, 0, 0, 1.0]  # only long on the final bar
    cfg = Config()
    cfg.backtest.fee_bps = 0.0
    cfg.backtest.slippage_bps = 0.0
    cfg.risk.max_drawdown_halt = 0.0
    cfg.risk.stop_loss_atr = 0.0
    cfg.risk.take_profit_atr = 0.0
    cfg.risk.hold_to_exit = False
    res = run_backtest(_frame(prices, weights), cfg)
    # No return should have been captured from the jump.
    assert abs(res.equity.iloc[-1] - cfg.backtest.initial_cash) < 1e-6


def test_drawdown_circuit_breaker_halts():
    # Monotonic crash; buy-and-hold should trip the 25% drawdown halt and go flat.
    prices = list(np.linspace(100, 40, 50))
    cfg = Config()
    cfg.backtest.fee_bps = 0.0
    cfg.backtest.slippage_bps = 0.0
    cfg.risk.stop_loss_atr = 0.0
    cfg.risk.take_profit_atr = 0.0
    cfg.risk.hold_to_exit = False
    cfg.risk.max_daily_loss = 0.0
    cfg.risk.max_drawdown_halt = 0.25
    res = run_backtest(_frame(prices, 1.0), cfg)
    assert res.halted_at is not None
    # After halting it must be flat for the rest of the run.
    assert res.position.iloc[-1] == 0.0


def test_metrics_math():
    idx = pd.date_range("2022-01-01", periods=5, freq="1D", tz="UTC")
    eq = pd.Series([100, 110, 121, 108.9, 119.79], index=idx)
    assert abs(max_drawdown(eq) - 0.1) < 1e-6  # 121 -> 108.9 is -10%
    m = compute_metrics(eq, bars_per_year=365)
    assert m["total_return"] > 0
    assert "sharpe" in m and "max_drawdown" in m
