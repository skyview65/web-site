"""Deterministik sentetik OHLCV üreteci.

*Tüm* boru hattının (özellikler -> model -> backtest -> paper döngüsü) sıfır ağ
erişimiyle çalışmasını sağlar; bu, çevrimdışı geliştirme, CI ve testler için
elzemdir. Seri kasıtlı olarak gerçeğe yakın hazırlanmıştır (drift + stokastik
volatilite + rejim geçişleri + kalın kuyruklar) ancak bu **gerçek bir piyasa
değildir**. Bir stratejiyle ilgili yalnızca sentetik verilere dayanarak asla
sonuç çıkarmayın.
"""

from __future__ import annotations

import numpy as np
import pandas as pd

_TIMEFRAME_SECONDS = {
    "1m": 60,
    "5m": 300,
    "15m": 900,
    "30m": 1800,
    "1h": 3600,
    "2h": 7200,
    "4h": 14400,
    "1d": 86400,
}


def generate_synthetic_ohlcv(
    n: int = 5000,
    timeframe: str = "1h",
    start: str = "2021-01-01",
    seed: int = 7,
    start_price: float = 30_000.0,
    momentum_phi: float = 0.55,
) -> pd.DataFrame:
    """UTC DatetimeIndex ile indekslenmiş deterministik bir OHLCV DataFrame döndürür.

    Sütunlar: ``open, high, low, close, volume``. Aynı girdiler her zaman aynı
    seriyi üretir (yeniden üretilebilir backtest'ler ve testler).
    """
    if n <= 0:
        raise ValueError("n pozitif olmalıdır")
    if timeframe not in _TIMEFRAME_SECONDS:
        raise ValueError(f"bilinmeyen zaman dilimi {timeframe!r}")

    rng = np.random.default_rng(seed)
    step = _TIMEFRAME_SECONDS[timeframe]
    bars_per_year = (365.0 * 24 * 3600) / step

    # Ortalamaya dönen (mean-reverting) stokastik volatilite; ara sıra rejim
    # sıçramaları içerir, böylece modelin genelleme yapamayacağı gerçekten farklı
    # piyasa durumları bulunur.
    base_vol = 0.38 / np.sqrt(bars_per_year)  # temel seviye; kalın kuyruklar gerçekleşen volatiliteyi ~kripto benzeri %70-90'a şişirir
    base_drift = 0.25 / bars_per_year  # ~%25 yıllıklandırılmış uzun vadeli drift (riskli varlık)

    vol = np.empty(n)
    mu = np.empty(n)
    vol[0] = base_vol
    mu[0] = base_drift
    regime = base_vol
    for i in range(1, n):
        if rng.random() < 0.002:  # nadir volatilite rejim kayması
            regime = base_vol * rng.uniform(0.5, 2.5)
        vol[i] = max(1e-6, vol[i - 1] + 0.05 * (regime - vol[i - 1]) + 0.02 * base_vol * rng.standard_normal())
        # Drift, KÜÇÜK yeniliklerle base_drift'e doğru ortalamaya döner, böylece
        # boğa/ayı fazları ılımlı ve sınırlı kalır, fiyat yolunu asla domine etmez
        # veya patlatmaz. Denge std ~= 0.5 * base_drift, yıllıklandırılmış drift'i
        # kabaca [0.1, 0.4] aralığında tutar; fiyatı asıl hareket ettiren aşağıdaki
        # kalın kuyruklu şoklardır.
        mu[i] = mu[i - 1] + 0.02 * (base_drift - mu[i - 1]) + (0.12 * base_drift) * rng.standard_normal()

    # Student-t şokları kalın kuyruklar verir (gerçek piyasalar Gauss değildir).
    shocks = rng.standard_t(df=5, size=n) * vol

    # Getiriler üzerine DURAĞAN bir AR(1) olarak enjekte edilen MOMENTUM:
    # dev[i] = phi*dev[i-1] + shock[i], böylece her getirinin işareti kısmen bir
    # önceki getiriden tahmin edilebilir. Bu, seriye gerçek, NEDENSEL, öğrenilebilir
    # bir yapı kazandırır — teknik özellikler (ret_1/ret_5/EMA/MACD) bunu tespit
    # eder, dolayısıyla modelin örneklem dışı yön doğruluğu, look-ahead sızıntısını
    # değil GERÇEK denetimli öğrenmeyi yansıtır. |phi| < 1 olduğundan süreç durağandır:
    # getiriler otokorelasyonludur ama fiyatlar asla patlamaz.
    #
    # ÖNEMLİ: gerçek likit piyasalarda saatlik/günlük ölçekte neredeyse hiç böyle
    # bir otokorelasyon yoktur — gerçek örneklem dışı doğruluğun %50 civarında
    # olmasının tam nedeni budur. Buradaki yüksek doğruluk, BU sentetik kum
    # havuzunun bir özelliğidir, canlı ticarete dair bir vaat değildir.
    phi = min(0.95, max(0.0, momentum_phi))
    log_ret = np.empty(n)
    dev = 0.0
    for i in range(n):
        dev = phi * dev + shocks[i]
        log_ret[i] = mu[i] + dev
    close = start_price * np.exp(np.cumsum(log_ret))

    # Close yolu etrafında OHLC oluştur.
    open_ = np.empty(n)
    open_[0] = start_price
    open_[1:] = close[:-1]
    intrabar = np.abs(rng.standard_normal(n)) * vol * close
    high = np.maximum(open_, close) + intrabar * rng.uniform(0.1, 1.0, n)
    low = np.minimum(open_, close) - intrabar * rng.uniform(0.1, 1.0, n)
    low = np.clip(low, 1e-8, None)

    # Hacim, mutlak getiriler ve volatiliteyle birlikte artar (aktivite kümelenir).
    vol_norm = vol / base_vol
    volume = (
        1_000.0
        * vol_norm
        * (1.0 + 3.0 * np.abs(log_ret) / (base_vol + 1e-12))
        * rng.uniform(0.5, 1.5, n)
    )

    index = pd.date_range(start=start, periods=n, freq=pd.Timedelta(seconds=step), tz="UTC")
    df = pd.DataFrame(
        {
            "open": open_,
            "high": high,
            "low": low,
            "close": close,
            "volume": volume,
        },
        index=index,
    )
    df.index.name = "timestamp"
    return df
