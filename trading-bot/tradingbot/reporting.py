"""Grafik / raporlama yardımcıları (matplotlib, başsız/headless-güvenli)."""

from __future__ import annotations

from pathlib import Path

import pandas as pd


def plot_equity(curves: dict[str, pd.Series], path: str | Path, title: str = "Özsermaye eğrisi") -> Path:
    """Bir veya daha fazla özsermaye (equity) eğrisinin karşılaştırmasını bir PNG dosyasına kaydeder. Yolu döndürür."""
    import matplotlib

    matplotlib.use("Agg")  # ekran gerekmiyor
    import matplotlib.pyplot as plt

    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)

    fig, ax = plt.subplots(figsize=(11, 5.5), dpi=130)
    for name, curve in curves.items():
        if curve is None or len(curve) == 0:
            continue
        norm = curve / curve.iloc[0]
        ax.plot(norm.index, norm.to_numpy(), label=name, linewidth=1.4)
    ax.set_title(title)
    ax.set_ylabel("1 birimin büyümesi")
    ax.grid(True, alpha=0.25)
    ax.legend(loc="upper left", fontsize=9)
    fig.autofmt_xdate()
    fig.tight_layout()
    fig.savefig(path)
    plt.close(fig)
    return path
