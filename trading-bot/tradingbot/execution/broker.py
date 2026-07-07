"""Kağıt üzerinde alım-satım için simüle edilmiş aracı kurum — ücret ve slippage ile gerçekçi doldurmalar."""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class Portfolio:
    cash: float
    units: float = 0.0            # tutulan temel varlığın işaretli birimleri
    fee_bps: float = 10.0
    slippage_bps: float = 5.0
    trade_log: list[dict] = field(default_factory=list)

    def equity(self, price: float) -> float:
        return self.cash + self.units * price

    def target_units(self, price: float, target_weight: float) -> float:
        """Bir hedef ağırlığın (mevcut *özkaynağın* bir kesri) ima ettiği birimler."""
        eq = self.equity(price)
        return (target_weight * eq) / price if price > 0 else 0.0

    def rebalance(self, price: float, target_weight: float, ts=None) -> dict | None:
        """``target_weight`` yönünde işlem yap; işlem gören nominal tutar üzerinden maliyet uygula."""
        desired_units = self.target_units(price, target_weight)
        delta = desired_units - self.units
        if abs(delta) * price < 1e-9:
            return None
        cost_rate = (self.fee_bps + self.slippage_bps) / 1e4
        # Slippage, doldurma fiyatını işlem yönünde kötüleştirir.
        fill_price = price * (1 + (self.slippage_bps / 1e4) * (1 if delta > 0 else -1))
        notional = abs(delta) * fill_price
        fee = notional * (self.fee_bps / 1e4)
        self.cash -= delta * fill_price + fee
        self.units += delta
        entry = {
            "ts": str(ts) if ts is not None else None,
            "side": "buy" if delta > 0 else "sell",
            "units": delta,
            "price": fill_price,
            "fee": fee,
            "target_weight": target_weight,
            "equity": self.equity(price),
        }
        self.trade_log.append(entry)
        return entry
