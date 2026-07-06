# LUMENFALL — Yan İçerik ve Aktiviteler

> **"Karanlık parlar."**

| Alan | Değer |
| --- | --- |
| **Belge No** | LW-GDD-12 |
| **Sürüm** | 1.0 |
| **Tarih** | 5 Temmuz 2026 |
| **Sahip** | Açık Dünya İçerik Lideri |
| **Durum** | İnceleme |
| **Gizlilik** | Stüdyo İçi — Dağıtım Onaya Tabidir |

Bu belge, LUMENFALL'un ana hikâye dışındaki tüm oyuncu-yüzlü içeriğini tanımlar:
yan görev zincirleri, rastgele karşılaşmalar, koleksiyonlar, mini oyunlar, NPC
tanışıklık sistemi, içerik yoğunluk bütçeleri ve yan içeriğin ödül ekonomisi.
Simülasyon altyapısı için LW-GDD-04, ekonomi kuralları için LW-GDD-05, bölge
kimlikleri için LW-GDD-01 ile birlikte okunmalıdır. Kanonda tanımlı adlar,
tarihler ve sayılar bağlayıcıdır; bu belgede üretilen tüm yeni ayrıntılar
kanonla tutarlıdır.

---

## 1. Yan İçerik Felsefesi

### 1.1 Dolgu İçerik Yasağı

LUMENFALL'da **dolgu içerik yasaktır**. 310 km² şehir + yörünge katmanı, harita
ikonlarıyla doldurulacak bir yüzey değil, 1.2M vatandaşın yaşadığı bir
anlatı makinesidir. İlke tek cümledir:

> **Her aktivite ya karakter, ya dünya, ya ekonomi anlatır. Üçünü de
> anlatmayan aktivite üretilmez.**

### 1.2 Üç Soru Kapısı

Her yan içerik önerisi, üretime girmeden önce **Üç Soru Kapısı**'ndan geçer.
En az bir soruya somut "evet" alamayan öneri reddedilir; ikiden fazla "evet"
alan öneriler önceliklendirilir.

| Soru | Ölçüt | Örnek geçer / kalır |
| --- | --- | --- |
| **Karakter mi anlatıyor?** | Üç protagonistten en az birinin geçmişine, ahlakına veya ilişkilerine dokunuyor mu? | Geçer: Kaan'ın eski Kessler-Voss dosyasını açan tanık. Kalır: kimliksiz "haydutları temizle" noktası. |
| **Dünya mı anlatıyor?** | 2061–2099 zaman çizelgesinin, bir fraksiyonun veya bir bölge kimliğinin somut bir yüzünü gösteriyor mu? | Geçer: 2093 Seli'nin batırdığı sokakların plakalarını çıkaran dalış. Kalır: bölgeden bağımsız kasa açma noktası. |
| **Ekonomi mi anlatıyor?** | Oyuncu güdümlü piyasada (LW-GDD-05) ölçülebilir bir iz bırakıyor mu? | Geçer: konvoy eskortu — varış, hedef bölgede kıtlık çarpanını düşürür. Kalır: piyasaya bağlanmayan jenerik kurye işi. |

### 1.3 Tasarım Kuralları

1. **Tekrarlanabilirlik dürüsttür:** Tekrarlanabilir aktiviteler (yarış, kumar,
   sözleşme) kendini görev gibi pazarlamaz; tek seferlik anlatı içeriği asla
   kopyala-yapıştır çoğaltılmaz.
2. **Her aktivite simülasyona bağlanır:** Yan içerik, Kent Yönetmeni ve
   `CitizenRecord` altyapısını kullanır (LW-GDD-04); kendi paralel sahte
   sistemlerini kurmaz.
3. **Reddedilebilirlik:** Hiçbir yan içerik zorunlu değildir; ana hikâye
   ilerlemesi yan içerik tamamlama şartına bağlanamaz.
4. **REGENT perdesi:** Yan içerik REGENT'i adıyla asla anmaz (LW-GDD-01 kırmızı
   çizgisi); yalnızca anomalilerle — imkânsız veri boşlukları, kimsenin
   hatırlamadığı kişiler — sezdirir.
5. **Umut kıvılcımı:** En karanlık yan görev bile oyuncuya küçük, gerçek bir
   iyilik anı bırakır (LW-GDD-01 ton kılavuzu).

---

## 2. Yan Görev Zincirleri

### 2.1 Yapı Kuralları

- Her zincir **3–5 aşamadan** oluşur; aşamalar arasında dünya-zamanı geçebilir
  (bir aşama, vereni NPC'nin rutinine bağlıysa oyuncu onu rutin saatinde bulur).
- Zincir verenler ya el yazımı **Semt Siması** (bkz. Bölüm 6) ya da fraksiyon
  temsilcisidir; hiçbir zincir "isimsiz panodan" verilmez.
- Aşama başına ödeme LW-GDD-05 sözleşme bandında kalır (1.500–20.000 LM);
  zincir finalleri ek olarak benzersiz, güç vermeyen ödül taşır (kozmetik,
  araç varyantı, tanışıklık, bilgi).
- Lansman hedefi: **60 el yazımı zincir** (dağılım: Bölüm 7). Aşağıda her bölge
  için birer örnek zincir, üretim kalite çıtası olarak tanımlanmıştır.

### 2.2 Örnek Zincirler (Bölge Başına Bir Adet)

**Çekirdek — "Sıfır Bakiye"**
- **Veren:** Emre Sandoval, Aeon Dynamics Hafıza Defteri arşiv memuru (Semt Siması).
- **Aşamalar:** (1) Sandoval, defterde "var olmaması gereken" boş satırlar
  bulduğunu fısıldar; oyuncu üç boş kaydın fiziksel adreslerini gezer — üçü de
  boş dairedir. (2) Dairelerden birinde eski bir kira makbuzu: silinmiş bir ada
  ait. (3) Gölgepazar'da makbuzu doğrulatma (Hafıza Simsarları ücret ister:
  2.000 LM). (4) Sandoval'ın masasına dönüldüğünde memur "tayin edilmiştir";
  yerine oturan kişi oyuncuyu tanımaz. Zincir, cevapsız biter — kasıtlı.
- **Ödül:** 14.000 LM (aşama toplamı) + "Boş Satır" veri dosyası (Silinmiş
  Hafıza Parçaları koleksiyonuna sayılır) + Silinmişler +10 İP.
- **Anlatı işlevi:** REGENT anomalisinin ilk kontrollü sezdirilişi; Mara
  hattıyla rezonans.

**Neon Liman — "Gece Bülbülü"**
- **Veren:** Nara Sel, Meridyen Kumarhanesi şarkıcısı; Karat Sendikası'na
  340.000 LM borçlu.
- **Aşamalar:** (1) Nara'nın rehin verilmiş ses implantını kaçak lombarttan
  geri al (sızma veya 18.000 LM ödeme). (2) Karat tahsildarıyla "faiz
  yapılandırma" pazarlığı — Karat Sendikası şiddeti sevmez, defteri sever;
  sosyal çözüm mümkündür. (3) Nara'nın borcunun asıl kaynağını bul: Sable
  Group'un iptal ettiği bir yayın sözleşmesi. (4) Seçim: Sable arşivinden
  sözleşme kaydını çal (Karat borcu siler) ya da Nara'nın son konserinin
  bahis gelirine ortak ol.
- **Ödül:** 12.000–26.000 LM (seçime göre) + "Bülbül" araç kaplaması
  (kozmetik) + Karat Sendikası veya Nara tanışıklığı.
- **Anlatı işlevi:** Karat ↔ Sable defter savaşının (LW-GDD-01) sokak ölçeği.

**Pas Kuşağı — "Üç Baca'nın Külleri"**
- **Veren:** Usta Ferhat, kapanmış dökümhanenin son vardiya ustabaşı; Kül
  Köpekleri'nin akıl hocası.
- **Aşamalar:** (1) Kessler-Voss'un "kentsel temizlik" kontratı için keşif
  yapan dronu düşür (çürük kapsama: PANOPT tepkisi gecikmeli). (2) Kontrat
  belgesini Beyaz Eldiven bağlantısından satın al (6.000 LM) veya Kordon'dan
  çal. (3) Belgeyi Kül Köpekleri meclisine götür; meclis pusu mu, ifşa mı
  tartışır — oyuncunun oyu tartıyı bozar. (4) Pusu seçilirse konvoy baskını;
  ifşa seçilirse belgeyi Gölgepazar korsan yayınına ulaştırma kuryeliği.
- **Ödül:** 19.000 LM + "Kül" motosiklet varyantı (LM sınıf eşdeğerinin
  kozmetik boyaması) + Kül Köpekleri +15 İP; Pas Kuşağı Gerilim Endeksi +5
  (Kessler-Voss vekâlet baskısı; bölge olay karması değişir, LW-GDD-04).
- **Anlatı işlevi:** Kaan'ın gömülü cephesi; vekâlet savaşının anatomisi.

**Yükseliş — "Kayıt Hatası"**
- **Veren:** Onat "Fiş" Karaca, İrtifa Loncası sevkiyat komisyoncusu.
- **Aşamalar:** (1) Yıldırım Orbital gümrüğünde "kayıt hatasıyla" bekletilen
  üç konteyneri bul; içlerinden biri gerçekten kaçak değil — tıbbi yardım
  kargosu. (2) Kargoyu asansör yük hattına geri sokmak için manifesto
  sahtele (hack bulmacası, Bölüm 5.3). (3) Sevkiyata binen Kessler-Voss
  denetçisini oyala — kabin yolculuğu boyunca, kesintisiz sahne. (4) Zenit
  Halkası rıhtımında teslimat; Lonca, "hatanın" Yıldırım Orbital'in kasıtlı
  fiyat baskısı olduğunu doğrular.
- **Ödül:** 16.500 LM + Zenit rıhtım kısayol izni (kurgu içi erişim; hız/güç
  istatistiği yok) + İrtifa Loncası +12 İP.
- **Anlatı işlevi:** Lonca ↔ Yıldırım Orbital kedi-fare oyunu; Solene hattına
  köprü; sokak → asansör → yörünge vitrin geçişinin yan içerikteki kullanımı.

**Sisaltı — "Doksan Dört Düğümü"**
- **Veren:** Reis Saba, Kanal Ateşkesi'ni imzalayan tekne ailelerinden birinin
  matriyarkı.
- **Aşamalar:** (1) İki kanal ailesi arasında kargo kaybı suçlaması — batık
  depoya dalıp kayıp sandığı çıkar. (2) Sandıktaki mal sahte çıkar; sahtecinin
  izini tekne pazarında sür. (3) Sahteci, ateşkesi bozdurmak isteyen bir dış
  alıcıyla çalışmaktadır — buluşmayı gölgele (tekne takibi, sis içinde).
  (4) Alıcının Sable Group aracısı olduğu anlaşılır; kanıtı Reis Saba'ya
  götür veya aracıya geri sat (14.000 LM, Kanalcılar −20 İP).
- **Ödül:** 15.000 LM + "94 Düğümü" tekne dövmesi (karakter kozmetiği) +
  Kanalcılar +15 İP (dürüst yol) — bölgede fiyat çarpanı iyileşir
  (fraksiyon-ekonomi bağı, LW-GDD-01).
- **Anlatı işlevi:** 94 Ateşkesi'nin kırılganlığı; "kuru kalmak" argosunun
  oynanışa dönüşmesi.

**Bahçeler — "Tohum Anası"**
- **Veren:** Meral Odabaşı, Kule Bir agronomisti ve Kök Sendikası delegesi.
- **Aşamalar:** (1) Mirai Biyotek lisans denetçileri, kooperatifin "kayıt dışı
  tohum bankası" söylentisini araştırmaktadır; denetim rotasını öğren.
  (2) Tohum bankasını kule içi dikey sızmayla denetim öncesi taşı (envanter
  fiziksel taşınır — kesintisiz dünya kuralı). (3) Denetçinin çantasındaki
  gen tarayıcısını değiştir ya da denetçiyi çatı sofrasına misafir edip
  meclisin ikna etmesine aracılık et. (4) Sonuçta banka kurtulur; Mirai,
  kuleye "gönüllü uyum programı" dayatır — zincir, Kök Sendikası'nın radikal
  kanadına açılan bir kapıyla biter.
- **Ödül:** 11.000 LM + kooperatif payı (oyun günü başına 400 LM pasif gelir;
  küçük pasif gelir alt kalemi, LW-GDD-05) + Kök Sendikası +15 İP.
- **Anlatı işlevi:** Lisans tasması geriliminin oyuncu eliyle gerilmesi.

**Kordon — "Beyaz Eldivenin Kırışığı"**
- **Veren:** Selim, üç kuşaktır Kordon'da hizmetkârlık yapan bir Beyaz
  Eldiven düğümü.
- **Aşamalar:** (1) Bir Compact yöneticisinin malikânesinden "var olmayan bir
  tablo" kaybolmuştur; Selim, suçun bir hizmetkâra yıkılacağını bilir.
  Davetli kılığında malikâne resepsiyonuna sız (sosyal kılık değiştirme,
  LW-GDD-01 Kordon rolü). (2) Tablonun hiç çalınmadığını, sigorta oyunu
  için yöneticinin kendisince saklandığını kanıtla. (3) Kanıtı Beyaz
  Eldiven ağına teslim et — ağ, kanıtı "doğru fiyata doğru kulağa" fısıldar.
  (4) Suçlanan hizmetkâr aklanır; yönetici, oyuncuya bir daha unutamayacağı
  soğuk bir nezaketle teşekkür eder.
- **Ödül:** 13.000 LM + "Eldiven" takım elbise seti (kozmetik) + Beyaz
  Eldiven +10 İP (Kordon istihbarat fiyatlarında kurgu içi indirim).
- **Anlatı işlevi:** Kordon'un görünmez emeği; "her çim yaprağı sensördür"
  gerilimi çatışmasız oynanışla.

**Gölgepazar — "Fiyatsız Kayıt"**
- **Veren:** Tacir Vesper, Katmanaltı Çarşısı'nın en alt katında tezgâh açan
  Hafıza Simsarı — Mara'nın eski, küskün tanıdığı.
- **Aşamalar:** (1) Vesper'in eline "fiyatlanamayan" bir kayıt geçmiştir:
  sahibi defterde olmayan bir çocukluk anısı. (2) Anının çekildiği fiziksel
  mekânı bul — Sisaltı'da su altında kalmış bir okul. (3) Okul kayıtlarının
  dalgıç-hurdacılarda satılan kopyalarını topla. (4) Kayıt, 2097 Silinme
  Vakaları'ndan birine aittir; Vesper satmak, Silinmişler ise sahibinin
  yakınlarına ulaştırmak ister — oyuncu karar verir. Mara ile oynanıyorsa
  ek diyalog: Deniz'in adı hiç geçmez ama Mara'nın eli titrer.
- **Ödül:** 17.000 LM (satış) veya 6.000 LM + Silinmişler +20 İP
  (teslim) + Silinmiş Hafıza Parçası ×2.
- **Anlatı işlevi:** Hafıza Simsarları ↔ Silinmişler ahlak makasının
  (LW-GDD-01) oynanabilir hâli; koleksiyon sistemine anlatısal giriş.

**Dış Halka — "Türbin Ninnisi"**
- **Veren:** Yol Anası Zehra, Kervan'ın mevsimlik lider kadrosundan; Türbin
  Mezarlığı kamp ateşinin sahibesi.
- **Aşamalar:** (1) Su hakkı taşıyan bir kervan konvoyu, kum fırtınasında
  rotadan çıkmıştır; fırtına içinde iz sür (toz fırtınası hava kancası,
  LW-GDD-04). (2) Konvoyu pusuya düşürülmüş bul; hayatta kalanları kampa
  taşı. (3) Pusucuların Kervan içinden bilgi aldığı anlaşılır; kamp
  ateşinde tanıklıkları dinleyerek muhbiri bul (Dış Halka'da PANOPT defteri
  yoktur — yalnız insan tanıklar, LW-GDD-04). (4) Muhbirin bedeli yol
  geleneğine göre verilir: sürgün. Oyuncu isterse sürgünü şehir kapısına
  kadar sağ götürür — küçük, gerçek bir iyilik anı.
- **Ödül:** 12.500 LM + arazi aracı için "Kervan Yolu" tente kiti (kozmetik)
  + Kervan +15 İP (kervan yolu güzergâh bilgisi açılır).
- **Anlatı işlevi:** Gözetimsiz adaletin ağırlığı; Kervan'ın yol geleneği.

### 2.3 Zincir–Protagonist Matrisi

Zincirlerin çoğu üç protagoniste de açıktır; diyalog varyantları
`CitizenRecord` tutum skoru protagonist başına ayrı tutulduğu için
(LW-GDD-04) aynı zincir farklı tonda oynanır. Lansmandaki 60 zincirin
dağılım hedefi:

| Erişim | Adet | Not |
| --- | --- | --- |
| Üç protagoniste açık | 39 | Diyalog varyantlı |
| Mara'ya özel | 7 | Netrunning/Deniz rezonansı ağırlıklı |
| Kaan'a özel | 7 | Pas Kuşağı/Kessler-Voss geçmişi ağırlıklı |
| Solene'e özel | 7 | Yükseliş/Zenit Halkası/Kara Leylek ağırlıklı |

---

## 3. Rastgele Karşılaşma Sistemi

### 3.1 Mimarideki Yeri

Rastgele karşılaşmalar, Kent Yönetmeni'nin (LW-GDD-04) **Fırsat** ve
**Çatışma** olay sınıflarının el yazımı, oyuncu-yüzlü alt kümesidir. Sistem
kendi üreticisini kurmaz; Yönetmen'in tempo eğrisine bir "karşılaşma isteği"
olarak sıraya girer. Lansman hedefi: **140 karşılaşma şablonu**.

### 3.2 Kategori Taksonomisi

| Kategori | Tanım | Tipik süre | Ödül tavanı |
| --- | --- | --- | --- |
| **Yardım Çağrısı** | Bir vatandaş somut yardım ister; reddetmek meşrudur | 2–5 dk | 3.000 LM + tutum |
| **Fırsat** | Sahipsiz değer: düşen kargo, açık kalan kapı, yarım kalmış iş | 1–4 dk | 8.000 LM (dünya aktivitesi bandı) |
| **Pusu / Tehdit** | Oyuncuyu hedef alan kurgu; her zaman önceden okunabilir ipucu verir | 2–6 dk | Ganimet + gerilim etkisi |
| **Dünya Penceresi** | Müdahale gerektirmeyen vinyet; izlemek serbest | 30–90 sn | Yalnız anlatı / kayıt |
| **Takip / İz** | Bir olayın peşine düşme seçeneği; çoğu bir zincire veya koleksiyona bağlanır | 3–8 dk | Bilgi + 5.000 LM'e kadar |
| **Yankı** | Olay bağı havuzundan (LW-GDD-04, 200.000 kayıt) üretilen, oyuncunun geçmişine cevap veren karşılaşma | 1–3 dk | Tutum / indirim / tehdit |
| **Fraksiyon Sürtüşmesi** | İki fraksiyonun sahada karşılaşması; taraf tutmak serbest | 3–6 dk | Tanışıklık ±, bölge gerilimi |

### 3.3 Tetikleme ve Soğuma Kuralları

| Kural | Değer | Gerekçe |
| --- | --- | --- |
| Aynı şablonun aynı bölgede soğuması | 30 dk | LW-GDD-04 olay kuralıyla hizalı |
| Aynı kategorinin küresel soğuması | 8 dk | Tekdüzelik önlenir |
| Saatlik karşılaşma hedefi (serbest dolaşım) | 6–9 | Tempo eğrisine tabidir; kaos anında düşer |
| Görev sırasında izinli kategori | Yalnız Dünya Penceresi | Görev temposu korunur |
| Reddedilen/terk edilen karşılaşma | Şablon soğuması ×2 | Israrcı dünya hissi yasak |
| Yankı karşılaşması tekrarı | Aynı olay bağı yalnız 1 kez | "Kaseti başa sarma" hissi yasak |
| Bölge kimlik filtresi | Zorunlu | Kordon'da sokak pususu üretilmez (LW-GDD-04) |
| Pusu adalet kuralı | Pusudan önce en az 1 okunabilir ipucu | Ucuz ölüm yasak |

### 3.4 Örnek Karşılaşma Kataloğu (14 Şablon)

| No | Ad | Bölge | Kategori | Özet |
| --- | --- | --- | --- | --- |
| RK-01 | Kibar Ses Arızası | Çekirdek | Dünya Penceresi | Bir sokak terminali, defterde olmayan bir adı kibarca ve durmadan anons eder; teknisyenler geldiğinde anons kesilir, kimse bir şey duymamıştır. REGENT anomali perdesi. |
| RK-02 | Düşen Kargo | Sisaltı | Fırsat | Kaçak kargo kapsülü kanala düşer; Kanalcı teknesi 90 sn uzaktadır. Kapsülü kapmak LM getirir, Kanalcılar tanışıklığını düşürür; teslim etmek tersini yapar. |
| RK-03 | Borç Defteri | Neon Liman | Yardım Çağrısı | Karat tahsildarı, borçlu bir sokak müzisyeninin implantını sökmek üzeredir. Borcu kapatmak (2.400 LM), pazarlık etmek veya izlemek mümkündür. |
| RK-04 | Hurda Kapanı | Pas Kuşağı | Pusu / Tehdit | "Bozulan" bir yardım çağrısı aslında hurdacı çetesinin tuzağıdır; ipucu: aracın motoru hâlâ sıcaktır. |
| RK-05 | Kaçak Pilot | Yükseliş | Takip / İz | Gümrükten kaçan İrtifa Loncası pilotu oyuncudan yük aktarımı ister; yardım Lonca tanışıklığı, ihbar Yıldırım Orbital sözleşme teklifi getirir. |
| RK-06 | Hasat Nöbeti | Bahçeler | Yardım Çağrısı | Şafak konvoyunun eskort sürücüsü gelmemiştir; konvoya katılmak Çekirdek'te gıda kıtlık çarpanını gerçekten düşürür (LW-GDD-04 piyasa bağı). |
| RK-07 | Drone Bülbül | Kordon | Dünya Penceresi | Bir hizmetkâr çocuğu, düşmüş bir drone bülbülünü saklamaya çalışır — "gerçek kuş kalmamıştır" satırının sahnesi. Tamir minik bir tutum kazandırır. |
| RK-08 | Sahte Sima | Gölgepazar | Pusu / Tehdit | Kimlik satıcısı, oyuncunun kendi kimliğinin kopyasını satmaya çalışır. Satın almak, çalmak veya satıcıyı Simsarlara ihbar etmek mümkündür. |
| RK-09 | Fırtına Yıldızı | Dış Halka | Yardım Çağrısı | Toz fırtınasında kervandan kopan bir rehber çocuk; kampa ulaştırmak Kervan tanışıklığı ve bir yol işareti koleksiyon parçası kazandırır. |
| RK-10 | Tanığın Teşekkürü | Değişken | Yankı | Daha önce kurtarılan bir vatandaş (olay bağı havuzundan) oyuncuyu tanır; küçük bir hediye, bir indirim veya bir söylenti verir. |
| RK-11 | Eski Mesai | Değişken | Yankı | Kaan'ı "ölü" bilen eski bir Kessler-Voss askeri onunla karşılaşır; sahne, oyuncunun geçmiş şiddet düzeyine göre selam ya da silah çekmeyle açılır. |
| RK-12 | Silinmişin Fısıltısı | Kör bölgeler | Takip / İz | Bir Silinmiş, yalnız PANOPT kör noktalarında beliren bir buluşmayla Mara'ya hafıza parçası satar/verir; koleksiyon damarı (Bölüm 4.2). |
| RK-13 | On Bir Dakika | Tüm bölgeler (yıldönümü) | Dünya Penceresi | Işık Nöbeti gecesi tüm vitrinler söner; NPC rutinleri 11 dakikalığına anma davranışına geçer. Müdahale yoktur; dünya kendini anlatır. |
| RK-14 | Devre Kesici | Neon Liman / Pas Kuşağı | Fraksiyon Sürtüşmesi | Enerji karnesi kesintisinde Kül Köpekleri kaçak hat çeker, Aeon ekibi söker; oyuncu taraf tutabilir — bölge ışık bütçesi görünür biçimde değişir. |

**Üretim notu:** 140 şablonun kategori dağılım hedefi: Yardım %20, Fırsat %18,
Pusu %12, Dünya Penceresi %22, Takip %10, Yankı %10, Sürtüşme %8. Dünya
Penceresi payının yüksekliği bilinçlidir: dünya, oyuncudan bir şey istemeden
de yaşadığını kanıtlamalıdır.

---

## 4. Koleksiyon Sistemleri

### 4.1 İlke

Koleksiyon, harita temizliği değil **arkeolojidir**. Her parça tek başına
okunabilir bir lore kırıntısı taşır; set tamamlandığında bir anlatı ödülü
açılır. Hiçbir koleksiyon güç vermez (LW-GDD-05 Madde 5 uyumu); ödüller
kozmetik, anlatı ve kurgu içi bilgidir.

### 4.2 Koleksiyon Setleri (Lansman: 5 set, 174 parça)

| Set | Parça | Bölgeler | İçerik | Set ödülü |
| --- | --- | --- | --- | --- |
| **Silinmiş Hafıza Parçaları** | 44 | Kör bölgeler ağırlıklı, şehir geneli | 2097 Vakaları'ndan bozuk defter kırıntıları; her parça birkaç saniyelik bozulmuş anı sesi çalar. 11'erli dört küme (2061 göndermesi). | Her küme bir "geri verilen isim" sahnesi açar; 44/44'te Mara'nın Deniz arayışına özel bir koordinat ve bir yan sahne düşer (spoiler senkronu: bkz. Açık Sorular). |
| **Karartma Fenerleri** | 61 | Sisaltı/Gölgepazar/Dış Halka hariç tüm katmanlar + Zenit Halkası | 2061'in 11 gününde kullanılmış, sahiplerinin adları kazınmış anma fenerleri (61 = Karartma yılı). Her fener bir tanıklık metni açar. | "Işık Yakan" karakter aksesuarı (pencere feneri emote'u) + Işık Nöbeti gecesi özel diyalog havuzu. |
| **Batık Şehir Plakaları** | 27 | Sisaltı | Sel altındaki eski şehrin sokak tabelaları; dalışla çıkarılır. Her plaka, 2093 öncesi haritada o sokağı gösterir. | Sisaltı su altı eski-şehir haritası (keşif bilgisi) + "Batık Meydan" tekne boyaması. |
| **Korsan Yayın Kayıtları** | 24 | Gölgepazar, Dış Halka | Sable ekranındaki haberlerin korsan kanal versiyonları; aynı olayın iki anlatısı yan yana dinlenir (LW-GDD-01 medya ikiliği). | "Çift Anten" korsan radyo istasyonu araç içinde açılır (yalnız içerik; sinyal avantajı yok). |
| **Kervan Yol İşaretleri** | 18 | Dış Halka | Yol geleneğinin taş/teneke işaretleri; her biri bir kervan atasözü ve güzergâh notu taşır. | "Kervan yolu" hızlı kamp noktaları haritası (kurgu içi bilgi) + kamp ateşi emote'u. |

### 4.3 Bulunabilirlik Kuralları

1. **Pusula satılır, cevap satılmaz:** Parça konumları toplu olarak
   gösterilmez; bölge başına yaklaşık konum ipuçları kurgu içi kanallardan
   (Simsarlar, Kervan, tanışıklık diyalogları) LM ile satın alınabilir
   (250–2.500 LM, bilgi sink'i — LW-GDD-05).
2. **Simülasyona gömülüdür:** Bazı parçalar NPC'lerin üzerindedir ve yalnız
   tanışıklıkla ya da Yankı karşılaşmalarıyla el değiştirir; koleksiyon,
   ilişki sisteminin müşterisidir.
3. **Kayıp yaşanmaz:** Parçalar görev başarısızlığıyla kalıcı kaybolmaz;
   dünya durumu deltasında Kalıcı-sert sınıfta saklanır (LW-GDD-04).

---

## 5. Mini Oyunlar

### 5.1 Kumarhane Katı (Neon Liman)

LW-GDD-05 "Kurgu İçi Kumar" hükümleri bağlayıcıdır: yalnız oyun içinde
kazanılmış LM, oturum başına 50.000 LM masa limiti, uzun vadede net-sink,
Prizma ile fiş alınamaz.

| Oyun | Tür | Masa aralığı | Uzun vade RTP hedefi |
| --- | --- | --- | --- |
| **Beş Kule** | Blöf ağırlıklı kart oyunu; beş megakorpun armalarını taşıyan destede "kule devirme" eli | 100–10.000 LM | %96 (beceri payı yüksek) |
| **Karartma Ruleti** | Çark her turda 11'e bölünür; "on bir" cebi ev payıdır — kara mizah, dünyanın diliyle | 50–5.000 LM | %94 |
| **Sıfır-G Zarı** | Manyetik zar kulesi; zar süzülürken ikinci bahis penceresi açılır | 100–8.000 LM | %93 |
| **Arena Bahisleri** | Lisanslı dövüş ligi ve hologram yarışı bahisleri; oranlar simüle dövüşçü formuna bağlı | 200–50.000 LM | %92 |

### 5.2 Sokak Yarışları

| Seri | Bölge / rota | Araç sınıfı | Giriş / birincilik |
| --- | --- | --- | --- |
| **Üç Baca Finişi** | Pas Kuşağı; dökümhane iskeletleri arası, finiş Üç Baca | Yerden kesik sokak sınıfı | 1.000 LM / 6.000 LM |
| **Koridor İhlali** | Neon Liman → Çekirdek alçak hava koridoru; PANOPT koridor rezervasyonunu delerek | Hover spor sınıfı | 2.000 LM / 8.000 LM + aranma riski |
| **Sis Slalomu** | Sisaltı kanalları; şamandıra kapıları, tekne | Tekne | 800 LM / 5.000 LM |
| **Kervan Rallisi** | Dış Halka; Türbin Mezarlığı çevresi arazi etabı | Arazi sınıfı | 500 LM / 4.500 LM |

Kurallar: birincilik ödülleri dünya aktivitesi bandındadır (500–8.000 LM,
LW-GDD-05); aynı serinin tekrarında ödül 2. yarışta %50, sonrakilerde %25'e
düşer ve oyun günüyle sıfırlanır (çiftlikleme freni). Kaçak yarışlarda PANOPT
tepkisi bölge kapsamasına göre gerçekçidir; Koridor İhlali serisi bilinçli
olarak aranma sistemine beslenir (LW-GDD-03).

### 5.3 Hack Bulmacaları (Netrunning Yüzeyi)

- **Buz Kırma:** Akıllı-kilitli şirket ekipmanının devre düğümlerini sınırlı
  hamlede yeniden yönlendirme; süre baskısı yok, hamle baskısı var (bilişsel
  erişilebilirlik — LW-GDD-08 ile hizalı).
- **Defter Dalışı:** Hafıza Defteri kayıtları arasında çapraz referans kurma;
  üç kaydın kesişiminden bir adres/isim çıkarma. Yan görev zincirlerinin
  standart araştırma dokusu.
- **İz Bükme:** Aktif takip sırasında PANOPT sorgusunu yanlış hedefe
  yönlendirme; başarı, aranma profilinde gerçek iz bırakmaz (LW-GDD-04
  taktik profil sistemiyle bütünleşik).

### 5.4 Özgün Mini Oyun Tasarımları

**Kanal Kaydırma (Sisaltı).** Gelgit ve savak kapaklarıyla çalışan lojistik
bulmacası: oyuncu, kaçak sandıkları kanal ağında yüzdürerek devriye
teknelerinin rotasına girmeden depoya ulaştırır. Su seviyesi gerçek hava
sistemine bağlıdır (yağmurda seviye yükselir, yeni rotalar açılır —
LW-GDD-04 hava kancası). 18 el yazımı düzen; ödül 400–2.000 LM + Kanalcılar
tanışıklığı.

**Çatı Sofrası (Bahçeler).** Kule Bir'in ortak sofrasında ritim/zamanlama
temelli yemek servisi oyunu: hasat gününde meclise yemek yetiştirmek.
Skor LM vermez; topluluk tanışıklığı ve kule içi söylenti havuzu açar —
"ekonomi değil, aidiyet anlatır" (Üç Soru Kapısı: karakter + dünya).
Kooperatif modda ikinci oyuncu (Online serbest dolaşım) servis hattına
katılabilir.

**Sıfır-G Sepeti (Zenit Halkası).** Kanondaki sıfır-yerçekimi gösteri
maçlarının oynanabilir hâli: iki takım, dönen halka koridorunda manyetik topu
karşı sepete taşır; yerçekimi katmanlara göre değişir (LW-GDD-01 Zenit
kimliği). Tek oyunculuda NPC ligi ve bahis entegrasyonu (Arena Bahisleri
tavanına tabi), Online'da 4 kişilik crew'lar arası dostluk maçı. Sezonluk
kozmetik forma ödülleri sezon yolundan gelir; asla Prizma ile takım avantajı
satılmaz.

---

## 6. NPC Tanışıklık ve İlişki Sistemi

### 6.1 Altyapı

Sistem, LW-GDD-04'teki mevcut yapıların üzerine kurulur; **yeni bellek
yapısı eklemez**: tutum skoru (−100…+100, protagonist başına ayrı), kişisel
hafıza (NPC başına en fazla 8 özet, önem eşiği ≥ 3) ve olay bağı havuzu
(200.000 kayıt). Tanışıklık, bu verilerin oyuncuya okunur biçimde
yüzeye çıkarılmasıdır.

### 6.2 Tanışıklık Kademeleri

| Kademe | Eşik | Görünür davranış |
| --- | --- | --- |
| **Yabancı** | Varsayılan | Bölge rutin davranışı |
| **Görülmüş** | ≥ 1 kişisel hafıza özeti | NPC oyuncuyu hatırlar; bakış, kısa yorum ("Seni Batık Meydan'da görmüştüm.") |
| **Tanıdık** | Tutum ≥ +15 ve ≥ 2 özet | Selamlaşma, küçük gevezelik, bölge söylentisi paylaşımı |
| **Ahbap** | Tutum ≥ +40 ve ≥ 4 özet | Pazarlıkta %3–5 kurgu içi indirim, küçük yan işler, koleksiyon ipuçları |
| **Kefil** | Tutum ≥ +70, ≥ 6 özet ve en az 1 zincir tamamlanmış | Güvenli ev kapısı, tanıklık desteği (Kademe 1–2 PANOPT cezalarında kurgu içi hafifletme — sınır: Açık Sorular #1) |
| **Hasım** | Tutum ≤ −40 | Fiyat zamları, hizmet reddi, ihbar olasılığı |
| **Kan Davalı** | Tutum ≤ −75 | Yankı pususu tetikleyebilir (RK-11 tipi); bölgede kaçınma davranışı |

### 6.3 Semt Simaları

Tanışıklık sisteminin görünen yüzü, **120 el yazımı Semt Siması**dır: bölge
başına 12–15 kalıcı esnaf, muhbir, usta ve mahalle karakteri (Usta Ferhat,
Reis Saba, Tacir Vesper bu havuzdandır). Simalar:

- Genişletilmiş diyalog havuzu taşır (protagonist başına ayrı varyant);
- Yan görev zincirlerinin ve koleksiyon ipuçlarının ana dağıtıcısıdır;
- Rutinleri tam `CitizenRecord` kurallarıyla işler — Sima "dükkânda hep
  bekleyen" bir otomat değildir; kapalıysa kapalıdır.

### 6.4 Mahalle İtibarı

Bölge başına tanışıklık toplamı, bir **mahalle itibarı** endeksine katkı
verir (fraksiyon itibarından ayrı, onunla toplanır). Etkiler yalnız kurgu
içi ve ekonomiktir: sokak selamlaşma yoğunluğu, tezgâh fiyat mikro-çarpanı
(±%4 tavan), Yankı karşılaşması olasılık ağırlığı. Mahalle itibarı hiçbir
savaş/istatistik avantajı üretmez.

---

## 7. İçerik Yoğunluk Haritası

### 7.1 İlkeler

1. **Yoğunluk kimliktir:** Bölgenin aktivite yoğunluğu, LW-GDD-01'deki
   kimliğinin türevidir. Gölgepazar sıkışık ve doludur; Dış Halka'nın
   seyrekliği bir eksik değil, tasarımın kendisidir.
2. **90 saniye kuralı:** Şehir içinde oyuncu, serbest dolaşımda herhangi bir
   noktadan 90 sn içinde en az bir "dünya dokunuşuyla" (karşılaşma, Sima,
   koleksiyon ipucu, vinyet) kesişmelidir. Dış Halka'da eşik bilinçli olarak
   180 sn'dir.
3. **İkon perhizi:** Harita, keşfedilmemiş aktiviteleri ikonlamaz; içerik
   dünyada duyurulur (ses, ışık, NPC lafı, korsan yayın). İkon yalnız
   keşfedilmişi işaretler.
4. **Bütçe, özellikten önce gelir:** Yeni yan içerik, aşağıdaki tabloda yer
   açılmadan üretime giremez (LW-GDD-04 uygulama ilkesiyle aynı disiplin).

### 7.2 Lansman Yoğunluk Bütçesi

Alanlar 310 km² kanon toplamına göre bölünmüştür; Zenit Halkası yörünge
katmanı olarak alan dışıdır.

| Bölge | Alan (km²) | Yan görev zinciri | Karşılaşma şablonu | Koleksiyon parçası | Mini oyun mekânı | Aktivite düğümü / km² |
| --- | :-: | :-: | :-: | :-: | :-: | :-: |
| Çekirdek | 18 | 5 | 12 | 14 | 0 | 1,7 |
| Neon Liman | 22 | 8 | 18 | 18 | 4 | 2,2 |
| Pas Kuşağı | 46 | 8 | 17 | 20 | 2 | 1,0 |
| Yükseliş | 28 | 6 | 14 | 16 | 1 | 1,3 |
| Sisaltı | 34 | 7 | 16 | 27 | 2 | 1,5 |
| Bahçeler | 26 | 6 | 12 | 14 | 1 | 1,3 |
| Kordon | 20 | 5 | 10 | 10 | 0 | 1,3 |
| Gölgepazar | 14 | 8 | 16 | 24 | 1 | 3,5 |
| Dış Halka | 102 | 5 | 15 | 18 | 1 | 0,4 |
| Zenit Halkası | (yörünge) | 2 | 10 | 13 | 1 | — |
| **Toplam** | **310** | **60** | **140** | **174** | **13** | — |

**Denetim:** Yoğunluk hedefleri, her gece derlemesindeki 9 bölge + asansör
hattı uçuş testine (LW-GDD-04) "dünya dokunuşu sayacı" olarak eklenir;
90/180 sn kuralını üç gece üst üste ihlal eden bölge, içerik yerleşim
incelemesi tetikler.

---

## 8. Ödül Ekonomisi ve Uyum

### 8.1 LM Akış Hizası

Yan içerik ödülleri, LW-GDD-05 kaynak tablosundaki iki banda oturur ve
o bantların hedef paylarını tüketir:

| Aktivite türü | LM bandı | LW-GDD-05 kaynağı | Sıklık freni |
| --- | --- | --- | --- |
| Yan görev zinciri aşaması | 1.500–20.000 | Sözleşmeler ve yan işler (%20) | Zincirler tek seferliktir |
| Rastgele karşılaşma | 0–8.000 | Dünya aktiviteleri (%10) | Kategori/şablon soğumaları (Bölüm 3.3) |
| Yarış / mini oyun birinciliği | 500–8.000 | Dünya aktiviteleri (%10) | Tekrar ödülü %50 → %25, günlük sıfırlama |
| Kumarhane | Net-sink | Sink tarafı | 50.000 LM oturum limiti (LW-GDD-05) |
| Koleksiyon ipucu satın alımı | −250 … −2.500 | Bilgi ve erişim sink'i (%8) | — |
| Kooperatif payı gibi pasif gelirler | ≤ 400 / oyun günü | Mülk ve işletme geliri (%10) | Zincir finali ödülü, tekil |

Saatlik ortalama kazanç hedefi (12.000–18.000 LM, LW-GDD-05) yan içerik
yoğun oturumlar için üst banttan taşmamalıdır; ekonomi ekibinin haftalık
panosuna "yan içerik saatlik kazanç" ayrı seri olarak eklenir.

### 8.2 Prizma Sınırı ve Madde 5 Uyumu

1. **Tek oyunculu yan içerik hiçbir koşulda Prizma vermez ve Prizma
   istemez.** Prizma yalnız Online kozmetik parasıdır (kanon).
2. Online serbest dolaşımdaki (40 kişi) yan aktiviteler sezon yolu puanı
   verebilir; bu puanlar, sezonda oynayarak kazanılabilen 1.200 Prizma
   tavanına sayılır (LW-GDD-05, Fiyatlandırma İlkesi 4). Yan içerik bu tavanı
   büyütemez.
3. Yan içerik ödülü olan her kozmetik, mağazada Prizma ile **satılmaz**;
   oynayarak kazanılan görünümlerin mağaza kopyası çıkarılamaz (emek
   ödülünün değeri korunur).
4. Tanışıklık indirimleri, mahalle itibarı mikro-çarpanı ve Kefil
   hafifletmesi dahil bu belgedeki her sistem, yayın öncesi **Madde 5
   Denetimi**'nden geçer (LW-GDD-05): gerçek parayla hiçbir yoldan
   erişilemedikleri sürece uyumludurlar; denetim bunu kayıt altına alır.

### 8.3 Turnusol (Yan İçerik Ekibi İçin)

"Bu aktiviteyi haritadan silsek, oyuncu bir **hikâye mi** yoksa yalnız bir
**sayı mı** kaybeder?" Cevap "yalnız sayı" ise aktivite ya Üç Soru
Kapısı'na geri döner ya da silinir.

---

## 9. Açık Sorular

1. **Kefil hafifletmesi çifte kazanım riski:** Kefil kademesinin PANOPT
   Kademe 1–2 ceza hafifletmesi, LW-GDD-03'teki aranma/rüşvet ekonomisiyle
   üst üste binerse ceza sink'ini (%10 pay) aşındırır mı? Hafifletme tavanı
   için Tasarım Direktörlüğü onayı gerekiyor.
2. **44/44 spoiler senkronu:** Silinmiş Hafıza Parçaları'nın final ödülü,
   Mara'nın ana hikâye ilerlemesinden bağımsız erken tamamlanırsa Deniz
   anlatısını (LW-GDD-02) deler mi? Önerimiz final parçasını hikâye
   kilometre taşına kilitlemek — Anlatı Ekibi Lideri ile ortak karar.
3. **Dış Halka algısı:** 0,4 düğüm/km² ve 180 sn kuralı odak testlerinde
   "boş" mu, "nefes" mi okunacak? İlk oynanabilir yapıda A/B (150 sn / 180 sn
   / 210 sn) testi talep ediyoruz.
4. **Semt Siması seslendirme bütçesi:** 120 Sima × 3 protagonist varyantı,
   kayıt bütçesinde yaklaşık %18 artış demek. Varyant derinliğini mi, Sima
   sayısını mı koruyalım?
5. **Online karşılaşma sahipliği:** 40 kişilik serbest dolaşımda bir
   karşılaşmayı kim "tetikler", ödül ve tutum etkisi nasıl paylaşılır?
   LW-GDD-10 sahibiyle ortak çalışma oturumu gerekiyor.
6. **Kumarhane derecelendirme etkisi:** Kurgu içi kumarın mini oyun olarak
   genişlemesi (dört masa oyunu + bahis) PEGI/ESRB tanımlayıcılarını değiştirir
   mi? LW-GDD-05 Etik Çerçeve sahibiyle ortak hukuk incelemesi.

---

## Çapraz Referanslar

| Belge | İlgili kesişim |
| --- | --- |
| LW-GDD-01 | 9 bölge kimliği, fraksiyonlar, fay hatları, dünya sözlüğü, Işık Nöbeti |
| LW-GDD-02 | Deniz soruşturması, protagonist yan hatları, spoiler senkronu |
| LW-GDD-03 | PANOPT uyarlanabilir aranma sistemi, ceza/rüşvet kesişimi |
| LW-GDD-04 | Kent Yönetmeni, `CitizenRecord`, olay bağı havuzu, dünya durum defteri, hava kancaları |
| LW-GDD-05 | LM kaynak/sink payları, kurgu içi kumar hükümleri, Madde 5 Denetimi |
| LW-GDD-06 / LW-GDD-10 | Sezon yolu, 40 kişilik serbest dolaşım, crew aktiviteleri |
| LW-GDD-08 | Mini oyun ve bulmaca erişilebilirlik gereksinimleri |

## Sürüm Geçmişi

| Sürüm | Tarih | Yazar | Değişiklik |
| --- | --- | --- | --- |
| 1.0 | 5 Temmuz 2026 | Açık Dünya İçerik Lideri | İlk sürüm |

---

## Kurgusallık Notu

*Bu doküman bir konsept çalışmasıdır. LUMENFALL, Lumenworks Studios,
Duskforge Engine ve burada geçen tüm kişi, kurum, ürün, mekân ve olaylar
tamamen kurgusaldır; gerçek kişi, kurum veya ürünlerle benzerlikler
tesadüfidir ve hiçbir ifade ticari taahhüt oluşturmaz.*
