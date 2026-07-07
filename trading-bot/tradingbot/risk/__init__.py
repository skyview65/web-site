"""Risk yönetimi: ham bir model sinyalini *boyutlandırılmış* bir hedef ağırlığa
dönüştürür ve katı limitleri (stoplar, günlük zarar, drawdown devre kesici) uygular."""

from tradingbot.risk.sizing import target_weights

__all__ = ["target_weights"]
