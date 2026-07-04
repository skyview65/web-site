"""Komut satırı arayüzü: ``python -m tradingbot <komut>``.

Komutlar
  fetch       yapılandırılan piyasa için OHLCV indir ve önbelleğe al
  features    veri setini oluştur ve özet yazdır (satır, öznitelik, denge)
  backtest    walk-forward örneklem-dışı backtest + "al ve tut" / SMA baseline'ları
  train       nihai modeli tüm geçmişte eğit ve yerelde kaydet
  paper       son mumları canlı-benzeri bir paper-trading oturumu olarak oynat
  live        korumalı canlı işlem (varsayılan KAPALI; üç kapı sağlanmadan reddeder)
  report      backtest çalıştır ve equity grafiği (PNG) + metrik (JSON) yaz
"""

from __future__ import annotations

import argparse
import json
import logging
from pathlib import Path

import pandas as pd

from tradingbot.config import load_config, Config
from tradingbot import __version__


def _setup_logging(level: str) -> None:
    logging.basicConfig(
        level=getattr(logging, level.upper(), logging.INFO),
        format="%(asctime)s %(levelname)-7s %(name)s: %(message)s",
        datefmt="%H:%M:%S",
    )


def _load(args) -> Config:
    return load_config(args.config)


# --------------------------------------------------------------------------- #
# komutlar
# --------------------------------------------------------------------------- #
def cmd_fetch(cfg: Config, args) -> int:
    from tradingbot.data.loader import get_ohlcv

    df = get_ohlcv(cfg, refresh=True)
    print(f"{cfg.market.symbol} {cfg.market.timeframe} için {len(df)} mum çekildi/önbelleklendi "
          f"({df.index[0]} -> {df.index[-1]})")
    return 0


def cmd_features(cfg: Config, args) -> int:
    from tradingbot.data.loader import get_ohlcv
    from tradingbot.features.pipeline import build_dataset

    df = get_ohlcv(cfg)
    ds = build_dataset(df, cfg)
    print(f"Kullanılabilir satır : {len(ds)}")
    print(f"Öznitelik            : {len(ds.feature_cols)} -> {ds.feature_cols}")
    print(f"Etiket türü          : {ds.label_kind} (ufuk {ds.horizon})")
    if ds.label_kind == "direction":
        bal = ds.y.value_counts(normalize=True).round(3).to_dict()
        print(f"Etiket dengesi       : {bal}")
    return 0


def _oos_baselines(cfg: Config, ds, oos_index) -> dict:
    """"Al ve tut" ile SMA-kesişimini AYNI OOS penceresinde backtest et (karşılaştırma).

    Baseline'lar, temiz referanslar olsunlar diye risk devre kesicileri KAPALI
    çalıştırılır ("al ve tut" gerçekten ~%100 yatırımda kalmalı, durdurulmamalı).
    Maliyetler yine uygulanır, böylece karşılaştırma sürtünmelerde adildir.
    """
    import copy

    from tradingbot.strategy.baselines import buy_and_hold_weights, sma_cross_weights
    from tradingbot.backtest.engine import run_backtest

    bench_cfg = copy.deepcopy(cfg)
    bench_cfg.risk.max_drawdown_halt = 0.0
    bench_cfg.risk.max_daily_loss = 0.0
    bench_cfg.risk.stop_loss_atr = 0.0
    bench_cfg.risk.take_profit_atr = 0.0
    bench_cfg.risk.hold_to_exit = False  # baseline'lar kendi çıkış kuralına uymalı

    out = {}
    full = ds.frame
    for name, weights in (
        ("buy_and_hold", buy_and_hold_weights(full, cfg.risk.max_leverage)),
        ("sma_cross", sma_cross_weights(full, leverage=cfg.risk.max_leverage)),
    ):
        frame = full.loc[oos_index].copy()
        frame["target_weight"] = weights.loc[oos_index]
        out[name] = run_backtest(frame, bench_cfg)
    return out


def cmd_backtest(cfg: Config, args) -> int:
    from tradingbot.data.loader import get_ohlcv
    from tradingbot.features.pipeline import build_dataset
    from tradingbot.backtest.walkforward import walk_forward

    df = get_ohlcv(cfg)
    ds = build_dataset(df, cfg)
    wf = walk_forward(ds, cfg)
    print("\n" + "=" * 70)
    print(f"YAPAY ZEKÂ MODEL STRATEJİSİ ({cfg.model.kind})")
    print("=" * 70)
    print(wf.summary())

    baselines = _oos_baselines(cfg, ds, wf.oos_signal.index)
    labels_tr = {"buy_and_hold": "AL VE TUT", "sma_cross": "SMA KESİŞİMİ"}
    for name, res in baselines.items():
        print("\n" + "-" * 70)
        print(f"BASELINE: {labels_tr.get(name, name)}")
        print("-" * 70)
        print(res.summary())

    # dürüst karar
    model_sharpe = wf.backtest.metrics.get("sharpe", 0.0)
    bh_sharpe = baselines["buy_and_hold"].metrics.get("sharpe", 0.0)
    win_rate = wf.backtest.metrics.get("win_rate", 0.0)
    print("\n" + "=" * 70)
    if model_sharpe > bh_sharpe:
        verdict = "Model burada Sharpe'ta 'al ve tut'u GEÇİYOR"
    else:
        verdict = "Model 'al ve tut'u GEÇEMİYOR — avantaza dair kanıt yok"
    print(f"KARAR: {verdict} (model {model_sharpe:.2f} vs al-tut {bh_sharpe:.2f}).")
    print(f"İşlem isabeti (win rate): %{win_rate * 100:.2f} — ama yüksek isabet KÂR DEMEK DEĞİLDİR.")
    print("Unutmayın: tek bir veri seti hiçbir şey kanıtlamaz. Deneme sayısına göre")
    print("düzeltin, maliyetleri 1,5-2× ile test edin ve gerçek para öncesi paper-trade yapın.")
    print("=" * 70)

    if args.plot:
        from tradingbot.reporting import plot_equity

        curves = {"AI model": wf.backtest.equity}
        curves.update({k: v.equity for k, v in baselines.items()})
        p = plot_equity(curves, args.plot, title=f"{cfg.market.symbol} OOS equity")
        print(f"\nEquity grafiği kaydedildi -> {p}")

    if args.out:
        Path(args.out).parent.mkdir(parents=True, exist_ok=True)
        payload = {
            "model": {"kind": cfg.model.kind, **wf.backtest.metrics,
                      "directional_accuracy": wf.directional_accuracy,
                      "n_folds": wf.n_folds},
            "baselines": {k: v.metrics for k, v in baselines.items()},
        }
        Path(args.out).write_text(json.dumps(payload, indent=2))
        print(f"Metrik JSON kaydedildi -> {args.out}")
    return 0


def cmd_train(cfg: Config, args) -> int:
    import joblib
    from tradingbot.data.loader import get_ohlcv
    from tradingbot.features.pipeline import build_dataset
    from tradingbot.models.registry import build_model

    df = get_ohlcv(cfg)
    ds = build_dataset(df, cfg)
    model = build_model(cfg)
    model.fit(ds.X, ds.y)
    out = Path(args.out or "models_store/model.joblib")
    out.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump({"model": model, "feature_cols": ds.feature_cols,
                 "label_kind": ds.label_kind}, out)
    print(f"{len(ds)} satırda eğitildi, kaydedildi -> {out}")
    print("NOT: TÜM geçmişte eğitilen bir model yalnızca dağıtım içindir; kaliteyi")
    print("`backtest` (walk-forward OOS) ile ölçün, asla örneklem-içi uyumla değil.")
    return 0


def cmd_paper(cfg: Config, args) -> int:
    from tradingbot.execution.paper import run_paper_session

    res = run_paper_session(cfg, steps=args.steps)
    print(f"\nPaper oturumu: {len(res.decisions)} adım")
    print(f"Başlangıç öz sermaye : {cfg.backtest.initial_cash:.2f}")
    print(f"Son öz sermaye       : {res.final_equity():.2f} "
          f"(%{(res.final_equity() / cfg.backtest.initial_cash - 1) * 100:+.2f})")
    print(f"Gerçekleşen işlem    : {len(res.portfolio.trade_log)}")
    for d in res.decisions[-5:]:
        print(f"  {d['ts']}  sinyal={d['signal']:.3f}  ağırlık={d['target_weight']:+.3f}  "
              f"öz sermaye={d['equity']:.2f}")
    return 0


def cmd_live(cfg: Config, args) -> int:
    from tradingbot.execution.live import run_live_session, LiveTradingBlocked

    try:
        run_live_session(cfg, steps=args.steps)
    except LiveTradingBlocked as exc:
        print(f"Canlı işlem engellendi: {exc}")
        return 2
    return 0


def cmd_report(cfg: Config, args) -> int:
    # backtest'i grafik + json ile tek seferde çalıştır
    args.plot = args.plot or "reports/equity.png"
    args.out = args.out or "reports/metrics.json"
    return cmd_backtest(cfg, args)


# --------------------------------------------------------------------------- #
def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="tradingbot", description="Yerel yapay zekâ alım-satım botu")
    p.add_argument("--config", default=None, help="config.yaml yolu (verilmezse varsayılanlar)")
    p.add_argument("--log-level", default="INFO", help="günlük seviyesi (INFO, WARNING, ...)")
    p.add_argument("--version", action="version", version=f"tradingbot {__version__}")
    sub = p.add_subparsers(dest="command", required=True)

    sub.add_parser("fetch", help="OHLCV indir ve önbelleğe al").set_defaults(func=cmd_fetch)
    sub.add_parser("features", help="veri setini oluştur ve özetle").set_defaults(func=cmd_features)

    bt = sub.add_parser("backtest", help="walk-forward OOS backtest + baseline'lar")
    bt.add_argument("--plot", default=None, help="equity grafiğini bu yola PNG olarak kaydet")
    bt.add_argument("--out", default=None, help="metrikleri bu yola JSON olarak kaydet")
    bt.set_defaults(func=cmd_backtest)

    tr = sub.add_parser("train", help="nihai modeli tüm geçmişte eğit ve kaydet")
    tr.add_argument("--out", default=None, help="modelin kaydedileceği yol")
    tr.set_defaults(func=cmd_train)

    pa = sub.add_parser("paper", help="son mumları paper-trading oturumu olarak oynat")
    pa.add_argument("--steps", type=int, default=200, help="oynatılacak mum sayısı")
    pa.set_defaults(func=cmd_paper)

    lv = sub.add_parser("live", help="korumalı canlı işlem (varsayılan KAPALI)")
    lv.add_argument("--steps", type=int, default=1, help="işlem döngüsü adım sayısı")
    lv.set_defaults(func=cmd_live)

    rp = sub.add_parser("report", help="backtest + equity PNG + metrik JSON")
    rp.add_argument("--plot", default=None)
    rp.add_argument("--out", default=None)
    rp.set_defaults(func=cmd_report)
    return p


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    _setup_logging(args.log_level)
    cfg = _load(args)
    return args.func(cfg, args)
