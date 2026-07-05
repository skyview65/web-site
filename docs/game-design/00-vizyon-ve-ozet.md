# LUMENFALL — Vizyon ve Yönetici Özeti

| Alan | Değer |
| --- | --- |
| **Belge No** | LW-GDD-00 |
| **Sürüm** | 1.0 |
| **Tarih** | 3 Temmuz 2026 |
| **Sahip** | Lumenworks Tasarım Ekibi |
| **Durum** | İnceleme |
| **Gizlilik** | Stüdyo içi — dağıtım Lumen Compact NDA kapsamındadır |
| **Bağlayıcı kaynak** | LUMENFALL Kanonu (tek doğruluk kaynağı); çelişki hâlinde kanon geçerlidir |

> Bu belge, LUMENFALL Oyun Tasarım Dokümanı (GDD) setinin giriş cildidir. Sistem
> ayrıntıları ilgili ciltlere devredilmiştir: `01-dunya-ve-hikaye.md`,
> `02-karakterler-ve-fraksiyonlar.md`, `03-oynanis-sistemleri.md`,
> `04-acik-dunya-ve-bolgeler.md`, `05-ekonomi-ve-ilerleme.md`,
> `06-online-ve-canli-servis.md`, `07-arayuz-ve-erisilebilirlik.md`,
> `08-sanat-ve-ses.md`, `09-teknoloji-ve-uretim.md`. Setin okuma sırası ve
> sürümleme kuralları için `README.md` dosyasına bakınız.

---

## Yönetici Özeti

LUMENFALL, 2099 yılında geçen, üç kahramanlı bir açık dünya aksiyon/suç
destanıdır. Oyuncu; şehri yöneten yapay zekâ PANOPT'un gölgesinde, 310 km²'lik
şehir ve ona bağlı yörünge katmanında, sokaktan uzaya kesintisiz uzanan tek bir
dünyada yaşar. Slogan tek cümledir ve tüm tona hükmeder: **"Karanlık parlar."**

Projenin üç temel iddiası vardır:

1. **Öğrenen şehir.** PANOPT, klasik "wanted level" yerine oyuncunun
   taktiklerini öğrenen uyarlanabilir bir takip sistemi işletir. Aynı kaçış
   rotası ikinci kez aynı kolaylıkla çalışmaz; şehir, oyuncunun alışkanlıklarına
   karşı önlem geliştirir. 1.2M simüle vatandaş kalıcı kimlik, rutin ve hafızaya
   sahiptir — tanık oldukları şeyleri hatırlar ve anlatırlar
   (bkz. `03-oynanis-sistemleri.md`, `04-acik-dunya-ve-bolgeler.md`).
2. **Üç hayat, tek şehir.** Mara Vex (netrunner, Gölgepazar), Kaan "Ghost"
   Demir (eski infazcı, Pas Kuşağı) ve Solene Adeyemi (yörünge kaçakçısı,
   Yükseliş) arasında istenildiği an geçiş yapılır; kontrol edilmeyen
   karakterler kendi gündemlerini yaşamaya devam eder
   (bkz. `02-karakterler-ve-fraksiyonlar.md`).
3. **Kesintisiz dikey dünya.** Sokak → yörünge asansörü → Zenit Halkası hattı
   %100 yükleme ekransızdır. 200+ araç sınıfı, yerden kesik araçlardan yörünge
   mekiklerine kadar tek simülasyon altında çalışır
   (bkz. `09-teknoloji-ve-uretim.md`).

Oyun, tek oyunculu hikâye kampanyası ile 12 haftalık sezonlarla işleyen canlı
servis modu **LUMENFALL Online**'ı tek pakette sunar. Gelir modeli net bir
ilkeye bağlıdır: pay-to-win yasaktır; gerçek parayla yalnızca kozmetik satılır
(Prizma). Oyun içi ekonomi, 9 bölgede arz-talebe göre dalgalanan oyuncu güdümlü
bir piyasa üzerine kuruludur (bkz. `05-ekonomi-ve-ilerleme.md`,
`06-online-ve-canli-servis.md`).

Hedef: 2027 çıkış penceresinde PC, 9. nesil konsollar ve bulut platformlarında
eşzamanlı lansman; ilk yılda 18M adet satış, Metacritic 90+ ve Online tarafında
%22 D30 retention (ayrıntı: "Başarı Metrikleri" bölümü).

---

## Oyun Künyesi

| Alan | Değer |
| --- | --- |
| **Oyun adı** | LUMENFALL |
| **Slogan** | "Karanlık parlar." (EN: "Darkness shines.") |
| **Tür** | Açık dünya aksiyon/suç destanı |
| **Kamera** | Üçüncü şahıs + isteğe bağlı birinci şahıs (tam geçişli) |
| **Stüdyo** | Lumenworks Studios |
| **Motor** | Duskforge Engine (stüdyo içi) |
| **Çıkış penceresi** | 2027 |
| **Platformlar** | PC · 9. nesil konsollar · Bulut |
| **Modlar** | Tek oyunculu hikâye + LUMENFALL Online (canlı servis) |
| **Oyun yılı / mekân** | 2099 · Lumenfall şehri (310 km²) + yörünge katmanı (Zenit Halkası) |
| **Protagonistler** | 3 — Mara Vex · Kaan "Ghost" Demir · Solene Adeyemi |
| **Bölgeler** | 9 (Çekirdek, Neon Liman, Pas Kuşağı, Yükseliş, Sisaltı, Bahçeler, Kordon, Gölgepazar, Dış Halka) |
| **Para birimleri** | Lümen (LM, oyun içi) · Prizma (Online kozmetik) |
| **Yaş derecelendirmesi (hedef)** | PEGI 18 / ESRB M |
| **Sürümler** | Standard $69.99 · Deluxe $99.99 · Eternal $129.99 |
| **Çapraz özellikler** | Çapraz platform + çapraz ilerleme (Online) |

Sürüm içerikleri ve ön sipariş kademelerinin tam dökümü
`05-ekonomi-ve-ilerleme.md` belgesinde; sezon yapısı ve Sezon 01 "Karartma
Protokolü" planı `06-online-ve-canli-servis.md` belgesindedir.

---

## Vizyon Cümlesi

> **Kusursuz düzenin bedelini ödemeyi reddeden üç insanın gözünden; sizi
> öğrenen, hatırlayan ve asla unutmayan bir şehirde, sokaktan yörüngeye tek
> nefeste uzanan bir suç destanı.**

Bu cümledeki her öğe bir tasarım taahhüdüdür ve kesme testi olarak kullanılır:

- "Öğrenen, hatırlayan şehir" → PANOPT'un uyarlanabilir takibi ve vatandaş
  hafızası olmadan hiçbir görev tasarımı onaylanmaz.
- "Üç insanın gözünden" → her ana görev, en az bir karakter geçişiyle farklı
  bir bakış açısı sunmak zorundadır.
- "Tek nefeste" → yükleme ekranı gerektiren hiçbir özellik kabul edilmez.
- "Bedelini ödemeyi reddeden" → ton nihilist olamaz; umut kıvılcımı her
  hikâye yayında korunur (bkz. `01-dunya-ve-hikaye.md`).

Bir özellik bu cümlenin en az bir öğesini güçlendirmiyorsa kapsam dışıdır.

---

## Tasarım Sütunları

Tam beş sütun tanımlanmıştır. Her özellik önerisi, incelemede bu beş sütundan
en az ikisine hizmet ettiğini göstermek zorundadır; hiçbirine hizmet etmeyen
öneriler otomatik reddedilir.

### Sütun 1 — Şehir Seni Öğrenir

**Kural:** Dünya, oyuncunun davranışına statik tepki vermez; ondan öğrenir.
PANOPT takip sistemi bir "wanted level" değildir: oyuncunun kaçış rotalarını,
tercih ettiği araç sınıflarını ve saldırı saatlerini kaydeder, sonraki
karşılaşmalarda buna göre kontrol noktası, dron devriyesi ve keskin nişancı
yerleşimi üretir. 1.2M simüle vatandaşın her biri kalıcı kimlik, rutin ve
hafıza taşır.

**Gerekçe:** Açık dünya türünün en eskiyen parçası, ezberlenebilir polis/tepki
döngüsüdür. Öğrenen sistem, 60+ saatlik bir kampanyada bile karşılaşmaları
taze tutar ve "kusursuz düzenin bedeli" temasını mekaniğin kendisine gömer:
oyuncu, gözetimin nasıl çalıştığını bizzat sırtında hisseder. Ölçülebilir
hedef: aynı oyuncunun art arda iki takip kaçışında rota tekrarına rağmen
başarı olasılığının sistemce en az %30 düşürülmesi
(ayrıntı: `03-oynanis-sistemleri.md`).

### Sütun 2 — Üç Hayat, Tek Kader

**Kural:** Mara, Kaan ve Solene arasında (görev kısıtları dışında) istenildiği
an geçiş yapılır. Kontrol edilmeyen karakterler dondurulmaz: kendi bölgelerinde
gelir üretir, ilişkilerini ilerletir ve geçiş anında oyuncuyu o hayatın tam
ortasında karşılar. Üç karakterin aksan renkleri (macenta, camgöbeği, amber)
arayüzden görev tasarımına kadar ayrıştırıcı olarak kullanılır.

**Gerekçe:** Tek protagonist, 9 bölgelik ve iki katmanlı (yer + yörünge) bir
şehrin tamamına inandırıcı biçimde ait olamaz. Üç kahraman; Gölgepazar'ın veri
yeraltını, Pas Kuşağı'nın çete sahasını ve Yükseliş–Zenit Halkası hattını ayrı
oynanış lehçeleriyle (netrunning, yakın muharebe/infiltrasyon, uçuş/kaçakçılık)
açar. "Aidiyet ve aile" teması da ancak üç ayrı hayatın kesişmesiyle taşınır
(bkz. `02-karakterler-ve-fraksiyonlar.md`).

### Sütun 3 — Kesintisiz Dikey Dünya

**Kural:** Sokak → yörünge asansörü → Zenit Halkası hattında yükleme ekranı,
gizli koridor maskeleme veya zorunlu ara sahne bariyeri yoktur; %100
kesintisizlik teknik kabul kriteridir. 310 km² şehir + yörünge katmanı tek
sahne grafiğinde yaşar; 200+ araç aynı fizik sözleşmesini paylaşır.

**Gerekçe:** "Sokaktan uzaya tek nefeste" vaadi LUMENFALL'ın en görünür
farklılaştırıcısıdır ve pazarlanabilir tek cümlelik özelliktir. Kesintisizlik
ayrıca sistemik oynanışın ön koşuludur: bir takip Sisaltı kanallarında başlayıp
yörünge mekiğinde bitebilmelidir. Duskforge Engine'in akış (streaming) bütçesi
ve seviye-of-detay stratejisi bu sütuna göre boyutlandırılır
(bkz. `09-teknoloji-ve-uretim.md`).

### Sütun 4 — Karanlık Parlar

**Kural:** Ton yetişkin ve keskindir, zaman zaman kara mizah içerir; ancak
hiçbir hikâye yayı umutsuz bitemez. Görsel dil bu ilkenin doğrudan çevirisidir:
vantablack zemin üzerinde elektrik camgöbeği, sıcak macenta ve sinyal amber —
ışık her zaman karanlığın içinden gelir. Her ana görevin kapanışında en az bir
"kıvılcım anı" (somut, oynanabilir bir umut jesti) zorunludur.

**Gerekçe:** Distopik açık dünyalar kolayca nihilizme kayar ve oyuncu yorgunluğu
üretir; pazar araştırmamız, uzun oturum süresinin tonal denge ile korelasyon
gösterdiğini söylüyor. "Karanlık parlar" ilkesi hem sanat yönetimini
(bkz. `08-sanat-ve-ses.md`) hem senaryo yazım kurallarını
(bkz. `01-dunya-ve-hikaye.md`) tek cümleyle hizalar ve markanın sloganını
ürünün her karesinde doğrular.

### Sütun 5 — Oyuncuya Saygılı Ekonomi

**Kural:** Pay-to-win yasaktır — istisnasız. Oynanışı etkileyen hiçbir öğe
gerçek parayla satılmaz; MTX yalnız kozmetiktir (Prizma). Oyun içi ekonomi
Lümen (LM) üzerinden döner ve 9 bölgede arz-talebe göre dalgalanan oyuncu
güdümlü piyasa ile beslenir: Pas Kuşağı'nda ucuza kapatılan hurda araç
parçaları, talebin şiştiği Neon Liman'da kârla satılabilir.

**Gerekçe:** Canlı servis modelinin en büyük itibar riski monetizasyondur.
Kozmetik-yalnız çizgi; basın puanlarını, topluluk güvenini ve uzun vadeli
retention'ı korur. Oyuncu güdümlü piyasa ise ekonomiyi bir "para musluğu"
olmaktan çıkarıp oynanış sistemine dönüştürür: kaçakçılık (Solene), veri
ticareti (Mara) ve koruma ekonomisi (Kaan) aynı piyasaya farklı kapılardan
girer (bkz. `05-ekonomi-ve-ilerleme.md`).

---

## Hedef Kitle ve Pazar Konumu

### Birincil kitle — "Destan Arayan" (tahmini pazar payı ağırlığı %55)

- 18–34 yaş; GTA V/RDR2 kampanyalarını bitirmiş, Cyberpunk 2077'yi 2.0
  sonrası tekrar oynamış oyuncular.
- Motivasyon: güçlü yazarlık + sistemik açık dünya; "tek oyunculuğu ciddiye
  alan" canlı servis paketine prim verir.
- Platform dağılımı beklentisi: %45 konsol, %45 PC, %10 bulut.
- Tasarım karşılığı: 40–60 saatlik ana kampanya, karakter geçişli görev
  tasarımı, fotoğraf modu, New Game+ (bkz. `03-oynanis-sistemleri.md`).

### İkincil kitle — "Crew Oyuncusu" (%30)

- 16–29 yaş; GTA Online, sezonluk canlı servis oyunları ve soygun/heist kurgusu
  etrafında sosyalleşen gruplar.
- Motivasyon: 4 kişilik Crew yapısı, paylaşımlı üsler, ortak kasa, haftalık
  bölge savaşları ve Zenit Kasası gibi yüksek sahneli soygunlar.
- Tasarım karşılığı: 12 haftalık sezon ritmi, çapraz platform + çapraz
  ilerleme, sezon başına 1 yeni bölge hikâyesi + 1 soygun
  (bkz. `06-online-ve-canli-servis.md`).

### Üçüncül kitle — "Dünya Turisti" (%15)

- 25–44 yaş; simülasyon derinliği, keşif ve atmosferle motive olur; şiddet
  yoğunluğundan çok şehir yaşamı ve hikâye kırıntılarıyla ilgilenir.
- Tasarım karşılığı: 1.2M vatandaş simülasyonunun gözlemlenebilirliği,
  bölge-bazlı yan ekonomiler, erişilebilirlik ön ayarları ve "turist" zorluk
  profili (bkz. `07-arayuz-ve-erisilebilirlik.md`).

### Pazar konumu

LUMENFALL kendini şu cümleyle konumlandırır: **"GTA ölçeğinde suç destanı ×
Cyberpunk yoğunluğunda dünya inşası × hiçbir rakibin sunmadığı kesintisiz
sokak-yörünge dikeyi."** Fiyat konumu standart AAA bandıdır ($69.99);
premium sürümler içerikle (erken erişim, genişleme geçişi, Zenit Halkası
dairesi) gerekçelendirilir, güçle değil. Lansman iletişiminin omurgası üç
kanıtlanabilir iddiadır: öğrenen takip sistemi, üç-karakter simülasyonu,
yükleme ekransız yörünge geçişi.

---

## Rekabet Analizi

Aşağıdaki başlıklar pazar referansıdır; hedef, bu oyunların güçlü olduğu
alanlarda "yeterince iyi", farklılaştırıcı alanlarımızda "tek" olmaktır.

| Rakip | Güçlü yönleri | Zayıf/açık alanı | LUMENFALL'ın cevabı |
| --- | --- | --- | --- |
| **Grand Theft Auto V / GTA Online** (Rockstar) | Tür tanımlayan suç destanı; 200M+ satışlık marka; Online'ın devasa geliri; 3 protagonist mirası | Yaşlanan simülasyon; statik polis "wanted" sistemi; Online monetizasyonunda güç satan Shark Card algısı | Öğrenen PANOPT takibi; kalıcı hafızalı 1.2M vatandaş; kozmetik-yalnız MTX ilkesi |
| **GTA VI** (Rockstar, 2026) | Pazarın en büyük lansmanı; üretim değerinde tavan; medya hakimiyeti | Tek şehir/yer katmanı; canlı servis planının lansmanda sınırlı olması beklenir | Doğrudan çarpışmadan kaçınma: 2027 penceresi, sci-fi/dikey dünya farkı, lansman gününde tam sezonlu Online |
| **Cyberpunk 2077 + Phantom Liberty** (CD Projekt Red) | Sınıfının en iyisi dünya inşası ve yazarlık; 2.0 sonrası itibar dönüşü; güçlü build çeşitliliği | Tek protagonist; çok oyunculu modun iptali; şehir simülasyonunun sığlığı (rutinsiz NPC'ler) | 3 protagonist + karakter geçişi; lansmanda Online; rutin/hafıza tabanlı vatandaş simülasyonu |
| **Red Dead Redemption 2** (Rockstar) | Simülasyon derinliği ve dünya inandırıcılığında altın standart; NPC hafıza/tanıklık sistemleri | Tempo tercihi kitlesel değil; Online tarafı desteklenmedi | RDR2 inandırıcılığını daha yüksek tempolu suç kurgusuyla birleştirmek; Online'a sezonluk taahhüt |
| **Watch Dogs: Legion** (Ubisoft) | "Herkes oynanabilir" cesur fikri; gözetim-devleti teması; hack oynanışı | Karakterlerin yazarlıktan yoksun, jenerik kalması; temanın mekanikle sığ bağlanması | Az ama derin: 3 yazılmış kahraman; gözetim temasını PANOPT'un öğrenen sistemiyle mekanikleştirmek |
| **Starfield** (Bethesda) | Uzay fantezisi ölçeği; güçlü modlama ekosistemi | Yükleme ekranlarıyla bölünmüş dünya; şehirlerin kopukluğu | %100 kesintisiz sokak→yörünge geçişi; tek, yoğun, elle yerleştirilmiş şehir |
| **Saints Row (2022)** (Volition) | Erişilebilir suç sandığı; ton cesareti | Teknik kalite ve dünya inandırıcılığı beklentinin altında; marka güveni kaybı | Uyarı örneği olarak izlenir: ton cesareti ancak üretim kalitesiyle taşınır |

**Pazar penceresi değerlendirmesi:** GTA VI'nın 2026 lansmanı, açık dünya suç
türüne dev bir kitle akışı yaratacaktır. LUMENFALL 2027 penceresi, bu kitlenin
"sıradaki büyük şey" arayışına denk düşer. Risk: GTA VI Online'ın 2027'de hâlâ
içerik tekelini elinde tutması. Karşı önlem: lansman gününde Sezon 01
"Karartma Protokolü"nün eksiksiz açılması ve ilk soygun Zenit Kasası'nın
lansman haftasında oynanabilir olması (bkz. `06-online-ve-canli-servis.md`).

---

## Başarı Metrikleri

Aşağıdaki hedefler; yayıncı raporlaması, sezon planlaması ve lansman sonrası
kaynak tahsisinde bağlayıcı eşiklerdir. "Taban" altı senaryolar için hafifletme
planları `09-teknoloji-ve-uretim.md` risk bölümünde tutulur.

### Satış ve gelir hedefleri

| Metrik | Taban | Hedef | Üst senaryo |
| --- | --- | --- | --- |
| İlk 7 gün satış (tüm platformlar) | 5M adet | 8M adet | 12M adet |
| İlk 12 ay satış | 12M adet | 18M adet | 25M adet |
| Deluxe+Eternal sürüm payı (ilk 12 ay) | %20 | %28 | %35 |
| Eternal "sokak adı" kontenjanı (ilk 10.000 sipariş) | — | Ön sipariş ilk 72 saatte tükenme | İlk 24 saatte tükenme |
| Online ARPU (aylık, yalnız kozmetik Prizma) | $1.20 | $2.10 | $3.00 |
| Lansman ayı eşzamanlı oyuncu tepe değeri (PC) | 350K | 600K | 1M |

### Retention ve canlı servis hedefleri (LUMENFALL Online)

| Metrik | Taban | Hedef | Üst senaryo |
| --- | --- | --- | --- |
| D1 retention | %45 | %55 | %62 |
| D7 retention | %25 | %32 | %40 |
| D30 retention | %15 | %22 | %28 |
| Sezon tamamlama oranı (sezon geçişi alanlar) | %35 | %45 | %55 |
| Crew'a bağlı oyuncu oranı (D30 aktifleri içinde) | %30 | %40 | %50 |
| Haftalık bölge savaşı katılımı (aktif oyuncular) | %20 | %30 | %38 |
| Sezon 01→02 geçiş retention'ı | %50 | %60 | %70 |

### Kalite ve itibar hedefleri

| Metrik | Taban | Hedef | Üst senaryo |
| --- | --- | --- | --- |
| Metacritic (konsol) | 85 | 90 | 93 |
| OpenCritic "Mighty" eşiği | Girilir | İlk %5 | İlk %2 |
| Steam kullanıcı puanı (lansman +30 gün) | %80 "Çok Olumlu" | %90 | %95 "Ezici Çoğunlukla Olumlu" |
| Lansman haftası kritik hata (crash) oranı | <%1.5 oturum | <%0.8 | <%0.5 |
| "Monetizasyon adil" algısı (topluluk anketi, D60) | %70 | %82 | %90 |
| Erişilebilirlik değerlendirmeleri (bağımsız denetim) | Geçer | Örnek gösterilen | Ödül adayı |

### Ölçüm ve raporlama kuralları

- Tüm metrikler telemetri sözlüğünde tanımlı tekil olaylara bağlanır; sözlük
  `09-teknoloji-ve-uretim.md` ekindedir. Tanımsız metrik raporlanamaz.
- Retention ölçümü platform bazında ayrıştırılır; çapraz ilerleme hesapları
  tek oyuncu olarak sayılır (çift sayım yasak).
- "Monetizasyon adil" algısı, Sütun 5'in doğrudan sağlık göstergesidir; taban
  eşiğin altına düşmesi, sezon içeriği yerine ekonomi dengelemesine kaynak
  kaydırılmasını tetikler.
- Metacritic 90+ hedefi tüm ekip için ortak hedeftir; inceleme (review) öncesi
  son 6 ayda özellik ekleme donar, yalnız cila ve performans çalışılır.

---

*Bu belge LUMENFALL GDD setinin 00 numaralı cildidir. Dünya ve zaman çizelgesi
için `01-dunya-ve-hikaye.md`, sistem kuralları için `03-oynanis-sistemleri.md`,
bölge tasarımı için `04-acik-dunya-ve-bolgeler.md` ciltlerine ilerleyiniz.
Setin tamamına `README.md` üzerinden erişilir.*
