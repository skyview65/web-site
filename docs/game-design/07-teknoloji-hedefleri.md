# LUMENFALL — Teknoloji Hedefleri (Duskforge Engine)

> **"Karanlık parlar."**

| Alan | Değer |
| --- | --- |
| **Belge No** | LW-GDD-07 |
| **Sürüm** | 1.0 |
| **Tarih** | 3 Temmuz 2026 |
| **Sahip** | Lumenworks Tasarım Ekibi |
| **Durum** | İnceleme |
| **Gizlilik** | Stüdyo İçi — Dağıtım Onaya Tabidir |

Bu belge, **LUMENFALL**'un 2027 çıkış penceresi için bağlayıcı teknoloji
hedeflerini, performans bütçelerini ve kalite kapılarını tanımlar. Kapsam:
**Duskforge Engine** render ve simülasyon hedefleri, 310 km² + yörünge katmanı
için streaming mimarisi, 1.2M simüle vatandaşın AI/LOD mimarisi, LUMENFALL
Online ağ altyapısı, platform spesifikasyonları (PC · 9. nesil konsollar ·
Bulut), üretim pipeline'ı ve sertifikasyon süreci.

Bu belgedeki tüm sayısal bütçeler **mühendislik taahhüdüdür**; aşımlar değişiklik
kontrol süreci olmadan kabul edilmez. Simülasyon tarafındaki tasarım gereksinimleri
(kalıcı kimlik/rutin/hafıza, dinamik olaylar) için tek doğruluk kaynağı
`04-acik-dunya-simulasyonu.md` (LW-GDD-04) belgesidir; bu belge o gereksinimlerin
**nasıl** karşılanacağını tanımlar.

**İlgili belgeler:** `03-oynanis-sistemleri.md` (PANOPT uyarlanabilir aranma
sistemi) · `04-acik-dunya-simulasyonu.md` (dünya ve vatandaş simülasyonu) ·
`05-ekonomi-ve-monetizasyon.md` (Lümen/Prizma sunucu doğrulaması) ·
`06-canli-servis-ve-uzun-omur.md` (sezon dağıtım takvimi) ·
`08-erisilebilirlik.md` (erişilebilirlik kalite kapısı).

## Duskforge Engine: Motor ve Render Hedefleri

Duskforge Engine, Lumenworks Studios'un şirket içi motorudur ve LUMENFALL'un
üç temel teknik gereksinimi etrafında tasarlanmıştır: **tam gece şehri
aydınlatan hibrit ışın izleme**, **%100 kesintisiz dünya** ve **1.2M ajanlık
kalıcı simülasyon**. Motor beş ana alt sistemden oluşur:

| Alt sistem | Kod adı | Sorumluluk |
| --- | --- | --- |
| Render | **Raylight** | Hibrit ışın izleme, ışık ve materyal pipeline'ı |
| Dünya akışı | **Riverbed** | Sektör/karo streaming, LOD, I/O planlayıcı |
| Kalabalık ve AI | **Murmur** | Vatandaş LOD mimarisi, davranış çalıştırıcı |
| Kalıcılık | **Ledger** | Kimlik/rutin/hafıza kayıtları, dünya durumu |
| Ağ | **Meridian** | Bölge shard'ları, replikasyon, rollback çekirdeği |

### Işın izleme (Raylight)

LUMENFALL'un görsel kimliği — vantablack zemin üzerinde camgöbeği, macenta ve
amber neon — **rasterizasyonla taklit edilemez**; ıslak asfalt yansımaları ve
emisif ışık taşması oyunun ana ışık kaynağıdır. Bu nedenle ışın izleme bir
"ekstra" değil, **temel render yoludur**:

- **RT yansıma:** tüm platformlarda açık (konsol Performans modunda ½ çözünürlük,
  maks. 2 sıçrama). Sisaltı su yüzeyi ve Neon Liman cam cepheleri birincil kullanım
  alanlarıdır.
- **RT global aydınlatma:** ekran probu tabanlı, saniyede tam güncellenen dinamik
  GI. Konsol Kalite modu ve PC'de açık; Performans modunda seyrekleştirilmiş prob
  ızgarasına düşer.
- **RT gölge:** yalnız kahraman ışıkları ve araç farları için; kalan gölgeler
  sanal gölge haritası (VSM).
- **BVH bütçesi:** sahne başına ≤ 1,2 GB ivme yapısı; Riverbed streaming'i ile
  sektör bazında yeniden inşa (≤ 2 ms/kare asenkron).

### Çözünürlük ve kare hızı hedefleri (platform tablosu)

Amiral hedef: **4K/60** — 9. nesil konsollarda Performans modu, PC önerilen
konfigürasyonda varsayılan. Tüm modlarda dinamik çözünürlük + **DF-TSR**
(Duskforge zamansal süper örnekleyici) kullanılır; PC'de DLSS/FSR/XeSS de
desteklenir.

| Platform / Mod | İç çözünürlük | Çıkış | Kare hızı | Işın izleme seti |
| --- | --- | --- | --- | --- |
| PC — Ultra | Yerel 4K (TSR kalite) | 4K | 60+ | GI + yansıma + gölge (tam) |
| PC — Önerilen | 1440p → 4K | 4K | 60 | GI + yansıma |
| PC — Minimum | 1080p | 1080p | 30 | Yansıma (½ çözünürlük) |
| Konsol — Kalite | Dinamik 1800p–2160p | 4K | 30 | GI + yansıma + gölge |
| Konsol — Performans | Dinamik 1440p–1800p | 4K | **60** | Yansıma (½) + seyrek GI |
| Konsol — Yüksek Kare (VRR) | Dinamik 1080p–1440p | 4K | 40–120 (VRR) | Yansıma (½) |
| Bulut | Sunucuda 4K/60 render | 1080p60 / 4K30 akış | 60 / 30 | Kalite moduyla aynı |

### Kare süresi bütçesi (60 fps hedefi, 16,6 ms)

| Bileşen | GPU (ms) | CPU (ms, iş parçacığı havuzu) |
| --- | --- | --- |
| Geometri + gölge geçişleri | 3,4 | 2,0 (komut üretimi) |
| Raylight (GI + yansıma) | 5,8 | 0,8 (BVH güncelleme sevki) |
| Işıklandırma + hacimsel sis | 2,6 | — |
| Post-process + DF-TSR | 2,2 | — |
| UI + PANOPT tarama katmanı | 0,6 | 0,4 |
| Murmur (AI/kalabalık) | 0,4 (GPU skinning) | 4,0 |
| Riverbed (streaming/decompress) | 0,4 | 2,0 (asenkron çekirdekler) |
| Fizik + araç simülasyonu | — | 3,0 |
| Yedek pay (spike toleransı) | 1,2 | 1,0 |
| **Toplam** | **16,6** | **13,2 / kare** |

30 fps modlarında bütçeler ×2 ölçeklenir; Raylight payı 11 ms'ye çıkar (tam GI).
Bütçe aşımı iki sprint üst üste ölçülürse ilgili özellik **otomatik olarak
optimizasyon kuyruğuna** girer (bkz. Sertifikasyon ve Kalite Kapıları).

### Bellek bütçesi (konsol, ~13,5 GB kullanılabilir)

| Havuz | Bütçe |
| --- | --- |
| Riverbed streaming havuzu (doku + geometri) | 6,0 GB |
| Raylight BVH + RT kaynakları | 1,2 GB |
| Murmur/Ledger (aktif ajanlar + önbellek) | 1,6 GB |
| Ses (yayın + rezidan bankalar) | 0,9 GB |
| Animasyon + fizik | 1,0 GB |
| Render hedefleri + TSR geçmişi | 1,8 GB |
| Sistem/kod/yedek | 1,0 GB |

## Dünya Streaming Mimarisi

Kanon gereksinimi kesindir: **310 km² şehir + yörünge katmanı, %100 kesintisiz,
yükleme ekranı yok** — sokaktan yörünge asansörüne, oradan Zenit Halkası'na tek
kesintisiz akış. Riverbed bu gereksinimi üç katmanlı bir ızgarayla karşılar:

- **Sektör (1 × 1 km):** 310 kara sektörü + 14 yörünge sektörü (asansör gövdesi
  ve Zenit Halkası segmentleri). Bölge sınırları (9 bölge) sektör gruplarına
  hizalıdır; bölgeye özgü materyal/ses bankaları sektör meta verisinde taşınır.
- **Karo (256 × 256 m):** streaming'in atomik birimi; geometri, doku, çarpışma
  ve Ledger yerel durumu tek paket halinde yüklenir. Karo paketi hedefi ≤ 96 MB
  (sıkıştırılmış), Çekirdek gibi yoğun bölgelerde üst sınır 128 MB.
- **Küme:** karo içi nesne grupları; ince taneli boşaltma için.

### LOD halkaları ve I/O bütçesi

| Halka | Yarıçap | İçerik | Güncelleme |
| --- | --- | --- | --- |
| R0 | 0–300 m | Tam geometri, tam çarpışma, LOD0–1 vatandaş | Her kare |
| R1 | 300 m–1,2 km | Orta LOD, basit çarpışma, LOD2 vatandaş | 10 Hz |
| R2 | 1,2–4 km | Uzak LOD, trafik akış temsili | 1 Hz |
| R3 | 4 km–ufuk | İmpostor + siluet kartları, ışık noktası alanları | Statik/olay bazlı |

- **I/O bütçesi:** sürekli 600 MB/s, tepe 2,4 GB/s (yüksek hızlı araç/uçuş).
  Bu nedenle **NVMe SSD tüm platformlarda zorunludur** (PC minimum: ≥ 2,5 GB/s).
- **Hız sözleşmesi:** streaming, 320 km/s yatay (araç) ve 900 km/s dikey
  (asansör kabini, mekik) hıza kadar R0 doluluk garantisi verir. Solene'in
  Kara Leylek'i gibi yörünge mekikleri için R2/R3 hacimsel şehir temsiline
  geçilir; iniş vektörüne göre hedef sektörler 45 s önceden ısıtılır.
- **Sokak → yörünge koridoru:** Yükseliş tabanındaki asansör yolculuğu (~3 dk
  gerçek zaman) bir "streaming koridoru" olarak modellenir: kara sektörleri
  kademeli boşaltılırken yörünge sektörleri yüklenir; kabin penceresinden şehir
  R3 temsiliyle kesintisiz görünür kalır. Bellek çift-doluluk tepesi ≤ 1,8 GB.
- **Sisaltı:** su hacmi ayrı bir katman değil, karo paketinin parçasıdır;
  su altı/üstü geçişte yükleme yoktur, yalnız render yolu değişir.
- **Yükleme ekranı yok — istisnasız:** hızlı seyahat (yeraltı ekspresi/mekik),
  ölüm/yeniden doğma ve görev geçişleri diegetik ara sahnelerle maskelenir;
  maskeleme süresi ≤ 8 s ve bu süre bir kalite kapısı metriğidir. Tek yükleme
  ekranı soğuk açılıştır (hedef ≤ 25 s, bkz. kalite kapıları).

Dünya durumunun (dinamik olaylar, bölge kontrolü, vatandaş kayıtları)
kalıcılık şeması `04-acik-dunya-simulasyonu.md`'de tanımlanır; Riverbed bu
durumu karo paketleriyle birlikte Ledger'dan akıtır.

## AI/NPC Teknolojisi

### Davranış sistemi (Murmur)

- **Karar mimarisi:** HTN planlayıcı (uzun vadeli rutin: işe git, yemek, uyku)
  + yardımcı-fayda (utility) katmanı (anlık tepki: tehdit, merak, kaçış).
  LOD0 ajanlarında tam yığın çalışır; alt LOD'larda yalnız HTN rutin takibi.
- **PANOPT uyarlanabilir aranma sistemi:** `03-oynanis-sistemleri.md`'de
  tanımlanan "öğrenen" takip, sunucu/istemci tarafında **sınırlı ve
  denetlenebilir** bir oyuncu-profil vektörüyle (kaçış rotaları, silah tercihi,
  bölge alışkanlıkları; 64 boyut, yerel olarak saklanır) çalışır. Çevrimiçi
  modda vektör sunucuda tutulur ve sezon sonunda sıfırlanır. Çalışma bütçesi:
  0,3 ms/kare.
- **Fraksiyon ve trafik:** araç trafiği (200+ araç tipi) akış-alanı (flow field)
  ile LOD2'de temsil edilir; R0'a giren araçlar tam fizik ajanına terfi eder.

### 1.2M vatandaş LOD mimarisi

Kanon: **1.2M simüle vatandaş, kalıcı kimlik/rutin/hafıza**. Hiçbir vatandaş
"spawn edilip atılmaz"; herkes Ledger'da kalıcı bir kayıttır ve LOD yalnız
**simülasyon çözünürlüğünü** değiştirir, kimliği değil.

| LOD | Ad | Eşzamanlı ajan | Simülasyon | Tick |
| --- | --- | --- | --- | --- |
| LOD0 | Sahne | ≤ 320 | Tam animasyon, tam davranış yığını, diyalog | 30 Hz |
| LOD1 | Yakın çevre | ≤ 2.000 | Basitleştirilmiş hareket, olay tepkisi | 10 Hz |
| LOD2 | Bölge | ≤ 48.000 | Rutin takibi, ızgara hareketi, ekonomi katılımı | 1 Hz |
| LOD3 | Şehir | ~1,15M | Takvimsel ajan: konum/rutin/hafıza yalnız kayıtta ilerler | Olay bazlı + 5 dk toplu |

- **Terfi/tenzil determinizmi:** LOD3'teki bir vatandaş R0'a girdiğinde, Ledger
  kaydından (kimlik, rutin fazı, son hafıza girdileri) **deterministik** olarak
  somutlaştırılır — oyuncu dün Gölgepazar'da gördüğü satıcıyı bugün aynı
  tezgâhta, dünkü olayı hatırlar halde bulur. Somutlaştırma bütçesi ≤ 0,2 ms/ajan,
  kare başına ≤ 24 ajan.
- **Hafıza sistemi (Ledger):** vatandaş başına 64 girdilik halka tampon;
  girdi = (olay tipi, konum, aktör, duygu değeri, zaman damgası), belirginlik
  (salience) azalımıyla eskiyen girdiler düşer. Kayıt boyutu ≤ 2 KB/vatandaş →
  şehir toplamı ~2,4 GB, disk tabanlı, sıcak önbellek 256 MB. Deniz'in
  PANOPT hafıza bankalarından silinmesi gibi anlatı olayları, Ledger'da
  **kırmızı-kayıt** (değiştirilemez anlatı bayrağı) olarak işaretlenir ve
  simülasyon tarafından üzerine yazılamaz.
- **Bütçe:** Murmur toplam CPU payı 4,0 ms/kare (bkz. kare bütçesi); LOD3 toplu
  güncellemesi ayrı düşük öncelikli çekirdekte, kare bütçesi dışında koşar.
- Rutin şablonları, meslek dağılımları ve dinamik olay üreticisi tasarımı için
  bkz. `04-acik-dunya-simulasyonu.md`.

## Ağ Mimarisi

LUMENFALL Online (bkz. `06-canli-servis-ve-uzun-omur.md`) Meridian üzerinde
koşar. Tasarım hedefleri: **bölge shard'ları ile şehir ölçeğinde eşzamanlılık**,
**çatışmada rollback hissi** ve **çapraz platform + çapraz ilerleme**.

### Bölge shard mimarisi

- **Şehir örneği:** 128 oyunculuk bir mega-oturum; 9 bölgenin her biri kendi
  **bölge shard'ı** (ayrı simülasyon süreci) olarak koşar ve örneğe bağlanır.
  Yörünge katmanı 10. shard'dır.
- **Sorunsuz devir (handoff):** oyuncu bölge sınırını geçtiğinde shard devri
  ≤ 250 ms'de, oyuncuya görünmeden tamamlanır — kesintisiz dünya ilkesi ağda da
  geçerlidir. Devir sırasında girdi istemci tahminiyle köprülenir.
- **Bölge savaşları:** haftalık kontrol değişimi, shard durumunun Ledger'a
  saatlik anlık görüntüsüyle (snapshot) kalıcılaştırılır; hafta kapanışı
  deterministik bir uzlaşma işiyle hesaplanır.
- **Crew:** 4 kişilik ekipler her zaman aynı shard'a yerleştirilir; paylaşımlı
  üs ve ortak kasa, sunucu-otoriter Ledger nesneleridir.

### Simülasyon ve rollback

| Bağlam | Model | Tick | Gecikme telafisi |
| --- | --- | --- | --- |
| Açık dünya (serbest dolaşım) | Sunucu-otoriter + istemci tahmini | 30 Hz | Enterpolasyon 100 ms |
| Çatışma (PvP/PvE yakın menzil) | **Rollback çekirdeği** | 60 Hz | 7 karelik (≈117 ms) geri sarma penceresi |
| Soygunlar (örn. Zenit Kasası) | Kilitli 4 kişilik oda, rollback + sunucu doğrulama | 60 Hz | 7 kare |
| Araç yarışları | Deterministik fizik + rollback | 60 Hz | 5 kare |

- Rollback çekirdeği için çatışma simülasyonu **deterministik** yazılır
  (sabit-nokta fizik alt kümesi); görsel katman geri sarmadan etkilenmez.
- **Hile ve ekonomi güvenliği:** tüm Lümen/Prizma işlemleri sunucu tarafında
  doğrulanır; istemciye asla fiyat/stok otoritesi verilmez
  (bkz. `05-ekonomi-ve-monetizasyon.md`, pay-to-win yasağı). Çekirdek düzeyinde
  hile koruması PC'de zorunlu, konsolda platform servisiyle bütünleşiktir.
- **Çapraz platform/ilerleme:** platformdan bağımsız Lumenworks hesabı; Ledger
  oyuncu profili bölgeler arası çoğaltılır (hedef RPO ≤ 60 s). Sezonluk içerik
  bayrakları sunucudan itilir; istemci yaması gerektirmeyen etkinlik değişimleri
  desteklenir (12 haftalık sezon ritmi için zorunlu).
- **Ağ bütçesi:** oyuncu başına aşağı bant ≤ 256 kbps ortalama / 512 kbps tepe;
  vatandaş kalabalığı ağdan replike edilmez, tohum + Ledger deltasıyla yerel
  üretilir (tüm istemcilerde aynı sokak, aynı kalabalık).

## Platform Spesifikasyonları

Hedef platformlar (kanon): **PC · 9. nesil konsollar · Bulut**. Konsol
profilleri yukarıdaki mod tablosunda tanımlıdır; bulut istemcisi, konsol Kalite
profilinin sunucu tarafı derlemesidir.

### PC gereksinimleri

| Bileşen | Minimum (1080p/30, Düşük, RT yansıma ½) | Önerilen (4K/60, Yüksek, RT GI + yansıma) |
| --- | --- | --- |
| İşletim sistemi | Windows 10 64-bit (21H2+) | Windows 11 64-bit |
| İşlemci | AMD Ryzen 5 3600 / Intel Core i5-10400F | AMD Ryzen 7 5800X3D / Intel Core i5-13600K |
| Bellek | 16 GB (çift kanal) | 32 GB (çift kanal) |
| Ekran kartı | GeForce RTX 3060 8 GB / Radeon RX 6600 XT | GeForce RTX 4070 Super / Radeon RX 7800 XT |
| VRAM | 8 GB | 12 GB+ |
| API | DirectX 12 Ultimate (donanım RT zorunlu) | DirectX 12 Ultimate |
| Depolama | **NVMe SSD zorunlu**, ≥ 2,5 GB/s, 170 GB | NVMe SSD, ≥ 5 GB/s, 170 GB |
| Ağ (Online) | 10 Mbps, ≤ 150 ms RTT | 25 Mbps, ≤ 80 ms RTT |

- Sabit disk (HDD) **desteklenmez**; Riverbed I/O sözleşmesi sağlanamaz.
- Ultra ön ayar (yerel 4K, tam RT seti) RTX 4080 / RX 7900 XTX ve üzeri
  donanımı hedefler; VRAM gereksinimi 16 GB.
- Kurulum boyutu hedefi ≤ 170 GB (diller seçmeli, yüksek çözünürlüklü doku
  paketi isteğe bağlı +30 GB).

### Konsol ve bulut notları

- 9. nesil konsollarda tüm SKU'lar üç görüntü modunu (Kalite / Performans /
  Yüksek Kare-VRR) ve 4K/60 amiral hedefini karşılamak zorundadır.
- Bulut sürümü, veri merkezi GPU profilinde Kalite moduyla eşdeğer görsel set
  sunar; giriş gecikmesi bütçesi uçtan uca ≤ 140 ms.
- Çapraz ilerleme üç platformda da birinci sınıf gereksinimdir; platforma özel
  kayıt biçimi yasaktır (tek Ledger şeması).

## Araç ve Pipeline

### Duskforge Anvil (editör ve dünya araçları)

- **Anvil World:** 310 km²'nin tamamı tek editör oturumunda açılır (editör de
  Riverbed ile akar). Bölge bazlı çalışma kilitleri; 9 bölge, 9 paralel içerik
  ekibi varsayımıyla tasarlanmıştır.
- **Canlı düzenleme:** materyal, ışık, Murmur davranış grafiği ve görev betiği
  değişiklikleri çalışan oyuna sıcak yüklenir (hedef ≤ 3 s); konsol devkit'e
  ağ üzerinden anında itilir.
- **Ledger Inspector:** herhangi bir vatandaşın kimlik/rutin/hafıza kaydını
  canlı izleme, geriye dönük olay izi ve "neden bunu yaptı?" karar dökümü.
- **Murmur Viz:** bölge başına kalabalık yoğunluğu, LOD dağılımı ve bütçe
  ısı haritaları; 1.2M ajanlık şehir görünümü tek ekranda.
- **Prosedürel + elle:** bina cepheleri, neon tabelalar ve iç mekân doldurma
  prosedürel üretilir, sanat ekibi sonucu elle geçersiz kılabilir (override
  kalıcıdır ve yeniden üretimde korunur).

### Derleme, sürümleme ve test altyapısı

- **Sürüm kontrolü:** merkezî depo + ikili varlık kilitleme; sanatçı iş akışı
  kilit-değiştir-gönder, kod iş akışı inceleme zorunlu.
- **Derleme bütçeleri:** tam kod derlemesi ≤ 45 dk (dağıtık derleme çiftliği),
  artımlı ≤ 90 s; tam içerik pişirme (tüm platformlar) ≤ 6 sa, karo bazlı
  artımlı pişirme ≤ 10 dk. Gece derlemesi her sabah 06:00'da oynanabilir olmak
  zorundadır ("yeşil sabah" ilkesi).
- **Otomatik test:** her gece 9 bölgede bot konvoyu (sürüş + uçuş + asansör
  turu) telemetri toplar: %99'luk kare süresi, streaming ıskaları, bellek
  tepe değerleri, çökme imzaları. Eşik aşımı sabah otomatik hata kaydı açar.
- **Telemetri:** dahili oturumlarda kare süresi, I/O, Murmur bütçesi ve devir
  süreleri sürekli örneklenir; performans regresyonları commit'e kadar geri
  izlenebilir.

## Sertifikasyon ve Kalite Kapıları

### Dahili kalite kapıları (aşama çıkış kriterleri)

| Kapı | Tarih hedefi | Zorunlu kriterler (özet) |
| --- | --- | --- |
| First Playable | Geçildi | Çekirdek dolaşım + 1 bölge, streaming kanıtı |
| Vertical Slice | Geçildi | Sokak→yörünge kesintisiz demo, 3 protagonist geçişi |
| Alpha | 2026 Q4 | Tüm sistemler içerde; %99 kare süresi ≤ bütçe +%20; çökme MTBF ≥ 8 sa |
| Beta | 2027 (çıkış −6 ay) | İçerik tam; %99 kare süresi ≤ bütçe +%10; MTBF ≥ 24 sa; bellek sızıntısı ≤ 4 MB/sa |
| Gold | 2027 (çıkış −2 ay) | %99 kare süresi ≤ bütçe; MTBF ≥ 40 sa; sızıntı ≤ 1 MB/sa; soğuk açılış ≤ 25 s |

Her kapı, üç platformda da ölçülür; tek platformda kalan aşım kapıyı bloke
eder. Kare bütçesi aşımı iki sprint sürerse özellik dondurulur ve optimizasyon
kuyruğu önceliklenir (bkz. render bölümü).

### Zorunlu metrik sözleşmeleri

- **Yükleme ekranı yok:** oyun içi hiçbir akışta 8 s'den uzun etkileşimsiz
  maskeleme olamaz; ihlal, sürüm engelleyici (ship-blocker) sınıfındadır.
- **Streaming ıskası:** R0 halkasında görünür LOD patlaması oturum başına
  ≤ 1; ıska anında telemetriye düşer.
- **Devir süresi:** Online bölge shard devri %95'lik dilimde ≤ 250 ms.
- **Erişilebilirlik kapısı:** `08-erisilebilirlik.md`'deki A-seviyesi
  gereksinimlerin tamamı Beta kapısında karşılanmış olmalıdır; erişilebilirlik
  hataları Gold'da "düzeltilmeden gönderilemez" sınıfındadır.
- **Ekonomi bütünlüğü:** Prizma/Lümen işlem yolunda istemci otoritesi tespiti
  otomatik sürüm engelleyicidir (pay-to-win yasağının teknik teminatı).

### Platform sertifikasyonu ve canlı servis dağıtımı

- Konsol sertifikasyon paketleri Gold'dan önce iki tam ön-gönderim (mock
  submission) turundan geçer; askıya alma/devam, kullanıcı değiştirme, ağ
  kopması ve depolama dolu senaryoları otomatik test kapsamındadır.
- **Gün-1 yaması** disiplini: boyut hedefi ≤ 10 GB; içerik kilidi Gold'da,
  yalnız stabilite düzeltmeleri kabul edilir.
- **Sezon dağıtımı:** 12 haftalık sezon ritmi (Sezon 01 "Karartma Protokolü"
  dahil) için sertifikasyon gerektiren istemci yamaları sezondan ≥ 4 hafta önce
  gönderilir; etkinlik değişimleri sunucu bayraklarıyla, yamasız yapılır
  (bkz. `06-canli-servis-ve-uzun-omur.md`).
- **Canlı ortam kapıları:** kanarya shard'ında 48 saat hatasız koşmadan hiçbir
  sunucu sürümü tüm bölge shard'larına yayılmaz; geri alma (rollback deploy)
  süresi hedefi ≤ 15 dk.

## Sürüm Geçmişi

| Sürüm | Tarih | Yazar | Değişiklik |
| --- | --- | --- | --- |
| 0.1 | 2 Haziran 2026 | Lumenworks Tasarım Ekibi | İlk taslak: motor hedefleri ve platform tablosu |
| 0.2 | 19 Haziran 2026 | Lumenworks Tasarım Ekibi | Streaming, Murmur LOD mimarisi ve ağ bölümleri eklendi |
| 1.0 | 3 Temmuz 2026 | Lumenworks Tasarım Ekibi | Bütçeler kesinleşti, kalite kapıları eklendi; inceleme için yayınlandı |

---

*Bu belge bir konsept çalışmasıdır. LUMENFALL, Lumenworks Studios, Duskforge
Engine ve tüm alt sistem adları kurgusaldır; belirtilen teknik hedefler ve
tarihler ticari taahhüt oluşturmaz.*
