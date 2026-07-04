"""Birleşik OHLCV erişimi: önce önbellek, sonra ağ, en son sentetik yedek.

    get_ohlcv(cfg)  ->  temiz, boşluk denetimli, UTC indeksli OHLCV DataFrame

Backtest'ler bunu çağırır ve baytların nereden geldiğiyle asla ilgilenmez.
"""

from __future__ import annotations

import logging

import pandas as pd

from tradingbot.config import Config
from tradingbot.data import cache, synthetic

log = logging.getLogger(__name__)


def _clean(df: pd.DataFrame) -> pd.DataFrame:
    """Yinelenenleri at, sırala, sayısala çevir ve izole boşlukları ileri doldur.

    *Fiyat* boşluklarını ileri doldururuz (eksik bir mum son bilinen fiyatı korur)
    ancak asla hacim uydurmayız — eksik bir mum sıfır hacim alır. Hiç kullanılabilir
    fiyatı olmayan satırlar atılır.
    """
    df = df[~df.index.duplicated(keep="last")].sort_index()
    for col in ("open", "high", "low", "close", "volume"):
        if col not in df.columns:
            raise ValueError(f"OHLCV çerçevesinde {col!r} sütunu eksik")
        df[col] = pd.to_numeric(df[col], errors="coerce")
    df = df.dropna(subset=["close"])
    df["volume"] = df["volume"].fillna(0.0)
    for col in ("open", "high", "low"):
        df[col] = df[col].fillna(df["close"])
    return df


def get_ohlcv(cfg: Config, *, refresh: bool = False) -> pd.DataFrame:
    """Yapılandırılmış piyasa için OHLCV döndür.

    Tercih sırası:
      1. yerel önbellek (``refresh`` verilmediyse)
      2. ccxt üzerinden canlı indirme
      3. deterministik sentetik seri (izin verilirse) böylece çevrimdışıyken hiçbir şey engellenmez
    """
    m = cfg.market
    path = cache.cache_path(cfg.data.cache_dir, m.exchange, m.symbol, m.timeframe)

    if not refresh:
        cached = cache.load(path)
        if cached is not None and len(cached) > 0:
            log.info("%s konumundan %d önbelleklenmiş mum yüklendi", path, len(cached))
            return _clean(cached)

    # Ağı dene.
    try:
        from tradingbot.data.sources import fetch_ohlcv

        # Geçmiş OHLCV verisi mainnet genel API'sinden gelir; sandbox/testnet'ler
        # genellikle gerçek geçmişten yoksundur ve yalnızca canlı emir akışı için anlamlıdır.
        df = fetch_ohlcv(
            m.exchange,
            m.symbol,
            m.timeframe,
            m.history_days,
            sandbox=False,
        )
        df = _clean(df)
        cache.save(df, path)
        return df
    except Exception as exc:  # ağ/ccxt sorunları çevrimdışıyken beklenir
        log.warning("Canlı veri çekme başarısız oldu (%s).", exc)

    if cfg.data.allow_synthetic_fallback:
        # İstenen pencere boyunca zaman dilimi başına kabaca bir mum.
        secs = cfg.timeframe_seconds()
        n = max(2000, int(m.history_days * 86_400 / secs))
        log.warning("SENTETİK veriye geri dönülüyor (%d mum). Gerçek bir piyasa değil!", n)
        df = synthetic.generate_synthetic_ohlcv(
            n=n, timeframe=m.timeframe, seed=cfg.data.synthetic_seed
        )
        return _clean(df)

    raise RuntimeError(
        "Önbelleklenmiş veri yok, canlı veri çekme başarısız oldu ve sentetik yedek devre dışı. "
        "Çevrimiçiyken `fetch` çalıştırın veya data.allow_synthetic_fallback: true olarak ayarlayın."
    )
