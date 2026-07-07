"""Walk-forward doğrulama — bir zaman serisi stratejisini test etmenin dürüst yolu.

Tek bir eğitim/test bölmesi (ya da daha kötüsü, tüm tarih üzerinde ayar yapmak)
performansı fazlasıyla abartır çünkü model geleceğe göz atar. Walk-forward,
kayan/genişleyen bir pencere üzerinde yeniden eğitir ve yalnızca *ileriye doğru
tahmin* yapar:

    |--------- eğitim ---------|--emb--|--- test ---|
                                      |--------- eğitim ---------|--emb--|--- test ---|

Eğitim ile test arasındaki bir ``embargo`` boşluğu, etiketi eğitim penceresiyle
örtüşen çubukları kaldırarak bir başka ince sızıntıyı yok eder. Her katmanın
örneklem-dışı tahminleri TEK bir sermaye eğrisinde birleştirilir — gerçekçi
beklentiniz bu eğridir, örneklem-içi uyum değil.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field

import numpy as np
import pandas as pd

from tradingbot.config import Config
from tradingbot.features.pipeline import Dataset
from tradingbot.models.registry import build_model
from tradingbot.risk.sizing import target_weights
from tradingbot.backtest.engine import BacktestResult, run_backtest

log = logging.getLogger(__name__)


@dataclass
class WalkForwardResult:
    backtest: BacktestResult          # tüm katmanlar genelinde OOS backtest
    oos_signal: pd.Series
    n_folds: int
    directional_accuracy: float | None
    fold_bounds: list[tuple[int, int, int, int]] = field(default_factory=list)

    def summary(self) -> str:
        lines = [f"Walk-forward: {self.n_folds} katman, {len(self.oos_signal)} OOS çubuk"]
        if self.directional_accuracy is not None:
            lines.append(
                f"Örneklem-dışı yön isabeti: "
                f"%{self.directional_accuracy * 100:.2f}  "
                f"(%50 = yazı-tura — maliyet sonrası ~%52-54 üstünde kalıcı olan nadirdir)"
            )
        lines.append(self.backtest.summary())
        return "\n".join(lines)


def _make_folds(n: int, cfg: Config) -> list[tuple[int, int, int, int]]:
    v = cfg.validation
    folds: list[tuple[int, int, int, int]] = []
    test_start = v.train_size + v.embargo
    while test_start < n:
        test_end = min(test_start + v.test_size, n)
        train_end = test_start - v.embargo
        train_start = 0 if v.expanding else max(0, train_end - v.train_size)
        if train_end - train_start < 50:  # eğitmek için yeterli değil
            break
        folds.append((train_start, train_end, test_start, test_end))
        test_start += v.step
    return folds


def walk_forward(ds: Dataset, cfg: Config) -> WalkForwardResult:
    n = len(ds)
    folds = _make_folds(n, cfg)
    if not folds:
        raise ValueError(
            f"train_size={cfg.validation.train_size}, "
            f"test_size={cfg.validation.test_size}, "
            f"embargo={cfg.validation.embargo} ile walk-forward için yeterli veri yok "
            f"({n} çubuk). Daha fazla geçmiş veri çekin veya pencereleri küçültün."
        )

    is_classifier = ds.label_kind == "direction"
    X, y = ds.X, ds.y
    covered: set = set()
    signal_parts: list[pd.Series] = []

    for (tr0, tr1, te0, te1) in folds:
        model = build_model(cfg)
        model.fit(X.iloc[tr0:tr1], y.iloc[tr0:tr1])
        sig = model.predict_signal(X.iloc[te0:te1])
        # yalnızca daha önceki bir katman tarafından tahmin edilmemiş çubukları tut (örtüşme yok)
        fresh = sig.loc[[ts for ts in sig.index if ts not in covered]]
        covered.update(fresh.index)
        signal_parts.append(fresh)

    oos_signal = pd.concat(signal_parts).sort_index()
    oos_signal.name = "signal"

    oos_frame = ds.frame.loc[oos_signal.index].copy()
    oos_frame["signal"] = oos_signal
    oos_frame["target_weight"] = target_weights(oos_frame, oos_signal, cfg, is_classifier)

    result = run_backtest(oos_frame, cfg)

    directional_accuracy = None
    if is_classifier:
        pred_up = (oos_signal > 0.5).astype(int)
        actual_up = (ds.frame.loc[oos_signal.index, "y"] == 1.0).astype(int)
        directional_accuracy = float((pred_up == actual_up).mean())

    log.info("Walk-forward tamamlandı: %d katman, %d OOS çubuk", len(folds), len(oos_signal))
    return WalkForwardResult(
        backtest=result,
        oos_signal=oos_signal,
        n_folds=len(folds),
        directional_accuracy=directional_accuracy,
        fold_bounds=folds,
    )
