"""Triple-barrier labeling (Lopez de Prado, Advances in Financial ML, ch. 3).

For each bar t we simulate a long entry at close[t] with:
  - upper barrier (take profit): close[t] + tp_atr * ATR[t]
  - lower barrier (stop loss):   close[t] - sl_atr * ATR[t]
  - vertical barrier:            t + max_holding bars

label = 1 if the upper barrier is touched first, 0 if the lower one is.
If both barriers fall inside the same bar we cannot know the intra-bar order,
so we PESSIMISTICALLY assume the stop was hit first (label 0). At the vertical
barrier the label is the sign of the realized return. Bars whose window would
run past the end of the series are left NaN and must be dropped by the caller
— never labeled with partial information.
"""
from __future__ import annotations

import numpy as np
import pandas as pd

from .config import LabelConfig


def triple_barrier(df: pd.DataFrame, atr: pd.Series, cfg: LabelConfig) -> pd.DataFrame:
    high = df["high"].to_numpy()
    low = df["low"].to_numpy()
    close = df["close"].to_numpy()
    a = atr.to_numpy()
    n = len(df)

    label = np.full(n, np.nan)
    realized = np.full(n, np.nan)
    holding = np.full(n, np.nan)

    for t in range(n - 1):
        if not np.isfinite(a[t]) or a[t] <= 0:
            continue
        if t + cfg.max_holding > n - 1:
            continue  # incomplete window at the tail of the series
        entry = close[t]
        upper = entry + cfg.tp_atr * a[t]
        lower = entry - cfg.sl_atr * a[t]
        end = t + cfg.max_holding

        lab = ret = held = None
        for j in range(t + 1, end + 1):
            if low[j] <= lower:  # pessimistic: stop checked before target
                lab, ret, held = 0.0, lower / entry - 1.0, j - t
                break
            if high[j] >= upper:
                lab, ret, held = 1.0, upper / entry - 1.0, j - t
                break
        if lab is None:
            ret = close[end] / entry - 1.0
            lab = 1.0 if ret > 0 else 0.0
            held = cfg.max_holding

        label[t] = lab
        realized[t] = ret
        holding[t] = held

    return pd.DataFrame(
        {"label": label, "label_ret": realized, "label_holding": holding},
        index=df.index,
    )
