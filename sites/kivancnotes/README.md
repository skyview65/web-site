# Kivancnotes — açılış jeneriği

Tek dosyalık site: `index.html`. Bu not yalnızca açılış jeneriğini anlatır.

## Tek fikir

**Karanlıktan bir şey çözünür ve adını söyler.**

Işık → harfler → çizgi → cümle → sayfaya devir.

Her öğe bu cümleye hizmet eder. Etmeyen çıkarıldı.

```
              K I V A N C   N O T E S
              ───────────────────────
                   LOSE NOTHING.
```

Marka cümlesi jeneriğin içinde. Bu olmadan ekranda sadece bir logo parlar —
yani her sitede gördüğünüz şey. Cümleyle birlikte bir jenerik kartı olur.

## Devir (handoff)

Kritik nokta: perdedeki işaret, perde çekilirken uçup hero'daki işaretin tam
üzerine oturur. İki ayrı yazı değil, tek nesne gibi görünür.

Ölçülen sapma **kelime başına 0.02 px'in altında**, her ekran boyutunda.

Perdedeki harfler tek tek `span`'lara bölündüğü için kerning çiftleri bozulurdu;
bu yüzden `font-kerning:none` hem perdede hem hero'da açık. `letter-spacing:.12em`
zaten uygulandığından görsel fark yok, karşılığında hizalama garanti.

## Zaman çizgisi

Tek saat var: Web Animations API. CSS gecikmeleri ile `setTimeout` arasında
kayma olmaz. Süreler `intro-curtain-control` betiğinin başındadır.

| an (ms) | olan |
|---|---|
| 60 | ışık yükselir |
| 170 | harfler maskeden çıkar (18 ms arayla, kelime arası +60 ms) |
| 200 | harfler aynı anda dışa doğru açılır |
| 620 | ince çizgi açılır |
| 860 | **LOSE NOTHING.** belirir |
| 1660 | çizgi ve cümle çekilir |
| **1760** | **devir başlar**, atmosfer hafifçe yaklaşarak solar |
| 1940 | sayfa perdenin arkasından yükselir |
| 2640 | biter, perde DOM'dan çıkar |

Toplam ~2.6 sn. Ayarlamak için `HOLD` devir anını, `END` kapanışı belirler;
diğer her şey bunlara göre kurgulanmıştır.

## Tipografik açılım

Harfler yükselirken aynı anda merkezden dışa doğru açılır — lockup son
genişliğine oturur. Bu `letter-spacing` ile yapılsaydı her karede yeniden
yerleşim olurdu. Onun yerine her harfin merkeze uzaklığıyla orantılı bir
`translate3d` hesaplanır: aynı tipografik hareket, sıfır yerleşim maliyeti.

Üç katman gerekir: dış katman yatay açılımı, orta katman maskeyi, iç katman
dikey yükselişi taşır. Yatay hareket maskenin dışında kalır, böylece harf
yanlardan kırpılmaz.

## Yumuşatma eğrileri

Her eğrinin bir işi var, rastgele seçilmediler:

| değişken | eğri | nerede |
|---|---|---|
| `reveal` | `cubic-bezier(.16,1,.3,1)` | girişler — uzun, yumuşak kuyruk |
| `ambient` | `cubic-bezier(.22,.61,.36,1)` | ışık — atmosfer |
| `settle` | `cubic-bezier(.32,.72,0,1)` | devir — sekmeden yerine oturur |
| `exit` | `cubic-bezier(.65,0,.35,1)` | perdenin çekilmesi |

Devirde bilinçli olarak yay (spring) yok: sekme, serif bir editoryal markada
oyuncak gibi durur.

## Işık ve renk

Tek ışık kaynağı var. İki ayrı parlama koleksiyon olurdu, tek fikir olmazdı.

Kaynağın şekli görünürse o ışık değil, şekildir — bu yüzden düşüş sekiz kademeye
yayıldı. Zemin sıcak merkezden soğuk kenara gider; merkezin ışık gibi okunmasını
sağlayan şey bu karşıtlık, kahverengi bir yüzey olmaması.

Hero'nun koyu metin gölgesi (`text-shadow`) jenerikte kapalı: sıcak ışığın
üzerinde harf başına koyu leke yapıyordu. Devrin sonunda, zemin artık sayfa
olduğunda yumuşakça geri gelir.

## Dikey hizalama

Çizgi ve cümle işaretin altında durduğu için lockup aşağı kayar. Sabit bir
`margin` yetmez: boşluk yerleşimde (ölçeksiz) durur, grup ise ölçekli büyür.
Bu yüzden kayma JS'te ölçülüp uygulanır. Grup, ekran merkezinin ~%2.5 üstüne —
optik merkeze — oturur.

## Kurallar

- Yalnızca `transform` ve `opacity` canlandırılır. `clip-path`, `filter: blur()`,
  `left` veya `background-position` animasyonu yoktur.
- Film tanesi `transform` ile oynatılır: aynı görüntü, boyama maliyeti sıfır.
- Perde tamamen kapatırken arkadaki ağır zebra dokusu `visibility:hidden` olur
  (`intro-blackout`). Yerleşim korunur, devir ölçümü etkilenmez. Karartma perde
  hâlâ opakken kalkar, dolayısıyla pop-in olmaz.
- Harflere `will-change` verilmez: WAAPI transform animasyonları zaten kendi
  bileşim katmanını oluşturur, 22 harfte ayrıca vermek sadece bellek harcar.

## Ölçüm (headless Chromium, GPU yok — gerçek cihazda daha iyi)

Kare süresi medyanı, 3 koşunun ortancası:

| ekran | önceki (v13) | şimdi |
|---|---|---|
| 1920×1080 | 83.2 ms | **18.6 ms** |
| 1440×900 | 55.7 ms | **17.8 ms** |
| 390×844 | 16.7 ms | 16.7 ms |

## Davranış

- **Müdahale:** tıklama, kaydırma, tuş veya boyut değişimi jeneriği *kesmez*,
  zaman çizgisini 3.4 katına hızlandırır. Devir yine doğru yere oturur (~0.7 sn).
- **İkinci ziyaret:** aynı oturumda 2.4 kat hızlı oynar (~1.1 sn).
- **`prefers-reduced-motion`:** perde hiç kurulmaz, sayfa doğrudan açılır.
- **JS yoksa:** perde `display:none` kalır. Siyah ekranda kilitlenme yoktur.
- **Derin bağlantı / kaydırılmış açılış:** jenerik atlanır.
- **Emniyet:** her yol tıkanırsa 5.5 sn'de perde zorla kaldırılır.

## Bakım

Satır içi betikler CSP `script-src` içinde sha256 ile listelidir. **Herhangi bir
`<script>` içeriğini değiştirdikten sonra** hash'leri yenileyin, yoksa betik
çalışmaz:

```
node scripts/refresh-csp.mjs
```
