# LUMENFALL — Çok Oyunculu Tasarım (LUMENFALL Online)

> **"Şehir hepimizin."** — Tek oyunculu destan şehri anlatır; çok oyunculu, şehri oyunculara teslim eder.

| Alan | Değer |
| --- | --- |
| **Belge No** | LW-GDD-10 |
| **Sürüm** | 1.0 |
| **Tarih** | 3 Temmuz 2026 |
| **Sahip** | Lumenworks Tasarım Ekibi |
| **Durum** | İnceleme |
| **Gizlilik** | Stüdyo İçi — Dağıtım Onaya Tabidir |

Bu belge, LUMENFALL Online'ın çok oyunculu sistemlerini tanımlar: oyun modları,
crew yapısı, rol tasarımı, eşleştirme, ilerleme ve topluluk sağlığı. Sezon
kadansı ve uzun ömür stratejisi için `06-canli-servis-ve-uzun-omur.md`
(LW-GDD-06), ekonomi ve pay-to-win yasağı için `05-ekonomi-ve-monetizasyon.md`
(LW-GDD-05), ağ mimarisi için `07-teknoloji-hedefleri.md` (LW-GDD-07) esas
alınır. Kanonla çelişen hiçbir karar bu belgeyle alınamaz.

---

## Çok Oyunculu Vizyon

Tek cümle: **"Aynı yaşayan şehir, bu kez öngörülemeyen 39 komşuyla."**

Üç tasarım ilkesi:

1. **Şehir moddan büyüktür.** Modlar ayrı haritalarda değil, yaşayan Lumenfall'un
   içinde geçer. Bölge savaşı Neon Liman'da patlarken serbest dolaşımdaki oyuncular
   çatışmanın kenarında ticaret yapabilir.
2. **İşbirliği varsayılan, ihanet seçenektir.** Sistemler önce birlikte oynamayı
   ödüllendirir; ihanetin bedeli mekanik değil sosyaldir (itibar sistemi).
3. **Güç satılmaz.** Tüm çok oyunculu ilerleme oynayarak kazanılır; gerçek para
   yalnız kozmetik Prizma'ya dokunur (bkz. LW-GDD-05).

## Oyun Modları

### 1. Bölge Savaşları (PvPvE · haftalık kadans)

- **Format:** 4v4v4 — üç crew, tek bölge, 25 dakikalık savaş penceresi.
- **Hedef:** Bölgenin üç kontrol düğümünü (haraç noktası, veri santrali, kaçakçılık
  iskelesi) savaş penceresi kapanırken elinde tutmak.
- **PvE katmanı:** PANOPT devriyeleri çatışma gürültüsüne tepki verir; savaşı
  fazla büyüten crew'lar ortak düşman kazanır — üçüncü tarafı sisteme kırdırmak
  geçerli bir stratejidir.
- **Ödül:** Kazanan crew bir hafta boyunca bölge haracını (pasif Lümen) ve bölge
  pazarında %5 alım-satım avantajını alır (bkz. LW-GDD-05, Oyuncu Güdümlü Piyasa).
- **Denge:** Haraç, üst üste kazanan crew için her hafta %20 azalır (hanedan
  kurulmasını caydırma).

### 2. Zenit Kasası (PvE · 4 kişilik soygun)

- **Format:** Hazırlık (şehirde 3 serbest görev) → İnfaz (istasyonda 45-60 dk) →
  Kaçış (sıfır yerçekimi finali).
- **Rol tasarımı (dörtlü çekirdek):**

| Rol | Görev | İmza anı |
| --- | --- | --- |
| **Hacker** | PANOPT alt sistemlerini kör etme, kapı/kamera pencereleri | Kasanın "hafıza kilidi"ni gerçek zamanlı bulmaca ile çözmek |
| **Kas** | Alan kontrolü, ağır teçhizat, rehine yönetimi | Basınç kapısını omuzlayıp ekibe saniye kazandırmak |
| **Pilot** | Kaçış aracı, yörünge yanaşması, zaman pencereleri | İstasyon dönerken kargo rampasına ters yanaşma |
| **Yüz** | Sosyal mühendislik, kılık, alarm geciktirme | Güvenlik şefini sahte Compact denetimiyle oyalamak |

- **Zorluk:** 3 kademe; en üst kademede ölüm kalıcıdır (o soygun denemesi için).
- **Loot felsefesi:** Ganimet bölüşümü oyunculara bırakılır — sistem yalnızca
  "kim neyi taşıdı" kaydını tutar; ihanet mümkündür, sonuçları itibara işler.

### 3. Kaçakçılık Ligi (PvP · rekabetçi sezon ligi)

- **Format:** Sisaltı'ndan Yükseliş'e kargo koşusu; 8 crew'lık lobi, 20 dakika.
- **Twist:** Kargo çalınabilir; yük taşıyan araç haritada kızıl iz bırakır.
  Kazanan, en çok yükü **teslim eden** crew'dır — en çok çalan değil (çalınan yük
  değer kaybeder; saf korsanlık optimal strateji olamaz).
- **Lig yapısı:** 12 haftalık sezonda haftalık puan; ilk 100 crew "Karanlık
  Liste"ye girer (kozmetik unvan + sezon finali davetiyesi).

### 4. Serbest Dolaşım (paylaşımlı dünya · 40 oyuncu)

- Bölge shard'ı başına 40 oyuncu (bkz. LW-GDD-07, Ağ Mimarisi).
- Dinamik olaylar (LW-GDD-04) çok oyunculuda ortaktır: kargo treni soygunu
  duyurusu tüm shard'a düşer; katılmak da, pusu kurmak da serbesttir.
- **PvP anlaşması:** Serbest dolaşımda saldırı, yalnız iki taraf da "kanun dışı"
  işaretliyken mümkündür (suç işleyen işaretlenir). Barışçıl oyuncular
  gezinti/ticaret/fotoğraf modunda taciz edilemez.

## Crew Sistemi

- **Boyut:** 4 çekirdek üye + 4 yedek. Ortak üs (bölgeye göre içerik değişir),
  ortak kasa (çift onaylı çekim — iç hırsızlığa mekanik fren), crew kozmetik seti.
- **İtibar:** Crew ve oyuncu düzeyinde görünür itibar skoru: soygun ihaneti,
  lig hilesi ve taciz raporları düşürür; tamamlanan ortak işler yükseltir.
  Düşük itibar eşleştirmede "yüksek risk" havuzuna yönlendirir — ceza değil,
  benzerlerle eşleştirme.
- **Crew ilerlemesi:** Sezonluk crew pası (yalnız oynanarak dolan); açılanlar
  kozmetik + üs dekoru + sosyal ayrıcalıklar. Güç yok.

## Eşleştirme ve Adalet

- **Eşleştirme:** Mod bazlı hafif beceri eşleştirmesi (gizli MMR); crew içi geniş
  beceri farkına tolerans (arkadaş grubunu bölmeme ilkesi önceliklidir).
- **Çapraz platform:** Varsayılan açık; kapatılabilir. Giriş cihazına göre
  (klavye/gamepad) lobi dengelenir.
- **Hile ile mücadele:** Sunucu otoriteli simülasyon (istemciye güvenilmez),
  davranışsal anomali tespiti, donanım yasağı kademesi. Şeffaf aylık yaptırım
  raporu (topluluk güveni = bileşik faiz ilkesi, bkz. LW-GDD-06).
- **Topluluk sağlığı:** Sesli sohbet varsayılan olarak yalnız crew içi; raporlama
  tek tuş; yeni oyuncular ilk 10 saatte "sığınak shard"larında (deneyimli avcı
  yok) oynar.

## Tek Oyunculu ile Köprü

- Hikâye ilerlemesi ve Online cüzdanı ayrıdır (ekonomi bütünlüğü, LW-GDD-05);
  kozmetikler iki yönde paylaşılır.
- Hikâyeyi bitiren oyuncuya Online'da tek seferlik "Karartma Mirası" kozmetik
  seti açılır — Online'ı denemeye davet, zorlamaya değil.

## Açık Sorular (İnceleme Turu)

1. Bölge savaşının 4v4v4 formatı konsol performans bütçesiyle (LW-GDD-07) 40
   oyunculu shard içinde mi, ayrık savaş alanında mı koşmalı?
2. Kaçakçılık Ligi'nde tek kişilik katılım (crew'suz sürücü) destekli mi?
3. Serbest dolaşım "kanun dışı işaret" süresi: 90 sn mi, dinamik mi?

---

*Bu belge, LUMENFALL_CANON.md'ye tabidir. Çelişki hâlinde kanon geçerlidir.
Sezon entegrasyonu için bkz. 06-canli-servis-ve-uzun-omur.md.*
