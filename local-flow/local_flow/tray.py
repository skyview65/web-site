"""Sistem tepsisi girişi: konsol penceresi açmadan arka planda çalışır.

`local-flow-tray` — Windows'ta `[project.gui-scripts]` sayesinde `pythonw` ile
başlar, hiçbir konsol penceresi açmaz. Küçük bir tepsi ikonu; durumu (hazır /
dinliyor / yazıya dökülüyor / sorun) renkle gösterir, "Ayarları aç" ve "Çıkış"
seçenekleri sunar. Dikte mantığının kendisi `LocalFlowApp`'te değişmeden kalır.
"""

from __future__ import annotations

import os
import subprocess
import sys
import threading
from pathlib import Path

from .app import LocalFlowApp
from .config import Config

_STATE_COLOR = {
    "loading": "#f5a524",
    "idle": "#3fae52",
    "recording": "#e5484d",
    "processing": "#2f6fed",
    "error": "#f5a524",
}
_STATE_LABEL = {
    "loading": "model yükleniyor…",
    "idle": "hazır",
    "recording": "dinliyor…",
    "processing": "yazıya dökülüyor…",
    "error": "sorun oluştu — logu kontrol edin",
}


def _redirect_std_streams_for_windowless() -> None:
    """pythonw.exe altında sys.stdout/stderr None olur; print() çökertir.

    Bu yüzden konsolsuz çalışırken tüm çıktıyı bir log dosyasına yönlendiriyoruz.
    """
    if sys.stdout is not None and sys.stderr is not None:
        return
    log_dir = Path.home() / ".local-flow"
    log_dir.mkdir(parents=True, exist_ok=True)
    log_file = open(log_dir / "local-flow.log", "a", buffering=1, encoding="utf-8")
    sys.stdout = log_file
    sys.stderr = log_file
    print(f"[local-flow] tepsi modu başladı, loglar: {log_dir / 'local-flow.log'}")


def _config_path() -> Path:
    """Var olan bir config.json/.local-flow.json döndürür; yoksa örnekten oluşturur."""
    for candidate in (Path("config.json"), Path.home() / ".local-flow.json"):
        if candidate.is_file():
            return candidate
    target = Path("config.json")
    example = Path("config.example.json")
    if example.is_file():
        target.write_text(example.read_text(encoding="utf-8"), encoding="utf-8")
    return target


def _open_path(path: Path) -> None:
    try:
        if sys.platform == "win32":
            os.startfile(path)  # type: ignore[attr-defined]
        elif sys.platform == "darwin":
            subprocess.Popen(["open", str(path)])
        else:
            subprocess.Popen(["xdg-open", str(path)])
    except OSError as exc:
        print(f"[local-flow] açılamadı ({path}): {exc}")


def _make_icon_image(color: str):
    from PIL import Image, ImageDraw

    image = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    draw.ellipse((6, 6, 58, 58), fill=color)
    return image


def main() -> None:
    _redirect_std_streams_for_windowless()

    import pystray

    cfg = Config.load()
    icon = pystray.Icon("local-flow")
    icon.icon = _make_icon_image(_STATE_COLOR["loading"])
    icon.title = "local-flow — başlatılıyor…"

    def set_state(state: str) -> None:
        icon.icon = _make_icon_image(_STATE_COLOR.get(state, _STATE_COLOR["idle"]))
        icon.title = f"local-flow — {_STATE_LABEL.get(state, state)}"

    app = LocalFlowApp(cfg, on_state=set_state)

    def status_label(_icon: "pystray.Icon") -> str:
        return f"local-flow — {_STATE_LABEL.get(app.state, app.state)}"

    def open_config(_icon: "pystray.Icon", _item) -> None:
        _open_path(_config_path())

    def quit_app(_icon: "pystray.Icon", _item) -> None:
        app.stop()
        icon.stop()

    icon.menu = pystray.Menu(
        pystray.MenuItem(status_label, None, enabled=False),
        pystray.Menu.SEPARATOR,
        pystray.MenuItem("Ayarları aç (config.json)", open_config),
        pystray.MenuItem("Çıkış", quit_app),
    )

    threading.Thread(target=app.run, daemon=True).start()
    icon.run()


if __name__ == "__main__":
    main()
