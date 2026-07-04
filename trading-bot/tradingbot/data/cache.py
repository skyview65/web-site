"""Backtest'lerin ağa iki kez bağımlı olmaması için disk üzerinde OHLCV önbelleği.

``pyarrow`` mevcut olduğunda Parquet'i (kompakt, tipli) tercih eder ve aksi
durumda şeffaf biçimde CSV'ye geri döner. Her şey yerel diskinizdeki
yapılandırılmış önbellek dizini altında bulunur.
"""

from __future__ import annotations

from pathlib import Path

import pandas as pd


def _has_parquet() -> bool:
    try:
        import pyarrow  # noqa: F401

        return True
    except Exception:
        return False


def _slug(exchange: str, symbol: str, timeframe: str) -> str:
    safe_symbol = symbol.replace("/", "-").replace(":", "-")
    return f"{exchange}_{safe_symbol}_{timeframe}".lower()


def cache_path(cache_dir: str | Path, exchange: str, symbol: str, timeframe: str) -> Path:
    ext = "parquet" if _has_parquet() else "csv"
    return Path(cache_dir) / f"{_slug(exchange, symbol, timeframe)}.{ext}"


def save(df: pd.DataFrame, path: str | Path) -> None:
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.suffix == ".parquet":
        df.to_parquet(path)
    else:
        df.to_csv(path, index=True)


def load(path: str | Path) -> pd.DataFrame | None:
    path = Path(path)
    if not path.exists():
        return None
    if path.suffix == ".parquet":
        df = pd.read_parquet(path)
    else:
        df = pd.read_csv(path, index_col=0, parse_dates=True)
    # Depolama gidiş-dönüşünden bağımsız olarak tz bilinçli bir UTC dizini garanti et.
    if not isinstance(df.index, pd.DatetimeIndex):
        df.index = pd.to_datetime(df.index, utc=True)
    elif df.index.tz is None:
        df.index = df.index.tz_localize("UTC")
    df.index.name = "timestamp"
    return df
