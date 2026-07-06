# LUMENFALL — Araç ve Sürüş Modeli

| Alan | Değer |
| --- | --- |
| **Belge No** | LW-GDD-17 |
| **Sürüm** | 1.0 |
| **Tarih** | 5 Temmuz 2026 |
| **Sahip** | Araç ve Fizik Lideri |
| **Durum** | İnceleme |
| **Gizlilik** | Stüdyo İçi — Dağıtım Onaya Tabidir |

Bu belge, LUMENFALL'un 200+ araçlık filosunu, sürüş/uçuş/sıfır-G fizik modelini,
hasar ve modifikasyon sistemlerini, araç edinme yollarını ve kovalamaca tasarımını
tanımlar. Sınıf taksonomisinin çekirdeği LW-GDD-03'teki araç tablosuyla birebir
uyumludur; trafik ve kalabalık bütçeleri LW-GDD-04'e, tüm LM fiyat bantları
LW-GDD-05'e tabidir. Kanon sabitleri değiştirilemez: **200+ araç**, **310 km²
şehir + yörünge katmanı**, **%100 kesintisiz dünya (yükleme ekranı yok)**,
**pay-to-win kesin yasak — performans asla gerçek parayla satılmaz.**

---

## 1. Sürüş Modeli Felsefesi

### 1.1 Spektrumdaki yerimiz

Sürüş modelini 0–100'lük bir **arcade–simülasyon spektrumunda** konumlandırıyoruz
(0 = tam arcade, 100 = tam simülasyon). LUMENFALL'un hedefi tek nokta değil,
alem başına ayarlanmış bir banttır: *"İlk 5 dakikada herkes sürer; 50. saatte
hâlâ öğrenecek şey kalır."*

| Alem | Spektrum hedefi | Gerekçe |
| --- | :-: | --- |
| Kara (tekerlekli) | 58–65 | Kovalamaca omurgası; okunabilir kayma, cezalandırıcı olmayan toparlanma |
| Kara (deniz/kanal) | 50 | Sisaltı görevleri atmosfer odaklı; su fiziği hissedilir ama boğmaz |
| Hover | 45–52 | Katmanlar arası ulaşım aracı; salınım karakter verir, hassasiyet istemez |
| Hava (VTOL) | 55–62 | crew uçuşları koordinasyon ister; tam aerodinamik sim istemez |
| Yörünge | 70–78 | Newtoncu-hafif (LW-GDD-03); Solene fantezisinin bel kemiği |

**Tasarım kapısı:** hiçbir araç, denetleyiciyle ilk 90 saniyede düz bir rotada
tutulamıyorsa incelemeden geçemez. Ustalık derinliği *limit sürüşte* yaşar,
temel kontrolde değil.

### 1.2 Sınıf başına "his" hedefleri

Her araç sınıfının bir **His Kartı** vardır: üç sayısal hedef + bir cümlelik
karakter tanımı. His Kartı, dengeleme tartışmalarında öznel dili ("yumuşak
olsun") yasaklar; tartışma kart değerleri üzerinden yürür.

| Sınıf | Yanal tutuş (g) | Ağırlık transferi tepkisi | Drift toleransı (açı penceresi) | Karakter cümlesi |
| --- | :-: | :-: | :-: | --- |
| Sokak motosikleti | 1,1–1,3 | 0,15 sn (anlık) | 8° (dar; düşüş riski) | "Trafik bir duvar değil, bir akıntıdır." |
| Sedan / kupa | 0,85–0,95 | 0,35 sn | 18° | "Görünmezliğin dört tekerleği." |
| Performans / yarış | 1,15–1,35 | 0,22 sn | 30° | "Isıyla pazarlık eden bıçak." |
| Zırhlı / taktik | 0,65–0,75 | 0,60 sn (ağır) | 10° | "Yol ona uyar." |
| Ağır vasıta | 0,45–0,55 | 0,90 sn | 6° | "Momentum bir silahtır ve faturası vardır." |
| Deniz/kanal | — (su) | 1,2 sn (savrulma) | 25° (kıç savurma) | "Sis onun evidir." |
| Hover binek | 0,7 eşdeğer | 0,40 sn + salınım | 35° (yanal kayış serbest) | "Zeminle nezaket ilişkisi vardır, bağlılık değil." |
| AV-taksi / VTOL | 0,5 eşdeğer | 0,70 sn | — | "Şehrin sabrı." |
| Taktik VTOL | 0,8 eşdeğer | 0,45 sn | — | "Dört kişilik bir cümlenin yüklemi." |
| Yörünge mekiği | — (vektör) | atalet sınırlı | — | "Hız bir yön kararıdır; fren bir yakıt kararıdır." |

- **Yanal tutuş:** sabit yarıçaplı test pistinde kopma öncesi maksimum yanal ivme.
- **Ağırlık transferi tepkisi:** ani şerit değişiminde gövde yatışının oturma süresi.
- **Drift toleransı:** gaz/karşı direksiyon ile taşınabilir kayma açısı penceresi;
  pencere dışı = spin. Performans sınıfının 30°'lik penceresi sokak yarışı
  liglerinin (LW-GDD-03, Mini Oyunlar) mekanik temelidir.

### 1.3 Üç protagonist, üç sürüş kimliği

- **Kaan:** zırhlı/taktik ve tekerlekli klasik alemi. Izgara Dışı ağacıyla
  (LW-GDD-03) sinerji: implantsız, analog araç = PANOPT'a en az iz.
- **Mara:** drone taşıyıcı alemi + araç siber savaşı. Buz Katmanı 3'e kadar
  araçları sürücülü halde ele geçirir; kovalamacada rakip aracı hackleme onun yolu.
- **Solene:** hover üstü ve yörünge alemi. Tam vektör uçuş yalnız onun ağacında;
  diğer ikisi yörüngede flight assist kilidiyle uçar (LW-GDD-03).

---

## 2. Filo Taksonomisi (200+ Araç)

### 2.1 Sınıf ağacı ve adet dağılımı

Taksonomi LW-GDD-03'ün üç alem / on iki sınıf yapısını korur. Lansman hedefi
**200 araç**; sezonluk eklerle "200+" kanonu büyür (sezon başına 4–6 araç,
LW-GDD-06 ritmiyle).

| Alem | Sınıf | Adet | Fiyat bandı (LM) | Örnek araçlar ve karakterleri |
| --- | --- | :-: | --- | --- |
| Kara | Sokak motosikletleri | 22 | 18.000–95.000 | **Karayel Jilet** (kurye efsanesi, çıplak şasi), **Karayel Vespera** (retro-neon, Neon Liman pozcusu), **VAS Çekirge** (Pas Kuşağı derlemesi, ucuz ve tamiri kolay) |
| Kara | Sedan / kupa | 34 | 22.000–320.000 | **VAS Fayton** (şehrin taksisi-öncesi klasiği), **Sable Prestij Kuğu** (Kordon lüksü, ses yalıtımı oynanış özelliği), **VAS Atlas** (aile sedanı, "görünmez araba"), **Aeon Volt Akort** (hibrit; elektrik modunda ses imzası −%50) |
| Kara | Performans / yarış | 18 | 180.000–1,4M | **Poyraz P-7 "Cehennem"** (ısı duvarına en hızlı çarpan), **Poyraz Sıfırbir** (lig giriş sınıfı), **Sable Prestij Kılıç** (GT; hız + statü), **VAS Kasırga-R** (Pas Kuşağı'nın el yapımı canavarı, %2 tutukluk cazibesi) |
| Kara | Zırhlı / taktik | 14 | 350.000–2,2M | **KV Kalkan** (Kessler-Voss devriye standardı; çalınırsa şirket peşine düşer), **KV Sur** (para nakil; soygun hedefi ve aracı), **VAS Koçbaşı** (sivil şasiye kaynaklı çete zırhlısı) |
| Kara | Ağır vasıta / endüstriyel | 16 | 90.000–650.000 | **VAS Mamut** (çekici; römork fiziğinin vitrini), **VAS Vinç-Kule** (Bahçeler hasat lojistiği), **Kervan Yolu Gezgini** (Dış Halka konvoy kamyonu, yaşam modülü) |
| Kara | Deniz/kanal (Sisaltı) | 15 | 26.000–480.000 | **Çapa Sazan** (kanal teknesi standardı), **Çapa Yılanbalığı** (yarı dalış kaçakçı botu), **94 Sınıfı** (Kanal Ateşkesi'nin simge teknesi; Kanalcılar itibarıyla satılır) |
| Hava | Hover binekler | 26 | 140.000–900.000 | **Aeon Volt Akım** (hover'ın halk arabası), **Aeon Volt Salınım** (spor hover; bant ihlali için doğmuş), **Lodos Martı** (açık kokpit; Sisaltı sis uçuşu), **Poyraz Hayalet-H** (hover ligi şampiyon şasisi) |
| Hava | AV-taksi / yolcu VTOL | 12 | 380.000–1,1M | **Lodos Fener** (şehir taksi standardı; otopilotu hacklenebilir), **Lodos Kervansaray** (8 koltuklu; kaçırma görevlerinin sahnesi), **Yıldırım Hat-9** (asansör tabanı servis hattı) |
| Hava | Taktik VTOL / gunship | 10 | 1,6M–4,5M | **KV Atmaca** (yan kapılı crew gemisi; 4 kişilik crew uyumlu), **KV Ecel** (Bastırma durumunun ağır eli; oyuncuya geç açılır), **Lodos Yaban Arısı** (hafif, fraksiyon modifiyeli) |
| Hava | Drone taşıyıcı / destek | 9 | 420.000–1,3M | **Aeon Kovan** (3 drone rıhtımı; Mara'nın uzman şasisi), **Gölgepazar "Arı Kraliçesi"** (tekil el yapımı; yan görev ödülü), **KV Gözcü** (askeri keşif varyantı) |
| Yörünge | Asansör-arayüz mekikleri | 12 | 800.000–2,8M | **Yıldırım Merdiven Sınıfı** (resmî kabin-rıhtım servisi), **Yıldırım Sansar** (hafif kargo; manifest sahteciliğinin favori sahnesi), **İrtifa Serçe** (lonca yapımı; ucuz, inatçı) |
| Yörünge | Yörünge kaçakçı gemileri | 12+ | 1,9M–4,5M | **İrtifa Ebabil** (giriş sınıfı Leylek gövdesi), **İrtifa Albatros** (uzun menzil; çift ısı bacası), **Kara Leylek** (Solene'e özel; sınıfın tavan gövdesi — satılmaz, hikâyeyle gelişir, LW-GDD-03) |

**Toplam: 200 lansman aracı.** Fiyat bantları LW-GDD-05 araç sink aralığının
(18.000–4,5M LM) içinde kalır; tavanı yalnız taktik VTOL ve kaçakçı gemisi
sınıfları kullanır.

### 2.2 Üretici kimlikleri

Silah üreticilerinin (LW-GDD-03) araç tarafındaki karşılığı; her marka bir
bölge kültürüne ve bir his sapmasına bağlanır:

| Üretici | Köken | Kimlik | His sapması |
| --- | --- | --- | --- |
| **VAS (Vural Ağır Sanayi)** | Pas Kuşağı | Karartma öncesi kalıntı sanayi devi; "tamir edilebilir her şey" | +ağırlık transferi süresi, +dayanıklılık, analog gösterge |
| **Sable Prestij** | Çekirdek/Kordon | Sable Group'un yaşam tarzı markası | +konfor süzme, −yol geri bildirimi |
| **Poyraz Performans** | Neon Liman | Yarış ligi kökenli butik atölye | +tutuş tavanı, agresif ısı eğrisi |
| **Aeon Volt** | Çekirdek | Aeon Dynamics tüketici kolu; hover tekeline en yakın marka | pürüzsüz itki, telemetri PANOPT'a akar (oynanış etkisi: +iz) |
| **Karayel Motor** | Neon Liman | İki teker kültürünün kalbi | keskin yatış, dar hata payı |
| **Lodos Aerodin** | Yükseliş | Sivil VTOL işletmecisi ve üreticisi | tahmin edilebilir otopilot, yavaş manevra |
| **KV (Kessler-Voss)** | Kordon | Güvenlik tekelinin araç bölümü | zırh önceliği, kütle cezası |
| **Yıldırım Orbital Tersaneleri** | Yükseliş/Zenit | Mekiklerin resmî üreticisi | sertifikalı uçuş zarfı, kilitli limitörler |
| **Çapa Tersanesi** | Sisaltı | Kanalcılar'a yakın aile tersanesi | düşük ses imzası, sığ su ustalığı |
| **İrtifa Lonca Yapımı** | Yükseliş | Standart dışı, pilot elinden gemiler | limitörsüz, bakım açlığı |

**Kural:** Aeon Volt araçlarının telemetri izi ve İrtifa yapımlarının limitörsüzlüğü
gibi marka sapmaları *mekaniktir*, metin süsü değildir; satın alma ekranında
açıkça yazılır.

---

## 3. Fizik Parametre Çerçevesi

### 3.1 Sürüş Omurgası (ortak çekirdek)

Tüm alemler tek bir parametreli çekirdeği paylaşır: **Sürüş Omurgası**.
Sınıflar bu çekirdeğin parametre bantlarını doldurur; kod dalı ayrışması yalnız
temas modeli düzeyindedir (lastik / gövde-su / itki yastığı / rotor / RCS).
Duskforge fizik adası kare bütçesi LW-GDD-04'e tabidir (trafik dahil 1,8 ms).

| Parametre | Kara (teker) | Deniz | Hover | VTOL | Yörünge |
| --- | --- | --- | --- | --- | --- |
| Kütle (kg) | 190–14.000 | 900–22.000 | 850–3.200 | 2.400–11.000 | 9.000–120.000 |
| Güç/itki | 45–780 kW | 60–900 kW | 120–560 kN·eşd | 300–1.400 kN·eşd | ana itki + 12–24 RCS |
| Tutunma bandı (μ) | 0,6–1,35 | — | — | — | — |
| Güç/ağırlık hedefi | 0,08–0,55 kW/kg | — | 0,12–0,30 | 0,10–0,25 | Δv bütçesiyle ifade edilir |
| Azami hız | 160–340 km/s | 40–110 km/s | 190–280 km/s | 240–380 km/s | yörünge mekaniği |

- **Lastik modeli:** basitleştirilmiş fırça modeli; boyuna/yanal kayma eğrileri
  sınıf başına 6 kontrol noktasıyla tanımlanır. Tam termal lastik simülasyonu yok;
  bunun yerine tek skaler **ısı değeri** (performans sınıfının "motoru boğma"
  mekaniğiyle aynı dil, LW-GDD-03).
- **Hava durumu çarpanları (LW-GDD-04 ile uyumlu):** yağmur μ×0,85 · asit yağmuru
  μ×0,80 + boya hasarı · Sisaltı sisi görüş kısıtı (fizik değişmez) · elektrik
  fırtınası hover koridorlarını kapatır, hover kontrol gecikmesi +120 ms.

### 3.2 Hover yükseklik dinamiği

- **Yastık modeli:** hedef yükseklik tutucu (kritik sönümlemeli yay-damper);
  sokak bandı 1,8–4,0 m, koridor bantları 120–800 m (LW-GDD-03 hava koridorları).
- **Karakteristik salınım:** 0,8–1,2 Hz doğal frekans — hover "hissinin" imzası.
  Aviyonik hasarı sönümlemeyi düşürür: salınım genliği kademeyle 0,3 m → 1,5 m
  (bkz. §4, okunabilir arıza).
- **Zemin etkisi:** 2 m altında itki verimi +%15; dar sokakta duvar yalama
  ("yüzey sörfü") ustalık tekniğidir ve hover ligi çizgisini belirler.
- **Bant ihlali:** koridor dışına çıkış anında PANOPT İlgi durumu (LW-GDD-03
  kuralı: "koridor dışı uçuş = anında PANOPT ilgisi"). Elektrik fırtınasında
  koridorlar kapalıyken zemin bandına iniş yasal — fırtına kaçakçı havasıdır.

### 3.3 Hava aracı uçuş zarfı

- **VTOL geçiş modeli:** askı ↔ seyir arasında sürekli harmanlama; kanat/rotor
  taşıması 80 km/s üstünde devreye girer, geçiş penceresinde yanal savrulma
  hissi bilinçli bırakılır (crew pilotluğunu ödüllendirir).
- **Zarf sınırları:** azami irtifa sivil sınıflarda 800 m (koridor tavanı);
  taktik VTOL görev bölgelerinde 1.400 m'ye açılır. Aşırı yükleme (sert dönüş
  >3,5 g eşd.) kontrol yüzeyi ısınması üretir; 8 sn üstünde kademeli kilitlenme.
- **Otopilot yüzeyi:** tüm AV-taksi ve yolcu VTOL'leri otopilot çekirdeği taşır
  ve Buz Katmanı'na tabidir — Mara için uçan her taksi bir araçtır, bir silahtır
  veya bir kaçış planıdır (LW-GDD-03 siber savaş K2).

### 3.4 Sıfır-G mekik manevrası (Solene fantezisi)

- **Model:** Newtoncu-hafif (kanon, LW-GDD-03) — atalet tam korunur, yörünge
  mekaniği "sezgisel yalanlarla" sadeleştirilir: yörünge bozunması yok, istasyon
  yaklaşmaları sabit referans çerçevesinde çözülür. Tam n-cisim simülasyonu
  bilinçli olarak reddedilmiştir; fantezi *kaçakçı pilotluğu*dur, uzay programı değil.
- **Kontrol katmanları:** (1) Flight assist AÇIK — burun yönü = gidiş yönü,
  otomatik karşı itki; Mara ve Kaan bu kilitle uçar. (2) Flight assist KAPALI —
  tam vektör ayrışması: burnu hedefe çevirirken kıçtan gitmeye devam etme
  ("drift dönüşü"); yalnız Solene'in Kaçakçı Pilotluğu ağacıyla açılır.
- **His hedefi:** 90° burun çevirme süresi Leylek gövdesinde 1,4 sn, kargo
  doluyken 2,2 sn; kütle hissi yük manifestosuyla değişir — "ne taşıdığın,
  nasıl uçtuğundur."
- **Isı imzası:** itki kullanımı imza üretir; imza penceresi Zenit gümrük
  taramalarına yakalanma olasılığını belirler. Soğuk sürüklenme (itkisiz yaklaşım)
  en riskli ve en ödüllü kaçakçı manevrasıdır — **Kara Leylek**'in çift ısı
  bacası bu manevranın referans donanımıdır.
- **Atmosfer girişi:** giriş açısı penceresi 5,5°–7,0°; dışı gövde hasarı.
  Yakıt maliyeti kanonu korunur: atmosferik tırmanış 2.400–6.000 LM, asansör
  bileti 180 LM (LW-GDD-03 hız/maliyet/kaçaklık üçgeni).

---

## 4. Hasar Modeli

### 4.1 Görsel deformasyon kademeleri

6 bölgeli gövde modeli (ön/arka/yanlar/tavan/alt — LW-GDD-03) üzerinde dört
görsel kademe; deformasyon bölge başına bağımsız ilerler:

| Kademe | Görsel | Eşik (bölge bütünlüğü) | Oynanış |
| --- | --- | :-: | --- |
| D0 | Çizik, boya kaybı | %100–80 | Yok (kozmetik) |
| D1 | Panel ezilmesi, çatlak cam | %79–50 | Sürtünme sesi; PANOPT görsel imza eşleşmesi kolaylaşır |
| D2 | Panel kopması, açık iskelet | %49–20 | Aerodinamik ceza −%8 hız; parça saçılımı |
| D3 | Yapısal deformasyon | %19–0 | Bölgeye bağlı sistem arızası tetiklenir (bkz. 4.2) |

### 4.2 Mekanik arıza kademeleri

Dört sistem (güç aktarımı, kontrol yüzeyleri, aviyonik, yaşam desteği
[yalnız yörünge] — LW-GDD-03) üç arıza kademesinde bozulur. İlke: **her arıza
okunabilir, öğrenilebilir ve son ana kadar sürülebilir olmalıdır.** Anında
"araç öldü" durumu yalnız patlama/enkazda görülür.

| Sistem | A1 — Aksama | A2 — Arıza | A3 — İflas |
| --- | --- | --- | --- |
| Güç aktarımı | Güç −%15, ısı +%20 | Vites atlaması / itki dalgalanması | Sürünme hızı; motor yangını riski 60 sn |
| Kontrol yüzeyleri | Direksiyon/lövye ölü bölge +%10 | Tek yöne çekme; hover'da yanal kayış | Kilitli yüzey — yalnız gaz/frenle sürüş |
| Aviyonik | HUD paraziti | Hover yükseklik salınımı ±1,5 m; otopilot düşer | Sensör körlüğü; gece/sis fiilen kör uçuş |
| Yaşam desteği (yörünge) | Basınç uyarısı | Kabin sızıntısı — 90 sn müdahale penceresi | Dekompresyon; manevra devam eder, pilot süresi dolar |

- **Patlama kuralı:** araçlar sinema alışkanlığıyla patlamaz. Patlama yalnız
  (a) yakıt/batarya bölgesine A3 + ateş, (b) mühimmat taşıyan taktik araçlarda
  cephane vuruşuyla olur. Yanan araç 8–15 sn uyarı penceresi verir.
- **Tamir ekonomisi:** sahada acil onarım kiti A2→A1 düşürür (1 kullanım,
  1.200 LM); tam onarım garaj/tersane işidir — fiyat, araç değerinin %2–6'sı.
  Pas Kuşağı ustaları %30 ucuz, %5 "sürpriz parça" riskli.

---

## 5. Modifikasyon ve Garaj

### 5.1 Parça kategorileri

Modifikasyon iki kesin ayrık kümedir. **Performans kümesi yalnız LM ve
ustalıkla alınır; Prizma ile asla satılmaz** (LW-GDD-05 Madde 5 — bu belge
için bağlayıcı anayasa hükmü). Estetik küme Prizma vitrininde yer alabilir.

| Küme | Kategori | Etki | LM bandı |
| --- | --- | --- | --- |
| Performans | Motor / itki paketi | Güç +%5–18, ısı eğrisi değişir | 8.000–150.000 |
| Performans | Şanzıman / vektör kontrolcüsü | Vites/itki tepkisi, drift penceresi +4° | 5.000–90.000 |
| Performans | Süspansiyon / yastık ayarı | Ağırlık transferi süresi ±0,1 sn | 4.000–60.000 |
| Performans | Lastik / itki yüzeyi | μ bandı içinde kaydırma; yağmur çarpanı iyileşir | 2.500–40.000 |
| Performans | Zırh plakaları | Bölge bütünlüğü +%20; kütle cezası | 12.000–120.000 |
| Performans | Buz Katmanı yükseltme | Araç siber savunması +1 kademe (azami 5) | 15.000–110.000 |
| Performans | İmza bastırıcı | PANOPT görsel/ısı imzası −%15–35 | 20.000–150.000 |
| Estetik | Boya, kaplama, monogram | Yok (kamuflaj etkisi Madde 5.4 testine tabi) | 800–25.000 (veya Prizma) |
| Estetik | Siluet parçaları, neon, jant | Yok | 1.500–35.000 (veya Prizma) |
| Estetik | İç mekân, ses paketi, egzoz ışıması | Yok | 800–20.000 (veya Prizma) |

Tüm bantlar LW-GDD-05 modifikasyon sink aralığının (800–150.000 LM) içindedir.

- **Ustalık kapısı:** üst kademe performans parçaları LM'ye ek olarak sınıf
  ustalığı ister (örn. Motor III = o sınıfta 4 saat limit sürüş ustalığı).
  Para tek başına en hızlı arabayı kuramaz — bu, tek oyunculu tarafta da
  pay-to-progress hissini keser.
- **Uyumsuzluk gerçektir:** Poyraz motoru VAS şasisine takılır ama titreşim
  cezası üretir; "her parça her araca" kolaycılığı reddedilir. Uyum matrisi
  garaj arayüzünde açıkça gösterilir (LW-GDD-15).

### 5.2 Garaj ve depolama

- Karakter başına garaj tabanı **8 slot**, geliştirmeyle **24** (LW-GDD-03).
  Eternal sürümün Zenit dairesi +6 yörünge rıhtımı verir — **yalnız depolama**,
  hiçbir performans avantajı yok (LW-GDD-05 Sürüm Kuralı 1).
- Garaj geliştirmeleri: boya kabini (estetik işlem maliyeti −%25), tuning
  standı (parça deneme, satın almadan önce 60 sn test turu), sigorta terminali
  (Online, bkz. §6.3), söküm masası (çalıntı araçtan parça çıkarma; §6.2).
- **crew üssü (Online):** ortak garaj 12 slot; kasadan araç alımı yalnız crew
  içeriği için (LW-GDD-05 kasa kuralları geçerli).

---

## 6. Araç Edinme

### 6.1 Satın alma

| Kanal | Bölge | Özellik |
| --- | --- | --- |
| Resmî bayi vitrinleri | Çekirdek, Neon Liman, Kordon | Tam fiyat, temiz kayıt, sigortalanabilir |
| VAS ikinci el pazarı | Pas Kuşağı | −%20–40 fiyat, D1 hasarlı gelebilir, geçmişi "renkli" |
| Çapa Tersanesi rıhtımı | Sisaltı | Tekneler + yarı dalış modifiyeleri; Kanalcılar itibar kapısı |
| İrtifa Loncası panosu | Yükseliş | Mekikler; lonca itibarı fiyatı %10–25 oynatır |
| Gölgepazar gri listesi | Gölgepazar | Kimliksizleştirilmiş araçlar; ucuz, sigortasız, iz sürülemez |

Piyasa entegrasyonu: araç fiyatları bölge borsası çarpanlarından (LW-GDD-05,
taban ×0,4–×3,0 sınırı) etkilenir; Yükseliş'te mekik kıtlığı yaşanıyorsa
İrtifa panosu gerçekten pahalanır.

### 6.2 Çalma — çalınabilirlik kuralları

İlke: **her araç çalınabilir — evet, mekik de çalınır.** Fark, bedeldedir.

| Kural | Ayrıntı |
| --- | --- |
| Buz Katmanı kapısı | Park halindeki araç, Buz kademesine göre Kilit/Bypass veya Buz Kırma mini oyunu ister (LW-GDD-03); Buz 4–5 fiziksel ön koşul da ekler (anahtar çipi, yetkili implant) |
| Sürücülü gasp | Fiziksel gasp (Kaan güçlü) veya K2 otopilot gaspı (Mara, Buz ≤3) |
| Tanıklık ve iz | Çalma anı kapsama altındaysa PANOPT deftere yazar (bölge kapsaması LW-GDD-03: Çekirdek %98 … Dış Halka %5); Dış Halka'da yalnız insan tanık hatırlar (LW-GDD-04) |
| **Gri Kayıt** durumu | Çalıntı araç "sıcaktır": garaja kaydedilemez, sigortalanamaz, PANOPT imza eşleşmesine açıktır |
| **Kimliksizleştirme** | Gölgepazar/Kanalcılar servisi: şasi ve sinyal kimliği silinir — araç değerinin %15–30'u; sonrasında araç kaydedilebilir ama resmî bayi geri alımına giremez |
| Boyahane ("Küvet") | Pas Kuşağı boyahaneleri kovalamaca sırasında görsel imzayı kırar (90 sn işlem, 3.500 LM); Kimliksizleştirme değildir, geçici çözümdür |
| Mekik çalma | Zenit rıhtımı veya asansör tabanından: rıhtım erişimi (Truva yaklaşımı), manifest sahteciliği, Buz 4+ kırılımı ve ısı imzası altında ilk 10 dakika. Zenit Halkası'nda PANOPT yetkisi "danışma" düzeyindedir (LW-GDD-01) — kovalayan Yıldırım Orbital istasyon güvenliğidir, bu da mekik hırsızlığını farklı bir oyun yapar |
| NPC araç sahipliği | Çalınan sivil aracın sahibi bir `CitizenRecord`'dur (LW-GDD-04): tanıklık, tutum skoru ve olay bağı gerçekten işler; "dün arabasını çaldığın adam" seni hatırlayabilir |

**Online kısıtı:** oyuncular arası araç çalma Serbest Dolaşım'da açık, ancak
çalınan araç oturum sonunda sahibine döner (kalıcı kayıp yok — griefing kapısı
kapalı); Kaçakçılık Ligi modunda kargo çalınır, araç çalınmaz (LW-GDD-10).

### 6.3 Online sigorta sistemi — Sable Teminat

LUMENFALL Online'da araç sigortası diegetiktir: poliçeyi **Sable Teminat**
(Sable Group'un finans kolu) satar. Tek oyunculuda sigorta anlatısal tutulur
(LW-GDD-05'in ölüm maliyeti ilkesiyle aynı yaklaşım).

| Kademe | Haftalık prim (LM) | Kapsam | Muafiyet |
| --- | --- | --- | --- |
| Üçüncü Şahıs | araç değerinin %0,4'ü | Sivil/NPC hasarı cezaları | — |
| Kasko | %0,9 | Yıkım sonrası aynı araç yeniden teslim | değerin %5'i, tavan 25.000 LM |
| Tam Zırh | %1,6 | Kasko + modifikasyon parçaları + çalınma (oyuncu dışı) | değerin %3'ü, tavan 15.000 LM |

- **Ayrı sink:** Buradaki araç sigortası muafiyeti (tavan 25.000 LM), LW-GDD-05'teki
  oyuncu-ölümü hastane giderinden (net kazancın yüzdesi, tavan 5.000 LM) ayrı bir
  para gideridir. Bir olayda çakışabilirler (araç yıkımı + oyuncu ölümü) ama iki
  ayrı kalem olarak işlerler; birbirinin tavanına dahil değildirler.
- **Griefing dengesi:** başka oyuncunun sigortalı aracını yok eden oyuncu
  muafiyeti öder ("yıkan öder" kuralı); kaçarsa bedel PANOPT cezası olarak
  Sıcak Para dönemine yazılır. Sistemik istismar (prim tarlası, anlaşmalı
  yıkım) telemetriyle izlenir ve piyasa yasağıyla sonuçlanır (LW-GDD-05
  manipülasyon tablosuyla aynı yaptırım dili).
- **Gri Kayıt araçlar sigortalanamaz** — çalıntıyla oynayan, riskiyle oynar.
- Kara Leylek ve görev-kilitli benzersiz araçlar sigorta dışıdır; anlatı
  kaybolmalarına izin vermez.

---

## 7. Trafik Simülasyonu Entegrasyonu

LW-GDD-04'ün dört katmanlı ulaşım ağı ve trafik LOD'u (fiziksel ≤48,
kinematik ≤400, akış katmanı) bu belgenin çalışma zeminidir; burada yalnız
sürüş deneyimine bakan yüzü tanımlanır.

### 7.1 Yoğunluk bantları

Akış katmanı, bölge × saat matrisinden hedef yoğunluk üretir (0,0–1,0;
1,0 = şerit kapasitesi doygun). 1 oyun günü = 48 dakikadır (LW-GDD-04).

| Bölge | Sabah tepe | Gündüz | Gece tepe | Gece yarısı |
| --- | :-: | :-: | :-: | :-: |
| Çekirdek | 0,8 | 0,7 | 0,4 | 0,15 |
| Neon Liman | 0,3 | 0,5 | **0,95** | 0,7 |
| Pas Kuşağı | 0,5 | 0,6 | 0,4 | 0,25 |
| Yükseliş | 0,7 (konvoy) | 0,8 | 0,6 | 0,5 (asansör 7/24) |
| Sisaltı (kanal) | 0,4 | 0,5 | 0,6 | 0,45 |
| Bahçeler | **0,9 (hasat konvoyu)** | 0,5 | 0,3 | 0,2 |
| Kordon | 0,25 | 0,3 | 0,3 | 0,1 |
| Gölgepazar | 0,4 | 0,6 | 0,8 | 0,6 |
| Dış Halka | 0,2 | 0,3 | 0,2 | 0,15 |

Hover koridorları ayrı matris taşır; elektrik fırtınası koridor yoğunluğunu
0'a çeker ve zemin bantlarına +0,2 basınç ekler (LW-GDD-04 hava kancası).

### 7.2 Kovalamaca sırasında trafik davranışı

- **PANOPT koridor boşaltma:** Müdahale durumunda PANOPT, kovalamaca rotası
  üzerindeki sinyalizasyonu keser ve sivil akışı yan şeritlere süpürür.
  Sonuç bilinçli bir ikilemdir: yol açılır (hız artar) ama boş yol PANOPT'un
  sahnesidir (önleme birimleri temiz atış hattı bulur). Trafiğe karışmak
  yavaş ama örtülüdür.
- **Sivil tepki modeli:** siren/çarpışma algılayan kinematik araçlar kenara
  çekilir (2 sn tepki); panik hücresel otomatı yayalarla aynı altyapıyı
  kullanır (LW-GDD-04). Sivil araca ağır hasar = PANOPT defterine "sivil
  altyapı" ekseninde yazım — Kessler-Voss av timi olasılığını besler (LW-GDD-03
  Hedef ekseni).
- **Trafik bir silahtır (Mara):** akış katmanı hacklenebilir (LW-GDD-04):
  K2 ile kavşak kilidi (takipçi önüne yeşil dalga kapatma), K3 ile bölgesel
  sinyal karartması — 30 sn kaos, ama kaos deftere de yazılır.
- **Bütçe kuralı:** kovalamaca yönetmeni fiziksel araç bütçesini (≤48) asla
  aşamaz; PANOPT birimleri + sivil fiziksel araçlar + oyuncu konvoyu bu
  havuzda yarışır. Birim sayısı tavana çarptığında sistem sivil fizikselleri
  kinematiğe tenzil eder, asla yeni birimi "ışınlamaz".

---

## 8. Kovalamaca Tasarımı

### 8.1 PANOPT araç birimleri

Kovalamaca, LW-GDD-03'teki durum makinesine (Sessiz İzleme → İlgi → Müdahale →
Bastırma) bağlıdır; "yıldız seviyesi" yoktur. Birim seçimi oyuncu profiline
göre yapılır — jenerik polis dalgası kanon gereği yasaktır.

| Birim | Şasi | Devreye girdiği durum | Davranış |
| --- | --- | --- | --- |
| **Mercek** | küçük quad | İlgi | Yalnız takip ve imza kaydı; saldırmaz. Düşürülmesi Müdahale'yi hızlandırır |
| **KV Tazı** | modifiyeli KV Kalkan | Müdahale (kara kaçışçısı profili) | Temaslı önleme: PIT manevrası, yan sıkıştırma; gerçek fizikle sürer, lastik bütçesi vardır |
| **Kama** | tek kişilik hover önleyici | Müdahale (hover profili) | Koridor içinde eşkurs takip; **manyetik kıskaç şeridi** serer (bkz. 8.2) |
| **Ağ Örücü** | orta boy dron | Müdahale (motosiklet/dikey profil) | İki dron arası iletken ağ gerer; çarpan iki teker sürücüsünü düşürür, araçları yavaşlatır |
| **Turna** | PANOPT kanal botu | Müdahale (Sisaltı profili) | Kanal ağzı kapatma; sonar şamandırası bırakır (yarı dalışın sonar körlüğünü kırar) |
| **Duvar** | ağır barikat kamyonu | Bastırma | Kavşak ölçekli fiziksel kapatma; sabit, önceden konuşlanır |
| **Çoban** | koordinasyon dronu | Bastırma | Birimleri sürü halinde yönetir; düşürülürse birim koordinasyonu 20 sn dağılır (okunabilir zayıf nokta) |
| **KV Ecel** | taktik gunship | Bastırma (Gerilim 70+ bölge) | Havadan ışıldak + tırmanan angajman; sivil yoğun alanda ateş izni yoktur (adalet korkuluğu, LW-GDD-16) |

Zenit Halkası'nda kovalayan PANOPT değil **Yıldırım Orbital istasyon güvenliği**dir
(hukuk boşluğu, LW-GDD-01): önleyici mekikler kilitlenme ışını değil, rıhtım
ablukası ve gümrük kesişme rotaları kullanır — yörünge kovalamacası bir refleks
oyunu değil, bir vektör satranç oyunudur.

### 8.2 Yol kesme mantığı

1. **Tahmin:** PANOPT, oyuncunun Kaçış ekseni profilinden (LW-GDD-03) olası
   rota konisini çıkarır; kesme noktaları koninin 25–40 sn ilerisine kurulur.
   Profil kirletme (Mara) bu tahmini 2 oyun-günü boyunca saptırır.
2. **Görünürlük kuralı:** hiçbir birim veya barikat oyuncunun görüş alanında
   belirmez; asgari kuruluş mesafesi 250 m veya görüş hattı dışı. İhlal,
   otomatik telemetri kapısında hata sayılır.
3. **Araç durdurucular:** lastik patlatan diken şeridi yerine **manyetik
   kıskaç şeridi**: temas eden araçta 4 sn kontrol yüzeyi A1 etkisi + hız
   tavanı −%30 (20 sn). Motosikletler şeridi ön kaldırışla (wheelie) atlayabilir
   — ustalık cevabı her durdurucuda tanımlıdır.
4. **Tırmanma hızı:** kesme yoğunluğu, kovalamaca süresi + profil imza eşleşmesiyle
   artar; ancak eşzamanlı aktif birim tavanı sabittir (kara: 8, hover: 6,
   kanal: 4, yörünge: 3). Yıpratma savaşı değil, oyun kurma savaşı hedeflenir.
5. **Lastik-bant yasağı:** takipçiler oyuncuya yetişmek için fizik dışı hız
   almaz (rubber-banding yok). Baskı, yol kesmeyle kurulur; adalet ilkesi
   LW-GDD-16'nın "tepki asla rastgele cezalandırmaz" korkuluğuyla ortaktır.

### 8.3 Kaçış ve çözülme

- **Kapsama coğrafyası kaçışın haritasıdır:** İlgi 90 sn temiz davranışla
  veya kapsama boşluğuna girişle söner (LW-GDD-03). Sisaltı (%25) ve Dış
  Halka (%5) doğal sığınaklardır; oraya kaçmayı alışkanlık yapan oyuncunun
  profili tam da orada karşılanır (LW-GDD-04 dron bariyeri örneği).
- **İmza kırma araçları:** Küvet boyahanesi (görsel imza), imza bastırıcı
  parça (ısı/sinyal), araç değiştirme (en güçlüsü — PANOPT araç-oyuncu bağını
  yeniden kurmak zorunda kalır, 40–70 sn arama penceresi).
- **Kovalamaca sonu ekonomisi:** kaçış başarısı iz bırakır ama ceza bırakmaz;
  yakalanma/araç kaybı PANOPT cezaları sink'ine yazılır (LW-GDD-05, 500–75.000 LM).
- **Vitrin hedefi:** playtest metriği — ortalama kovalamaca 3–6 dk; 10 dakikayı
  geçen kovalamacaların %90'ı oyuncunun bilinçli "kovalamacayı uzatma" oyunuyla
  (yarış ligi itibarı, Online seyirci modu) gerçekleşmeli.

---

## 9. Açık Sorular

1. **Hover ligi ile PANOPT İlgi mekaniğinin çakışması:** LW-GDD-03 hover
   liginde koridor ihlalini "yarış mekaniği" sayıyor; lig sırasında biriken
   İlgi, yarış sonrası profile ne oranda yazılmalı? Tam yazım ligleri
   cezalandırır, sıfır yazım kaçakçılara bedava antrenman verir. Önerimiz
   %25 katsayı — Direktörlük onayı gerekli.
2. **Mekik çalmanın Online ekonomiye etkisi:** Kimliksizleştirilmiş mekikler
   Kaçakçılık Ligi'nde kullanılabilsin mi? Kullanılırsa 1,9M+ LM'lik sınıfa
   "ucuz giriş" açılıyor; yasaklanırsa "evet, mekik de çalınır" vaadi Online'da
   yarım kalıyor. Üçüncü yol (çalıntı mekik ligde −%20 performans limitörü)
   his bütünlüğünü bozar mı?
3. **Sivil araç hasarında tazmin zinciri:** `CitizenRecord` sahipli araçların
   yıkımı tutum skoru + PANOPT cezası üretiyor; ayrıca bölge Gerilim Endeksi'ne
   işlenmeli mi? İşlenirse araba yakmak bölge savaşı hazırlığında "ucuz gerilim
   pompası" olabilir (istismar riski).
4. **Kontrol edilmeyen protagonistlerin araçları:** Kaan oynarken Solene'in
   Kara Leylek'i simülasyonda nerede? Önerimiz: görev-kilitli araçlar sahibinin
   LOD 1 baloncuğunda kalır ve çalınamaz/hasar almaz — ama bu, %100 simülasyon
   iddiasıyla gerilim yaratıyor. Direktörlük istisna listesini onaylamalı.
5. **Sigorta primlerinin enflasyon rolü:** Sable Teminat primleri kalıcı bir
   haftalık sink; LW-GDD-05'in kaynak:sink hedefi (1,00:0,90–0,95) içindeki
   payı Ekonomi Lideri'yle ortak modellenmeli. Prim oranları bu belgede
   dondurulmalı mı, sezonluk ayarlanabilir mi kalmalı?
6. **Deniz sınıfında dalış derinliği:** Çapa Yılanbalığı'nın yarı dalışı 6 m
   ile sınırlı; tam denizaltı fantezisi (Sisaltı Seli enkaz katmanı) kapsam
   içine alınsın mı? Fizik maliyeti düşük, içerik maliyeti (su altı POI seti)
   yüksek — kapsam kararı Yapım Direktörü'ne de bağlı (LW-GDD-18).

---

## 10. Çapraz Referanslar

| Belge | Kesişim |
| --- | --- |
| LW-GDD-03 | Araç sınıf tablosu, Buz Katmanı, PANOPT durum makinesi, traversal, yakıt/bilet maliyetleri |
| LW-GDD-04 | Trafik LOD ve bütçeleri, hava durumu, `CitizenRecord`, akış katmanı hackleme |
| LW-GDD-05 | LM fiyat bantları, Madde 5 (performans satışı yasağı), manipülasyon yaptırımları |
| LW-GDD-10 | Serbest Dolaşım araç kuralları, Kaçakçılık Ligi, crew garajı |
| LW-GDD-13 | Bölge yol dokuları, koridor geometrisi, Zenit rıhtım yerleşimi |
| LW-GDD-16 | Kovalamaca adalet korkulukları, KV birim arketipleri, sivil angajman kuralları |

## Sürüm Geçmişi

| Sürüm | Tarih | Yazar | Değişiklik |
| --- | --- | --- | --- |
| 1.0 | 5 Temmuz 2026 | Araç ve Fizik Lideri | İlk sürüm |

---

## Kurgusallık Notu

*Bu doküman bir konsept çalışmasıdır. LUMENFALL, Lumenworks Studios, Duskforge
Engine ve burada geçen tüm kişi, kurum, marka, araç ve fiyatlar tamamen
kurgusaldır; gerçek kişi, kurum veya ürünlerle benzerlikler tesadüfidir ve
hiçbir ticari taahhüt oluşturmaz.*
