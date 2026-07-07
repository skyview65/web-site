"""Pozisyon boyutlandırma: sinyal -> işaretli hedef ağırlık (özkaynağın oranı).

Çıktı ağırlığı, özkaynağın ne kadarının uzun (+) veya kısa (-) tutulacağını ifade
eder. Her zaman ``[-max_leverage, +max_leverage]`` aralığına (kısa pozisyon devre
dışıysa ``[0, max_leverage]`` aralığına) sınırlandırılır. Boyutlandırma bilinçli
olarak muhafazakârdır: bu katmanın tüm amacı yanılmaya rağmen ayakta kalmaktır ki
sık sık yanılacaksınız.

Üç şema:
  * vol_target     — maruziyeti son dönem volatilitesiyle ters orantılı olarak
                     ölçeklendirir; böylece bar başına risk ``target_vol_annual``
                     seviyesine yakın kalır. Sağlam varsayılan.
  * fixed_fraction — ATR stop'una takılmak yaklaşık ``risk_per_trade`` kadar
                     özkaynak kaybettirecek şekilde boyutlandırır.
  * kelly          — modelin avantajından türetilen kesirli Kelly, sert tavanlı.
"""

from __future__ import annotations

import numpy as np
import pandas as pd

from tradingbot.config import Config


def _direction_and_conviction(
    signal: pd.Series, is_classifier: bool, min_edge: float, vol_bar: pd.Series
) -> tuple[pd.Series, pd.Series]:
    """Ham bir sinyali işaretli bir yön {-1,0,+1} ve inanç [0,1] değerine eşler.

    Pozisyon yalnızca avantaj ``min_edge`` seviyesini aştığında alınır (ölü bölge).
    Botun karar sınırı etrafındaki gürültüde durmadan alım satım yapmasını
    engelleyen şey budur.
    """
    if is_classifier:
        edge = signal - 0.5  # P(yukarı) - 0.5
        direction = np.sign(edge).where(edge.abs() >= min_edge, 0.0)
        conviction = (edge.abs() / 0.5).clip(0.0, 1.0)
    else:
        # regresyon: sinyal, tahmin edilen bir getiridir
        direction = np.sign(signal).where(signal.abs() >= min_edge, 0.0)
        scale = (2.0 * vol_bar).replace(0.0, np.nan)
        conviction = (signal.abs() / scale).clip(0.0, 1.0).fillna(0.0)
    return direction.astype(float), conviction.astype(float)


def target_weights(
    frame: pd.DataFrame, signal: pd.Series, cfg: Config, is_classifier: bool
) -> pd.Series:
    """Bar başına vektörleştirilmiş işaretli hedef ağırlık (devre kesici öncesi).

    ``frame`` mutlaka ``atr`` (fiyat birimi) ve ``close`` içermelidir. Volatilite,
    varsa ``vol_20`` özelliğinden okunur, aksi halde ATR'den türetilir. Backtest /
    canlı motor, bunun üzerine stop-loss ve devre kesicileri bindirir.
    """
    r = cfg.risk
    close = frame["close"]
    atr_frac = (frame["atr"] / close).clip(lower=1e-6)

    # Bar başına volatilite tahmini.
    if "vol_20" in frame.columns:
        vol_bar = frame["vol_20"].clip(lower=1e-6)
    else:
        vol_bar = atr_frac.clip(lower=1e-6)

    direction, conviction = _direction_and_conviction(
        signal, is_classifier, cfg.model.min_edge, vol_bar
    )

    if r.sizing == "vol_target":
        target_vol_bar = r.target_vol_annual / np.sqrt(cfg.bars_per_year())
        lever = (target_vol_bar / vol_bar).clip(upper=r.max_leverage)
        weight = direction * conviction * lever

    elif r.sizing == "fixed_fraction":
        stop_dist = (r.stop_loss_atr * atr_frac) if r.stop_loss_atr > 0 else vol_bar
        stop_dist = stop_dist.clip(lower=1e-6)
        lever = (r.risk_per_trade / stop_dist).clip(upper=r.max_leverage)
        weight = direction * conviction * lever

    elif r.sizing == "kelly":
        if is_classifier:
            # Eşit oranlı ikili Kelly f* = 2p - 1 = 2 * edge.
            edge = (signal - 0.5).clip(-0.5, 0.5)
            weight = (r.kelly_fraction * 2.0 * edge)
            weight = weight.where(edge.abs() >= cfg.model.min_edge, 0.0)
        else:
            # Sürekli Kelly ~ bar başına mu / sigma^2, tahmin edilen getiri kullanılarak.
            kelly = signal / (vol_bar**2).replace(0.0, np.nan)
            weight = (r.kelly_fraction * kelly).fillna(0.0)
            weight = weight.where(signal.abs() >= cfg.model.min_edge, 0.0)
        weight = weight.clip(-r.max_leverage, r.max_leverage)

    else:  # pragma: no cover - üst katmanda doğrulanır
        raise ValueError(f"bilinmeyen boyutlandırma {r.sizing!r}")

    if not r.allow_short:
        weight = weight.clip(lower=0.0)
    weight = weight.clip(-r.max_leverage, r.max_leverage)
    return weight.fillna(0.0).rename("target_weight")
