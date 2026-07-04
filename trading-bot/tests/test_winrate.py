"""Varsayılan 'yüksek isabet' modunun >= %52'ye ulaştığının uçtan uca kontrolü.

İstenen davranışı korur VE dürüst uyarıyı kodda belgeler: isabet çıtasını aşan
aynı koşu yine de kârsız olabilir (win rate != avantaj).
"""

from tradingbot.config import Config
from tradingbot.data.synthetic import generate_synthetic_ohlcv
from tradingbot.features.pipeline import build_dataset
from tradingbot.backtest.walkforward import walk_forward


def test_default_config_win_rate_at_least_52pct():
    cfg = Config()  # ships in high win-rate mode
    # small, fast walk-forward
    cfg.validation.train_size = 800
    cfg.validation.test_size = 400
    cfg.validation.step = 400

    df = generate_synthetic_ohlcv(n=4000, timeframe="1h", seed=7)
    ds = build_dataset(df, cfg)
    wf = walk_forward(ds, cfg)

    win_rate = wf.backtest.metrics.get("win_rate", 0.0)
    n_trades = wf.backtest.metrics.get("n_trades", 0.0)
    assert n_trades > 20, "need enough trades for the win rate to be meaningful"
    assert win_rate >= 0.52, f"win rate {win_rate:.3f} below the 0.52 target"


def test_high_win_rate_is_not_the_same_as_profit():
    """The honest caveat, asserted: a >=52% win rate does not imply beating buy&hold.

    We don't assert a specific sign (data-dependent), only that the code exposes the
    profit metrics needed to see through a flattering win rate.
    """
    cfg = Config()
    cfg.validation.train_size = 800
    cfg.validation.test_size = 400
    cfg.validation.step = 400
    df = generate_synthetic_ohlcv(n=4000, timeframe="1h", seed=7)
    ds = build_dataset(df, cfg)
    wf = walk_forward(ds, cfg)
    m = wf.backtest.metrics
    # both a flattering win rate AND the sobering risk-adjusted numbers are reported
    assert "win_rate" in m and "sharpe" in m and "total_return" in m
