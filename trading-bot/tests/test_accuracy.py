"""Örneklem-dışı yön isabeti hedefi (sentetik kum havuzunda >= %60).

Paket içindeki sentetik veriye enjekte edilmiş, NEDENSEL bir AR(1) momentum yapısı
vardır; bu yüzden sızıntısız bir walk-forward bunu meşru şekilde öğrenir ve %60'ı
aşar. Bu test bunu korur. Gerçek piyasalar hakkında bir iddia DEĞİLDİR — gerçek
likit piyasalarda bu otokorelasyon neredeyse yoktur, gerçek örneklem-dışı isabet
de bu yüzden ~%50 civarındadır.
"""

from tradingbot.config import Config
from tradingbot.data.synthetic import generate_synthetic_ohlcv
from tradingbot.features.pipeline import build_dataset
from tradingbot.backtest.walkforward import walk_forward


def _wf(n=5000, seed=7):
    cfg = Config()
    cfg.validation.train_size = 1500
    cfg.validation.test_size = 500
    cfg.validation.step = 500
    df = generate_synthetic_ohlcv(n=n, timeframe="1h", seed=seed)
    ds = build_dataset(df, cfg)
    return walk_forward(ds, cfg)


def test_oos_accuracy_at_least_60pct():
    wf = _wf()
    assert wf.directional_accuracy is not None
    assert wf.directional_accuracy >= 0.60, (
        f"OOS directional accuracy {wf.directional_accuracy:.3f} below 0.60 target"
    )


def test_no_leakage_still_holds_with_structure():
    """Structure must be learned causally, not leaked: features stay causal."""
    import numpy as np
    from tradingbot.features.pipeline import build_features

    cfg = Config()
    df = generate_synthetic_ohlcv(n=2000, timeframe="1h", seed=5)
    cut = 1400
    full, _ = build_features(df, cfg)
    trunc, _ = build_features(df.iloc[:cut], cfg)
    common = full.columns.intersection(trunc.columns)
    a, b = full[common].iloc[:cut], trunc[common]
    valid = a.notna() & b.notna()
    assert np.nanmax((a[valid] - b[valid]).abs().to_numpy()) < 1e-9
