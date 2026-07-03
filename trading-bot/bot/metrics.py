"""Performance metrics for equity curves and trade lists."""
from __future__ import annotations

import numpy as np
import pandas as pd


def sharpe(returns: pd.Series, bars_per_year: float) -> float:
    std = returns.std()
    if std == 0 or not np.isfinite(std) or len(returns) < 2:
        return 0.0
    return float(returns.mean() / std * np.sqrt(bars_per_year))


def max_drawdown(equity: pd.Series) -> float:
    peak = equity.cummax()
    return float((equity / peak - 1.0).min())


def cagr(equity: pd.Series, bars_per_year: float) -> float:
    if len(equity) < 2 or equity.iloc[0] <= 0:
        return 0.0
    years = len(equity) / bars_per_year
    if years <= 0:
        return 0.0
    total = equity.iloc[-1] / equity.iloc[0]
    if total <= 0:
        return -1.0
    return float(total ** (1 / years) - 1.0)


def summarize(
    equity: pd.Series,
    trades: list[dict],
    bars_per_year: float,
    buy_hold_equity: pd.Series | None = None,
) -> dict:
    rets = equity.pct_change().fillna(0.0)
    wins = [t for t in trades if t["pnl"] > 0]
    losses = [t for t in trades if t["pnl"] <= 0]
    gross_win = sum(t["pnl"] for t in wins)
    gross_loss = -sum(t["pnl"] for t in losses)
    out = {
        "total_return_pct": round(float(equity.iloc[-1] / equity.iloc[0] - 1) * 100, 2),
        "cagr_pct": round(cagr(equity, bars_per_year) * 100, 2),
        "sharpe": round(sharpe(rets, bars_per_year), 2),
        "max_drawdown_pct": round(max_drawdown(equity) * 100, 2),
        "n_trades": len(trades),
        "win_rate_pct": round(100 * len(wins) / len(trades), 2) if trades else 0.0,
        "profit_factor": round(float(gross_win / gross_loss), 2) if gross_loss > 0 else float("inf"),
        "avg_trade_pct": round(float(np.mean([t["ret"] for t in trades])) * 100, 3) if trades else 0.0,
    }
    if buy_hold_equity is not None and len(buy_hold_equity) > 1:
        out["buy_hold_return_pct"] = round(
            float(buy_hold_equity.iloc[-1] / buy_hold_equity.iloc[0] - 1) * 100, 2
        )
        out["buy_hold_max_dd_pct"] = round(max_drawdown(buy_hold_equity) * 100, 2)
    return out
