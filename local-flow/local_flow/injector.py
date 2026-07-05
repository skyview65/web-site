"""Metin enjeksiyonu: pano + Ctrl+V simülasyonu ile aktif uygulamaya yapıştırma.

Karakter karakter tuş simülasyonu yerine pano kullanılır: çok daha hızlı ve
Türkçe karakterlerle (ı, ş, ğ…) her klavye düzeninde sorunsuz.
"""

from __future__ import annotations

import sys
import time

import pyperclip
from pynput.keyboard import Controller, Key

_keyboard = Controller()


def inject(text: str, paste: bool = True, restore_clipboard: bool = True) -> None:
    if not text:
        return
    previous = ""
    if restore_clipboard:
        try:
            previous = pyperclip.paste()
        except pyperclip.PyperclipException:
            restore_clipboard = False

    try:
        pyperclip.copy(text)
    except pyperclip.PyperclipException as exc:
        # Linux'ta xclip/xsel/wl-clipboard eksikse buraya düşer.
        print(f"[local-flow] ⚠️ panoya erişilemedi ({exc}); metin aşağıda:\n{text}")
        return
    if not paste:
        print("[local-flow] metin panoya kopyalandı (paste=false).")
        return

    time.sleep(0.05)  # panonun oturması için kısa bekleme
    modifier = Key.cmd if sys.platform == "darwin" else Key.ctrl
    with _keyboard.pressed(modifier):
        _keyboard.press("v")
        _keyboard.release("v")

    if restore_clipboard:
        # Yavaş uygulamalar panoyu geç okuyabilir; erken geri yükleme yapıştırmayı
        # bozar. Yalnızca metin içerikleri geri yüklenir (görsel vb. kaybolur).
        time.sleep(0.8)
        pyperclip.copy(previous)
