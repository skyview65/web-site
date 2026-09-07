"""Feature engineering on OHLCV bars.

Every feature at row t is computed strictly from data up to and including t
(rolling windows and recursive EWMs only) — no lookahead. All features are
scale-free ratios so the model generalizes across price levels.
"""
from __future__ import annotations

import numpy as np
import pandas as pd


def ema(series: pd.Series, span: int) -> pd.Series:
    return series.ewm(span=span, adjust=False).mean()


def rsi(close: pd.Series, period: int = 14) -> pd.Series:
    delta = close.diff()
    gain = delta.clip(lower=0.0)
    loss = -delta.clip(upper=0.0)
    avg_gain = gain.ewm(alpha=1 / period, adjust=False).mean()
    avg_loss = loss.ewm(alpha=1 / period, adjust=False).mean()
    rs = avg_gain / avg_loss.replace(0.0, np.nan)
    return (100 - 100 / (1 + rs)).fillna(50.0)


def atr(df: pd.DataFrame, period: int = 14) -> pd.Series:
    prev_close = df["close"].shift(1)
    tr = pd.concat(
        [
            df["high"] - df["low"],
            (df["high"] - prev_close).abs(),
            (df["low"] - prev_close).abs(),
        ],
        axis=1,
    ).max(axis=1)
    return tr.ewm(alpha=1 / period, adjust=False).mean()


def build_features(df: pd.DataFrame) -> tuple[pd.DataFrame, list[str]]:
    """Return (df with feature columns appended, list of feature column names)."""
    out = df.copy()
    close, high, low, open_, volume = (
        out["close"],
        out["high"],
        out["low"],
        out["open"],
        out["volume"],
    )
    log_close = np.log(close)
    ret1 = log_close.diff()

    feats: dict[str, pd.Series] = {}
    for h in (1, 3, 6, 12, 24, 48):
        feats[f"ret_{h}"] = log_close.diff(h)

    feats["rsi_14"] = rsi(close, 14) / 100.0
    feats["rsi_6"] = rsi(close, 6) / 100.0

    ema12, ema26, ema48 = ema(close, 12), ema(close, 26), ema(close, 48)
    macd = ema12 - ema26
    signal = macd.ewm(span=9, adjust=False).mean()
    feats["macd_hist"] = (macd - signal) / close
    feats["ema_12_48"] = ema12 / ema48 - 1.0

    sma20 = close.rolling(20).mean()
    std20 = close.rolling(20).std()
    feats["bb_pctb"] = ((close - (sma20 - 2 * std20)) / (4 * std20)).clip(-0.5, 1.5)
    feats["bb_width"] = (4 * std20) / sma20

    for w in (96, 384):
        feats[f"close_sma_{w}"] = close / close.rolling(w).mean() - 1.0

    atr14 = atr(out, 14)
    feats["atr_rel"] = atr14 / close
    feats["vol_24"] = ret1.rolling(24).std()
    feats["vol_72"] = ret1.rolling(72).std()
    feats["vol_ratio"] = feats["vol_24"] / feats["vol_72"].replace(0.0, np.nan)

    vol_mean = volume.rolling(48).mean()
    vol_std = volume.rolling(48).std()
    feats["volume_z"] = ((volume - vol_mean) / vol_std.replace(0.0, np.nan)).clip(-5, 5)

    bar_range = (high - low).replace(0.0, np.nan)
    feats["body"] = (close - open_) / close
    feats["upper_wick"] = (high - np.maximum(open_, close)) / bar_range
    feats["lower_wick"] = (np.minimum(open_, close) - low) / bar_range
    feats["hl_range"] = (high - low) / close

    feats["up_frac_12"] = (ret1 > 0).rolling(12).mean()
    feats["ret_skew_48"] = ret1.rolling(48).skew()

    hours = out.index.hour + out.index.minute / 60.0
    feats["hour_sin"] = pd.Series(np.sin(2 * np.pi * hours / 24.0), index=out.index)
    feats["hour_cos"] = pd.Series(np.cos(2 * np.pi * hours / 24.0), index=out.index)
    dow = out.index.dayofweek
    feats["dow_sin"] = pd.Series(np.sin(2 * np.pi * dow / 7.0), index=out.index)
    feats["dow_cos"] = pd.Series(np.cos(2 * np.pi * dow / 7.0), index=out.index)

    feature_frame = pd.DataFrame(feats, index=out.index)
    out = pd.concat([out, feature_frame], axis=1)
    out["atr"] = atr14
    return out, list(feats.keys())
