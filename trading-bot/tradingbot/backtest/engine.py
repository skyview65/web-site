"""Olay güdümlü, yola bağımlı backtest motoru.

Vektörleştirilmiş backtest'ler hızlıdır ancak stop-loss, take-profit ya da devre
kesicileri dürüstçe modelleyemez — bunlar yola bağımlıdır. Bu motor bar bar ilerler:

  her bar için:
    1. açık pozisyonu piyasaya göre değerle (bar içi stop / take-profit kontrolü)
    2. yüksek su işareti, drawdown ve günlük kayıp izleyicilerini güncelle
    3. bir devre kesici tetiklendiyse pozisyonu zorla düz (flat) yap
    4. aksi halde bu bar için önceden boyutlandırılmış ``target_weight`` değerine doğru yeniden dengele
    5. pozisyondaki her değişiklikte işlem maliyetlerini öde

Kararlar yalnızca barın kapanışında mevcut olan bilgiyi kullanır (``target_weight``
nedensel özniteliklerden hesaplanır) ve ortaya çıkan pozisyon *bir sonraki* barın
getirisini kazanır — yani look-ahead yoktur. Maliyetler (ücretler + slippage) maruz
kalınan pozisyondaki her değişiklikte tahsil edilir. Bunları kapatmak sizin riskinizdedir.
"""

from __future__ import annotations

from dataclasses import dataclass, field

import numpy as np
import pandas as pd

from tradingbot.config import Config
from tradingbot.backtest.metrics import compute_metrics


@dataclass
class BacktestResult:
    equity: pd.Series
    position: pd.Series
    returns: pd.Series
    trades: list[dict] = field(default_factory=list)
    metrics: dict[str, float] = field(default_factory=dict)
    halted_at: pd.Timestamp | None = None

    def summary(self) -> str:
        from tradingbot.backtest.metrics import format_metrics

        head = "Backtest sonucu"
        if self.halted_at is not None:
            head += f"  (düşüş devre kesicisi {self.halted_at} tarihinde tetiklendi)"
        return head + "\n" + format_metrics(self.metrics)


def run_backtest(frame: pd.DataFrame, cfg: Config) -> BacktestResult:
    """Stratejiyi ``frame`` üzerinde simüle eder.

    Gerekli sütunlar: ``close, high, low, atr, target_weight``.
    """
    required = {"close", "high", "low", "atr", "target_weight"}
    missing = required - set(frame.columns)
    if missing:
        raise ValueError(f"backtest çerçevesinde eksik sütunlar: {sorted(missing)}")

    r = cfg.risk
    cost_rate = (cfg.backtest.fee_bps + cfg.backtest.slippage_bps) / 1e4

    idx = frame.index
    close = frame["close"].to_numpy(float)
    high = frame["high"].to_numpy(float)
    low = frame["low"].to_numpy(float)
    atr = frame["atr"].to_numpy(float)
    target = frame["target_weight"].to_numpy(float)
    dates = idx.normalize().to_numpy()  # günlük kayıp sıfırlaması için bar başına gün
    n = len(frame)

    equity = np.empty(n)
    position = np.zeros(n)
    equity[0] = cfg.backtest.initial_cash

    pos = 0.0
    stop_price = np.nan
    tp_price = np.nan
    halted = False
    halted_at: pd.Timestamp | None = None

    trades: list[dict] = []
    trade_entry_equity: float | None = None
    trade_entry_i: int | None = None

    def open_stop_tp(entry_price: float, direction: float, atr_i: float):
        sp = np.nan
        tp = np.nan
        if r.stop_loss_atr > 0 and atr_i > 0:
            sp = entry_price - direction * r.stop_loss_atr * atr_i
        if r.take_profit_atr > 0 and atr_i > 0:
            tp = entry_price + direction * r.take_profit_atr * atr_i
        return sp, tp

    # İlk barın kararı close[0]'da uygulanır; böylece pozisyon bar 1 boyunca tutulur
    # — ilk girişin bir bar geç gerçekleşmesine yol açan off-by-one hatasını önler.
    desired0 = float(target[0])
    if desired0 != 0.0:
        trade_entry_equity = equity[0]
        trade_entry_i = 0
        equity[0] *= 1.0 - cost_rate * abs(desired0)  # giriş maliyeti
        stop_price, tp_price = open_stop_tp(close[0], float(np.sign(desired0)), atr[0])
        pos = desired0
    position[0] = pos

    hwm = equity[0]
    day = dates[0]
    day_start_equity = equity[0]

    for i in range(1, n):
        eq = equity[i - 1]
        prev_price = close[i - 1]
        price = close[i]

        # -- 1) bar i boyunca pozisyonu piyasaya göre değerle, stop / take-profit kontrol et --
        if pos != 0.0:
            exit_price = None
            if pos > 0:
                if not np.isnan(stop_price) and low[i] <= stop_price:
                    exit_price = stop_price
                elif not np.isnan(tp_price) and high[i] >= tp_price:
                    exit_price = tp_price
            else:
                if not np.isnan(stop_price) and high[i] >= stop_price:
                    exit_price = stop_price
                elif not np.isnan(tp_price) and low[i] <= tp_price:
                    exit_price = tp_price

            if exit_price is not None:
                eq *= 1.0 + pos * (exit_price / prev_price - 1.0)
                eq *= 1.0 - cost_rate * abs(pos)  # çıkış maliyeti
                if trade_entry_equity is not None:
                    trades.append(
                        {
                            "entry_i": trade_entry_i,
                            "exit_i": i,
                            "return": eq / trade_entry_equity - 1.0,
                            "reason": "stop" if exit_price == stop_price else "take_profit",
                        }
                    )
                pos = 0.0
                stop_price = tp_price = np.nan
                trade_entry_equity = None
            else:
                eq *= 1.0 + pos * (price / prev_price - 1.0)

        # -- 2) risk izleyicileri --
        hwm = max(hwm, eq)
        drawdown = 1.0 - eq / hwm if hwm > 0 else 0.0
        if dates[i] != day:
            day = dates[i]
            day_start_equity = eq
        daily_loss = 1.0 - eq / day_start_equity if day_start_equity > 0 else 0.0

        # -- 3) devre kesiciler --
        if r.max_drawdown_halt > 0 and drawdown >= r.max_drawdown_halt and not halted:
            halted = True
            halted_at = idx[i]
        day_blocked = r.max_daily_loss > 0 and daily_loss >= r.max_daily_loss

        if halted or day_blocked:
            desired = 0.0
        elif r.hold_to_exit and pos != 0.0:
            # Açık pozisyonu tut; yalnızca bir take-profit/stop (yukarıda ele alındı)
            # veya bir devre kesici onu kapatabilir. Bu, işlem hacmini düşürür; böylece
            # kazanma oranını sinyal gürültüsü değil, asimetrik çıkışlar belirler.
            desired = pos
        else:
            desired = float(target[i])

        # -- 4/5) istenen değere doğru yeniden dengele, değişiklikte maliyet öde --
        if desired != pos:
            closing = pos != 0.0 and (
                desired == 0.0 or np.sign(desired) != np.sign(pos)
            )
            opening = desired != 0.0 and (
                pos == 0.0 or np.sign(desired) != np.sign(pos)
            )

            if closing:
                eq *= 1.0 - cost_rate * abs(pos)  # mevcut pozisyonu kapatma maliyeti
                if trade_entry_equity is not None:
                    trades.append(
                        {
                            "entry_i": trade_entry_i,
                            "exit_i": i,
                            "return": eq / trade_entry_equity - 1.0,
                            "reason": "signal",
                        }
                    )
                trade_entry_equity = None
                stop_price = tp_price = np.nan

            if opening:
                trade_entry_equity = eq  # giriş maliyetinden önceki anlık görüntü
                trade_entry_i = i
                eq *= 1.0 - cost_rate * abs(desired)  # yeni pozisyon oluşturma maliyeti
                stop_price, tp_price = open_stop_tp(price, float(np.sign(desired)), atr[i])
            elif not closing:
                # aynı işaretli yeniden boyutlandırma: maliyeti yalnızca delta üzerinden öde
                eq *= 1.0 - cost_rate * abs(desired - pos)

            pos = desired

        equity[i] = eq
        position[i] = pos

    equity_s = pd.Series(equity, index=idx, name="equity")
    position_s = pd.Series(position, index=idx, name="position")
    returns_s = equity_s.pct_change().fillna(0.0).rename("returns")
    exposure = float((position_s != 0).mean())
    metrics = compute_metrics(
        equity_s,
        cfg.bars_per_year(),
        trade_returns=[t["return"] for t in trades],
        exposure=exposure,
    )
    return BacktestResult(
        equity=equity_s,
        position=position_s,
        returns=returns_s,
        trades=trades,
        metrics=metrics,
        halted_at=halted_at,
    )
