"""Yeknesak model arayüzü.

Altta hangi tahmin edici bulunursa bulunsun, botun geri kalanı yalnızca şunları
çağırır:

    model.fit(X, y)
    signal = model.predict_signal(X)   # sürekli skor, aşağıya bakınız

``predict_signal``, "yüksekken long ol" mantığıyla hizalanmış bir *yönsel kanaat*
döndürür:
  * sınıflandırıcı -> yukarı hareket olasılığı, [0, 1] aralığında (0.5 = avantaj yok)
  * regresör       -> tahmini ileri getiri, kabaca 0 etrafında ortalanmış

Strateji katmanı bu skoru bir pozisyona dönüştürürken ``min_edge`` ve risk
boyutlandırması uygular. Model çıktısını sürekli tutmak (kesin bir al/sat yerine)
stratejinin kanaati ölçeklemesine ve dilediği gibi eşiklemesine olanak tanır.
"""

from __future__ import annotations

from typing import Protocol

import pandas as pd


class Model(Protocol):
    is_classifier: bool

    def fit(self, X: pd.DataFrame, y: pd.Series) -> "Model": ...

    def predict_signal(self, X: pd.DataFrame) -> pd.Series: ...
