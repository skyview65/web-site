# Kivancnotes — açılış animasyonu

Tek dosyalık site: `index.html`. Bu not yalnızca açılış perdesini anlatır.

## Fikir

Karanlık oda → sıcak bir lamba yükselir → kelimeler maskenin altından çıkar →
ince çizgi açılır → perde çekilirken kelime işareti **uçarak hero'daki yerine oturur**.

Kritik nokta devir (handoff): perdedeki işaret ile hero'daki işaret aynı nesne gibi
görünür. Kesme, yeniden çizim veya ikinci bir giriş yoktur. Ölçülen sapma **0.00 px**.

## Zaman çizgisi

Tek saat vardır: Web Animations API. CSS gecikmeleri ile `setTimeout` arasında
kayma olmaz. Süreler `intro-curtain-control` betiğinin başındadır.

| an (ms) | olan |
|---|---|
| 60 | lamba yükselir |
| 200 / 295 | KIVANC, sonra NOTES maskeden çıkar |
| 360 | ışık sızması kadrajı geçer |
| 560 | ince çizgi açılır |
| 1140 | karartma kalkar, ölçüm alınır |
| 1180 | **devir başlar**, perde çekilir |
| 1330 | sayfa perdenin arkasından yükselir |
| 2120 | biter, perde DOM'dan çıkar |

Toplam ~2.1 sn; sayfa ~1.3 sn'de görünmeye başlar. (Önceki sürüm 3.86 sn idi.)

Ayarlamak için: `HOLD` devir anını, `END` kapanışı belirler. Diğer her şey
bunlara göre kurgulanmıştır.

## Yumuşatma eğrileri

Her eğrinin bir işi var, rastgele seçilmediler:

| değişken | eğri | nerede |
|---|---|---|
| `reveal` | `cubic-bezier(.16,1,.3,1)` | girişler — uzun, yumuşak kuyruk |
| `ambient` | `cubic-bezier(.22,.61,.36,1)` | lamba, ışık — atmosfer |
| `settle` | `cubic-bezier(.32,.72,0,1)` | devir — sekmeden yerine oturur |
| `exit` | `cubic-bezier(.65,0,.35,1)` | perdenin çekilmesi |

Devirde bilinçli olarak yay (spring) yoktur: sekme, serif bir editoryal markada
oyuncak gibi durur.

## Kurallar

- Yalnızca `transform` ve `opacity` canlandırılır. `clip-path`, `filter: blur()`,
  `left` veya `background-position` animasyonu yoktur — hepsi her karede
  yeniden boyama demektir.
- Film tanesi `background-position` ile değil `transform` ile oynatılır: aynı
  görüntü, boyama maliyeti sıfır.
- Perde tamamen kapatırken arkadaki ağır zebra dokusu `visibility: hidden`
  olur (`intro-blackout`). Yerleşim korunur, yani devir ölçümü etkilenmez.
  En büyük tek kazanç buydu.

## Ölçüm (headless Chromium, GPU yok — gerçek cihazda daha iyi)

| ekran | önceki (v13) | şimdi |
|---|---|---|
| 1920×1080 | 81.3 ms / kare | **18.3 ms** |
| 1440×900 | 54.4 ms | **16.9 ms** |
| 390×844 | 16.7 ms | 16.7 ms |

## Davranış

- **Müdahale:** tıklama, kaydırma, tuş veya boyut değişimi perdeyi *kesmez*,
  zaman çizgisini 3.2 katına hızlandırır. Devir yine doğru yere oturur (~0.6 sn).
- **İkinci ziyaret:** aynı oturumda açılış 2.3 kat hızlı oynar (~1.0 sn).
- **`prefers-reduced-motion`:** perde hiç kurulmaz, sayfa doğrudan açılır.
- **JS yoksa:** perde `display:none` kalır, sayfa normal açılır. Siyah ekranda
  kilitlenme yoktur.
- **Derin bağlantı / kaydırılmış açılış:** perde atlanır.
- **Emniyet:** her yol tıkanırsa 5 sn'de perde zorla kaldırılır.

## Bakım

Satır içi betikler CSP `script-src` içinde sha256 ile listelidir. **Herhangi bir
`<script>` içeriğini değiştirdikten sonra** hash'leri yenileyin, yoksa betik
çalışmaz:

```
node scripts/refresh-csp.mjs
```
