"""The critical property: features must never look into the future."""
import numpy as np

from bot.data import synthetic_ohlcv
from bot.features import build_features


def test_no_lookahead():
    df = synthetic_ohlcv(n_bars=800, seed=3)
    full, cols = build_features(df)
    truncated, _ = build_features(df.iloc[:600])
    a = full[cols].iloc[:600]
    b = truncated[cols]
    # Features computed with 800 bars must be identical on the first 600 rows
    # to features computed with only those 600 bars.
    assert np.allclose(a.fillna(-999).to_numpy(), b.fillna(-999).to_numpy(), atol=1e-10)


def test_features_are_finite_after_warmup():
    df = synthetic_ohlcv(n_bars=1200, seed=5)
    feats, cols = build_features(df)
    tail = feats[cols].iloc[500:]
    assert tail.notna().all().all(), tail.isna().sum()[lambda s: s > 0]
