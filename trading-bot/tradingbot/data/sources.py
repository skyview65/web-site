"""ccxt aracılığıyla bir borsadan geçmiş OHLCV verilerini çeker.

Bu, ağa erişen tek modüldür ve yalnızca açıkça ``fetch`` çalıştırdığınızda
erişir. Botun geri kalanının ccxt kurulu olmadan veya bağlantı olmadan
çalışabilmesi için tembel (lazy) olarak içe aktarılır.
"""

from __future__ import annotations

import logging
import time

import pandas as pd

log = logging.getLogger(__name__)

_TIMEFRAME_MS = {
    "1m": 60_000,
    "5m": 300_000,
    "15m": 900_000,
    "30m": 1_800_000,
    "1h": 3_600_000,
    "2h": 7_200_000,
    "4h": 14_400_000,
    "1d": 86_400_000,
}


def fetch_ohlcv(
    exchange: str,
    symbol: str,
    timeframe: str,
    history_days: int,
    sandbox: bool = False,
) -> pd.DataFrame:
    """``history_days`` kadar OHLCV çubuğunu ccxt üzerinden sayfalayarak indirir.

    ccxt eksikse veya ağ çağrısı başarısız olursa, çağıranların önbellek/sentetik
    veriye geri dönebilmesi için anlaşılır bir mesajla RuntimeError yükseltir.
    """
    try:
        import ccxt  # bilinçli olarak tembel (lazy) içe aktarılır
    except ImportError as exc:  # pragma: no cover - depends on environment
        raise RuntimeError(
            "ccxt kurulu değil. Canlı veri çekmek için `pip install ccxt` çalıştırın "
            "veya tamamen çevrimdışı çalışmak için data.allow_synthetic_fallback seçeneğini etkinleştirin."
        ) from exc

    if timeframe not in _TIMEFRAME_MS:
        raise ValueError(f"desteklenmeyen zaman dilimi {timeframe!r}")
    if not hasattr(ccxt, exchange):
        raise RuntimeError(f"ccxt {exchange!r} adında bir borsaya sahip değil")

    client = getattr(ccxt, exchange)({"enableRateLimit": True})
    if sandbox and getattr(client, "has", {}).get("sandbox"):
        client.set_sandbox_mode(True)

    step_ms = _TIMEFRAME_MS[timeframe]
    now_ms = client.milliseconds()
    since = now_ms - history_days * 86_400_000
    limit = 1000

    rows: list[list[float]] = []
    cursor = since
    while cursor < now_ms:
        try:
            batch = client.fetch_ohlcv(symbol, timeframe=timeframe, since=cursor, limit=limit)
        except Exception as exc:  # pragma: no cover - network dependent
            raise RuntimeError(f"ccxt veri çekme başarısız oldu: {exc}") from exc
        if not batch:
            break
        rows.extend(batch)
        last_ts = batch[-1][0]
        # Son çubuğun ötesine geç; borsa ilerlemeyi durdurursa dur.
        next_cursor = last_ts + step_ms
        if next_cursor <= cursor:
            break
        cursor = next_cursor
        if len(batch) < limit:
            break
        time.sleep((client.rateLimit or 200) / 1000.0)

    if not rows:
        raise RuntimeError("borsa hiç veri döndürmedi")

    df = pd.DataFrame(rows, columns=["timestamp", "open", "high", "low", "close", "volume"])
    df = df.drop_duplicates(subset="timestamp").sort_values("timestamp")
    df["timestamp"] = pd.to_datetime(df["timestamp"], unit="ms", utc=True)
    df = df.set_index("timestamp")
    log.info("%s borsasından %s %s için %d çubuk çekildi", exchange, symbol, timeframe, len(df))
    return df
