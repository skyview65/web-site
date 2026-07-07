"""YAML dosyasından yüklenen tip güvenli yapılandırma.

Botun sunduğu her ayar burada bir dataclass olarak yer alır; böylece kod tabanının
geri kalanı sözlük içinde el yordamıyla gezmek yerine otomatik tamamlama ve doğrulama
kazanır. Yükleme toleranslıdır: YAML'de atlanan herhangi bir alan makul bir varsayılana
geri döner.
"""

from __future__ import annotations

import os
from dataclasses import dataclass, field, fields, is_dataclass
from pathlib import Path
from typing import Any, get_type_hints

import yaml


# --------------------------------------------------------------------------- #
# Alt yapılandırmalar
# --------------------------------------------------------------------------- #
@dataclass
class MarketConfig:
    exchange: str = "binance"
    symbol: str = "BTC/USDT"
    timeframe: str = "1h"
    history_days: int = 720


@dataclass
class DataConfig:
    cache_dir: str = "data/cache"
    allow_synthetic_fallback: bool = True
    synthetic_seed: int = 7


@dataclass
class LabelConfig:
    kind: str = "direction"  # "direction" | "return" (yön | getiri)
    horizon: int = 1
    neutral_atr_mult: float = 0.0


@dataclass
class FeaturesConfig:
    indicators: list[str] = field(
        default_factory=lambda: [
            "rsi_14",
            "macd",
            "ema_12",
            "ema_26",
            "ema_50",
            "bb_20",
            "atr_14",
            "ret_1",
            "ret_5",
            "vol_20",
            "volume_z_20",
        ]
    )
    label: LabelConfig = field(default_factory=LabelConfig)


@dataclass
class ModelConfig:
    kind: str = "hgb"  # "hgb" | "logistic" | "lightgbm"
    params: dict[str, Any] = field(default_factory=dict)
    min_edge: float = 0.05


@dataclass
class BacktestConfig:
    initial_cash: float = 10_000.0
    fee_bps: float = 10.0
    slippage_bps: float = 5.0


@dataclass
class ValidationConfig:
    scheme: str = "walkforward"
    train_size: int = 2000
    test_size: int = 500
    step: int = 500
    expanding: bool = True
    embargo: int = 24


@dataclass
class RiskConfig:
    sizing: str = "vol_target"  # "fixed_fraction" | "vol_target" | "kelly"
    risk_per_trade: float = 0.02
    target_vol_annual: float = 0.20
    kelly_fraction: float = 0.25
    max_leverage: float = 1.0
    allow_short: bool = False  # spot borsalar açığa satış yapamaz; marj yoksa False bırakın
    # Varsayılanlar "yüksek kazanç oranı" modunda gelir (asimetrik çıkışlar + hold_to_exit):
    # dar bir take-profit çok sayıda küçük kazancı hanesine yazarken, geniş bir stop
    # kayıpları daha seyrek ama daha büyük yapar. Bu, işlem başına kazanç oranını
    # güvenilir biçimde %52'nin epey üzerinde üretir.
    # ÖNEMLİ: yüksek bir kazanç oranı KÂR demek DEĞİLDİR. Avantajı olmayan bir sinyalde
    # bu yine de buy-and-hold'a kaybeder — nötr, kâr açısından dürüst yapılandırma için
    # take_profit_atr=0 ve hold_to_exit=false ayarlayın.
    stop_loss_atr: float = 6.0
    take_profit_atr: float = 2.0
    hold_to_exit: bool = True
    max_daily_loss: float = 0.05
    max_drawdown_halt: float = 0.25


@dataclass
class LiveConfig:
    enabled: bool = False
    require_confirmation: bool = True
    use_sandbox: bool = True
    dry_run: bool = True  # amaçlanan emirleri göndermeden loglar; işlem yapmak için false yapın
    max_order_notional: float = 100.0  # emir başına katı güvenlik üst sınırı (kotasyon para biriminde)
    api_key_env: str = "TRADINGBOT_API_KEY"
    api_secret_env: str = "TRADINGBOT_API_SECRET"

    def credentials(self) -> tuple[str | None, str | None]:
        """API kimlik bilgilerini ortamdan okur (asla diskten değil)."""
        return os.environ.get(self.api_key_env), os.environ.get(self.api_secret_env)


@dataclass
class ExecutionConfig:
    mode: str = "paper"  # "paper" | "live" (kağıt | canlı)
    poll_seconds: int = 60
    live: LiveConfig = field(default_factory=LiveConfig)


@dataclass
class LoggingConfig:
    level: str = "INFO"
    dir: str = "runs"


@dataclass
class Config:
    market: MarketConfig = field(default_factory=MarketConfig)
    data: DataConfig = field(default_factory=DataConfig)
    features: FeaturesConfig = field(default_factory=FeaturesConfig)
    model: ModelConfig = field(default_factory=ModelConfig)
    backtest: BacktestConfig = field(default_factory=BacktestConfig)
    validation: ValidationConfig = field(default_factory=ValidationConfig)
    risk: RiskConfig = field(default_factory=RiskConfig)
    execution: ExecutionConfig = field(default_factory=ExecutionConfig)
    logging: LoggingConfig = field(default_factory=LoggingConfig)

    # -- doğrulama ---------------------------------------------------------- #
    def validate(self) -> None:
        """Anlamsız değerler sessizce zarar vermeden önce hızla hata verir."""
        errors: list[str] = []

        if self.market.timeframe not in _TIMEFRAME_SECONDS:
            errors.append(
                f"market.timeframe {self.market.timeframe!r} şunlardan biri değil: "
                f"{sorted(_TIMEFRAME_SECONDS)}"
            )
        if self.features.label.kind not in ("direction", "return"):
            errors.append("features.label.kind 'direction' veya 'return' olmalıdır")
        if self.model.kind not in ("hgb", "logistic", "lightgbm"):
            errors.append("model.kind 'hgb', 'logistic' veya 'lightgbm' olmalıdır")
        if self.risk.sizing not in ("fixed_fraction", "vol_target", "kelly"):
            errors.append(
                "risk.sizing 'fixed_fraction', 'vol_target' veya 'kelly' olmalıdır"
            )
        if self.execution.mode not in ("paper", "live"):
            errors.append("execution.mode 'paper' veya 'live' olmalıdır")
        if not 0 < self.risk.max_leverage <= 10:
            errors.append("risk.max_leverage (0, 10] aralığında olmalıdır")
        if self.backtest.fee_bps < 0 or self.backtest.slippage_bps < 0:
            errors.append("ücretler/kayma negatif olmamalıdır")
        if self.validation.embargo < 0:
            errors.append("validation.embargo >= 0 olmalıdır")
        if self.validation.train_size <= 0 or self.validation.test_size <= 0:
            errors.append("validation train_size/test_size > 0 olmalıdır")

        if errors:
            raise ValueError("Geçersiz yapılandırma:\n  - " + "\n  - ".join(errors))

    def timeframe_seconds(self) -> int:
        return _TIMEFRAME_SECONDS[self.market.timeframe]

    def bars_per_year(self) -> float:
        """Bir takvim yılındaki bar sayısı — getirileri/volatiliteyi yıllıklandırmak için kullanılır."""
        return (365.0 * 24 * 3600) / self.timeframe_seconds()


_TIMEFRAME_SECONDS: dict[str, int] = {
    "1m": 60,
    "5m": 300,
    "15m": 900,
    "30m": 1800,
    "1h": 3600,
    "2h": 7200,
    "4h": 14400,
    "1d": 86400,
}


# --------------------------------------------------------------------------- #
# Yükleme
# --------------------------------------------------------------------------- #
def _from_dict(cls: type, data: Any) -> Any:
    """Düz bir dict'ten (muhtemelen iç içe) bir dataclass'ı özyinelemeli olarak oluşturur.

    Bilinmeyen anahtarlar yok sayılır; böylece daha yeni bir yapılandırma dosyası daha
    eski bir botu asla çökertmez; eksik anahtarlar dataclass varsayılanına geri döner.
    İç içe dataclass'lar ``get_type_hints`` aracılığıyla çözümlenir; böylece bu, ``field.type``
    değerinin bir dize olduğu ``from __future__ import annotations`` altında bile çalışır.
    """
    if not is_dataclass(cls) or not isinstance(data, dict):
        return data
    hints = get_type_hints(cls)
    kwargs: dict[str, Any] = {}
    for f in fields(cls):
        if f.name not in data:
            continue
        ftype = hints.get(f.name, f.type)
        value = data[f.name]
        if isinstance(ftype, type) and is_dataclass(ftype) and isinstance(value, dict):
            kwargs[f.name] = _from_dict(ftype, value)
        else:
            kwargs[f.name] = value
    return cls(**kwargs)


def load_config(path: str | Path | None) -> Config:
    """YAML'den bir Config yükler. Yol verilmezse (veya dosya yoksa) varsayılanları döndürür."""
    if path is None:
        cfg = Config()
        cfg.validate()
        return cfg
    p = Path(path)
    if not p.exists():
        raise FileNotFoundError(f"Yapılandırma dosyası bulunamadı: {p}")
    with p.open("r", encoding="utf-8") as fh:
        raw = yaml.safe_load(fh) or {}
    cfg = _from_dict(Config, raw)
    cfg.validate()
    return cfg
