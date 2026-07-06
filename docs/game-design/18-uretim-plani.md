# LUMENFALL — Üretim Planı

> **"Karanlık parlar."**

| Alan | Değer |
| --- | --- |
| **Belge No** | LW-GDD-18 |
| **Sürüm** | 1.0 |
| **Tarih** | 5 Temmuz 2026 |
| **Sahip** | Yapım Direktörü |
| **Durum** | İnceleme |
| **Gizlilik** | Stüdyo İçi — Dağıtım Onaya Tabidir |

Bu belge, **LUMENFALL**'un 2027 çıkış penceresine (hedef: 2027 4. çeyrek, bkz.
LW-GDD-09) kadar olan üretim planını bağlar: stüdyo organizasyonu ve headcount
rampası, üretim fazları ve giriş/çıkış kriterleri, çeyrek bazlı kilometre taşı
takvimi, bütçe çerçevesi, risk kaydı, QA stratejisi, sertifikasyon/derecelendirme
takvimi, Gün-1 yaması ile lansman-sonrası ilk 90 gün ve sürdürülebilirlik
ilkeleri. Teknik kalite kapılarının tek doğruluk kaynağı LW-GDD-07'dir; bu belge
o kapıları takvime, kadroya ve paraya çevirir. Kapılar ile bu plan arasında
çelişki tespit edilirse LW-GDD-07 esas alınır ve bu belge revize edilir.

**İlgili belgeler:** LW-GDD-00 (başarı metrikleri, Metacritic 90+ ortak hedefi) ·
LW-GDD-06 (sezon takvimi ve 1. yıl içerik planı) · LW-GDD-07 (kalite kapıları,
derleme/test altyapısı) · LW-GDD-08 (erişilebilirlik kapısı) · LW-GDD-09
(faz takvimi, L-Günü tanımı) · LW-GDD-10 (Online lansman gereksinimleri).

---

## 1. Mevcut Durum Varsayımı (5 Temmuz 2026)

Plan, aşağıdaki doğrulanmış durumdan ileriye kurulur:

| Alan | Durum |
| --- | --- |
| Üretim fazı | **Tam üretim** (First Playable ve Vertical Slice kapıları geçildi, bkz. LW-GDD-07) |
| First Playable | Haziran 2025'te geçildi — Çekirdek bölgesi dolaşımı + streaming kanıtı |
| Vertical Slice ("Asansör Günü") | Şubat 2026'da geçildi (tanım: Bölüm 4.2) |
| İç kadro | 610 kişi (zirve planı: 780, bkz. Bölüm 2) |
| Dış kaynak | 300 FTE eşdeğeri, 3 ana ortak stüdyo |
| Bölge durumu | 9 bölgeden 5'i sanat geçişinde (Çekirdek, Gölgepazar, Pas Kuşağı, Neon Liman, Yükseliş); 4'ü greybox (Sisaltı, Bahçeler, Kordon, Dış Halka) |
| Ana hikâye | 3 perdenin tamamı oynanabilir greybox; 1. perde sanat-tam |
| Online | Meridian bölge shard mimarisi iç testte; 128 oyunculuk şehir örneği stüdyo içinde günlük koşuyor |
| Sıradaki kapı | **Alpha — 2026 Q4** (LW-GDD-07 kriterleri bağlayıcı) |

Planlama varsayımı: **L-Günü = Kasım 2027 ortası.** Kesin tarih, ön sipariş
açılışından (F3, Haziran 2027, bkz. LW-GDD-09) önce Yayın Direktörlüğü ile
kilitlenir (bkz. Açık Sorular, madde 1). Bu belgedeki tüm "L−n" ifadeleri bu
varsayıma göre okunur.

---

## 2. Stüdyo Organizasyonu ve Headcount Planı

### 2.1 Disiplin ekipleri ve kademeli kadro rampası

İç kadro dört dalga halinde büyür ve lansman sonrası canlı servis kadrosuna
küçülür. Zirve: **780 iç kadro + 420 dış kaynak FTE ≈ 1.200 kişi-eşdeğeri**
(2027 Q2, Beta dönemi).

| Disiplin | 2024 Q4 (ön prod. çıkışı) | 2025 Q4 | Bugün (2026 Q3) | Zirve (2027 Q2) | Lansman sonrası (2028 Q1) |
| --- | --- | --- | --- | --- | --- |
| Yapım ve proje yönetimi | 12 | 22 | 28 | 34 | 26 |
| Oyun tasarımı (sistem/görev/seviye/ekonomi/çatışma) | 30 | 62 | 78 | 92 | 60 |
| Anlatı | 12 | 20 | 24 | 26 | 14 |
| Programlama (Duskforge çekirdek/oynanış/Online/Anvil araçları/UI) | 58 | 110 | 138 | 172 | 128 |
| Sanat (çevre/karakter/araç/teknik sanat/VFX/aydınlatma/konsept) | 40 | 120 | 168 | 218 | 130 |
| Animasyon | 10 | 28 | 40 | 52 | 30 |
| Sinematik | 4 | 14 | 22 | 28 | 12 |
| Ses ve müzik | 6 | 16 | 24 | 32 | 20 |
| UX/UI tasarımı | 4 | 10 | 14 | 18 | 12 |
| QA (iç) | 8 | 34 | 52 | 74 | 90 |
| DevOps / derleme altyapısı / canlı servis operasyonu | 4 | 12 | 16 | 22 | 28 |
| Veri bilimi ve telemetri | 2 | 6 | 6 | 12 | 10 |
| **Toplam iç kadro** | **190** | **454** | **610** | **780** | **560** |
| Dış kaynak (FTE eşdeğeri) | 40 | 120 | 300 | 420 | 160 |

Notlar:

- QA iç kadrosu lansman sonrası **büyür** (74 → 90): canlı servis, 12 haftalık
  sezon ritmi (LW-GDD-06) ve kanarya shard doğrulaması sürekli test yükü üretir.
- Veri bilimi ekibi Beta'da ikiye katlanır; telemetri sözlüğü (LW-GDD-00) ve
  lansman savaş panosu bu ekibin teslimatıdır.
- 2028 Q1 kadrosu; Sezon 02–04 üretimi, "Deniz'in İzi" (2028 Q2) ve "Kara
  Leylek Düşerse" (2028 Q4) hikâye paketleri için boyutlandırılmıştır
  (bkz. LW-GDD-06, 1. yıl planı).

### 2.2 Bölge kolları (strike team) modeli

Anvil World editörü 9 paralel içerik ekibi varsayımıyla tasarlanmıştır
(bkz. LW-GDD-07). Buna uygun olarak içerik üretimi **9 bölge kolu** ile örgütlenir:

- Her kol: 1 kol lideri (kıdemli seviye tasarımcısı) + 6–10 seviye tasarımcısı +
  10–16 çevre sanatçısı + 2–3 görev tasarımcısı + gömülü 2 QA analisti.
- Yoğun bölgeler (Çekirdek, Neon Liman, Gölgepazar) üst banttan, seyrek
  bölgeler (Dış Halka, Kordon) alt banttan kadrolanır.
- Yörünge katmanı (Zenit Halkası) 10. kol olarak Yükseliş kolundan ayrışır
  (2026 Q3'te; sokak→yörünge koridoru iki kolun ortak teslimatıdır).
- Merkezî sistem ekipleri (PANOPT/Murmur, ekonomi, araç) bölge kollarına
  "iç müşteri" hizmet seviyesiyle çalışır: bölge kolundan gelen sistem hatası
  talebi 5 iş günü içinde triyajlanmak zorundadır.

### 2.3 Dış kaynak ortakları

| Ortak (kurgusal) | Kapsam | Zirve FTE | Kontrol mekanizması |
| --- | --- | --- | --- |
| **Palegrove Studios** | Çevre sanatı (bina cepheleri, iç mekân seti), prosedürel override paketleri | 210 | Haftalık varlık kabul turu; Anvil'e uzak erişim; red oranı > %15 iki hafta sürerse kapsam daraltılır |
| **Studio Karayel** | Animasyon (kalabalık döngüleri, araç iniş/biniş setleri) ve sinematik destek | 130 | Aylık kalite kapısı; motion capture stüdyo içinde kalır |
| **Verimark QA** | Dış QA: sertifikasyon senaryoları, yerelleştirme LQA (12 dil), uyumluluk matrisi | 80 | Test vaka kütüphanesi stüdyoda; günlük hata triyajına katılım |

İlke: **çekirdek hiçbir zaman dışarı verilmez** — Duskforge alt sistemleri
(Raylight, Riverbed, Murmur, Ledger, Meridian), PANOPT tasarımı, ana hikâye
görevleri ve üç protagonistin animasyon setleri yalnız iç kadroda üretilir.

---

## 3. Üretim Fazları: Giriş/Çıkış Kriterleri ve Tarih Aralıkları

Fazlar LW-GDD-07 kalite kapılarına kilitlenir. Her kapı üç platformda birden
ölçülür; tek platformda kalan aşım kapıyı bloke eder.

| Faz | Tarih aralığı | Giriş kriteri | Çıkış kriteri (özet; tam liste LW-GDD-07) |
| --- | --- | --- | --- |
| **Tam üretim** | Mart 2026 – Aralık 2026 | Vertical Slice geçildi | Alpha kriterlerinin karşılanması |
| **Alpha (özellik-tam)** | Aralık 2026 (2026 Q4 kapısı) | Tüm sistemler kod tabanında; 9 bölgenin 9'u dolaşılabilir (greybox kabul) | %99 kare süresi ≤ bütçe +%20; çökme MTBF ≥ 8 sa; ana hikâye baştan sona oynanabilir |
| **İçerik tamamlama (Content Complete)** | Ocak – Mart 2027 (kilit: **31 Mart 2027**) | Alpha geçildi; anlatı kilidi (1 Aralık 2026) yürürlükte | Tüm görevler, yan içerik, 9 bölge sanat-tam; 12 dil metin kilidi; seslendirme kayıtları ≥ %95 |
| **Beta** | Nisan – Mayıs 2027 (kapı: **Mayıs 2027, L−6 ay**) | İçerik tamamlama onayı; özellik dondurma (30 Nisan 2027) | %99 kare süresi ≤ bütçe +%10; MTBF ≥ 24 sa; bellek sızıntısı ≤ 4 MB/sa; LW-GDD-08 A-seviyesi erişilebilirlik gereksinimlerinin tamamı |
| **Cila ve sertifikasyon** | Haziran – Ağustos 2027 | Beta geçildi | Mock sertifikasyon #1 ve #2 temiz; Online açık stres testi tamam |
| **Gold Master** | **Eylül 2027 (L−2 ay)** | Cila dönemi çıkışı | %99 kare süresi ≤ bütçe; MTBF ≥ 40 sa; sızıntı ≤ 1 MB/sa; soğuk açılış ≤ 25 s; sıfır ship-blocker |
| **Lansman rampası** | Ekim – Kasım 2027 | Gold onayı, platform sertifikasyonu geçildi | L-Günü: eşzamanlı PC · 9. nesil konsollar · Bulut + Sezon 01 "Karartma Protokolü" açılışı |

Faz kuralları:

- **Anlatı kilidi (1 Aralık 2026):** Bu tarihten sonra senaryo değişikliği
  yalnız Yapım + Anlatı + Ses direktörlüklerinin ortak onayıyla yapılır; 12 dil
  seslendirme takvimi (LW-GDD-14) bu kilide bağlıdır.
- **Özellik dondurma (30 Nisan 2027):** LW-GDD-00'daki "inceleme öncesi son
  6 ayda özellik ekleme donar" kuralının takvim karşılığıdır. Dondurma sonrası
  yalnız cila, performans ve hata düzeltme.
- **Kapsam kesme merdiveni:** Bir faz kayarsa tarih değil kapsam kesilir.
  Önceden onaylı kesme sırası: (1) yan içerik yoğunluğu Dış Halka/Kordon'da
  düşürülür, (2) 200+ araç filosunda varyant sayısı azaltılır (sınıf sayısı
  korunur), (3) New Game+ lansman sonrasına alınır. Kesilemezler: %100
  kesintisiz dünya, 3 protagonist geçişi, PANOPT öğrenen takibi, 9 bölgenin
  dolaşılabilirliği, pay-to-win yasağının teknik teminatları.

---

## 4. Kilometre Taşı Takvimi ve Dikey Dilim

### 4.1 Çeyrek bazında kilometre taşları

| Çeyrek | Kilometre taşı | Bağlayıcı çıktı |
| --- | --- | --- |
| 2025 Q2 | First Playable — **geçildi** | Çekirdek dolaşımı + streaming kanıtı |
| 2026 Q1 | Vertical Slice "Asansör Günü" — **geçildi** | Sokak→yörünge kesintisiz demo, 3 protagonist geçişi |
| 2026 Q3 | **MT-1 "Sistem Kilidi"** | Tüm oynanış sistemleri özellik-tam aday; PANOPT profil vektörü (64 boyut) canlı; 5. bölge sanat geçişinde |
| 2026 Q4 | **Alpha kapısı** (LW-GDD-07) | Ana hikâye uçtan uca; 9/9 bölge dolaşılabilir; derecelendirme ön paketi gönderildi |
| 2027 Q1 | **İçerik Tamamlama** (31 Mart) | Sanat-tam 9 bölge + Zenit Halkası; 12 dil metin kilidi; F2 pazarlama varlıkları teslim (LW-GDD-09) |
| 2027 Q2 | **Beta kapısı** (Mayıs, L−6 ay) · Online kapalı teknik test | Erişilebilirlik A-seviyesi tam; derecelendirme final gönderimi; 50K kayıtlı test oyuncusu |
| 2027 Q3 | **Gold Master** (Eylül, L−2 ay) · Mock cert #2 · Online açık stres testi | Sıfır ship-blocker; Gün-1 yama dalı açılır; F3 oynanış derin bakışı yayında (Haziran) |
| 2027 Q4 | **L-Günü (Kasım varsayımı)** + Sezon 01 "Karartma Protokolü" | Eşzamanlı 3 platform; Zenit Kasası soygunu lansman haftasında oynanabilir (LW-GDD-00 karşı önlemi) |
| 2028 Q1 | 90-gün değerlendirmesi · Sezon 02 (Neon Liman) açılışı | D30/D60 metrik raporu (LW-GDD-00 eşiklerine karşı); kadro küçülme planının yürürlüğü |

Kilometre taşı disiplini: her taş, taştan 4 hafta önce "sarı/kırmızı" durum
raporuyla erken uyarı verir; kırmızı durum, kapsam kesme merdivenini otomatik
gündeme getirir. Taş tarihleri yalnız Yapım Direktörlüğü + Tasarım Direktörlüğü
ortak kararıyla oynatılabilir ve L-Günü'nü etkileyen kayma yayıncı raporuna girer.

### 4.2 Dikey dilim (Vertical Slice) tanımı — "Asansör Günü"

Şubat 2026'da geçilen dikey dilim, kalan tüm üretimin **kalite çıtası ve
referans sözleşmesidir**. İçeriği:

- **22 dakikalık kesintisiz oynanış:** Gölgepazar'da yaya takibiyle başlar
  (Mara, netrunning), Pas Kuşağı'nda araç kovalamacasına döner (Kaan, çatışma),
  Yükseliş tabanında asansöre biner ve Zenit Halkası'nda Kara Leylek'e yanaşmayla
  biter (Solene, sıfır-G) — **tek yükleme ekranı olmadan** (streaming koridoru
  ~3 dk, bkz. LW-GDD-07).
- **3 protagonist geçişi** oynanış içinde 4 kez; geçiş süresi ≤ 3 s.
- **PANOPT tepki merdiveninin** ilk üç kademesi (bkz. LW-GDD-16) ve profil
  vektörünün bir kaçış rotasını ikinci denemede cezalandırdığı canlı örnek.
- **240 LOD0/LOD1 vatandaş** sahnede; ikisi Ledger hafıza gösterimi yapar
  (dünkü olayı hatırlayan satıcı).
- Nihai kaliteye "temsilî" değil **"gönderilebilir"** standardında: dilimdeki
  her varlık, materyal ve ses son üründe değişmeden kullanılabilir olmalıydı ve
  öyle kabul edildi.

Kural: herhangi bir bölge kolunun "sanat-tam" beyanı, o bölgeden alınan 15
dakikalık rastgele dolaşımın Asansör Günü çıtasıyla kör karşılaştırmasını
(3 direktörlük paneli) geçmesine bağlıdır.

---

## 5. Bütçe Çerçevesi

Toplam geliştirme zarfı (pazarlama hariç; pazarlama bütçesi Yayın Direktörlüğü
tarafından ayrı yönetilir, bkz. LW-GDD-09): **360M USD** planlama varsayımı,
ön prodüksiyon başlangıcından L+90'a kadar.

| Kalem | Pay | Tutar (M USD) | Kapsam notu |
| --- | --- | --- | --- |
| Personel (iç kadro, yan haklar dahil) | %58 | 208,8 | ~2.400 kişi-yıl; zirve 780 kişi |
| Dış kaynak (sanat, animasyon, dış QA) | %16 | 57,6 | 3 ortak stüdyo; Bölüm 2.3 kontrol mekanizmalarıyla |
| Motor, araç ve donanım | %7 | 25,2 | Derleme çiftliği, devkit filosu, DCC lisansları, Anvil sunucuları |
| Ses ve müzik | %5 | 18,0 | OST, kayıt/orkestra, ana dil VO yapımı, adaptif müzik entegrasyonu (LW-GDD-14) |
| Yerelleştirme | %5 | 18,0 | 12 dil metin + seslendirme + LQA (LW-GDD-09 "aynı gün 12 dil" kuralı) |
| Sunucu/bulut altyapısı ve Online lansman rezervi | %4 | 14,4 | Meridian shard filosu, kanarya ortamı, ilk 90 gün kapasite rezervi |
| Oyuncu testi, araştırma, sertifikasyon ve derecelendirme | %1,5 | 5,4 | Playtest dalgaları, kurul ücretleri, mock submission maliyetleri |
| Yedek (contingency) | %3,5 | 12,6 | Yalnız Yapım Direktörlüğü onayıyla serbest bırakılır |
| **Toplam** | **%100** | **360,0** | |

Bütçe kuralları:

- Kalemler arası aktarım %1'in (3,6M) üzerindeyse değişiklik kontrol kaydı açılır.
- Yedek, 2027 Q2 itibarıyla en az %40 dolu değilse (≥ 5M) yayıncıya erken uyarı
  raporu gider; yedeğin tükenmesi otomatik kapsam kesme merdiveni tetikleyicisidir.
- Online lansman rezervi başka kaleme aktarılamaz: LW-GDD-09'un lansman haftası
  5M aktif oyuncu hedefi bu rezervin varlık sebebidir.

---

## 6. Risk Kaydı

Ölçek: Olasılık (O) 1–5 × Etki (E) 1–5; skor = O×E. Skor ≥ 15 **kırmızı**
(aylık direktörlük gözden geçirmesi), 9–14 **sarı** (sahibi çeyreklik raporlar),
≤ 8 **yeşil** (kayıtta izlenir). Kayıt sahibi: Yapım Direktörlüğü; güncelleme
ritmi: her kilometre taşında zorunlu.

| # | Risk | O | E | Skor | Azaltım planı |
| --- | --- | --- | --- | --- | --- |
| R-01 | **Kesintisiz akış:** Riverbed tepe I/O (2,4 GB/s) ve sokak→yörünge çift-doluluk (≤ 1,8 GB) hedefleri konsolda tutmaz; "yükleme ekranı yok" vaadi tehlikeye girer | 4 | 5 | **20** | Alpha'da 3 platformda gece bot konvoyu ıska telemetrisi; karo paketi bütçesinin (≤ 96 MB) sprint bazlı denetimi; B planı: R1 halka yarıçapını daraltma + asansör koridorunda R3 temsiline erken geçiş (vaat korunur, uzak detay düşer) |
| R-02 | **Online lansman yükü:** L-Günü'nde eşzamanlı talep Meridian shard kapasitesini aşar; devir süresi (≤ 250 ms) ve oturum açma çöker | 4 | 4 | **16** | Açık stres testi (2027 Q3, hedef 500K eşzamanlı); kapasite planı = tepe tahmini ×2,5; bölge shard'larının bağımsız ölçeklenmesi; giriş kuyruğu + tek oyunculu kampanyanın Online'dan bağımsız oynanabilirliği (kuyruk asla kampanyayı bloke edemez) |
| R-03 | **1.2M NPC simülasyon bütçesi:** Murmur 4,0 ms/kare CPU payını aşar; LOD3 toplu güncellemesi kare bütçesine taşar | 3 | 5 | **15** | Bütçe aşımı iki sprint kuralı (LW-GDD-07) ile otomatik optimizasyon kuyruğu; LOD1/LOD2 eşzamanlı ajan tavanlarında %20 esneme payı ayrılmış durumda; B planı: LOD2 tick'inin 1 Hz → 0,5 Hz düşürülmesi (kanon sayısı 1.2M değişmez, çözünürlük değişir) |
| R-04 | **İçerik üretim hızı:** 9 bölge kolunun sanat-tam temposu, İçerik Tamamlama (31 Mart 2027) hedefinin gerisinde kalır | 3 | 4 | **12** | Haftalık bölge yakma grafiği (burn-down); Palegrove kapasitesinin Q4'te +%15 opsiyonu sözleşmede; kapsam kesme merdiveni madde 1 (Dış Halka/Kordon yoğunluğu) |
| R-05 | **Pazar penceresi:** GTA VI kayması ya da 2027 Q4'te rakip yığılması, lansman penceresini sıkıştırır | 2 | 5 | **10** | Çeyreklik pazar istihbarat raporu (Yayın ile ortak); L-Günü'nün Q4 içinde ±4 hafta oynatılabilmesi için Gold'un L−2 ay disiplini; mesaj farklılaştırması hazır (LW-GDD-00 rekabet analizi) |
| R-06 | **Rollback determinizmi:** Çatışma çekirdeğinin sabit-nokta fizik alt kümesinde platformlar arası determinizm kırılır; çapraz platform PvP bozulur | 3 | 3 | **9** | Her gece 3 platformda determinizm karşılaştırma koşusu (aynı tohum, bit-eşit sonuç şartı); sapma tespitinde otomatik commit geri izleme; Beta'ya kadar kapanmazsa çapraz platform PvP eşleştirmesi geçici olarak platform-içi daraltılır (çapraz ilerleme etkilenmez) |
| R-07 | **Kilit personel kaybı:** Duskforge çekirdek ekibinden (Raylight/Riverbed mimarları) kritik ayrılık | 2 | 4 | **8** | Her alt sistemde en az 2 kıdemli "ikinci beyin" kuralı; mimari karar kayıtları (ADR) zorunlu; elde tutma paketi 2026 Q4 ve Gold sonrası iki dilimde |
| R-08 | **Platform sertifikasyonu:** Askıya alma/devam ve depolama-dolu senaryolarında kesintisiz dünya istisnaları sertifikasyondan döner | 2 | 4 | **8** | İki mock submission (LW-GDD-07) + senaryoların gece otomasyon kapsamında olması; platform temsilcileriyle Alpha'dan itibaren üç aylık ön istişare |
| R-09 | **Derecelendirme riski:** İçerik PEGI 18 / ESRB M üst sınırını aşar (AO/ret riski) ve yeniden düzenleme maliyeti doğar | 2 | 3 | **6** | İçerik siciline "derecelendirme bayrağı" alanı; Alpha ön paketi ile kurullardan erken geri bildirim; şüpheli sahnelerde çift varyant üretimi (Bölüm 8) |
| R-10 | **Gün-1 yaması dağıtımı:** Yama ≤ 10 GB hedefini aşar ya da CDN tepe yükü ön yükleme dalgasını boğar | 2 | 3 | **6** | Yama kapsam kilidi Gold'da (yalnız stabilite); boyut haftalık izlenir; ön yükleme L−7'de açılır ve yama L−3'te CDN'e tohumlanır |

Kırmızı risklerin (R-01, R-02, R-03) her biri için sorumlu bir direktör atanır
ve azaltım ilerlemesi aylık yayıncı raporunda ayrı başlıktır. Bir riskin skoru
iki çeyrek üst üste yükselirse kapsam kesme merdiveni gündeme alınır.

---

## 7. QA Stratejisi

### 7.1 Otomasyon piramidi

Hedef dağılım (koşu hacmi bazında): **%70 birim / %20 entegrasyon / %8
sistem-bot / %2 elle senaryo.** Piramidin tabanı geliştiriciye, tepesi QA
analistine aittir.

| Katman | Kapsam | Tetik | Bütçe/eşik |
| --- | --- | --- | --- |
| 1 — Birim | Oynanış kuralları, ekonomi formülleri, Ledger kayıt bütünlüğü | Her commit | ≤ 12 dk; kırmızı test = birleştirme engeli |
| 2 — Entegrasyon | Alt sistem sözleşmeleri (Raylight↔Riverbed, Murmur↔Ledger, Meridian devri) | Her gece | "Yeşil sabah" ilkesi (LW-GDD-07): 06:00'da oynanabilir derleme |
| 3 — Sistem/bot | 9 bölgede bot konvoyu (sürüş + uçuş + asansör turu), 24 sa soak, determinizm karşılaştırması | Her gece + hafta sonu | %99 kare süresi, streaming ıskası ≤ 1/oturum, bellek tepe değerleri; eşik aşımı otomatik hata kaydı |
| 4 — Elle | Keşif testi, sertifikasyon senaryoları, erişilebilirlik doğrulaması (LW-GDD-08), LQA | Sprint bazlı | Gömülü QA (bölge kolları) + merkezî QA + Verimark |

Hata sınıflandırması: **S1 ship-blocker** (yükleme ekranı ihlali, ekonomi
istemci otoritesi, ilerleme kaybı) · S2 kritik · S3 majör · S4 minör. S1 açıkken
hiçbir kapı geçilemez; Beta'dan itibaren S2 stoğu ≤ 50, Gold'da 0 hedeflenir.

### 7.2 Oyun testi (playtest) programı

| Program | Ritim | Katılımcı | Ölçüm |
| --- | --- | --- | --- |
| "Perşembe Sokağı" (iç) | Haftalık, 2 sa | 40–60 stüdyo çalışanı (rotasyonlu) | Sütun kesme testleri (LW-GDD-00 vizyon cümlesi), akış kırılma noktaları |
| "Şehir Günü" (iç, tam gün) | Aylık | Tüm stüdyo | Uçtan uca kampanya ilerleyişi; direktörlük gözlem notları |
| Dış playtest dalgaları | Alpha'dan L−8 haftaya kadar 8 dalga | Dalga başına 60–120 kişi, NDA'lı laboratuvar | Görev başarı/bırakma hunisi, PANOPT adalet algısı (LW-GDD-16), erişilebilirlik ön ayar kullanımı |
| Online kapalı teknik test | 2027 Q2, 3 hafta sonu | 50K kayıtlı oyuncu | Shard devri, eşleştirme, ekonomi sömürü taraması |
| Online açık stres testi | 2027 Q3 (L−8 hafta) | Hedef 500K eşzamanlı | Kapasite ×2,5 doğrulaması, giriş kuyruğu davranışı |

Her dış dalganın bulguları 10 iş günü içinde "değişiklik kararı / ret gerekçesi"
olarak kapatılır; kapatılmamış bulgu sonraki kilometre taşı raporuna taşınır.

### 7.3 Telemetri planı

- **Tek sözlük kuralı:** Tüm olaylar LW-GDD-00'da tanımlı telemetri sözlüğüne
  bağlanır; tanımsız metrik toplanamaz ve raporlanamaz.
- **Geliştirme telemetrisi:** kare süresi, I/O, Murmur bütçesi, devir süreleri
  commit'e kadar geri izlenebilir (LW-GDD-07); performans regresyonu açan commit
  sahibine otomatik atanır.
- **Oyuncu telemetrisi (dış testler + canlı):** oturum hunisi, görev bırakma
  noktaları, ölüm ısı haritaları (bölge × saat), ekonomi akışları (Lümen
  kaynak/gider), PANOPT kademe dağılımı. Kişisel veri asgariliği ve açık rıza
  zorunludur; profil vektörü (64 boyut) tek oyunculuda yereldir (LW-GDD-07) ve
  telemetriye ham haliyle asla gönderilmez.
- **Lansman savaş panosu:** L−30'da devreye girer; D1/D7/D30 tutundurma, çökme
  oranı, shard sağlığı ve "monetizasyon adil" algısı (LW-GDD-00 eşikleri) tek
  ekranda, 5 dakikalık tazelemeyle izlenir.

---

## 8. Sertifikasyon ve Derecelendirme

### 8.1 Yaş derecelendirmesi (hedef: PEGI 18 / ESRB M)

| Kurul | Hedef | Ön paket | Final gönderim | Not |
| --- | --- | --- | --- | --- |
| PEGI | 18 | 2026 Q4 (Alpha görüntüleri) | 2027 Q2 (Beta derlemesi) | AB + İngiltere pazarları |
| ESRB | M (Mature 17+) | 2026 Q4 | 2027 Q2 | AO çıkması sürüm engelleyicidir; şüpheli sahnelere çift varyant |
| USK | 18 | 2027 Q1 | 2027 Q2 | Almanya; sembol/tarihsel içerik taraması ayrıca yapılır |
| CERO | Z | 2027 Q1 | 2027 Q2 | Japonya; gerekirse bölgesel sahne varyantı (oynanış eşdeğerliği şartıyla) |
| GRAC | 청소년이용불가 | 2027 Q1 | 2027 Q2 | Kore; olasılık içeren hiçbir MTX yok — Prizma yalnız doğrudan kozmetik satışıdır, loot box sınıfına girmez |

Kurallar: derecelendirmeyi etkileyebilecek her içerik, içerik sicilinde
"derecelendirme bayrağı" ile işaretlenir ve anlatı kilidi (1 Aralık 2026)
öncesinde direktörlük onayından geçer. Bölgesel varyantlar hiçbir koşulda
oynanış avantajı/dezavantajı üretemez.

### 8.2 Platform sertifikasyon takvimi

| Adım | Tarih | Kapsam |
| --- | --- | --- |
| Ön istişare turları | 2026 Q4'ten itibaren üç ayda bir | Kesintisiz dünya istisnaları: askıya alma/devam, kullanıcı değiştirme, ağ kopması, depolama dolu |
| Mock submission #1 | Haziran 2027 (Beta çıkışı) | Tam sertifikasyon senaryo seti, 3 platform |
| Mock submission #2 | Ağustos 2027 (Gold −4 hafta) | #1 bulgularının kapanış doğrulaması |
| Gerçek gönderim | Eylül 2027 (Gold) | Sertifikasyon geçişi hedefi: L−4 hafta |
| Gün-1 yaması gönderimi | L−3 hafta | Yalnız stabilite; boyut ≤ 10 GB (LW-GDD-07) |
| Sezon 01 istemci bileşenleri | Gold paketinde gömülü | 12 haftalık sezon ritminin "sezondan ≥ 4 hafta önce yama" kuralı (LW-GDD-07) L-Günü için Gold'la sağlanır |

Sertifikasyondan dönen her bulgu 48 saat içinde triyajlanır; ret senaryosunda
yeniden gönderim döngüsü için takvimde 3 haftalık tampon ayrılmıştır (Ekim 2027).

---

## 9. Gün-1 Yaması ve Lansman-Sonrası İlk 90 Gün

### 9.1 Gün-1 yaması disiplini

- **İçerik kilidi Gold'dadır**; Gün-1 yaması yalnız şunları içerebilir: çökme ve
  ilerleme-kaybı düzeltmeleri, performans regresyon onarımı, sertifikasyon
  sonrası platform düzeltmeleri, sunucu uyumluluk güncellemeleri, günü gelmiş
  denge değerleri (veri, kod değil).
- Boyut tavanı **10 GB** (LW-GDD-07); haftalık boyut raporu Gold'dan itibaren
  yayıncıya gider. Ön yükleme L−7'de açılır; yama L−3'te CDN'e tohumlanır.
- Yamasız oynanabilirlik şartı: Gün-1 yaması inmeden de tek oyunculu kampanya
  S1 hatasız oynanabilir olmalıdır (fiziksel Eternal kutusu senaryosu,
  bkz. LW-GDD-09).

### 9.2 İlk 90 gün operasyon planı

Lansman, Sezon 01 "Karartma Protokolü"nün ilk 12 haftasıyla (≈ 84 gün) örtüşür;
90-gün planı sezon ritmine kilitlenir (bkz. LW-GDD-06, LW-GDD-09).

| Dönem | Operasyon | Hedef/eşik |
| --- | --- | --- |
| L-Günü – L+14 | **"Lansman Köprüsü"** savaş odası: 7/24, üç vardiya; tüm direktörlükler nöbet listesinde | Kritik hotfix SLA: istemci ≤ 24 sa, sunucu tarafı geri alma ≤ 15 dk (LW-GDD-07); kriz iletişimi ilk açıklama ≤ 2 sa (LW-GDD-09) |
| L+1 – L+28 | Haftalık istemci yaması (stabilite + denge); günlük sunucu bayrak ayarı; ekonomi sömürü nöbeti | Lansman haftası çökme oranı < %1,5 oturum (taban, hedef < %0,8 — LW-GDD-00); Lümen enflasyon göstergeleri günlük raporda |
| L+28 – L+56 | İki haftalık yama ritmine geçiş; Sezon 01 ortası etkinliği desteği; ilk denge revizyon paketi | D30 ölçümü: Online D30 ≥ %15 taban / %22 hedef (LW-GDD-00); "monetizasyon adil" algısı D60 anketi hazırlığı |
| L+56 – L+90 | Sezon 01 kapanışı ve Sezon 02 (Neon Liman) rampası; 90-gün retrosu; kadro küçülme planının kademeli yürürlüğü | Sezon 01→02 geçiş tutundurması ≥ %50 taban; retro çıktıları LW-GDD-06 sezon şablonuna işlenir |

Ek kurallar:

- Kanarya shard'ında 48 saat hatasız koşmayan hiçbir sunucu sürümü yayılmaz
  (LW-GDD-07); lansman haftasında bu kural gevşetilemez.
- "Monetizasyon adil" algısı D60'ta %70 tabanının altına düşerse, sezon içeriği
  yerine ekonomi dengelemesine kaynak kaydırma tetiklenir (LW-GDD-00 kuralı);
  bu kararın kadro karşılığı (ekonomi ekibine geçici +6 kişi) bu planda ayrılmıştır.
- İlk 90 günde hiçbir yeni özellik taahhüdü kamuya verilmez; iletişim yalnız
  yol haritasındaki içeriktir ("Lumenworks Hattı" aylık yayını, LW-GDD-09).

---

## 10. Sürdürülebilirlik: Crunch Yasağı ve Kapasite Planlaması

### 10.1 Sürdürülebilir Tempo Sözleşmesi (STS)

Crunch, LUMENFALL üretiminde **planlama aracı olarak yasaktır**. İlkeler:

- Standart hafta 40 saattir. Zorunlu fazla mesai yoktur; hafta sonu çalışması
  yalnız gönüllülük, ücret/izin karşılığı ve önceden onayla yapılabilir.
- Fazla mesai tavanı: kişi başına haftada ≤ 4 saat, yılda ≤ 6 hafta. Tavan
  aşımı İK panosunda otomatik görünür ve ekip liderine değil, **plana** soru
  sorulur: aşım, kapsamın kesilmesi gereken yerin göstergesidir.
- **"Kırmızı hafta" istisna protokolü:** Yalnız Gold öncesi son 8 haftada, en
  fazla 2 kez, direktörlük + İK ortak onayıyla ilan edilebilir; ekip bazında
  gönüllü katılım, ertesi ay birebir telafi izni zorunlu.
- Kilometre taşı kayarsa ilk yanıt her zaman kapsam kesme merdivenidir
  (Bölüm 3); mesai artırımı bir "azaltım planı" olarak risk kaydına yazılamaz.
- Sağlık göstergeleri: çeyreklik eNPS anketi, izin kullanım oranı (hedef ≥ %85),
  gönüllü ayrılma oranı (uyarı eşiği: yıllık > %12). Göstergeler kilometre taşı
  raporlarının sabit bölümüdür — tarih tutturup ekibi tüketen bir taş
  "başarılı" sayılmaz.

### 10.2 Kapasite planlaması

- Tüm kilometre taşları ekip kapasitesinin **%80'iyle** planlanır; %20 tampon
  hata düzeltme, hastalık/izin ve öngörülemeyen işler içindir. Tampon "bedava
  kapasite" değildir ve önceden işe bağlanamaz.
- Bölge kolları arasında personel ödünç alma en fazla 4 haftalıktır; kalıcı
  ihtiyaç, kadro planı revizyonu gerektirir.
- Lansman sonrası küçülme (780 → 560) işten çıkarma varsayımıyla değil; sezon
  ekipleri, hikâye paketi ekipleri ("Deniz'in İzi", "Kara Leylek Düşerse") ve
  stüdyonun sıradaki projesinin ön prodüksiyonuna planlı geçişle yürütülür.
  Geçiş atamaları Gold'dan önce (Eylül 2027) kişilere bildirilir.

---

## 11. Açık Sorular

1. **L-Günü kilidi:** Kasım 2027 ortası varsayımı, ön sipariş açılışından (F3,
   Haziran 2027) önce Yayın Direktörlüğü ile kesinleşmeli. Tasarım Direktörlüğü
   açısından Q4 içi ±4 haftalık kaymanın sezon takvimi (LW-GDD-06) üzerindeki
   etkisi kabul edilebilir mi?
2. **Açık stres testi iletişimi:** L−8 haftadaki Online açık stres testi, F4
   lansman rampasıyla çakışıyor. Kamuya açık "beta hafta sonu" olarak mı
   konumlanacak, yoksa kayıtlı-davetli teknik test olarak mı? (LW-GDD-09'a ek
   iletişim vuruşu gerektirir.)
3. **New Game+ kapsamı:** Kapsam kesme merdiveninde New Game+ lansman sonrasına
   alınabilir görünüyor; ancak LW-GDD-00 birincil kitle karşılığında sayılıyor.
   Lansman kapsamında kalması tasarım açısından "kesilemez" ilan edilecek mi?
4. **Bölge yoğunluk çıtası:** Dış Halka ve Kordon için "sanat-tam" kabulünde
   içerik yoğunluğu kesme kriterini (km² başına aktivite sayısı) Tasarım
   Direktörlüğü mü tanımlayacak, yoksa Asansör Günü kör karşılaştırması yeterli
   sayılacak mı?
5. **Anlatı kilidi toleransı:** 1 Aralık 2026 anlatı kilidi sonrasında 12 dil
   seslendirme yeniden kayıt bütçesi yalnız %3 satır değişikliğini kaldırıyor.
   İkinci ve üçüncü perde diyaloglarında bu tolerans Anlatı Ekibi Liderliği
   tarafından onaylanıyor mu?
6. **Ekonomi acil müdahale yetkisi:** İlk 90 günde Lümen enflasyon eşiği
   aşılırsa sunucu bayraklarıyla anlık müdahale yetkisi Canlı Servis ve Ekonomi
   Liderliği'nde mi, yoksa her müdahale için tasarım onayı mı aranacak?
   (Pay-to-win yasağına dokunmayan denge değişiklikleri kastedilmektedir.)

---

## Sürüm Geçmişi

| Sürüm | Tarih | Yazar | Değişiklik |
| --- | --- | --- | --- |
| 1.0 | 5 Temmuz 2026 | Yapım Direktörü | İlk sürüm |

---

*Bu belge bir konsept çalışmasıdır. LUMENFALL, Lumenworks Studios, Duskforge
Engine ile burada geçen tüm kişi, kurum, ortak stüdyo, tarih, bütçe ve sayılar
tamamen kurgusaldır; gerçek kişi, kurum veya ürünlerle benzerlikler tesadüfidir
ve hiçbir ifade ticari ya da işsel taahhüt oluşturmaz.*
