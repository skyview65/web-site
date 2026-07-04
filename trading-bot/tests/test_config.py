"""Yapılandırma yükleme ve doğrulama."""

import pytest

from tradingbot.config import Config, load_config


def test_defaults_are_valid():
    cfg = Config()
    cfg.validate()  # must not raise
    assert cfg.market.timeframe == "1h"
    assert cfg.execution.mode == "paper"
    assert cfg.execution.live.enabled is False  # safety default


def test_invalid_timeframe_rejected():
    cfg = Config()
    cfg.market.timeframe = "7h"
    with pytest.raises(ValueError):
        cfg.validate()


def test_invalid_leverage_rejected():
    cfg = Config()
    cfg.risk.max_leverage = 0.0
    with pytest.raises(ValueError):
        cfg.validate()


def test_load_from_yaml(tmp_path):
    p = tmp_path / "c.yaml"
    p.write_text(
        "market:\n  symbol: ETH/USDT\n  timeframe: 4h\n"
        "risk:\n  max_leverage: 2.0\n  allow_short: true\n"
    )
    cfg = load_config(p)
    assert cfg.market.symbol == "ETH/USDT"
    assert cfg.market.timeframe == "4h"
    assert cfg.risk.max_leverage == 2.0
    assert cfg.risk.allow_short is True
    # untouched fields keep defaults
    assert cfg.backtest.initial_cash == 10_000.0


def test_bars_per_year():
    cfg = Config()
    cfg.market.timeframe = "1h"
    assert abs(cfg.bars_per_year() - 24 * 365) < 1e-6
