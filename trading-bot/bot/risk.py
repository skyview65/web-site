"""Position sizing and capital-protection kill switch."""
from __future__ import annotations

from dataclasses import dataclass, field

import pandas as pd

from .config import RiskConfig


def position_size(
    equity: float,
    cash: float,
    entry_price: float,
    stop_price: float,
    cfg: RiskConfig,
    fee_bps: float = 0.0,
) -> float:
    """Fixed-fractional sizing: risk `risk_per_trade` of equity between entry and stop,
    capped by `max_position_pct` and by available cash."""
    per_unit_risk = entry_price - stop_price
    if per_unit_risk <= 0 or entry_price <= 0 or equity <= 0:
        return 0.0
    qty = (equity * cfg.risk_per_trade) / per_unit_risk
    qty = min(qty, equity * cfg.max_position_pct / entry_price)
    qty = min(qty, cash / (entry_price * (1 + fee_bps / 10_000)))
    return max(qty, 0.0)


@dataclass
class KillSwitch:
    """Halts new entries after a max-drawdown breach or daily loss limit."""

    max_drawdown_pct: float
    daily_loss_limit_pct: float
    peak_equity: float = 0.0
    day: str = ""
    day_start_equity: float = 0.0
    halted: bool = False
    halt_reason: str = ""
    daily_blocked: bool = field(default=False)

    def update(self, equity: float, ts: pd.Timestamp) -> None:
        self.peak_equity = max(self.peak_equity, equity)
        day = ts.strftime("%Y-%m-%d")
        if day != self.day:
            self.day = day
            self.day_start_equity = equity
            self.daily_blocked = False
        if self.peak_equity > 0 and equity / self.peak_equity - 1 <= -self.max_drawdown_pct:
            self.halted = True
            self.halt_reason = f"max drawdown {self.max_drawdown_pct:.0%} breached"
        if (
            self.day_start_equity > 0
            and equity / self.day_start_equity - 1 <= -self.daily_loss_limit_pct
        ):
            self.daily_blocked = True

    @property
    def allows_entry(self) -> bool:
        return not self.halted and not self.daily_blocked

    def to_dict(self) -> dict:
        return {
            "peak_equity": self.peak_equity,
            "day": self.day,
            "day_start_equity": self.day_start_equity,
            "halted": self.halted,
            "halt_reason": self.halt_reason,
        }

    @classmethod
    def from_dict(cls, cfg: RiskConfig, state: dict) -> "KillSwitch":
        ks = cls(cfg.max_drawdown_pct, cfg.daily_loss_limit_pct)
        for key in ("peak_equity", "day", "day_start_equity", "halted", "halt_reason"):
            if key in state:
                setattr(ks, key, state[key])
        return ks
