"""Vektörleştirilmiş teknik göstergeler.

Buradaki her fonksiyon **nedenseldir (causal)**: *t* barındaki değer yalnızca
*t* barının kapanışında ya da öncesinde mevcut olan bilgiyi kullanır
(``.rolling``, ``.ewm``, ``.diff`` ve *pozitif* ``.shift`` hepsi geriye doğru
bakar). Özellik kümesinden look-ahead yanlılığını uzak tutan da budur. İleriye
bakan kısım — tahmin hedefi — ``pipeline.build_labels`` içinde yer alır ve
negatif bir shift'in göründüğü tek yer orasıdır.

Ham bir gösterge durağan olmadığında (fiyat seviyesiyle birlikte büyüdüğünde),
ölçekten bağımsız bir dönüşüm döndürürüz (yüzdesel uzaklık, değer / fiyat) ki
30 bin dolarda eğitilen bir model 60 bin dolara genellenebilsin.
"""

from __future__ import annotations

import re

import numpy as np
import pandas as pd


# --------------------------------------------------------------------------- #
# İlkel göstergeler (girdi ile aynı şekilde indekslenmiş bir Series veya DataFrame döndürür)
# --------------------------------------------------------------------------- #
def log_return(close: pd.Series, n: int = 1) -> pd.Series:
    return np.log(close / close.shift(n))


def rsi(close: pd.Series, n: int = 14) -> pd.Series:
    delta = close.diff()
    gain = delta.clip(lower=0.0)
    loss = -delta.clip(upper=0.0)
    avg_gain = gain.ewm(alpha=1.0 / n, adjust=False, min_periods=n).mean()
    avg_loss = loss.ewm(alpha=1.0 / n, adjust=False, min_periods=n).mean()
    rs = avg_gain / avg_loss.replace(0.0, np.nan)
    out = 100.0 - 100.0 / (1.0 + rs)
    return out.fillna(50.0)  # henüz hareket olmadığında nötr


def macd(close: pd.Series, fast: int = 12, slow: int = 26, signal: int = 9) -> pd.DataFrame:
    ema_fast = close.ewm(span=fast, adjust=False).mean()
    ema_slow = close.ewm(span=slow, adjust=False).mean()
    line = ema_fast - ema_slow
    sig = line.ewm(span=signal, adjust=False).mean()
    hist = line - sig
    # Ölçeğin zaman içinde karşılaştırılabilir olması için fiyata göre normalleştir.
    return pd.DataFrame(
        {
            "macd": line / close,
            "macd_signal": sig / close,
            "macd_hist": hist / close,
        }
    )


def ema_distance(close: pd.Series, n: int) -> pd.Series:
    """Fiyatın kendi EMA'sına yüzdesel uzaklığı: close / EMA(n) - 1."""
    ema = close.ewm(span=n, adjust=False).mean()
    return close / ema - 1.0


def bollinger(close: pd.Series, n: int = 20, k: float = 2.0) -> pd.DataFrame:
    ma = close.rolling(n).mean()
    sd = close.rolling(n).std(ddof=0)
    upper = ma + k * sd
    lower = ma - k * sd
    width = (upper - lower).replace(0.0, np.nan)
    pct_b = (close - lower) / width
    bandwidth = (upper - lower) / ma
    return pd.DataFrame({f"bb_{n}_pctb": pct_b, f"bb_{n}_bw": bandwidth})


def true_range(high: pd.Series, low: pd.Series, close: pd.Series) -> pd.Series:
    prev_close = close.shift(1)
    tr = pd.concat(
        [(high - low), (high - prev_close).abs(), (low - prev_close).abs()], axis=1
    ).max(axis=1)
    return tr


def atr(high: pd.Series, low: pd.Series, close: pd.Series, n: int = 14) -> pd.Series:
    """*Fiyat birimleri* cinsinden Average True Range (Wilder yumuşatması)."""
    tr = true_range(high, low, close)
    return tr.ewm(alpha=1.0 / n, adjust=False, min_periods=n).mean()


def rolling_vol(close: pd.Series, n: int = 20) -> pd.Series:
    """Hareketli gerçekleşen volatilite = n bar üzerindeki 1-barlık log getirilerinin std'si."""
    return log_return(close, 1).rolling(n).std(ddof=0)


def volume_zscore(volume: pd.Series, n: int = 20) -> pd.Series:
    mean = volume.rolling(n).mean()
    std = volume.rolling(n).std(ddof=0).replace(0.0, np.nan)
    return (volume - mean) / std


# --------------------------------------------------------------------------- #
# İsim tabanlı yönlendirme (config, "rsi_14", "ema_50", "macd" gibi isimler listeler)
# --------------------------------------------------------------------------- #
def compute(df: pd.DataFrame, name: str) -> pd.DataFrame:
    """İsimlendirilmiş tek bir göstergeyi hesapla; bir veya daha fazla sütunlu bir DataFrame döndür.

    Desteklenen isimler:
      rsi_<n>, ema_<n>, bb_<n>, atr_<n>, ret_<n>, vol_<n>, volume_z_<n>, macd
    """
    close, high, low, volume = df["close"], df["high"], df["low"], df["volume"]

    if name == "macd":
        return macd(close)

    m = re.fullmatch(r"([a-z_]+?)_(\d+)", name)
    if not m:
        raise ValueError(f"tanınmayan gösterge adı: {name!r}")
    kind, n = m.group(1), int(m.group(2))

    if kind == "rsi":
        return rsi(close, n).to_frame(name)
    if kind == "ema":
        return ema_distance(close, n).to_frame(name)
    if kind == "bb":
        return bollinger(close, n)
    if kind == "atr":
        # özellik, fiyatın bir kesri olarak ATR'dir (ölçekten bağımsız)
        return (atr(high, low, close, n) / close).to_frame(name)
    if kind == "ret":
        return log_return(close, n).to_frame(name)
    if kind == "vol":
        return rolling_vol(close, n).to_frame(name)
    if kind == "volume_z":
        return volume_zscore(volume, n).to_frame(name)

    raise ValueError(f"tanınmayan gösterge adı: {name!r}")
