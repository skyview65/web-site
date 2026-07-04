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

## Kurulum (Windows) — uygulama gibi, en kolay yol

1. Bu depoyu indir: GitHub'da **Code → Download ZIP**, sonra ZIP'i çıkart
   (komut satırı ya da Git gerekmez).
2. `local-flow` klasörüne gir, **`local-flow.bat`** dosyasına çift tıkla.
   Bu tek seferlik kurulum: Python yoksa kurmayı dener (winget), sanal ortamı
   oluşturur, paketleri yükler (birkaç dakika) ve masaüstüne bir **local-flow**
   kısayolu ekleyip uygulamayı başlatır.
3. Bundan sonrası tam bir uygulama gibi: masaüstündeki **local-flow**
   kısayoluna çift tıkla — konsol penceresi açılmaz, görev çubuğunda saatin
   yanındaki **sistem tepsisine** küçük bir yuvarlak ikon gelir.

Tepsi ikonunun rengi durumu gösterir: 🟢 hazır · 🔴 dinliyor ·
🔵 yazıya dökülüyor · 🟠 model yükleniyor/sorun. İkona sağ tıklayınca
**Ayarları aç** (config.json) ve **Çıkış** seçenekleri çıkar. Loglar:
`%USERPROFILE%\.local-flow\local-flow.log`.

Python hiç kurulu değilse ve winget de yoksa (ör. çok eski Windows), önce
[python.org](https://www.python.org/downloads/) üzerinden Python 3.10+ kur
("Add python.exe to PATH" işaretli), sonra `local-flow.bat`'a tekrar çift
tıkla.

### Kurulum (Windows) — komut satırıyla

Gereksinim: [Python 3.10+](https://www.python.org/downloads/) (kurulumda
"Add python.exe to PATH" işaretli olsun).

```powershell
cd local-flow
python -m venv .venv
.venv\Scripts\pip install -e ".[tray]"
```

Çalıştır: sistem tepsisinde `.venv\Scripts\local-flow-tray`, konsolda
`.venv\Scripts\local-flow` (hata ayıklama çıktısı görmek için)

> PowerShell'de `.venv\Scripts\activate` kullanmak istersen ve
> "running scripts is disabled" hatası alırsan, önce bir kez şunu çalıştır:
> `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

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

> **Not:** Varsayılan `Ctrl+Alt+Space` kısayolu bazı kurulumlarda giriş
> kaynağı değiştirmeyle çakışabilir; `config.json` içinde örneğin
> `"hotkey": "<cmd>+<shift>+<space>"` veya `"hold_key": "f8"` kullanabilirsin
> (F tuşları için *Klavye → F1, F2 tuşlarını standart işlev tuşu olarak kullan*
> açık olmalı).

### Otomatik başlatma (launchd)

Oturum açılışında kendiliğinden başlasın istersen:

```bash
mkdir -p ~/Library/LaunchAgents
sed "s|__LOCAL_FLOW_DIR__|$(pwd)|g" launchd/com.localflow.dictation.plist \
  > ~/Library/LaunchAgents/com.localflow.dictation.plist
launchctl load ~/Library/LaunchAgents/com.localflow.dictation.plist
```

Kaldırmak için: `launchctl unload ~/Library/LaunchAgents/com.localflow.dictation.plist`

> **TCC uyarısı:** launchd ile başlatıldığında izinler Terminal'e değil,
> doğrudan `.venv` içindeki `python` ikilisine sorulur/verilir. İlk launchd
> başlangıcında macOS'un çıkardığı izin istemlerini onayla; istem gelmezse
> *Gizlilik ve Güvenlik* altındaki Mikrofon/Erişilebilirlik/Giriş İzleme
> listelerine `.venv/bin/python3`'ü elle ekle. Sorun giderme için log:
> `tail -f /tmp/local-flow.err.log`

Apple Silicon (M1–M4) notu: faster-whisper CPU'da int8 ile çalışır ve M
serisinde `small` model gerçek zamandan hızlıdır; `"compute_type": "int8"`
önerilir. GPU (CUDA) yolu yalnızca NVIDIA içindir, macOS'ta gerekmez.

## Çalıştırma

Windows'ta masaüstündeki **local-flow** kısayoluna çift tıkla (kurulum onu
otomatik oluşturur) — sistem tepsisinde sessizce çalışır, konsol açılmaz.
Komut satırından kurduysan: `local-flow` (macOS/Linux) veya
`.venv\Scripts\local-flow` (Windows, konsollu hata-ayıklama modu).

İlk çalıştırmada Whisper `small` modeli (~460 MB) bir kez indirilir ve
`%USERPROFILE%\.cache\huggingface` altında saklanır — sonrası tamamen
çevrimdışı. İndirme sırasında tepsi ikonu 🟠 "model yükleniyor" durumunda
kalır; 🟢 olunca hazırdır.

Kullanım:

1. İmleci yazmak istediğin yere koy (herhangi bir uygulama).
2. **Ctrl+Alt+Space** → yüksek bip: kayıt başladı, konuş.
3. Tekrar **Ctrl+Alt+Space** → düşük bip: transkripsiyon + yapıştırma otomatik.

Windows başlangıcında otomatik başlatmak istersen: masaüstündeki kısayolu
kopyalayıp `Win+R` → `shell:startup` → Enter ile açılan klasöre yapıştır.

## Yapılandırma

`config.example.json` dosyasını `config.json` olarak kopyala (çalıştırdığın
dizinde ya da `~/.local-flow.json` olarak) ve düzenle:

| Alan | Varsayılan | Açıklama |
| --- | --- | --- |
| `model` | `small` | `tiny`/`base` daha hızlı, `medium`/`large-v3` daha isabetli |
| `language` | `null` | `null` = otomatik; sadece Türkçe için `"tr"` yaz (daha hızlı ve tutarlı) |
| `hotkey` | `<ctrl>+<alt>+<space>` | Toggle kısayolu (pynput sözdizimi) |
| `hold_key` | `null` | ör. `"f8"`: Wispr gibi **basılı tutarak** konuş, bırakınca yazsın |
| `device` | `auto` | NVIDIA GPU varsa `cuda`; yoksa CPU |
| `paste` | `true` | `false`: yapıştırma yerine yalnızca panoya kopyala |
| `restore_clipboard` | `true` | Yapıştırdıktan sonra eski pano içeriğini geri yükle |
| `clean_fillers` | `true` | "um, ııı, eee" gibi dolgu seslerini sil |
| `ollama.enabled` | `false` | Yerel LLM ile noktalama/format düzeltme (aşağıya bak) |

Mikrofon seçimi: `local-flow --list-devices` (Windows'ta `local-flow.bat
--list-devices` da olur) ile numarayı bul, `input_device` alanına yaz.
Ayarlara en kolay erişim: tepsi ikonuna sağ tık → **Ayarları aç**; değişiklik
sonrası tepsiden **Çıkış** yapıp kısayoldan yeniden başlat.

### Model seçimi (Windows, CPU)

| Model | Boyut | Türkçe isabet | Hız (CPU) |
| --- | --- | --- | --- |
| `tiny` | 75 MB | zayıf | çok hızlı |
| `base` | 145 MB | orta | hızlı |
| `small` | 460 MB | iyi ✅ | makul |
| `medium` | 1.5 GB | çok iyi | yavaş |
| `large-v3` | 3 GB | en iyi | GPU önerilir |

### NVIDIA GPU hızlandırma (opsiyonel)

- **Linux:** `pip install nvidia-cublas-cu12 nvidia-cudnn-cu12` yeterlidir.
- **Windows:** pip'teki `nvidia-*` paketleri Linux içindir; [CUDA 12](https://developer.nvidia.com/cuda-downloads)
  ve [cuDNN 9](https://developer.nvidia.com/cudnn) kurup DLL'lerin `PATH`'te
  olduğundan emin ol (ayrıntı: [faster-whisper GPU notları](https://github.com/SYSTRAN/faster-whisper#gpu)).

Sonra `config.json` içinde `"device": "cuda", "compute_type": "float16"`.
GPU'suz da gayet kullanılabilir — `small` model modern CPU'larda gerçek
zamandan hızlıdır.

### Ollama ile LLM temizleme (opsiyonel)

Wispr Flow'un bulut LLM biçimlendirme katmanının yerel karşılığı:

```powershell
winget install Ollama.Ollama
ollama pull llama3.2
```

sonra `config.json` içinde `"ollama": { "enabled": true, ... }`. Ollama
çalışmıyorsa araç kural tabanlı temizlikle devam eder — dikte asla bloke olmaz.

## Linux notları

- Gerekli paketler: `sudo apt install libportaudio2 xclip` (Wayland'da `xclip`
  yerine `wl-clipboard`). `xclip`/`wl-clipboard` yoksa yapıştırma yapılamaz;
  araç metni terminale basar.
- **Wayland:** pynput global klavye dinleme Wayland'da güvenilir değildir
  (güvenlik modeli gereği); X11 oturumu ya da XWayland altında çalışan
  uygulamalar önerilir.
- **Terminale dikte:** çoğu terminal emülatörü `Ctrl+V` ile yapıştırmaz;
  terminal kullanacaksan `"paste": false` yapıp `Ctrl+Shift+V` ile elle
  yapıştır.

## Sorun giderme

- **Yapıştırma olmuyor:** bazı uygulamalar (yönetici olarak çalışan pencereler)
  normal süreçten tuş girdisi kabul etmez; terminali yönetici olarak başlat.
- **Kayıt boş dönüyor:** doğru mikrofonu `--list-devices` ile doğrula; Windows
  *Ayarlar → Gizlilik → Mikrofon* altında masaüstü uygulamalarına izin ver.
- **İlk dikte yavaş:** model ilk açılışta RAM'e yüklenir; sonrakiler hızlıdır.
- **Kısayol odaktaki uygulamaya da gidiyor:** global dinleyici tuşları
  "yutamaz"; `Ctrl+Alt+Space` odaktaki uygulamada bir şey tetikliyorsa
  çakışmayan bir kombinasyon (ör. `"hold_key": "f8"`) seç.
- **Pano içeriği:** yapıştırma panoya yazarak yapılır; önceki *metin* içeriği
  ~1 sn sonra geri yüklenir, metin dışı içerik (görsel vb.) geri yüklenmez.
