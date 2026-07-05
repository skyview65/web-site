# Wispr Flow — Mimari Analizi ve Yerel Eşdeğeri

> Araştırma tarihi: 2026-07-03. Bu doküman, `local-flow/` (masaüstü) ve `/dictation`
> (tarayıcı) yerel sürümlerinin tasarım temelini oluşturur.

## Wispr Flow Nedir?

[Wispr Flow](https://wisprflow.ai/), her uygulamanın içinde çalışan bir "AI voice
keyboard": bir kısayola basarsın, konuşursun, temizlenmiş ve biçimlendirilmiş metin
imlecin olduğu yere yazılır (Gmail, Slack, VS Code, herhangi bir form). ~220 WPM,
yani ortalama yazma hızının ~4 katı olarak pazarlanır. Mac, Windows, iOS ve
Android'de mevcuttur.

## Gerçek Ürünün Mimarisi (İşlem Hattı)

```
┌────────────────┐   ┌──────────────┐   ┌───────────────────────┐   ┌──────────────────┐
│ Global hotkey  │ → │ Mikrofon     │ → │ BULUT: ASR (Whisper   │ → │ BULUT: LLM       │
│ (push-to-talk) │   │ kaydı        │   │ tabanlı transkripsiyon)│   │ temizleme/format │
└────────────────┘   └──────────────┘   └───────────────────────┘   └────────┬─────────┘
                                                                             ↓
                                                          ┌──────────────────────────────┐
                                                          │ Metin enjeksiyonu: aktif     │
                                                          │ uygulamaya yapıştırma        │
                                                          │ (accessibility / klavye sim.)│
                                                          └──────────────────────────────┘
```

1. **Masaüstü istemci** (Electron tabanlı) — sistem tepsisinde oturur, global
   hotkey'i dinler (macOS'ta varsayılan `fn`).
2. **Ses yakalama** — hotkey basılıyken mikrofon akışı kaydedilir.
3. **Bulut ASR** — ses Wispr sunucularına gönderilir; Whisper tabanlı model
   transkribe eder. **Offline modu yoktur**: her oturumda tüm konuşma işleme
   buluttan geçer.
4. **Çok katmanlı AI temizleme** — ayrı bir LLM katmanı dolgu sözcükleri
   ("um", "uh") siler, cümle yapısını düzeltir, aktif uygulamaya göre ton/format
   uygular (ör. Slack'te gündelik, e-postada resmî).
5. **Metin enjeksiyonu** — sonuç, işletim sistemi erişilebilirlik API'leri /
   klavye simülasyonu ile imlecin bulunduğu alana yazılır.
6. **Kişiselleştirme** — özel sözlük (isimler, jargon), otomatik dil algılama
   (100+ dil), "tone matching".

### Gizlilik modeli

Varsayılan modda ses/transkript Wispr sunucularında işlenir; "Privacy Mode"
açıldığında veri saklama/eğitim kullanımı kapatılır — ama işleme yine bulutta
olur. **Tamamen yerel çalışma seçeneği yoktur.** Bu proje tam olarak bu boşluğu
kapatır.

## Yerel Sürümün Mimarisi (bu repo)

Aynı işlem hattı — konuşma verisi için sıfır ağ isteği (model ağırlıkları
yalnızca ilk kurulumda bir kez indirilir, sonrası tamamen çevrimdışı):

| Wispr Flow katmanı | Yerel eşdeğer (masaüstü: `local-flow/`) | Tarayıcı demo (`/dictation`) |
| --- | --- | --- |
| Electron istemci | Python + `pynput` (global hotkey) | Next.js sayfası (sekme içi) |
| Mikrofon kaydı | `sounddevice` (16 kHz mono PCM) | `getUserMedia` + `AudioContext` |
| Bulut ASR | **faster-whisper** (CTranslate2, CPU/GPU, cihaz üstü) | **transformers.js** Whisper (WebGPU/WASM, cihaz üstü) |
| Bulut LLM temizleme | Kural tabanlı dolgu temizliği + opsiyonel **Ollama** (yerel LLM) | Kural tabanlı dolgu temizliği |
| Metin enjeksiyonu | Pano + `Ctrl+V` simülasyonu (`pyperclip` + `pynput`) | Panoya kopyala butonu |

### Neden bu araçlar?

- **faster-whisper**: OpenAI Whisper'ın CTranslate2 ile yeniden uygulanması;
  aynı doğrulukta ~4x hız, int8 kuantizasyonla CPU'da bile saniye altı gecikmeye
  yaklaşır. Açık kaynak yerel Wispr Flow alternatiflerinin (whisper-local,
  OpenWhispr, VoiceTypr) fiilî standardı.
- **pynput**: Windows/macOS/Linux'ta tek API ile global hotkey + tuş simülasyonu.
- **Pano üzerinden yapıştırma**: karakter karakter yazmaktan (keystroke
  injection) çok daha hızlı ve Türkçe karakterlerle sorunsuz.
- **Ollama (opsiyonel)**: Wispr'ın bulut LLM biçimlendirme katmanının yerel
  karşılığı; kurulu değilse araç kural tabanlı temizlikle devam eder.
- **transformers.js**: Whisper ONNX modellerini tarayıcıda WebGPU (yoksa WASM)
  ile çalıştırır; model ağırlıkları ilk açılışta bir kez indirilir, sonrası
  tamamen çevrimdışıdır. Ses hiçbir zaman sekmeden çıkmaz.

### Bilinçli farklar

- Tarayıcı demo, tarayıcı sandbox'ı gereği diğer uygulamalara sistem genelinde
  yazamaz — sistem geneli dikte masaüstü aracının işidir.
- "Tone matching / uygulamaya göre format" yerine tek, yapılandırılabilir
  temizleme istemi (Ollama) kullanılır: daha öngörülebilir, tamamen yerel.

## Kaynaklar

- [Wispr Flow resmî site](https://wisprflow.ai/)
- [Wispr Flow inceleme — tldv](https://tldv.io/blog/wisprflow/) (bulut-only işleme, işlem hattı)
- [Wispr Flow inceleme — Willow](https://willowvoice.com/blog/wispr-flow-review-voice-dictation) (Privacy Mode ayrıntıları)
- [whisper-local](https://github.com/drajb/whisper-local), [OpenWhispr](https://github.com/OpenWhispr/openwhispr), [VoiceTypr](https://github.com/moinulmoin/voicetypr), [FreeFlow](https://github.com/zachlatta/freeflow) — açık kaynak yerel alternatiflerin mimari incelemesi
