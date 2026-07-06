# LUMENFALL — Düşman AI ve Çatışma Tasarımı

| Alan | Değer |
| --- | --- |
| **Belge No** | LW-GDD-16 |
| **Sürüm** | 1.0 |
| **Tarih** | 5 Temmuz 2026 |
| **Sahip** | Çatışma Tasarımı Lideri |
| **Durum** | İnceleme |
| **Gizlilik** | Stüdyo İçi — Dağıtım Onaya Tabidir |

Bu belge, LUMENFALL'un düşman yapay zekâsını ve çatışma deneyimini tanımlar:
arketip taksonomisi, PANOPT tepki merdiveni, algı/gizlilik modeli, takım
taktik AI'ı, çatışma alanı grameri, can/hasar modeli, zorluk ve adalet
politikası ile LUMENFALL Online'daki PvE yoğunlukları. Çatışmanın üç sütunu
ve PANOPT uyarlanabilir aranma sisteminin davranış modeli **LW-GDD-03**'te,
NPC simülasyon LOD'ları ve performans bütçeleri **LW-GDD-04**'te, bölge
tehlike dereceleri (D1–D5) **LW-GDD-13**'te, zorluk eksenleri **LW-GDD-08**'de
tanımlıdır; bu belge onları **genişletir, asla yeniden tanımlamaz**. Kanonla
çelişen hiçbir karar bu belgeyle alınamaz.

---

## 1. Amaç ve Tasarım İlkeleri

Tek cümle: **"Düşman, oyuncunun geçmişinin aynasıdır."** PANOPT oyuncuyu
öğrendiği için (LW-GDD-03), sahaya çıkan güç hiçbir zaman jenerik bir dalga
değil, oyuncunun alışkanlıklarına verilen okunabilir bir cevaptır.

1. **Okunabilirlik önce gelir.** Her düşman davranışının 0,5 sn içinde
   okunabilir bir telgrafı vardır (poz, ses, ışık). Telgrafsız saldırı,
   inceleme reddi sebebidir.
2. **Her karşılaşma en az iki sütunla çözülür** (ateşli silah / yakın dövüş /
   siber — LW-GDD-03 tasarım kapısı). Bu belgedeki hiçbir arketip bu kapıyı
   ihlal edecek şekilde kurgulanamaz.
3. **Adalet ölçülür:** LW-GDD-03 hedefi bağlayıcıdır — oyuncuların %80'i
   10. saatte "sistem beni tanıyor" diyebilmeli, %0'ı "sistem adaletsiz"
   dememelidir. Bölüm 8'deki yasaklar bu hedefin mekanik güvencesidir.
4. **Ölüm tek çıktı değildir.** Oyun asla öldürmeyi zorunlu kılmaz
   (LW-GDD-03); her insan arketipinin bayıltma, kaçırtma veya teslim alma
   yolu vardır. Otonom birimler "devre dışı bırakılır".
5. **AI hile yapmaz.** Düşmanlar oyuncunun konumunu yalnız algı modeliyle
   (Bölüm 4) bilir; duvar arkası bilgi, sahnede gerekçesi olan bir sensör
   (kamera, drone, implant taraması) olmadan verilemez.

---

## 2. Düşman Arketip Taksonomisi

### 2.1 Üç Kuşak Yapısı

Düşman evreni üç kuşağa ayrılır; kuşaklar güç değil, **davranış dili ve
eskalasyon bağlamı** farkıdır:

| Kuşak | Kaynak | Bağlam | Eskalasyon tavanı |
| --- | --- | --- | --- |
| **Sokak** | 9 sokak fraksiyonu (LW-GDD-01) | Bölge kontrolü, haraç, pusu | Kendi bölgesinde çete savaşı; PANOPT'u *istemez* |
| **Korporat** | Beş megakorp güvenliği (Lumen Compact) | Tesis koruması, kontrat operasyonları | Özel av timleri; PANOPT'la paralel çalışır |
| **PANOPT Kolluk** | PANOPT yargı kolu: insan + otonom | Tepki merdiveni (Bölüm 3) | Bastırma / Silinme Protokolü (LW-GDD-03) |

### 2.2 Sokak Katmanı (fraksiyon çeteleri)

Sokak arketipleri fraksiyon kimliğiyle kaplanır (Kül Köpekleri kası ile
Karat Sendikası tahsildarı aynı iskeleti farklı silah seti ve diyalogla
kullanır). Beş taban arketip:

| Arketip | Davranış profili | Silah seti | Zayıflık |
| --- | --- | --- | --- |
| **Tetikçi** | Siper arkası kısa seriler; 3 sn'de bir pozisyon değiştirir; cesareti kalabalığına bağlı | Tabanca, SMG, "Pas işi" tüfek (tutukluk %3/şarjör — LW-GDD-03) | Zırhsız (0–10); baskı ateşinde panik eşiği düşük |
| **Kas** | Yakın mesafe kapatma; savrulma yayı geniş, telgrafı uzun (0,8 sn) | Sustalı, şok copu, pompalı | Savuşturma (0,25 sn penceresi) sonrası 1,5 sn açık kalır |
| **Gözcü** | Çatışmaya girmez; görürse 6 sn içinde telsizle takviye çağırır | Tabanca | Çağrı tamamlanmadan susturulursa takviye gelmez; K1 telsiz karıştırma ile kör edilir |
| **Sürücü** | Araçlı drive-by ve blokaj; araçtan inmez | SMG (araç içi) | Araç lastik/itici hasarına karşı savunmasız; Buz Katmanı ≤ 2 (Mara gaspı) |
| **Çete Lideri** | Jeton dağıtıcı (Bölüm 5); ölür/teslim olursa timin morali −30 | Bölgeye göre DMR veya mono-bıçak | İlk hedef alınırsa tim çözülür; sosyal yolla (itibar) çatışmasız pas geçilebilir |

**Fraksiyon lezzet kuralları:** Kül Köpekleri asla kendi mahallesinde sivil
zarar riski almaz (ateş hattına sivil girerse ateş keser); Kanalcılar suda
%20 hız avantajlı ve sonar körlüğü kullanır; Karat Sendikası önce parayla
tehdit eder (çatışma öncesi 1 diyalog çıkışı); Kervan yalnız Dış Halka'da ve
konvoy menzilinde savaşır.

### 2.3 Korporat Katman (megakorp güvenliği)

| Arketip | Şirket | Davranış profili | Silah seti | Zayıflık |
| --- | --- | --- | --- | --- |
| **Kontrat Devriyesi** | Kessler-Voss | Disiplinli ikili devriye; rutin rota + rastgele sapma (%15) | Kessler-Voss çarpma tüfeği, ağır tabanca | Rota sapması öğrenilebilir; kimlik kartı Truva vektörünü açar |
| **Tazı Timi** | Kessler-Voss | Oyuncu profiline atanan özel av timi (LW-GDD-03, Hedef ekseni); kaçış rotalarını önden keser | DMR + keskin nişancı + baskı SMG karması | Yalnız İmza eşleşmesiyle avlanır: yöntem değiştiren oyuncuya karşı 2 oyun-günü kör |
| **Levha** (ağır dış iskelet) | Kessler-Voss | Yavaş ilerleyen alan hâkimiyeti; baskı ateşi platformu | Ağır enerji fırlatıcı, gaz bombası | Sırt reaktörü (zırh ×0 bölge); K2 implant geri tepmesi 4 sn kilitler |
| **Buz Taşıyıcı** | Kessler-Voss | Siber savunma; Mara'ya geri-iz saldırısı başlatır (LW-GDD-03) | Tabanca (ikincil) | Fiziksel tehdide karşı zayıf; taşıyıcı düşerse tim K1-K2 korumasız kalır |
| **Şebeke Muhafızı** | Aeon Dynamics | Altyapı POI savunması; 2 keşif dronu yönetir | SMG + drone çağrısı | Drone bağlantısı K1 ile 8 sn kesilir; kesintide pasif kalır |
| **Basınç Timi** | Yıldırım Orbital | Sıfır-G eğitimli; manyetik bot, üç boyutlu sarma | Enerji silahları (dekompresyon-güvenli, LW-GDD-03 yörünge kuralı) | Yerçekimli ortamda agresyon −%30; kinetik dekompresyon blöfüne aşırı temkinli tepki |
| **Bahçe Muhafızı** | Mirai Biyotek | Bahçeler kule içi; ölümcül olmayan öncelik (gaz, ağ) | Şok tüfeği, yatıştırıcı fırlatıcı | Topluluk itibarı yüksek oyuncuya karşı müdahale isteksizliği |
| **Sable Eskortu** | Sable Group | VIP/medya konvoyu koruması; kamera yayını canlıysa agresyon düşer | Ağır tabanca, sinyal karıştırıcı | Yayın kesilirse (K1) düzeni bozulur; skandal korkusu sosyal kaldıraçtır |

### 2.4 PANOPT Kolluk Katmanı (insan + otonom)

İnsan kolu **Kamu Düzeni Servisi (KDS)**'dir: PANOPT yargı modülüne bağlı,
Kademe 1–2 ihlallerin (İşaretleme, Kısıtlama — LW-GDD-01) sokak yüzü.
Otonom kol, eskalasyonla sertleşen beş gövdedir:

| Birim | Tip | Davranış profili | Silah seti | Zayıflık |
| --- | --- | --- | --- | --- |
| **KDS Memuru** | İnsan | Önce sözlü uyarı; silah çekme eşiği yüksek; teslim çağrısı yapar ve kabul eder | Şok copu, tabanca | İnsan algı modeli (Bölüm 4); kalabalıkta doğruluk düşer |
| **Mercek** | Gözcü dronu | Sessiz İzleme/İlgi durumunun gözü; çatışmaya girmez, işaretler | — (sensör) | 1 el ateş/EMP ile düşer; düşüşü 20 sn kapsama boşluğu yaratır |
| **Pençe** | Müdahale dronu | İlk müdahale dalgası; sarmalayan rol alır, alçak irtifada süzülür | Hafif enerji atıcı, ağ fırlatıcı | K1 sersemletme 3 sn; duvar arkasını göremez, termali yoktur |
| **Bekçi** | Dört ayaklı yer birimi | Koridor tutma, kapı kilitleme; baskıcı rol | Çift SMG kulesi, göz kamaştırıcı | Sırt anten paneli (zırh ×0); merdiven/dikey geçişte yavaş (LW-GDD-13 dikeylik kancası) |
| **Sükût** | Ağır otonom (REGENT yetkili) | Yalnız Bastırma ve Silinme Protokolü'nde (LW-GDD-03); alanı sistematik tarar, asla acele etmez | Ağır demiryolu (rail) platformu, koordineli drone çifti | K3 alan işgaliyle 6 sn körleşir; enerji hücresi soğutma çevrimi 4 sn'de bir 1,2 sn açık verir |

**Otonom birimler termal ve düşük ışık görüşü taşımaz** — pahalı sensörler
Mercek ağına yığılmıştır; bu, "karanlık parlar" temasının çatışma karşılığıdır:
karanlık oyuncunun müttefiki kalır, ama Mercek görürse herkes görür.

### 2.5 Arketip Tasarım Kuralları

- **Üçgen bütçesi (LW-GDD-03):** her POI kompozisyonunun en az %25'i her
  sütuna karşı zayıftır; bu belgedeki zayıflık kolonu o bütçenin denetim girdisidir.
- **Sayı bütçesi:** tek oyunculu sahnede eşzamanlı aktif savaşçı AI tavanı 24
  (LOD 0 bütçesi ≤ 160 NPC içinde, LW-GDD-04); Bastırma sahnelerinde 32'ye
  yalnız Kent Yönetmeni izniyle çıkılır.
- **Karışım kuralı:** aynı sahnede en fazla 1 Levha veya 1 Sükût; ağır birim
  yalnız en az 2 kaçış rotalı arenalarda (Bölüm 6) konuşlanabilir.

---

## 3. PANOPT Tepki Merdiveni

### 3.1 Durum Makinesi (LW-GDD-03 ile bire bir)

Tepki merdiveni, LW-GDD-03'teki beş durumu **kuvvet paketlerine** bağlar.
Durumlar ve geçiş kuralları LW-GDD-03'te tanımlandığı gibidir; burada yalnız
saha karşılıkları verilir:

| Durum | Saha karşılığı | Tipik kompozisyon | Çözülme |
| --- | --- | --- | --- |
| **Sessiz İzleme** | Görünür tepki yok; Mercek rotaları sıklaşır | +2 Mercek (fark edilmesi zor) | Otomatik; veri toplandıkça |
| **İlgi** | Bakış Göstergesi yanar (LW-GDD-15 HUD); kamera/drone takibi | 2–4 Mercek, 1 KDS ikilisi yaklaşır | 90 sn temiz davranış veya kapsama boşluğu (LW-GDD-03) |
| **Müdahale** | Profil eksenine göre seçilmiş paket (3.2) | 4–10 birim, 1 tim | Görüş + defter izi kesilirse 120–240 sn'de söner |
| **Bastırma** | Bölgesel kilitleme; koridor kapanışı, sivil tahliye | 2 tim + Bekçi + Levha/Sükût; REGENT yetkisi | Yalnız Gerilim Endeksi 70+ ve büyük ihlal (LW-GDD-03); bölge terki + 1 oyun-günü |
| **Silinme Protokolü** | Anlatıya bağlı, 3. perde sonrası (LW-GDD-03) | Sükût çifti + Tazı Timi; yakalama değil *silme* doktrini | Anlatısal; LW-GDD-02 |

### 3.2 Kuvvet Paketleri (profil eksenine göre seçim)

Müdahale'de sevk edilen paket, LW-GDD-03'teki 6 eksenli davranış modelinin
baskın eksenine göre seçilir — jenerik polis dalgası yoktur:

| Baskın eksen | Okuma | Sevk edilen paket |
| --- | --- | --- |
| Yöntem: siber | Kameralar/dronlar düşüyor | Buz Taşıyıcı + hava boşluklu analog ekip (Bölüm 4.3) |
| Yöntem: gürültülü | Silah sesi yoğun | Bekçi + baskıcı ağırlıklı KDS timi |
| Kaçış: araç | Hep araçla kopuyor | Pençe koridor barikatı + Sürüş kesici KDS aracı (LW-GDD-17 kovalamaca seti) |
| Kaçış: dikey | Çatı/geçit ağı kullanıyor | Pençe çifti yüksek devriye + geçit kilidi |
| Hedef: Compact | Megakorp varlıklarına ısrar | Tazı Timi ataması (LW-GDD-03 örneğiyle bire bir) |
| İmza eşleşmesi | Aynı silah/araç/giriş | Tespit süresi −%60 (LW-GDD-03); paket 1 durum erken gelir |

### 3.3 Bölgesel Tepki Süreleri (LW-GDD-13 tehlike dereceleriyle uyum)

Kapsama yüzdeleri LW-GDD-03 + LW-GDD-13 kanonudur; D dereceleri LW-GDD-13'ten
gelir. "İlk birim varış", Müdahale kararından sahneye ilk birimin ulaşmasıdır:

| Bölge | Kapsama | Tehlike | İlgi→Müdahale tırmanışı | İlk birim varış | Bastırma uygunluğu |
| --- | --- | --- | --- | --- | --- |
| Çekirdek | %98 | D1 | 10–20 sn (şehrin en diki) | 20–40 sn | Evet — en hızlı tetiklenen bölge |
| Kordon | %95 | D2 | Çifte saat (3.4) | PANOPT 30–60 sn · Kessler-Voss 45 sn | Özel: sürgün + Kısıtlama önceliği |
| Yükseliş | %85 | D3 | 45–75 sn; gümrük ihlalinde önce Kısıtlama (LW-GDD-13) | 60–90 sn | Koridor/asansör kilidi biçiminde |
| Neon Liman | %80 | D2 | Kalabalıkta %35 daha geç (LW-GDD-13) | 90–150 sn | Nadir — sivil yoğunluğu caydırır |
| Bahçeler | %70 | D1 | 90–150 sn; müdahale nazik (LW-GDD-13) | 120–180 sn | Çok nadir |
| Pas Kuşağı | %55 | D4 | Dakikalar (LW-GDD-01/13) | 180–300 sn | Yalnız GE 70+ (bölge savaşı dönemleri) |
| Gölgepazar | %45 | D3 | 120–210 sn; boşluk haritaları satılır | 150–240 sn | Nadir |
| Sisaltı | %25 | D3 | Yalnız söylentiyle; tırmanış 300 sn+ | Çoğu zaman gelmez | Yok |
| Dış Halka | %5 | D5 | Merdiven işlemez (LW-GDD-13) | — | Yok — tehdit Kervan ve pusudur |

**Kural:** tepki süreleri Kent Yönetmeni (LW-GDD-04) tempo eğrisiyle ±%15
oynatılabilir; tablo bantlarının dışına asla çıkılmaz (Bölüm 8 yasakları).

### 3.4 Kordon Çifte Saati

Kordon'da iki bağımsız alarm saati aynı anda işler (LW-GDD-13'ün bu belgeye
devrettiği sistem): **PANOPT saati** standart merdiveni yürütür; **Kessler-Voss
saati** kontrat SLA'sıyla çalışır — ihlalden 45 sn sonra Kontrat Devriyesi,
120 sn sonra Tazı Timi. İki saat veri paylaşmaz: PANOPT'u K3 ile körleştirmek
Kessler-Voss saatini durdurmaz (analog telsiz ağı), Kessler-Voss'u atlatmak
defter kaydını silmez. Yakalanan oyuncu çoğu zaman öldürülmez; Kordon dışına
atılır ve Kısıtlama yer (LW-GDD-13 ile bire bir).

### 3.5 Tehdit Skoru (LW-GDD-14 arayüzü)

Adaptif müzik (LW-GDD-14) ve HUD gerilim göstergeleri tek skalar değerden
beslenir. Bu belgeyle kanonlaşan tanım:

```
Tehdit = min(100, (0.40 × Algı% + 0.35 × DüşmanBaskısı + 0.25 × DurumPuanı) × BölgeKatsayısı)
```

- **Algı%:** sahnedeki en yüksek NPC algı doluluğu (Bölüm 4).
- **DüşmanBaskısı:** aktif savaşçı sayısı × ortalama tehdit sınıfı, 0–100'e normalize.
- **DurumPuanı:** Sessiz İzleme 0 · İlgi 25 · Müdahale 60 · Bastırma 90 · Silinme 100.
- **BölgeKatsayısı:** tam kapsama 1.4 · standart 1.0 · çürük 0.7 · kör 0.3
  (LW-GDD-14'teki katsayılarla bire bir).

---

## 4. Algı ve Gizlilik Modeli

### 4.1 Görüş Konisi

İnsan ve otonom görüşü iki iç içe koniyle modellenir; algı 0–100 **doluluk**
olarak birikir (doluluk %40 = Şüphe, LW-GDD-14 M1 tetiğiyle uyumlu):

| Parametre | Çevresel koni | Odak konisi |
| --- | --- | --- |
| Açı | 110° | 55° |
| Taban menzil (insan) | 22 m | 38 m |
| Taban menzil (Pençe/Bekçi) | 90° / 30 m | 45° / 45 m |
| Dolum hızı (10 m, ayakta, aydınlık) | 25/sn | 60/sn |

Çarpanlar (dolum hızıyla çarpılır): ışık — aydınlık ×1.0, loş ×0.6, karanlık
×0.35 (otonomlar dahil; termal yok, Bölüm 2.4) · duruş — ayakta ×1.0, eğilme
×0.65 · hareket — sabit ×0.7, yürüme ×1.0, sprint ×1.5 · mesafe — 8 m altı
tüm çarpanlar yok sayılır, dolum 0,4 sn'de tamamlanır (yüz yüze kandırmaca yok).
Doluluk, görüş kesildikten sonra 4 sn bekleyip 10/sn hızla söner.

### 4.2 Ses Yayılımı

Her eylem bir **Gürültü Puanı (GP)** yayar; duyulma yarıçapı ve NPC tepkisi
GP'ye bağlıdır:

| Kaynak | GP | Yarıçap | NPC tepkisi |
| --- | --- | --- | --- |
| Eğilerek hareket | 5 | 3 m | Yok |
| Koşu / mantle | 15 | 8 m | Baş çevirme (doluluk +10) |
| Cam kırma, kilit zorlama | 30 | 14 m | Şüphe — kaynağa yürüme |
| Susturuculu tabanca | 35 | 16 m | Şüphe |
| Yakın dövüş bitiricisi | 40 | 12 m | Şüphe |
| Tabanca / SMG | 70 | 45 m | Alarm (kapsamadaysa defter kaydı) |
| Tüfek / pompalı | 85 | 70 m | Alarm + sivil panik otomatı (LW-GDD-04) |
| Patlama | 100 | 120 m | Alarm + Kent Yönetmeni olay kaydı |

Yüzey değiştiricileri: yağmur tüm yarıçapları ×0.8 (LW-GDD-04 hava kancası),
Sisaltı su yüzeyi ×1.2 (ses suda taşınır), iç mekân duvarı geçişte −%50.

### 4.3 Kamera Ağı ve Karşı Önlemler

- Kameralar zincir topolojisindedir (LW-GDD-03 kamera zincirleme); bir kamera
  oyuncuyu 2,5 sn kesintisiz görürse İlgi tetiklenir, tarama ışığı sarıdan
  kırmızıya döner (okunabilirlik telgrafı).
- **K1 kamera döngüsü** (LW-GDD-03) kamerayı 20 sn önceki görüntüye kilitler;
  aynı kameraya 3. kez uygulandığında PANOPT o düğümü "şüpheli" işaretler ve
  fiziksel devriye yollar — hack spam'inin doğal freni.
- **Hava boşluklu (air-gap) sistemler:** siber-ağırlıklı profile karşı tedbir
  (LW-GDD-03): analog kapalı devre kameralar hack edilemez, yalnız fiziksel
  olarak kapatılır. Görsel dil: kablolu, hantal, kırmızı bantlı gövde.
- **Geri-iz:** Kessler-Voss Buz Taşıyıcıları K2+ müdahalede geri-iz mini
  oyununu başlatır (LW-GDD-03 ile bire bir; kaybedilirse konum PANOPT'a düşer).

### 4.4 Ceset ve İz Tespiti

- Ceset/baygın beden gören NPC anında Alarm'a geçer (dolum ×4, mesafe sınırı
  yok — koni içindeyse). Kapsamalı alanda Mercek süpürmesi cesedi ortalama 12
  sn'de tespit eder ve defter kaydı düşer.
- Bedenler taşınabilir (taşırken hareket ×0.6, GP +10). Kör bölgede
  saklanan beden yalnız insan tanıkla bulunur (Dış Halka istisnası, LW-GDD-04).
- İkincil izler: kan lekesi (doluluk +20 şüphe), açık bırakılmış kapı (+10),
  devre dışı kamera (+15, yalnız teknisyen arketipleri fark eder), kırık cam
  (+15). İzler Sahne deltası kuralıyla 3 oyun-günü söner (LW-GDD-04).

### 4.5 Şüphe → Alarm Durum Makinesi (NPC düzeyi)

| Durum | Giriş | Davranış | Çıkış |
| --- | --- | --- | --- |
| **Habersiz** | Varsayılan | Rutin (LW-GDD-04 çizelgesi) | Doluluk > 0 |
| **Tetikte** | Doluluk 1–39 veya GP olayı | Baş çevirme, duraksama, "kim var orada?" | 10 sn temizse Habersiz |
| **Şüphe** | Doluluk 40–99 | Kaynağa yürüme, el feneri/sensör taraması, tekli telsiz kontrolü | 30 sn bulgusuzsa Tetikte; bulgu varsa Arama |
| **Arama** | İz bulgusu veya kayıp temas | İkili tarama düzeni, son bilinen konum çevresi 15 m | 60 sn bulgusuzsa Şüphe'ye düşer, rutin bozuk kalır |
| **Alarm** | Doluluk 100, ceset, silah sesi (GP ≥ 70) | Çatışma + telsiz bildirimi; kapsamadaysa PANOPT defterine ihlal yazılır → Bölüm 3 merdiveni devralır | Çatışma çözümü |

NPC hafızası: Alarm yaşayan NPC'ler o seansta Habersiz'e dönmez (taban durumu
Tetikte kalır); kişisel hafıza eşiğini aşan olaylar `CitizenRecord`'a yazılır
(LW-GDD-04 — "dün beni soyan adam" diyaloğu buradan beslenir).

---

## 5. Takım Taktik AI

### 5.1 Çatışma Yönetmeni ve Rol Atama

Sahne başına bir **Çatışma Yönetmeni** (Kent Yönetmeni'nin çatışma ölçeğindeki
kardeşi, LW-GDD-04) çalışır; 2 sn'de bir durumu değerlendirir ve dört rolü
yeniden atar:

| Rol | Görev | Atama kriteri | Okunabilirlik telgrafı |
| --- | --- | --- | --- |
| **Baskıcı** | Oyuncuyu siperde kilitleyen sürekli ateş | Otomatik silah + cephane üstünlüğü | Uzun seri sesi + "başını kaldırma!" barkı |
| **Sarmalayan** | Görüş dışından kanat açma | Oyuncu görüş konisinin dışındaki en yakın birim | Koşu ayak sesi + tim içi "sağdan dolanıyorum" |
| **Keskin Nişancı** | Yüksek nokta tutma; siper değişim anını cezalandırma | Dikey erişimi olan uzun menzilli birim | Lazer/parıltı izi 1,2 sn nişan telgrafı |
| **Destek** | Yaralı çekme, cephane, drone/buz yönetimi | Buz Taşıyıcı, Şebeke Muhafızı, sağlıkçı | Görünür sırt çantası/anten silueti |

Kurallar: aynı anda en fazla 1 Keskin Nişancı ve 2 Sarmalayan; sarmalama
rotası her zaman en az bir kez oyuncunun duyabileceği mesafeden (GP 15) geçer —
"arkadan bıçaklanma" hissi yasaktır, sarmalama *duyurulur*.

### 5.2 Saldırı Jetonu Ekonomisi

Oyuncuya aynı anda etkili ateş açabilecek düşman sayısı **jetonla** sınırlıdır
(kaosun okunabilirliği). Jeton sayısı zorluk kademesine bağlıdır (Bölüm 8):
Kademe 1'de 2, Kademe 3'te 3, Kademe 5'te 5. Jetonsuz düşmanlar pozisyon alır,
baskı ateşi yapar (isabet beklentisi düşük, kasıtlı ıska konisi geniş) veya
yeniden dolum yapar. Yakın dövüşte eşzamanlı saldırı jetonu her kademede 2'dir;
kalabalık, çember daraltarak tehdit eder — hepsi birden vurmaz.

### 5.3 Moral, Geri Çekilme ve Teslim Olma

Her tim 0–100 **moral** taşır. Düşüşler: lider kaybı −30, tim kaybı %50'yi
aşınca −25, Levha/Sükût gibi "çapa" biriminin düşüşü −20, oyuncunun 10 sn
içinde 3 hedefi devirmesi −15. Eşikler:

- **Moral < 40 — Temkin:** siperden çıkış sıklığı yarıya iner, jeton kullanımı
  azalır, telsizle takviye istenir.
- **Moral < 25 — Çekilme:** tim, önceden işaretli kaçış rotasından düzenli
  geri çekilir (koşarak dağılma değil; kapı tutarak, dönüşümlü ateşle).
  Korporat birimler çekilir ama teslim olmaz (kontrat cezası kurgusu).
- **Moral < 10 — Kırılma (yalnız sokak katmanı ve KDS):** silah bırakma,
  eller yukarı, pazarlık diyaloğu. Teslim olan NPC'ye ateş etmek fraksiyon
  itibarını (LW-GDD-01) ve topluluk tepkisini derhal düşürür; teslim alınan
  düşman bağlanabilir (ölümcül olmayan yol tamamlayıcısı).
- Otonom birimler moral taşımaz; ağır hasarda kademeli sistem arızası sergiler
  (topallama, sensör kıvılcımı) — "korkusuz makine" hissi bilinçlidir.

Kaçan/teslim olan NPC'ler olay bağı havuzuna yazılır (LW-GDD-04): aynı çeteyle
ikinci karşılaşmada "seni hatırlıyorum" diyaloğu ve moral taban −10 uygulanır.

---

## 6. Çatışma Alanı Tasarım İlkeleri

Seviye tasarımıyla (LW-GDD-13) paylaşılan bağlayıcı gramer:

1. **Siper dili standarttır:** tam siper 1,10 m ± 5 cm, yarım siper 0,65 m
   ± 5 cm; bu iki yükseklik dışında siper amaçlı geometri konamaz. Siperler
   arası sıçrama mesafesi 4–7 m bandındadır (jeton sistemi bu banda ayarlıdır).
2. **Tahrip edilebilirlik okunur:** kırılgan siper (sac, cam, sandık) görsel
   dilde her zaman ayrışır; kırılma 3 kademelidir ve baskı ateşi kırılgan
   siperi 6–10 sn'de eritir — kamp etmenin doğal freni.
3. **Dikeylik zorunludur:** her çatışma POI'sinde en az 2 dikey katman
   (LW-GDD-13 katman şablonları) ve katmanlar arası en az 2 geçiş bulunur;
   Keskin Nişancı rolü ancak dikey katman varsa atanabilir.
4. **Kaçış yolları:** her arena en az 2 zemin kaçış rotası + 1 katman değişimi
   sunar; "tek kapılı ölüm odası" yalnız anlatı onaylı istisnadır (LW-GDD-11
   kapsama beyanıyla). Kaçış rotalarından en az biri kapsama boşluğuna bağlanır
   (İlgi'nin 90 sn kuralıyla oynanabilirlik).
5. **Üçgen bütçesi denetimi:** POI kompozisyonu %25 kuralına (LW-GDD-03)
   otomatik denetimden geçer; ihlal, gece derlemesinde içerik kilidi tetikler
   (LW-GDD-04 kapı pratiğiyle aynı mekanizma).
6. **Sivil kural:** sivil yoğun sahnelerde (Neon Liman, Bahçeler) çatışma
   alanı sınırları panik akış alanlarına (LW-GDD-04 hücresel otomat) göre
   çizilir; sivil kaçış koridoru düşman sarmalama rotasıyla çakışamaz.

---

## 7. Can, Hasar ve Zırh Modeli

### 7.1 Vücut Bölgesi Çarpanları ve TTK

LW-GDD-03 kanonu bağlayıcıdır: **kafa ×2.5 · gövde ×1.0 · uzuv ×0.7**; TTK
hedefi eşit seviyeli düşmana gövdeden 0,8–1,4 sn. Bu belgenin eklediği ayrım:

| Hedef sınıfı | Sağlık | Zırh değeri | Gövde TTK hedefi (Kademe 3) | Not |
| --- | --- | --- | --- | --- |
| Sokak (Tetikçi/Gözcü) | 90–120 | 0–10 | 0,8–1,1 sn | Kafa vuruşu tek atım bandı |
| Sokak (Kas/Lider) | 130–160 | 10–20 | 1,0–1,4 sn | — |
| Korporat devriye | 140–180 | 25–40 | 1,2–1,6 sn | Zırh delici ile kanon bandına iner |
| Tazı Timi üyesi | 160–200 | 35–45 | 1,4–1,8 sn | Elit; sahnede en fazla 4 |
| Levha (dış iskelet) | 320 | 60 (sırt ×0) | Zayıf nokta odaklı 6–9 sn | "Bulmaca düşman" — DPS yarışı değil |
| Pençe / Bekçi | 110 / 240 | — / 50 (anten ×0) | 0,9 sn / 4–6 sn | EMP/K1 ile kısa devre yolu |
| Sükût | 900 | 70 (soğutma çevriminde 0) | Sahne hedefi: çatışma değil kaçış | Yenilgisi anlatı/sahne tasarımı gerektirir |

Zırh matematiği: `etkili hasar = taban × bölge çarpanı × (1 − max(0, Zırh − AP) / 100)`.
AP (zırh delme) silah gövdesinde tanımlıdır: tabancalar 0–10, çarpma tüfekleri
15–25, demiryolu tüfekleri 45–60, mono-bıçak zırhı tümüyle yok sayar (LW-GDD-03).

### 7.2 Oyuncu Tarafı

- Sağlık 100 taban (beceri ile 130); zırh plakası 0–100 ayrı havuz, önce
  plaka erir. Sağlık otomatik yenilenmez; enjektör (3 slot) veya güvenli alan
  gerekir — "köşede bekleyip iyileşme" temposu bilinçli olarak reddedilir.
- **TTD hedefi (Kademe 3):** tam baskı altında 2,5–4,0 sn — tek karede ölüm
  yalnız keskin nişancı kafa vuruşuyla ve nişan telgrafı (1,2 sn lazer izi)
  sonrasında mümkündür.
- Vücut bölgesi çarpanları oyuncuya da simetrik uygulanır (kafa ×2.5); adalet
  ilkesi gereği kurallar iki yönde aynıdır.
- Dekompresyon (yörünge, LW-GDD-03): 20 sn'lik ortam tehlikesi iki tarafı da
  eşit etkiler; Basınç Timi bu yüzden enerji silahı taşır — oyuncunun taktik
  tercihi (kinetikle cam patlatmak) meşru ama iki ucu keskin kalır.

---

## 8. Zorluk ve Adalet

### 8.1 Çatışma Zorluk Kademeleri (LW-GDD-08 ekseniyle bire bir: 5 kademe)

| Parametre | Kademe 1 | Kademe 2 | Kademe 3 (referans) | Kademe 4 | Kademe 5 |
| --- | --- | --- | --- | --- | --- |
| Düşman isabet olasılığı (orta menzil) | %12 | %20 | %30 | %40 | %50 |
| Düşmanın oyuncuya hasarı | ×0.6 | ×0.8 | ×1.0 | ×1.25 | ×1.5 |
| Saldırı jetonu | 2 | 2 | 3 | 4 | 5 |
| İlk ateş gecikmesi (görüşten ateşe) | 1,5 sn | 1,2 sn | 0,9 sn | 0,6 sn | 0,4 sn |
| Sarmalama agresifliği | Pasif | Düşük | Standart | Yüksek | Sürekli |
| Moral kırılma eşiği | 20 | 15 | 10 | 8 | 5 |

Kademeler LW-GDD-08 kuralınca her an, ceza olmaksızın değiştirilebilir; PANOPT
baskısı ve öğrenme sınırı **ayrı eksendir** ve bu tabloyu etkilemez.

### 8.2 Dinamik Zorluk Sınırları — Yasaklar Listesi

Kent Yönetmeni ve Çatışma Yönetmeni'nin dinamik ayar yetkisi dar ve şeffaftır.
**İzinli:** takviye dalga zamanlaması ±%15, jetonsuz düşmanların ıska konisi,
komplikasyon seçimi (LW-GDD-03 soygun motoru), tepki süresi bandı içi oynama
(3.3). **Kesin yasak (denetim aracı her sürümde doğrular):**

1. Oyuncunun mermisi, enjektörü veya LM'si **asla** gizlice eksiltilmez/artırılmaz.
2. Düşman sağlığı/zırhı çatışma başladıktan sonra **asla** değişmez.
3. Düşman isabet olasılığı, oyuncunun düşük sağlığına göre **asla** gizlice
   düşürülmez veya yükseltilmez ("sinematik son mermi" sahteciliği yasak).
4. TTK/TTD değerleri performans (kare hızı) durumuna göre **asla** ölçeklenmez.
5. PANOPT tepki süreleri 3.3 tablosunun bandı dışına **asla** çıkarılmaz —
   "hikâye gerektiriyor" istisnası yalnız LW-GDD-11 kapsama beyanıyla alınır.
6. Hiçbir dinamik ayar oyuncuya görünmez avantaj olarak pazarlanamaz; ayar
   yüzeyleri LW-GDD-08 zorluk eksenleridir, gizli el değildir.

### 8.3 Nişan Yardımı Politikası (LW-GDD-08: 4 kademe)

| Kademe | İçerik | Sınır |
| --- | --- | --- |
| Kapalı | Ham girdi | — |
| Hafif | Hedef yakınında hassasiyet sönümleme (%15) | Mermi mıknatısı yok |
| Standart (gamepad varsayılanı) | Sönümleme %30 + yumuşak takip | Takip yalnız görüş içi hedefe; duvar arkası kilitlenme yok |
| Güçlü (erişilebilirlik) | Sönümleme %50 + yarı kilit | Tek oyunculu ve PvE'de sınırsız; PvP modlarında Standart'a kilitlenir |

Çapraz platform PvP'de lobiler girdi cihazına göre dengelenir (LW-GDD-10);
nişan yardımı hiçbir kademede kafa çarpanını değiştirmez ve hiçbir koşulda
gerçek parayla iyileştirilemez (pay-to-win yasağı — kanon).

---

## 9. Multiplayer'da AI (LW-GDD-10 modları)

Sunucu otoriteli simülasyon (LW-GDD-10) gereği tüm AI kararları sunucuda koşar.
PvE yoğunluk hedefleri:

| Mod | PANOPT eskalasyon tavanı | Eşzamanlı savaşçı AI tavanı | Yoğunluk kuralı |
| --- | --- | --- | --- |
| **Bölge Savaşları** (4v4v4, 25 dk) | Müdahale (Bastırma pencereyi bozar — bkz. Açık Soru 5) | 24 | Gürültü ölçer crew başına tutulur; savaşı büyüten crew ortak düşman kazanır (LW-GDD-10 ile bire bir) |
| **Zenit Kasası** (PvE, 4 kişi) | Senaryo kontrollü | Kademe 1: 32 · Kademe 2: 44 · Kademe 3: 56 | Finalde Basınç Timi + dekompresyon kuralı; Kademe 3'te ölüm o deneme için kalıcı (LW-GDD-10) |
| **Kaçakçılık Ligi** (8 crew, 20 dk) | İlgi (yalnız koridor dronları) | 12 | AI, PvP'nin hakemi değil dokusu: kızıl iz taşıyan araca Pençe rota tacizi, saf korsanlığa ekstra PANOPT ilgisi |
| **Serbest Dolaşım** (40 oyuncu) | Tam merdiven (Bastırma dahil, GE 70+ kuralıyla) | Shard başına 120; oyuncu çevresi yerel tavan 16 | Dinamik olaylar shard geneli (LW-GDD-04/10); "kanun dışı" işaretli olmayan oyuncuya AI saldırmaz |

- **Profil ayrımı:** PANOPT davranış modeli Online'da oyuncu hesabı başına
  tutulur (tek oyunculudaki üç protagonist profili gibi — LW-GDD-03); crew
  içinde profiller birleştirilmez, en yüksek durum kademesi sahneye hükmeder
  (LW-GDD-14 crew kuralıyla simetrik).
- **Adalet simetrisi:** 8.2 yasakları Online'da da geçerlidir; PvE yoğunluğu
  crew becerisine göre gizlice ölçeklenmez, yalnız seçilen kademeye göre değişir.
- **Sığınak shard'ları** (LW-GDD-10): ilk 10 saat oyuncularının shard'larında
  eskalasyon tavanı Müdahale'dir ve Tazı Timi ataması yapılmaz.

---

## 10. Performans ve Telemetri Kapıları

- Savaşçı AI, LW-GDD-04 kare bütçesinin "NPC LOD 0–1" kalemi (3,2 ms) içinde
  yaşar; savaşçı başına hedef maliyet 45 µs, Çatışma Yönetmeni sahne başına
  0,15 ms. Bütçe aşımı üç gece üst üste sürerse içerik kilidi (LW-GDD-04).
- Algı sorguları PANOPT sorgu kaleminden (0,5 ms) pay alır; bütçe aşımında
  sorgu kuyruğu ertelenir — erteleme asla oyuncu aleyhine tespit üretmez
  (kuyruktaki tespit gecikir, ışınlanmaz).
- **Telemetri kabul kriterleri (lansman kapısı):** ölümlerin ≥ %85'i oyuncu
  anketinde "benim hatamdı" olarak işaretlenmeli; tek karşılaşmada aynı
  sütunla üçüncü tekrar oranı ≤ %30 (üçgen bütçesi sağlığı); teslim olma
  mekaniğinin fark edilme oranı 10. saatte ≥ %60.

---

## 11. Açık Sorular

1. **Kordon çifte saati ve ödül çakışması:** Kessler-Voss saati atlatılıp
   PANOPT saatine yakalanmak (veya tersi) itibar/defter sonuçlarında nasıl
   ayrışmalı? İki ayrı sonuç tablosu mu, tek birleşik ihlal kaydı mı?
2. **Sükût ve ölümcül olmayan yol:** "Oyun asla öldürmeyi zorunlu kılmaz"
   ilkesi (LW-GDD-03) Silinme Protokolü sahnelerinde Sükût'a karşı nasıl
   korunur — devre dışı bırakma her sahnede garanti mi, yoksa kaçış her zaman
   meşru çözüm sayılıp yeterli mi?
3. **Nişan yardımı Güçlü kademesi:** PvP'de Standart'a kilitleme, erişilebilirlik
   taahhüdümüzle (LW-GDD-08) geriliyor. Kaçakçılık Ligi gibi araç ağırlıklı
   PvP'de Güçlü kademeye izin verilebilir mi?
4. **Teslim olan NPC'lerin kalıcılığı:** Kırılma sonrası bağlanan düşmanlar
   olay bağı havuzuna (LW-GDD-04, 200.000 kayıt) yazılıyor; çatışma başına
   üst sınır kaç kayıt olmalı ki havuz soygun seanslarında taşmasın?
5. **Bölge Savaşları eskalasyon tavanı:** Müdahale tavanı üçüncü-taraf
   stratejisini zayıflatıyor olabilir; 25 dk pencerenin son 5 dakikasında
   Bastırma'ya izin veren bir "kıyamet saati" varyantı test edilmeli mi?
6. **Kademe 5 jeton sayısı:** 5 jeton + %50 isabet, TTD hedefini (2,5–4 sn)
   bandın altına itiyor; Kademe 5 için TTD bandı ayrı mı tanımlanmalı, yoksa jeton
   5→4'e mi çekilmeli? Playtest verisi bekleniyor.

---

## Sürüm Geçmişi

| Sürüm | Tarih | Yazar | Değişiklik |
| --- | --- | --- | --- |
| 1.0 | 5 Temmuz 2026 | Çatışma Tasarımı Lideri | İlk sürüm |

## Kurgusallık Notu

Bu belge bir **konsept çalışmasıdır**. LUMENFALL, Lumenworks Studios, Duskforge
Engine, PANOPT, REGENT ve burada geçen tüm kişi, kurum, ürün, birim ve olaylar
tamamen kurgusaldır; gerçek kişi, kurum veya ürünlerle benzerlikler tesadüfidir.
Belirtilen sayılar, süreler ve teknik hedefler dengelemeye açık tasarım
değerleridir ve herhangi bir ticari taahhüt oluşturmaz.
