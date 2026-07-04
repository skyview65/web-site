"""Kağıt üzerinde işlem (paper-trading) oturumu — birebir aynı strateji mantığının simüle edilmiş bir broker üzerinde çalıştırılması.

İki mod:
  * replay (varsayılan, çevrimdışı): yerel/sentetik verinin son kısmında, veri
    canlı geliyormuş gibi bar bar ilerler; böylece botun karar verişini izleyebilir
    ve herhangi bir ağ bağlantısı ya da gerçek para olmadan bir kağıt portföyünü
    yönetebilirsiniz.
  * poll (çevrimiçi): her ``poll_seconds`` saniyede bir en son kapanmış barı çeker
    ve ona göre hareket eder. Aynı kod yolu — yalnızca saat farklıdır.

Bir kuruş riske atmadan önce *tam olarak* üretim kodunu haftalarca kağıt üzerinde
işleme sokmak, en önemli güvenlik adımıdır. Backtest ile canlı arasındaki fark
genellikle büyüktür.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field

import pandas as pd

from tradingbot.config import Config
from tradingbot.data.loader import get_ohlcv
from tradingbot.features.pipeline import build_dataset
from tradingbot.models.registry import build_model
from tradingbot.risk.sizing import target_weights
from tradingbot.execution.broker import Portfolio

log = logging.getLogger(__name__)


@dataclass
class PaperResult:
    portfolio: Portfolio
    equity: pd.Series
    decisions: list[dict] = field(default_factory=list)

    def final_equity(self) -> float:
        return float(self.equity.iloc[-1]) if len(self.equity) else self.portfolio.cash


def run_paper_session(cfg: Config, steps: int = 200, refresh: bool = False) -> PaperResult:
    """Son ``steps`` barı canlıya benzer bir kağıt oturumu olarak yeniden oynatır.

    Modeli, replay penceresinden *önceki* her şey üzerinde eğitir, ardından
    pencereyi her seferinde kapanmış bir bar olacak şekilde ileri doğru yürütür —
    ileriye bakma yoktur. Kağıt portföyünü ve onun equity (özsermaye) eğrisini
    döndürür.
    """
    df = get_ohlcv(cfg, refresh=refresh)
    ds = build_dataset(df, cfg)
    n = len(ds)
    is_classifier = ds.label_kind == "direction"

    steps = min(steps, max(1, n - cfg.validation.train_size))
    split = n - steps
    if split < 100:
        raise ValueError(
            f"{steps} adımlık kağıt işlem için yeterli geçmiş yok ({n} kullanılabilir bar). "
            "Daha fazla veri çekin veya --steps değerini azaltın."
        )

    model = build_model(cfg)
    model.fit(ds.X.iloc[:split], ds.y.iloc[:split])

    window = ds.frame.iloc[split:].copy()
    signal = model.predict_signal(ds.X.iloc[split:])
    window["signal"] = signal
    window["target_weight"] = target_weights(window, signal, cfg, is_classifier)

    pf = Portfolio(
        cash=cfg.backtest.initial_cash,
        fee_bps=cfg.backtest.fee_bps,
        slippage_bps=cfg.backtest.slippage_bps,
    )
    equity_points: list[float] = []
    decisions: list[dict] = []
    for ts, row in window.iterrows():
        price = float(row["close"])
        tw = float(row["target_weight"])
        fill = pf.rebalance(price, tw, ts=ts)
        eq = pf.equity(price)
        equity_points.append(eq)
        decisions.append(
            {
                "ts": str(ts),
                "price": price,
                "signal": float(row["signal"]),
                "target_weight": tw,
                "filled": fill is not None,
                "equity": eq,
            }
        )

    equity = pd.Series(equity_points, index=window.index, name="equity")
    log.info(
        "Kağıt oturumu tamamlandı: %d adım, son equity %.2f (başlangıç %.2f)",
        len(window),
        equity.iloc[-1] if len(equity) else pf.cash,
        cfg.backtest.initial_cash,
    )
    return PaperResult(portfolio=pf, equity=equity, decisions=decisions)
