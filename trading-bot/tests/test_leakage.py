"""En önemli testler: HİÇBİR geleceğe bakma (look-ahead) sızıntısı olmadığını kanıtlar.

t barındaki bir öznitelik, ileriki barlar eklenince değişiyorsa, backtest yalandır.
"""

import numpy as np
import pandas as pd

from tradingbot.config import Config
from tradingbot.data.synthetic import generate_synthetic_ohlcv
from tradingbot.features import indicators
from tradingbot.features.pipeline import build_features, build_labels


def test_features_are_causal():
    """Feature values up to bar t must not change when future bars are added."""
    cfg = Config()
    df = generate_synthetic_ohlcv(n=1500, timeframe="1h", seed=3)
    cut = 1000

    feat_full, cols = build_features(df, cfg)
    feat_trunc, _ = build_features(df.iloc[:cut], cfg)

    common = feat_full.columns.intersection(feat_trunc.columns)
    a = feat_full[common].iloc[:cut]
    b = feat_trunc[common]
    # Rows defined in both must match exactly (only-backward-looking indicators).
    both_valid = a.notna() & b.notna()
    diff = (a[both_valid] - b[both_valid]).abs()
    assert np.nanmax(diff.to_numpy()) < 1e-9, "features changed when future data appended -> LEAKAGE"


def test_label_is_forward_shifted():
    cfg = Config()
    cfg.features.label.kind = "direction"
    cfg.features.label.horizon = 1
    cfg.features.label.neutral_atr_mult = 0.0
    df = generate_synthetic_ohlcv(n=300, timeframe="1h", seed=1)
    y = build_labels(df, cfg)

    close = df["close"]
    # Recompute the expected label independently.
    for i in range(0, len(df) - 1):
        expected = 1.0 if close.iloc[i + 1] > close.iloc[i] else 0.0
        assert y.iloc[i] == expected
    # Last horizon rows have unknown future -> NaN.
    assert np.isnan(y.iloc[-1])


def test_label_horizon_multi():
    cfg = Config()
    cfg.features.label.kind = "return"
    cfg.features.label.horizon = 5
    df = generate_synthetic_ohlcv(n=200, timeframe="1h", seed=2)
    y = build_labels(df, cfg)
    close = df["close"]
    exp = close.iloc[10 + 5] / close.iloc[10] - 1
    assert abs(y.iloc[10] - exp) < 1e-12
    assert y.iloc[-5:].isna().all()


def test_rsi_bounds():
    df = generate_synthetic_ohlcv(n=500, timeframe="1h", seed=4)
    rsi = indicators.rsi(df["close"], 14).dropna()
    assert (rsi >= 0).all() and (rsi <= 100).all()
