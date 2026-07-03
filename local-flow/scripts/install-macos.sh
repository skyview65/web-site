#!/usr/bin/env bash
# local-flow macOS kurulumu: venv oluşturur, paketi kurar, izin adımlarını gösterir.
set -euo pipefail

cd "$(dirname "$0")/.."

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 bulunamadı. Önce Python 3.10+ kurun: https://www.python.org/downloads/ (veya: brew install python)" >&2
  exit 1
fi

PY_VERSION="$(python3 -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")')"
if ! python3 -c 'import sys; sys.exit(0 if sys.version_info >= (3, 10) else 1)'; then
  echo "Python ${PY_VERSION} bulundu; local-flow için 3.10+ gerekli." >&2
  exit 1
fi

echo "==> Sanal ortam oluşturuluyor (.venv)…"
python3 -m venv .venv
# shellcheck disable=SC1091
source .venv/bin/activate

echo "==> Bağımlılıklar kuruluyor…"
pip install --upgrade pip >/dev/null
pip install -e .

cat <<'EOF'

✅ Kurulum tamam. Çalıştırmak için:

    cd local-flow
    source .venv/bin/activate
    local-flow

⚠️  macOS izinleri (ilk çalıştırmadan önce, Sistem Ayarları → Gizlilik ve Güvenlik):
  1. Mikrofon            → Terminal'e (veya iTerm2 vb.) izin ver
  2. Erişilebilirlik     → Terminal'e izin ver (Cmd+V simülasyonu için)
  3. Giriş İzleme        → Terminal'e izin ver (global kısayol için)

İzin verdikten sonra terminali kapatıp yeniden açman gerekebilir.

Oturum açılışında otomatik başlatmak için: README.md → "Otomatik başlatma (launchd)"
EOF
