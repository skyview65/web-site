"""OHLCV data layer: ccxt download with pagination, parquet cache, synthetic fallback."""
from __future__ import annotations

import os
import time
from pathlib import Path

import numpy as np
import pandas as pd

from .config import DataConfig

TIMEFRAME_MS: dict[str, int] = {
    "1m": 60_000,
    "5m": 300_000,
    "15m": 900_000,
    "30m": 1_800_000,
    "1h": 3_600_000,
    "2h": 7_200_000,
    "4h": 14_400_000,
    "1d": 86_400_000,
}

OHLCV_COLUMNS = ["open", "high", "low", "close", "volume"]


def timeframe_ms(timeframe: str) -> int:
    if timeframe not in TIMEFRAME_MS:
        raise ValueError(f"Unsupported timeframe {timeframe!r}; use one of {list(TIMEFRAME_MS)}")
    return TIMEFRAME_MS[timeframe]


def bars_per_year(timeframe: str) -> float:
    return 365.0 * 86_400_000 / timeframe_ms(timeframe)


def cache_path(cfg: DataConfig, symbol: str, root: Path) -> Path:
    safe = symbol.replace("/", "-").replace(":", "_")
    directory = Path(cfg.cache_dir)
    if not directory.is_absolute():
        directory = root / directory
    directory.mkdir(parents=True, exist_ok=True)
    return directory / f"{cfg.exchange}_{safe}_{cfg.timeframe}.parquet"


def _finalize(rows: list[list[float]], timeframe: str) -> pd.DataFrame:
    df = pd.DataFrame(rows, columns=["ts", *OHLCV_COLUMNS])
    df["ts"] = pd.to_datetime(df["ts"], unit="ms", utc=True)
    df = df.drop_duplicates(subset="ts").set_index("ts").sort_index()
    # Drop the still-forming candle: its close/high/low are not final yet.
    tf = pd.Timedelta(milliseconds=timeframe_ms(timeframe))
    now = pd.Timestamp.now(tz="UTC")
    df = df[df.index + tf <= now]
    return df.astype(float)


def make_exchange(exchange_id: str, params: dict | None = None):
    """Create a ccxt exchange, honoring custom CA bundles (corporate/agent proxies).

    ccxt passes `verify and validateServerSsl` to requests, so a CA path must go
    on `validateServerSsl` (with verify=True) to survive Python's `and`.
    """
    import ccxt  # imported lazily so synthetic mode works without network deps

    exchange = getattr(ccxt, exchange_id)({"enableRateLimit": True, **(params or {})})
    ca = (
        os.environ.get("BOT_CA_BUNDLE")
        or os.environ.get("REQUESTS_CA_BUNDLE")
        or os.environ.get("SSL_CERT_FILE")
    )
    if ca:
        exchange.validateServerSsl = ca
    return exchange


def fetch_ccxt(cfg: DataConfig, symbol: str) -> pd.DataFrame:
    exchange = make_exchange(cfg.exchange)
    tf_ms = timeframe_ms(cfg.timeframe)
    since = int(time.time() * 1000) - cfg.lookback_days * 86_400_000
    rows: list[list[float]] = []
    while True:
        batch = exchange.fetch_ohlcv(symbol, cfg.timeframe, since=since, limit=1000)
        if not batch:
            break
        rows.extend(batch)
        if len(batch) < 2:
            break
        next_since = batch[-1][0] + tf_ms
        if next_since <= since:  # defensive: avoid infinite loop on odd exchanges
            break
        since = next_since
        if since > time.time() * 1000:
            break
    if not rows:
        raise RuntimeError(f"No OHLCV returned for {symbol} from {cfg.exchange}")
    return _finalize(rows, cfg.timeframe)


def synthetic_ohlcv(n_bars: int = 35_000, seed: int = 7, timeframe: str = "1h") -> pd.DataFrame:
    """Regime-switching series with volatility clustering and mild momentum.

    Used for offline demos/tests only — it deliberately contains a weak
    autocorrelation signal so the full pipeline has something to learn.
    """
    rng = np.random.default_rng(seed)
    n = n_bars
    regime = np.zeros(n, dtype=int)
    for t in range(1, n):
        regime[t] = regime[t - 1] if rng.random() > 0.002 else rng.integers(0, 3)
    drift = np.array([0.00005, -0.00004, 0.0])[regime]

    vol = np.empty(n)
    vol[0] = 0.004
    z = rng.standard_normal(n)
    rets = np.empty(n)
    rets[0] = 0.0
    for t in range(1, n):
        vol[t] = np.sqrt(0.02 * 0.004**2 + 0.10 * rets[t - 1] ** 2 + 0.88 * vol[t - 1] ** 2)
        rets[t] = drift[t] + 0.06 * rets[t - 1] + vol[t] * z[t]

    close = 30_000.0 * np.exp(np.cumsum(rets))
    open_ = np.roll(close, 1)
    open_[0] = close[0]
    span = np.abs(rets) + rng.uniform(0.0005, 0.003, n)
    high = np.maximum(open_, close) * (1 + span * rng.uniform(0.2, 0.8, n))
    low = np.minimum(open_, close) * (1 - span * rng.uniform(0.2, 0.8, n))
    volume = rng.lognormal(4.0, 0.5, n) * (1 + 8 * np.abs(rets) / (vol + 1e-9))

    end = pd.Timestamp.now(tz="UTC").floor("h")
    index = pd.date_range(end=end, periods=n, freq=pd.Timedelta(milliseconds=timeframe_ms(timeframe)))
    return pd.DataFrame(
        {"open": open_, "high": high, "low": low, "close": close, "volume": volume},
        index=pd.DatetimeIndex(index, name="ts"),
    )


def load_or_fetch(cfg: DataConfig, symbol: str, root: Path, refresh: bool = False) -> pd.DataFrame:
    if cfg.source == "synthetic":
        return synthetic_ohlcv(timeframe=cfg.timeframe)
    path = cache_path(cfg, symbol, root)
    if path.exists() and not refresh:
        return pd.read_parquet(path)
    df = fetch_ccxt(cfg, symbol)
    df.to_parquet(path)
    return df


def fetch_recent(cfg: DataConfig, symbol: str, n_bars: int = 600) -> pd.DataFrame:
    """Latest closed bars for the live/paper loop (never served from cache)."""
    if cfg.source == "synthetic":
        return synthetic_ohlcv(timeframe=cfg.timeframe).tail(n_bars)
    exchange = make_exchange(cfg.exchange)
    tf_ms = timeframe_ms(cfg.timeframe)
    since = int(time.time() * 1000) - (n_bars + 5) * tf_ms
    rows = exchange.fetch_ohlcv(symbol, cfg.timeframe, since=since, limit=1000)
    return _finalize(rows, cfg.timeframe).tail(n_bars)
