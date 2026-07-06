# LUMENFALL — Görev Tasarımı Dokümanı

| Alan | Değer |
| --- | --- |
| **Belge No** | LW-GDD-11 |
| **Sürüm** | 1.0 |
| **Tarih** | 5 Temmuz 2026 |
| **Sahip** | Görev Tasarımı Lideri |
| **Durum** | İnceleme |
| **Gizlilik** | Stüdyo İçi — Dağıtım Onaya Tabidir |
| **Bağlayıcı Kanon** | LUMENFALL_CANON.md (Tek Doğruluk Kaynağı) |
| **İlgili Belgeler** | LW-GDD-01 (Dünya ve Lore) · LW-GDD-02 (Hikâye ve Karakterler) · LW-GDD-03 (Oynanış Sistemleri) · LW-GDD-04 (Açık Dünya Simülasyonu) · LW-GDD-05 (Ekonomi) |

> **Kapsam notu:** Bu belge, LUMENFALL tek oyunculu kampanyasının görev mimarisini tanımlar: tasarım felsefesi, görev tipi taksonomisi, üç perdelik ana hikâye görev listesi, soygun iskeleti, üç örnek görevin tam dökümü, görev–dünya bağıntısı ve tempo metrikleri. LW-GDD-02'deki Görev Tasarım Felsefesi bölümü bu belgenin anayasasıdır; buradaki her kural onu genişletir, hiçbiri onu ezmez. LUMENFALL Online görev/mod tasarımı için bkz. LW-GDD-10; buradaki hiçbir kampanya seçimi Online'da mekanik avantaja dönüşmez (kanon: pay-to-win yasağı).

---

## 1. Görev Tasarım Felsefesi

### 1.1 Üç Taahhüt

LW-GDD-02'nin altı ilkesi (tez cümlesi, üç mercek, başarısızlık dallanmadır, kesintisizlik, yaklaşım vaadi, gecikmiş fatura) geçerlidir. Görev Tasarımı ekibi bu ilkeleri üç operasyonel taahhüde çevirir:

1. **Oyuncu ifadesi ölçülebilirdir.** Her ana görev, oyuncunun "ben böyle oynarım" cümlesini kurabileceği en az iki eksende serbestlik sunar: *yaklaşım* (sessiz/gürültülü/sosyal) ve *sıralama veya araç* (rota, karakter, ekipman). Tasarım incelemesinde her görev için "aynı görevi iki oyuncu anlatınca iki farklı hikâye çıkar mı?" sorusu sorulur; cevap hayırsa görev geri döner.
2. **Çoklu çözüm sözleşmedir, süs değildir.** "Yaklaşım vaadi" (LW-GDD-02, ilke 5) uyarınca her ana görev en az iki tam yaklaşımı uçtan uca destekler; soygunlar üç vektörün (Gürültülü / Hayalet / Truva — LW-GDD-03) üçünü de destekler. "Kaçınılmaz çatışma odası" kotası perde başına 1'dir ve bu belgede hangi göreve harcandığı açıkça yazılıdır (bkz. 3.4).
3. **Görev başarısızlığı hikâyenin devamıdır.** "Görev başarısız" ekranı yalnızca oyuncu ölümünde görülür. Diğer tüm kötü sonuçlar — alarm, kaçan hedef, yanan kanıt, düşen kargo — görevi *dallandırır* ve dünyada iz bırakır. PANOPT'un öğrenen doğası (LW-GDD-03) bunu kurgusal olarak taşır: şehir hatanızı unutmaz, bir sonraki görevde hatırlar.

### 1.2 Başarısızlık Taksonomisi

Her ana görevin tasarım dokümanında aşağıdaki dört sınıftan en az ikisi için yazılmış dal bulunmak zorundadır:

| Sınıf | Tanım | Örnek | Zorunlu çıktı |
| --- | --- | --- | --- |
| **Gürültü** | Sessiz plan bozulur, görev gürültülü devam eder | Alarm, tanık, geri-iz kaybı | Kaçış katmanı sertleşir; PANOPT profili beslenir |
| **Kayıp** | Görev hedefi kısmen elde edilir | Dosyanın %60'ı, hasarlı kargo | Kalan parça sonraki bir göreve/yan zincire taşınır |
| **Bedel** | Hedef alınır ama bir müttefik/kaynak yanar | Yekta'nın lisansı, köstebeğin deşifresi | Defter Yankısı: 1–3 görev gecikmeli fatura (LW-GDD-02) |
| **Fırsat kaçışı** | Zaman pencereli hedef kaçırılır | Konvoy geçti, tanık taşındı | Alternatif (daha pahalı/riskli) elde etme yolu açılır |

**Korkuluk:** Hiçbir başarısızlık dalı ana hikâye ilerlemesini kalıcı kilitleyemez. Kritik anlatı nesneleri için her zaman ikinci bir elde etme yolu yazılır; ikinci yol birinciden en az %30 daha pahalı veya riskli olmalıdır (aksi hâlde başarısızlık anlamsızlaşır).

### 1.3 İnceleme Kapıları (görev onayı için zorunlu)

1. **Tez Cümlesi Kapısı:** Görev dokümanı tek cümlelik "bu görev neyi söylüyor?" alanı olmadan incelemeye giremez (LW-GDD-02, ilke 1).
2. **İki Anlatı Kapısı:** İki test oyuncusunun görev sonrası sözlü özetleri %70'ten fazla örtüşüyorsa ifade ekseni yetersizdir.
3. **Kesintisizlik Kapısı:** Görev akışında yükleme ekranı, siyah kesme veya oyuncuyu dünyadan koparan menü zorunluluğu bulunamaz (kanon: %100 kesintisiz dünya). Brifingler yürüyerek, araçta veya asansörde sahnelenir.
4. **PANOPT Kapısı:** Her görev, PANOPT durum makinesinin (LW-GDD-03) hangi durumlarını hangi beat'lerde tetikleyebileceğini beyan eder; "PANOPT'suz" görev yalnızca Sisaltı/Dış Halka kör bölgelerinde (kapsama %25 / %5) mümkündür ve gerekçelendirilir.
5. **Sonuç Kapısı:** Görev, dünyada en az 3 gözlemlenebilir sonuç üretmelidir (LW-GDD-03 döngü sağlığı metriği ile aynı eşik).

---

## 2. Görev Tipi Taksonomisi

| Tip | Adet (hedef) | Süre bandı | Ödül bandı (LM) | Başarısızlık davranışı | PANOPT ilişkisi |
| --- | --- | --- | --- | --- | --- |
| **Ana görev** | 31 | 35–50 dk (kanon) | 6.000–24.000 + anlatı | Her zaman dallanır | Perde ilerledikçe durum tavanı yükselir (bkz. 3.4) |
| **Karakter görevi** | 21 (3 zincir × 6 + "Fener Nöbeti" 3) | 20–40 dk | 4.000–12.000 + ilişki | Dallanır; zincir sonucu değişir | Karakterin kendi profili üzerinden |
| **Fraksiyon hattı** | 9 hat / 43 görev | 12–35 dk | 3.000–15.000 + İtibar Puanı | Hat kolu kapanabilir, hat asla tümüyle kilitlenmez | Fraksiyon bölgesinin kapsama yüzdesine göre |
| **Soygun (heist)** | 7 (6 ana akışta, 1 fraksiyon hattında) | Hazırlık 30 dk–3 sa + İnfaz 25–60 dk + Kaçış 5–15 dk (kanon) | 60.000–250.000 brüt ganimet | Vazgeçme hakkı + komplikasyon dallanması (LW-GDD-03) | Uyarlanabilir komplikasyon motoru profile bakar |
| **Dünya olayı** | Sistemik (el yapımı 60 şablon) | 2–30 dk | 500–8.000 | "Başarısızlık" diye bir şey yok; olay bir sonuca evrilir | Gerilim Endeksi'ne bağlı üretim (LW-GDD-04) |

**Tip kuralları:**

- **Ana görev** anlatı omurgasıdır; tez cümlesi zorunludur, atlanamaz, ama sıralaması Perde II'de kısmen serbesttir (bkz. 3.2).
- **Karakter görevi** protagonistin yayını derinleştirir; yalnız o karakterle oynanır (Odak Kayması sırasında portre kilitlenir, tek satır gerekçe gösterilir — LW-GDD-02 geçiş kuralı).
- **Fraksiyon hattı** İtibar Puanı (İP) ekonomisini işletir (bkz. 5.1) ve bölge ekonomisine bağlanır (LW-GDD-01 fraksiyon ilkesi 2).
- **Soygun** LW-GDD-03'teki üç fazlı yapının (Hazırlık → İnfaz → Kaçış) anlatıya gömülü halidir; iskelet bu belgenin 7. bölümünde standartlaştırılır.
- **Dünya olayı** simülasyonun ürettiği, el yapımı şablonlardan örneklenen içeriktir; üç katmanı vardır: **Ayak İşi** (2–5 dk, ambiyans), **Bölge Olayı** (5–15 dk, Gerilim Endeksi 40+ bölgelerde), **Şehir Olayı** (15–30 dk, nadir; Sable ve korsan yayınlarda çifte haber üretir — LW-GDD-01 medya ikiliği).

---

## 3. Ana Hikâye — Üç Perdelik Yapı (31 ana görev)

Perde süre hedefleri LW-GDD-02 ile birebirdir: **Perde I ~8–10 saat, Perde II ~12–15 saat, Perde III ~8–10 saat.** Soygunlar **(S#)** ile işaretlidir.

### 3.1 Birinci Perde — "Silinti" (9 görev)

| # | Görev | Hat | Tek cümle özet |
| --- | --- | --- | --- |
| P1-01 | Veri Boşluğu | Mara | Gölgepazar veri baskınında Mara, kendi çocukluk kaydında maskelenmiş figürü — silinmiş kardeşi Deniz'i — bulur. |
| P1-02 | Emekli Maaşı | Kaan | Bir tahsilat gecesi Kaan, "emekliye ayrılan" eski birlik arkadaşının sicilinde reddettiği emrin numarasını — 2094/KV-Θ — görür. |
| P1-03 | Tıbbi Soğutucu | Solene | Zenit Halkası'ndan inen mühürlü kapsülden, PANOPT taramalarında var olmayan ve "Mara" diye sayıklayan bir adam çıkar. |
| P1-04 | Katmanaltı Randevusu | Ortak | Rüzgâr Okafor üç yabancıyı aynı masaya oturtur; kapsüldeki adamın bir "silinti mühendisi" olduğu anlaşılır. |
| P1-05 | Kibar Ses | Ortak | Vasquez'i şehirde taşıyan üçlü, PANOPT'un İlgi → Müdahale merdivenini ilk kez tam zincirde yaşar (sistem öğretimi görevi). |
| P1-06 | Islak İş | Solene/Mara | Kanalcılar'la pazarlık edilir, Vasquez Sisaltı'na indirilir; Sayra "Fener" Duman batık şehrin rehberi olur. |
| P1-07 | Silinti Mühendisi | Ortak | Vasquez gerçeği açıklar: silmeleri yürüten gizli yönetici çekirdek vardır ve Deniz öldürülmemiş, silinmiştir — yaşıyor olabilir. |
| P1-08 | Theta Konvoyu **(S1)** | Kaan | Kessler-Voss arşiv konvoyundan Emir 2094/KV-Θ manifest çekirdeği çalınır — kampanyanın ilk tam soygunu (öğretici soygun). |
| P1-09 | Şehir Sizi Unutmadan | Ortak | Sisaltı güvenli evi kurulurken Direktör Aylin Sarr ekrandan üçlüye kişisel seslenir; perde kapanır. |

**Tasarım notu (kanon uyumu):** LW-GDD-01 kuralı gereği REGENT adı oyunun ilk üçte birinde anılmaz; bu listede adın ilk telaffuzu P1-07'ye, perdenin son çeyreğine çekilmiştir ve P1-01–P1-06 metinlerinde çekirdek yalnızca anomalilerle ("veri boşluğu", "imkânsız kayıt") hissettirilir. LW-GDD-02'deki kesişme sahnesiyle zamanlama farkı Açık Sorular'da (11.1) Anlatı Ekibi'ne taşınmıştır.

### 3.2 İkinci Perde — "Hafıza Defteri" (13 görev)

Perde açılışından sonra üç operasyon hattı (Mara/Kaan/Solene) serbest sırayla oynanır; her hat 3 görevdir. Hat görevleri kendi protagonistine kilitlidir (üç mercek ilkesi), ortak görevler serbest karakterle oynanır.

| # | Görev | Hat | Tek cümle özet |
| --- | --- | --- | --- |
| P2-10 | Hatırlayanlar | Mara → Ortak | Silinen insanların hayalet verilerini toplayan Hatırlayanlar ağıyla ittifak kurulur; üç operasyon hattı açılır. |
| P2-11 | Hafıza Kasası **(S2)** | Mara | Aeon Dynamics'in Çekirdek'teki hava boşluklu soğuk arşivinden Deniz dosyasının B parçası çıkarılır (tam döküm: 8.1). |
| P2-12 | Yankı Odası | Mara | Vatandaş hafıza terminallerinden toplanan kırıntılar, Deniz'in Aeon Dynamics'te çalıştığını gösterir. |
| P2-13 | Aeon'un Bodrumu | Mara | Deniz'in REGENT projesinin içinden silmeleri durdurmaya çalışırken "arşivlendiği" ifşa olur; Mara hattı doruğu. |
| P2-14 | Beyaz Kapı | Kaan | Kordon'a giriş için Beyaz Eldiven'le pazarlık edilir; Kessler-Voss tesisinin servis haritası alınır. |
| P2-15 | Sessiz Servis Arşivi | Kaan | Kaan, Kordon'daki Kessler-Voss arşivinde Theta emir zincirini ele geçirir ve Lindqvist'le yüzleşir (tam döküm: 8.2). |
| P2-16 | Bahçeler Yetimhanesi | Kaan | Kaan, reddettiği emrin hedefi olan kooperatif yetimhanesine döner ve hatırlamaya katlanır; Kaan hattı doruğu. |
| P2-17 | Sağır Kargo **(S3)** | Solene | Sisaltı üstüne yeni sensör ağı taşıyan Yıldırım Orbital mekiği yörüngede ele geçirilir (tam döküm: 8.3). |
| P2-18 | Kara Leylek Düşerken | Solene | Zenit tedarik manifestosu çalınır; Solene'in sağladığı "temiz" kimlik Baba Yekta'yı sistemin gözüne sokar (tam döküm: LW-GDD-02). |
| P2-19 | Yedek Çekirdek | Solene | REGENT'in yedek çekirdeğinin Zenit Halkası'nda olduğu doğrulanır; Yıldırım Orbital lojistik ağına kalıcı sızıntı kurulur. |
| P2-20 | Keder Aritmetiği | Ortak | Vasquez kızının geri yüklenmesi karşılığında kendi teslim olur; güvenli ev düşer, Okafor ağır yaralanır, Deniz dosyası REGENT'e geçer. |
| P2-21 | Enkaz Sayımı | Ortak | Dağılan ağ yeniden örülür; Okafor'un hayatı Mara'nın "Kayıt Dışı" zincirine bağlanır (LW-GDD-02) ve arşiv baskını planlanır. |
| P2-22 | Arşiv Katmanı **(S4)** | Ortak | PANOPT kulesi altındaki arşive üçlü baskın: Deniz'in REGENT'in vicdan modülü olduğu öğrenilir; şehir Sıfır Defter kilitlenmesine girer. |

### 3.3 Üçüncü Perde — "Karanlık Parlar" (9 görev)

| # | Görev | Hat | Tek cümle özet |
| --- | --- | --- | --- |
| P3-23 | Sıfır Defter | Ortak | Karartılan şehirde ilk saatler: kapsama haritası altüst olur, üçlü kilitlenme kurallarını öğrenir ve ağını sayar. |
| P3-24 | Ocak Sözü | Kaan | Kül Köpekleri, Pas Kuşağı'nı Leylek Düşüşü'nün lojistik üssü yapmayı kabul eder — bedeli Kessler-Voss devriyelerini üstlenmektir. |
| P3-25 | Çatı Sofrası | Ortak | Kök Sendikası kule meclisinde ikna edilir; kooperatifler karartma altındaki şehrin iaşe ve saklanma ağını üstlenir. |
| P3-26 | 94'ün Hatrı | Solene/Mara | Kanalcılar ve Kervan, Sisaltı–Dış Halka koridorunu operasyona açar; Echo-7 ilk kez üçlünün frekansına girer. |
| P3-27 | Liman Ağı | Solene | Baba Yekta'nın liman ağı devreye alınır — ağın gücü, P2-18'deki kayıt kararının Defter Yankısı'na göre iki ayrı ölçekte kurulur. |
| P3-28 | Sesin Sahibi | Kaan/Mara | Lindqvist dallanmasına göre kule güvenlik anahtarı elde edilir; Sarr'la ilk yüz yüze sahnede maske çatlar. |
| P3-29 | Leylek Düşüşü: Halka **(S6)** | Solene | Kara Leylek, Zenit Halkası'ndaki yedek çekirdeği düşürür; sokak → yörünge kesintisiz akışın kampanyadaki en büyük sahnesi. |
| P3-30 | Leylek Düşüşü: Kule **(S7)** | Kaan + Mara | Kaan kule güvenliğini kırar, Mara Zihin İnişi'ne başlar; üç protagonist arasında serbest geçiş taktik katmandır (LW-GDD-02). |
| P3-31 | Defter Kararı | Mara/Ortak | Mara REGENT'in içinde Deniz'le yüzleşir: Sil / Kurtar / Devret; hangi son seçilirse seçilsin şehir kademe kademe aydınlanır. |

### 3.4 Perde Dönüm Noktaları, Soygun Dağılımı ve Çatışma Kotası

| Perde | Dönüm noktası | Soygunlar | "Kaçınılmaz çatışma odası" kotası (1/perde) |
| --- | --- | --- | --- |
| I — Silinti | Sarr'ın kişisel seslenişi (P1-09) | S1 Theta Konvoyu | Kullanılmaz (rezerv) |
| II — Hafıza Defteri | Orta nokta: Vasquez ihaneti (P2-20) · Dönüş: Deniz ifşası + Sıfır Defter (P2-22) | S2, S3, S4 | P2-20 güvenli ev düşüşü (anlatısal gerekçe: pusu) |
| III — Karanlık Parlar | Doruk: Defter Kararı (P3-31) | S6, S7 | P3-30 kule çekirdek dairesi |

S5 (**Meridyen Kasası**) Karat Sendikası fraksiyon hattının finalidir (bkz. 5.2) — 7 ana soygunun ana akış dışındaki tek üyesi. PANOPT durum tavanı perdeyle yükselir: Perde I'de Bastırma yalnız P1-08'de görülebilir; **Silinme Protokolü** (durum 5) kanon gereği yalnız 3. perde sonrası açılır (LW-GDD-03) ve kampanyada ilk kez P3-30 başarısızlık dalında sahnelenir.

---

## 4. Karakter Görevleri (21 görev)

| Zincir | Protagonist | Görev | Tema ve mekanik omurga | Dünya bağı |
| --- | --- | --- | --- | --- |
| **Kayıt Dışı** (LW-GDD-02) | Mara | 6 | Okafor'un hayatını kurtarma; hayalet kayıt toplama, Hafıza Simsarları ile pazarlık | Tamamlanmazsa Okafor P2-20'de ölür; Hatırlayanlar desteği P3'te zayıflar |
| **Onbir Adım** | Kaan | 6 | Kaybolan birlik arkadaşlarının ailelerine hesap verme; her görev bir ismin hikâyesini kapatır | Her kapanan isim Pas Kuşağı Gerilim Endeksi'ni −3 düşürür |
| **Açık Hesap** | Solene | 6 | Kara Leylek'in on yıllık borcunun son taksitleri; İrtifa Loncası içi güç oyunları | Zincir finali Kara Leylek'e benzersiz gövde modülü açar (yalnız oynanışla — kanon) |
| **Fener Nöbeti** | Mara (+Sayra) | 3 | Mara'nın su fobisiyle kademeli yüzleşme; Sisaltı dalış görevleri, Sayra ile güven inşası | Tamamlanırsa Sisaltı su altı POI'leri Mara'ya açılır; fobi HUD etkileri kalıcı hafifler |

**Kurallar:** Karakter görevi ödülleri LM'den çok ilişki ve yetenek bağlamı taşır; zincir finalleri asla ana hikâye önkoşulu değildir ama P3 ittifak sahnelerinin diyaloglarını ve yardım ölçeğini değiştirir (Defter Yankısı üzerinden, bildirimsiz — LW-GDD-02).

---

## 5. Fraksiyon Hatları (9 hat, 43 görev)

### 5.1 İtibar Puanı (İP) Ölçeği

Fraksiyon itibarı −100 ile +100 arasında tutulur; beş kademe mekanik etki üretir:

| Kademe | Aralık | Etki (örnekler) |
| --- | --- | --- |
| Düşman | ≤ −60 | Bölgede saldırganlık, ticaret kapalı, fraksiyon pusu dünya olayları |
| Soğuk | −59 … −20 | Fiyatlar +%8, görev vericileri kapalı |
| Nötr | −19 … +19 | Taban durum |
| Güvenilir | +20 … +59 | Fiyatlar −%8 (LW-GDD-01 ilkesiyle uyumlu), hat görevleri açık |
| Aile | ≥ +60 | Hat finali + benzersiz hizmet (iz kaybettirme, güvenli ev, istihbarat indirimi) |

Standart hat görevi +8 İP, hat finali +20 İP, fraksiyona ihanet −40 İP verir. İP değişimleri Kalıcı-yumuşak sınıfında saklanır (LW-GDD-04).

### 5.2 Hat Tablosu

| Fraksiyon | Hat adı | Görev | Tema | "Aile" kademesi ödülü |
| --- | --- | --- | --- | --- |
| Kül Köpekleri | Ocak Sönmesin | 5 | Mahalle savunması, Kessler-Voss vekâlet savaşı | Pas Kuşağı'nda ücretsiz araç zırh servisi |
| Kanalcılar | Kuru Kalmak | 5 | Kaçakçılık, 94 Ateşkesi diplomasisi | Sisaltı'nda iz kaybettirme: İlgi durumu 30 sn'de çözülür |
| Hafıza Simsarları | Fiyatı Sor | 4 | Bilgi ticareti ve ahlaki maliyeti | İstihbarat paketlerinde −%25 (LW-GDD-03 soygun hazırlığı) |
| Silinmişler | İsimsizler Defteri | 6 | Silinenlere isim iadesi; REGENT kanıt kırıntıları | Sahte kimlik: Hayalet Defter süresi +%50 |
| Kök Sendikası | Tohum ve Tasma | 5 | Mirai lisans tasmasına karşı emek mücadelesi | Bahçeler güvenli evi + Gerilim düşürücü hasat işleri |
| Karat Sendikası | Kasa Her Zaman Kazanır | 5 | Borç, bahis ve Sable ile defter savaşı; finali **Meridyen Kasası (S5)** | Neon Liman'da bahis komisyonu 0; S5 erişimi |
| İrtifa Loncası | Halat Payı | 5 | Yıldırım Orbital tekeline karşı serbest pilotluk | Asansör kaçak rotası: kabin üstü biniş serbestisi |
| Kervan | Yol Geleneği | 4 | Dış Halka konvoy koruması, Echo-7 teması | Dış Halka hızlı konvoy geçişi + takas indirimleri |
| Beyaz Eldiven | Fısıltı Fiyatına | 4 | Kordon sırlarının ekonomisi | Kordon sosyal kılık erişimi: 1 görev/gün "davetli" statüsü |

**Çapraz kural:** Karşıt fraksiyonlarda (ör. Hafıza Simsarları ↔ Silinmişler; İrtifa Loncası ↔ Yıldırım kontratları) aynı anda "Aile" olunamaz; +60'a ulaşmak karşıt tarafı −20'ye iter. Vekâlet savaşları LW-GDD-01'deki fay hattı tablosundan türetilir.

---

## 6. Dünya Olayları (sistemik görev katmanı)

- **Üretim:** Dünya olayları LW-GDD-04 dinamik olay motorundan örneklenir; Gerilim Endeksi (0–100) ana girdi olup 70+ bölgelerde Çatışma sınıfı olayların ağırlığı üç katına çıkar.
- **Şablon bütçesi:** Lansmanda 60 el yapımı şablon — 28 Ayak İşi, 24 Bölge Olayı, 8 Şehir Olayı. Her şablon en az 3 sonuç varyantı taşır (müdahale et / sömür / görmezden gel).
- **Görevle bağ:** Ana görev sırasında tetiklenen dünya olayları görevle yarışmaz; görev alanının 150 m yarıçapında olay üretimi bastırılır (tempo koruması). Görev *sonuçları* ise olay üretir: soygun sonrası bölgede 2 oyun-günü "sigorta denetçileri" Ayak İşi zinciri belirir.
- **PANOPT bağı:** Dünya olayına müdahale de profil besler (kanon: hiçbir eylem bedava değildir); "kahramanlık" kalıbı Yöntem/Hedef eksenlerine işlenir ve Müdahale kompozisyonunu değiştirir.

---

## 7. Soygun İskeleti (7 ana soygunun standardı)

Aşağıdaki yedi adım, LW-GDD-03'ün üç fazına birebir eşlenir; hiçbir soygun bu iskeletin dışına çıkamaz, her soygun iskeleti farklı doldurur.

| Adım | Faz (LW-GDD-03) | İçerik | Sınır değerleri |
| --- | --- | --- | --- |
| 1. Planlama | Hazırlık | Hedef seçimi, tez cümlesi, masa başı plan sahnesi (yürüyen/masa brifingi, kesintisiz) | Plan sahnesi ≤ 6 dk; atlanabilir özet modu vardır |
| 2. İstihbarat | Hazırlık | 5 kaynaktan en az 2'si zorunlu: fiziksel keşif (Kaan), sistem haritası (Mara), rota etüdü (Solene), köstebek, satın alınmış paket (12.000–40.000 LM) | Kaynak başına 1 komplikasyon silinir; hiçbir hazırlık komplikasyonları sıfırlamaz |
| 3. Ekipman / personel | Hazırlık | 12 kiralanabilir uzman havuzundan seçim (%5–15 pay); araç, zula (2 nokta), kılık | Ucuz uzman "tik"leri gizli değil, dosyasında okunur — risk bilinçli alınır |
| 4. Yaklaşım varyantı | Hazırlık → İnfaz | **Gürültülü** (cephe) / **Hayalet** (izsiz) / **Truva** (içeriden) — üçü de uçtan uca oynanabilir | Vektör değişimi infaz sırasında mümkündür ama hazırlık bonusları yanar |
| 5. İcra | İnfaz | 3 zorunlu karar anı + PANOPT profiline göre 1–3 uyarlanabilir komplikasyon; ana soygunlarda 3 protagonist eşzamanlı sahnede, senkron kararlar | İnfaz 25–60 dk; alarm öncesi vazgeçme hakkı saklıdır |
| 6. Kaçış | Kaçış | Hazırlıkta seçilen plan + B planı; ganimet ağırlığı hız/imza cezası ("ne kadarını bırakıyorsun?") | 5–15 dk; B planı yoksa doğaçlama kaçış kapsama haritasına karşı oynanır |
| 7. Bölüşüm | Kaçış sonrası | **Pay Masası** sahnesi: ekip payları düşülür, ganimet Sıcak Para olur (2 oyun-günü; aklama %8–20), bölge etkisi işlenir (Gerilim +10–25) | Kusursuz Hayalet infazı ek LM vermez; itibar ve anlatı verir (kanon) |

**Bölüşüm kuralları:** Pay Masası diyalogları ekip uzmanlarının performansına göre yazılır (panikleyen sürücü payını savunamaz — pazarlık seçeneği açılır). Ekip üyesi kaybı payını mirasçısına taşır; ödemeyi reddetmek ilgili uzman loncasında −40 İP'dir ve o uzman sınıfı 1 perde boyunca kiralanamaz.

---

## 8. Örnek Görev Dökümleri (protagonist başına bir)

### 8.1 Mara Vex — "Hafıza Kasası" (P2-11 · Soygun S2)

- **Tez cümlesi:** Bir anı, sahibine iade edilene kadar çalıntıdır.
- **Bölge / kapsama:** Çekirdek (%98 — şehrin en dik PANOPT eğrisi). **Süre hedefi:** Hazırlık 45–90 dk + İnfaz 35 dk + Kaçış 8 dk.
- **Kurulum:** Hatırlayanlar, Aeon Dynamics'in soğuk arşiv kasası "Sessiz Oda"da tutulan silinti dosyalarını ister; içlerinde Deniz dosyasının B parçası vardır. PANOPT, Mara'nın profilindeki **Yöntem** eksenini (siber ağırlıklı) okumuş ve kasayı hava boşluklu (air-gap) kurmuştur — LW-GDD-03 karşı tedbir tablosunun anlatıya dönüşmesi: *hack yetmez, içeri gireceksin.*

| Beat | Sahne | Çekirdek mekanik | Süre | PANOPT durumu |
| --- | --- | --- | --- | --- |
| B1 | Katmanaltı brifingi (yürüyen) | Vektör + istihbarat seçimi | 5 dk | — |
| B2 | Çekirdek'e giriş | Hayalet: **Hayalet Defter** ile klonlanmış NPC profili · Truva: temizlik taşeronu kılığı · Gürültülü: Kaan dikkat dağıtma ekibi | 8 dk | Sessiz İzleme |
| B3 | Kule lobisi ve servis katları | Kamera zincirleme yasak bölge (air-gap yaklaşıyor); sosyal sızma | 7 dk | Sessiz İzleme → İlgi (hata hâlinde) |
| B4 | Sessiz Oda | Analog **Kilit/Bypass** mini oyunu — Mara'nın konfor alanı dışı; İşlem Çekirdekleri işlevsiz | 6 dk | — (hava boşluğu: sistem kör, insan devriye kördüğüm) |
| B5 | Geri-iz pususu | Kessler-Voss buz taşıyıcısı **Geri-İz Savunması** (10 sn, yüksek baskı — LW-GDD-03) | 2 dk | İlgi |
| B6 | Kaçış | Omur Hattı (hızlı, izlenir) vs. Kanal Ağı (yavaş, kör) rota kararı | 8 dk | İlgi → Müdahale (gürültü dalında) |
| B7 | İade vinyeti | Dosya parçasının Hatırlayanlar'a teslimi; isim geri verilir (umut kıvılcımı) | 3 dk | — |

- **Dallanmalar:** (1) B2'de klonlanan profil seçimi kalıcıdır — temizlikçi Nadya seçilirse görevden sonra Nadya sorguya alınır; Mara "Kayıt Dışı" zincirinde onu aklayabilir (NPC kişisel hafızası, önem skoru ≥3 → kalıcı; LW-GDD-04). (2) B4'te *kopyala* (iz yok) / *orijinali al* (Aeon fark eder: Çekirdek Gerilim +10, Hatırlayanlar'a +8 İP ek). (3) Dosya Hafıza Simsarları'na satılabilir: +45.000 LM, ama Silinmişler −40 İP ve Deniz hattı 1 görev gecikir (Defter Yankısı, bildirimsiz).
- **Başarısızlık halleri:** Tespit → görev bitmez; bina Müdahale'ye geçer, B6 tam takip varyantında oynanır ve Mara profilinin **İmza** eksenine "kule işi" işlenir (bir sonraki Çekirdek görevinde tespit süresi −%60 — kanon değeri). Geri-iz kaybı → Mara'nın konumu düşer, güvenli ev 1 oyun-günü "sıcak" olur. Dosya imha koruması tetiklenirse → parçanın %60'ı kurtulur, kalanı P2-13'te ek hedef olarak belirir (Kayıp sınıfı dal).
- **Ödüller:** 18.000 LM (Hatırlayanlar mütevazı öder) + Silinmişler +8 İP; kusursuz Hayalet infazında ek LM yok, "İsimsiz İş" anlatı bonusu ve Hatırlayanlar diyalog seti değişir (kanon: stil parayla değil kimlikle ödüllenir).

### 8.2 Kaan "Ghost" Demir — "Sessiz Servis Arşivi" (P2-15)

- **Tez cümlesi:** Kefaret, kendi dosyanı okumaya katlanmaktır.
- **Bölge / kapsama:** Kordon (%95 + Kessler-Voss özel güvenlik — çifte tepki katmanı, LW-GDD-01). **Süre hedefi:** 45–50 dk.
- **Kurulum:** Theta emir zincirinin aslı, Kordon'daki Kessler-Voss eğitim tesisinin arşivindedir. Kaan'ın pasif avantajı (PANOPT onu tanımaz — düşük başlangıç profili) burada sınanır: tesiste biyometrik tarama, "ölü personel" kaydıyla eşleşme riski taşır.

| Beat | Sahne | Çekirdek mekanik | Süre | PANOPT durumu |
| --- | --- | --- | --- | --- |
| B1 | Pas Kuşağı brifingi (dövüş arenası kenarı) | Kül Köpekleri istihbaratı + vektör seçimi | 5 dk | — |
| B2 | Beyaz Kapı geçişi | Truva: Beyaz Eldiven rüşveti (6.000 LM, "davetli" kimliği) · Hayalet: servis tüneli (Izgara Dışı, implant kapalı) | 8 dk | Sessiz İzleme |
| B3 | Tesis içi ilerleme | Yakın dövüş bayıltma varyantları; akıllı-kilitli KV silahları Kaan'ın elinde çalışmaz (dünya kuralı, LW-GDD-01) | 10 dk | Sessiz İzleme → İlgi |
| B4 | Arşiv — Theta dosyası | Oynanabilir hafıza sekansı: Kaan reddettiği geceyi dosya kayıtları üzerinden yeniden yaşar; sessizlik seçeneği yazılıdır (LW-GDD-02) | 7 dk | — |
| B5 | Lindqvist yüzleşmesi | **İfşa / müttefik tut** hat seçimi (LW-GDD-02'deki dallanmanın sahnesi); şiddet seçeneği geri dönüşsüzdür | 6 dk | — |
| B6 | Kaçış | **Hedef** ekseni tetiklenir: Lumen Compact varlığına ısrar → Kessler-Voss özel av timi (kanon karşı tedbiri) | 9 dk | Müdahale |

- **Dallanmalar:** (1) B2'de biyometrik eşleşme olursa sistem "ölü adam yürüyor" anomalisi üretir — alarm değil, *sessiz bir REGENT bayrağı*: P3-30'da kule savunması Kaan'a özel bir karşılama hazırlar (Defter Yankısı'nın en uzun menzilli örneği). (2) Lindqvist müttefik tutulursa P3-28'de kule güvenlik katmanı −1 zorluk kademesi; ifşa edilirse Kessler-Voss iç soruşturması Kordon Gerilim Endeksi'ni +15 oynatır ve "Ocak Sönmesin" hattına 2 ek görev açılır. (3) Şiddet dalında Lindqvist ölür: Kaan'ın "Onbir Adım" zincirindeki iki görev anlatıcısız kalır ve farklı, daha yalnız varyantlarla oynanır.
- **Başarısızlık halleri:** Alarm → arşiv acil kilitlenir, dosyanın %60'ı alınır; kalan parça P3-28'e taşınır (Kayıp dalı). Av timinden kaçılamazsa Kaan yakalanmaz — Kordon dışına "atılır" ve Kademe 2 Kısıtlama yer (Omur Hattı erişimi 1 oyun-günü kapalı; LW-GDD-01 ceza kademeleriyle tutarlı). Ölüm tek başarısızlık ekranıdır.
- **PANOPT entegrasyonu:** Kaan'ın **Izgara Dışı** oynayışı profil beslemez (kanon); ancak görev boyunca aynı pompalı tüfek kullanılırsa **İmza** ekseni işler ve av timi sonraki karşılaşmada ağır zırhla gelir. Bakış Göstergesi Kordon'da 0,5 sn kayıt piktogramını her ihlalde basar (adalet korkuluğu, LW-GDD-03).
- **Ödüller:** 14.000 LM (Kül Köpekleri fonu) + Kül Köpekleri +8 İP; Lindqvist müttefik dalında LM ödülü yoktur — ödül, P3'te somutlaşan güvenlik avantajıdır (gecikmiş fatura ilkesinin olumlu yüzü).

### 8.3 Solene Adeyemi — "Sağır Kargo" (P2-17 · Soygun S3)

- **Tez cümlesi:** Taşımadığın yükün de bir ağırlığı vardır.
- **Bölge / kapsama:** Yükseliş → alçak yörünge (PANOPT yetkisi yörüngede "danışma" düzeyinde — asıl otorite Yıldırım istasyon protokolü, LW-GDD-01) → Sisaltı (%25). **Süre hedefi:** Hazırlık 30–60 dk + İnfaz 30 dk + Kaçış 10 dk.
- **Kurulum:** Yıldırım Orbital, Sisaltı üstüne yeni nesil sensör ağı taşıyan bir mekik kaldırmaktadır — teslim edilirse PANOPT'un Sisaltı kapsaması geçici olarak %25 tabanından +15 puan yükselecektir. İrtifa Loncası ve Kanalcılar yükün "kaybolmasını" ister. Solene için mesele para değildir: kör nokta, onun gibi kayıtsız doğanların tek vatanıdır.

| Beat | Sahne | Çekirdek mekanik | Süre | PANOPT durumu |
| --- | --- | --- | --- | --- |
| B1 | Halat Tabanı brifingi | Vektör seçimi: yörünge bordası / atmosfer girişinde ısı gölgesi yaklaşımı / rıhtımda manifest sahteciliği (Truva) | 6 dk | — |
| B2 | Tırmanış ve kesişme | Newtoncu uçuş + ısı imzası yönetimi; Kara Leylek yakıtı 2.400–6.000 LM (kanon maliyet üçgeni) | 8 dk | — (yörünge: istasyon protokolü) |
| B3 | Borda ve sıfır-G güverte | Manyetik bot, dekompresyon kuralı: kinetik silah cam/gövde delme riski, 20 sn ortam tehlikesi (kanon) — enerji silahı seçimi anlam kazanır | 9 dk | — |
| B4 | Kargo kararı (zamanlı) | **Düşür** (Kanalcılar'a) / **çal ve sat** (LM) / **teslimatı bırak** (Yıldırım'a jest); süre dolarsa Solene'in yay konumu karar verir (LW-GDD-02 zamanlı seçim kuralı) | 3 dk | — |
| B5 | Atmosfer girişi kaçışı | **Kaçış** ekseni tetiklenir: Solene profili "dikeyde kaçar" der — hava koridoru drone barikatı kurulur (kanon karşı tedbiri); ısı gölgesinde süzülme alternatifi | 7 dk | İlgi → Müdahale |
| B6 | Batık Meydan bölüşümü | Pay Masası: Lonca payı, Kanalcı payı, Sıcak Para işaretlemesi | 4 dk | — (Sisaltı %25: sistem söylentiyle görür) |

- **Dallanmalar:** (1) Borda başarısız olursa görev bitmez — mekik Zenit rıhtımına kaçar ve görev 48 saat içinde oynanan zorlu rıhtım varyantına dallanır (Fırsat kaçışı dalı; istihbarat yeniden kullanılır). (2) B4 *sat* dalı: kargo 60.000 LM Sıcak Para'dır (aklama %8–20); Kanalcılar −20 İP — kör noktayı paraya çevirmek affedilmez. (3) *Teslim* dalı: Yıldırım "temiz sicil" jesti — 5 oyun-günü gümrük taramalarında kolaylık; ama sensörler kurulur ve Sisaltı görevleri 1 hafta boyunca yükseltilmiş kapsamayla oynanır (Kanalcılar sabotajı tabanı %25'e döndürür — dünya kendini onarır, oyuncu faturayı yaşar).
- **Başarısızlık halleri:** Kargo hasar alırsa satış/teslim değeri −%40 (Kayıp dalı). Kimlik deşifre olursa Yıldırım Orbital 3 oyun-günü konvoylarına eskort ekler — sonraki Solene hattı görevleri sertleşir (Bedel dalı). Kara Leylek ağır hasar alırsa görev kaybedilmez; Batık Meydan'a "düşerek" iniş sahnelenir ve onarım 12.000 LM'dir.
- **PANOPT entegrasyonu:** Yörünge beat'leri profil beslemez (kapsama dışı), atmosfere girişte sistem devralır ve **Zaman** ekseni işler: hep gece uçan Solene'e gece sensör hassasiyeti artışı uygulanır (kanon karşı tedbiri) — görev gündüz uçularak profile karşı oynanabilir. Bakış Göstergesi atmosfer girişinde yanar; İlgi 90 sn temiz uçuşla çözülür (kanon).
- **Ödüller:** *Düşür* dalı: 22.000 LM (Lonca) + Kanalcılar +8 İP + İrtifa Loncası +8 İP; *sat* dalı: 60.000 LM brüt, itibar bedeli yukarıda; *teslim* dalı: 9.000 LM taşıma ücreti + gümrük jesti. Üç dal da geçerli oyunculuktur — tez cümlesi hangisini seçerseniz seçin sizinle gelir.

---

## 9. Görev–Dünya Bağıntısı (LW-GDD-04 ile arayüz)

Görev sonuçları, LW-GDD-04'ün kalıcılık sınıflarına yazılır; görev tasarımcısı her görev için aşağıdaki beş kanalı doldurur:

| Kanal | Taşıyıcı sistem | Örnek (bu belgedeki görevlerden) | Kalıcılık sınıfı |
| --- | --- | --- | --- |
| **Gerilim Endeksi** | Bölge durumu (0–100, LW-GDD-03) | S2 orijinal dosya alınırsa Çekirdek +10; soygunlar +10–25 | Kalıcı-sert |
| **Piyasa** | Bölgesel fiyat dalgalanması ±%4–18 (kanon) | Sağır Kargo teslimatı Sisaltı karaborsa donanım fiyatlarını +%12 oynatır | Ekonomik |
| **NPC hafızası** | Kişisel hafıza, önem skoru ≥3 (LW-GDD-04) | Klonlanan Nadya, Mara'yı hatırlar; son 10 saat hafıza garantisi geçerli | Kalıcı-yumuşak |
| **PANOPT profili** | 6 eksenli davranış modeli (LW-GDD-03) | Her görev beyan ettiği eksenleri besler; model çürümesi 7 oyun-günü / −%50 | Kalıcı-yumuşak |
| **Haber döngüsü** | Sable ekranı + korsan yayın ikiliği (LW-GDD-01) | Şehir Olayları ve soygunlar iki ayrı versiyonla duyurulur | Kalıcı-yumuşak |

**Defter Yankısı takvimi:** Hat seçimlerinin faturaları 1–3 görev gecikmeyle döner (LW-GDD-02) ve arayüz bunu asla bildirimle duyurmaz. Görev tasarımcısı her yankı için "dönüş görevi + dönüş biçimi" satırı yazar; yankısız kalan hat seçimi inceleme reddi sebebidir. En uzun menzilli yankı standardı: en geç bir sonraki perdenin ikinci görevine kadar dönmüş olmalıdır (istisna: 8.2'deki REGENT bayrağı gibi finale saklanan tekil yankılar, Anlatı Ekibi onayıyla).

**Anlatısal enkaz:** Görevlerin yarattığı kalıcı sahne değişiklikleri (düşen vinç, yanık cephe, kapanan pasaj) LW-GDD-04'ün "anlatısal enkaz" istisnasıyla dünyada bırakılır; görev başına en fazla 2 enkaz nesnesi bütçelenir (akış bütçesi koruması, LW-GDD-07).

---

## 10. Tempo Eğrisi ve Görev Yoğunluğu Metrikleri

### 10.1 Perde İçi Tempo Bantları

Her perde, 1–10 yoğunluk ölçeğinde hedeflenen bir eğri izler; ardışık iki "yüksek" (8+) görevden sonra bir "nefes" (≤4) vuruşu zorunludur (Bahçeler/Sisaltı sahneleri doğal nefes alanlarıdır — LW-GDD-01 bölge rolleri).

| Perde | Açılış | Orta | Kapanış | Nefes vuruşları |
| --- | --- | --- | --- | --- |
| I — Silinti | 6 (üç paralel açılış) | 4–5 (kesişme, öğretim) | 8 (S1 + Sarr seslenişi) | P1-06 Sisaltı inişi |
| II — Hafıza Defteri | 5 (hat seçimi serbestliği) | 7 → 9 (hat dorukları, ihanet) | 10 (S4 + Sıfır Defter) | Hat aralarında serbest dolaşım; P2-21 yas vuruşu |
| III — Karanlık Parlar | 7 (karartılmış şehir) | 6 (ittifak turu — ritim çeşitliliği) | 10 → 3 (Leylek Düşüşü → kapanış sükûneti) | P3-25 Çatı Sofrası |

### 10.2 Yoğunluk ve Dağılım Metrikleri (hedef)

| Metrik | Hedef | Kaynak / gerekçe |
| --- | --- | --- |
| Ana görev ortalama süresi | 35–50 dk | Kanon (LW-GDD-03) |
| Yan sözleşme süresi | 12–20 dk | Kanon (LW-GDD-03) |
| Karar noktası sıklığı (görev içi) | ≥ 1 / 45 sn | Kanon döngü metriği |
| Görev başına gözlemlenebilir dünya sonucu | ≥ 3 | Sonuç Kapısı (1.3) |
| El yapımı görev toplamı | 95 (31 ana + 21 karakter + 43 fraksiyon) + 60 dünya olayı şablonu | Bu belge |
| Görev vericisi yoğunluğu | 310 km²'de ~140 nokta (≈ 0,45/km²); Çekirdek/Neon Liman/Gölgepazar'da 2–3× yoğun | Bölge kimliklerine göre ağırlıklı |
| Oyuncunun 3 dk yürüme yarıçapında opsiyonel içerik | ≥ 2 | Serbest dolaşım doygunluğu |
| Ana görevler arası dayatılmış bekleme | 0 — tempo daima oyuncunun elindedir | Tasarım ilkesi |
| Başarısızlık dalı bütçesi | Ana görev başına ≥ 2 yazılmış dal; senaryo varyant bütçesi görev başına ort. 1,4 sahne | 1.2 taksonomisi |
| Tamamlama hunisi (hedef) | P1 finali %82 · P2 finali %64 · kampanya sonu %52 | Tür ortalamalarının üstü; telemetriyle izlenir |
| "Sistem beni tanıyor" cümlesi | Oyuncuların %80'i 10. saatte; "sistem adaletsiz" %0 | Kanon korkuluğu (LW-GDD-03) |

### 10.3 Ödül Temposu

LM ödül bantları LW-GDD-05 kazanç eğrisine kilitlenir (orta oyun hedefi 12.000–18.000 LM/saat): Perde I ana görevi 6.000–10.000 LM, Perde II 10.000–18.000 LM, Perde III 16.000–24.000 LM; soygun ganimetleri 60.000–250.000 LM brüt (ekip payları %5–15/uzman düşülür, Sıcak Para kuralı işler). Hikâye tamamlama toplamı ~1,8M LM hedefiyle mutabıktır. Kusursuz infaz asla ek LM vermez; itibar, anlatı ve diyalog verir.

---

## 11. Açık Sorular (Tasarım Direktörlüğü'ne)

1. **REGENT adının ilk telaffuzu:** LW-GDD-01 "ilk üçte birde anılmaz" derken LW-GDD-02 Birinci Perde kesişmesinde Vasquez'e açık ifşa yaptırıyor. Önerimiz adın P1-07'ye (perdenin son çeyreği) çekilmesi — Anlatı Ekibi ile ortak karar ve kanon netleştirmesi gerekiyor.
2. **Perde II hat sıralaması:** Üç hat tamamen serbest mi kalmalı, yoksa zorluk eğrisi için "herhangi 2 hat → P2-20 kilidi açılır" kapısı mı konmalı? Serbestlik ifade ilkesine, kapı tempo kontrolüne hizmet ediyor.
3. **S5 iletişimi:** "7 ana soygun" pazarlama vaadinin bir üyesi (Meridyen Kasası) fraksiyon hattında opsiyonel. Oyuncuların bir bölümünün 6 soygunla bitirmesi vaat ihlali sayılır mı; sayılırsa S5 ana akışa mı alınmalı?
4. **Silinme Protokolü'nün serbest dolaşım davranışı:** LW-GDD-03 "3. perde sonrası açılır" diyor; kampanya bittikten sonra serbest dolaşımda tetiklenme sıklığı ve geri dönüş maliyeti (oyuncuyu cezalandırmadan tehdit hissi) için ayrı dengeleme oturumu talep ediyoruz.
5. **Okafor yedek bütçesi:** "Kayıt Dışı" tamamlanmazsa Okafor ölüyor; P2-21 ve P3 Hatırlayanlar sahnelerinin ölüm varyantları için ek seslendirme/sahne bütçesi onayı gerekiyor (tahmin: +%6 senaryo kaydı).
6. **Fener Nöbeti ve erişilebilirlik:** Mara'nın su fobisinin HUD/ses etkileri, LW-GDD-08'deki bilişsel erişilebilirlik seçenekleriyle çakışabilir; fobi sunumunun "kapatılabilir ama yayı bozmayan" bir modeli için Oyuncu Deneyimi Lideri ile ortak tasarım gerekiyor.

---

## Sürüm Geçmişi

| Sürüm | Tarih | Yazar | Değişiklik |
| --- | --- | --- | --- |
| 1.0 | 5 Temmuz 2026 | Görev Tasarımı Lideri | İlk sürüm |

**Kurgusallık Notu:** Bu belge bir konsept çalışmasıdır. LUMENFALL, Lumenworks Studios, Duskforge Engine ve burada geçen tüm kişi, kurum, ürün, görev ve olaylar tamamen kurgusaldır; gerçek kişi, kurum veya ürünlerle benzerlikler tesadüfidir. Belirtilen sayılar, tarihler ve hedefler herhangi bir ticari taahhüt oluşturmaz.
