"""Cihaz üstü transkripsiyon: faster-whisper (CTranslate2). Ses hiçbir yere gönderilmez."""

from __future__ import annotations

import numpy as np

from .config import Config


class Transcriber:
    def __init__(self, cfg: Config) -> None:
        self.cfg = cfg
        self._model = None  # tembel yükleme: ilk dikteye kadar RAM harcama

    def _load(self):
        if self._model is None:
            from faster_whisper import WhisperModel

            print(f"[local-flow] model yükleniyor: {self.cfg.model} ({self.cfg.device})…")
            self._model = WhisperModel(
                self.cfg.model,
                device=self.cfg.device,
                compute_type=self.cfg.compute_type,
            )
            print("[local-flow] model hazır.")
        return self._model

    def warm_up(self) -> None:
        """Modeli baştan yükle ki ilk dikte beklemesin."""
        self._load()

    def transcribe(self, audio: np.ndarray) -> str:
        if audio.size < self.cfg.sample_rate // 4:  # < 0.25 sn: gürültü, atla
            return ""
        model = self._load()
        segments, info = model.transcribe(
            audio,
            language=self.cfg.language,
            beam_size=5,
            vad_filter=True,
        )
        text = " ".join(segment.text.strip() for segment in segments).strip()
        if text:
            print(f"[local-flow] dil: {info.language} (p={info.language_probability:.2f})")
        return text
