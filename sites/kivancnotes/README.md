# Kivancnotes — açılış jeneriği

Tek dosyalık site: `index.html`. Bu not yalnızca açılış jeneriğini anlatır.

## Tek fikir

**Karanlıktan bir şey çözünür ve adını söyler.**

Işık → harfler → ışık dikişi → cümle → sayfaya devir. Hareket hiçbir noktada durmaz.

Her öğe bu cümleye hizmet eder. Etmeyen çıkarıldı.

```
              K I V A N C   N O T E S
                 ·  ışık dikişi  ·
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
| 40 | ışık yükselir |
| 180 | harfler maskeden çıkar (aralık kuyruğa doğru sıkışır) |
| 215 | harfler aynı anda dışa doğru açılır |
| 680 | ışık dikişi açılır |
| 800 | dağılmış ışık dikişe odaklanır |
| 1020 | **LOSE NOTHING.** belirir |
| 2400 | cümle ve dikiş çözünerek çekilir |
| **2560** | **devir başlar**, atmosfer solar |
| 2800 | sayfa perdenin arkasından yükselir |
| 3660 | biter, perde DOM'dan çıkar |

Toplam ~3.5 sn. Cümle **1011 ms tam opak** durur, 1.7 sn ekranda kalır.
İlk sürümde bu süre 220 ms'ti ve cümle gözden kaçıyordu.
Ayarlamak için `HOLD` devir anını, `END` kapanışı belirler; diğer her şey
bunlara göre kurgulanmıştır.

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

## Akışkanlık: kart hiç durmaz

İlk sürümde kart 1300–1860 ms arası **tamamen donuyordu** — hiçbir şey
kıpırdamıyor, sonra devir sıfır hızdan başlıyordu. Akışkanlığı kıran şey
durup yeniden başlamaktı.

Şimdi kart, devre kadar çok yavaş yaklaşır (`PUSH = 1.05`, hızlanan bir
eğriyle). Hareket hiç kesilmediği için devir de sıfırdan değil, var olan
hareketin üzerinden başlar. Ölçüm: en uzun durgun an **141 ms** ve o da
henüz hiçbir şeyin başlamadığı en baştaki boşluk.

Bu, devir matematiğini de değiştirdi: ölçek artık sabit olmadığı için
`big` güncel değeri vermiyor. O andaki gerçek ölçek ölçümden türetiliyor
(`sNow = now.w / base.w`), böylece iniş yine piksel hassas kalıyor.

Eğriler de yumuşatıldı. Önceki takım hızlı başlayıp aniden yavaşlıyordu
(expo-out'un t=0 eğimi 6'nın üzerinde). Yenisinde başlangıç eğimi 2
civarında: hareket yumuşak başlar, uzun ve düzgün söner.

## Ayırıcı: ışık dikişi

İşaretle cümle arasında çizilmiş bir çizgi yok. Kartın tek fikri "ışık ortaya
çıkarır" olduğu için çizilmiş bir grafik yabancı durur; yüzeyden sızan bir ışık
durmaz. Ayrıca logo + ince çizgi + slogan üçlüsü jenerik bir şablondur.

İki parça: ince bir çekirdek (1 px, merkezde parlak, uçlarda yok olan) ve onu
saran yumuşak bir kabarma. Açılırken ışık önce dağılmış durur, sonra dikişe
odaklanır (`scaleY` 2.1 → 1). Çizgi çizilmez, ışık toplanır.

Renk de marka sarısı değil: merkezde sıcak beyaz, uçlara doğru altına döner.
Bir renk örneği değil, ışık gibi okunur.

## Işık ve renk

Tek ışık kaynağı var. İki ayrı parlama koleksiyon olurdu, tek fikir olmazdı.

Işık ayrı bir katman değil: koyu zemin perdenin kendi arka planı, `.ic-field`
ise hem sıcak kaynağı hem vinyeti taşıyor ve açılarak ışığın yükselişini
veriyor. Ayrı bir tam ekran saydam havuz katmanı, her karede baştan
harmanlanması gereken 1,1 milyon piksel demekti — kaldırılınca p95 kare
süresi 44.4 → 33.8 ms'ye indi.

Kaynağın şekli görünürse o ışık değil, şekildir — bu yüzden düşüş kademelere
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

## Küçülürken takılma

İşaret küçülürken tutukluk vardı. İki sebebi çıktı:

1. **Devir sırasında `text-shadow` canlandırılıyordu.** Bu bir *boyama*
   özelliği; yazı aynı anda ölçeklenirken her karede hem yeniden boyama hem
   yeniden rasterleme demek. Kaldırıldı — ölçüldü, değişim anında gölge farkı
   görünmüyor, çünkü işaret zaten koyu zebra dokusunun üzerine iniyor.
2. **Karartma tam da devrin başladığı anda kalkıyordu.** Ağır zebra dokusunun
   ilk boyaması küçülmenin en kritik anına denk geliyordu. Artık `HOLD-760`'ta,
   perde hâlâ tam opakken kalkıyor: maliyet sessiz bir anda ödeniyor.

Ayrıca atmosfer, işaret hâlâ küçülürken temizleniyor (tane önce ve daha hızlı).
Bu iki tam ekran saydam katman devir penceresinde kare başına ~12 ms tutuyordu.

Küçülme penceresinde ölçülen kare süresi:

| ekran | önce | sonra |
|---|---|---|
| 1440×900 | 17.4 ms, en kötü **37.5** ms, 2 takılma | 16.9 ms, en kötü **20.2** ms, **0 takılma** |
| 1920×1080 | 29.8 ms, en kötü **61.3** ms | 24.5 ms, en kötü 49.3 ms |

Takılma hissini yaratan şey ortalama değil **varyanstır**; asıl düzelen o.

## Kurallar

- Yalnızca `transform` ve `opacity` canlandırılır. `clip-path`, `filter: blur()`,
  `left` veya `background-position` animasyonu yoktur.
- Film tanesi `transform` ile oynatılır: aynı görüntü, boyama maliyeti sıfır.
- Perde tamamen kapatırken arkadaki ağır zebra dokusu `visibility:hidden` olur
  (`intro-blackout`). Yerleşim korunur, devir ölçümü etkilenmez. Karartma perde
  hâlâ opakken kalkar, dolayısıyla pop-in olmaz.
- Harflere `will-change` verilmez: WAAPI transform animasyonları zaten kendi
  bileşim katmanını oluşturur, 22 harfte ayrıca vermek sadece bellek harcar.

## Tarayıcı doğrulaması

Gerçek motorlarda çalıştırıldı, emülasyon değil:

| motor | ne test edildi | sonuç |
|---|---|---|
| Chromium | 390–1920 arası altı boyut | iniş < 0.02 px, hata yok |
| **WebKit 26** (Safari) | iPhone 13, iPhone SE, masaüstü | iniş **0.00 px**, hata yok |
| WebKit + hareket azaltma | iPhone 13 | sakin mod, 0 px hareket |

Kare süresi (3 koşunun ortancası, WebKit/iPhone 13):

| | v13 | şimdi |
|---|---|---|
| medyan | 63 ms | **21 ms** |
| p95 | 217 ms | **63 ms** |

**Film tanesi telefonda kapalı.** 3x retina ekranda tam ekran bir gürültü
dokusu ~2.8 milyon aygıt pikseli demek; WebKit'te kare başına 23 ms
tutuyordu ve %3 opaklıkta o yoğunlukta zaten görünmüyor.

Test edilemeyen: gerçek cihaz CPU/GPU'su (buradaki ortam GPU'suz yazılım
rasterleyici), iOS Düşük Güç Modu, Safari'nin adres çubuğu davranışı.

## Ölçüm (headless Chromium, GPU yok — gerçek cihazda daha iyi)

Kare süresi medyanı, 3 koşunun ortancası:

| ekran | önceki (v13) | şimdi |
|---|---|---|
| 1920×1080 | 84.7 ms | **26.6 ms** (p95 38.9) |
| 1440×900 | 55.8 ms | **16.9 ms** (p95 21.1) |
| 390×844 | 16.7 ms | 16.7 ms |

## Davranış

- **Müdahale:** tıklama, kaydırma, tuş veya boyut değişimi jeneriği *kesmez*,
  zaman çizgisini 3.8 katına hızlandırır. Devir yine doğru yere oturur (~1.0 sn).
- **İkinci ziyaret:** aynı oturumda 1.6 kat hızlı oynar (~2.3 sn). Daha hızlısı
  kartı okunmaz yapıyordu.
- **`prefers-reduced-motion`:** site sahibinin isteğiyle açılış her yerde tam
  haliyle oynar (mobil dahil). Hareketsiz sürüm kodda duruyor (`intro-calm`,
  `calmRun`) ama devrede değil; geri açmak için `intro-arm` betiğinde sınıfı
  yeniden eklemek yeterli.
- **Betikler çalışmazsa:** yalnızca CSS'e dayalı ikinci bir açılış oynar
  (telefonda dosya önizleme ekranları betik çalıştırmaz). Güvenlik: temel
  durum gizli, perdeyi yalnızca animasyonun kendisi görünür yapar —
  animasyonlar da çalışmazsa perde hiç açılmaz, siyah ekranda kilitlenme
  olmaz.
- **Derin bağlantı / kaydırılmış açılış:** jenerik atlanır.
- **Emniyet:** her yol tıkanırsa 7 sn'de perde zorla kaldırılır.

## Sakin mod (hareket azaltma)

Telefonlarda "hareketi azalt" ayarı çok yaygın: iOS'ta Erişilebilirlik →
Hareket, Android'de ise **pil tasarrufu bile** bunu tetikliyor. Açılışı bu
durumda tamamen kapatmak, onu çoğu mobil kullanıcıya hiç göstermemek
demekti.

Onun yerine hareketsiz bir sürüm var. İşaret, hero'daki wordmark'ın tam
olacağı yere **statik olarak** konur; her şey yalnızca opaklıkla çözülür:

- İşaretin toplam hareketi **0 piksel** (ölçüldü).
- Uçuş, harf yükselişi, yatay açılım, yaklaşma, ışık geçişi — hepsi kapalı.
- Perde silindiğinde altındaki hero işareti zaten aynı pikselde durur,
  yani çift görünme de olmaz.
- Süre ~2.5 sn.

Bu, hareket tercihine saygı duymanın doğru yolu: büyük hareketi at,
opaklık geçişlerini koru.

## Güvenlik notu

Sayfa statik: **form yok, ağ çağrısı yok** (`fetch`/XHR/beacon/WebSocket = 0),
`eval` / `new Function` / dizgi tabanlı zamanlayıcı yok. Abonelik dış bir
bağlantı (Substack). Dolayısıyla form spam'i, kimlik doldurma ve API yağması
için bu sayfada hedef yok.

- `location.hash` yönlendirmesi allowlist ile doğrulanıyor
  (`hasOwnProperty.call`), prototip kirliliğine karşı da güvenli.
- Dil kodu aynı özenle doğrulanıyor (bu sürümde düzeltildi; önceden
  truthy kontrolüydü ve `__proto__` geçiyordu).
- Bütün dış bağlantılarda `rel="noopener noreferrer"` var.
- CSP güçlü: script yalnızca sha256 hash'leriyle (`unsafe-inline` yok),
  `object-src 'none'`, `base-uri 'none'`, `form-action 'none'`.

**Açık kalan tek nokta:** `frame-ancestors` yok, yani clickjacking'e karşı
koruma yok. Mevcut `frame-src 'none'` bu sayfanın *neyi gömebileceğini*
kısıtlar, *kimin bu sayfayı gömebileceğini* değil. `frame-ancestors`
`<meta>` etiketinde **yok sayılır** — HTTP başlığı olarak verilmesi gerekir:

```
Content-Security-Policy: frame-ancestors 'none'
X-Frame-Options: DENY
```

GitHub Pages özel başlık ayarlamaya izin vermez; Cloudflare, Netlify veya
Vercel gerekir.

Kaba kuvvet, kazıma ve DDoS tamamen barındırma katmanının işidir (CDN, hız
sınırlama, WAF); bu dosyadan çözülemez.

## Bakım

Satır içi betikler CSP `script-src` içinde sha256 ile listelidir. **Herhangi bir
`<script>` içeriğini değiştirdikten sonra** hash'leri yenileyin, yoksa betik
çalışmaz:

```
node scripts/refresh-csp.mjs
```
