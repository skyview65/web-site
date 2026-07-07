"""Ham OHLCV verisinden modele hazır bir veri kümesi oluşturur.

    build_dataset(df, cfg)  ->  Dataset(frame, feature_cols, label_kind, ...)

Çıktı olan ``frame`` tamamen hizalanmıştır ve NaN içermez: ısınma satırları (en
uzun gösterge penceresi tanımlanmadan önceki satırlar) ve son ``horizon`` satırı
(geleceği bilinmeyen satırlar) atılır. Öznitelikler nedenseldir (causal); etiket,
negatif bir kaydırma ile üretilen ve X'ten açıkça ayrılan *tek* ileriye dönük
(forward-looking) sütundur.
"""

from __future__ import annotations

from dataclasses import dataclass

import numpy as np
import pandas as pd

from tradingbot.config import Config
from tradingbot.features import indicators


@dataclass
class Dataset:
    frame: pd.DataFrame          # temiz, hizalanmış: OHLCV + öznitelikler + atr + y (+ fwd_ret)
    feature_cols: list[str]      # X sütun adları
    label_kind: str              # "direction" | "return"
    horizon: int

    @property
    def X(self) -> pd.DataFrame:
        return self.frame[self.feature_cols]

    @property
    def y(self) -> pd.Series:
        return self.frame["y"]

    def __len__(self) -> int:
        return len(self.frame)


def build_features(df: pd.DataFrame, cfg: Config) -> tuple[pd.DataFrame, list[str]]:
    """(features_df, feature_cols) döndürür. Ayrıca, risk/backtest katmanı
    tarafından stoplar ve vol-targeting için kullanılan, fiyat birimindeki
    ``atr`` sütununu da her zaman içerir."""
    parts: list[pd.DataFrame] = []
    for name in cfg.features.indicators:
        parts.append(indicators.compute(df, name))
    feat = pd.concat(parts, axis=1)
    feature_cols = list(feat.columns)

    # Risk boyutlandırma / stop-loss için fiyat birimindeki kanonik ATR (öznitelik değildir).
    atr_price = indicators.atr(df["high"], df["low"], df["close"], 14)
    feat["atr"] = atr_price
    return feat, feature_cols


def build_labels(df: pd.DataFrame, cfg: Config) -> pd.Series:
    """İleriye dönük hedef. Geleceğe kaydırma yaptığımız TEK yer burasıdır.

    direction: ``horizon`` bar boyunca ileri getiri pozitifse (veya ATR birimleriyle
               ifade edilen nötr bandın dışındaysa) 1, negatifse 0. Nötr bandın
               içindeki barlar NaN alır ve eğitimden hariç tutulur.
    return:    ham ileri getiri (regresyon hedefi).
    """
    lab = cfg.features.label
    close = df["close"]
    fwd_ret = close.shift(-lab.horizon) / close - 1.0

    if lab.kind == "return":
        return fwd_ret.rename("y")

    if lab.neutral_atr_mult > 0:
        atr_frac = indicators.atr(df["high"], df["low"], close, 14) / close
        thr = lab.neutral_atr_mult * atr_frac
        y = pd.Series(np.nan, index=df.index, name="y")
        y[fwd_ret > thr] = 1.0
        y[fwd_ret < -thr] = 0.0
        return y

    # NaN ileri getiri (son `horizon` bar) NaN OLARAK KALMALIDIR — aksi halde
    # "bilinmeyen gelecek" satırları sahte bir 0 etiketi alır ve eğitime sızar.
    return fwd_ret.gt(0).astype(float).where(fwd_ret.notna()).rename("y")


def build_dataset(df: pd.DataFrame, cfg: Config) -> Dataset:
    feat, feature_cols = build_features(df, cfg)
    y = build_labels(df, cfg)
    fwd_ret = df["close"].shift(-cfg.features.label.horizon) / df["close"] - 1.0

    frame = pd.concat(
        [
            df[["open", "high", "low", "close", "volume"]],
            feat,
            fwd_ret.rename("fwd_ret"),
            y,
        ],
        axis=1,
    )
    # Isınma satırlarını (öznitelik NaN'leri) ve tanımsız-gelecek satırlarını (etiket NaN) at.
    needed = feature_cols + ["atr", "y"]
    frame = frame.dropna(subset=needed)

    if frame.empty:
        raise ValueError(
            "Öznitelik/etiket hizalamasından sonra kullanılabilir satır kalmadı. "
            "Seçilen gösterge pencereleri için muhtemelen çok az bar var."
        )
    return Dataset(
        frame=frame,
        feature_cols=feature_cols,
        label_kind=cfg.features.label.kind,
        horizon=cfg.features.label.horizon,
    )
