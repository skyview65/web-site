# LUMENFALL — Arayüz ve UX

> **"Karanlık parlar."** — ve arayüz, o karanlığa bakan gözün kendisidir.

| Alan | Değer |
| --- | --- |
| **Belge No** | LW-GDD-15 |
| **Sürüm** | 1.0 |
| **Tarih** | 5 Temmuz 2026 |
| **Sahip** | UI/UX Lideri |
| **Durum** | İnceleme |
| **Gizlilik** | Stüdyo İçi — Dağıtım Onaya Tabidir |

Bu belge, **LUMENFALL**'un tüm oyuncu-yüzü arayüzlerini tanımlar: diegetik
implant HUD'u, harita ve seyrüsefer, implant menüsü, envanter/garaj/kıyafet
ekranları, karakter geçiş arayüzü, LUMENFALL Online lobi ve crew arayüzleri,
ikonografi/tipografi sistemi, bağlam içi onboarding ve UX ölçüm planı.
Sistem bağımlılıkları için LW-GDD-03 (oynanış), LW-GDD-02 (Odak Kayması
kurgusu), LW-GDD-05 (ekonomi), LW-GDD-08 (erişilebilirlik), LW-GDD-10
(multiplayer) ve LW-GDD-19 (açılış senaryosu) belgelerine çapraz referans
verilir. Kanondan gelen adlar, tarihler ve sayılar bağlayıcıdır (bkz.
`README.md` — Kanon İlkesi).

---

## 1. Diegetik Arayüz Felsefesi

### 1.1 Temel tez: HUD, göz implantının render'ıdır

LUMENFALL'da HUD bir "oyun katmanı" değildir; karakterin şakak/lens
implantının (bkz. LW-GDD-01, Teknoloji Seviyesi) gerçek zamanlı çıktısıdır.
2099 Lumenfall'ında herkes dünyayı bir arayüz katmanıyla görür — oyuncu da
protagonistin gördüğünü görür. Bu tezin dört bağlayıcı sonucu vardır:

1. **HUD dünyaya aittir:** Yağmur lense damladığında HUD kenarında kırılma
   olur; K2 implant geri tepmesi HUD paraziti üretir (LW-GDD-03, Siber
   Savaş); EMP alanında HUD 2–4 sn tamamen çöker ve yeniden başlar.
2. **Üç karakter, üç arayüz:** HUD karakterin kişiliğinin ve geçmişinin
   uzantısıdır (bkz. 1.2). Odak Kayması aynı zamanda bir arayüz değişimidir.
3. **Kurgu, erişilebilirliği asla kısıtlamaz:** LW-GDD-08 İlke 6 bağlayıcıdır
   — her diegetik efekt (parazit, kırılma, çökme) ayrı anahtarla
   kapatılabilir ve hiçbir kritik bilgi yalnızca diegetik kanalda kalmaz.
4. **Fotosensitivite tavanı:** Hiçbir HUD bozulma efekti saniyede 3'ten
   fazla flaş üretemez; ihlal derleme hattında otomatik testle yakalanır
   (LW-GDD-08, Uyumluluk Hedefleri; LW-GDD-07 otomasyonu).

### 1.2 Üç protagonist, üç HUD kişiliği

Her HUD, karakterin implant yazılımının kurgu içi kimliğini taşır. Düzen
(bileşen konumları, girdi haritası) üçünde de **aynıdır** — kas hafızası
korunur; değişen şey doku, renk ve mikro-davranıştır.

| Özellik | Mara Vex | Kaan "Ghost" Demir | Solene Adeyemi |
| --- | --- | --- | --- |
| Aksan rengi | Macenta | Camgöbeği | Amber |
| Kurgu içi yazılım | **Sızma Kabuğu** — Mara'nın kendi derlediği korsan firmware | **KV-Nöbetçi kalıntısı** — lisansı iptal edilmiş Kessler-Voss askeri arayüzü | **Leylek Aviyonik Arayüzü (LAA)** — Kara Leylek'in kokpit sisteminden türetilmiş |
| Tipografik doku | Sıkı satır aralığı, eş genişlikli veri blokları, terminal imleci | Şablon (stencil) hissi, seyrek ve büyük etiketler, askeri kısaltmalar | Uçuş aleti rakamları, ufuk çizgisi ızgarası, hafif CRT kavisi |
| Bozulma efekti | Tarama çizgisi + glitch kayması (hasar aldıkça artar) | Efekt yok; hasarda kenar vinyetleşir — "eski asker sarsılmaz" | Analog iğne titremesi, hasarda amber uyarı jelâtini |
| Mikro-davranış | İşlem Çekirdeği göstergesi her zaman görünür (bkz. 2.1); hack hedefleri pasif vurgulanır | Yakın dövüş menzilindeki hedefte sersemletme ölçeri belirir; **İris kapalıyken HUD tamamen söner** (Izgara Dışı, bkz. 5.4) | Araçtayken HUD araç aviyoniğiyle birleşir; yükseklik/vektör şeridi kalıcıdır |
| Ses imzası (LW-GDD-14 ile) | Yumuşak sentez tıkları | Mekanik röle sesi | Kokpit uyarı tonları |

**Renk körlüğü kuralı:** Üç aksan rengi, LW-GDD-08'deki laboratuvar onaylı
alternatif tonlara eşlenir; karakter kimliği her zaman renk + benzersiz
simge + isim etiketi üçlüsüyle taşınır, asla yalnız renkle değil.

---

## 2. HUD Bileşen Envanteri ve Görünürlük Kuralları

### 2.1 Bileşen envanteri

Referans yerleşim (varsayılan; her öğe LW-GDD-08 gereği taşınabilir,
ölçeklenebilir ve tek tek kapatılabilir):

| # | Bileşen | Varsayılan konum | Durumları | Notlar |
| --- | --- | --- | --- | --- |
| H1 | Vital halkası (sağlık + zırh) | Sol alt | Dolu · hasar (anlık kırmızı vuruş) · kritik (<%25, nabız) · iyileşme | Zırh, sağlık halkasının dış segmentidir; segment kırılması okunur |
| H2 | Mühimmat / şarjör | Sağ alt, mini haritanın üstü | Dolu · dolum · boş · tutukluk ("Pas işi" silahlar, LW-GDD-03) | Rakamlar tabular; şarjör sayısı nokta dizisi + sayı |
| H3 | İşlem Çekirdeği göstergesi | H1'in üstü | 0–6 çekirdek · yenilenme (8 sn/adet dövüş dışı) · kanal (K3) | Mara'da kalıcı; Kaan/Solene'de yalnız K1 erişimi bağlamında belirir |
| H4 | Bakış Göstergesi (PANOPT durumu) | Üst orta | İlgi (göz açılır) · Müdahale (göz + sevk oku) · Bastırma (çerçeve deseni) · Silinme Protokolü (3. perde) | **Sessiz İzleme kasıtlı olarak hiçbir şey göstermez** (LW-GDD-03); renk + simge + çerçeve deseni birlikte kullanılır |
| H5 | Kayıt piktogramı | Ekran kenarı, ihlal yönünde | Tek durum, 0,5 sn | Her PANOPT gözlemi görünür kılınır — "adaletsizlik yok" korkuluğunun UI karşılığı |
| H6 | Mini harita | Sağ alt | Normal · kör bölge (sisli doku) · kilitleme (Bastırma'da bölge sınırı kızıl) | 4 köşe + 3 boyut seçeneği (LW-GDD-08); pusula şeridi alternatifi (bkz. Açık Sorular) |
| H7 | Görev işaretçisi | Dünya içi + mini harita | Aktif · sabitlenmiş · mesafe etiketi (>50 m'de) | İşaretçi ekonomisi bkz. 3.3 |
| H8 | Etkileşim istemi | Hedef nesne üstü | Kullanılabilir · tutma (dolum halkası) · kilitli (gereksinim etiketi) | Aynı anda en fazla 1 istem; en yakın/en merkezi hedef önceliklenir |
| H9 | Hasar yönü göstergesi | Ekran ortası çevresi | Yay segmenti, 0,6 sn | Ses görselleştiriciyle (LW-GDD-08) çakışmayacak ayrı yarıçapta |
| H10 | Sıcak Para rozeti | LM sayacının yanı | Aklanmamış LM varken kalıcı, alev dokulu | Harcanırsa iz bırakacağını hatırlatır (LW-GDD-03, Soğuma) |
| H11 | Bölge banner'ı | Üst orta, 3 sn | Bölge adı + Gerilim Endeksi ikonu (0–100'ün 5 kademeli özeti) | Bölge sınırı geçişinde; Gerilim 70+ ise ek uyarı satırı |
| H12 | Araç HUD şeridi | Alt orta | Hız · hasar silueti (6 bölge, LW-GDD-03) · yükseklik bandı (hover) · ısı imzası (yörünge) | Solene'de LAA ile genişler; yaya inince 400 ms'de söner |
| H13 | Altyazı alanı | Alt orta, H12'nin üstü | LW-GDD-08 Altyazı Standartları birebir uygulanır | Boyut/kutu/etiket kuralları LW-GDD-08'e tabidir |
| H14 | Ses görselleştirici | Ekran kenarı halkası | Silah · patlama · adım · motor · dron vınlaması | Erişilebilirlik katmanı; varsayılan kapalı, sihirbazda önerilir |
| H15 | Piyasa/crew bildirimi | Sağ üst | Bilgi · fırsat · tehlike | Ayrı susturma anahtarı (LW-GDD-08, bilgi yükü) |

### 2.2 Görünürlük ön ayarları

LW-GDD-08'deki dört HUD ön ayarı bu envanterle şöyle eşlenir:

| Bileşen | Tam | Dinamik | Minimal | Sinematik |
| --- | --- | --- | --- | --- |
| H1 Vital | Kalıcı | Hasar/iyileşmede + 3 sn | Yalnız kritik | Kapalı |
| H2 Mühimmat | Kalıcı | Silah çekiliyken | Silah çekiliyken | Kapalı |
| H3 Çekirdek | Kalıcı (Mara) | Siber bağlamda | Kanal sırasında | Kapalı |
| H4 Bakış | Kalıcı | Kalıcı | Kalıcı | Kalıcı (küçük) |
| H5 Kayıt | Kalıcı | Kalıcı | Kalıcı | Kalıcı |
| H6 Mini harita | Kalıcı | Seyrüsefer aktifken | Kapalı | Kapalı |
| H7 İşaretçi | Kalıcı | Kalıcı | Yalnız aktif görev | Kapalı |
| H8 Etkileşim | Kalıcı | Kalıcı | Kalıcı | Menzilde 1 sn |
| H10–H15 | Kalıcı | Bağlamda | Kapalı (H13 hariç) | Kapalı (H13 hariç) |

- **Değişmez çekirdek:** H4 (Bakış) ve H5 (Kayıt) hiçbir ön ayarda tamamen
  kaldırılamaz; PANOPT adaleti (LW-GDD-03, Tasarım Korkulukları) bu iki
  bileşenin görünürlüğüne dayanır. Öğe bazlı gizleme menüsünde bu ikisi
  "yalnızca küçült" seçeneği sunar.
- **Zamanlama sabitleri:** belirme 150 ms, sönme 400 ms, bağlam sonrası
  bekleme 2 sn. Dinamik ön ayarın "hayalet HUD" hissi bu üç sabitle kurulur.
- Varsayılan ön ayar **Dinamik**'tir; ilk açılış sihirbazı (LW-GDD-08)
  Tam'ı önerme koşullarını (bilişsel yardım seçimi) içerir.

---

## 3. Harita ve Seyrüsefer

### 3.1 3B katmanlı şehir haritası

Harita, İris'in (bkz. 5. bölüm) tam ekran uygulamasıdır ve 310 km² şehir +
yörünge katmanını tek kesintisiz 3B modelde sunar. Dikey filtre,
LW-GDD-03'teki beş traversal katmanıyla bire birdir:

| Katman filtresi | Aralık | Harita davranışı |
| --- | --- | --- |
| Sisaltı | −40 – 0 m | Kanal ağı ve dalış noktaları; üst katmanlar hayalet siluet |
| Sokak | 0 – 30 m | Varsayılan görünüm |
| Geçit Ağı | 30 – 120 m | Yaya köprüleri, raylı kapsül hatları, çatı rotaları |
| Hava Koridorları | 120 – 800 m | Koridor şeritleri + kiralık yükseklik bantları |
| Yörünge Hattı | 800 m – 36.000 km | Yükseliş halatı, Zenit Halkası, rıhtımlar |

- **Yakınlaşma kademeleri (4):** Şehir (9 bölge + Zenit Halkası özeti) →
  Bölge → Sokak → Yapı (yalnız keşfedilmiş/istihbaratı alınmış iç planlar;
  soygun hazırlığının LW-GDD-03 istihbarat kaynaklarıyla beslenir).
- **Sis Kuralı (diegetik veri kalitesi):** Haritanın çözünürlüğü PANOPT
  kapsamasıyla orantılıdır — Çekirdek %98 kapsama = tam detay; Sisaltı %25
  ve Dış Halka %5 = sisli, eksik, söylenti etiketli harita. Kör bölge
  haritaları oyunla kazanılır: Kanalcı haritaları (Sisaltı) ve kervan
  krokileri (Dış Halka) satın alınabilir ya da keşifle çizilir. Böylece
  harita ekranı, "karanlık parlar" tezinin bilgi tasarımı karşılığı olur.
- **Katman değiştirme maliyeti:** herhangi bir katmana geçiş ≤ 2 girdi
  (omuz tuşları / kaydırıcı); test kriteri bkz. 10.1.

### 3.2 Yol çizimi

- GPS rotası dünya içinde yüzeye yapışık AR şeridi olarak çizilir; katman
  değiştiren rotalarda (sokak → geçit ağı) dikey geçiş noktası özel "sarmal"
  ikonuyla işaretlenir.
- **Yer İmi modu** (LW-GDD-08): GPS şeridi yerine simge yapı siluetleriyle
  yönlendirme — PANOPT Kulesi doğal pusuladır (LW-GDD-01, Bölge Simge
  Yapıları); mini haritada hedef yönü tek ok olarak sadeleşir.
- Rota motoru diegetik hızlı seyahat duraklarını (otonom taksi, raylı
  kapsül, asansör; LW-GDD-03) rotaya alternatif segment olarak önerir;
  tahmini süre + maliyet (LM) etiketiyle.

### 3.3 İşaretçi ekonomisi

İşaretçi enflasyonu açık dünya UI'larının baş düşmanıdır. Bağlayıcı bütçe:

| Kural | Değer |
| --- | --- |
| Aktif görev | Aynı anda 1 (izlenen görev) |
| Sabitlenmiş görev | En fazla 2 (yalnız mini harita + haritada) |
| Kişisel işaretçi ("raptiye") | Haritada 8; dünyada aynı anda 1 çizili rota |
| Ekranda eşzamanlı dünya işaretçisi | ≤ 5 (öncelik: etkileşim > aktif görev > tehlike > sabitlenmiş > raptiye) |
| Keşfedilmemiş içerik | Haritaya kendiliğinden dökülmez — "?" ikon yağmuru yasaktır; dünya içi gözlem (bkz. LW-GDD-12 söylenti sistemi) haritaya işler |
| Mesafe etiketi | 50 m altında gizlenir; 1 km üstünde yön okuna dönüşür |
| Online (40 kişilik Serbest Dolaşım) | Crew üyeleri (≤ 4) her zaman; diğer oyuncular yalnız 100 m içinde veya "kanun dışı" işaretliyken |

---

## 4. Odak Kayması — Karakter Geçiş Arayüzü

LW-GDD-02'deki kurgu ve LW-GDD-03'teki geçiş kuralıyla bire bir çalışır.

- **Girdi:** Geçiş tuşu 0,4 sn basılı tutulur → üç portreli radyal çark
  açılır (oyun %85 yavaşlar, durmaz — kesintisiz dünya). Çark, LW-GDD-08
  gereği tek girdiyle gezilebilir ve tek elle profillere tek kısayola
  indirgenebilir; hiçbir geçiş zaman baskısı altında zorunlu değildir.
- **Portre kartı içeriği (karakter başına):** isim + aksan rengi + benzersiz
  simge · anlık konum (bölge adı) · o karakterin PANOPT durumu (üç ayrı
  tehdit dosyası, LW-GDD-03) · biriken Ustalık özeti (pasif %20 hız) ·
  varsa "meşgul" etiketi (anlatı kilidi, LW-GDD-02).
- **Serbest dolaşım geçişi:** ~4 sn'lik gözetim-akışı uçuşu — kamera mevcut
  karakterden yükselir, şehrin veri katmanı üzerinden süzülür, hedefin
  hayatının ortasına iner (LW-GDD-02). Uçuş sırasında hedef karakterin HUD
  kişiliği (bkz. 1.2) kademeli olarak "yüklenir": renk, tipografik doku ve
  ses imzası uçuşun son 1.5 saniyesinde harmanlanır.
- **Aynı sahne geçişi:** ortak görevlerde < 1 sn kamera kesmesi; HUD
  kişiliği tek karede değişir, senkron karar anları (LW-GDD-03, soygun
  infazı) için girdi tamponu 200 ms korunur.
- **Erişilebilirlik:** geçiş uçuşu "hızlı geçiş" anahtarıyla 1 sn'lik sade
  karartmaya indirgenebilir (hareket tutması paketi, LW-GDD-08); çark
  portreleri renk modlarında simge + isimle ayrışır.

---

## 5. İris — İmplant Menüsü

### 5.1 Ad ve kurgu

Telefon eşdeğeri kişisel katmanın önerilen adı **İris**'tir: göz implantının
vatandaşa açık kişisel arayüz kabuğu. Sokak argosunda "İris'e bakmak" =
menüsünü açmak. Ad, kanonda kullanılmayan, göz temasıyla tutarlı ve üç
karakterin farklı firmware'lerinin (bkz. 1.2) ortak çekirdeğini anlatan bir
addır (onay için bkz. Açık Sorular #1). PANOPT değildir; PANOPT'un şehir
katmanına karşılık İris kişisel katmandır — Mara'nınki korsan yamalıdır,
Kaan'ınki çoğu zaman kapalıdır, Solene'ninki gemiye bağlanır.

### 5.2 Davranış ilkeleri

- **Dünya durmaz:** İris açıkken oyun gerçek zamanda akar; karakter
  yürümeye devam edebilir (yarı saydam katman). Tek oyunculuda isteğe bağlı
  "İris'te duraklat" anahtarı vardır (bilişsel erişilebilirlik; varsayılan
  değeri Açık Sorular #2); LUMENFALL Online'da duraklatma yoktur.
- **Gecikme bütçesi:** açılış girdisi → ilk etkileşilebilir kare ≤ 150 ms;
  uygulamalar arası geçiş ≤ 100 ms (LW-GDD-07 performans bütçeleriyle
  koordineli).
- **Menü seslendirme** ve ekran okuyucu desteği tüm İris yüzeylerinde
  zorunludur (LW-GDD-08).

### 5.3 Uygulama listesi

| Uygulama | İşlev | Kaynak belge |
| --- | --- | --- |
| **Görevler** | Görev günlüğü: amaç · sonraki adım · bölge · kişiler; "Neredeydim?" özeti (3 madde + 1 cümle); kilit terim sözlüğü | LW-GDD-08, LW-GDD-11 |
| **Harita** | 3. bölümdeki 3B harita | LW-GDD-13 |
| **Piyasa** | Oyuncu güdümlü piyasa: bölge fiyat tabloları, dalgalanma grafikleri (±%4–18), Aklama Masası erişimi | LW-GDD-05, LW-GDD-03 |
| **Garaj** | Araç filosu yönetimi, çağırma, modifikasyon randevusu | Bkz. 6.2 |
| **Crew** | LUMENFALL Online soket: lobi, rol kartları, ortak kasa | Bkz. 7. bölüm |
| **Mesajlar** | NPC/iş ağı iletişimi; sözleşme teklifleri (üç karakterin ayrı ağları, LW-GDD-03) | LW-GDD-12 |
| **Radyo** | İstasyon seçimi ve DJ akışı | LW-GDD-14 |
| **Objektif** | Foto mod + tarama görünümü (hack hedefleri, kanıt inceleme) | LW-GDD-12 |
| **Rehber** | Arşivlenmiş tüm öğretim istemleri, metin + kısa klip; haptik desen sözlüğü | LW-GDD-08 |
| **Ayarlar** | Tüm ayarlar her an, her yerde — asansör kabini dahil | LW-GDD-08 |

Uygulama ızgarası 2×5; ilk 2 saatte yalnız bağlamda tanıtılan uygulamalar
görünür (bkz. 10. bölüm), geri kalanı "kilitli" değil **görünmez**dir —
boş slot kaygısı yaratılmaz.

### 5.4 Izgara Dışı durumu (Kaan)

İris kapalıyken (analog oynayış, LW-GDD-03) HUD tamamen söner ve şu analog
eşdeğerler devreye girer: cepten çıkarılan **kâğıt kroki** (son bakılan
harita görünümünün el çizimi anlık görüntüsü), kol saati (oyun saati),
şarjör elle kontrol animasyonu (mühimmat sayısı yaklaşık gösterilir:
"yarıdan az"). Bu durum bir erişilebilirlik ihlali sayılmaz çünkü tamamen
isteğe bağlıdır ve her an geri açılabilir; yine de H4/H5 eşdeğeri olarak
dünya-içi ipuçları (devriye yoğunluğu, dron sesi görselleştirici)
çalışmaya devam eder (çerçeveleme tartışması: Açık Sorular #6).

---

## 6. Envanter, Garaj ve Kıyafet Menüleri

### 6.1 Envanter

- **Model:** ızgara değil ağırlık: taban 40 kg taşıma (Sokak Bilgisi
  düğümleriyle 60 kg'a). Ganimet ağırlığı mekaniğiyle (LW-GDD-03, Kaçış)
  aynı terazide çalışır — soygunda "ne kadarını bırakıyorsun?" kararı
  envanter ekranında canlı ağırlık/hız grafiğiyle desteklenir.
- **Üç karakter üç envanter** (LW-GDD-03 geçiş kuralı); ortak depo yalnız
  güvenli evlerde ve fiziksel teslimatla (dünya tutarlılığı).
- **Hızlı erişim:** 4 hızlı slot (silah çarkı radyalinden atanır) + 3
  kayıtlı teçhizat ön ayarı (örn. "Hayalet", "Gürültülü", "Yörünge" —
  soygun vektörleriyle hizalı).
- Sıralama: tür · ağırlık · değer (LM) · yenilik; her öğe kartında ağırlık,
  değer ve "Sıcak" etiketi (aklanmamış mal) görünür.

### 6.2 Garaj

- Liste + 3B döner sahne; slotlar kanonla bire bir: taban 8, geliştirmeyle
  24; Eternal sürümde +6 Zenit rıhtımı (yalnız depolama — pay-to-win yasağı
  gereği hiçbir performans etkisi yok; etiket UI'da açıkça "Depolama"
  yazar, LW-GDD-05).
- Araç kartı: sınıf (12 sınıftan biri, LW-GDD-03) · hasar silueti (6 bölge
  + 4 sistem) · Buz Katmanı (0–5) · sigorta durumu · ısı imzası (yörünge
  sınıfı).
- Modifikasyon ekranı iki sekmeye **fiziksel olarak** ayrılır: "Mekanik"
  (yalnız LM + Ustalık) ve "Görünüm" (LM veya Prizma). Prizma simgesi
  Mekanik sekmesinde hiçbir koşulda render edilmez — pay-to-win yasağının
  arayüz düzeyindeki garantisi.

### 6.3 Kıyafet ve kılık

- Kıyafet ekranı stil (kozmetik) ve **kılık** (oynanış: Truva vektörü,
  LW-GDD-03) katmanlarını ayrı raflarda gösterir; kılık öğeleri "hangi
  bölge/fraksiyon için geçerli" etiketi taşır (örn. "Kordon servis
  personeli — Çekirdek'te geçersiz").
- Prizma mağazası ayrı uygulamadır; oynanış menülerinin içine vitrin,
  indirim sayacı veya yönlendirme yerleştirilmesi yasaktır (LW-GDD-05
  monetizasyon ilkeleri). Kumar estetiği (kasa açma animasyonu vb.)
  kullanılamaz.

---

## 7. LUMENFALL Online: Lobi ve Crew Arayüzü

### 7.1 Diegetik lobi

Online'da "lobi ekranı" yoktur; lobi, crew üssüdür (LW-GDD-10). Mod seçimi
üsteki harekât masasından ya da İris → Crew uygulamasından yapılır; eşleşme
beklenirken serbest dolaşım devam eder (kesintisiz dünya, çevrimiçi
karşılığı). Eşleşme bulununca 30 sn'lik toplanma sayacı H15 bildirimi
olarak düşer.

### 7.2 Mod arayüzleri

| Mod | Arayüz gereksinimleri |
| --- | --- |
| **Bölge Savaşları** (4v4v4, 25 dk) | Savaş penceresi sayacı · üç kontrol düğümü durumu (haraç noktası / veri santrali / kaçakçılık iskelesi) renk + doku taramasıyla (renk körlüğü kuralı) · PANOPT gürültü ölçeri (PvE tepkisini crew'a görünür kılar) |
| **Zenit Kasası** (4 kişilik PvE) | Rol kartları: Hacker · Kas · Pilot · Yüz (LW-GDD-10); kartlar basitleştirilmiş dille de sunulur (LW-GDD-08) · faz şeridi (Hazırlık → İnfaz → Kaçış) · "kim neyi taşıdı" canlı kaydı (ganimet bölüşümü sosyal; sistem yalnız kaydı gösterir) |
| **Kaçakçılık Ligi** (8 crew, 20 dk) | Teslimat sıralaması canlı tablo · yük taşıyan araçların kızıl iz göstergesi · sezon puanı ve "Karanlık Liste" (ilk 100) sıralama ekranı |
| **Serbest Dolaşım** (40 oyuncu) | "Kanun dışı" işaret sistemi (saldırılabilirlik iki taraflı işaretle) · dinamik olay duyuruları (tüm shard'a H15 bildirimi) · gezinti/ticaret/fotoğraf modu rozeti |

### 7.3 Crew yüzeyleri

- **Crew paneli:** 4 çekirdek + 4 yedek üye listesi, itibar skoru (oyuncu +
  crew), sezonluk crew pası ilerlemesi (yalnız oynanarak dolar; UI'da
  hiçbir "hızlandır" düğmesi yoktur).
- **Ortak kasa:** çekim çift onay akışıyla yapılır — talep eden + onaylayan
  ayrı oyuncular; bekleyen talepler herkese görünür (iç hırsızlığa mekanik
  fren, LW-GDD-10).
- **Sessiz İşaretler (ping çarkı):** 8 işaretlik sözsüz iletişim — hedef ·
  tehlike · buluşma · ganimet · geri çekil · beklet · benimki · teşekkür.
  Her işaret simge + renk + kısa metin + haptik desenle çiftlenir;
  konuşmadan-yazıya / yazıdan-konuşmaya köprüleriyle birlikte CVAA
  hedefini destekler (LW-GDD-08).
- Raporlama tek tuş; sesli sohbet varsayılan crew içi (LW-GDD-10, topluluk
  sağlığı) — bu ayarların tamamı oyun içinden, maç ortasında değiştirilir.

---

## 8. İkonografi ve Tipografi

### 8.1 Yazı tipleri ve ölçek

| Rol | Yazı tipi | Kural |
| --- | --- | --- |
| Gövde / HUD metni | Inter Tight | 4K'da ≥ 28 px eşdeğeri; %200'e kadar büyütülebilir (LW-GDD-08) |
| Dekoratif başlık | Orbitron | Yalnız başlıklar ve diegetik tabelalar; asla kritik bilgi taşımaz |
| Disleksi dostu alternatif | Tek anahtarla tüm arayüz | Orbitron dahil tüm dekoratif kullanım gövde tipine döner |

Tip ölçeği (4K referans, oransal ölçeklenir): H1 72 · H2 56 · H3 44 ·
gövde 32 · ikincil 28 (taban) · rakamsal HUD 36 tabular. Altyazı ölçeği
LW-GDD-08 Altyazı Standartları'na tabidir (32/46/58/72, varsayılan 46).

### 8.2 İkon sistemi

- **Izgara:** 24 px tuval, 2 px kontur, köşe yarıçapı 2 px; kullanım
  boyutları 24/32/48. Doldurulmuş varyant yalnız "aktif durum" anlamı taşır.
- **Anlam + biçim kuralı:** 12 anlam kanalının (düşman, müttefik, crew,
  etkileşim, tehlike, iyileştirme vb.; LW-GDD-08) her biri benzersiz
  **siluet** taşır — renk değişse de biçim ayırt eder.
- **Para birimleri:** Lümen simgesi içi boş altıgen (◇ benzeri, lümen/ışık
  hücresi), Prizma simgesi dolu üçgen prizma. İki simge hiçbir ekranda yan
  yana aynı satırda kullanılamaz; her fiyat etiketi simge + metin ("LM" /
  "Prizma") çifti taşır — para birimi karışıklığı, monetizasyon güveninin
  UI riskidir.
- Tüm ikonlar ilk 3 kullanımda metin etiketiyle birlikte görünür; etiket
  kalıcı da yapılabilir (bilişsel erişilebilirlik ayarı).
- **Kontrast:** tüm HUD/menü metinlerinde ≥ 4.5:1; yüksek kontrast modunda
  ≥ 7:1; menüler WCAG 2.2 AA hedefine tabidir (LW-GDD-08).

---

## 9. Onboarding — İlk 2 Saat

### 9.1 İlke: eğitim ekranı yok, bağlam içinde öğretim

Hiçbir sistem modal eğitim ekranıyla öğretilmez. Her mekanik, ilk kez ona
ihtiyaç duyulan sahnede, tek satırlık istem + dünya içi durumla öğretilir
(LW-GDD-19 açılış senaryosuyla ortak tasarlanır). Kurallar:

1. Aynı anda ekranda **en fazla 1 öğretim istemi** bulunur.
2. Her istem, gösterildiği anda İris → Rehber'e arşivlenir (metin + kısa
   klip, LW-GDD-08); istemler yeniden izlenebilir.
3. Oyuncu istemi 2 kez yok sayarsa sistem ısrar etmez; mekanik ilk doğal
   tekrarında bir kez daha önerilir.
4. Okuma hızı ayarları (otomatik ilerleme kapatma, 2× süre, sınırsız)
   öğretim istemlerine de uygulanır.
5. Erişilebilirlik sihirbazı (≤ 90 sn) her şeyden — logo ve ara sahneden —
   önce gelir (LW-GDD-08 İlke 4).

### 9.2 İlk 2 saatin öğretim sıralaması

| Dakika | Sistem | Bağlam (LW-GDD-19 ile hizalı) | Başarı ölçütü |
| --- | --- | --- | --- |
| 0–3 | Erişilebilirlik sihirbazı | Oyun öncesi | Tamamlama ≤ 90 sn, terk < %2 |
| 3–20 | Hareket, kamera, etkileşim, temel çatışma | Üç protagonist tanıtım vinyeti (LW-GDD-19) | Girdi başına ≤ 1 istem; ölüm hedefi < 0.3/oyuncu |
| 20–30 | Bakış Göstergesi + Kayıt piktogramı + İlgi durumu | İlk küçük ihlal; 90 sn temiz davranış çözülmesi bizzat yaşatılır | Oyuncuların ≥ %85'i İlgi'yi kendi başına çözer |
| 30–45 | Sürüş + mini harita + GPS şeridi | İlk kaçış sekansı | Rota tamamlama ≥ %90 |
| 45–60 | İris çekirdeği: Görevler + Harita + Mesajlar | İlk sözleşme teklifi | Uygulama bulma ≤ 8 sn |
| 60–75 | Odak Kayması (serbest geçiş) | İlk çok karakterli sahne sonrası şehir serbest kalır | Oyuncuların ≥ %90'ı 2. saate dek ≥ 3 geçiş yapar |
| 75–90 | Piyasa + Sıcak Para + Aklama Masası | İlk kirli kazanç eldeyken | "Sıcak Para nedir?" anketinde doğru cevap ≥ %80 |
| 90–105 | Siber müdahale K1 / yakın dövüş / kılık (karaktere göre dal) | Karakterin alemine uygun ilk yan iş | Dal başına tek istem |
| 105–120 | Garaj + kişisel işaretçi + Gerilim Endeksi banner'ı | İlk araç sahipliği; komşu bölgeye ilk geçiş | 2. saat sonunda envanter/harita/görev ekranlarının üçü de en az 1 kez açılmış |

Soygun planlama arayüzü (LW-GDD-03) bilinçli olarak ilk 2 saatin
**dışındadır**; ilk soygun 3–4. saatte kendi bağlam içi öğretimiyle gelir.

---

## 10. UX Metrikleri ve Kullanılabilirlik Test Planı

### 10.1 Bağlayıcı metrikler

| Metrik | Hedef | Ölçüm |
| --- | --- | --- |
| İris açılış gecikmesi | ≤ 150 ms | Otomatik performans testi (LW-GDD-07) |
| Uygulamalar arası geçiş | ≤ 100 ms | Otomatik |
| Harita katman değiştirme | ≤ 2 girdi | Sezgisel denetim + telemetri |
| İris'te hedef uygulamayı bulma | ≤ 8 sn (yeni oyuncu) | Kullanılabilirlik testi |
| HUD okunabilirliği | 3 m TV mesafesinde tüm kritik bileşenler okunur (%100 ölçek) | Laboratuvar + uzman denetimi |
| Onboarding istem yok sayma sonrası kafa karışıklığı bildirimi | < %10 | FTUE anketi |
| İlk 2 saat terk oranı (UI kaynaklı) | < %5 | Telemetri + çıkış anketi |
| "Sistem beni tanıyor" cümlesi (10. saat) | ≥ %80 · "adaletsiz" %0 | LW-GDD-03 korkuluğu; H4/H5 tasarımının başarı ölçüsü |
| Ekran işaretçi bütçesi ihlali | 0 (derleme testi) | Otomatik |
| Menü seslendirme kapsamı | %100 İris yüzeyi | Erişilebilirlik denetimi (LW-GDD-08) |
| Para birimi karışıklığı (LM/Prizma) | Testlerde 0 vaka | Kullanılabilirlik testi |

### 10.2 Test planı

1. **Haftalık RITE turları:** 8 katılımcı, tek akış odaklı (örn. yalnız
   harita); bulgular 48 saat içinde prototipe işlenir, ertesi hafta yeniden
   test edilir.
2. **Milestone benchmark'ları:** 24 katılımcı, karma örneklem; ilk 2 saat
   akışı baştan sona; görev başarı oranı, süre, hata ve öznel yük (NASA-TLX)
   ölçülür.
3. **Erişilebilirlik oturumları:** her büyük testte görme/işitme/motor/
   bilişsel çeşitlilikten ayrılmış oturumlar; Bulut sürümünde gecikme
   altında HUD doğrulaması (LW-GDD-08 test süreciyle ortak takvim).
4. **Telemetri:** menü ısı haritaları, ayar kullanım oranları (anonim),
   işaretçi yoğunluğu, HUD ön ayar dağılımı; her 12 haftalık sezonda UI
   iyileştirme maddesi yol haritasına eklenir (LW-GDD-06 ile ortak).
5. **Tasarım kapısı:** yeni her arayüz özelliği, Erişilebilirlik Etki
   Kontrol Listesi (LW-GDD-08) + bu belgenin işaretçi/istem bütçelerine
   uygunluk kontrolü olmadan içeriğe alınmaz.

---

## 11. LW-GDD-08 Gereksinimlerinin Arayüz Karşılıkları

| LW-GDD-08 gereksinimi | Bu belgedeki karşılık |
| --- | --- |
| HUD ölçeği %50–200, öğe bazında | Tüm H1–H15 bileşenleri bağımsız ölçek/konum/gizleme taşır (2.1) |
| HUD ön ayarları Tam/Dinamik/Minimal/Sinematik | Bileşen bazlı eşleme tablosu (2.2) |
| Renk asla tek kanal değil | H4 çerçeve deseni, 12 anlam kanalı siluet kuralı (8.2), kontrol düğümü doku taraması (7.2) |
| Yüksek kontrast ≥ 7:1 | Tip ve ikon sisteminde bağlayıcı eşik (8.2) |
| Menü seslendirme + ekran okuyucu | Tüm İris yüzeylerinde zorunlu (5.2), kapsam metriği %100 (10.1) |
| Ses görselleştirici | H14; hasar yönü göstergesiyle ayrı yarıçap (2.1) |
| Haptik ipucu katmanı | Sessiz İşaretler dahil tüm uyarılarda simge+metin+haptik çifti (7.3); desen sözlüğü Rehber'de (5.3) |
| Radyal menüler tek girdiyle | Odak Kayması çarkı ve silah çarkı (4, 6.1) |
| "Neredeydim?" özeti, hatırlatıcı sıklığı | Görevler uygulaması (5.3); sıklık Kapalı/İstekte/2–10 dk |
| Yer imi modu | 3.2; simge yapılar LW-GDD-01'den |
| Okuma hızı ayarları | Öğretim istemleri dahil tüm zamanlı kutular (9.1) |
| Altyazı standartları | H13 alanı LW-GDD-08 tablosuna tabi (2.1, 8.1) |
| Ayarlar her an değiştirilebilir | Ayarlar uygulaması her bağlamda açılır (5.3) |
| Fotosensitivite | HUD bozulma efektlerine 3 flaş/sn tavanı + derleme testi (1.1) |

---

## 12. Açık Sorular

1. **İris adı:** Kişisel implant katmanı için "İris" öneriyoruz;
   alternatifler "Şakak" ve "Üçüncü Göz". Anlatı ekibi ve yerelleştirme
   (12 dil, LW-GDD-14) açısından onay bekliyor — özellikle İris'in kadın
   adı olarak okunma riski değerlendirilmeli mi?
2. **İris'te duraklatma varsayılanı:** Tek oyunculuda "İris açıkken dünya
   duraklasın" seçeneği varsayılan açık mı, kapalı mı olmalı? Kesintisiz
   dünya fantezisi kapalıdan yana, bilişsel erişilebilirlik ve konfor
   açıktan yana; sihirbazda soru olarak mı sunulsun?
3. **Sessiz İzleme'nin görünmezliği:** LW-GDD-03 kasıtlı belirsizlik ister;
   bilişsel erişilebilirlik tarafında ise "sistem beni izliyor mu?"
   kaygısı yük yaratabilir. Opsiyonel bir "Sessiz İzleme göstergesi" PANOPT
   baskısı zorluk eksenine mi bağlansın, yoksa tema pahasına hiç mi
   sunulmasın?
4. **Mini harita vs. pusula şeridi:** Varsayılan H6 mini harita mı, üst
   kenarda pusula şeridi mi olmalı? Pusula, dikey katmanlı şehirde yükseklik
   bilgisi taşıyamıyor; mini harita ise bakış süresini ekrana çekiyor. İlk
   playtest verisiyle karar önerilecek — direktörlük hangi metriği birincil
   sayar: yol bulma başarısı mı, ekrandan koparmama mı?
5. **Online işaretçi bütçesi:** 40 kişilik Serbest Dolaşım'da ekran
   işaretçi tavanı 5'in yeterliliği belirsiz; dinamik olay + crew + kanun
   dışı işaretleri çakıştığında öncelik sırası (3.3) yeterli mi, Online'a
   özel ayrı bütçe mi tanımlanmalı?
6. **Izgara Dışı ve erişilebilirlik çerçevesi:** Kaan'ın İris-kapalı
   oynayışı HUD'suz oyunu bir güç fantezisi olarak sunuyor; işitme engelli
   bir oyuncu için dünya-içi ipuçlarının tek başına yeterliliği hangi test
   protokolüyle doğrulanacak — LW-GDD-08 katılımcı testlerine özel bir
   Izgara Dışı senaryosu eklenmeli mi?

---

## Sürüm Geçmişi

| Sürüm | Tarih | Yazar | Değişiklik |
| --- | --- | --- | --- |
| 1.0 | 5 Temmuz 2026 | UI/UX Lideri | İlk sürüm |

---

## Kurgusallık Notu

*Bu doküman bir konsept çalışmasıdır. LUMENFALL, Lumenworks Studios,
Duskforge Engine ve burada geçen tüm kişi, kurum, ürün ve olaylar tamamen
kurgusaldır; gerçek kişi, kurum veya ürünlerle benzerlikler tesadüfidir.
Belirtilen fiyatlar, tarihler ve teknik hedefler herhangi bir ticari taahhüt
oluşturmaz (bkz. `README.md` — Kurgusallık Notu).*
