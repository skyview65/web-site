# LUMENFALL — Açık Dünya Simülasyonu

| Alan | Değer |
| --- | --- |
| **Belge No** | LW-GDD-04 |
| **Sürüm** | 1.0 |
| **Tarih** | 3 Temmuz 2026 |
| **Sahip** | Lumenworks Tasarım Ekibi |
| **Durum** | İnceleme |
| **Motor** | Duskforge Engine |
| **Kapsam** | Şehir + yörünge katmanı simülasyon mimarisi (tek oyunculu ve Online ortak çekirdek) |

> **Bağlayıcılık notu:** Bu belge LUMENFALL Kanonu'na tabidir. Kanonla çelişen hiçbir değer
> geçerli değildir. Anahtar sabitler: **310 km² şehir + yörünge katmanı**, **1.2M simüle
> vatandaş**, **9 bölge**, **200+ araç**, **%100 kesintisiz dünya (yükleme ekranı yok)**.

**İlgili belgeler:** LW-GDD-01 *Vizyon*, LW-GDD-02 *Dünya ve Bölgeler*, LW-GDD-03
*Karakterler ve Anlatı*, LW-GDD-05 *Oynanış Sistemleri*, LW-GDD-06 *LUMENFALL Online ve
Canlı Servis*, LW-TDD-01 *Duskforge Teknik Tasarım*.

---

## Yaşayan NPC Simülasyonu

### Tasarım hedefi

Lumenfall'ın 1.2 milyon vatandaşı dekor değil, **veri**dir. Her vatandaşın kalıcı bir
kimliği, günlük rutini, ilişki ağı ve oyuncuyu hatırlayan bir hafızası vardır. Tasarım
ilkesi şudur: *"Oyuncu aynı sokaktan iki kez geçtiğinde, sokak onu bir kez görmüş
olmalıdır."* Bu hedef, PANOPT anlatısıyla mekanik olarak örtüşür — şehir YZ'si vatandaşları
nasıl izliyorsa, simülasyon da oyuncuyu aynı altyapıyla izler (bkz. LW-GDD-03, PANOPT/REGENT).

### Kalıcı kimlik: VatandaşKaydı (CitizenRecord)

1.2M vatandaşın her biri, dünya veritabanında sabit bir `CitizenRecord` ile temsil edilir:

- **Sabit alanlar (üretim anında, deterministik tohum):** kimlik numarası, ad, yaş, görünüm
  tohumu, ev bölgesi, iş bölgesi, meslek, fraksiyon eğilimi, konuşma arketipi.
- **Değişken alanlar (oyun boyunca güncellenir):** ruh hâli, servet (LM), sağlık durumu,
  oyuncuya yönelik tutum skoru (−100…+100, protagonist başına ayrı — bkz. LW-GDD-03),
  suç/mağduriyet geçmişi, PANOPT "hafıza defteri" kaydı.
- **Bellek maliyeti:** kayıt başına 96 bayt sabit + değişken bölüm için havuzlanmış 32–160
  bayt. Toplam vatandaş veritabanı hedefi: **≤ 256 MB** (tüm platformlarda diskte,
  konsolda bellek-eşlemeli).

Görünüm, isim ve ses; tohumdan **deterministik** üretilir. Böylece aynı vatandaş, aynı
kayıttan her karşılaşmada aynı yüz ve aynı sesle örneklenir; diskte model/doku saklanmaz.

### Rutin

Her vatandaşın 24 saatlik bir **rutin çizelgesi** vardır: uyku → işe gidiş → iş → sosyal
blok → eve dönüş. Çizelgeler meslek arketiplerinden (54 arketip; liman işçisi, veri
tüccarı, Kessler-Voss devriyesi, dikey tarım teknisyeni…) türetilir ve bölge kimliğiyle
renklendirilir: Neon Liman'ın gece ekonomisi rutinleri geceye, Bahçeler'in kooperatif
vardiyaları şafağa yığılır. Rutinler istatistiksel katmanda saatlik tik ile, aktif
katmanlarda dakikalık çözünürlükle ilerletilir.

### İlişki ağı

Vatandaşlar arası ilişkiler tam çizge olarak tutulmaz (1.2M² ölçeklenemez). Bunun yerine:

- **Hane çizgesi:** vatandaş başına 0–6 sabit bağ (aile/ev arkadaşı). Üretim anında kurulur.
- **İş/fraksiyon kümeleri:** vatandaşlar küme kimliğiyle bağlanır; küme içi ilişki,
  gerektiğinde tohumdan türetilir.
- **Olay bağları:** oyuncu kaynaklı olaylar (tanıklık, yardım, zarar) en fazla **200.000**
  kayıtlık küresel bir "olay bağı" havuzuna yazılır; havuz dolunca önem skoru en düşük
  bağlar silinir (bkz. *Oyuncu Etkisinin Kalıcılığı*).

Bu yapı, "Kaan bir tanığı Pas Kuşağı'nda kurtardı → tanığın kardeşi üç gün sonra Mara'ya
indirim yaptı" türü zincirleri, tam çizge maliyeti olmadan üretir.

### Hafıza

NPC hafızası üç kademelidir:

1. **Tanıklık belleği (yerel):** LOD 0–1'deki NPC'ler son 90 saniyenin olay akışını tutar;
   kavga, silah sesi, kaza. Davranış ağacına doğrudan girdi.
2. **Kişisel hafıza (kalıcı):** oyuncuyla anlamlı etkileşimler (eşik: önem skoru ≥ 3)
   `CitizenRecord`'a özetlenerek yazılır: *ne oldu, hangi protagonist, hangi bölge, tutum
   deltası.* NPC başına en fazla 8 özet; yenisi geldiğinde en önemsizi düşer.
3. **PANOPT hafıza defteri (küresel):** kamera/dron kapsamasındaki olaylar PANOPT'a da
   yazılır. PANOPT'un uyarlanabilir aranma sistemi bu defterden öğrenir (bkz. *Dinamik
   Olay Sistemi*). **Dış Halka kanon gereği kapsama dışıdır** — orada işlenen suçlar
   deftere girmez; yalnız insan tanıklar hatırlar. Bu, bölgeye mekanik kimliğini verir.

### LOD katmanları

1.2M vatandaş beş simülasyon katmanına bölünür. Katmanlar bütçe tablolarıyla uyumludur
(bkz. *Performans Bütçeleri*).

| Katman | Ad | Nüfus (hedef) | Güncelleme | İçerik |
| --- | --- | --- | --- | --- |
| LOD 0 | Sahne | ≤ 160 | Her kare (60/30 Hz) | Tam animasyon, tam davranış ağacı, diyalog, fizik, tanıklık belleği |
| LOD 1 | Yakın Çevre | ≤ 800 | 10 Hz | Basitleştirilmiş davranış, empoze animasyon, navigasyon ağı üzerinde hareket |
| LOD 2 | Mahalle | ≤ 12.000 | 1 Hz | Ajan tabanlı; nokta konum + rutin takibi, çarpışmasız akış alanı |
| LOD 3 | Bölge | ≤ 150.000 | Oyun dakikası başına 1 tik | Rutin durum makinesi; konum = bina/blok çözünürlüğü |
| LOD 4 | Şehir Defteri | ~1.04M (kalan) | Oyun saati başına 1 tik | Salt veri; istatistiksel rutin, ekonomi ve nüfus akışları |

**Katmanlar arası geçiş:** oyuncu (ve kontrol edilmeyen protagonistler — kanon gereği kendi
gündemlerini yaşarlar ve çevrelerinde LOD 1 baloncuğu taşırlar) merkezli yarıçap + görüş
konisi ile terfi/tenzil yapılır. Titremeyi önlemek için 15 sn histerezis uygulanır. Terfi
eden vatandaş, `CitizenRecord` + rutin durumundan **kaldığı yerden** örneklenir: LOD 4'te
"19:40, Neon Liman, kumarhane vardiyası" görünen vatandaş, oyuncu oraya gittiğinde
gerçekten o kumarhanede, o üniformayla bulunur. Bu tutarlılık pazarlanabilir bir özellik
değil, **kabul kriteridir**: rastgele terfi denetim testi, 10.000 örneklemede ≥ %99,5
rutin tutarlılığı şartı koşar.

---

## Dinamik Olay Sistemi

### Kent Yönetmeni (City Director)

Dünya olayları, saniyede bir çalışan **Kent Yönetmeni** servisçe üretilir. Yönetmen üç
girdiyi harmanlar: bölge durumu (ekonomi, gerilim, hava), oyuncu profili (PANOPT defteri)
ve tempo eğrisi (son 20 dakikadaki yoğunluk). Amaç doğaçlama değil, **basınç dengesi**dir:
sakin geçen oyuncuya dünya kendi hayatını gösterir; kaos çıkaran oyuncuya dünya cevap verir.

### Olay sınıfları

| Sınıf | Örnek | Kaynak | Sıklık hedefi |
| --- | --- | --- | --- |
| Ortam | sokak pazarı, dron bakımı, Bahçeler hasat vardiyası | Bölge rutini | Sürekli, tempo dışı |
| Fırsat | kaçak kargo düşüşü (Sisaltı), veri kuryesi (Gölgepazar) | Ekonomi simülasyonu | 6–10 dk'da 1 |
| Çatışma | çete baskını (Pas Kuşağı), Kessler-Voss operasyonu | Fraksiyon gerilim skoru | Gerilime bağlı |
| Sistemik | enerji kesintisi, sel uyarısı (Sisaltı), asansör trafiği kilidi | PANOPT altyapı simülasyonu | Nadir, yüksek etki |
| Anlatısal | protagonist gündem olayları, sezonluk Online olayları | LW-GDD-03 / LW-GDD-06 | Elle yazılmış |

Kurallar: aynı olay şablonu aynı bölgede 30 dk soğumaya girer; iki "yüksek etki" olay üst
üste binmez; her olay bölge kimlik filtresinden geçer (Kordon'da sokak çatışması üretilmez,
özel güvenlik müdahalesi üretilir).

### PANOPT uyarlanabilir tepkisi

PANOPT'un aranma sistemi kademeli "wanted level" değildir; **öğrenen bir rakiptir**
(kanon). Simülasyon tarafındaki karşılığı: PANOPT, hafıza defterinden oyuncu başına bir
taktik profil çıkarır (kaçış rotaları, tercih edilen araç sınıfı, saldırı saatleri, hangi
protagonistle hangi bölgede çalıştığı) ve müdahale şablonlarını buna göre seçer. Sisaltı
kanallarından kaçmayı alışkanlık edinen oyuncu, üçüncü kaçışında kanal ağızlarında dron
bariyeri bulur. Profil, dünya durumunun parçasıdır ve kayıtla birlikte kalıcıdır (bkz.
*Oyuncu Etkisinin Kalıcılığı*). REGENT'a bağlı anlatısal istisnalar LW-GDD-03'te tanımlıdır.

---

## Trafik ve Kalabalık Simülasyonu

### Katmanlı ulaşım ağı

310 km² şehir + yörünge katmanı, dört ulaşım katmanıyla modellenir; 200+ araçlık garaj bu
katmanlara dağılır (yerden kesik araçlardan yörünge mekiklerine — kanon):

1. **Zemin/yerden kesik şeritler:** sokak seviyesinde şerit çizgesi; ~9.400 düğüm.
2. **Alçak hava koridorları:** bölgeler arası hover trafiği; PANOPT'un yönettiği dinamik
   koridor rezervasyonu.
3. **Yüksek koridorlar + Yükseliş hattı:** uzay limanı yaklaşımları ve yörünge asansörü
   çevresindeki kontrollü hacim.
4. **Yörünge katmanı:** Zenit Halkası çevresinde mekik hatları; kesintisiz geçiş (sokak →
   asansör → yörünge, yükleme ekranı yok) boyunca trafik LOD'u hiç boşalmaz, yalnız katman
   değiştirir.

### Trafik LOD'u

| Katman | Araç sayısı (hedef) | Model |
| --- | --- | --- |
| Fiziksel | ≤ 48 | Tam araç fiziği, hasar, sürücü NPC'si LOD 0/1 |
| Kinematik | ≤ 400 | Şerit takibi + basit çarpışma, empoze tekerlek/iticiler |
| Akış | bölge başına akış alanı | Araç = yoğunluk verisi; kavşak/koridor kapasite simülasyonu |

Trafik yoğunluğu ekonomiden beslenir: Bahçeler → Çekirdek gıda konvoyları sabah yoğunluğu
üretir; Neon Liman gece tepe yapar. **PANOPT trafiği yönettiği için trafik hacklenebilir bir
oyun yüzeyidir** (Mara'nın araç setiyle sinerji, bkz. LW-GDD-05): ışık/koridor manipülasyonu
akış katmanında çözülür, sonuçları fiziksel katmana terfi eder.

### Kalabalık

Yaya kalabalığı LOD 2'de **akış alanı** (flow field) ile, LOD 0–1'de yerel kaçınma (RVO)
ile çözülür. Panik yayılımı hücresel otomattır: silah sesi, hücre başına korku değeri
yükseltir; korku eşiği aşan NPC'ler rutinlerini keser ve tanıklık belleğine olay yazar.
Bölge başına kalabalık dokusu ayarlanabilir: Çekirdek seyrek ve sessiz, Neon Liman gece
yoğun, Dış Halka kamp çevrelerinde kümeli.

---

## Hava ve Gün Döngüsü

### Zaman ölçeği

- 1 oyun günü = **48 dakika gerçek zaman** (görev içinde yönetmen yavaşlatabilir; Online'da
  sabit).
- Zenit Halkası, asansör üst noktasında güneşi şehirden **~34 dakika (oyun zamanı) önce**
  görür; yörünge katmanında şafak, şehirde hâlâ gecedir. Kesintisiz asansör yolculuğu bu
  geçişi tek çekimde gösterir — vitrin anlarından biridir.

### Hava durumu mimarisi

Hava, şehir geneli bir cephe sistemi + **bölge mikroklimaları** olarak simüle edilir.
Durumlar: açık, pus, yağmur, asit yağmuru (sanayi rüzgârıyla), elektrik fırtınası, toz
fırtınası (Dış Halka), yoğun sis (Sisaltı — bölgenin adı ve 2093 seli kanonuyla tutarlı
olarak kalıcı sis tabanı vardır, cepheler yalnız yoğunluğunu değiştirir).

Oynanış kancaları: yağmur yol tutuşunu ve dron görüşünü düşürür (PANOPT kapsaması −%20),
sis Sisaltı kaçakçılık görevlerinde algılama menzilini kısar, elektrik fırtınası hover
koridorlarını geçici kapatır ve trafik akışını zemine bastırır. Hava durumu, Kent
Yönetmeni'ne girdi olarak verilir; "fırtınada baskın" gibi bileşimler kasıtlı olarak
üretilir.

### Işık kimliği

Gün döngüsü, görsel kimliğin taşıyıcısıdır: vantablack gece zemininde camgöbeği/macenta/
amber sinyal ışıkları (bölge ve protagonist aksan renkleri) öne çıkar; "karanlık parlar"
ilkesi gereği gece, oyunun en okunaklı saatidir. Ayrıntılar LW-ART-01'de.

---

## Ekosistem ve Bölge Ekonomileri

### Bölge profilleri

Her bölge; üretim, tüketim ve gerilim parametreleriyle bir ekonomik düğümdür:

| Bölge | Üretir | Tüketir | Simülasyon vurgusu |
| --- | --- | --- | --- |
| Çekirdek | finans, veri işleme | enerji, güvenlik | Beyaz yaka rutin yoğunluğu |
| Neon Liman | eğlence geliri | lüks mal, işgücü | Gece ekonomisi tepe eğrisi |
| Pas Kuşağı | hurda, kaçak üretim | hammadde | Çete gerilim endeksi |
| Yükseliş | yörünge lojistiği | yakıt, mühendislik | Asansör sefer çizelgesi |
| Sisaltı | kaçak mal akışı | her şey (karaborsa) | Kaçakçılık rotaları |
| Bahçeler | gıda | su, enerji, işgücü | Hasat/konvoy döngüsü |
| Kordon | sermaye | güvenlik, lüks | Kapalı ekonomi, düşük geçirgenlik |
| Gölgepazar | veri, istihbarat | donanım | Bilgi fiyat piyasası |
| Dış Halka | işgücü göçü | gıda, ilaç | Kıtlık ve yardım olayları |

### Piyasa simülasyonu

Kanon ilkesi: **oyuncu güdümlü piyasa; 9 bölgede arz-talebe göre dalgalanan fiyatlar.**
Uygulama: 40 mal kategorisi × 9 bölge fiyat matrisi, oyun saati başına güncellenir.
Fiyat = taban × kıtlık çarpanı × gerilim çarpanı × olay değiştiricisi (sınır: taban ×0,4
… ×3,0). Mal akışları LOD 4 konvoy/kurye simülasyonuyla taşınır; oyuncu bir konvoyu
vurursa hedef bölgede kıtlık çarpanı gerçekten yükselir. Para birimi Lümen'dir (LM);
Prizma yalnız Online kozmetiktir ve **piyasa simülasyonuna hiçbir girişi yoktur**
(pay-to-win yasağı — kanon, ayrıntı LW-GDD-06).

Ekosistem katmanı ekonomiyle aynı düğümleri kullanır: enerji şebekesi (Aeon Dynamics
hatları), su/sel seviyesi (Sisaltı pompaları), gıda zinciri (Bahçeler). PANOPT enerjiyi
yönettiği için şebekeye yapılan sabotaj, hem ışık/güvenlik hem fiyat tarafında yayılır —
tek olay, üç sistemde iz bırakır.

---

## Oyuncu Etkisinin Kalıcılığı

### Mimari: Dünya Durum Defteri (WorldStateLedger)

Dünya durumu, temel dünyanın üzerine bindirilen **katmanlı delta** modeliyle saklanır.
Temel dünya (binalar, rutin şablonları, ekonomi tabanları) salt okunurdur; oyuncu ve
simülasyon kaynaklı her kalıcı değişiklik, anahtar-değer deltası olarak deftere yazılır.
Anlatı tonuyla bilinçli örtüşme: oyuncunun kaydı da, PANOPT'unki gibi, bir *hafıza
defteridir* — ve tıpkı Deniz'in silinmesi gibi, defterden düşen kayıtlar dünya için hiç
yaşanmamış olur.

Delta sınıfları ve bütçeleri:

| Sınıf | İçerik | Saklama | Bütçe |
| --- | --- | --- | --- |
| Kalıcı-sert | Görev sonuçları, protagonist ilerlemesi, mülk/üs, anlatısal dünya değişimleri | Süresiz | ≤ 4 MB |
| Kalıcı-yumuşak | NPC kişisel hafızaları, olay bağı havuzu, PANOPT taktik profili, tutum skorları | Önem skorlu tahliye | ≤ 24 MB |
| Ekonomik | Fiyat matrisi, kıtlık durumları, bölge gerilim endeksleri | Tam durum, her kayıtta | ≤ 2 MB |
| Sahne | Enkaz, hasar, ceset/araç kalıntıları | Bölgeden çıkınca 3 oyun günü söner | Bellekte, diske yazılmaz* |

\* İstisna: "anlatısal enkaz" olarak işaretlenen nesneler (görevle yaratılmış kalıcı
yıkım) Kalıcı-sert sınıfına terfi eder.

### Tahliye ve önem skoru

Kalıcı-yumuşak katman dolduğunda tahliye; `önem = etki büyüklüğü × yakınlık (protagonist
ilişkisi) × tazelik` skoruna göre en düşükten başlar. Tasarım garantisi: oyuncunun **son
10 oyun saatindeki** hiçbir kişisel hafıza kaydı tahliye edilemez; "dün kurtardığım adam
beni unuttu" durumu sistemsel olarak imkânsızdır.

### Kayıt ve senkronizasyon

- Tek oyunculu: defter, kayıt dosyasının çekirdeğidir (hedef toplam ≤ 32 MB, sıkıştırılmış).
  Sürüm damgalı şema; yamalar eski defterleri göç ettirmekle yükümlüdür.
- Online: Kalıcı-sert ve Ekonomik sınıflar sunucu otoritesindedir; kişisel hafıza katmanı
  oyuncu başına sunucuda tutulur. Bölge savaşlarının haftalık el değişimi (LW-GDD-06),
  Ekonomik sınıfın üzerine sezon deltası olarak biner — tek oyunculu defter şemasıyla aynı
  altyapı, farklı otorite.
- Çapraz ilerleme: defter platformdan bağımsız serileştirilir (kanon: çapraz platform +
  çapraz ilerleme).

---

## Performans Bütçeleri

### Platform kademeleri

| Kademe | Hedef | Çözünürlük/kare |
| --- | --- | --- |
| K1 | 9. nesil konsol — performans modu | 60 fps, dinamik 1440p |
| K2 | 9. nesil konsol — kalite modu | 30 fps, dinamik 4K |
| K3 | PC önerilen | 60 fps, 1440p |
| K4 | PC üst / bulut sunucu profili | 120 fps / sunucu tarafı simülasyon |

### Kare zamanı bütçesi (K1, 16,6 ms; simülasyon iş parçacıkları)

| Sistem | Bütçe (ms) | Not |
| --- | --- | --- |
| NPC LOD 0–1 (davranış + animasyon) | 3,2 | İş çalıcı (job) tabanlı, çekirdeklere dağıtık |
| Kalabalık LOD 2 + akış alanları | 1,4 | 1 Hz tam güncelleme, kare başına dilimli |
| Trafik (fiziksel + kinematik) | 1,8 | Araç fiziği ayrı ada |
| Kent Yönetmeni + olaylar | 0,4 | 1 Hz, kare başına amorti |
| Ekonomi + LOD 3/4 tikleri | 0,3 | Asenkron, kare dışı; buraya yalnız senkron maliyeti |
| PANOPT sorguları (defter/algılama) | 0,5 | Bütçe aşımında sorgu kuyruğu ertelenir |
| Navigasyon/yol bulma | 0,8 | Hiyerarşik; bölge çizgesi + yerel ağ |
| **Simülasyon toplamı** | **8,4** | Kalan bütçe: render/ses/akış (LW-TDD-01) |

### Nüfus, araç ve çizim bütçeleri

| Metrik | K1 (60) | K2 (30) | K3 | K4 |
| --- | --- | --- | --- | --- |
| NPC LOD 0 (tam) | 120 | 160 | 160 | 200 |
| NPC LOD 1 | 600 | 800 | 800 | 1.000 |
| NPC LOD 2 (mahalle ajanı) | 8.000 | 12.000 | 12.000 | 16.000 |
| Fiziksel araç | 36 | 48 | 48 | 64 |
| Kinematik araç | 300 | 400 | 400 | 560 |
| Çizim çağrısı (kare, hedef/tavan) | 2.800 / 3.500 | 3.800 / 4.500 | 3.800 / 4.500 | 5.000 / 6.000 |
| Görünür üçgen (M, hedef) | 12 | 20 | 20 | 30 |
| Simülasyon belleği (vatandaş DB + defter + trafik) | 480 MB | 480 MB | 640 MB | 768 MB |

LOD 3 (≤ 150.000) ve LOD 4 (~1.04M) katmanları kare bütçesine girmez; asenkron tik
kuyruğunda çalışır ve tik başına **≤ 2 ms tekil çekirdek** bütçesiyle sınırlıdır. Asansör
geçişi (sokak → yörünge) sırasında akış sistemi bölge verisini önden ısıtır; kesintisiz
dünya şartı gereği geçişte hiçbir katman bütçe üstüne çıkamaz — bu, sahne başına otomatik
telemetriyle (her gece derlemesinde 9 bölge + asansör hattı uçuş testi) kapı (gate)
olarak denetlenir. Bütçeyi üç gece üst üste aşan sistem, içerik kilidi (content lock)
tetikler.

### Uygulama ilkeleri

1. **Bütçe, özellikten önce gelir:** yeni simülasyon özelliği, tabloda yer açılmadan
   birleştirilemez.
2. **Ölçek asla sahtelenmez:** 1.2M vatandaş pazarlama sayısı değil, LOD 4 defterinin
   satır sayısıdır; denetim aracı her sürümde doğrular.
3. **Tutarlılık ölçülür:** LOD terfi tutarlılığı (%99,5), hafıza garantisi (son 10 saat)
   ve fiyat sınırları (×0,4–×3,0) otomatik test kapsamındadır.

---

*Bu belge LUMENFALL Kanonu (LUMENFALL_CANON.md) ile birlikte okunmalıdır. Çelişki hâlinde
kanon esastır. Geri bildirim: Lumenworks Tasarım Ekibi — inceleme penceresi Sürüm 1.1'e
kadar açıktır.*
