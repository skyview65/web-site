"""Backtest: gerçekçi, maliyet duyarlı, yola bağımlı simülasyon + metrikler."""

from tradingbot.backtest.engine import BacktestResult, run_backtest
from tradingbot.backtest.metrics import compute_metrics

__all__ = ["run_backtest", "BacktestResult", "compute_metrics"]
