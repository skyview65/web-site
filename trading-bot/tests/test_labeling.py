import numpy as np
import pandas as pd

from bot.config import LabelConfig
from bot.labeling import triple_barrier


def _frame(closes, spread=0.5):
    closes = np.asarray(closes, dtype=float)
    idx = pd.date_range("2024-01-01", periods=len(closes), freq="h", tz="UTC")
    return pd.DataFrame(
        {
            "open": closes,
            "high": closes + spread,
            "low": closes - spread,
            "close": closes,
            "volume": np.ones_like(closes),
        },
        index=idx,
    )


CFG = LabelConfig(atr_period=14, tp_atr=2.0, sl_atr=1.5, max_holding=5)


def test_uptrend_labels_one():
    df = _frame([100, 102, 104, 106, 108, 110, 112, 114, 116, 118])
    atr = pd.Series(1.0, index=df.index)
    labels = triple_barrier(df, atr, CFG)
    # From bar 0: target=102, stop=98.5 -> bar 1 high 102.5 touches target first.
    assert labels["label"].iloc[0] == 1.0
    assert labels["label_ret"].iloc[0] > 0


def test_downtrend_labels_zero():
    df = _frame([100, 98, 96, 94, 92, 90, 88, 86, 84, 82])
    atr = pd.Series(1.0, index=df.index)
    labels = triple_barrier(df, atr, CFG)
    assert labels["label"].iloc[0] == 0.0
    assert labels["label_ret"].iloc[0] < 0


def test_vertical_barrier_uses_return_sign():
    df = _frame([100, 100.1, 100.0, 100.1, 100.0, 100.3, 100, 100, 100, 100], spread=0.1)
    atr = pd.Series(1.0, index=df.index)  # barriers at 102 / 98.5 — never touched
    labels = triple_barrier(df, atr, CFG)
    assert labels["label"].iloc[0] == 1.0  # close[5]=100.3 > 100
    assert labels["label_holding"].iloc[0] == 5


def test_tail_left_unlabeled():
    df = _frame(np.linspace(100, 120, 10))
    atr = pd.Series(1.0, index=df.index)
    labels = triple_barrier(df, atr, CFG)
    # Bars whose max_holding window runs past the series end must stay NaN.
    assert labels["label"].iloc[-CFG.max_holding :].isna().all()


def test_same_bar_ambiguity_is_pessimistic():
    # One huge bar that spans both barriers -> stop assumed first.
    df = _frame([100, 100], spread=0.0)
    df.loc[df.index[1], "high"] = 110.0
    df.loc[df.index[1], "low"] = 90.0
    cfg = LabelConfig(tp_atr=2.0, sl_atr=1.5, max_holding=1)
    atr = pd.Series(1.0, index=df.index)
    labels = triple_barrier(df, atr, cfg)
    assert labels["label"].iloc[0] == 0.0
