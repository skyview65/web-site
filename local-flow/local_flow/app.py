"""Uygulama döngüsü: global hotkey → kayıt → transkripsiyon → temizleme → yapıştırma."""

from __future__ import annotations

import sys
import threading

from pynput import keyboard

from . import cleaner, injector
from .config import Config
from .recorder import Recorder
from .transcriber import Transcriber


def _beep(frequency: int, enabled: bool) -> None:
    if not enabled:
        return
    if sys.platform == "win32":
        import winsound

        winsound.Beep(frequency, 120)
    elif sys.platform == "darwin":
        import subprocess

        # Yüksek ton = kayıt başladı, düşük ton = kayıt bitti.
        sound = "Tink" if frequency >= 800 else "Bottle"
        subprocess.Popen(
            ["afplay", f"/System/Library/Sounds/{sound}.aiff"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
    else:
        print("\a", end="", flush=True)


def _parse_key(name: str) -> keyboard.Key | keyboard.KeyCode:
    try:
        return keyboard.Key[name.lower()]
    except KeyError:
        return keyboard.KeyCode.from_char(name)


class LocalFlowApp:
    def __init__(self, cfg: Config) -> None:
        self.cfg = cfg
        self.recorder = Recorder(cfg.sample_rate, cfg.input_device)
        self.transcriber = Transcriber(cfg)
        self._busy = threading.Lock()
        self._toggle_lock = threading.Lock()  # toggle+hold aynı anda tetiklenirse

    # ── kayıt kontrolü ────────────────────────────────────────────────
    def toggle(self) -> None:
        with self._toggle_lock:
            if self.recorder.recording:
                self._stop_and_process()
            else:
                self._start()

    def _spawn_toggle(self) -> None:
        # Kısayol geri çağrıları OS klavye kancası içinde çalışır; ses aygıtı
        # açmak gibi yavaş işler kancayı bloklarsa Windows kancayı düşürebilir.
        threading.Thread(target=self.toggle, daemon=True).start()

    def _hold_start(self) -> None:
        with self._toggle_lock:
            if not self.recorder.recording:
                self._start()

    def _hold_stop(self) -> None:
        with self._toggle_lock:
            if self.recorder.recording:
                self._stop_and_process()

    def _start(self) -> None:
        if not self._busy.acquire(blocking=False):
            print("[local-flow] önceki dikte hâlâ işleniyor, bekleyin…")
            return
        try:
            self.recorder.start()
        except Exception as exc:  # aygıt meşgul/çekilmiş: uygulama ölmesin
            self._busy.release()
            print(f"[local-flow] ⚠️ mikrofon açılamadı: {exc}")
            return
        _beep(880, self.cfg.beep)
        print("[local-flow] 🎙️  kayıt başladı — durdurmak için kısayola tekrar basın.")

    def _stop_and_process(self) -> None:
        try:
            audio = self.recorder.stop()
        except Exception as exc:
            self._busy.release()
            print(f"[local-flow] ⚠️ kayıt durdurulamadı: {exc}")
            return
        _beep(660, self.cfg.beep)
        print(f"[local-flow] kayıt bitti ({audio.size / self.cfg.sample_rate:.1f} sn), işleniyor…")
        # Transkripsiyonu ayrı thread'de yap ki hotkey dinleyicisi bloklanmasın.
        threading.Thread(target=self._process, args=(audio,), daemon=True).start()

    def _process(self, audio) -> None:
        try:
            text = self.transcriber.transcribe(audio)
            text = cleaner.clean(text, self.cfg)
            if text:
                injector.inject(text, self.cfg.paste, self.cfg.restore_clipboard)
                print(f"[local-flow] ✅ {text}")
            else:
                print("[local-flow] (konuşma algılanmadı)")
        finally:
            self._busy.release()

    # ── kısayol dinleyicileri ─────────────────────────────────────────
    def run(self) -> None:
        self.transcriber.warm_up()
        listeners: list[keyboard.Listener] = []

        if self.cfg.hotkey:
            listeners.append(keyboard.GlobalHotKeys({self.cfg.hotkey: self._spawn_toggle}))
            print(f"[local-flow] toggle kısayolu: {self.cfg.hotkey}")

        if self.cfg.hold_key:
            hold = _parse_key(self.cfg.hold_key)

            def on_press(key) -> None:
                if key == hold and not self.recorder.recording:
                    threading.Thread(target=self._hold_start, daemon=True).start()

            def on_release(key) -> None:
                if key == hold and self.recorder.recording:
                    threading.Thread(target=self._hold_stop, daemon=True).start()

            listeners.append(keyboard.Listener(on_press=on_press, on_release=on_release))
            print(f"[local-flow] basılı-tut kısayolu: {self.cfg.hold_key}")

        for listener in listeners:
            listener.start()
        print("[local-flow] hazır. Çıkmak için Ctrl+C.")
        try:
            for listener in listeners:
                listener.join()
        except KeyboardInterrupt:
            print("\n[local-flow] kapatılıyor.")
