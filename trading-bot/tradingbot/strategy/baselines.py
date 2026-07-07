"""``target_weight`` serileri olarak referans (benchmark) stratejileri (tam long veya SMA zamanlamalı)."""

from __future__ import annotations

import pandas as pd


def buy_and_hold_weights(frame: pd.DataFrame, leverage: float = 1.0) -> pd.Series:
    """Her zaman tam yatırımda. Her aktif stratejinin aşması gereken referans çıta."""
    return pd.Series(leverage, index=frame.index, name="target_weight")


def sma_cross_weights(
    frame: pd.DataFrame, fast: int = 20, slow: int = 50, leverage: float = 1.0
) -> pd.Series:
    """Klasik trend filtresi: hızlı SMA > yavaş SMA olduğunda long, aksi halde nötr.

    ``.shift(1)`` kullanır; böylece bar t için pozisyon, bar t-1 kapanışında bilinen
    SMA'lardan belirlenir (look-ahead yoktur)."""
    close = frame["close"]
    fast_sma = close.rolling(fast).mean()
    slow_sma = close.rolling(slow).mean()
    signal = (fast_sma > slow_sma).astype(float).shift(1).fillna(0.0)
    return (signal * leverage).rename("target_weight")
