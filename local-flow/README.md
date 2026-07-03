# local-flow — Tamamen Yerel Wispr Flow

Kısayola bas, konuş, temizlenmiş metin **imlecin olduğu uygulamaya** yapışsın —
Slack, VS Code, tarayıcı, Word, her yerde. [Wispr Flow](https://wisprflow.ai/)
ile aynı akış, tek farkla: **hiçbir veri makinenden çıkmaz.**

```
kısayol → mikrofon → faster-whisper (yerel) → temizleme (kural + opsiyonel Ollama) → Ctrl+V
```

- Ses buluta gönderilmez, diske bile yazılmaz (yalnızca RAM'de işlenir)
- Whisper transkripsiyonu cihaz üstünde (CPU yeter, NVIDIA GPU varsa uçar)
- 100+ dil, otomatik algılama (Türkçe dahil)
- Abonelik yok, hesap yok, telemetri yok

Mimari analiz için: [`docs/research/WISPR_FLOW_ARCHITECTURE.md`](../docs/research/WISPR_FLOW_ARCHITECTURE.md)

## Kurulum (Windows)

Gereksinim: [Python 3.10+](https://www.python.org/downloads/) (kurulumda
"Add python.exe to PATH" işaretli olsun).

```powershell
cd local-flow
python -m venv .venv
.venv\Scripts\activate
pip install -e .
```

## Kurulum (macOS)

Gereksinim: Python 3.10+ (`brew install python` veya python.org).

```bash
cd local-flow
bash scripts/install-macos.sh
```

Script; sanal ortamı kurar, paketi yükler ve izin adımlarını gösterir. Elle
kurmak istersen: `python3 -m venv .venv && source .venv/bin/activate && pip install -e .`

### macOS izinleri (zorunlu)

*Sistem Ayarları → Gizlilik ve Güvenlik* altında, local-flow'u çalıştırdığın
uçbirim uygulamasına (Terminal, iTerm2, …) şu üç izni ver:

| İzin | Neden gerekli |
| --- | --- |
| **Mikrofon** | Ses kaydı |
| **Erişilebilirlik** | `Cmd+V` yapıştırma simülasyonu |
| **Giriş İzleme** | Global kısayolun her uygulamada dinlenmesi |

İzinleri verdikten sonra uçbirimi kapatıp yeniden aç. Yapıştırma macOS'ta
otomatik olarak `Cmd+V` ile yapılır; sesli geri bildirim sistem sesleriyle
(`Tink`/`Bottle`) verilir.

> **Not:** Varsayılan `Ctrl+Shift+Space` kısayolu bazı kurulumlarda giriş
> kaynağı değiştirmeyle çakışabilir; `config.json` içinde örneğin
> `"hotkey": "<cmd>+<shift>+<space>"` veya `"hold_key": "f8"` kullanabilirsin
> (F tuşları için *Klavye → F1, F2 tuşlarını standart işlev tuşu olarak kullan*
> açık olmalı).

### Otomatik başlatma (launchd)

Oturum açılışında kendiliğinden başlasın istersen:

```bash
sed "s|__LOCAL_FLOW_DIR__|$(pwd)|g" launchd/com.localflow.dictation.plist \
  > ~/Library/LaunchAgents/com.localflow.dictation.plist
launchctl load ~/Library/LaunchAgents/com.localflow.dictation.plist
```

Kaldırmak için: `launchctl unload ~/Library/LaunchAgents/com.localflow.dictation.plist`

Apple Silicon (M1–M4) notu: faster-whisper CPU'da int8 ile çalışır ve M
serisinde `small` model gerçek zamandan hızlıdır; `"compute_type": "int8"`
önerilir. GPU (CUDA) yolu yalnızca NVIDIA içindir, macOS'ta gerekmez.

## Çalıştırma

```powershell
local-flow
```

İlk çalıştırmada Whisper `small` modeli (~460 MB) bir kez indirilir ve
`%USERPROFILE%\.cache\huggingface` altında saklanır — sonrası tamamen çevrimdışı.

Kullanım:

1. İmleci yazmak istediğin yere koy (herhangi bir uygulama).
2. **Ctrl+Shift+Space** → yüksek bip: kayıt başladı, konuş.
3. Tekrar **Ctrl+Shift+Space** → düşük bip: transkripsiyon + yapıştırma otomatik.

Windows başlangıcında otomatik başlatmak istersen: `Win+R` → `shell:startup` →
buraya `local-flow`'u çalıştıran bir kısayol koy.

## Yapılandırma

`config.example.json` dosyasını `config.json` olarak kopyala (çalıştırdığın
dizinde ya da `~/.local-flow.json` olarak) ve düzenle:

| Alan | Varsayılan | Açıklama |
| --- | --- | --- |
| `model` | `small` | `tiny`/`base` daha hızlı, `medium`/`large-v3` daha isabetli |
| `language` | `null` | `null` = otomatik; sadece Türkçe için `"tr"` yaz (daha hızlı ve tutarlı) |
| `hotkey` | `<ctrl>+<shift>+<space>` | Toggle kısayolu (pynput sözdizimi) |
| `hold_key` | `null` | ör. `"f8"`: Wispr gibi **basılı tutarak** konuş, bırakınca yazsın |
| `device` | `auto` | NVIDIA GPU varsa `cuda`; yoksa CPU |
| `paste` | `true` | `false`: yapıştırma yerine yalnızca panoya kopyala |
| `restore_clipboard` | `true` | Yapıştırdıktan sonra eski pano içeriğini geri yükle |
| `clean_fillers` | `true` | "um, ııı, eee" gibi dolgu seslerini sil |
| `ollama.enabled` | `false` | Yerel LLM ile noktalama/format düzeltme (aşağıya bak) |

Mikrofon seçimi: `local-flow --list-devices` ile numarayı bul,
`input_device` alanına yaz.

### Model seçimi (Windows, CPU)

| Model | Boyut | Türkçe isabet | Hız (CPU) |
| --- | --- | --- | --- |
| `tiny` | 75 MB | zayıf | çok hızlı |
| `base` | 145 MB | orta | hızlı |
| `small` | 460 MB | iyi ✅ | makul |
| `medium` | 1.5 GB | çok iyi | yavaş |
| `large-v3` | 3 GB | en iyi | GPU önerilir |

### NVIDIA GPU hızlandırma (opsiyonel)

```powershell
pip install nvidia-cublas-cu12 nvidia-cudnn-cu12
```

sonra `config.json` içinde `"device": "cuda", "compute_type": "float16"`.

### Ollama ile LLM temizleme (opsiyonel)

Wispr Flow'un bulut LLM biçimlendirme katmanının yerel karşılığı:

```powershell
winget install Ollama.Ollama
ollama pull llama3.2
```

sonra `config.json` içinde `"ollama": { "enabled": true, ... }`. Ollama
çalışmıyorsa araç kural tabanlı temizlikle devam eder — dikte asla bloke olmaz.

## Linux notları

X11'de kutudan çalışır; Wayland'da global kısayolu masaüstü ortamının kısayol
ayarından `local-flow`'a bağlaman gerekebilir. `sounddevice` için:
`sudo apt install libportaudio2`.

## Sorun giderme

- **Yapıştırma olmuyor:** bazı uygulamalar (yönetici olarak çalışan pencereler)
  normal süreçten tuş girdisi kabul etmez; terminali yönetici olarak başlat.
- **Kayıt boş dönüyor:** doğru mikrofonu `--list-devices` ile doğrula; Windows
  *Ayarlar → Gizlilik → Mikrofon* altında masaüstü uygulamalarına izin ver.
- **İlk dikte yavaş:** model ilk açılışta RAM'e yüklenir; sonrakiler hızlıdır.
