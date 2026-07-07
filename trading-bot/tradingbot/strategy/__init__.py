"""Stratejiler: ML modelini kıyaslamak için temel referans (baseline) stratejiler.

ML stratejiniz örneklem dışında (maliyetler düşüldükten sonra) al-ve-tut
stratejisini geçemiyorsa, ne kadar akıllıca görünürse görünsün hiçbir üstünlüğü
yoktur. Her zaman karşılaştırın."""

from tradingbot.strategy.baselines import buy_and_hold_weights, sma_cross_weights

__all__ = ["buy_and_hold_weights", "sma_cross_weights"]
