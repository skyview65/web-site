"""Yapılandırmadan bir model oluşturur (``model.kind`` + ``model.params``)."""

from __future__ import annotations

from tradingbot.config import Config
from tradingbot.models import sklearn_models as sk


def build_model(cfg: Config):
    """cfg ile eşleşen, henüz eğitilmemiş bir model döndürür. Sınıflandırıcı mı
    yoksa regresör mü olacağı etiket türünden türetilir; böylece ikisi her zaman
    tutarlı olur."""
    is_classifier = cfg.features.label.kind == "direction"
    kind = cfg.model.kind
    params = dict(cfg.model.params or {})

    if kind == "hgb":
        return sk.make_hgb(is_classifier, params)
    if kind == "logistic":
        return sk.make_logistic(is_classifier, params)
    if kind == "lightgbm":
        return sk.make_lightgbm(is_classifier, params)
    raise ValueError(f"bilinmeyen model.kind {kind!r}")
