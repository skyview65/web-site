# LUMENFALL — Erişilebilirlik

> **"Karanlık parlar."** — ve herkes için parlamalıdır.

| Alan | Değer |
| --- | --- |
| **Belge No** | LW-GDD-08 |
| **Sürüm** | 1.0 |
| **Tarih** | 3 Temmuz 2026 |
| **Sahip** | Lumenworks Tasarım Ekibi |
| **Durum** | İnceleme |
| **Gizlilik** | Stüdyo İçi — Dağıtım Onaya Tabidir |

Bu belge, **LUMENFALL**'un (2027 · PC / 9. nesil konsollar / Bulut) erişilebilirlik
standartlarını tanımlar. Kapsam hem tek oyunculu hikâyeyi hem de **LUMENFALL
Online**'ı içerir. Buradaki tüm gereksinimler [LUMENFALL Kanonu](README.md#kanon-i̇lkesi)
ile bağlayıcıdır; sistem düzeyindeki bağımlılıklar için `03-oynanis-sistemleri.md`
(LW-GDD-03), `04-acik-dunya-simulasyonu.md` (LW-GDD-04) ve
`07-teknoloji-hedefleri.md` (LW-GDD-07) belgelerine çapraz referans verilir.

## Erişilebilirlik Vizyonu

Lumenfall şehri, 310 km²'lik kesintisiz dünyasında 1.2 milyon simüle vatandaşa
yer açıyorsa, gerçek dünyadaki her oyuncuya da yer açmak zorundadır.
Erişilebilirlik, LUMENFALL'da bir "mod" veya sonradan eklenen bir menü değil,
tasarımın kendisidir.

### İlkeler

1. **Varsayılan olarak erişilebilir:** Hiçbir kritik bilgi tek bir duyu
   kanalıyla (yalnızca renk, yalnızca ses, yalnızca titreşim) iletilmez.
2. **Ayrık ayarlar, paket değil:** Her seçenek tek tek açılıp kapatılabilir;
   "kolay mod" gibi hepsi-ya-hiç paketleri dayatılmaz.
3. **Ceza yok:** Hiçbir erişilebilirlik ayarı başarımları, ilerlemeyi, Lümen
   (LM) kazanımını veya LUMENFALL Online sezon ödüllerini kilitlemez.
4. **İlk açılışta sor:** Oyun ilk başlatıldığında, herhangi bir logo veya ara
   sahneden önce erişilebilirlik sihirbazı sunulur (metin boyutu, altyazı,
   renk modu, titreşim, girdi şeması).
5. **Her an değiştirilebilir:** Tüm ayarlar görev ortasında, soygun ortasında,
   hatta Zenit Halkası'na çıkan asansörün içinde bile değiştirilebilir —
   %100 kesintisiz dünya, kesintisiz ayar menüsü demektir.
6. **Diegetik açıklama:** Mümkün olduğunda yardımlar dünya içinde
   gerekçelendirilir; örn. hedef hatırlatıcıları PANOPT'un "hafıza defteri"
   estetiğiyle sunulur — ama hiçbir yardım, kurgu bahanesiyle kısıtlanmaz.

### Sayısal hedefler

| Hedef | Değer |
| --- | --- |
| Ayrı ayarlanabilir erişilebilirlik seçeneği | Lansmanda ≥ 110 |
| Erişilebilirlik ön ayar profili (kaydedilebilir) | Oyuncu başına 4 |
| İlk açılış sihirbazı tamamlanma süresi | ≤ 90 saniye |
| Ayar değişikliğinin etkinleşme gecikmesi | Anında (yeniden başlatma yok) |
| Çapraz ilerlemeyle taşınan ayarlar | Tümü (bulut profili, LW-GDD-06) |

## Görsel

Lumenfall'un görsel kimliği — vantablack zemin üzerinde elektrik camgöbeği,
sıcak macenta ve sinyal amber — yüksek kontrastlı bir neon dilidir; bu dil,
görme çeşitliliğine göre yeniden kalibre edilebilir olmalıdır.

### Renk körlüğü modları

| Mod | Kapsam |
| --- | --- |
| Döteranopi | Tüm HUD, mini harita, tehdit işaretleri, piyasa arayüzü yeniden eşlenir |
| Protanopi | Aynı kapsam |
| Tritanopi | Aynı kapsam |
| Özel palet | Oyuncu 12 anlam kanalının (düşman, müttefik, Crew üyesi, etkileşim, tehlike, iyileştirme vb.) her birine kendi rengini atar |

- Protagonist aksan renkleri (Mara Vex: macenta · Kaan "Ghost" Demir:
  camgöbeği · Solene Adeyemi: amber) her renk modu için ayırt edilebilirliği
  laboratuvar ortamında doğrulanmış alternatif tonlara eşlenir; karakter
  geçiş çarkında renkle birlikte **daima** benzersiz simge + isim etiketi
  kullanılır.
- Renk hiçbir zaman tek başına anlam taşımaz: PANOPT aranma durumu renk +
  simge + kademeli çerçeve deseniyle; bölge savaşlarında (LW-GDD-06) taraf
  kontrolü renk + doku taramasıyla gösterilir.
- Filtreler tam ekran post-process olarak değil, **anlam kanalı bazında**
  uygulanır; dünyanın sanat yönetimi bozulmaz.

### HUD ölçekleme

| Ayar | Aralık | Varsayılan |
| --- | --- | --- |
| Genel HUD ölçeği | %50 – %200 (%5 adım) | %100 |
| Öğe bazında ölçek (mini harita, hedef, cephane, piyasa bildirimi) | %50 – %200 | %100 |
| HUD öğesi gizleme | Öğe başına aç/kapa | Tümü açık |
| Mini harita boyutu ve konumu | 4 köşe + 3 boyut | Sağ alt / Orta |
| Güvenli alan (overscan) | %85 – %100 | %95 |
| HUD arka plan koyuluğu | %0 – %80 | %0 |

- Metin tabanlı tüm HUD öğeleri gövde yazı tipinde (Inter Tight) 4K'da
  minimum 28 px eşdeğerinin altına inmez; oyuncu bunu %200'e kadar büyütebilir.
- Disleksi dostu alternatif yazı tipi tüm arayüz için tek anahtarla seçilebilir
  (display tipografisi Orbitron yalnız dekoratif başlıklarda kalır).

### Yüksek kontrast ve görsel konfor

- **Yüksek kontrast modu:** dünya geometrisi nötr koyu tonlara indirgenir;
  düşmanlar, müttefikler, etkileşim nesneleri ve görev hedefleri oyuncunun
  seçtiği kontur renkleriyle çizilir. Duvar arkası hedef siluetleri açılabilir.
- **Parlama ve titreme kontrolü:** neon tabelalar, Karartma sahneleri ve
  elektrik arkı efektleri için "ışık hassasiyeti modu" — saniyede 3 üzeri
  flaş içeren tüm efektler otomatik yumuşatılır (fotosensitif epilepsi
  standardına uyum, bkz. Uyumluluk Hedefleri).
- Ayrı anahtarlar: kamera sarsıntısı (%0–100), hareket bulanıklığı,
  kromatik aberasyon, film greni, lens parlaması, ekran kenarı hasar efekti.
- **Hareket tutması (motion sickness) paketi:** görüş alanı (FOV) 60°–110°,
  sabit nişangâh noktası, araç kamerası yumuşatma, birinci/üçüncü şahıs
  seçimi her an serbest (kanon: isteğe bağlı birinci şahıs).
- **Menü seslendirme:** tüm menüler, piyasa ekranları ve ön sipariş/kozmetik
  mağazası (yalnız Prizma/kozmetik, LW-GDD-05) yerleşik metin-okuma ile
  seslendirilir; PC'de ekran okuyucu desteklenir.

## İşitsel

Lumenfall gürültülü bir şehirdir; ancak hiçbir oyuncu, duyamadığı bir siren
yüzünden PANOPT'a yakalanmamalıdır.

### Görsel ipuçları

- **Ses görselleştirici:** ekran kenarında yönlü halka; silah sesi, patlama,
  ayak sesi, araç motoru ve PANOPT dron vınlaması ayrı simge ve renklerle,
  mesafeye göre ölçeklenen yoğunlukla gösterilir (renk modlarıyla uyumlu).
- PANOPT aranma sistemi (LW-GDD-03) ses uyarılarının tamamını ekran üstü
  eşdeğerleriyle çiftler: tarama başlangıcı, kayıt anı, takip kaybı.
- Diyalog dışı kritik sesler (alarm, kapı, asansör, Kara Leylek kokpit
  uyarıları) altyazı akışında `[köşeli parantezli]` ses etiketi olarak yazılır.
- LUMENFALL Online'da Crew sesli sohbeti için **konuşmadan-yazıya**, yazılı
  sohbet için **yazıdan-konuşmaya** dönüştürme yerleşiktir.

### Mono ses ve miksaj

| Ayar | Aralık | Varsayılan |
| --- | --- | --- |
| Mono ses | Aç/kapa | Kapalı |
| Sol–sağ denge | %0 – %100 | %50 |
| Diyalog / Efekt / Müzik / Ortam / Arayüz ses düzeyleri | Ayrı 5 kanal, %0–100 | %100/%80/%70/%70/%80 |
| Diyalog netliği (dinamik aralık sıkıştırma) | Kapalı / Orta / Yüksek | Kapalı |
| Gece modu (ani ses tepelerini bastırma) | Aç/kapa | Kapalı |

### Titreşim ve haptik

- Titreşim yoğunluğu %0–100; çatışma, sürüş ve arayüz haptiği ayrı ayrı.
- **Haptik ipucu katmanı:** işitme engelli oyuncular için sesli uyarıların
  titreşim desenli eşdeğerleri (örn. PANOPT tarama başlangıcı = üç kısa
  vuruş; kilit çözme başarısı = tek uzun vuruş). Desen sözlüğü oyun içi
  rehberde belgelenir.
- 9. nesil konsollarda gelişmiş haptik ve uyarlanabilir tetikler kullanılır;
  tetik direnci ayrı olarak %0–100 ayarlanabilir veya tamamen kapatılabilir.

## Motor

310 km²'lik şehir ve 200+ araç, tek bir el, tek bir parmak veya yalnızca
gözle de gezilebilir olmalıdır.

### Tam yeniden eşleme

- **Tüm platformlarda** klavye, fare ve denetleyicinin her girdisi yeniden
  eşlenebilir — sistem düzeyi kısayollar hariç istisna yoktur.
- Çubuklar (sol/sağ) takas edilebilir; eksenler tersine çevrilebilir; ölü
  bölge ve hassasiyet eğrisi eksen başına ayarlanır.
- Her eylem için **bas-tut ↔ aç-kapa** dönüşümü: nişan alma, koşma, eğilme,
  sürüşte gaz dahil.
- Art arda basma (mash) gerektiren tüm etkileşimler tek basış veya otomatik
  tamamlama alternatifine sahiptir; QTE'ler kapatılabilir.
- Girdi tampon süresi ve çift tıklama penceresi ayarlanabilir (100–600 ms).
- Üçüncü taraf uyarlanabilir denetleyiciler (platform sertifikalı erişim
  donanımları) lansmanda desteklenir; PC'de göz izleme ve tek anahtarlı
  tarama girişi için arayüz kancaları sağlanır (LW-GDD-07 ile koordineli).

### Tek elle oynama

- Hazır profiller: **Sol el yalnız · Sağ el yalnız · Tek parmak (tarama)**.
- Radyal menüler (silah, araç, karakter geçişi) tek girdiyle gezilebilir;
  otomatik koşma, otomatik tırmanma ve bağlama duyarlı tek tuş etkileşimi
  bu profillerde varsayılan olarak açılır.
- Karakterler arası anlık geçiş (kanon) tek elle erişilebilir tek kısayola
  indirgenebilir; kontrol edilmeyen protagonistler kendi gündemini yaşadığı
  için geçiş hiçbir zaman zaman baskısı altında zorunlu tutulmaz.

### Otomatik sürüş yardımı

| Kademe | Davranış |
| --- | --- |
| 0 — Kapalı | Tam manuel sürüş/uçuş |
| 1 — Şerit desteği | Çarpışma sönümleme, yol tutuş toleransı artışı |
| 2 — Rota takibi | Araç GPS rotasını izler; oyuncu hızı ve saldırıyı yönetir |
| 3 — Otopilot | Belirlenen hedefe tam otomatik seyir; oyuncu her an devralabilir |

- Yardım kademeleri yer araçları, yerden kesik araçlar ve yörünge mekikleri
  için ayrı ayrı seçilir; **yörünge kenetlenme yardımı** Solene'in Yükseliş ↔
  Zenit Halkası hattındaki kenetlenme manevralarını isteğe bağlı otomatikleştirir.
- Nişan yardımı 4 kademelidir (kapalı / hafif çekim / güçlü çekim / hedefe
  kilitlenme) ve sürüş sırasındaki çatışmalarda ayrı bir değerle çalışır.
- Tüm yardımlar tek oyunculu hikâyede sınırsızdır; LUMENFALL Online rekabetçi
  bölge savaşlarında adalet için üst sınırlar LW-GDD-06'da tanımlanır,
  eşleştirme benzer yardım profillerini gözetir.

## Bilişsel

Üç protagonist, dokuz bölge ve oyuncuyu öğrenen bir yapay zekâ; bilgi yükü
bilinçli tasarlanmazsa erişilebilirlik sorununa dönüşür.

### Hedef hatırlatıcıları

- **"Neredeydim?" özeti:** oyuna dönüşte ve istek üzerine, aktif görevin son
  durumu 3 maddelik özet + tek cümlelik sonraki adım olarak sunulur; PANOPT
  "hafıza defteri" estetiğiyle çerçevelenir, karakter aksan rengiyle etiketlenir.
- Görev günlüğü her görev için: amaç · sonraki adım · ilgili bölge · ilgili
  kişiler; kilit terimler (PANOPT, REGENT, Lumen Compact, Sisaltı Seli,
  Büyük Karartma) dokunmatik sözlüğe bağlanır.
- Soygun planlaması (örn. Zenit Kasası, LW-GDD-06) aşamalı kontrol listesi
  olarak gösterilebilir; Crew içinde rol kartları basitleştirilmiş dille sunulur.
- Hatırlatıcı sıklığı: Kapalı / Yalnız istekte / Periyodik (2–10 dk).

### Yön bulma ve bilgi yükü

- **Yer imi modu:** GPS çizgisine ek olarak, dünya içinde belirgin yapı
  siluetleriyle (PANOPT kulesi, yörünge asansörü, Neon Liman ışıkları)
  yönlendiren basitleştirilmiş navigasyon.
- HUD sadeleştirme ön ayarları: Tam · Dinamik (yalnız bağlamda) · Minimal ·
  Sinematik; piyasa dalgalanma bildirimleri (LW-GDD-05) ayrıca susturulabilir.
- Eğitimler istendiğinde yeniden oynanabilir; tüm mekanik açıklamaları
  "Rehber" bölümünde metin + kısa klip olarak arşivlenir.
- Okuma hızı ayarı: zamanlı bilgi kutuları için otomatik ilerleme kapatılabilir,
  bekleme süreleri 2 katına çıkarılabilir veya sınırsız yapılabilir.
- İçerik duyarlılığı: ürkütme anları öncesi isteğe bağlı uyarı simgesi,
  yoğun şiddet karelerini yumuşatan mod (hikâye bütünlüğü korunarak).

### Zorluk esnekliği

- Görevlerde art arda başarısızlıkta oyun **asla kendiliğinden** zorluk
  düşürmez; bunun yerine kontrol noktasında seçenek sunar: yeniden dene ·
  bu bölüm için yardım aç · bu bölümü atla (yalnız tek oyunculu hikâye,
  anlatı özetiyle birlikte).
- Atlanan bölümler daha sonra görev tekrarından oynanabilir; atlama hiçbir
  ödülü kalıcı olarak kilitlemez.

## Zorluk Seçenekleri

LUMENFALL'da zorluk tek bir kaydırıcı değil, birbirinden bağımsız eksenler
kümesidir. Her eksen her an, ceza olmaksızın değiştirilebilir.

| Eksen | Kademeler | Etkilediği sistem |
| --- | --- | --- |
| Çatışma zorluğu | 5 kademe | Düşman isabeti, hasarı, agresyonu (LW-GDD-03) |
| Alınan hasar | %25 – %200 | Oyuncu dayanıklılığı |
| Nişan yardımı | 4 kademe | Hedefleme (bkz. Motor) |
| PANOPT baskısı | 5 kademe + öğrenme sınırı | Uyarlanabilir aranma sisteminin tepki hızı ve hafıza derinliği |
| Sürüş/uçuş toleransı | 4 kademe | Araç hasar eşiği, takip zorluğu |
| Hack/bulmaca süresi | Normal / +%50 / +%100 / Sınırsız | Mara'nın netrunner arayüzleri |
| Kaynak bolluğu | 3 kademe | Lümen (LM) kazanımı değil; cephane/sarf malzemesi bulunurluğu |
| Ölüm cezası | Tam / Hafif / Yok | Kontrol noktası ve kayıp kuralları |

- **PANOPT öğrenme sınırı:** kanondaki uyarlanabilir aranma sistemi oyuncuyu
  öğrenir; erişilebilirlik amacıyla bu öğrenmenin derinliği sınırlanabilir
  veya sıfırlanabilir. Böylece sistemin "oyuncuya uyum sağlaması" hiçbir
  zaman engelli oyuncular aleyhine keskinleşmez.
- Ön ayar paketleri: **Hikâye · Dengeli · Sert · Karartma** — her paket
  yalnızca yukarıdaki eksenlerin bir başlangıç kombinasyonudur; seçim sonrası
  her eksen bağımsız oynanabilir.
- Kaynak bolluğu ekseni oyuncu güdümlü piyasa fiyatlarını (LW-GDD-05)
  değiştirmez; ekonomi bütünlüğü ve pay-to-win yasağı erişilebilirlik
  ayarlarından etkilenmez.

## Altyazı Standartları

Altyazılar varsayılan olarak **açık** gelir ve şehirdeki her konuşma, telsiz
ve haber yayını için sağlanır.

| Özellik | Değer |
| --- | --- |
| Boyut kademeleri | Küçük 32 px · Orta 46 px · Büyük 58 px · Çok Büyük 72 px (4K referans; tüm çözünürlüklerde oransal) |
| Varsayılan boyut | Orta (46 px) — endüstri minimum önerisinin altına hiçbir kademe inmez |
| Yazı tipi | Inter Tight; disleksi dostu alternatif seçilebilir |
| Satır uzunluğu | Satır başına ≤ 38 karakter, aynı anda ≤ 2 satır |
| Okuma hızı hedefi | ≤ 20 karakter/saniye; hızlı diyaloglarda bölme önceliklidir |
| Arka plan | Opaklık %0–100 ayarlı kutu; varsayılan %60 vantablack |
| Kenar | İsteğe bağlı kontur/gölge (arka plan kapalıyken otomatik önerilir) |
| Konuşmacı etiketi | İsim + karakter aksan rengi (Mara: macenta · Kaan: camgöbeği · Solene: amber); renk modlarında güvenli alternatif tonlar, dileyene renksiz yalnız-isim modu |
| Ses etiketleri (SDH) | `[patlama uzakta]`, `[PANOPT dronu yaklaşır]` biçiminde açılabilir katman |
| Yön göstergesi | Ekran dışı konuşmacı için ok işareti (aç/kapa) |
| Kapsam | Ara sahneler, oyun içi diyalog, telsiz, ortam konuşmaları (ayrı anahtar), LUMENFALL Online sesli sohbet dökümü |

- Konuşmacı etiketi rengi hiçbir zaman tek ayırt edici kanal değildir; isim
  etiketi her zaman yazılır.
- Altyazı önizlemesi ayar menüsünde canlı örnekle gösterilir; değişiklik
  anında uygulanır.

## Uyumluluk Hedefleri ve Test Süreci

### Uyumluluk hedefleri

| Standart / Çerçeve | Hedef | Kapsam |
| --- | --- | --- |
| CVAA (iletişim erişilebilirliği) | Tam uyum | Crew sesli/yazılı sohbet, tüm iletişim arayüzleri |
| Platform erişilebilirlik yönergeleri (9. nesil konsollar) | Sertifikasyon kriterlerinin tamamı | Konsol sürümleri |
| WCAG 2.2 AA | Uyum | Menüler, mağaza, eşlik eden web/bulut arayüzleri |
| Fotosensitivite analizi | Tüm sinematik ve efektlerde otomatik + uzman denetimi | Oyunun tamamı |
| Kontrast oranı | Arayüz metinlerinde ≥ 4.5:1 (yüksek kontrast modunda ≥ 7:1) | Tüm HUD ve menüler |

### Test süreci

1. **Tasarım kapısı (her milestone):** yeni her özellik, "Erişilebilirlik
   Etki Kontrol Listesi" olmadan içeriğe alınmaz; liste bu belgenin ekidir
   ve LW-GDD-03/04/06 sahipleriyle ortak imzalanır.
2. **Uzman denetimi:** dış erişilebilirlik danışmanlarıyla yılda 4 denetim;
   Alpha ve Beta'da tam kapsamlı bağımsız denetim raporu.
3. **Katılımcı oyun testleri:** her büyük testte görme, işitme, motor ve
   bilişsel çeşitlilikten oyuncularla ayrılmış oturumlar; Bulut sürümünde
   gecikme koşulları altında yardımların doğrulanması.
4. **Otomasyon:** Duskforge Engine derleme hattında kontrast, flaş sıklığı
   ve altyazı hız ihlallerini yakalayan otomatik testler (LW-GDD-07).
5. **Telemetri:** hangi ayarların kullanıldığı anonim toplanır; lansman
   sonrası her 12 haftalık sezonda (LW-GDD-06) erişilebilirlik iyileştirme
   maddesi yol haritasına zorunlu olarak eklenir.
6. **Lansman kriteri:** Yukarıdaki uyumluluk hedeflerinden herhangi birinin
   karşılanmaması, 2027 çıkış penceresi için "gönderilemez" (ship-blocker)
   sınıfında hata sayılır.

### Sorumluluk

Bu belgenin uygulanmasından Oyuncu Deneyimi ve Erişilebilirlik Lideri
sorumludur (bkz. `README.md` — Belge Sahipleri); disiplin liderleri kendi
sistemlerindeki gereksinimlerin karşılanmasından müteselsilen sorumludur.

## İlgili Belgeler ve Sürüm Geçmişi

| Belge | İlişki |
| --- | --- |
| `README.md` (LW-GDD-00A) | Belge kuralları, kanon ilkesi, sahiplik |
| `03-oynanis-sistemleri.md` (LW-GDD-03) | Çatışma, PANOPT aranma sistemi, girdi şemaları |
| `04-acik-dunya-simulasyonu.md` (LW-GDD-04) | Navigasyon, dünya okunabilirliği, bilgi yükü |
| `05-ekonomi-ve-monetizasyon.md` (LW-GDD-05) | Kaynak bolluğu ekseninin ekonomi bütünlüğüyle ilişkisi |
| `06-canli-servis-ve-uzun-omur.md` (LW-GDD-06) | Online yardım sınırları, sezonluk erişilebilirlik yol haritası |
| `07-teknoloji-hedefleri.md` (LW-GDD-07) | Motor düzeyi destekler, otomasyon, platform sertifikasyonu |

| Sürüm | Tarih | Yazar | Değişiklik |
| --- | --- | --- | --- |
| 0.1 | 26 Mayıs 2026 | Lumenworks Tasarım Ekibi | İlk taslak: vizyon, görsel ve işitsel bölümler |
| 0.2 | 15 Haziran 2026 | Lumenworks Tasarım Ekibi | Motor ve bilişsel bölümler; zorluk eksenleri tablosu |
| 1.0 | 3 Temmuz 2026 | Lumenworks Tasarım Ekibi | Altyazı standartları ve uyumluluk hedefleri tamamlandı; inceleme için yayınlandı |

---

*Bu doküman bir konsept çalışmasıdır; LUMENFALL ve Lumenworks Studios
kurgusaldır (bkz. `README.md` — Kurgusallık Notu).*
