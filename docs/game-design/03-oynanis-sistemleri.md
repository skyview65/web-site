# LUMENFALL — Oynanış Sistemleri Tasarım Dokümanı

| Alan | Değer |
| --- | --- |
| **Belge No** | LW-GDD-03 |
| **Sürüm** | 1.0 |
| **Tarih** | 3 Temmuz 2026 |
| **Sahip** | Lumenworks Tasarım Ekibi |
| **Durum** | İnceleme |
| **Motor Hedefi** | Duskforge Engine r14+ |
| **Bağlayıcı Kanon** | LUMENFALL_CANON.md (Tek Doğruluk Kaynağı) |

> Bu belge, LUMENFALL'un çekirdek oynanış sistemlerini tanımlar. Dünya ve bölge tasarımı için **LW-GDD-02 (Dünya ve Bölgeler)**, anlatı ve karakter yayları için **LW-GDD-04 (Anlatı Tasarımı)**, ekonomi dengeleme tabloları için **LW-GDD-05 (Ekonomi ve İlerleme)**, LUMENFALL Online sezon yapısı için **LW-GDD-07 (Canlı Servis)** belgelerine başvurunuz. Buradaki tüm sayılar, aksi belirtilmedikçe dengelemeye açık hedef değerlerdir; kanondan gelen sayılar (310 km², 1.2M vatandaş, 9 bölge, 3 protagonist, 200+ araç, %100 kesintisiz dünya) **değiştirilemez**.

---

## Çekirdek Oynanış Döngüsü (dakika/saat/hafta ölçeğinde)

LUMENFALL'un döngü mimarisi üç zaman ölçeğinde tasarlanmıştır. Her ölçek bir üsttekini besler; hiçbir ölçek tek başına "grind" üretmez.

### Dakika Ölçeği (30 sn – 5 dk): "Sokak Nabzı"

Oyuncunun anlık kararlar aldığı döngü:

1. **Gözle** — PANOPT kapsama yoğunluğunu HUD'daki Bakış Göstergesi'nden oku (bkz. PANOPT Tepki Sistemi).
2. **Hareket et** — traversal ile hedefe yaklaş; rota seçimi risk/ödül dengesidir (ana arter hızlı ama izlenir; Sisaltı kanalları yavaş ama kör nokta).
3. **Etkileşim** — çatışma, siber müdahale, sosyal etkileşim veya kaçış.
4. **Kazan/İz bırak** — Lümen (LM), eşya, veri parçası kazan; karşılığında PANOPT davranış modeline veri sızdır.

**Kural:** Her dakika-ölçeği eylemin çift çıktısı vardır — *kaynak* (LM, eşya, bilgi) ve *iz* (PANOPT'un oyuncu modeline eklenen gözlem). Hiçbir eylem "bedava" değildir.

### Saat Ölçeği (20 dk – 2 saat): "Operasyon Döngüsü"

1. **Sözleşme al** — 3 protagonistin ayrı iş ağlarından (Mara: veri tüccarları, Kaan: Pas Kuşağı çeteleri, Solene: yörünge kaçakçılık hatları).
2. **Hazırlan** — ekipman, araç, istihbarat, ekip üyesi (bkz. Soygun/Heist Planlama).
3. **İnfaz et** — görev; ortalama ana görev süresi hedefi 35–50 dk, yan sözleşme 12–20 dk.
4. **Sonuçları yaşa** — bölge ekonomisi tepki verir (fiyat dalgalanması ±%4–18), fraksiyon itibarı değişir, PANOPT modeli güncellenir.
5. **Yatır** — kazancı beceri, araç, üs veya piyasa spekülasyonuna dönüştür.

### Hafta Ölçeği (gerçek zaman 5–10 saat oyun): "Şehir Döngüsü"

- **Bölge durumu:** 9 bölgenin her biri haftalık *Gerilim Endeksi* (0–100) taşır. Oyuncu eylemleri, fraksiyon çatışmaları ve PANOPT bastırma operasyonları endeksi oynatır. 70+ gerilim: sokak kontrolleri, fiyat artışı, yeni yan içerik; 30- gerilim: gevşek devriye, ucuz karaborsa.
- **Piyasa çevrimi:** oyuncu güdümlü piyasa 9 bölgede arz-talebe göre haftalık yeniden dengelenir (kanon; ayrıntı LW-GDD-05).
- **PANOPT model çürümesi:** oyuncu 7 oyun-günü boyunca bir davranış kalıbını terk ederse, modeldeki o kalıbın ağırlığı %50 azalır — oyuncuya "yeniden görünmezleşme" yolu sunar.
- **Online eşleşmesi:** LUMENFALL Online'da 12 haftalık sezon ve haftalık bölge savaşları bu döngünün çok oyunculu yansımasıdır (LW-GDD-07).

### Döngü Sağlığı Metrikleri (hedef)

| Metrik | Hedef |
| --- | --- |
| Dakika döngüsünde karar noktası sıklığı | ≥ 1 / 45 sn |
| Saat döngüsünde "anlamlı sonuç" (dünya durumu değişimi) | ≥ 3 / operasyon |
| Hafta döngüsünde oyuncunun fark edebildiği şehir değişimi | ≥ 5 gözlemlenebilir olay |
| Zorunlu tekrar (aynı içeriği aynı şekilde oynama) | 0 — PANOPT uyarlaması tekrarları farklılaştırır |

---

## Hareket ve Sokaktan-Yörüngeye Traversal

Kanon ilkesi: **%100 kesintisiz dünya — yükleme ekranı yok.** Sokaktan yörünge asansörüne, asansörden Zenit Halkası'na geçiş tek kesintisiz akıştır. Duskforge Engine'in akış (streaming) bütçesi bu bölümün tüm kararlarını sınırlar.

### Yaya Hareketi

- **Temel set:** yürüme (1.6 m/sn), koşu (4.2 m/sn), sprint (7 m/sn, dayanıklılık 12 sn taban), kayma, mantle (1.2 m'ye kadar otomatik, 2.4 m'ye kadar girdili), bağlamsal parkur.
- **Karakter farklılaşması:** Mara +%15 tırmanma hızı ve dar geçit erişimi; Kaan sprint sırasında omuz darbesiyle kapı/engel kırma; Solene düşük yerçekimi bölgelerinde (Zenit Halkası, asansör kabini) tam manevra yetkinliği — diğer ikisi orada %30 ceza yer.
- **Momentum kuralı:** hız asla anında kesilmez; her durdurucu etki 0.3–0.6 sn'lik okunabilir yavaşlama eğrisiyle uygulanır.

### Dikey Şehir Katmanları

Lumenfall 5 dikey katmanda örülüdür; traversal tasarımı katmanlar arası geçişi ödüllendirir:

1. **Sisaltı seviyesi (-40 m ile 0 m):** su kanalları, dalış, tekne; PANOPT kapsaması en zayıf.
2. **Sokak seviyesi (0–30 m):** ana oynanış düzlemi.
3. **Geçit ağı (30–120 m):** yaya köprüleri, raylı kapsül hatları, çatı parkuru.
4. **Hava koridorları (120–800 m):** yerden kesik araçlar ve hava taksileri; PANOPT kapsaması en yoğun.
5. **Yörünge hattı (800 m – 36.000 km):** Yükseliş asansörü + Zenit Halkası + serbest yörünge kabuğu.

### Sokaktan-Yörüngeye Akış (imza sekansı)

- **Asansör kabinleri** Yükseliş tabanından her 6 oyun-dakikasında kalkar; tırmanış oyun içinde 4 dk sürer (sıkıştırılmış zaman) ve tamamen etkileşimlidir: kabin içi sosyal alan, güvenlik taraması (kaçak yükle binildiyse mini oyun tetiklenir), kabin üstüne tırmanma (kaçakçı rotası).
- **Alternatif çıkış:** Solene'in Kara Leylek'i ve eşdeğer yörünge sınıfı araçlar atmosferik tırmanışla yörüngeye çıkabilir (yakıt maliyeti 2.400–6.000 LM; asansör bileti 180 LM — hız/maliyet/kaçaklık üçgeni).
- **Yörünge hareketi:** Newtoncu-hafif model — atalet korunur, tam vektör kontrolü Solene becerileriyle açılır; diğer karakterler otomatik yardım (flight assist) kilidiyle uçar.
- **Teknik kısıt:** sokak→yörünge kesintisiz geçişte doku/varlık akışı için koridor boyunca üç LOD kuşağı; tasarımcılar asansör güzergâhına 90 sn'den uzun boş süre koyamaz.

### Hızlı Seyahat Felsefesi

Işınlanma yoktur. "Hızlı seyahat" diegetiktir: otonom taksi, raylı kapsül, asansör — hepsi gerçek zamanda atlanabilir simülasyon olarak oynar ve atlansa bile dünya sonuçları işler (yolda tetiklenecek olay atlayınca da tetiklenir, sonucu bildirimle gelir).

---

## Araçlar (kara/hava/yörünge sınıfları, 200+ araç — sınıf tablosu)

Kanon: **200+ araç, yerden kesik araçlardan yörünge mekiklerine.** Araç envanteri üç ana alem, on iki sınıfa ayrılır. Her sınıfın kendine ait sürüş modeli parametre seti vardır (kütle, itki eğrisi, tutunma/itki vektörü, hasar zarfı).

### Sınıf Tablosu

| Alem | Sınıf | Adet (hedef) | Örnek Kullanım | Ayırt Edici Mekanik |
| --- | --- | --- | --- | --- |
| Kara | Sokak motosikletleri | 22 | Kurye işleri, dar ara sokak kaçışı | Trafik arası "akış bonusu" (yakın geçiş = nitro şarjı) |
| Kara | Sedan / kupa (tekerlekli klasikler) | 34 | Günlük sürüş, düşük profil | PANOPT'a en az iz bırakan alem |
| Kara | Performans / yarış | 18 | Sokak yarışı, hızlı kaçış | Isı yönetimi: uzun tam gaz motoru boğar |
| Kara | Zırhlı / taktik | 14 | Soygun infazı, konvoy baskını | Modüler zırh plakaları bölgesel kırılır |
| Kara | Ağır vasıta / endüstriyel | 16 | Kargo, çekici işler, koçbaşı | Römork fiziği; yük değeri sigortalanabilir |
| Kara | Deniz/kanal araçları (Sisaltı) | 15 | Kaçakçılık, su altı erişim | Yarı dalış modu; sonar körlüğü yaratır |
| Hava | Yerden kesik (hover) binekler | 26 | Katmanlar arası günlük ulaşım | Yükseklik bandı kiralama: koridor dışı uçuş = anında PANOPT ilgisi |
| Hava | AV-taksi / yolcu VTOL | 12 | Diyejetik hızlı seyahat, kaçırma görevleri | Otopilot ele geçirilebilir (siber savaş) |
| Hava | Taktik VTOL / gunship | 10 | Üst düzey fraksiyon çatışması | Yan kapı pozisyonları; 4 kişilik Crew uyumlu |
| Hava | Drone taşıyıcı / destek | 9 | Mara'nın uzman alemi | 3 adede kadar bağlı drone yönetimi |
| Yörünge | Asansör-arayüz mekikleri | 12 | Yükseliş ↔ Zenit Halkası ticareti | Kargo manifestosu sahteciliği mini oyunu |
| Yörünge | Yörünge kaçakçı gemileri | 12+ | Kara Leylek sınıfı; serbest yörünge | Newtoncu uçuş, ısı imzası yönetimi, atmosfer girişi |

**Toplam: 200 araç lansmanda; sezonluk eklerle büyür (kanon: "200+").** Kara Leylek, Solene'e özel benzersiz gemidir; yörünge kaçakçı sınıfının tavan gövdesidir ve satın alınamaz — hikâyeyle gelişir.

### Ortak Araç Sistemleri

- **Sahiplik ve depo:** her karakterin bölgesindeki garaj taban 8 slot, geliştirmeyle 24'e çıkar. Eternal sürüm sahipleri Zenit Halkası dairesinde +6 yörünge rıhtımı alır (yalnız depolama — pay-to-win yasağı gereği performans avantajı yok).
- **Özelleştirme:** görsel (boya, kaplama, siluet parçaları — Prizma ile kozmetik satılabilir) ve mekanik (yalnız oyun içi LM ve ustalıkla; gerçek parayla asla — kanon ilkesi).
- **Hasar modeli:** 6 bölgeli gövde (ön/arka/yanlar/tavan/alt) + 4 sistem (güç aktarımı, kontrol yüzeyleri, aviyonik, yaşam desteği [yörünge]). Aviyonik hasarı hover araçlarda yükseklik salınımı yaratır — okunabilir, öğrenilebilir arıza davranışı.
- **Araç siber güvenliği:** her aracın Buz Katmanı (0–5) vardır; Mara sınıf 3'e kadar araçları sürücülü halde ele geçirebilir (bkz. Çatışma → Siber Savaş).

---

## Çatışma (ateşli silah, yakın dövüş, siber savaş)

Çatışma üç eşit sütun üzerine kuruludur; her karşılaşma en az iki sütunla çözülebilir olmalıdır (tasarım kapısı: tek çözümlü karşılaşma inceleme reddi sebebidir).

### Ateşli Silahlar

- **Arketipler (9):** tabanca, ağır tabanca, SMG, çarpma tüfeği (kinetik), demiryolu tüfeği (rail), pompalı, DMR, keskin nişancı, enerji fırlatıcı. Her arketipte 4–7 gövde; toplam 48 taban silah + üretici varyantları.
- **Üretici kimlikleri:** Kessler-Voss (güvenilir, ağır, yavaş dolum), Aeon Dynamics (enerji, ısı yönetimi), Yıldırım Orbital (hafif alaşım, yörünge-güvenli düşük ricochet), sokak yapımı "Pas işi" (ucuz, tutukluk riski %3/şarjör).
- **Hasar modeli:** vücut bölgesi çarpanları (kafa ×2.5, gövde ×1.0, uzuv ×0.7); zırh delme ile zırh değeri karşılaştırmalı azaltma. TTK hedefi: eşit seviyeli düşmana gövdeden 0.8–1.4 sn.
- **Yörünge kuralı:** basınçlı hacimlerde kinetik silahlar cam/gövde delme riski taşır — dekompresyon alarmı 20 sn'lik ortam tehlikesi yaratır. Enerji silahları bu riski taşımaz; yörünge görevlerinde yükleme ekipmanı seçimi anlam kazanır.

### Yakın Dövüş

- **Sistem:** hafif/ağır saldırı, savuşturma (parry, 0.25 sn pencere), sersemletme ölçeri, çevresel bitiriciler (duvara, tezgâha, korkuluğa bağlamsal).
- **Kaan'ın alemi:** yalnız Kaan zincir kombolarına (3–5 vuruş) ve silah kapmaya (düşmanın silahını sökme) tam erişir; diğerleri temel sete sahiptir.
- **Silahlar:** yumruk, sustalı, mono-bıçak, şok copu, endüstriyel hidrolik kesici (Pas Kuşağı özel). Mono-bıçak zırh yok sayar ama savuşturulursa 1.5 sn toparlanma cezası verir.
- **Ölümcül olmayan yol:** tüm yakın dövüş bitiricileri bayıltma varyantına sahiptir; oyun asla öldürmeyi zorunlu kılmaz (anlatı istisnaları LW-GDD-04'te işaretlidir).

### Siber Savaş

Mara'nın alemi; diğer karakterler temel 1. kademe erişime sahiptir.

- **Bakış Menzili:** hedefe hat-görüşü veya ağ erişimi gerekir. Kamera zincirlemeyle görüş "ödünç alınabilir".
- **Müdahale kademeleri:**
  - **K1 — Aksama (0.5–1 sn cast):** kamera döngüsü, kapı kilidi, ışık söndürme, drone sersemletme. Maliyet: 1 İşlem Çekirdeği.
  - **K2 — Ele geçirme (2–4 sn):** taret dostlaştırma, araç otopilot gaspı, düşman implant geri tepmesi (silah tutukluğu, HUD paraziti). Maliyet: 2–3 çekirdek.
  - **K3 — Alan işgali (6 sn, kanal):** bölgesel karartma (30 m yarıçap, 20 sn), PANOPT yerel düğüm körleştirme, toplu implant çökertme. Maliyet: tüm çekirdekler + 60 sn bekleme.
- **İşlem Çekirdeği ekonomisi:** taban 3, beceriyle 6; çekirdekler dövüş dışında 8 sn/adet yeniler, dövüşte yalnız başarılı müdahale geri kazandırır (agresif hacker fantezisini ödüllendirir).
- **Karşı-tehdit:** Kessler-Voss buz taşıyıcıları Mara'ya *geri iz* saldırısı başlatabilir — 10 sn'lik izleme mini oyununu kaybederse konumu PANOPT'a düşer.

### Karışım Kuralı

Karşılaşma tasarımı "üçgen bütçesi" kullanır: her POI'de düşman kompozisyonunun en az %25'i her sütuna karşı zayıf olmalıdır. Salt kurşun geçirmez, salt hack'lenemez, salt yaklaşılamaz düşman aynı sahnede üçü birden bulunamaz.

---

## PANOPT Tepki Sistemi

**Tasarım bildirisi (kanon):** PANOPT bir "aranma seviyesi" (wanted level) DEĞİLDİR. Beş yıldızlı klasik ölçek yoktur. PANOPT, oyuncuyu **öğrenen uyarlanabilir bir sistemdir**: neyi, nerede, nasıl ve ne sıklıkla yaptığınızı modeller ve karşı tedbirlerini *sizin alışkanlıklarınıza göre* seçer.

### Davranış Modeli (oyuncu profili)

PANOPT her protagonist için ayrı bir profil tutar (karakter değişimi profili değiştirir — üç karakter üç ayrı "tehdit dosyasıdır"). Profil 6 eksenli bir vektördür, her eksen 0–100:

| Eksen | Ne öğrenir | Örnek karşı tedbir |
| --- | --- | --- |
| **Yöntem** | Silahlı mı, sessiz mi, siber mi? | Siber ağırlıklıysa: hava boşluklu (air-gap) sistemler, analog kilitler |
| **Mekân** | Hangi bölgelerde iş yapıyor? | Sık kullanılan bölgeye kalıcı devriye yoğunluğu +%40 |
| **Zaman** | Hangi oyun saatlerinde aktif? | Alışılan saat aralığında sensör hassasiyeti artışı |
| **Kaçış** | Araçla mı, yaya mı, dikeyde mi kaçıyor? | Hover kaçışçısına hava koridoru drone barikatı; çatı koşucusuna geçit ağı kilidi |
| **Hedef** | Kimi vuruyor (korp, çete, sivil altyapı)? | Lumen Compact hedeflerine ısrar: Kessler-Voss özel av timi ataması |
| **İmza** | Tekrarlanan "tik"ler (aynı silah, aynı araç, aynı giriş yolu) | İmza eşleşmesi tespit süresini %60 kısaltır |

### Tepki Durumları (seviye değil, durum makinesi)

1. **Sessiz İzleme** — ihlal kaydedildi, tepki yok; veri toplanıyor. Oyuncuya *hiçbir HUD bildirimi verilmez* (kasıtlı belirsizlik).
2. **İlgi** — Bakış Göstergesi (HUD'da göz ikonu) yanar; drone'lar rota keser, kameralar takip eder. Çözülme: 90 sn temiz davranış veya kapsama boşluğuna giriş.
3. **Müdahale** — profil eksenlerine göre *seçilmiş* birimler sevk edilir (yukarıdaki tabloya göre). Jenerik polis dalgası yoktur; gelen güç, sizin geçmişinize verilen cevaptır.
4. **Bastırma** — bölgesel kilitleme: koridor kapanışları, sivil tahliye, REGENT yetkili ağır birimler. Yalnız Gerilim Endeksi 70+ bölgelerde ve büyük ihlallerde.
5. **Silinme Protokolü** — anlatıya bağlı en üst durum (LW-GDD-04): PANOPT sizi yakalamak yerine *kayıtlardan silmeye* çalışır — Deniz'e yapılanın oyuncuya dönük yansıması. Yalnız 3. perde sonrası açılır.

### Kaçınma ve Model Kirletme

- **Kapsama haritası:** PANOPT kapsaması bölgeye göre değişir — Çekirdek %98, Kordon %95, Neon Liman %80, Pas Kuşağı %55, Sisaltı %25, Dış Halka %5. Kaçış planlaması kapsama coğrafyasıdır.
- **Model çürümesi:** 7 oyun-günü terk edilen kalıp %50 ağırlık kaybeder (bkz. Çekirdek Döngü).
- **Aktif kirletme:** Mara, sahte imza enjeksiyonuyla profile yanlış veri besleyebilir (K3 müdahale + 5.000 LM veri paketi); PANOPT 2 oyun-günü yanlış karşı tedbir seçer.
- **Analog yaşam:** implant kapalı, tekerlekli klasik araçla, nakit LM ile oynanan seanslar profil beslemez — "ızgara dışı" oynayış meşru bir stildir ve Kaan'ın pasif ağacıyla güçlenir.

### Tasarım Korkulukları

- Tepki *asla* rastgele cezalandırmaz: her müdahale, oyuncunun görebileceği bir gözleme dayanır (ihlal anında ekran kenarında 0.5 sn'lik kayıt piktogramı).
- Oyuncu testlerinde hedef: oyuncuların %80'i 10. saatte "sistem beni tanıyor" cümlesini kurabilmeli; %0'ı "sistem adaletsiz" dememelidir.

---

## Beceri Ağaçları

Üç protagonist üç ayrışık ağaç taşır; ortak "Sokak Bilgisi" çekirdeği dışında düğüm paylaşımı yoktur. İlerleme çift kaynaklıdır: **Beceri Puanı** (görev/keşif; ağaç düğümü açar) ve **Ustalık** (eylemi yapmak eylemi geliştirir; düğüm içi %'lik büyüme). Toplam bütçe: karakter başına 54 düğüm, tek oyunculu kampanyada ~70'i açılabilir — build kimliği zorunludur.

### Ortak Çekirdek — Sokak Bilgisi (12 düğüm, üç karakterde ortak)

Dayanıklılık, taşıma, temel araç kullanımı, pazarlık (%–8 alım fiyatı), ilk yardım, temel K1 siber erişim.

### Mara Vex — "Hayalet Sinyal" (macenta)

| Dal | Odak | Kilit taşı (capstone) |
| --- | --- | --- |
| **Derin Dalış** | K2/K3 müdahaleler, buz kırma hızı, geri-iz savunması | **Hafıza Defteri Sızması:** bir NPC'nin PANOPT hafıza kaydını 30 sn izleyebilme — görevlerde alternatif istihbarat yolu |
| **Drone Sürüsü** | 3 drone'a kadar eşzamanlı kontrol, drone sınıfları (keşif/saldırı/sahte-imza) | **Sürü Zihni:** drone'lar Mara çatışma halindeyken otonom taktik uygular |
| **Sinyal Hırsızı** | Kamera zincirleme menzili, araç gaspı sınıfı (Buz 3→4), profil kirletme maliyeti −%50 | **Kör Nokta:** 15 sn boyunca Mara PANOPT modeline veri üretmez |

### Kaan "Ghost" Demir — "Hayalet Protokol" (camgöbeği)

| Dal | Odak | Kilit taşı |
| --- | --- | --- |
| **İnfazcı Disiplini** | Ateşli silah geri tepme −%30, zırh delici uzmanlık, taktik dolum | **Kessler Refleksi:** tehdit önceliklendirme — 3 sn'lik yavaş çekimde 3 hedef işaretleme |
| **Demir Beden** | Yakın dövüş zinciri 5 vuruşa, savuşturma penceresi 0.25→0.4 sn, şok direnci | **Ölü Adam Yürüyüşü:** ölümcül hasarda 8 sn ayakta kalma (görev başına 1) |
| **Izgara Dışı** | Analog oynayış bonusları: implantsızken hasar direnci +%15, PANOPT görsel tanıma −%40 | **Resmî Kayıtta Ölü:** Bastırma durumunda bile ilk 20 sn kimliksiz kalma |

### Solene Adeyemi — "Yörünge Ustası" (amber)

| Dal | Odak | Kilit taşı |
| --- | --- | --- |
| **Kaçakçı Pilotluğu** | Tam vektör uçuş, ısı imzası yönetimi, atmosfer girişi hasarı −%60 | **Kara Leylek Senfonisi:** Kara Leylek'te 12 sn'lik "kusursuz akış" — tüm sistemler aşırı yüklenir, iz bırakmaz |
| **Sıfır-G Harbi** | Düşük yerçekimi tam manevra, manyetik bot ustalığı, dekompresyon taktikleri | **Boşluk Dansı:** sıfır-G'de savuşturma tüm yönlerden çalışır |
| **Manifest Sihirbazı** | Kargo sahteciliği mini oyunu kolaylaşır, gümrük rüşvet ağı, kaçak yük değeri +%25 | **Görünmez Konşimento:** günde 1 kargo taraması otomatik geçilir |

**Geçiş kuralı (kanon uyumu):** karakterler arası anlık geçişte her karakter kendi ağacı, envanteri ve PANOPT profiliyle döner; kontrol edilmeyen karakterler kendi gündemlerinde Ustalık biriktirmeye devam eder (pasif, oynanan karakterin %20'si hızında).

---

## Soygun/Heist Planlama

Soygunlar LUMENFALL'un doruk içeriğidir; tek oyunculu kampanyada 7 ana soygun, Online'da sezonluk soygunlar (ilki: **Zenit Kasası** — LW-GDD-07). Üç faz: **Hazırlık → İnfaz → Kaçış.** Her faz oyuncu kararlarıyla şekillenir; iki oynayışın aynı olmaması tasarım hedefidir.

### Faz 1 — Hazırlık (oyuncu kontrollü süre, 30 dk – 3 saat)

- **İstihbarat kaynakları (en az 2'si zorunlu, 5'i mevcut):** fiziksel keşif (Kaan), sistem haritası çıkarma (Mara), tedarik/rota etüdü (Solene), NPC köstebek devşirme, satın alınmış paket (12.000–40.000 LM, Gölgepazar).
- **Yaklaşım vektörü seçimi:** her soygun 3 vektör sunar — **Gürültülü** (cephe), **Hayalet** (izsiz), **Truva** (içeriden/kılık). Vektör, gereken ekipman ve ekip kompozisyonunu belirler.
- **Ekip pazarı:** 12 kiralanabilir uzman (kasa deldirici, sürücü, keskin nişancı, sahte kimlikçi...); ücret %5–15 pay. Ucuz uzmanların "tik"leri vardır (örn. ucuz sürücü panik eşiği düşük) — risk fiyata gömülüdür.
- **Ekipman ve sahne hazırlığı:** kaçış aracı yerleştirme, teçhizat zulası (2 nokta), kılık, sahte manifesto. Hazırlıktaki her eksik, infazda dinamik komplikasyon olarak döner.
- **PANOPT etkisi:** hazırlık eylemleri de profil besler — keşif için aynı kameraya 3 kez bakmak İlgi durumu tetikleyebilir. Sabırlı oyuncu hazırlığı bölgelere ve günlere yayar.

### Faz 2 — İnfaz (25–60 dk)

- **Çok karakterli sahne:** ana soygunlarda 3 protagonist eşzamanlı sahnededir; oyuncu istediği an karakterler arasında geçer (kanon), yapay zekâ diğerlerini plana göre oynatır. Kritik anlarda "senkron kararlar" (örn. Mara kamerayı 8 sn körleştirir — Kaan o pencerede geçmek zorundadır).
- **Komplikasyon motoru:** her soygunda 3 zorunlu karar anı + PANOPT profiline göre seçilen 1–3 uyarlanabilir komplikasyon (siber ağırlıklı ekibe analog kasa; gürültücü ekibe erken Bastırma). Komplikasyonlar hazırlık kalitesiyle azalır, asla sıfırlanmaz.
- **Vazgeçme hakkı:** alarm öncesi her an geri çekilme mümkündür; harcanan hazırlık kaybedilir ama ekip ve itibar korunur. Alarm sonrası vazgeçiş ekip payını yakmaya döner.

### Faz 3 — Kaçış (5–15 dk)

- **Kaçış planı hazırlıkta seçilir** (kara konvoyu / kanal teknesi / hover koridoru / asansör kabini / yörünge çıkışı) ancak infaz sonucuna göre B planına dönülebilir — B planı hazırlanmadıysa doğaçlama kaçış PANOPT kapsama haritasına karşı oynanır.
- **Ganimet ağırlığı mekaniği:** taşınan değer kaçış performansını etkiler (tam kasa = yavaş araç, yüksek imza). "Ne kadarını bırakıyorsun?" kaçışın çekirdek kararıdır.
- **Soğuma:** soygun sonrası 2 oyun-günü *Sıcak Para* dönemi — LM aklanana dek (Gölgepazar aklayıcıları, %8–20 komisyon) harcanırsa iz bırakır.

### Ödül Yapısı

Ganimet payları: oyuncu payı + ekip payları + bölge etkisi (soyulan taraf bölge ekonomisinde zayıflar, Gerilim Endeksi +10–25). Kusursuz Hayalet infazı ("hiç tespit yok") anlatı ve itibar bonusu verir ama *daha fazla LM vermez* — stil, para ile değil kimlikle ödüllenir.

---

## Mini Oyunlar

Mini oyunlar dünyaya diegetik olarak gömülüdür; hiçbiri zorunlu tekrara dayanmaz ve tümü 15–90 sn bandında tutulur. Ortak kural: her mini oyun 3 kez başarısız olunursa alternatif çözüm yolu belirir (para, beceri düğümü veya gürültülü yol).

### Sistemik Mini Oyunlar (çekirdek döngüye bağlı)

| Mini Oyun | Bağlam | Mekanik Özeti | Süre |
| --- | --- | --- | --- |
| **Buz Kırma** | Siber müdahale K2/K3 | Akan düğüm ağında rota çizme; güvenlik izleyicisinden önce çekirdeğe ulaş | 20–45 sn |
| **Kilit/Bypass** | Analog kapılar, Izgara Dışı oynayış | Gerilim-geri bildirimli iki eksenli el hassasiyeti | 15–30 sn |
| **Manifest Sahteciliği** | Yörünge kargo taramaları (Solene) | Belge alanlarını tarayıcı sorgu sırasına karşı eşleme | 30–60 sn |
| **Geri-İz Savunması** | Kessler-Voss buz taşıyıcı karşı saldırısı | Kendi sinyal rotanı kesip sahte düğüme yönlendirme | 10 sn, yüksek baskı |
| **Aklama Masası** | Sıcak Para dönüşümü, Gölgepazar | Komisyon/hız/risk üçgeninde portföy dağıtımı | 45–90 sn |

### Dünya ve Yaşam Mini Oyunları

- **Sokak yarışları** (Neon Liman + Pas Kuşağı ligleri): sınıf kilitli ligler; kazanç LM + araç ustalığı. Hover ligi ayrı — hava koridoru ihlali yarışın parçasıdır ve PANOPT ilgisi yarış mekaniği olarak kullanılır.
- **Sıfır-G raket sporu "Halka Topu"** (Zenit Halkası): 3 dakikalık maçlar, Solene'in Sıfır-G ustalığıyla sinerjik; Online'da 2v2.
- **Kumarhane oyunları** (Neon Liman): Prizma değil, yalnız LM ile oynanır (kanon: kumar-MTX teması yasak); hedef RTP %92–96, oturum kaybı tavanı günlük 5.000 LM (sorumlu tasarım kapısı).
- **Vatandaş hafıza terminalleri** (Bahçeler, Gölgepazar): silinmiş kayıt parçalarını birleştirme bulmacası — Mara'nın Deniz arayışının (LW-GDD-04) sistemik yankısı; ödül LM değil, dünya bilgisi ve yan görev anahtarlarıdır.
- **Dikey tarım drone hasadı** (Bahçeler): kooperatiflere yardım akışı; bölge Gerilim Endeksi'ni düşüren nadir "sıfır iz" gelir kaynağı.

### Tasarım Kapıları (tüm mini oyunlar)

1. Hiçbir mini oyun ana yol üzerinde 3'ten fazla zorunlu tekrarla çıkamaz.
2. Her mini oyun en az bir beceri düğümüyle kolaylaşmalı veya atlanabilmelidir.
3. Tüm mini oyunlar tam denetleyici + klavye/fare + erişilebilirlik modu (süre baskısı kapatma) destekler.
4. Mini oyun kazançları pay-to-win yasağına tabidir: Prizma hiçbir mini oyunda girdi veya çıktı olamaz.

---

*Bu belge LUMENFALL_CANON.md'ye tabidir; çelişki durumunda kanon geçerlidir. Değişiklik önerileri LW-GDD-03 inceleme panosuna, dengeleme verileriyle birlikte iletilmelidir. — Lumenworks Tasarım Ekibi, Temmuz 2026*
