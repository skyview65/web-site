"""CLI entry point: python -m bot <command>."""
from __future__ import annotations

import argparse
import json
from pathlib import Path

from dotenv import load_dotenv
from rich.console import Console
from rich.table import Table

console = Console()


def _cfg(args: argparse.Namespace):
    from .config import load_config

    return load_config(args.config)


def cmd_fetch(args: argparse.Namespace) -> None:
    from .data import load_or_fetch

    cfg = _cfg(args)
    for symbol in cfg.data.symbols:
        df = load_or_fetch(cfg.data, symbol, cfg.root, refresh=args.refresh)
        console.print(
            f"[green]{symbol}[/green] {cfg.data.timeframe}: {len(df)} bars "
            f"({df.index[0]} -> {df.index[-1]})"
        )


def _print_report(report: dict) -> None:
    table = Table(title=f"Walk-forward folds — {report['symbol']} {report['timeframe']}")
    for col in ("fold", "test_start", "test_end", "n_test", "base_rate", "auc", "accuracy"):
        table.add_column(col)
    for fold in report["folds"]:
        table.add_row(*(str(fold[c]) for c in ("fold", "test_start", "test_end", "n_test", "base_rate", "auc", "accuracy")))
    console.print(table)
    console.print("[bold]Out-of-sample classification:[/bold]", report["classification"])
    console.print(
        f"[bold]OOS backtest (threshold={report['threshold']}):[/bold]", report["oos_backtest"]
    )
    style = "bold green" if report.get("tradeable") else "bold red"
    console.print(f"[{style}]{report.get('verdict', '')}[/{style}]")


def cmd_train(args: argparse.Namespace) -> None:
    from .pipeline import train_symbol

    cfg = _cfg(args)
    symbols = [args.symbol] if args.symbol else cfg.data.symbols
    for symbol in symbols:
        console.print(f"[bold cyan]Training {symbol} {cfg.data.timeframe}...[/bold cyan]")
        report = train_symbol(cfg, symbol, refresh=args.refresh)
        _print_report(report)


def cmd_backtest(args: argparse.Namespace) -> None:
    """Re-run the OOS backtest from saved predictions with a custom threshold."""
    import pandas as pd

    from .backtest import run_backtest
    from .data import bars_per_year, load_or_fetch
    from .features import build_features
    from .pipeline import model_dir

    cfg = _cfg(args)
    symbol = args.symbol or cfg.data.symbols[0]
    oos_path = model_dir(cfg, symbol) / "oos_predictions.parquet"
    if not oos_path.exists():
        console.print("[red]No saved predictions — run `python -m bot train` first.[/red]")
        return
    oos = pd.read_parquet(oos_path)["prob"]
    raw = load_or_fetch(cfg.data, symbol, cfg.root)
    feats, _ = build_features(raw)
    prob = oos.reindex(feats.index)
    valid = prob.dropna()
    if valid.empty:
        console.print(
            "[red]Saved predictions do not overlap the cached data (data was refreshed "
            "after training?). Re-run `python -m bot train`.[/red]"
        )
        return
    threshold = args.threshold if args.threshold is not None else cfg.model.threshold
    result = run_backtest(
        feats.loc[valid.index[0] :],
        prob,
        threshold,
        cfg.labels,
        cfg.backtest,
        cfg.risk,
        bars_per_year(cfg.data.timeframe),
    )
    console.print(f"[bold]Backtest (threshold={threshold}):[/bold]", result.metrics)


def cmd_paper(args: argparse.Namespace) -> None:
    from .live import trading_loop

    trading_loop(_cfg(args), live=False, once=args.once)


def cmd_live(args: argparse.Namespace) -> None:
    from .live import trading_loop

    if not args.i_understand_the_risks:
        console.print(
            "[red]Live mode places REAL orders with REAL money. Re-run with "
            "--i-understand-the-risks after testing in paper mode for several weeks.[/red]"
        )
        return
    trading_loop(_cfg(args), live=True, once=args.once)


def cmd_report(args: argparse.Namespace) -> None:
    from .pipeline import model_dir

    cfg = _cfg(args)
    symbol = args.symbol or cfg.data.symbols[0]
    path = model_dir(cfg, symbol) / "report.json"
    if not path.exists():
        console.print("[red]No report found — run `python -m bot train` first.[/red]")
        return
    _print_report(json.loads(path.read_text()))


def main() -> None:
    parser = argparse.ArgumentParser(prog="bot", description="Local ML trading bot")
    parser.add_argument(
        "--config",
        default=str(Path(__file__).resolve().parent.parent / "config.yaml"),
        help="Path to config.yaml (default: alongside the bot package)",
    )
    sub = parser.add_subparsers(dest="command", required=True)

    p = sub.add_parser("fetch", help="Download & cache OHLCV data")
    p.add_argument("--refresh", action="store_true")
    p.set_defaults(func=cmd_fetch)

    p = sub.add_parser("train", help="Walk-forward training + OOS backtest + save model")
    p.add_argument("--symbol")
    p.add_argument("--refresh", action="store_true", help="Re-download data first")
    p.set_defaults(func=cmd_train)

    p = sub.add_parser("backtest", help="Re-run OOS backtest with a custom threshold")
    p.add_argument("--symbol")
    p.add_argument("--threshold", type=float)
    p.set_defaults(func=cmd_backtest)

    p = sub.add_parser("paper", help="Paper-trading loop (simulated fills, real data)")
    p.add_argument("--once", action="store_true", help="Run a single decision cycle")
    p.set_defaults(func=cmd_paper)

    p = sub.add_parser("live", help="LIVE trading loop (real orders!)")
    p.add_argument("--once", action="store_true")
    p.add_argument("--i-understand-the-risks", action="store_true")
    p.set_defaults(func=cmd_live)

    p = sub.add_parser("report", help="Print the last training report")
    p.add_argument("--symbol")
    p.set_defaults(func=cmd_report)

    load_dotenv()
    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
