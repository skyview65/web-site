"""Yapılandırma: config.json (çalışma dizini) > ~/.local-flow.json > varsayılanlar."""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path


@dataclass
class OllamaConfig:
    """Opsiyonel yerel LLM temizleme katmanı (Wispr'ın bulut LLM'inin yerel karşılığı)."""

    enabled: bool = False
    url: str = "http://localhost:11434"
    model: str = "llama3.2"
    timeout_s: float = 20.0
    prompt: str = (
        "Aşağıdaki dikte transkriptini düzelt: dolgu sözcüklerini sil, noktalama ve"
        " büyük/küçük harfleri düzelt, anlamı ve dili DEĞİŞTİRME, sadece düzeltilmiş"
        " metni döndür.\n\nTranskript: {text}"
    )


@dataclass
class Config:
    # faster-whisper model boyutu: tiny, base, small, medium, large-v3, distil-*
    model: str = "small"
    device: str = "auto"          # auto | cpu | cuda
    compute_type: str = "default" # default | int8 | float16 ...
    language: str | None = None   # None = otomatik algıla; "tr", "en", ...

    # Kısayollar
    hotkey: str = "<ctrl>+<shift>+<space>"  # bas-başlat / bas-durdur (toggle)
    hold_key: str | None = None             # ör. "f8": basılı tutarak konuş

    # Ses
    sample_rate: int = 16000
    input_device: int | str | None = None   # None = varsayılan mikrofon

    # Çıkış davranışı
    paste: bool = True             # aktif uygulamaya Ctrl+V ile yapıştır
    restore_clipboard: bool = True # yapıştırdıktan sonra eski panoyu geri yükle
    beep: bool = True              # kayıt başlangıç/bitişinde sesli geri bildirim

    # Temizleme
    clean_fillers: bool = True
    ollama: OllamaConfig = field(default_factory=OllamaConfig)

    @classmethod
    def load(cls, path: Path | None = None) -> "Config":
        candidates = [path] if path else [Path("config.json"), Path.home() / ".local-flow.json"]
        for candidate in candidates:
            if candidate and candidate.is_file():
                data = json.loads(candidate.read_text(encoding="utf-8"))
                ollama = OllamaConfig(**data.pop("ollama", {}))
                cfg = cls(**data, ollama=ollama)
                print(f"[local-flow] yapılandırma yüklendi: {candidate}")
                return cfg
        return cls()
