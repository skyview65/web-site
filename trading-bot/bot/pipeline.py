"""End-to-end training pipeline: data -> features -> labels -> walk-forward ->
threshold tuning -> final model bundle + JSON report on disk."""
from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

import joblib
import pandas as pd

from .backtest import run_backtest, tune_threshold
from .config import BotConfig
from .data import bars_per_year, load_or_fetch
from .features import build_features
from .labeling import triple_barrier
from .model import fit_ensemble, overall_metrics, walk_forward_evaluate


def model_dir(cfg: BotConfig, symbol: str) -> Path:
    safe = symbol.replace("/", "-").replace(":", "_")
    d = cfg.path(cfg.models_dir) / f"{safe}_{cfg.data.timeframe}"
    d.mkdir(parents=True, exist_ok=True)
    return d


def build_dataset(cfg: BotConfig, symbol: str, refresh: bool = False):
    raw = load_or_fetch(cfg.data, symbol, cfg.root, refresh=refresh)
    feats, feature_cols = build_features(raw)
    labels = triple_barrier(feats, feats["atr"], cfg.labels)
    df = pd.concat([feats, labels], axis=1)
    mask = df[feature_cols].notna().all(axis=1) & df["label"].notna()
    dataset = df.loc[mask]
    return df, dataset, feature_cols


def train_symbol(cfg: BotConfig, symbol: str, refresh: bool = False) -> dict:
    full_df, dataset, feature_cols = build_dataset(cfg, symbol, refresh)
    X = dataset[feature_cols]
    y = dataset["label"].astype(int)
    bpy = bars_per_year(cfg.data.timeframe)

    oos, folds = walk_forward_evaluate(X, y, cfg.model)
    oos_full = oos.reindex(full_df.index)

    threshold = cfg.model.threshold
    grid_rows: list[dict] = []
    if cfg.model.auto_threshold:
        threshold, grid_rows = tune_threshold(
            full_df, oos_full, cfg.labels, cfg.backtest, cfg.risk, bpy
        )

    first_oos = oos_full.dropna().index[0]
    bt = run_backtest(
        full_df.loc[first_oos:], oos_full, threshold, cfg.labels, cfg.backtest, cfg.risk, bpy
    )

    final_models = fit_ensemble(X, y, cfg.model)

    bt_m = bt.metrics
    tradeable = (
        bt_m["sharpe"] >= 1.0
        and bt_m["profit_factor"] > 1.2
        and bt_m["n_trades"] >= 30
    )
    verdict = (
        "TRADEABLE: out-of-sample edge detected — still paper trade for weeks first."
        if tradeable
        else "DO NOT TRADE: no reliable out-of-sample edge on this data. "
        "More history, another symbol/timeframe, or better features are needed."
    )

    report = {
        "verdict": verdict,
        "tradeable": tradeable,
        "symbol": symbol,
        "timeframe": cfg.data.timeframe,
        "trained_at": datetime.now(timezone.utc).isoformat(),
        "data_start": str(full_df.index[0]),
        "data_end": str(full_df.index[-1]),
        "n_bars": len(full_df),
        "n_samples": len(dataset),
        "n_features": len(feature_cols),
        "threshold": threshold,
        "auto_threshold": cfg.model.auto_threshold,
        "folds": [f.to_dict() for f in folds],
        "classification": overall_metrics(y, oos, threshold),
        "oos_backtest": bt.metrics,
        "threshold_grid": grid_rows,
        "label_config": cfg.labels.__dict__,
        "feature_cols": feature_cols,
    }

    out = model_dir(cfg, symbol)
    joblib.dump(
        {
            "models": final_models,
            "feature_cols": feature_cols,
            "threshold": threshold,
            "label_config": cfg.labels.__dict__,
            "symbol": symbol,
            "timeframe": cfg.data.timeframe,
            "trained_at": report["trained_at"],
            "tradeable": tradeable,
            "verdict": verdict,
        },
        out / "model.joblib",
    )
    oos_out = pd.DataFrame({"prob": oos_full, "label": full_df["label"]})
    oos_out.to_parquet(out / "oos_predictions.parquet")
    bt.equity.to_frame().to_csv(out / "oos_equity.csv")
    (out / "report.json").write_text(json.dumps(report, indent=2, default=str))
    return report


def load_bundle(cfg: BotConfig, symbol: str) -> dict:
    path = model_dir(cfg, symbol) / "model.joblib"
    if not path.exists():
        raise FileNotFoundError(
            f"No trained model at {path}. Run `python -m bot train` first."
        )
    return joblib.load(path)
