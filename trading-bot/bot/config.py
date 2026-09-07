"""Configuration loading: config.yaml merged over dataclass defaults."""
from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import yaml


@dataclass
class DataConfig:
    source: str = "ccxt"  # ccxt | synthetic
    exchange: str = "binance"
    symbols: list[str] = field(default_factory=lambda: ["BTC/USDT"])
    timeframe: str = "1h"
    lookback_days: int = 1460
    cache_dir: str = "data"


@dataclass
class LabelConfig:
    atr_period: int = 14
    tp_atr: float = 2.0
    sl_atr: float = 1.5
    max_holding: int = 24


@dataclass
class ModelConfig:
    seeds: list[int] = field(default_factory=lambda: [7, 42, 2024])
    n_splits: int = 6
    embargo: int = 48
    min_train_bars: int = 3000
    threshold: float = 0.60
    auto_threshold: bool = True
    lgbm: dict[str, Any] = field(
        default_factory=lambda: {
            "n_estimators": 800,
            "learning_rate": 0.03,
            "num_leaves": 31,
            "min_child_samples": 60,
            "subsample": 0.8,
            "subsample_freq": 1,
            "colsample_bytree": 0.8,
            "reg_alpha": 0.1,
            "reg_lambda": 1.0,
            "class_weight": "balanced",
            "verbosity": -1,
        }
    )


@dataclass
class BacktestConfig:
    fee_bps: float = 10.0
    slippage_bps: float = 5.0
    initial_cash: float = 10_000.0


@dataclass
class RiskConfig:
    risk_per_trade: float = 0.01
    max_position_pct: float = 0.25
    max_drawdown_pct: float = 0.20
    daily_loss_limit_pct: float = 0.05


@dataclass
class BotConfig:
    data: DataConfig = field(default_factory=DataConfig)
    labels: LabelConfig = field(default_factory=LabelConfig)
    model: ModelConfig = field(default_factory=ModelConfig)
    backtest: BacktestConfig = field(default_factory=BacktestConfig)
    risk: RiskConfig = field(default_factory=RiskConfig)
    models_dir: str = "models"
    state_dir: str = "state"
    root: Path = field(default_factory=Path.cwd)

    def path(self, name: str) -> Path:
        p = Path(name)
        return p if p.is_absolute() else self.root / p


def _merge(dc: Any, values: dict[str, Any] | None) -> Any:
    if not values:
        return dc
    for key, value in values.items():
        if not hasattr(dc, key):
            raise KeyError(f"Unknown config key: {key!r} in {type(dc).__name__}")
        current = getattr(dc, key)
        if isinstance(current, dict) and isinstance(value, dict):
            current.update(value)
        else:
            setattr(dc, key, value)
    return dc


def load_config(path: str | Path = "config.yaml") -> BotConfig:
    path = Path(path).resolve()
    raw: dict[str, Any] = {}
    if path.exists():
        raw = yaml.safe_load(path.read_text()) or {}
    cfg = BotConfig(root=path.parent)
    _merge(cfg.data, raw.get("data"))
    _merge(cfg.labels, raw.get("labels"))
    _merge(cfg.model, raw.get("model"))
    _merge(cfg.backtest, raw.get("backtest"))
    _merge(cfg.risk, raw.get("risk"))
    cfg.models_dir = raw.get("models_dir", cfg.models_dir)
    cfg.state_dir = raw.get("state_dir", cfg.state_dir)
    return cfg
