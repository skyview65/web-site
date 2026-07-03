"""CLI girişi: `local-flow` veya `python -m local_flow`."""

from __future__ import annotations

import argparse
from pathlib import Path

from .app import LocalFlowApp
from .config import Config


def main() -> None:
    parser = argparse.ArgumentParser(
        prog="local-flow",
        description="Tamamen yerel Wispr Flow alternatifi: kısayola bas, konuş, metin aktif uygulamaya yapışsın.",
    )
    parser.add_argument("--config", type=Path, help="config.json yolu")
    parser.add_argument("--model", help="faster-whisper modeli (tiny/base/small/medium/large-v3)")
    parser.add_argument("--language", help="dil kodu (tr, en, …); verilmezse otomatik algılanır")
    parser.add_argument("--list-devices", action="store_true", help="ses giriş aygıtlarını listele ve çık")
    args = parser.parse_args()

    if args.list_devices:
        import sounddevice as sd

        print(sd.query_devices())
        return

    cfg = Config.load(args.config)
    if args.model:
        cfg.model = args.model
    if args.language:
        cfg.language = args.language

    LocalFlowApp(cfg).run()


if __name__ == "__main__":
    main()
