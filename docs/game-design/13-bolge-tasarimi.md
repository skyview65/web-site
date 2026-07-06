# LUMENFALL — Bölge Tasarımı

> **"Karanlık parlar."**

| Alan | Değer |
| --- | --- |
| **Belge No** | LW-GDD-13 |
| **Sürüm** | 1.0 |
| **Tarih** | 5 Temmuz 2026 |
| **Sahip** | Seviye Tasarımı Lideri |
| **Durum** | İnceleme |
| **Gizlilik** | Stüdyo İçi — Dağıtım Onaya Tabidir |

Bu belge, LUMENFALL'un 310 km² kesintisiz şehri ile yörünge katmanının **seviye tasarımı sözleşmesidir**: 9 bölgenin mekânsal kimliği, işaret yapıları, dikey katmanları, ulaşım ağı ve içerik yoğunluk bütçeleri burada tanımlanır. Dünya kurgusu için tek doğruluk kaynağı LW-GDD-01'dir; bu belge o kurgunun **inşa edilebilir** hâlidir. Simülasyon bütçeleri LW-GDD-04'e, streaming/performans sözleşmeleri LW-GDD-07'ye, yan içerik yoğunluk tablosu LW-GDD-12'ye tabidir; bu belge onlarla çelişemez, yalnız onları mekâna çevirir.

**İlgili belgeler:** LW-GDD-01 (dünya ve lore) · LW-GDD-03 (PANOPT tepki sistemi) · LW-GDD-04 (simülasyon ve LOD) · LW-GDD-05 (bölge borsaları) · LW-GDD-07 (Riverbed streaming) · LW-GDD-11 (görev kapsama beyanları) · LW-GDD-12 (içerik yoğunluk haritası) · LW-GDD-16 (çatışma) · LW-GDD-17 (araç ve sıfır-G fiziği).

---

## 1. Tasarım Felsefesi ve Bölge Özeti

### 1.1 Beş İlke

1. **Bölge bir ruh hâlidir, harita parseli değildir.** Oyuncu, gözü kapalı bırakıldığı bölgeyi 10 saniyede ışık, ses ve siluetten tanımalıdır (dahili "kör bırakma" testlerinde ≥ %90 doğru tanıma hedefi).
2. **Sınır yoktur, geçiş dokusu vardır.** Bölgeler arasında kapı, duvar veya yükleme yoktur (kanon: %100 kesintisiz dünya); sınırlar 150–400 m'lik harmanlama bantlarıyla mimari ve ışıkta erir (bkz. Bölüm 5.4).
3. **Dikeylik kimliktir.** Her bölge dört katman beyan eder: **yeraltı → sokak → çatı → üstyapı**. Hiçbir katman "dekor" olamaz; her katmanın en az bir sistemsel işlevi (rota, saklanma, POI) vardır.
4. **Yoğunluk kimliktir** (LW-GDD-12 İlke 1). Gölgepazar'ın sıkışıklığı ve Dış Halka'nın boşluğu aynı tasarımın iki ucudur; 90/180 sn "dünya dokunuşu" kuralı bölge başına ayarlanır, tekdüzeleştirilmez.
5. **Kapsama coğrafyası oynanıştır.** PANOPT kapsama yüzdeleri (LW-GDD-03) seviye tasarımının girdisidir: kör nokta, çürük sensör ve tam kapsama alanları POI yerleşiminde bilinçli dağıtılır — kaçış planlaması bir harita okuma becerisidir.

### 1.2 Bölge Özeti (Ana Tablo)

Alanlar LW-GDD-12 yoğunluk bütçesiyle, kapsama yüzdeleri LW-GDD-03 kapsama haritasıyla birebir hizalıdır. Nüfus dağılımı 1.2M kanon toplamının bölge kırılımıdır. Sokak tehdidi D1 (güvenli) – D5 (ölümcül) ölçeğindedir ve kolluk baskısından ayrı ölçülür.

| # | Bölge | Alan (km²) | Nüfus (bin) | PANOPT kapsaması | Kolluk dokusu | Sokak tehdidi | Hâkim fraksiyon | Simge yapı |
| :-: | --- | :-: | :-: | :-: | --- | :-: | --- | --- |
| 1 | Çekirdek | 18 | 96 | %98 | PANOPT birincil; müdahale saniyeler | D1 | Lumen Compact (Aeon Dynamics) | PANOPT Kulesi |
| 2 | Neon Liman | 22 | 144 | %80 | Yoğun ama parazitli | D2 | Karat Sendikası | Meridyen Kumarhanesi |
| 3 | Pas Kuşağı | 46 | 228 | %55 | Çürük sensör; müdahale dakikalar | D4 | Kül Köpekleri | Üç Baca |
| 4 | Yükseliş | 28 | 132 | %85 | Gümrük odaklı, koridor bazlı | D3 | Yıldırım Orbital / İrtifa Loncası | Halat Tabanı |
| 5 | Sisaltı | 34 | 90 | %25 | Kör bölge; söylentiyle görür | D3 | Kanalcılar | Batık Meydan |
| 6 | Bahçeler | 26 | 150 | %70 | Standart, düşük müdahale | D1 | Kök Sendikası | Kule Bir |
| 7 | Kordon | 20 | 36 | %95 + Kessler-Voss | Çifte tepki katmanı | D2 | Kessler-Voss / Beyaz Eldiven | Beyaz Kapı |
| 8 | Gölgepazar | 14 | 78 | %45 | Çürük + sabote edilmiş | D3 | Hafıza Simsarları | Katmanaltı Çarşısı |
| 9 | Dış Halka | 102 | 216 | %5 | Fiilen yok | D5 | Kervan | Türbin Mezarlığı |
| — | Zenit Halkası | (yörünge) | 30 | Rıhtımlarda %97; halkada "danışma" | Yıldırım istasyon protokolü | D2 | Yıldırım Orbital | Tepe Terminali |

Kara alan toplamı 310 km², nüfus toplamı 1.200 bin = 1.2M (kanon). Kapsama haritasında LW-GDD-03'te tanımsız kalan üç değer bu belgeyle kanonlaşır: **Yükseliş %85, Bahçeler %70, Gölgepazar %45** (LW-GDD-01'in standart/çürük kapsama sınıflarıyla tutarlı).

---

## 2. Bölge Karneleri

Her karne aynı iskeleti izler: kimlik ve oyuncu fantezisi → siluet ve işaret yapılar → dikey katmanlar → doku, oynanış, tehlike, ekonomi, palet. Tablolarda **kalın** yazılan işaret yapıları LW-GDD-01 simge yapı tablosundan gelir; kalın olmayanlar bu belgeyle icat edilmiştir ve kanon uyumludur.

### 2.1 Çekirdek

**Kimlik ve oyuncu fantezisi:** Cam ve mermerden kusursuz bir vitrin; her şeyin duyulduğu, kimsenin bağırmadığı yer. Oyuncu fantezisi: *aslanın ağzında temiz iş çevirmek* — takım elbiseyle girilen, saniyelerle kazanılan işler.

| İşaret yapı | Rol |
| --- | --- |
| **PANOPT Kulesi** (512 m) | Şehrin en yüksek yapısı; camgöbeği halkası her bölgeden görünür — oyuncunun doğal pusulası (LW-GDD-01) |
| Beş Kule / Mutabakat Meydanı | Compact megakorplarının beş genel merkezi ve aralarındaki tören meydanı; 2063 Lumen Mutabakatı'nın anıtı |
| Defterhane | Hafıza Defteri'nin veri katedrali; soğutma galerileri yeraltına iner — veri soygunlarının son perde sahnesi |
| Aydınlık Bulvarı | Işık Nöbeti'nin (LW-GDD-01) ana sahnesi; yılda bir gece 11 dakika kararan tek Çekirdek caddesi |

| Katman | İçerik ve oynanış |
| --- | --- |
| Yeraltı | Omur Hattı istasyonları, Defterhane soğutma galerileri; tek "gözsüz" damar — bakım tünellerinde kapsama %98'den %60'a düşer |
| Sokak | Plaza ve lobiler; sosyal kılık ve yaya akışı — koşmak bile İlgi durumu tetikleyebilir (LW-GDD-03) |
| Çatı | Drone rıhtımları, bakım terasları; çatı geçiş izinleri Gölgepazar'dan satın alınır |
| Üstyapı | Kule gövdeleri ve gökyüzü lobileri; kampanyanın son perde sızma sahneleri (LW-GDD-11 P3 hattı) |

- **Doku ve fraksiyon:** Kayıtlı yurttaşların en üst dilimi + Kordon sınıfının iş adresi. Sokak fraksiyonu tutunamaz; tek "yerel ağ", Beyaz Eldiven'in kule personeli uzantısıdır.
- **Oynanış teması:** Sosyal mühendislik, K3 siber savaş, "temiz" kurumsal soygun (LW-GDD-03). Açık çatışma en pahalı seçenektir — her Çekirdek POI'sinde en az bir sessiz çözüm yolu zorunludur.
- **Tehlike / kolluk:** Sokak tehdidi D1; PANOPT eğrisi şehrin en diki (%98, müdahale saniyeler). Bastırma durumu (LW-GDD-03) en hızlı burada tetiklenir.
- **Ekonomik profil (LW-GDD-05):** Arz: finansal enstrüman, temiz veri. Talep: lüks tüketim, güvenlik. Borsa işlem vergisi %6 (bandın tavanı).
- **Işık / renk / ses:** Soğuk beyaz + camgöbeği, yansımalı yüzeyler. Ses: alçak HVAC uğultusu, yumuşatılmış ayak sesi, kibar anonslar. Gece bile "steril aydınlık" — karanlık burada ithal maldır.

### 2.2 Neon Liman

**Kimlik ve oyuncu fantezisi:** Işıkların asla sönmediği gece kalbi. Oyuncu fantezisi: *kalabalıkta krallık* — parayı döndürmek, izini gürültüye gömmek, bir gecede yükselip batmak.

| İşaret yapı | Rol |
| --- | --- |
| **Meridyen Kumarhanesi** | Karat Sendikası'nın tahtı; macenta şelale hologram cephesi (LW-GDD-01) — bölgenin gece pusulası |
| Volt Arenası | Lisanslı dövüş liglerinin (LW-GDD-01) stadyumu; bahis mini oyunları ve itibar görevleri düğümü |
| Serap Pasajı | Hologram tiyatroları sokağı; kalabalık yoğunluğunun tepe noktası — takip kaybettirme vitrini |
| Amber İskele | Sisaltı sınırındaki eğlence rıhtımı; geçiş dokusunda neon, sise gömülerek söner |

| Katman | İçerik ve oynanış |
| --- | --- |
| Yeraltı | Servis tünelleri ve kaçak kumar bodrumları; Karat'ın "kayıtsız masaları" |
| Sokak | Şehrin en yoğun kalabalığı (LW-GDD-01); kalabalık doğal örtüdür — PANOPT doğruluğu parazitle düşer |
| Çatı | Tabela ormanı ve çatı barları; neon iskeletleri arasında parkur rotaları |
| Üstyapı | Meridyen'in şelale cephesi ve hologram katmanı; reklam dronlarının koridoru |

- **Doku ve fraksiyon:** Gece ekonomisi işçileri + eğlence akını. Karat Sendikası kumarhane katını işletir; Sable Group medya haklarını sömürür — ikisinin defter savaşı (LW-GDD-01) çevre anlatısında sürekli işlenir.
- **Oynanış teması:** Kumar/bahis mini oyunları (LW-GDD-12; 4 mini oyun mekânıyla şehir lideri), itibar görevleri, kalabalıkta takip ve takip-kaybettirme. Gürültü/parazit yüksek: İlgi durumu kalabalıkta Müdahale'ye %35 daha geç tırmanır.
- **Tehlike / kolluk:** D2; kapsama %80 ama boşluklu. Kolluk sarhoş kalabalığa ayarlıdır — silah sesi paniği (LW-GDD-04 hücresel otomat) burada en pahalı sonuçları doğurur.
- **Ekonomik profil (LW-GDD-05):** Arz: eğlence, lüks tüketim. Talep: gıda, tıbbi malzeme. Lüks malların en pahalı satıldığı bölge; vergi %5.
- **Işık / renk / ses:** Vantablack cephede macenta + amber; ıslak asfalt yansımaları (Raylight RT yansımasının birincil sahnesi, LW-GDD-07). Ses: sokaktan sokağa değişen bas katmanları, senteze doymuş gece popu.

### 2.3 Pas Kuşağı

**Kimlik ve oyuncu fantezisi:** Karartma öncesi sanayinin paslı iskeleti; onurun son mülk olduğu yer. Oyuncu fantezisi: *demir ve yağ* — yumrukla, motorla ve mahalle sadakatiyle ayakta kalmak. Kaan "Ghost" Demir'in evi.

| İşaret yapı | Rol |
| --- | --- |
| **Üç Baca** | Kapanmış dökümhanenin soğuk bacaları; kaçak yarış bitiş çizgisi ve Kül Köpekleri toplanma alanı (LW-GDD-01) |
| Demirdöken Hangarı | Kaçak araç modifikasyonunun katedrali; 200+ araç ekosisteminin en iyi modcuları (LW-GDD-17 ile hizalı) |
| Cüruf Tepesi | Hurda dağı ve panorama noktası; bölgenin tek "yüksek zemin" savaş sahnesi |
| Son Vardiya Köprüsü | Kapanan fabrikaları bağlayan işçi köprüsü; "11 GÜN UNUTMADIK" grafitisinin (LW-GDD-01) adresi |

| Katman | İçerik ve oynanış |
| --- | --- |
| Yeraltı | Kapatılmış servis galerileri ve eski yük tünelleri; Kül Köpekleri depoları — kapsamasız kaçış damarı |
| Sokak | Hangar caddeleri ve kaçak yarış hatları; araç savaşının ana sahnesi |
| Çatı | Fabrika çatıları ve vinç rayları; keskin nişancı hatları ve çatı takipleri |
| Üstyapı | Üç Baca gövdeleri ve boru köprüleri; dikey tırmanış rotası + bölgeyi okutan seyir noktaları |

- **Doku ve fraksiyon:** Üç kuşaktır işsiz gri kayıtlı aileler; himaye ağı Kül Köpekleri'ndedir. Kessler-Voss "temizlik" kontratlarıyla vekâlet savaşı yürütür (LW-GDD-01) — bölge savaşlarının (LW-GDD-10) prototip sahası.
- **Oynanış teması:** Yakın dövüş, araç savaşı ve yarış (LW-GDD-17), çete bölge kontrolü. Sensörler eski ve bakımsız: "kirli" işlerin doğal sahası.
- **Tehlike / kolluk:** D4; kapsama %55, müdahale dakikalarla ölçülür. Tehdit kolluktan değil sokaktan gelir — gece yalnız yürüyen oyuncu pusu karşılaşma havuzuna girer (LW-GDD-12 şablonları).
- **Ekonomik profil (LW-GDD-05):** Arz: endüstriyel parça, hurda. Talep: tıbbi malzeme, enerji hücresi. Vergi %3; kayıt dışı atölye ekonomisi fiyat makasının alıcı ucudur.
- **Işık / renk / ses:** Pas rengi + sodyum turuncusu; kırık neonda titreyen camgöbeği aksan. Ses: uzak pres makineleri, zincir, hangar yankısı; metal perküsyonlu endüstriyel müzik.

### 2.4 Yükseliş

**Kimlik ve oyuncu fantezisi:** Yörünge asansörünün tabanı; her 90 saniyede bir kabinin göğe tırmandığı dikey liman. Oyuncu fantezisi: *gümrüğün iki yakası* — yükü, izni ve yerçekimini atlatmak. Solene Adeyemi'nin dünyası.

| İşaret yapı | Rol |
| --- | --- |
| **Halat Tabanı** | Karbon halatın yere gömüldüğü katedral ölçekli ankraj kompleksi (LW-GDD-01); bölgenin merkezi ve asansör terminali |
| Yıldırım İğnesi | Yıldırım Orbital genel merkezi; halatı çerçeveleyen ikinci silüet çizgisi |
| Vinç Ormanı | Kilometrelerce konteyner sahası ve vinç sırası; kargo görevlerinin labirenti |
| Loncaevi | İrtifa Loncası'nın bar + yük borsası + bağımsız hangar kompleksi; Solene görev hattının üssü |

| Katman | İçerik ve oynanış |
| --- | --- |
| Yeraltı | Ankraj kökleri: halatın gömülü gerilme katları; sabotaj/koruma görevlerinin kapalı sahnesi |
| Sokak | Terminaller, gümrük hatları, yük sahaları; kimlik kontrol dalgaları (LW-GDD-06 ile hizalı) |
| Çatı | Konteyner tepeleri ve vinç kabinleri; dikey takip rotaları |
| Üstyapı | Asansör gövdesi, mekik platformları, itki alevleri; sokak → yörünge kesintisiz koridorunun (LW-GDD-07) girişi |

- **Doku ve fraksiyon:** Pilotlar, yük komisyoncuları, gümrük memurları ve onları atlatanlar. Resmî tekel Yıldırım Orbital'de, gayriresmî trafik İrtifa Loncası'nda — kedi-fare gerilimi bölgenin görev motorudur.
- **Oynanış teması:** Dikey sızma, kargo/gümrük kaçakçılığı, mekik hırsızlığı. Yer-yörünge geçişinin vitrini: ilk saatlerde en az bir ana görev asansör yolculuğunu yaşatır (LW-GDD-01 kesintisizlik vitrini).
- **Tehlike / kolluk:** D3; kapsama %85 ama koridor bazlı — tarama kapıları yoğun, aralardaki yük sahaları boşluklu. Gümrük ihlali standart suçtan farklı işlenir: önce Kısıtlama (Kademe 2, LW-GDD-01) gelir.
- **Ekonomik profil (LW-GDD-05):** Arz: yörünge kargosu, yakıt. Talep: endüstriyel parça. Vergi %5. Yörüngeden inen malın ilk fiyatlandığı nokta; piyasa dalgalarının şehre giriş kapısı.
- **Işık / renk / ses:** Devasa ölçek + itki alevlerinin amber parıltısı; projektör koridorları. Ses: gümbürdeyen kalkış duyuruları, rüzgâr, metal gerilme iniltisi, pilot jargonu.

### 2.5 Sisaltı

**Kimlik ve oyuncu fantezisi:** 2093 Seli'nin yuttuğu eski şehir; resmî haritada "boşaltılmış alan", gerçekte en canlı kayıt dışı liman. Oyuncu fantezisi: *görünmezlik* — izini suya yazdırmak, sistemin kör noktasında nefes almak.

| İşaret yapı | Rol |
| --- | --- |
| **Batık Meydan** | Eski belediye meydanı; sudan çıkan saat kulesi tepesi ve etrafındaki tekne pazarı (LW-GDD-01) |
| Omurga İskelesi | Dubalar üstü ana pazar iskelesi; 94 Kanal Ateşkesi'nin imzalandığı masa hâlâ buradadır |
| Yeşil Fener | Kanal trafiğini yöneten kaçakçı feneri + meyhane; "kuru kalmak" isteyenlerin ilk durağı |
| Pompa Dokuz | 2093'te yenilen drenaj istasyonu; bugün Kanalcılar'ın tersanesi ve tekne modifikasyon atölyesi |

| Katman | İçerik ve oynanış |
| --- | --- |
| Yeraltı (su altı) | Sel altındaki eski sokaklar; dalgıç-hurdacılık, batık arşivler, su altı keşfi — su altı/üstü geçişte yükleme yoktur (LW-GDD-07) |
| "Sokak" (su yüzeyi) | Kanallar, tekne pazarları, dubalar; tekne kovalamacalarının sahnesi |
| Çatı | Su üstünde kalan eski üst katlar; iskele mahalleleri ve halat köprüler |
| Üstyapı | Saat kulesi tepesi ve anten direkleri; sisin üstüne çıkan tek seyir katmanı |

- **Doku ve fraksiyon:** Tekne aileleri ve gri kayıtlılar; Kanalcılar bölgenin damar sistemidir, 94 Ateşkesi ticaretin anayasasıdır (LW-GDD-01).
- **Oynanış teması:** İz kaybettirme ve aranma sıfırlama (PANOPT kör noktası), tekne kovalamacası, su altı keşfi, kaçak depo baskını. Mara ve Solene görev hatlarının kesişimi.
- **Tehlike / kolluk:** D3; kapsama %25 — PANOPT yalnız söylentiyle görür. Tehdit sosyaldir: Ateşkes'i bozan oyuncuya kanallar kapanır (fraksiyon itibarı ↔ bölge ekonomisi bağı, LW-GDD-01).
- **Ekonomik profil (LW-GDD-05):** Arz: kaçak mal, tuzsuz su teknolojisi. Talep: her şey (ablukalı bölge). Vergi %2 — en yüksek marj, en yüksek rota riski (fiyat makası kuralı, LW-GDD-05).
- **Işık / renk / ses:** Sis + yeşilimsi su yansımaları; yarısı suya gömülü neonlar; kalıcı sis tabanı (LW-GDD-04 mikroklima). Ses: boğuk ve yakın — motor takırtısı, su şıpırtısı, sis düdüğü, su yankılı balladlar.

### 2.6 Bahçeler

**Kimlik ve oyuncu fantezisi:** Şehri doyuran dikey tarım kuleleri; "topluluk" kelimesinin hâlâ anlam taşıdığı tek bölge. Oyuncu fantezisi: *birine ait olmak* — sofraya oturmak, nöbete girmek, kimin için çaldığını sorgulamak.

| İşaret yapı | Rol |
| --- | --- |
| **Kule Bir** | 2074 Bahçeler Programı'nın ilk tarım kulesi; kooperatif meclisinin çatı sofrası (LW-GDD-01) |
| Tohum Kasası | Mirai Biyotek'in gen bankası ve lisans merkezi; bölgenin sessiz geriliminin mimari yüzü |
| Sulama Omurgası | Kuleleri bağlayan yükseltilmiş su arteri; üstü yürünebilir — bölge içi "yeşil koridor" |
| Hasat Kapısı | Gıda konvoylarının Çekirdek'e çıkış terminali; sabah trafik tepesinin (LW-GDD-04) kaynağı |

| Katman | İçerik ve oynanış |
| --- | --- |
| Yeraltı | Su ve besin dağıtım galerileri; Kök Sendikası'nın grev lojistiği buradan yönetilir |
| Sokak | Kule etekleri, hasat pazarları, ortak yemek alanları; şehrin en güvenli yaya dokusu |
| Çatı / kule içi | Kat bahçeleri: kule içi dikey sızma sahneleri (LW-GDD-01) — yeşil, nemli, LED'li iç dikeylik |
| Üstyapı | Kule taçları ve Çatı Sofrası; meclis sahneleri ve şehir panoraması |

- **Doku ve fraksiyon:** Kooperatif kültürü; Kök Sendikası çatı örgütüdür. Mirai'nin gen lisansı tasması bölgenin tek ama derin fay hattıdır (LW-GDD-01).
- **Oynanış teması:** Nefes alma alanı ve müttefik ağı: yan görevler, topluluk itibarı, güvenli evler, Mirai karşıtı görev hattı. Çatışma yoğunluğu bilinçli düşüktür — tempo eğrisinin (LW-GDD-04 Kent Yönetmeni) dinlenme vadisi.
- **Tehlike / kolluk:** D1; kapsama %70, müdahale nazik ve yavaş. Kule içleri kooperatif "ev sahipliği" sayılır: izinsiz silah çekmek topluluk itibarını anında düşürür.
- **Ekonomik profil (LW-GDD-05):** Arz: gıda, biyo ürün. Talep: endüstriyel parça, veri. Vergi %4. Kök Sendikası grevi, şehir çapında fiyat oynatan tek tekil olaydır (LW-GDD-01 piyasa kurgusu).
- **Işık / renk / ses:** Camgöbeği büyüme LED'leriyle içten aydınlanan yeşil kuleler; şehrin en sıcak paleti. Ses: damla sulama, havalandırma pervaneleri, kat bahçelerinde çocuk sesleri.

### 2.7 Kordon

**Kimlik ve oyuncu fantezisi:** Duvarların ardındaki kusursuz bahçeler ve ölü sessizlik. Oyuncu fantezisi: *davetli hırsız* — görünmez hizmetkârların dünyasına sızıp servetin kalbinden çalmak.

| İşaret yapı | Rol |
| --- | --- |
| **Beyaz Kapı** | Yerleşkenin tek resmî girişi; biyometrik kemer ve Kessler-Voss tören nöbeti (LW-GDD-01) |
| Sessiz Park | Özel arboretum; drone bülbüller öter (gerçek kuş kalmamıştır, LW-GDD-01) — her çim yaprağı sensördür |
| Cam Konaklar | Teras konak sırası; yüksek ödüllü konut soygunlarının vitrin hedefleri |
| Nöbet Evi | Kessler-Voss garnizonu; özel güvenlik tepki süresinin saat kulesi |

| Katman | İçerik ve oynanış |
| --- | --- |
| Yeraltı | Servis tünelleri — Beyaz Eldiven'in damarı; personel girişleri soygunların gerçek kapısıdır |
| Sokak | Bahçeli bulvarlar; yaya varlığı "davetli" statüsüne bağlıdır (LW-GDD-11 Beyaz Eldiven hattı) |
| Çatı | Konak terasları ve peyzaj çatıları; sessiz yaklaşma rotaları |
| Üstyapı | Bilinçli olarak alçak silüet; tek dikey unsur, drone kubbesinin görünmez ızgarasıdır |

- **Doku ve fraksiyon:** Compact hissedarları ve hizmetkâr sınıfı. Kessler-Voss güvenlik tekelini, Beyaz Eldiven görünmez hizmet ekonomisini işletir (LW-GDD-01).
- **Oynanış teması:** Sosyal kılık değiştirme, konut soygunu, suikast/koruma kontratları. **Çifte tepki sistemi:** PANOPT %95 kapsama + Kessler-Voss özel katmanı (LW-GDD-01, LW-GDD-16) — iki ayrı alarm saati aynı anda işler.
- **Tehlike / kolluk:** Sokak tehdidi D2 (şiddet nadir), kolluk baskısı şehrin en yükseği. Yakalanan oyuncu çoğu zaman öldürülmez: Kordon dışına "atılır" ve Kısıtlama yer (LW-GDD-11 ile tutarlı).
- **Ekonomik profil (LW-GDD-05):** Arz: — (üretmez). Talep: lüks tüketim, özel güvenlik. Vergi %6. Sanat/antika piyasası çalıntı mal için en yüksek fiyatı öder — ama satıcının kimliğini de fiyatlar.
- **Işık / renk / ses:** Pastel taş, yumuşak peyzaj aydınlatması; sodyum turuncusundan pastel beyaza sınır geçişi (LW-GDD-01 örneği). Ses: drone bülbüller, fıskiye, uzak çim biçme — gerilim tamamen görünmezdir.

### 2.8 Gölgepazar

**Kimlik ve oyuncu fantezisi:** Kara borsanın ve veri tüccarlarının labirenti; anıların bile fiyatı olan yer. Oyuncu fantezisi: *bilgiyle silahlanmak* — sistemin kayıtlarını sistemden ucuza satın almak. Mara Vex'in bölgesi.

| İşaret yapı | Rol |
| --- | --- |
| **Katmanaltı Çarşısı** | Üst üste yedi kat pasaj; en alt kat "fiyat sormanın bile parayla olduğu" veri katıdır (LW-GDD-01) |
| Sinyal Kuyusu | Katmanaltı'nın veri katına inen servis kuyusu; Hafıza Simsarları'nın ana borsası |
| Anten Ormanı | Çatılardaki çanak/anten kümesi; korsan yayınların (LW-GDD-12 Korsan Yayın Kayıtları) vericisi |
| Kopuk Köprü | İki pasaj bloğu arasında yarım kalmış köprü; Silinmişler'in buluşma noktası — yalnız karanlıkta kullanılır |

| Katman | İçerik ve oynanış |
| --- | --- |
| Yeraltı | Sinyal Kuyusu ve veri katı; netrunner kontratlarının fiziksel adresi |
| Sokak | Dar pasajlar, üst üste tezgâhlar; dikeyliği iç mekânda yaşayan tek bölge — pasaj katları "sokak" sayılır |
| Çatı | Anten Ormanı; sinyal karıştırıcı gölgesinde çatı rotaları — kapsama çatıda %45'ten %20'ye düşer |
| Üstyapı | Kopuk Köprü ve asma geçitler; bloklar arası kestirme ağı |

- **Doku ve fraksiyon:** Veri simsarları, kaçak donanımcılar, kimlik tüccarları. Hafıza Simsarları piyasayı yapar; Silinmişler ağı defterden düşenlere sahte geçmiş satar (LW-GDD-01).
- **Oynanış teması:** Netrunning ve bilgi ekonomisi: veri soygunları, iz sürme, karşı-gözetim alışverişi. PANOPT'a karşı en iyi yazılım/donanım burada satılır; Deniz soruşturmasının (LW-GDD-02) üssü. Şehrin en yüksek aktivite yoğunluğu: 3,5 düğüm/km² (LW-GDD-12).
- **Tehlike / kolluk:** D3; kapsama %45 — eski, kısmen sabote edilmiş sensörler; boşluk haritaları ("karanlık harita", LW-GDD-01 Ek A) ticari üründür.
- **Ekonomik profil (LW-GDD-05):** Arz: veri paketi, gri yazılım. Talep: temiz kimlik, tıbbi malzeme. Vergi %3. Bilgi fiyatlandırmasının şehir merkezi; söylenti ağı fiyat beklentisini oynatır (LW-GDD-05 manipülasyon tablosu).
- **Işık / renk / ses:** Macenta ağırlıklı kaçak neon, dar pasaj gölgeleri. Ses: sinyal karıştırıcı cızırtısı, pazarlık fısıltıları, üst katlardan sızan korsan yayın.

### 2.9 Dış Halka

**Kimlik ve oyuncu fantezisi:** 2085 Kapsama Kararı'yla sistemin dışına itilen çorak kuşak. Oyuncu fantezisi: *özgürlüğün faturası* — gözetimsiz ama korumasız; herkesin yalnız sözüne güvenildiği açık arazi.

| İşaret yapı | Rol |
| --- | --- |
| **Türbin Mezarlığı** | Devrilmiş rüzgâr türbinlerinden kervan buluşması; geceleri kamp ateşleriyle işaretlenir (LW-GDD-01) |
| Kapsama Hattı | 2085 sınırının ölü sensör direkleri; "Göz"ün bittiği çizgi — geçmek mekanik bir eşiktir (aranma çözülür, koruma biter) |
| Kervansaray Delta | Üç kervan yolunun kavşağındaki takas kampı; bölgenin en kalabalık düğümü |
| Tuz Yatağı | Kurumuş rezervuar; tuz ve su hakları pazarı — Kervan ekonomisinin (LW-GDD-01) borsası |

| Katman | İçerik ve oynanış |
| --- | --- |
| Yeraltı | Eski boru hatları ve Karartma dönemi sığınakları; keşif ve pusu mağaraları |
| Sokak (arazi) | Kervan yolları ve kamp çevreleri; konvoy oynanışının açık sahnesi |
| Çatı (yapı üstü) | Devrik türbin gövdeleri; gözcü ve keskin nişancı tünekleri |
| Üstyapı | Ayakta kalan türbin kuleleri ve gözcü tepeleri; ufukta neon şehir silüeti — vaat ve tehdit (LW-GDD-01) |

- **Doku ve fraksiyon:** Kayıtsızlar: göçmen kampları, kervan aileleri. Otorite yol geleneğidir; Kervan şehre girmez, şehirden beslenir (LW-GDD-01).
- **Oynanış teması:** Konvoy baskını ve koruması, arazi araç oynanışı (LW-GDD-17), pusular, toz fırtınasında hayatta kalma (LW-GDD-04 hava kancaları). Şehir kaosunun panzehiri olarak ritim değişimi.
- **Tehlike / kolluk:** D5; kapsama %5 — aranma sistemi işlemez, PANOPT koruması da yoktur. Suçlar deftere girmez; **yalnız insan tanıklar hatırlar** (LW-GDD-04 hafıza istisnası) — bölgenin mekanik kimliği.
- **Ekonomik profil (LW-GDD-05):** Arz: işgücü, geri dönüşüm. Talep: gıda, tıbbi malzeme, enerji. Vergi %2 (fiilen takas). Lümen geçer ama güven daha değerlidir.
- **Işık / renk / ses:** Geniş ufuk, toz, jeneratör ışıkları ve kamp ateşleri. Ses: rüzgâr, teneke takırtısı, kervan radyosu cızırtısı, jeneratör ritimli kervan şarkıları.

---

## 3. Zenit Halkası — Yörünge Katmanı

### 3.1 İstasyon Halkası Yapısı

Zenit Halkası, Riverbed'in 14 yörünge sektörünün (LW-GDD-07) 8'ini kaplar; kalan 6 sektör asansör gövdesidir. Halka **8 segmentten (S1–S8)** oluşur ve yerçekimi katmanlara göre değişir (LW-GDD-01): statü, hangi katta uyuduğunuzdur.

| Segment / hacim | İşlev | Yerçekimi | Notlar |
| --- | --- | :-: | --- |
| Tepe Terminali (S1) | Yörünge asansörü üst istasyonu + PANOPT gümrük katı | 1,0g (halat ekseni) | Rıhtım kapsaması %97 — LW-GDD-01 "Zenit rıhtımları" tam kapsama sınıfı |
| Karusel Katları (S2–S3) | Sıfır-yerçekimi lüks otelleri ve daireler; Eternal sürüm oyuncu üssü (LW-GDD-05) | 0,8g (dönen dış kat) | "Yukarının Kordon'u"; sosyal kılık sahneleri |
| Nadir Rıhtımı (S4–S5) | Yörünge rıhtımları: mekik yanaşma ve kargo aktarma | 0,3g | Kara Leylek'in ev limanı; İrtifa Loncası'nın "kayıt hatası" trafiği |
| Koğuş Omurgası (S6) | Transit işçi koğuşları ve istasyon hizmetleri | 0,3g | Halkanın gri kayıtlı nüfusu; yan içerik damarı (LW-GDD-12: 2 zincir) |
| Sıfır Bulvarı (S7) | 0-G promenad ve sıfır-yerçekimi gösteri maçları (LW-GDD-01) | 0g | Sıfır-G hareket setinin öğretildiği güvenli alan |
| Zenit Kasası (S8) | Lumen Compact veri kasası — Online sezon soygunu (LW-GDD-06/10) | 0g çekirdek | Tek oyunculuda dışı keşfedilir; içi Online'a ayrılmıştır |

Online tarafında yörünge katmanı 10. shard'dır (LW-GDD-07); segment sınırları shard içi hücrelere hizalanır, segmentler arasında devir gerekmez.

### 3.2 Sıfır-G Alanları

- **Kademeli öğrenme:** 0,8g → 0,3g → 0g sıralaması mimariye gömülüdür; oyuncu halkaya her girişte bu merdiveni ister istemez iner. Sıfır-G hareket seti (itiş, manyetik bot, momentum yönetimi — fizik: LW-GDD-17) Sıfır Bulvarı'nda risksiz, Nadir Rıhtımı'nda görev baskısı altında oynanır.
- **Havalandırma omurgası:** Segmentleri bağlayan 0g bakım tüneli; istasyon sızmalarının (LW-GDD-01) ana gizli rotası. PANOPT kapsaması yok, ama Yıldırım devriye droneları var — kör nokta değil, *farklı gözün* bölgesi.
- **Okunabilirlik kuralı:** 0g hacimlerde "aşağı" yoktur; her 0g hacminde tek bir **amber navigasyon aksı** (ışık şeridi) zorunludur ve şerit her zaman Tepe Terminali'ni gösterir — PANOPT Kulesi pusulasının yörünge eşdeğeri.

### 3.3 Yörünge Asansörü Terminali (Tepe Terminali)

- Kabinler her 90 saniyede kalkar (kanon); yolculuk ~3 dk gerçek zamandır ve **tek çekimde**, yükleme ekransız oynanır (LW-GDD-07 streaming koridoru; çift-doluluk tepesi ≤ 1,8 GB).
- Yolcu ve yük hatları ayrıdır (LW-GDD-01); yük hattına insan binmesi "kayıt hatası" gerektirir — İrtifa Loncası'nın satılık hizmeti.
- Kabin penceresi sahnelenmiş bir vitrin anıdır: şafağı şehirden ~34 dakika (oyun zamanı) önce yakalayan tırmanış (LW-GDD-04) korunur; kabin içine görüşü kapatan dekor konamaz.
- Kademe 2 Kısıtlama cezası (LW-GDD-01) asansör erişimini kapatabilir; bu durumda tek yörünge yolu Loncaevi üzerinden bağımsız mekiktir.

### 3.4 Hukuk, Ekonomi, Palet

- **Hukuk boşluğu:** PANOPT yetkisi halkada "danışma" düzeyindedir; asıl otorite Yıldırım Orbital istasyon protokolüdür (LW-GDD-01). Seviye tasarımı karşılığı: aranma durumu halkaya **taşınmaz**, ama Tepe Terminali'nden şehre inişte defter borcu sizi bekler.
- **Ekonomi:** Dış malların ilk fiyatlandığı nokta; Yükseliş ile birlikte piyasa dalgalarının kaynağı (LW-GDD-05). İstasyon borsası vergisi %5.
- **Palet:** Vantablack uzay fonunda amber navigasyon ışıkları + camgöbeği halka aydınlatması; aşağıda şehrin macenta-camgöbeği ızgarası. Ses: gövde gıcırtısı, havalandırma, yerçekimsiz sessizlik. "Karanlık parlar" sloganının en saf görüntüsü, halkadan bakılan Lumenfall'dır (LW-GDD-01).

---

## 4. Bölgeler Arası Ulaşım Ağı

### 4.1 Hatlar ve Katmanlar

| Hat / katman | Güzergâh | Hız / sıklık | Gözetim karakteri |
| --- | --- | --- | --- |
| **Omur Hattı** (yükseltilmiş manyetik ray) | Çekirdek ↔ Yükseliş; 4 istasyon: Mutabakat, Defterhane, Vinç Ormanı, Halat Tabanı | Tepe 300 km/s; 2 dk'da bir sefer | Şehrin en yoğun gözetlenen koridoru (LW-GDD-01); Kademe 2 cezasında kapanır |
| **Yeraltı Ekspresi** (metro; LW-GDD-07'deki hızlı seyahat altyapısı) | E1 "Halka": Neon Liman–Çekirdek–Bahçeler–Pas Kuşağı · E2 "Kuzey": Gölgepazar–Çekirdek–Beyaz Kapı–Yükseliş · E3 "Kıyı": Yükseliş–Neon Liman–Sisaltı kıyısı | İstasyon arası 70–90 sn | Standart kapsama; E3'ün Sisaltı segmenti 2093'ten beri yarı batık — kaçakçı kullanımında |
| E4 "Dış Hat" (terk edilmiş) | Pas Kuşağı → Dış Halka | Servis 2085'te kesildi | Paslı hat gövdesi keşif/pusu alanıdır; Kervan bazı tünelleri depo yapar |
| **Hava koridorları** (hover) | Tüm şehir; alçak katman serbest, üst katman lisanslı (LW-GDD-01) | Alçak ~110–140 km/s · üst ~220–260 km/s | Koridor ihlali kovalamaca tetikleyicisidir; PANOPT dinamik rezervasyonu (LW-GDD-04) |
| **Kanal Ağı** | Sisaltı ↔ Gölgepazar ↔ Dış Halka kıyısı (LW-GDD-01) | Tekne ~45–55 km/s | Kör rota; İlgi durumunu çözer, Müdahale'den saklar |
| **Yörünge asansörü** | Halat Tabanı ↔ Tepe Terminali | Kabin her 90 sn; yolculuk ~3 dk | PANOPT gümrük taraması; yük hattı ayrı |
| **Kervan yolları** | Dış Halka çevre kuşağı; Kervansaray Delta kavşağı | Konvoy hızı arazi araçlarına bağlı | Gözetimsiz; güvenlik = konvoy büyüklüğü |

Hız değerleri Riverbed hız sözleşmesinin (320 km/s yatay, 900 km/s dikey — LW-GDD-07) altında kalır; hiçbir oynanış aracı sözleşme tavanını aşamaz.

### 4.2 Seyahat Süreleri (temsilî rotalar, gerçek dakika)

| Kalkış → varış | Mod | Süre | Not |
| --- | --- | :-: | --- |
| Çekirdek (Mutabakat) → Neon Liman (Meridyen) | Hover, alçak katman | 2,5 dk | Gece trafik tepesinde +%30 |
| Çekirdek → Yükseliş (Halat Tabanı) | Omur Hattı | 2,1 dk | Hızlı ama izlenir (LW-GDD-11 B6 ikilemi) |
| Yükseliş → Zenit Halkası (Tepe Terminali) | Asansör kabini | 3,0 dk (+ ≤ 90 sn kabin bekleme) | %100 kesintisiz; tek çekim |
| Gölgepazar → Sisaltı (Batık Meydan) | Kanal teknesi | 6,5 dk | Kör rota; aranma çözülür |
| Gölgepazar → Sisaltı | Hover, alçak katman | 2,8 dk | Hızlı ama kapsamada |
| Pas Kuşağı (Üç Baca) → Kordon (Beyaz Kapı) | E1 + E2 (Çekirdek aktarma) | 5,2 dk | Sodyum turuncusu → pastel beyaz geçişi trende yaşanır |
| Sisaltı → Yükseliş | E3 Kıyı Hattı | 4,8 dk | Batık segmentte yavaşlar |
| Dış Halka (Kervansaray Delta) → Çekirdek | Hover, üst katman (lisanslı) | 4,0 dk | Lisanssız araç Kapsama Hattı'nda işaretlenir |
| Dış Halka güney ucu → Zenit Halkası | Hover üst + Omur + asansör | ≤ 11,0 dk | **Tasarım tavanı: şehirdeki en uzun yolculuk** |

### 4.3 Ulaşım Tasarım Kuralları

1. **11 dakika tavanı:** Dünyanın en uzak iki noktası arası yolculuk (aktarmalar dahil) 11 gerçek dakikayı aşamaz. 48 dakikalık oyun gününde (LW-GDD-04) hiçbir görev, süresinin %20'sinden fazlasını zorunlu seyahate harcatamaz.
2. **Komşu bölge kuralı:** Komşu iki bölgenin merkezleri arası hover ile ≤ 3 dk'dır; metro/Omur bu süreyi asla geçemez, aksi hâlde hat gereksizdir.
3. **Hız–gözetim takası her rotada sunulur:** Her bölge çifti için en az bir "hızlı ve izlenen" ile bir "yavaş ve kör" rota bulunur (örn. Omur Hattı ↔ Kanal Ağı; LW-GDD-11 B6 ile aynı ikilem). Rota seçimi PANOPT profilinin Kaçış eksenini (LW-GDD-03) besler.
4. **Hızlı seyahat diegetiktir:** Yeraltı Ekspresi ve mekik hızlı seyahati ≤ 8 sn diegetik maskeleme ile oynanır (LW-GDD-07 kalite kapısı); istasyonlar keşfedilmeden hızlı seyahat noktası olarak açılmaz.
5. **Shard dostu sınırlar (Online):** Bölge sınırı = shard sınırı (LW-GDD-07, devir ≤ 250 ms). Sınır bantlarının 200 m içine PvP çekim merkezi POI yerleştirilmez; devir anında çatışma yükü asgaride tutulur.

---

## 5. Okunabilirlik ve Navigasyon İlkeleri

### 5.1 Landmark Hiyerarşisi

| Derece | Ölçek | Örnekler | Kural |
| --- | --- | --- | --- |
| 1 | Şehir | PANOPT Kulesi (camgöbeği halka); asansör halatı + Zenit Halkası (gece gökyüzünde amber yay) | Açık gökyüzü altında her noktadan en az biri görünür — oyuncunun "kuzeyi" |
| 2 | Bölge | 9 simge yapı (Bölüm 2 tabloları) + Tepe Terminali | Kendi bölgesinin açık alanlarından ≥ %70 görünürlük; her simge yapı gece kendine özgü ışık imzası taşır |
| 3 | Mahalle | Su kuleleri, dev tabelalar, köprüler, vinçler | Sokak ağında ~300 m'de bir çapa; kavşak kararları landmark'a bakılarak verilebilmeli |

**"Üç bakışta yön" kabul kriteri:** Oyuncu herhangi bir açık noktada 360° döndüğünde en az bir 1. derece ve bir 2. derece landmark görmelidir (istisnalar: yeraltı, iç mekân, Sisaltı yoğun sisi — oralarda ses ve ışık aksı devralır). Gece derlemesi uçuş testine (LW-GDD-04) "landmark görünürlük örnekleyici" eklenir; ihlal eden sektör yerleşim incelemesine girer.

### 5.2 Işık ve Ses Dili

- **Bölge aksan renkleri navigasyon verisidir:** Çekirdek beyaz-camgöbeği · Neon Liman macenta-amber · Pas Kuşağı sodyum turuncusu · Yükseliş projektör beyazı + itki amberi · Sisaltı yeşil sis · Bahçeler sıcak camgöbeği-yeşil · Kordon pastel · Gölgepazar macenta · Dış Halka kamp ateşi/jeneratör sarısı. Oyuncu, ufka bakarak "hangi bölgeye gidiyorum" sorusunu renkle yanıtlar.
- **"Karanlık parlar" gece okunabilirliği:** Gece, oyunun en okunaklı saatidir (LW-GDD-04); kritik rotalar emisif ışık kaynaklarıyla (tabela, şerit, fener) çizilir, asla arayüz okuyla değil (LW-GDD-12 "ikon perhizi" ile aynı disiplin).
- **Ses imzası:** Her bölgenin iki katmanlı ses kimliği (ortam + müzik lehçesi; LW-GDD-01, LW-GDD-14) sınır bandında çapraz-soldurulur; göz kapalı bölge tanıma testinin ikinci kanalıdır.

### 5.3 Kesintisiz Akış Bütçeleri (LW-GDD-07 Hizası)

Bölge tasarımı, Riverbed sözleşmelerine karşı **içerik tarafının** yükümlülüklerini üstlenir:

| Sözleşme | Değer (LW-GDD-07) | Seviye tasarımı yükümlülüğü |
| --- | :-: | --- |
| Karo paketi | ≤ 96 MB (Çekirdek ≤ 128 MB) | Karo başına varlık bütçesi; aşan karo bölünür veya sadeleştirilir |
| Sınır varlık paylaşımı | — (bu belgeyle: ≥ %35) | Komşu bölgeler sınır bandında ortak mimari kit kullanır; geçişte I/O tepesi önlenir |
| Hız sözleşmesi | 320 km/s yatay / 900 km/s dikey | Uzun düz koridorlar (Omur, hava koridorları) yüksek hız rotası olarak işaretlenir; karo dizilimi buna göre önceliklenir |
| Streaming ıskası | R0'da ≤ 1 LOD patlaması / oturum | Bölge sınırlarında ve asansör koridorunda "ıska avı" haftalık koşulur |
| Sınır geçişi çift doluluk | ≤ 1,2 GB (asansör koridoru ≤ 1,8 GB) | Sınır bandında iç mekân yoğunluğu düşük tutulur; ağır iç mekânlar bölge merkezlerine yığılır |
| Maskeleme | ≤ 8 sn, yalnız diegetik | Hiçbir bölge geçişinde maskeleme yoktur; maskeleme yalnız hızlı seyahatte kullanılır |

### 5.4 Sınır Geçiş Dokusu

- Her bölge çifti sınırı **150–400 m'lik harmanlama bandı** ile tanımlanır; bantta mimari kitler, ışık sıcaklığı ve ses katmanları doğrusal harmanlanır (örnek kanon geçişi: Pas Kuşağı sodyum turuncusu → Kordon pastel beyazı, LW-GDD-01).
- Bant genişliği geçişin sertliğini anlatır: Kordon duvarı 150 m'lik sert bant (duvar + kontrol noktası), Sisaltı–Neon Liman 400 m'lik yumuşak bant (Amber İskele'nin sise gömülmesi).
- Kapsama yüzdesi bant boyunca enterpole edilir; oyuncu "Göz"ün yoğunlaştığını HUD'dan önce dünyadan (sensör direkleri, drone sesi) okur.

---

## 6. Bölge Başına İçerik Yoğunluk Bütçeleri

Yan içerik adetleri (zincir/şablon/koleksiyon/mini oyun) için tek doğruluk kaynağı **LW-GDD-12 Bölüm 7.2 tablosudur** (60 zincir · 140 şablon · 174 parça · 13 mini oyun mekânı); bu belge onları tekrarlamaz. Aşağıdaki tablo, seviye tasarımının kendi üretim bütçesidir ve LW-GDD-12'nin 90/180 sn kuralını mekânsal olarak taşıyacak asgari donanımı tanımlar:

| Bölge | Girilebilir iç mekân | Dikey erişim noktası* | Güvenli ev | Garaj / rıhtım | Borsa terminali |
| --- | :-: | :-: | :-: | :-: | :-: |
| Çekirdek | 90 | 40 | 1 | 4 | 2 |
| Neon Liman | 160 | 55 | 4 | 8 | 3 |
| Pas Kuşağı | 150 | 70 | 5 | 14 | 2 |
| Yükseliş | 120 | 85 | 3 | 10 | 3 |
| Sisaltı | 110 | 75 | 5 | 12 (rıhtım) | 2 |
| Bahçeler | 90 | 60 | 4 | 5 | 2 |
| Kordon | 60 | 25 | 1 | 3 | 1 |
| Gölgepazar | 140 | 65 | 5 | 4 | 3 |
| Dış Halka | 90 | 30 | 4 | 9 | 1 |
| Zenit Halkası | 90 | 45 | 2 | 6 (rıhtım) | 2 |
| **Toplam** | **1.100** | **550** | **34** | **75** | **21** |

\* Dikey erişim noktası: katmanlar arası (yeraltı ↔ sokak ↔ çatı ↔ üstyapı) geçiş veren merdiven, şaft, asansör, tırmanış hattı veya dalış noktası.

**Bütçe kuralları:**

1. **Bütçe, özellikten önce gelir** (LW-GDD-04/12 ile aynı disiplin): tabloda yer açılmadan yeni iç mekân üretime giremez.
2. **Kordon ve Çekirdek bilinçli fakirdir:** Az iç mekân + yüksek kapsama = her giriş bir operasyondur. Bu, yoğunluk eksikliği değil tehdit tasarımıdır.
3. **Dikey erişim asgarisi:** Sokaktan çatıya çıkış, şehir içinde hiçbir noktada 250 m'den uzak olamaz (Dış Halka hariç); çatı kaçışçısı fantezisi (LW-GDD-03 Kaçış ekseni) her bölgede oynanabilir kalmalıdır.
4. **Güvenli evler kapsama gölgesine kurulur:** 34 güvenli evin tamamı yerel kapsama boşluklarında konumlanır; Çekirdek ve Kordon'daki birer istisna, ilgili fraksiyon hattının (Silinmişler / Beyaz Eldiven) ödül mekânıdır.

---

## 7. Açık Sorular

1. **Kordon çifte tepkisi ve sosyal kılık dengesi:** %95 kapsama + Kessler-Voss katmanı, "davetli" statüsündeki (LW-GDD-11) oyuncuya da tam güçle mi işlesin, yoksa davetliyken PANOPT katmanı %95 → %75'e mi insin? Mevcut prototipte davetli oyuncular Kordon görevlerini "çözülemez" olarak raporluyor.
2. **Sisaltı dinamik su seviyesi:** Sistemik sel uyarısı olayları (LW-GDD-04) için ±0,8 m'lik gelgit bandı öneriyoruz; anlatı ekibi ±2 m istiyor. ±2 m, iskele dokusunun tamamının yüzer platforma çevrilmesi demek (~14 hafta ek üretim). Karar Tasarım Direktörlüğü'nün.
3. **Dış Halka 180 sn kuralının kapsamı:** 102 km²'nin tamamında mı, yoksa yalnız kervan koridorları çevresinde mi geçerli olsun? Tam kapsam, "boşluğun kendisi tasarımdır" ilkesiyle (LW-GDD-12 İlke 1) gerilim içinde.
4. **Zenit Halkası'nın kampanyada açılış saati:** Halkayı ilk 5 saatte açmak kesintisizlik vitrinini erken parlatır; ama Kademe 2 Kısıtlama cezası asansörü kapatabildiğinden, cezalı oyuncu yörünge içeriğinden kilitlenebilir. Loncaevi mekiği yeterli emniyet supabı mı?
5. **Gölgepazar iç mekân kalabalığı:** 3,5 düğüm/km² yoğunluk + yedi katlı Katmanaltı, LOD 0 tavanını (≤ 160, LW-GDD-04) pasaj içlerinde zorluyor. Katmanaltı'na özel bir "iç mekân kalabalık bütçesi" (öneri: LOD 0 ≤ 120, kalan payın LOD 1'den karşılanması) tanımlansın mı?
6. **E3 batık segmentinin hızlı seyahat maskesi:** Yarı batık istasyonlarda ≤ 8 sn diegetik maskeleme (LW-GDD-07) tekne aktarması kurgusuyla mı çözülsün, yoksa E3 hızlı seyahati Sisaltı'da devre dışı mı kalsın?

---

## 8. Sürüm Geçmişi

| Sürüm | Tarih | Yazar | Değişiklik |
| --- | --- | --- | --- |
| 1.0 | 5 Temmuz 2026 | Seviye Tasarımı Lideri | İlk sürüm |

---

*Bu doküman bir konsept çalışmasıdır. LUMENFALL, Lumenworks Studios, Duskforge Engine ve burada geçen tüm kişi, kurum, mekân, ürün ve olaylar tamamen kurgusaldır; gerçek kişi, kurum veya yerlerle benzerlikler tesadüfidir. Belirtilen sayılar, tarihler ve teknik hedefler herhangi bir ticari taahhüt oluşturmaz.*
