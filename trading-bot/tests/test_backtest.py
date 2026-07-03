import numpy as np
import pandas as pd

from bot.backtest import run_backtest
from bot.config import BacktestConfig, LabelConfig, RiskConfig


def _frame(closes):
    closes = np.asarray(closes, dtype=float)
    idx = pd.date_range("2024-01-01", periods=len(closes), freq="h", tz="UTC")
    df = pd.DataFrame(
        {
            "open": closes,
            "high": closes + 0.2,
            "low": closes - 0.2,
            "close": closes,
            "volume": np.ones_like(closes),
        },
        index=idx,
    )
    df["atr"] = 1.0
    return df


LABELS = LabelConfig(tp_atr=2.0, sl_atr=1.5, max_holding=4)
BT = BacktestConfig(fee_bps=0.0, slippage_bps=0.0, initial_cash=10_000.0)
RISK = RiskConfig(risk_per_trade=0.01, max_position_pct=0.25, max_drawdown_pct=0.5)


def test_winning_trade_hits_target():
    # Signal at bar 1 (close 100): stop 98.5, target 102. Entry at bar 2 open (100).
    # Bar 4 high = 102.2 -> target filled at 102.
    df = _frame([100, 100, 100, 101, 102, 102, 102, 102])
    prob = pd.Series([np.nan, 0.9, 0, 0, 0, 0, 0, 0], index=df.index, dtype=float)
    res = run_backtest(df, prob, 0.6, LABELS, BT, RISK, bars_per_year=8760)
    assert len(res.trades) == 1
    trade = res.trades[0]
    assert trade["reason"] == "target"
    assert trade["entry"] == 100.0
    assert trade["exit"] == 102.0
    expected_qty = min(10_000 * 0.01 / 1.5, 10_000 * 0.25 / 100)
    assert abs(trade["qty"] - expected_qty) < 1e-9
    assert abs(trade["pnl"] - expected_qty * 2.0) < 1e-6
    assert abs(res.equity.iloc[-1] - (10_000 + trade["pnl"])) < 1e-6


def test_losing_trade_hits_stop():
    df = _frame([100, 100, 100, 99, 98, 98, 98, 98])
    prob = pd.Series([np.nan, 0.9, 0, 0, 0, 0, 0, 0], index=df.index, dtype=float)
    res = run_backtest(df, prob, 0.6, LABELS, BT, RISK, bars_per_year=8760)
    assert len(res.trades) == 1
    assert res.trades[0]["reason"] == "stop"
    assert res.trades[0]["exit"] == 98.5
    # Sizing: risk-based qty (100/1.5) is capped by max_position_pct at 25 units,
    # so the realized loss is qty * (entry - stop) = 25 * 1.5 = 37.5.
    expected_qty = min(10_000 * 0.01 / 1.5, 10_000 * 0.25 / 100)
    assert abs(res.trades[0]["pnl"] + expected_qty * 1.5) < 1e-6


def test_no_signal_no_trades():
    df = _frame(np.full(20, 100.0))
    prob = pd.Series(0.0, index=df.index)
    res = run_backtest(df, prob, 0.6, LABELS, BT, RISK, bars_per_year=8760)
    assert res.trades == []
    assert (res.equity == 10_000).all()


def test_fees_reduce_pnl():
    df = _frame([100, 100, 100, 101, 102, 102, 102, 102])
    prob = pd.Series([np.nan, 0.9, 0, 0, 0, 0, 0, 0], index=df.index, dtype=float)
    with_fees = run_backtest(
        df, prob, 0.6, LABELS,
        BacktestConfig(fee_bps=10.0, slippage_bps=5.0, initial_cash=10_000.0),
        RISK, bars_per_year=8760,
    )
    without = run_backtest(df, prob, 0.6, LABELS, BT, RISK, bars_per_year=8760)
    assert with_fees.trades[0]["pnl"] < without.trades[0]["pnl"]
