"""Risk boyutlandırma: kısıtlama (clamp), ölü bölge, varsayılan short kapalı."""

import numpy as np
import pandas as pd

from tradingbot.config import Config
from tradingbot.risk.sizing import target_weights


def _frame(n=300, seed=1):
    from tradingbot.data.synthetic import generate_synthetic_ohlcv
    from tradingbot.features.pipeline import build_dataset

    cfg = Config()
    df = generate_synthetic_ohlcv(n=n, timeframe="1h", seed=seed)
    ds = build_dataset(df, cfg)
    return cfg, ds


def test_weights_clamped_to_max_leverage():
    cfg, ds = _frame()
    cfg.risk.max_leverage = 1.0
    cfg.risk.allow_short = True
    signal = pd.Series(0.99, index=ds.frame.index)  # extreme conviction
    w = target_weights(ds.frame, signal, cfg, is_classifier=True)
    assert (w.abs() <= cfg.risk.max_leverage + 1e-9).all()


def test_no_short_by_default():
    cfg, ds = _frame()
    cfg.risk.allow_short = False
    signal = pd.Series(0.01, index=ds.frame.index)  # strong DOWN signal
    w = target_weights(ds.frame, signal, cfg, is_classifier=True)
    assert (w >= -1e-12).all(), "shorting must be disabled by default"


def test_dead_band_blocks_small_edges():
    cfg, ds = _frame()
    cfg.model.min_edge = 0.10
    # signal just barely above 0.5 -> edge 0.02 < min_edge -> no position
    signal = pd.Series(0.52, index=ds.frame.index)
    w = target_weights(ds.frame, signal, cfg, is_classifier=True)
    assert (w.abs() < 1e-12).all()


def test_neutral_signal_is_flat():
    cfg, ds = _frame()
    signal = pd.Series(0.5, index=ds.frame.index)  # exactly no edge
    w = target_weights(ds.frame, signal, cfg, is_classifier=True)
    assert (w.abs() < 1e-12).all()
