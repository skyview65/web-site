# LUMENFALL — Ses ve Müzik

> **"Karanlık parlar."** — ve biz onu duyulur kılarız.

| Alan | Değer |
| --- | --- |
| **Belge No** | LW-GDD-14 |
| **Sürüm** | 1.0 |
| **Tarih** | 5 Temmuz 2026 |
| **Sahip** | Ses Direktörü |
| **Durum** | İnceleme |
| **Gizlilik** | Stüdyo İçi — Dağıtım Onaya Tabidir |

Bu belge, **LUMENFALL**'un işitsel kimliğini tanımlar: adaptif müzik sistemi,
radyo ekosistemi ve DJ karakterleri, kurgusal sanatçı kataloğu ve orijinal
skor stratejisi, Duskforge Engine üzerindeki ses mimarisi, 12 dilli
seslendirme hattı ve miks hedefleri. Dünya zemini için `01-dunya-ve-lore.md`
(LW-GDD-01), aranma/çatışma tetikleri için LW-GDD-03 ve LW-GDD-16, sezonluk
içerik kadansı için LW-GDD-06, erişilebilirlik gereksinimleri için LW-GDD-08
bağlayıcıdır. Kanonla çelişen hiçbir karar bu belgeyle alınamaz.

---

## 1. Ses Vizyonu: "Şehir Bir Enstrümandır"

Lumenfall'da ses, görüntünün süsü değil, dünyanın ikinci gövdesidir. 310 km²
kesintisiz şehir ve yörünge katmanı, tek bir kompozisyon gibi ele alınır:
Çekirdek'in akustik panelli sessizliği bas notası, Neon Liman'ın kalabalığı
perküsyon, Yükseliş'in her 90 saniyede göğe tırmanan kabini metronomdur.
Oyuncu bölge değiştirdiğinde yükleme ekranı görmez (kanon: %100 kesintisiz
dünya); dolayısıyla bölge sınırını **kulağıyla** geçer — ses, haritanın
görünmez mimarisidir.

### 1.1 Ses Sütunları

| # | Sütun | Tanım | Ölçüt |
| --- | --- | --- | --- |
| 1 | **Şehir bir enstrümandır** | Her bölgenin ayırt edici bir "akort"u vardır; ambiyans, müzik ve radyo aynı tonal merkezde buluşur | Kör test: oyuncu ekrana bakmadan 10 sn içinde bölgeyi %80 doğrulukla tanır |
| 2 | **Işık = ses** | "Karanlık parlar" ilkesinin işitsel karşılığı: gözetim yoğun bölgeler steril ve sıkıştırılmış, kör bölgeler geniş ve dinamik duyulur | Çekirdek LRA ≤ 6 LU · Sisaltı/Dış Halka LRA ≥ 14 LU |
| 3 | **Ses bilgidir** | PANOPT tarama başlangıcı, kovalamaca eşiği, piyasa dalgası — kritik her sistemin duyulur bir imzası vardır; hiçbir imza tek kanala mahkûm değildir (LW-GDD-08) | Her kritik ses uyarısının görsel + haptik eşleniği lansmanda %100 |
| 4 | **Sessizlik pahalıdır** | Tam sessizlik yalnızca üç yerde kullanılır: yörünge dış çekimleri, Karartma anması sahneleri, REGENT anomali anları. Böylece sessizlik dramatik para birimi olarak korunur | Sessizlik kullanımı sahne başına Ses Direktörü onayına tabidir |

### 1.2 Protagonist Ses İmzaları

Üç protagonistin aksan renkleri (LW-GDD-08) işitsel karşılıklarıyla eşlenir;
karakterler arası geçiş anında müzik paleti 2 ölçü içinde döner:

| Protagonist | Renk | Tını Paleti | Leitmotif Tanımı |
| --- | --- | --- | --- |
| Mara Vex | Macenta | Granüler sentez, cam armonikler, bit-kırık arpler | 5 notalık soru cümlesi; hiçbir zaman çözülmez — Deniz bulunana dek eksik kalır |
| Kaan "Ghost" Demir | Camgöbeği | Alçak bakır nefesliler, dökümhane metal perküsyonu, sub-bas | 3 notalık ağır adım motifi; resmî kayıtlarda ölü bir adamın nabzı |
| Solene Adeyemi | Amber | Analog arpejiyatör, yaylı flajöleler, telsiz cızırtısı dokusu | Yükselen 6'lı aralık; Kara Leylek kokpit uyarı tonundan türetilmiştir |

---

## 2. Adaptif Müzik Sistemi

### 2.1 Katmanlı Stem Mimarisi

Her müzik parçası ("cue") 8 stem'e bölünmüş olarak teslim edilir ve
Duskforge Rezonans (bkz. Bölüm 5) çalışma zamanında karıştırır. Stem'ler
yoğunluk seviyesi 0–4 arasında kademeli açılır:

| Stem | İçerik | Y0 Keşif-sakin | Y1 Keşif | Y2 Gerilim | Y3 Çatışma | Y4 Kovalamaca |
| --- | --- | --- | --- | --- | --- | --- |
| S1 Dron/alt bas | Tonal zemin | ● | ● | ● | ● | ● |
| S2 Ritim A | Ana perküsyon | — | ○ | ● | ● | ● |
| S3 Ritim B | Metal/foley perküsyon | — | — | ○ | ● | ● |
| S4 Armonik doku | Pad, koro, rezonans | ● | ● | ● | ○ | — |
| S5 Ostinato | Sürücü figür | — | — | ● | ● | ● |
| S6 Melodi/leitmotif | Karakter ve bölge teması | ○ | ● | — | ○ | ● |
| S7 Tehdit katmanı | Dissonant küme, PANOPT sinyal dokusu | — | — | ○ | ● | ● |
| S8 Aksan havuzu | Stinger, geçiş vuruşları | tetiklemeli | tetiklemeli | tetiklemeli | tetiklemeli | tetiklemeli |

(● = tam seviye · ○ = −6 dB kısmi · — = kapalı)

- Stem başına döngü uzunluğu 8–32 ölçü; tüm stem'ler aynı tempo ızgarasını
  ve ortak bir "senkron kafası"nı paylaşır.
- Tempo aileleri bölgeye göre: Çekirdek/Kordon 60–84 BPM · Neon Liman/
  Gölgepazar 96–124 BPM · Pas Kuşağı/Yükseliş 100–140 BPM · Sisaltı/Bahçeler
  72–96 BPM · Dış Halka 84–108 BPM · Zenit Halkası 66–90 BPM.
- Bellek hedefi: aynı anda önyüklü en fazla 3 cue × 8 stem (bkz. 5.4).

### 2.2 Durum Makinesi

Müzik durumu, PANOPT tepki merdiveni (LW-GDD-16) ve aranma sistemi
(LW-GDD-03) telemetrisinden beslenir. Beş ana durum:

| Durum | Giriş Koşulu | Yoğunluk | Çıkış Koşulu |
| --- | --- | --- | --- |
| **M0 Keşif** | Varsayılan; tehdit skoru < 20 | Y0–Y1 | Tehdit skoru ≥ 20 veya görev tetiği |
| **M1 Gerilim** | PANOPT tarama başlangıcı, algı ≥ %40, kısıtlı alana giriş | Y2 | Çatışma başlar → M2; 30 sn temiz kalınırsa → M0 |
| **M2 Çatışma** | İlk silah sesi / açık alarm / dövüş kilidi | Y3 | Tüm düşmanlar etkisiz → M4; araçla kopuş → M3 |
| **M3 Kovalamaca** | Aktif takip + hız > 60 km/s veya hava koridoru ihlali | Y4 | Takip kaybı (PANOPT "iz kaybedildi" olayı) → M4 |
| **M4 Kaçış-sonrası** | M2/M3'ten temiz çıkış | Y1'e sönümlenen özel cue | 45–90 sn sonra → M0 |

- **Tehdit skoru** 0–100 arası tek skalar değerdir: algı yüzdesi, aktif
  düşman sayısı, PANOPT kademe seviyesi ve bölge kapsama katsayısının
  (Çekirdek 1,4 · standart 1,0 · çürük 0,7 · kör 0,3) ağırlıklı toplamı.
- **M4 kuralı:** Kaçış-sonrası cue her bölgede farklıdır ve daima o bölgenin
  ana temasının "yorgun" bir varyasyonudur — oyuncuya "atlattın ama şehir
  seni gördü" hissi verir. M4 atlanamaz; çatışmadan doğrudan keşfe düşmek
  müziği yalancı çıkarır.
- **Kör bölge istisnası:** Sisaltı ve Dış Halka'da M1'e giriş eşiği 20 →
  35'e çıkar; PANOPT'un görmediği yerde müzik de daha geç panikler. Bu,
  "karanlık parlar" temasının sistemik ifadesidir.
- **Online:** LUMENFALL Online'da durum makinesi crew düzeyinde çalışır;
  4 üyenin en yüksek tehdit skoru belirleyicidir, ancak 40 kişilik serbest
  dolaşımda yalnız yerel çatışmalar müziği yükseltir (sunucu geneli değil).

### 2.3 Geçiş Kuralları ve Ölçü Senkronu

| Geçiş | Yöntem | Senkron Noktası | Azami Gecikme |
| --- | --- | --- | --- |
| M0 → M1 | Stem ekleme (S5, kısmi S7) | Sonraki ölçü başı | 1 ölçü (~2,0 sn @120 BPM) |
| M1 → M2 | Stinger + stem seti değişimi | Sonraki yarım ölçü; stinger anında çalar, stem'ler vuruşta döner | Algısal 0 sn (stinger maskeler) |
| M2 → M3 | Cue değişimi (kovalamaca seti) | Sonraki ölçü başı; tempo köprüsü ±%8 rubato ile hizalar | 1 ölçü |
| M2/M3 → M4 | 4 ölçülük çözülme kuyruğu + çapraz geçiş | Fraz sonu (8 ölçü ızgarası) | 8 sn |
| M4 → M0 | 6–8 sn çapraz sönümleme | Serbest | 8 sn |
| Bölge sınırı geçişi | Ambiyans + radyo anında, skor fraz sonunda | Fraz sonu | 16 sn (skor), 0 sn (ambiyans) |

Kurallar:

1. **Yükselme hızlı, çözülme yavaş:** Tehdide tırmanış en geç 1 ölçüde
   duyulur; sakinleşme asla 4 ölçüden kısa sürmez. Ters yönlü ayarlama
   oyuncuda "müzik yalan söylüyor" hissi yaratır ve yasaktır.
2. **Stinger bütçesi:** Cue başına en az 6 stinger varyasyonu; aynı stinger
   art arda iki kez seçilemez (son-2 kuyruğu).
3. **Anahtar uyumu:** Bölge temaları beşliler çemberinde komşu tonlara
   yazılır; sınır geçişlerinde modülasyon köprüleri en fazla 2 akorluktur.
4. **Diyalog önceliği:** Ara sahne ve görev diyaloğu sırasında S6 melodi
   stem'i otomatik −9 dB ("ducking", 250 ms atak / 1,2 sn bırakma).

---

## 3. Radyo Ekosistemi

Radyo, Lumenfall'un kültürel haritasıdır (LW-GDD-01: "Radyo istasyonları bu
haritayı takip eder"). 10 istasyon; 9 bölge + Zenit Halkası'nı kapsar. Tüm
araçlarda (200+ araç, LW-GDD-17), crew üslerinde ve dünya kaynaklı
hoparlörlerde çalar. Aynı olayın Sable ekranındaki ve korsan yayındaki iki
ayrı versiyonunu duyurma ilkesi (LW-GDD-01) radyonun anlatı görevidir.

### 3.1 İstasyon Kataloğu

| # | İstasyon | Frekans | Tür | Bölge / Kültür Bağı | İşletmeci |
| --- | --- | --- | --- | --- | --- |
| 1 | **YY-1 "Yurttaş Yayını"** | 100,0 | Resmî anons + onaylı sakin elektronik | Tüm bölgeler; PANOPT'un kamusal yüzü | Aeon Dynamics adına PANOPT |
| 2 | **Sinyal** | Frekans atlamalı ("kanal 11") | Korsan yayın: karşı-haber, kayıt dışı müzik | Gölgepazar merkezli, şehir geneli | Silinmişler'e yakın anonim ağ |
| 3 | **Meridyen FM** | 98,3 | Senteze doymuş gece popu | Neon Liman; Meridyen Kumarhanesi kültürü | Karat Sendikası (Sable lisansıyla) |
| 4 | **DÖKÜM 99** | 99,9 | Metal perküsyonlu endüstriyel | Pas Kuşağı; dökümhane ve kaçak yarış kültürü | Bağımsız (Kül Köpekleri himayesinde) |
| 5 | **Sis Feneri** | 89,4 | Su yankılı balladlar, liman şansonları | Sisaltı; tekne pazarı ve 94 Ateşkesi kültürü | Kanalcılar aile kooperatifi |
| 6 | **Halat Hattı** | 107,8 | Pilot rock'ı, kalkış duyuruları, yörünge folk'u | Yükseliş; asansör ve mekik kültürü | İrtifa Loncası |
| 7 | **Kök Radyo** | 90,7 | Akustik imece şarkıları, kule folk'u | Bahçeler; kooperatif ve çatı sofrası kültürü | Kök Sendikası |
| 8 | **Beyaz Oda** | 104,5 | Neo-klasik, ambient, küratörlü sessizlik | Kordon; statü ve "drone bülbül" estetiği | Sable Group prestij kanalı |
| 9 | **Kervan Sesi** | 87.5 (gezici verici) | Jeneratör ritimli kervan şarkıları | Dış Halka; konvoy ve kamp ateşi kültürü | Kervan |
| 10 | **Zenit Orbit** | 105,3 | Sıfır-G lounge, yörünge dub'ı | Zenit Halkası; transit işçi koğuşları | Bağımsız (Yıldırım Orbital'in göz yumduğu) |

Erişim kuralı: bölgesel istasyonların sinyali kendi bölgesinde temiz, komşu
bölgelerde cızırtılıdır; YY-1 her yerde kusursuzdur (bunun kendisi bir dünya
anlatısıdır). Sinyal yalnızca çürük ve kör kapsamada net duyulur.

### 3.2 DJ Karakterleri ve Program Örnekleri

| İstasyon | DJ / Ses | Kişilik | Örnek Program İçeriği |
| --- | --- | --- | --- |
| YY-1 | **Kibar Ses** (PANOPT'un cinsiyetsiz kamusal sesi; sunucu yok) | Yumuşak, sabırlı, ürkütücü derecede nazik | "Günün Işık Bütçesi" (bölge enerji karneleri) · trafik orkestrasyonu · ceza kademesi duyuruları: "Bugün 214 yurttaş İşaretleme aldı. Güvendesiniz. Görüyoruz." |
| Sinyal | **Eko** (ses maskeli; birden fazla kişinin aynı maskeyi paylaştığı söylenir) | Alaycı, öfkeli, kırılgan anlarda şaşırtıcı biçimde şefkatli | "Defter Dışı" karşı-haber bülteni · "Gözsüz Sokaklar" (o haftanın kör nokta söylentileri) · Silinmişler için okunan isim listeleri · Kibar Ses anonslarının remixleri |
| Meridyen FM | **Selva** (eski arena sunucusu; sahne adı, gerçek adı bilinmez) | Işıltılı, hızlı konuşan, Karat Sendikası'na borcunu esprilerle geçiştiren | Gece listesi "Işıklar Sönmez" · dövüş ligi bahis oranları · kumarhane VIP dedikoduları · dinleyici itirafları saati |
| DÖKÜM 99 | **Usta Cavit** (eski vardiya amiri, üç kuşak dökümhane ailesi) | Kırık sesli, az konuşur, mahalle onuru üzerine sert monologlar | "Üçüncü Vardiya" gece kuşağı · kaçak yarış sonuçları (Üç Baca finişi) · "11 GÜN UNUTMADIK" yıldönümü özel yayını |
| Sis Feneri | **Marlen Abla** (eski dalgıç-hurdacı, 94 Ateşkesi tanığı) | Boğuk, ağır, ninnimsi; herkesin teknesini adıyla bilir | Su durumu ve gel-git raporu (dalış koşulları) · kayıp/bulunan ilanları · "Batık Meydan'dan Mektuplar" anlatı kuşağı |
| Halat Hattı | **Aksa** (eski kalkış kontrolörü, lisansı Yıldırım Orbital'ce iptal edilmiş) | Prosedür diliyle dalga geçen, jargonu şiire çeviren | Kalkış çizelgesi okuması · gümrük şikâyet hattı · "Halattan Düşenler" pilot anıları · Kara Leylek'e üstü kapalı selamlar |
| Kök Radyo | **Nane** (kule meclisinin genç sözcüsü) | Sıcak, inatçı, Mirai Biyotek'e imalı şakalar yapan | Hasat duyuruları · çatı sofrası tartışmalarının özeti · imece nöbet çizelgesi · tohum lisansı "masalları" |
| Beyaz Oda | **Maestro Halden** (küratör; sesi yapay inceliğiyle ürkütücü) | Ölçülü, soğuk, kusursuz diksiyonlu | "Sessizlik Saati" (tek notalık kompozisyonlar) · drone bülbül kayıtları · müzayede sonuçları · Karartma yıldönümü "prestij konseri" aktarımı |
| Kervan Sesi | **Yol Anası Zehra** (mevsimlik anlatıcı; mikrofon her kampta el değiştirir) | Yorgun, cömert, yol geleneğinin sözlü hafızası | Konvoy güzergâh şifreleri · takas fiyat listesi · kayıp yolcu anonsları · kamp ateşi kayıtları (saha kaydı estetiği) |
| Zenit Orbit | **Deja** (vardiya teknisyeni; koğuş ranzasından yayın yapar) | Uykusuz, esprili, yerçekimine küskün | Sıfır-G lounge seti · istasyon duyurusu parodileri · "Aşağısı Bu Gece Nasıl?" (şehre yukarıdan bakış sohbeti) |

DJ üretim kuralı: her DJ için lansmanda ≥ 3.5 saat benzersiz konuşma
(yaklaşık 2.800–3.400 satır); tekrar hissi ölçütü, 30 saatlik oyunda aynı
DJ repliğinin üçüncü kez duyulmamasıdır.

### 3.3 PANOPT Resmî Yayını ↔ Sinyal Kontrastı

Radyo tasarımının dramatik omurgası bu iki kutuptur; ikisi aynı olayları
yayınlar, asla aynı gerçeği söylemez:

| Boyut | YY-1 (PANOPT) | Sinyal (Korsan) |
| --- | --- | --- |
| Ses işleme | Kusursuz temiz, −16 LUFS'a sıkıştırılmış, oda yankısız | Cızırtılı, kırpılmış, arka planda jeneratör uğultusu; frekans atladıkça tını değişir |
| Haber dili | Edilgen ve steril: "Bir güvenlik olayı çözümlenmiştir." | Faili adıyla anan, öfkeli: "Kessler-Voss bu gece Pas Kuşağı'nda üç kapı kırdı." |
| Müzik politikası | Yalnız Defter'e kayıtlı, onaylı sanatçılar | Kayıt dışı ve Karartılmış sanatçılar; "silinmiş şarkılar" arşivi |
| Oynanış işlevi | Aranma kademesi duyuruları — oyuncunun resmî profilini yansıtır | "Gözsüz Sokaklar" segmenti o haftanın kör nokta söylentilerini verir (yalnız ipucu; harita işareti koymaz, avantaj bilgisi Gölgepazar'da zaten satın alınabilir — bilgi dengesi için bkz. Açık Sorular) |
| Oyuncuya bakış | Oyuncu "olay istatistiği"dir | Oyuncu eylemleri takma adla efsaneleşir; Sinyal, üç protagonist için ayrı sokak adları üretir |
| REGENT kuralı | REGENT asla anılmaz | İlk perdede yalnızca anomali söylentisi olarak geçer ("kimsenin hatırlamadığı adam"); adının anılmaması kanon kuralıdır (LW-GDD-01) |

### 3.4 Sezonluk Radyo Güncelleme Planı (LW-GDD-06 ile senkron)

Radyo, canlı servisin en ucuz "dünya canlı" kanıtıdır; her 12 haftalık sezon
radyoyu günceller:

| Kadans | İçerik | Hacim |
| --- | --- | --- |
| Haftalık (Perşembe 18:00 UTC vuruşuyla) | Bölge savaşı sonuçlarının YY-1 ve Sinyal versiyonları; piyasa dalga yorumları | İstasyon başına 8–12 yeni satır |
| Sezon açılışı (1. hafta) | Sezon temalı DJ sohbet paketi + her istasyona 3–4 yeni parça | ~1.400 satır + 32–40 parça/sezon |
| Orta vuruşlar (5. ve 9. hafta) | Yeni içerikle (araç sınıfı, soygun remixi) bağlantılı DJ tepkileri | ~500 satır |
| Sezon finali (12. hafta) | Canlı olay yayını; kalıcı dünya değişikliği radyoda kalıcı referansa dönüşür | ~300 satır |
| Yıllık: Karartma Anması / Işık Nöbeti | 11 dakika boyunca tüm istasyonlar susar; **yalnızca Sinyal yayında kalır** ve ölülerin isimlerini okur | Özel prodüksiyon |

Sezon 01 "Karartma Protokolü" örneği: silinen Karartma kayıtları yüzeye
çıktıkça YY-1 "arşiv bakımı" duyuruları yapar, Sinyal aynı kayıtların ham
parçalarını yayınlar; 12. hafta senkronize karartma finalinde şehrin tek
sesi Sinyal'dir. Radyo, sezon anlatısının nabız monitörüdür.

---

## 4. Müzik Stratejisi: Kurgusal Katalog + Orijinal Skor

### 4.1 Karar: Lisanslı Müzik Yok

| Gerekçe | Açıklama |
| --- | --- |
| Canlı servis ömrü | Lisans süreleri 5+ yıllık yol haritasıyla (LW-GDD-06) uyumsuzdur; süresi dolan parça radyo delikleri açar |
| Yayıncı güvenliği | Klip ekonomisi stratejimiz (Sütun 3, LW-GDD-06) telif iddiası riskiyle bağdaşmaz; tüm katalog yayıncı-güvenlidir |
| Dünya bütünlüğü | 2099'un müziği bizim icadımız olmalıdır; gerçek dünya parçaları kurgu zarını deler |
| Maliyet kontrolü | Eşdeğer lisans bütçesi (~$18–25M) yerine katalog bütçesi ~$9M ile kalıcı mülkiyet |

### 4.2 Kurgusal Sanatçı Kataloğu

Lansman hedefi: **≈ 240 orijinal parça / ≈ 16 saat** radyo müziği; sezon
başına +32–40 parça. Katalog, bölge müzik kimliklerini (LW-GDD-01) izler.
Çekirdek sanatçı listesi (genişletilebilir):

| Sanatçı | Tür | Ana İstasyon | Kurgu Notu |
| --- | --- | --- | --- |
| **Macenta Şelale** | Gece popu | Meridyen FM | Adını Meridyen Kumarhanesi hologramından alır; Karat Sendikası'nın sahne tekelinde |
| **On Bir** | Endüstriyel | DÖKÜM 99 | İsmi Karartma anmasıdır ("on bir"); YY-1'de çalması yasaktır — bu yasak hayran kitlesini büyütür |
| **Kanal Anneleri** | Su yankılı ballad | Sis Feneri | Üç kuşak Kanalcı kadın; kayıtlar tekne ambarında, gerçek su yankısıyla alınmış kurgusuyla mikslenir |
| **Halat Çocukları** | Pilot rock'ı | Halat Hattı | İrtifa Loncası marşlarını elektrikleyen mekik tayfası; Solene görev hattında sahne alır |
| **Kök Korosu** | İmece folk'u | Kök Radyo | Kule meclisi korosu; parçaları hasat döngüsüne göre mevsimliktir |
| **Drone Bülbül** | Neo-klasik ambient | Beyaz Oda | Kordon'un yapay kuş seslerinden beste yapan anonim prodüktör; "gerçek kuş kalmadı" ağıdı |
| **Gri Kayıt** | Veri argosu rap'i | Sinyal / Gölgepazar sokak hoparlörleri | Sözleri Defter jargonuyla yazılır; her albümü bir "sızıntı" olarak dağıtılır |
| **Türbin** | Jeneratör ritimli kervan müziği | Kervan Sesi | Devrilmiş türbin gövdelerini davul olarak kaydeder; konserleri kervan duraklarında gezer |
| **Sıfır Nokta** | Yörünge dub'ı | Zenit Orbit | Sıfır-G'de kaydedilmiş vurmalılar; parçalarının alçak yerçekimi mikserinde "ağırlaşan" versiyonları vardır |
| **Karartılmış** (kolektif) | Silinmiş şarkılar arşivi | Yalnız Sinyal | Kademeli cezalarla kaydı kapatılmış sanatçıların anonim toplaması; 2097 Vakaları'na işitsel tanıklık |

Katalog kuralları: her parça stem'li teslim edilir (radyo versiyonu +
dünya-hoparlör versiyonu + telefon/cızırtı versiyonu); sanatçı adları ve
şarkı sözleri Anlatı Ekibi (LW-GDD-02) onayından geçer; hiçbir söz REGENT'i
ilk perdede adıyla anamaz.

### 4.3 Orijinal Skor ve Besteci Ekip Yapısı

Skor hedefi: **≈ 480 dakika (8 saat) interaktif skor** — tamamı Bölüm 2
stem mimarisinde. Dağılım: 9 bölge × ~30 dk keşif/gerilim seti + 90 dk
çatışma/kovalamaca havuzu + 60 dk ana anlatı/leitmotif seti + 30 dk yörünge.

| Rol | Kişi | Sorumluluk |
| --- | --- | --- |
| Baş Besteci | 1 | Tematik mimari, üç protagonist leitmotifi, ana anlatı skoru |
| Kıdemli Besteci | 3 | Her biri bir protagonist hattının ve 3 bölgenin skor sahibi |
| Bölge Besteci/Prodüktör | 6 (kısmi zamanlı) | Kurgusal katalog parçaları; her biri 1–2 istasyonun "sahne"sini üretir |
| Müzik Süpervizörü | 1 | Katalog planı, sanatçı kurgusu, sözlerin kanon denetimi |
| Müzik Editörü / Uygulayıcı | 2 | Stem kesimi, Duskforge Rezonans entegrasyonu, durum makinesi ayarı |
| Orkestrasyon / Kayıt Yönetmeni | 1 | 60 kişilik yaylı+bakır oturumları (ana anlatı için 3 kayıt bloğu) |

Üretim ritmi: lansman öncesi 22 ay; canlı serviste sezon başına 45–60 dk
yeni müzik (32–40 katalog parçası + 8–12 dk skor eki) — LW-GDD-06 "ölü
hafta yok" ilkesinin müzik ayağı.

---

## 5. Ses Mimarisi

### 5.1 Duskforge Rezonans: Geometri Tabanlı Yankı ve Okluzyon

Duskforge Engine'in ses alt sistemi **Duskforge Rezonans**, akustiği elle
yerleştirilmiş yankı bölgeleriyle değil, sahne geometrisinden gerçek
zamanlı hesaplar (LW-GDD-07 bütçeleriyle koordineli):

| Özellik | Yöntem | Bütçe / Sınır Değer |
| --- | --- | --- |
| Yankı (reverb) | Işın demeti taraması (frame başına 96 ışın) + geç yankı için bölge başına önceden pişirilmiş dürtü yanıtı ailesi | CPU ≤ 0,8 ms/kare (ses iş parçacığı) |
| Okluzyon/obstrüksiyon | Malzeme etiketli çoklu ışın (cam/beton/çelik/su ayrı sönüm eğrisi) | Kaynak başına 5 ışın; 60 Hz güncelleme |
| Yayılım (propagation) | Kapı/pencere portalları üzerinden difraksiyon; ses "köşeyi döner" | Portal zinciri ≤ 4 sıçrama |
| Eşzamanlılık | 128 fiziksel ses + 1024 sanal ses; önem skoruna göre terfi/tenzil | Ses belleği havuzu 512 MB |
| Su akustiği (Sisaltı) | Su altı alçak geçiren filtre + yüzey yansıma gecikmesi; yarı batık hacimlerde çift katman | Sisaltı'ya özel DSP zinciri |
| Doppler ve hız | 200+ araç ve hava koridoru trafiği için hıza bağlı perde kayması | Kovalamaca tasarımının (LW-GDD-17) işitsel omurgası |

### 5.2 Bölge Ambiyans İmzaları

Her bölgenin 24 saatlik döngüde (sabah/gündüz/akşam/gece) 4 varyasyonlu
ambiyans yatağı vardır; aşağıda kimlik özeti (LW-GDD-01 atmosfer satırlarına
birebir sadıktır):

| Bölge | İmza Katmanları | Akustik Karakter |
| --- | --- | --- |
| Çekirdek | Alçak HVAC uğultusu, yumuşak anons tonları, sönümlenmiş adımlar | Ölü oda; RT60 ≈ 0,3 sn; en sessiz bölge (35–45 dB SPL eşdeğeri) |
| Neon Liman | Kalabalık walla, sokaktan sokağa değişen bas katmanları, kumarhane çanları | Islak asfalt yansımalı, yoğun; en gürültülü bölge (75–85 dB) |
| Pas Kuşağı | Uzak pres makineleri, zincir sesleri, boş hangar yankısı | Uzun metalik RT60 ≈ 2,5–4 sn; geniş ve boş |
| Yükseliş | 90 sn'de bir kabin kalkış gümbürtüsü (dünya metronomu), rüzgâr, metal gerilme iniltileri | Devasa ölçek; alçak frekans ağırlıklı |
| Sisaltı | Motor takırtısı, su şıpırtısı, uzak sis düdükleri | Boğuk ve yakın; sis yüksek frekansları yutar (LPF 6 kHz) |
| Bahçeler | Büyüme LED'i vınıltısı, damla sulama, kat bahçelerinde çocuk sesleri | Nemli, yumuşak; şehrin en "organik" spektrumu |
| Kordon | Drone bülbül sesleri, peyzaj fıskiyeleri, ölü sessizlik | Kontrollü sessizlik; her ses "yerleştirilmiş" duyulur |
| Gölgepazar | Pazarlık uğultusu, sinyal karıştırıcı cızırtısı, üst üste tezgâh radyoları | Dar pasaj erken yansımaları; klostrofobik |
| Dış Halka | Rüzgâr, teneke takırtısı, uzak radyo cızırtısı, jeneratör ritmi | Açık ufuk; yankısız, geniş stereo taban |
| Zenit Halkası | Havalandırma nabzı, gövde gıcırtısı, kenetlenme çarpmaları | Kapalı metal tüp; dışarısı mutlak sessizlik |

Sınır kuralı: bölgeler arası ambiyans geçişi 30–60 metrelik çapraz sönümleme
koridorlarında yapılır; oyuncu sınırı mimariyle birlikte kulağıyla hisseder
(örn. Pas Kuşağı pres ritminin Kordon fıskiyelerine çözülmesi).

### 5.3 Yörünge, Sıfır-G ve İç-Kask Sesi

Kesintisiz sokak → asansör → yörünge geçişi (kanon) ses tasarımının vitrin
anıdır; kontrast üç fazda kurulur:

1. **Tırmanış:** Kabin yükseldikçe şehir ambiyansı 90 saniyede katman katman
   soyulur; 40. km'den sonra yalnız kabin gövdesi ve oyuncunun kıyafeti
   duyulur. Miksin "boşalması" yükselti hissinin kendisidir.
2. **Dış çekim / EVA — fiziksel doğruluk:** Uzayda kamera araç/istasyon
   gövdesine temas etmiyorsa dış ses **yoktur**. Patlamalar dahil tüm dış
   olaylar yalnızca (a) gövde titreşimi üzerinden boğuk yapı-iletimli ses ve
   (b) müzik ile anlatılır. Bu sessizlik, Ses Sütunu 4'ün en pahalı
   harcamasıdır ve pazarlıksızdır.
3. **İç-kask katmanı:** EVA ve sıfır-G bölümlerinde miks kaskın içine
   taşınır: nefes döngüsü (efor durumuna göre 3 kademe), kumaş sürtünmesi,
   telsiz DSP'sinden geçen crew sesi (300 Hz–3.4 kHz bant), kalp atışı
   (yalnız tehdit skoru ≥ 60 iken, LW-GDD-08 uyarınca kapatılabilir),
   Kara Leylek kokpit uyarı tonları (Solene leitmotifinin kaynağı).

Alçak yerçekimi ara değerleri (Zenit Halkası katmanları): yerçekimi katsayısı
düştükçe adım sesleri hafifler, nesne çarpmaları uzar, müzik mikserinde
"ağırlıksız" varyasyon stem'leri (Sıfır Nokta kataloğu) devreye girer.

### 5.4 Ses Bütçeleri (LW-GDD-07 ile ortak)

| Kalem | Bütçe |
| --- | --- |
| Ses iş parçacığı CPU | ≤ 3,0 ms/kare toplam (Rezonans 0,8 ms dahil) |
| Bellek havuzu | 512 MB (ambiyans 96 · müzik 3 cue × 8 stem 144 · VO akışı 64 · efekt 208) |
| Disk akışı | Radyo ve VO tamamen akışlı; kesintisiz dünya için çift tamponlu ön okuma |
| Walla sistemi | 1.2M vatandaş simülasyonundan örneklenen 64 kanallı kalabalık dokusu; yoğunluk LW-GDD-04 kalabalık verisinden sürülür |

---

## 6. Seslendirme (VO) Hattı

### 6.1 Dil Kapsamı

Kanon: **12 dilde altyazı.** Dublaj iki kademelidir:

| Kademe | Diller | Kapsam |
| --- | --- | --- |
| **Altyazı (12)** | Türkçe, İngilizce, Fransızca, Almanca, İspanyolca, Latin Amerika İspanyolcası, Brezilya Portekizcesi, İtalyanca, Lehçe, Rusça, Japonca, Basitleştirilmiş Çince | Tüm diyalog, radyo, SDH ses etiketleri (LW-GDD-08 altyazı standartlarına tam uyum) |
| **Tam dublaj (7)** | İngilizce (referans), Türkçe, Fransızca, Almanca, Latin Amerika İspanyolcası, Brezilya Portekizcesi, Japonca | Sinematik + görev diyaloğu + sistemik bark çekirdeği + YY-1/Sinyal ana kuşakları |
| **Kısmi dublaj (1)** | Lehçe | Sinematik + görev diyaloğu (bark ve radyo İngilizce kalır) |

- PANOPT'un Kibar Ses'i her dublaj dilinde yeniden kaydedilir ve **aynı
  ses işleme zinciriyle** (formant düzleştirme + çift mikro-gecikme)
  standartlaştırılır; Kibar Ses'in tınısı küresel olarak tektir.
- Bölgesel istasyon müzikleri çevrilmez (müzik evrenseldir); DJ konuşmaları
  tam dublaj dillerinde yerelleştirilir, mizah birebir değil işlevsel çevrilir.
- Rusça, İtalyanca ve Çince dublaj kararı pazar verisine bağlı açık konudur
  (bkz. Açık Sorular; LW-GDD-09 ile ortak karar).

### 6.2 Kayıt Hacmi Tahminleri (satır sayıları, İngilizce referans)

| Kategori | Satır | Not |
| --- | --- | --- |
| Sinematik + ana görev diyaloğu | 95.000 | 3 protagonist perspektif varyasyonları dahil |
| Yan görev + aktivite diyaloğu (LW-GDD-12) | 58.000 | NPC tanışıklık sistemi varyasyonlarıyla |
| Sistemik NPC bark havuzu | 240.000 | 1.2M vatandaş simülasyonu için arketip × bölge lehçesi matrisi |
| Radyo: DJ konuşmaları (10 istasyon) | 31.000 | İstasyon başına ~2.800–3.400 satır |
| Radyo: haber/reklam/anons | 14.000 | YY-1 ↔ Sinyal çift versiyon kuralı dahil |
| PANOPT / Kibar Ses / sistem VO | 8.000 | Ceza bildirimleri, asansör, gümrük, istasyon anonsları |
| Online sezon içeriği (yıllık, 4 sezon) | 24.000/yıl | Sezon başına ~6.000 satır (LW-GDD-06 kadansı) |
| **Lansman toplamı (EN)** | **≈ 446.000** | |
| **Tüm diller toplam kayıt** | **≈ 2.1M satır** | 7 tam + 1 kısmi dublaj + EN referans |

### 6.3 Kayıt Süreci ve Kurallar

- Ana kadro (3 protagonist + Aylin Sarr + 12 anahtar NPC) performans
  yakalama sahnesinde eş zamanlı ses + yüz + beden kaydıyla çalışır;
  bark ve radyo kayıtları ayrı hatta yürür.
- Stüdyo planı: 3 paralel kayıt hattı × 20 ay; dublaj dilleri EN kilidinden
  en geç 10 hafta arayla takip eder ("ripple" programı).
- Deniz'in sesi yalnızca bozulmuş kayıtlar ve anı parçaları hâlinde duyulur;
  temiz kaydı oyunun son perdesine dek verilmez (Anlatı Ekibi ile kilitli).
- REGENT'e ait ayrı bir "ses" ilk üçte birde kullanılamaz (LW-GDD-01 kuralı);
  varlığı yalnızca PANOPT sesindeki mikro-bozulmalarla sezdirilir.

---

## 7. Miks Hedefleri

### 7.1 Ses Yüksekliği ve Dinamik Aralık

| Parametre | Hedef | Not |
| --- | --- | --- |
| Entegre ses yüksekliği (tüm platformlar) | −24 LUFS ± 0.5 (ITU-R BS.1770-4) | Konsol sertifikasyon referansı |
| Diyalog çapası | −25 LUFS (uzun dönem ortalama) | Tüm dillerde ±1 LU içinde eşitlenir |
| Gerçek tepe | ≤ −1.0 dBTP | Bulut/akış kodlayıcı payı |
| Dinamik aralık profilleri (LRA) | **Sinema** ~18 LU · **Standart** ~12 LU · **Gece** 6–7 LU · **Kulaklık** ~10 LU + çapraz besleme | Oyuncu her an değiştirebilir (LW-GDD-08 ilkesi) |
| Radyo istasyon içi | −16 LUFS (YY-1) · −14 LUFS ve kırpık (Sinyal, estetik tercih) | İstasyonlar arası geçişte algısal eşitleme |

### 7.2 Gece Modu ve Çıkış Biçimleri

- **Gece modu** (LW-GDD-08'deki "ani ses tepelerini bastırma" anahtarının
  miks tarafı): çok bantlı sınırlayıcı yalnız 45 dB üstü ani tepeleri yakalar;
  diyalog çapası korunur, patlamalar −12 dB'e kadar yumuşatılır. Hedef:
  gece 02:00'de kulaklıksız oynanabilir miks.
- Çıkış biçimleri: stereo · 5.1 · 7.1 · obje tabanlı 3B ses (7.1.4'e kadar)
  · binaural kulaklık işleme. Yörünge bölümleri obje tabanlı mikste
  dikey eksenin vitrinidir.
- LFE politikası: LFE yalnız destek kanalıdır; kritik hiçbir bilgi yalnız
  LFE'de yaşamaz (subwoofer'sız kurulumlar tam bilgi alır).
- Bulut sürümü: kodlayıcı zinciri için ayrı ön-miks doğrulaması; 128 kbps
  altında dahi diyalog anlaşılırlık testi (LW-GDD-07 ile ortak kapı).

### 7.3 Miks Öncelik Hiyerarşisi

Çakışma anında kanal önceliği (yüksekten alçağa): **diyalog → kritik oynanış
uyarıları (PANOPT tarama, kovalamaca eşikleri) → müzik durum geçişleri →
ambiyans → dünya detayı.** Öncelik motoru, LW-GDD-08'deki 5 kanallı oyuncu
ses düzeyi ayarlarının (Diyalog/Efekt/Müzik/Ortam/Arayüz) üstünde çalışır;
oyuncu ayarı her zaman son sözü söyler.

---

## 8. Erişilebilirlik Bağları (LW-GDD-08)

Ses ekibi, LW-GDD-08'in işitsel gereksinimlerinin **uygulayıcısıdır**;
aşağıdaki eşleme iki belgenin ortak sözleşmesidir:

| LW-GDD-08 Gereksinimi | Ses Ekibi Teslimatı |
| --- | --- |
| Ses görselleştirici (yönlü halka, simge/renk, mesafe ölçekli) | Her ses olayı sınıflandırılmış meta veriyle yayınlanır: tür (silah/patlama/adım/motor/dron), yön, mesafe, tehdit değeri — görselleştirici bu akıştan beslenir, tahmin etmez |
| PANOPT ses uyarılarının ekran eşdeğerleri | Tarama başlangıcı / kayıt anı / takip kaybı olayları tek olay veriyoluna yazılır; işitsel ve görsel katman aynı kaynaktan tetiklenir |
| SDH ses etiketleri (`[köşeli parantezli]`) | VO hattı, diyalog dışı kritik seslerin tamamı için etiket metni üretir; 12 dilde yerelleştirilir |
| Mono ses, 5 kanallı düzey, diyalog netliği (DRC), gece modu | Miks mimarisi bu anahtarları son aşamada değil sinyal zincirinin tasarımında taşır (bkz. 7.1–7.2) |
| Haptik ipucu katmanı (tarama = üç kısa vuruş vb.) | Ses olay veriyolu haptik desen sözlüğünü sürer; desenler ses ekibince tasarlanır, LW-GDD-08 rehberinde belgelenir |
| Müzik durumunun görsel karşılığı | M0–M4 durum değişimleri isteğe bağlı HUD göstergesine yansır (işitme engelli oyuncu, gerilim tırmanışını müziksiz de okur) |
| Fotosensitivite ile ilişki | Senkronize ses-ışık efektlerinde (konser, Karartma finali) ışık yumuşatma modu açıkken ses tarafı bilgi kaybını telafi eden ek uyarı katmanı çalar |

Test kapısı: her milestone'da ses ekibi, Erişilebilirlik Etki Kontrol
Listesi'nin işitsel maddelerini Oyuncu Deneyimi ve Erişilebilirlik Lideri
ile ortak imzalar; "duyulmadan kaybedilen" her durum ship-blocker sayılır
(LW-GDD-08 lansman kriteriyle uyumlu).

---

## 9. Açık Sorular

1. **Sinyal'in bilgi değeri:** "Gözsüz Sokaklar" segmentinin kör nokta
   söylentileri, radyo dinlemeyen oyuncuya karşı ölçülebilir bir avantaj
   yaratıyor mu? Öneri: söylentiler yalnız Gölgepazar'da zaten satın
   alınabilir bilginin ücretsiz ama belirsiz versiyonu olsun — Tasarım
   Direktörlüğü'nün bilgi ekonomisi kararı (LW-GDD-05 ile) gerekiyor.
2. **Oyuncu müziği:** Araç içinde kullanıcı tanımlı çalma listesi (yerel
   dosya/servis bağlantısı) destekleyecek miyiz? Dünya bütünlüğü ve yayıncı
   güvenliği lehine "hayır" öneriyoruz; ticari beklenti farklıysa kapsam
   kararı gerekli.
3. **Dublaj genişlemesi:** Rusça, İtalyanca ve Basitleştirilmiş Çince tam
   dublaj eklenmesi (~$4.5M/dil, +14 hafta) LW-GDD-09 pazar öngörüleriyle
   birlikte ne zaman karara bağlanacak? Kayıt hattı rezervasyonu için son
   karar tarihi lansmandan 13 ay öncesidir.
4. **Online radyo senkronu:** Aynı araçtaki crew üyeleri istasyonu örnek
   bazında senkron mu duymalı? Senkron yayın sunucu maliyeti getirir;
   asenkron ise klip/yayın anlarında uyumsuz görünür. Çevrimiçi Tasarım
   Lideri ile ortak karar bekliyor.
5. **Sezon finali sessizliği:** "Yalnız Sinyal yayında" tasarımı, canlı
   final kaçıranlar için FOMO sınırı ilkesiyle (LW-GDD-06) çelişiyor mu?
   Ertesi gün radyoda yayımlanacak "tekrar kuşağı" telafi olarak yeterli mi?
6. **REGENT'in sesi:** Son perdede REGENT'e ayrı bir ses kimliği mi
   verilmeli, yoksa PANOPT Kibar Ses'inin giderek çözülen/bozulan hâli
   olarak mı işlenmeli? İkincisi tematik olarak güçlü ("kimin kimi
   yönettiği" sorusunu sese taşır) ama Anlatı Ekibi Lideri'nin final
   kararına bağlı.

---

## Çapraz Referanslar

| Belge | İlişki |
| --- | --- |
| `01-dunya-ve-lore.md` (LW-GDD-01) | Bölge atmosferleri, müzik haritası, medya ikiliği (Sable ↔ korsan), REGENT gizlilik kuralı |
| `03-oynanis-sistemleri.md` (LW-GDD-03) | Aranma sistemi telemetrisi → müzik durum makinesi girdileri |
| `04-acik-dunya-simulasyonu.md` (LW-GDD-04) | Kalabalık/walla verisi, dinamik olayların radyo haberlerine akışı |
| `06-canli-servis-ve-uzun-omur.md` (LW-GDD-06) | Sezonluk radyo/müzik kadansı, canlı finaller, Karartma Anması |
| `07-teknoloji-hedefleri.md` (LW-GDD-07) | Duskforge Rezonans bütçeleri, akış mimarisi, bulut ön-miks doğrulaması |
| `08-erisilebilirlik.md` (LW-GDD-08) | Görsel ses göstergeleri, altyazı/SDH standartları, miks anahtarları |
| `16-dusman-ai-ve-catisma.md` (LW-GDD-16) | PANOPT tepki merdiveni → tehdit skoru eşikleri |
| `17-arac-ve-surus-modeli.md` (LW-GDD-17) | Araç ses setleri, Doppler, kovalamaca ses tasarımı |

## Sürüm Geçmişi

| Sürüm | Tarih | Yazar | Değişiklik |
| --- | --- | --- | --- |
| 1.0 | 5 Temmuz 2026 | Ses Direktörü | İlk sürüm |

## Kurgusallık Notu

Bu belge bir konsept çalışmasıdır. LUMENFALL, Lumenworks Studios, Duskforge
Engine ve burada geçen tüm kişi, kurum, radyo istasyonu, sanatçı, ürün ve
olaylar tamamen kurgusaldır; gerçek kişi, kurum, yayın veya müzik eserleriyle
benzerlikler tesadüfidir. Belirtilen fiyatlar, tarihler, bütçe ve teknik
hedefler herhangi bir ticari taahhüt oluşturmaz.
