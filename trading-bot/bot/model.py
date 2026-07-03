"""Model training: seed-ensembled LightGBM with purged walk-forward validation.

Leakage control: labels look up to `max_holding` bars into the future, so an
embargo gap of at least `max_holding` bars is enforced between every training
window and its test window (config default 48 >= 24). Each fold's model only
ever sees data strictly older than the bars it is evaluated on.
"""
from __future__ import annotations

from dataclasses import dataclass

import lightgbm as lgb
import numpy as np
import pandas as pd
from sklearn.metrics import accuracy_score, precision_score, roc_auc_score

from .config import ModelConfig


@dataclass
class FoldResult:
    fold: int
    train_end: str
    test_start: str
    test_end: str
    n_train: int
    n_test: int
    base_rate: float
    auc: float
    accuracy: float

    def to_dict(self) -> dict:
        return self.__dict__.copy()


def walk_forward_splits(
    n_samples: int, n_splits: int, min_train: int, embargo: int
) -> list[tuple[int, int, int]]:
    """Expanding-window splits: (train_end, test_start, test_end) index triples.
    Train is always [0, train_end) with train_end = test_start - embargo."""
    usable = n_samples - min_train
    if usable < n_splits * 50:
        raise ValueError(
            f"Not enough samples for walk-forward: {n_samples} rows, "
            f"min_train={min_train}, n_splits={n_splits}. Lower min_train or fetch more data."
        )
    test_size = usable // n_splits
    splits = []
    for i in range(n_splits):
        test_start = min_train + i * test_size
        test_end = n_samples if i == n_splits - 1 else test_start + test_size
        train_end = max(1, test_start - embargo)
        splits.append((train_end, test_start, test_end))
    return splits


def fit_ensemble(
    X: pd.DataFrame, y: pd.Series, cfg: ModelConfig
) -> list[lgb.LGBMClassifier]:
    """Fit one LightGBM per seed; chronological tail of the window is used for
    early stopping (it stays inside the training window — no test leakage)."""
    split = max(1, int(len(X) * 0.9))
    X_fit, y_fit = X.iloc[:split], y.iloc[:split]
    X_val, y_val = X.iloc[split:], y.iloc[split:]
    use_es = len(X_val) >= 50 and y_val.nunique() > 1
    models = []
    for seed in cfg.seeds:
        params = dict(cfg.lgbm)
        model = lgb.LGBMClassifier(**params, random_state=seed)
        if use_es:
            model.fit(
                X_fit,
                y_fit,
                eval_set=[(X_val, y_val)],
                eval_metric="auc",
                callbacks=[lgb.early_stopping(100, verbose=False), lgb.log_evaluation(0)],
            )
        else:
            model.fit(X, y)
        models.append(model)
    return models


def predict_proba(models: list[lgb.LGBMClassifier], X: pd.DataFrame) -> np.ndarray:
    return np.mean([m.predict_proba(X)[:, 1] for m in models], axis=0)


def walk_forward_evaluate(
    X: pd.DataFrame, y: pd.Series, cfg: ModelConfig
) -> tuple[pd.Series, list[FoldResult]]:
    """Train/evaluate across expanding folds; returns stitched out-of-sample
    probabilities (indexed like X) and per-fold metrics."""
    splits = walk_forward_splits(len(X), cfg.n_splits, cfg.min_train_bars, cfg.embargo)
    oos = pd.Series(np.nan, index=X.index, name="prob")
    folds: list[FoldResult] = []
    for k, (train_end, test_start, test_end) in enumerate(splits):
        X_tr, y_tr = X.iloc[:train_end], y.iloc[:train_end]
        X_te, y_te = X.iloc[test_start:test_end], y.iloc[test_start:test_end]
        models = fit_ensemble(X_tr, y_tr, cfg)
        prob = predict_proba(models, X_te)
        oos.iloc[test_start:test_end] = prob
        auc = float(roc_auc_score(y_te, prob)) if y_te.nunique() > 1 else float("nan")
        folds.append(
            FoldResult(
                fold=k,
                train_end=str(X.index[train_end - 1]),
                test_start=str(X.index[test_start]),
                test_end=str(X.index[test_end - 1]),
                n_train=len(X_tr),
                n_test=len(X_te),
                base_rate=round(float(y_te.mean()), 4),
                auc=round(auc, 4),
                accuracy=round(float(accuracy_score(y_te, prob >= 0.5)), 4),
            )
        )
    return oos, folds


def overall_metrics(y: pd.Series, oos: pd.Series, threshold: float) -> dict:
    mask = oos.notna()
    y_true = y[mask]
    prob = oos[mask]
    picked = prob >= threshold
    out = {
        "n_oos": int(mask.sum()),
        "base_rate": round(float(y_true.mean()), 4),
        "auc": round(float(roc_auc_score(y_true, prob)), 4) if y_true.nunique() > 1 else None,
        "accuracy_at_0.5": round(float(accuracy_score(y_true, prob >= 0.5)), 4),
        "signals_at_threshold": int(picked.sum()),
    }
    if picked.any():
        out["precision_at_threshold"] = round(
            float(precision_score(y_true, picked, zero_division=0)), 4
        )
    return out
