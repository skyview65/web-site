"""Execution layer.

PaperBroker keeps all position/cash bookkeeping in a local JSON file and a
trades CSV — this is the source of truth in both paper and live mode.
CcxtBroker only mirrors fills to a real exchange when live mode is enabled.
"""
from __future__ import annotations

import csv
import json
import os
from pathlib import Path

import pandas as pd


class PaperBroker:
    def __init__(
        self,
        state_path: Path,
        initial_cash: float,
        fee_bps: float,
        slippage_bps: float,
    ) -> None:
        self.state_path = state_path
        self.trades_path = state_path.with_suffix(".trades.csv")
        self.fee = fee_bps / 10_000
        self.slip = slippage_bps / 10_000
        if state_path.exists():
            self.state = json.loads(state_path.read_text())
        else:
            self.state = {
                "cash": initial_cash,
                "qty": 0.0,
                "entry_price": 0.0,
                "stop": 0.0,
                "target": 0.0,
                "entry_time": None,
                "bars_held": 0,
                "kill": {},
            }
            self._save()

    def _save(self) -> None:
        self.state_path.parent.mkdir(parents=True, exist_ok=True)
        self.state_path.write_text(json.dumps(self.state, indent=2, default=str))

    @property
    def in_position(self) -> bool:
        return self.state["qty"] > 0

    def mark(self, price: float) -> float:
        return self.state["cash"] + self.state["qty"] * price

    def open_long(
        self, price: float, qty: float, ts: pd.Timestamp, stop: float, target: float
    ) -> float:
        fill = price * (1 + self.slip)
        cost = qty * fill * (1 + self.fee)
        if cost > self.state["cash"] or qty <= 0:
            return 0.0
        self.state.update(
            {
                "cash": self.state["cash"] - cost,
                "qty": qty,
                "entry_price": fill,
                "stop": stop,
                "target": target,
                "entry_time": str(ts),
                "bars_held": 0,
            }
        )
        self._save()
        return fill

    def close(self, price: float, ts: pd.Timestamp, reason: str) -> dict:
        fill = price * (1 - self.slip)
        qty = self.state["qty"]
        proceeds = qty * fill * (1 - self.fee)
        cost = qty * self.state["entry_price"] * (1 + self.fee)
        trade = {
            "entry_time": self.state["entry_time"],
            "exit_time": str(ts),
            "entry": self.state["entry_price"],
            "exit": fill,
            "qty": qty,
            "pnl": proceeds - cost,
            "ret": proceeds / cost - 1.0 if cost > 0 else 0.0,
            "reason": reason,
        }
        self.state.update(
            {"cash": self.state["cash"] + proceeds, "qty": 0.0, "entry_price": 0.0,
             "stop": 0.0, "target": 0.0, "entry_time": None, "bars_held": 0}
        )
        self._save()
        self._log_trade(trade)
        return trade

    def tick_holding(self) -> int:
        self.state["bars_held"] += 1
        self._save()
        return self.state["bars_held"]

    def _log_trade(self, trade: dict) -> None:
        new_file = not self.trades_path.exists()
        with self.trades_path.open("a", newline="") as fh:
            writer = csv.DictWriter(fh, fieldnames=list(trade.keys()))
            if new_file:
                writer.writeheader()
            writer.writerow(trade)


class CcxtBroker:
    """Real-exchange mirror. Requires BOT_API_KEY / BOT_API_SECRET in the env."""

    def __init__(self, exchange_id: str) -> None:
        from .data import make_exchange

        key = os.environ.get("BOT_API_KEY", "")
        secret = os.environ.get("BOT_API_SECRET", "")
        if not key or not secret:
            raise RuntimeError(
                "Live mode needs BOT_API_KEY and BOT_API_SECRET in the environment "
                "(see .env.example)."
            )
        self.exchange = make_exchange(exchange_id, {"apiKey": key, "secret": secret})

    def market_buy(self, symbol: str, qty: float) -> dict:
        return self.exchange.create_market_buy_order(symbol, qty)

    def market_sell(self, symbol: str, qty: float) -> dict:
        return self.exchange.create_market_sell_order(symbol, qty)
