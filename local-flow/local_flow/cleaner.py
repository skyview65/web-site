"""Metin temizleme: kural tabanlı dolgu temizliği + opsiyonel yerel LLM (Ollama).

Wispr Flow'un bulut LLM biçimlendirme katmanının yerel karşılığı. Ollama
çalışmıyorsa sessizce kural tabanlı sonuca düşer — dikte asla bloke olmaz.
"""

from __future__ import annotations

import json
import re
import urllib.error
import urllib.request

from .config import Config

# Yalnızca saf dolgu sesleri — "yani", "şey" gibi gerçek sözcüklere dokunma.
_FILLER_RE = re.compile(
    r"\b(u+m+|u+h+|e+r+m+|h+m+|m+h+m+|e{2,}|ı{2,}|a{3,}|ö+ö+)\b[,.]?\s*",
    re.IGNORECASE,
)
_SPACE_BEFORE_PUNCT_RE = re.compile(r"\s+([,.;:!?])")


def strip_fillers(text: str) -> str:
    text = _FILLER_RE.sub("", text)
    text = _SPACE_BEFORE_PUNCT_RE.sub(r"\1", text)
    return re.sub(r"\s{2,}", " ", text).strip()


def ollama_clean(text: str, cfg: Config) -> str:
    """Metni yerel Ollama LLM'den geçirir; hata durumunda girdiyi aynen döndürür."""
    payload = json.dumps(
        {
            "model": cfg.ollama.model,
            "messages": [{"role": "user", "content": cfg.ollama.prompt.format(text=text)}],
            "stream": False,
        }
    ).encode("utf-8")
    request = urllib.request.Request(
        f"{cfg.ollama.url.rstrip('/')}/api/chat",
        data=payload,
        headers={"Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(request, timeout=cfg.ollama.timeout_s) as response:
            data = json.loads(response.read().decode("utf-8"))
        cleaned = data.get("message", {}).get("content", "").strip()
        return cleaned or text
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError, OSError) as exc:
        print(f"[local-flow] Ollama atlandı ({exc}); ham transkript kullanılıyor.")
        return text


def clean(text: str, cfg: Config) -> str:
    if cfg.clean_fillers:
        text = strip_fillers(text)
    if text and cfg.ollama.enabled:
        text = ollama_clean(text, cfg)
    return text
