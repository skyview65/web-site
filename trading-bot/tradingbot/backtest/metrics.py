"""Sermaye (equity) eğrisinden hesaplanan performans metrikleri (+ isteğe bağlı işlem PnL'leri).

Bir stratejiyi gerçekte bu sayılara göre değerlendirirsiniz — yön *isabetine* göre
değil. İyi risk yönetimine sahip %53 isabetli bir strateji güzelce bileşiklenebilir;
ara sıra kocaman bir zarar alan %90 isabetli bir strateji ise sıfıra gidebilir.
"""

from __future__ import annotations

import math

import numpy as np
import pandas as pd


def max_drawdown(equity: pd.Series) -> float:
    """Tepe-dip arası en büyük düşüş, pozitif oran olarak (0.30 = -%30)."""
    running_max = equity.cummax()
    dd = equity / running_max - 1.0
    return float(-dd.min()) if len(dd) else 0.0


def compute_metrics(
    equity: pd.Series,
    bars_per_year: float,
    trade_returns: list[float] | None = None,
    exposure: float | None = None,
) -> dict[str, float]:
    equity = equity.dropna()
    out: dict[str, float] = {}
    n = len(equity)
    if n < 2:
        return {"n_bars": float(n)}

    rets = equity.pct_change().dropna()
    total_return = float(equity.iloc[-1] / equity.iloc[0] - 1.0)
    years = n / bars_per_year
    cagr = float((equity.iloc[-1] / equity.iloc[0]) ** (1.0 / years) - 1.0) if years > 0 else 0.0

    vol_bar = float(rets.std(ddof=0))
    ann_vol = vol_bar * math.sqrt(bars_per_year)
    mean_bar = float(rets.mean())
    sharpe = (mean_bar / vol_bar * math.sqrt(bars_per_year)) if vol_bar > 0 else 0.0

    downside = rets[rets < 0]
    dstd = float(downside.std(ddof=0)) if len(downside) else 0.0
    sortino = (mean_bar / dstd * math.sqrt(bars_per_year)) if dstd > 0 else 0.0

    mdd = max_drawdown(equity)
    calmar = (cagr / mdd) if mdd > 0 else 0.0

    out.update(
        n_bars=float(n),
        total_return=total_return,
        cagr=cagr,
        ann_vol=ann_vol,
        sharpe=sharpe,
        sortino=sortino,
        max_drawdown=mdd,
        calmar=calmar,
    )
    if exposure is not None:
        out["exposure"] = float(exposure)

    if trade_returns:
        arr = np.asarray(trade_returns, dtype=float)
        wins = arr[arr > 0]
        losses = arr[arr < 0]
        out["n_trades"] = float(len(arr))
        out["win_rate"] = float(len(wins) / len(arr)) if len(arr) else 0.0
        gross_win = float(wins.sum())
        gross_loss = float(-losses.sum())
        out["profit_factor"] = (gross_win / gross_loss) if gross_loss > 0 else float("inf")
        out["avg_trade"] = float(arr.mean())
    else:
        out["n_trades"] = 0.0
    return out


def format_metrics(metrics: dict[str, float]) -> str:
    """Satır başına bir metrik olacak şekilde okunabilir özet."""
    order = [
        ("total_return", "Toplam getiri", "pct"),
        ("cagr", "Yıllık bileşik (CAGR)", "pct"),
        ("ann_vol", "Yıllık volatilite", "pct"),
        ("sharpe", "Sharpe", "num"),
        ("sortino", "Sortino", "num"),
        ("max_drawdown", "Maks. düşüş", "pct"),
        ("calmar", "Calmar", "num"),
        ("exposure", "Piyasada kalma", "pct"),
        ("n_trades", "İşlem sayısı", "int"),
        ("win_rate", "İsabet oranı", "pct"),
        ("profit_factor", "Kâr faktörü", "num"),
        ("avg_trade", "İşlem ort.", "pct"),
    ]
    lines = []
    for key, label, fmt in order:
        if key not in metrics:
            continue
        v = metrics[key]
        if fmt == "pct":
            lines.append(f"  {label:<16} {v * 100:>10.2f}%")
        elif fmt == "int":
            lines.append(f"  {label:<16} {int(v):>10d}")
        else:
            lines.append(f"  {label:<16} {v:>10.3f}")
    return "\n".join(lines)
