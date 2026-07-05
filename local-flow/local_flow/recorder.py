"""Mikrofon kaydı: 16 kHz mono float32 PCM, tamamen bellekte — diske yazılmaz."""

from __future__ import annotations

import threading

import numpy as np
import sounddevice as sd


class Recorder:
    def __init__(self, sample_rate: int = 16000, input_device: int | str | None = None) -> None:
        self.sample_rate = sample_rate
        self.input_device = input_device
        self._frames: list[np.ndarray] = []
        self._lock = threading.Lock()
        self._stream: sd.InputStream | None = None

    @property
    def recording(self) -> bool:
        return self._stream is not None

    def start(self) -> None:
        if self._stream is not None:
            return
        self._frames = []

        def callback(indata: np.ndarray, _frames: int, _time, status) -> None:
            if status:
                print(f"[local-flow] ses uyarısı: {status}")
            with self._lock:
                self._frames.append(indata.copy())

        self._stream = sd.InputStream(
            samplerate=self.sample_rate,
            channels=1,
            dtype="float32",
            device=self.input_device,
            callback=callback,
        )
        self._stream.start()

    def stop(self) -> np.ndarray:
        """Kaydı durdurur ve mono float32 dizi döndürür (boşsa uzunluğu 0)."""
        if self._stream is None:
            return np.zeros(0, dtype=np.float32)
        self._stream.stop()
        self._stream.close()
        self._stream = None
        with self._lock:
            if not self._frames:
                return np.zeros(0, dtype=np.float32)
            audio = np.concatenate(self._frames, axis=0).flatten()
            self._frames = []
        return audio
