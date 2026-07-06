# LUMENFALL — Oyun Tasarım Dokümanı (GDD) Ana İndeksi

> **"Karanlık parlar."**

| Alan | Değer |
| --- | --- |
| **Belge No** | LW-GDD-00A |
| **Sürüm** | 1.1 |
| **Tarih** | 5 Temmuz 2026 |
| **Sahip** | Lumenworks Tasarım Ekibi |
| **Durum** | İnceleme |
| **Gizlilik** | Stüdyo İçi — Dağıtım Onaya Tabidir |

Bu belge, **LUMENFALL** — 2099 yılında geçen, üç protagonistli, açık dünya
aksiyon/suç destanı — için hazırlanan tasarım doküman setinin ana giriş
noktasıdır. Tüm ekip üyeleri herhangi bir GDD dosyasına başlamadan önce bu
indeksi ve kanon kaynağını okumakla yükümlüdür.

## İndeks

| Dosya | Belge No | Kapsam |
| --- | --- | --- |
| `README.md` | LW-GDD-00A | Ana indeks, belge kuralları, sürüm geçmişi ve sahiplik (bu belge) |
| `00-vizyon-ve-ozet.md` | LW-GDD-00 | Oyun vizyonu, tasarım sütunları, hedef kitle, üst düzey özet |
| `01-dunya-ve-lore.md` | LW-GDD-01 | Lumenfall şehri, 9 bölge, zaman çizelgesi (2061–2099), Lumen Compact ve fraksiyonlar |
| `02-hikaye-ve-karakterler.md` | LW-GDD-02 | Ana anlatı, Mara Vex / Kaan "Ghost" Demir / Solene Adeyemi, PANOPT–REGENT ve Direktör Aylin Sarr |
| `03-oynanis-sistemleri.md` | LW-GDD-03 | Karakterler arası geçiş, çatışma, sürüş/uçuş, PANOPT uyarlanabilir aranma sistemi, ilerleme |
| `04-acik-dunya-simulasyonu.md` | LW-GDD-04 | 310 km² kesintisiz dünya, 1.2M simüle vatandaş, kalıcı kimlik/rutin/hafıza, dinamik olaylar |
| `05-ekonomi-ve-monetizasyon.md` | LW-GDD-05 | Lümen (LM) ekonomisi, oyuncu güdümlü piyasa, Prizma kozmetik parası, pay-to-win yasağı, sürümler |
| `06-canli-servis-ve-uzun-omur.md` | LW-GDD-06 | LUMENFALL Online, 12 haftalık sezonlar, Sezon 01 "Karartma Protokolü", Crew ve bölge savaşları |
| `07-teknoloji-hedefleri.md` | LW-GDD-07 | Duskforge Engine hedefleri, platformlar (PC / 9. nesil konsollar / Bulut), akış ve performans bütçeleri |
| `08-erisilebilirlik.md` | LW-GDD-08 | Erişilebilirlik standartları, girdi/görsel/işitsel/bilişsel seçenekler, zorluk esnekliği |
| `09-pazarlama-ve-lansman.md` | LW-GDD-09 | 2027 çıkış penceresi, ön sipariş sürümleri (Standard/Deluxe/Eternal), kampanya ve topluluk planı |
| `10-multiplayer-tasarimi.md` | LW-GDD-10 | LUMENFALL Online oyun modları (Bölge Savaşları, Zenit Kasası, Kaçakçılık Ligi, Serbest Dolaşım), crew/rol tasarımı, eşleştirme ve topluluk sağlığı |
| `11-gorev-tasarimi.md` | LW-GDD-11 | Görev tasarım felsefesi, 3 perdelik ana hikâye yapısı, soygun iskeleti, üç protagonist için örnek görev dökümleri |
| `12-yan-icerik-ve-aktiviteler.md` | LW-GDD-12 | Yan görev zincirleri, rastgele karşılaşmalar, koleksiyonlar, mini oyunlar, NPC tanışıklık sistemi |
| `13-bolge-tasarimi.md` | LW-GDD-13 | 9 bölgenin seviye tasarımı, işaret yapılar, dikey katmanlar, Zenit Halkası, bölgeler arası ulaşım ağı |
| `14-ses-ve-muzik.md` | LW-GDD-14 | Adaptif müzik sistemi, radyo istasyonları ve DJ karakterleri, ses mimarisi, 12 dil seslendirme planı |
| `15-arayuz-ve-ux.md` | LW-GDD-15 | Diegetik implant HUD'u, 3B harita ve menüler, bağlam içi onboarding, erişilebilirlik entegrasyonu |
| `16-dusman-ai-ve-catisma.md` | LW-GDD-16 | Düşman arketipleri, PANOPT tepki merdiveni, algı/gizlilik modeli, zorluk ve adalet ilkeleri |
| `17-arac-ve-surus-modeli.md` | LW-GDD-17 | 200+ araç filosu, sürüş/uçuş/sıfır-G fizik modeli, hasar ve modifikasyon, kovalamaca tasarımı |
| `18-uretim-plani.md` | LW-GDD-18 | Üretim fazları ve kilometre taşları, bütçe çerçevesi, risk kaydı, QA ve sertifikasyon stratejisi |
| `19-acilis-senaryosu.md` | LW-GDD-19 | Açılış 20 dakikasının tam senaryosu, üç protagonist tanıtım vinyeti, bağlam içi öğretim |

## Belge Kuralları

### Adlandırma

- Dosya adları küçük harf, Türkçe ve tire ile ayrılmış biçimde yazılır:
  `NN-konu-adi.md` (örn. `03-oynanis-sistemleri.md`).
- Her belgenin başında bu dosyadakiyle aynı yapıda bir künye tablosu bulunur:
  Belge No, Sürüm, Tarih, Sahip, Durum.
- Belge numaraları `LW-GDD-NN` şemasını izler ve bir kez atandıktan sonra
  asla yeniden kullanılmaz veya değiştirilmez.
- Ortak terim yazımları: **diegetik** (diyejetik değil), **crew** (cins isim
  olarak küçük; yalnız uygulama/özel adlarda büyük), fraksiyon itibarı
  **İP (İtibar Puanı)** ölçeğiyle yazılır, ondalık ayraç olarak **virgül**
  kullanılır (binlik ayraç nokta: 36.000).

### Sürümleme

- Sürüm numarası `MAJÖR.MİNÖR` biçimindedir.
- **Minör artış (x.1, x.2 …):** düzeltme, netleştirme, kanonla çelişmeyen
  ekleme.
- **Majör artış (1.0 → 2.0):** tasarım kararını değiştiren, başka belgeleri
  etkileyen veya kanon güncellemesi gerektiren revizyon.
- Her sürüm değişikliği ilgili belgenin kendi Sürüm Geçmişi tablosuna tek
  satır olarak işlenir; eski satırlar silinmez.

### İnceleme Süreci

1. **Taslak:** Belge sahibi ilk sürümü yazar; durum "Taslak" olarak işaretlenir.
2. **İnceleme:** İlgili disiplin liderleri (tasarım, anlatı, teknoloji, yayın)
   yorumlarını iletir; kanon uyumu ayrıca kontrol edilir.
3. **Onay:** Tasarım Direktörlüğü onayıyla durum "Onaylandı" olur; majör
   değişiklikler yeniden inceleme gerektirir.
4. Durum değerleri yalnızca şunlardır: **Taslak · İnceleme · Onaylandı · Arşiv**.

## Kanon İlkesi

Tüm belgeler için tek doğruluk kaynağı **LUMENFALL Kanonu**'dur. Kanonda
tanımlı **adlar, tarihler ve sayılar bağlayıcıdır** ve birebir kullanılır:

- **Adlar:** LUMENFALL, Lumenworks Studios, Duskforge Engine, PANOPT, REGENT,
  Direktör Aylin Sarr, Lumen Compact ve beş megakorp, 9 bölge adı, üç
  protagonist (Mara Vex, Kaan "Ghost" Demir, Solene Adeyemi), Deniz,
  Kara Leylek, Zenit Halkası, Lümen (LM), Prizma.
- **Tarihler:** 2061 Büyük Karartma · 2064 PANOPT · 2078 Yükseliş'in
  tamamlanması · 2093 Sisaltı Seli · 2099 oyunun bugünü · 2027 çıkış penceresi.
- **Sayılar:** 310 km² şehir + yörünge katmanı · 1.2M simüle vatandaş ·
  9 bölge · 3 protagonist · 200+ araç · %100 kesintisiz dünya ·
  12 haftalık sezonlar · $69.99 / $99.99 / $129.99 sürüm fiyatları.

Kanonla çelişen hiçbir icat yapılamaz. Yeni ayrıntı üretmek serbesttir ve
teşvik edilir; ancak üretilen her ayrıntı kanonla tutarlı olmak zorundadır.
Belirsizlik durumunda kanon esas alınır ve Tasarım Direktörlüğü'ne danışılır.

## Sürüm Geçmişi

| Sürüm | Tarih | Yazar | Değişiklik |
| --- | --- | --- | --- |
| 0.1 | 12 Mayıs 2026 | Lumenworks Tasarım Ekibi | İlk taslak: dosya seti ve numaralandırma şeması önerisi |
| 0.2 | 9 Haziran 2026 | Lumenworks Tasarım Ekibi | Belge kuralları ve inceleme sürecinin eklenmesi |
| 1.0 | 3 Temmuz 2026 | Lumenworks Tasarım Ekibi | Kanon İlkesi bölümü eklendi; indeks tamamlandı; inceleme için yayınlandı |
| 1.1 | 5 Temmuz 2026 | Lumenworks Tasarım Ekibi | İkinci dalga işlendi: LW-GDD-10–19 indekse ve sahiplik tablosuna eklendi |
| 1.2 | 6 Temmuz 2026 | Lumenworks Tasarım Ekibi | Dil denetimi sonrası ortak terim yazım standartları eklendi |
| 1.3 | 6 Temmuz 2026 | Lumenworks Tasarım Ekibi | Kanon + çapraz tutarlılık denetimi bulguları uygulandı (bölge savaşı 06↔10, asansör süresi, PANOPT modeli, kumar/sigorta tavanları, terim birleştirmeleri) |

## Belge Sahipleri

| Belge No | Belge | Sorumlu Rol |
| --- | --- | --- |
| LW-GDD-00A / LW-GDD-00 | İndeks · Vizyon ve Özet | Tasarım Direktörlüğü |
| LW-GDD-01 / LW-GDD-02 | Dünya ve Lore · Hikâye ve Karakterler | Anlatı Ekibi Lideri |
| LW-GDD-03 / LW-GDD-04 | Oynanış Sistemleri · Açık Dünya Simülasyonu | Sistem Tasarımı Lideri |
| LW-GDD-05 / LW-GDD-06 | Ekonomi ve Monetizasyon · Canlı Servis | Canlı Servis ve Ekonomi Lideri |
| LW-GDD-07 | Teknoloji Hedefleri | Teknoloji Direktörlüğü (Duskforge) |
| LW-GDD-08 | Erişilebilirlik | Oyuncu Deneyimi ve Erişilebilirlik Lideri |
| LW-GDD-09 | Pazarlama ve Lansman | Yayın ve Pazarlama Lideri |
| LW-GDD-10 | Multiplayer Tasarımı | Çevrimiçi Tasarım Lideri |
| LW-GDD-11 | Görev Tasarımı | Görev Tasarımı Lideri |
| LW-GDD-12 | Yan İçerik ve Aktiviteler | Açık Dünya İçerik Lideri |
| LW-GDD-13 | Bölge Tasarımı | Seviye Tasarımı Lideri |
| LW-GDD-14 | Ses ve Müzik | Ses Direktörü |
| LW-GDD-15 | Arayüz ve UX | UI/UX Lideri |
| LW-GDD-16 | Düşman AI ve Çatışma | Çatışma Tasarımı Lideri |
| LW-GDD-17 | Araç ve Sürüş Modeli | Araç ve Fizik Lideri |
| LW-GDD-18 | Üretim Planı | Yapım Direktörü |
| LW-GDD-19 | Açılış Senaryosu | Anlatı Ekibi Lideri |

Her sahip, belgesinin kanon uyumundan, güncelliğinden ve sürüm geçmişinin
eksiksiz tutulmasından sorumludur.

## Kurgusallık Notu

Bu doküman seti bir **konsept çalışmasıdır**. LUMENFALL, Lumenworks Studios,
Duskforge Engine ve burada geçen tüm kişi, kurum, ürün ve olaylar tamamen
kurgusaldır. Gerçek kişi, kurum veya ürünlerle benzerlikler tesadüfidir.
Belirtilen fiyatlar, tarihler ve teknik hedefler herhangi bir ticari taahhüt
oluşturmaz.
