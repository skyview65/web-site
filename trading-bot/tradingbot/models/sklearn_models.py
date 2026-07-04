"""Ortak :class:`Model` arayüzünü kullanan scikit-learn tabanlı modeller.

Varsayılan olarak HistGradientBoosting kullanır — scikit-learn ile birlikte
gelen güçlü bir gradient-booster'dır (derlenecek yerel bir kütüphane
gerektirmez) ve teknik özelliklerin gürültülü, doğrusal olmayan, tablosal
yapısını iyi ele alır. Bir logistic-regression temel modeli de dahil edilmiştir,
çünkü *her zaman basit bir doğrusal modelle karşılaştırma yapmalısınız*: eğer
gösterişli model örneklem dışında (out-of-sample) onu geçemiyorsa, yalnızca aşırı
uyum (overfitting) yapıyordur.
"""

from __future__ import annotations

from typing import Any

import numpy as np
import pandas as pd
from sklearn.ensemble import (
    HistGradientBoostingClassifier,
    HistGradientBoostingRegressor,
)
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler


class SklearnClassifier:
    """Olasılıksal bir sklearn sınıflandırıcısını sarmalar; sinyal = P(yükseliş)."""

    is_classifier = True

    def __init__(self, estimator: Any):
        self._est = estimator
        self._fitted = False
        self._up_col: int | None = None

    def fit(self, X: pd.DataFrame, y: pd.Series) -> "SklearnClassifier":
        self._est.fit(X.to_numpy(), y.to_numpy())
        classes = list(self._est.classes_)
        # Her zaman doğru sütunu okumak için "yükseliş" sınıfını (etiket 1.0) bul.
        self._up_col = classes.index(1.0) if 1.0 in classes else len(classes) - 1
        self._fitted = True
        return self

    def predict_signal(self, X: pd.DataFrame) -> pd.Series:
        if not self._fitted:
            raise RuntimeError("model eğitilmemiş")
        proba = self._est.predict_proba(X.to_numpy())
        if proba.shape[1] == 1:
            # Bozuk durum: eğitim sırasında yalnızca tek bir sınıf görüldü.
            p_up = np.full(len(X), float(self._est.classes_[0] == 1.0))
        else:
            p_up = proba[:, self._up_col]
        return pd.Series(p_up, index=X.index, name="signal")


class SklearnRegressor:
    """Bir sklearn regresyon modelini sarmalar; sinyal = öngörülen ileri getiri."""

    is_classifier = False

    def __init__(self, estimator: Any):
        self._est = estimator
        self._fitted = False

    def fit(self, X: pd.DataFrame, y: pd.Series) -> "SklearnRegressor":
        self._est.fit(X.to_numpy(), y.to_numpy())
        self._fitted = True
        return self

    def predict_signal(self, X: pd.DataFrame) -> pd.Series:
        if not self._fitted:
            raise RuntimeError("model eğitilmemiş")
        pred = self._est.predict(X.to_numpy())
        return pd.Series(pred, index=X.index, name="signal")


def make_hgb(is_classifier: bool, params: dict[str, Any]):
    defaults = dict(
        max_iter=params.get("max_iter", 300),
        learning_rate=params.get("learning_rate", 0.05),
        max_depth=params.get("max_depth", 3),
        l2_regularization=params.get("l2_regularization", 1.0),
        early_stopping=params.get("early_stopping", False),
        random_state=params.get("random_state", 0),
    )
    if is_classifier:
        return SklearnClassifier(HistGradientBoostingClassifier(**defaults))
    return SklearnRegressor(HistGradientBoostingRegressor(**defaults))


def make_logistic(is_classifier: bool, params: dict[str, Any]):
    if not is_classifier:
        # Regresyon görevi için doğrusal bir regresyon temel modeli.
        from sklearn.linear_model import Ridge

        pipe = Pipeline(
            [("scale", StandardScaler()), ("model", Ridge(alpha=params.get("alpha", 1.0)))]
        )
        return SklearnRegressor(pipe)
    pipe = Pipeline(
        [
            ("scale", StandardScaler()),
            (
                "model",
                LogisticRegression(
                    C=params.get("C", 1.0),
                    max_iter=params.get("max_iter", 1000),
                    class_weight=params.get("class_weight", None),
                ),
            ),
        ]
    )
    return SklearnClassifier(pipe)


def make_lightgbm(is_classifier: bool, params: dict[str, Any]):
    try:
        import lightgbm as lgb
    except ImportError as exc:  # pragma: no cover - optional dependency
        raise RuntimeError(
            "model.kind 'lightgbm' olarak ayarlı ancak lightgbm yüklü değil. "
            "`pip install lightgbm` komutunu çalıştırın veya model.kind değerini 'hgb' yapın."
        ) from exc
    common = dict(
        n_estimators=params.get("max_iter", 300),
        learning_rate=params.get("learning_rate", 0.05),
        max_depth=params.get("max_depth", 3),
        reg_lambda=params.get("l2_regularization", 1.0),
        random_state=params.get("random_state", 0),
        verbosity=-1,
    )
    if is_classifier:
        return SklearnClassifier(lgb.LGBMClassifier(**common))
    return SklearnRegressor(lgb.LGBMRegressor(**common))
