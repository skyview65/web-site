# LUMENFALL — Ekonomi ve Monetizasyon

> **"Karanlık parlar."**

| Alan | Değer |
| --- | --- |
| **Belge No** | LW-GDD-05 |
| **Sürüm** | 1.0 |
| **Tarih** | 3 Temmuz 2026 |
| **Sahip** | Lumenworks Tasarım Ekibi |
| **Durum** | İnceleme |
| **Gizlilik** | Stüdyo İçi — Dağıtım Onaya Tabidir |

Bu belge, LUMENFALL'un oyun içi ekonomisini (**Lümen — LM**), oyuncu güdümlü
piyasayı, ön sipariş sürümlerini, kozmetik para birimi **Prizma**'yı ve
stüdyonun monetizasyon anayasasını tanımlar. Canlı servis ritmi, sezonlar ve
Crew sistemleriyle kesişen tüm kurallar için `06-canli-servis-ve-uzun-omur.md`
(LW-GDD-06) ile birlikte okunmalıdır. Kanonda tanımlı adlar, tarihler ve
sayılar bağlayıcıdır; bu belgede üretilen tüm yeni ayrıntılar kanonla
tutarlıdır.

---

## Oyun İçi Ekonomi (Lümen)

### Tasarım Hedefleri

1. **Lümen kazanmak oynanışın kendisidir.** Her LM, oyuncunun dünyada yaptığı
   bir şeyin karşılığıdır; hiçbir LM gerçek parayla satın alınamaz
   (bkz. "Pay-to-Win Yasağı").
2. **Ekonomi, simülasyonun uzantısıdır.** 310 km² şehir ve 1.2M simüle
   vatandaşın rutinleri (LW-GDD-04) arz-talebi üretir; fiyatlar tabloyla değil
   dünyayla belirlenir.
3. **Enflasyon bir tasarım metriğidir.** Kaynak/sink oranı sezonluk olarak
   ölçülür ve LW-GDD-06'daki sezon ritmiyle (12 hafta) senkronize ayarlanır.
4. **Üç protagonist, üç gelir profili.** Mara (veri işleri, Gölgepazar),
   Kaan (koruma/infaz sözleşmeleri, Pas Kuşağı), Solene (kargo ve yörünge
   kaçakçılığı, Yükseliş ↔ Zenit Halkası) ekonomiye farklı kapılardan girer.

### Başlangıç Değerleri ve Para Arzı

| Parametre | Değer | Not |
| --- | --- | --- |
| Başlangıç bakiyesi (karakter başına) | 2.500 LM | Prolog sonunda |
| Hikâye tamamlama toplam kazancı (hedef) | ~1,8M LM | Yan içerik hariç |
| Saatlik ortalama kazanç (orta oyun hedefi) | 12.000–18.000 LM | Aktiviteye göre |
| Zenit Kasası soygunu (Online, Crew başına) | 1,2M LM havuz | 4 kişilik Crew'da paylaştırılır |
| Ekonomi sağlık hedefi (kaynak:sink oranı) | 1,00 : 0,90–0,95 | Sezonluk ölçüm |

### Kaynaklar (Faucet'ler)

| Kaynak | Açıklama | Ölçek (LM) | Ekonomideki hedef payı |
| --- | --- | --- | --- |
| Ana görev ödülleri | Üç protagonistin hikâye hattı | 5.000–120.000 / görev | %25 |
| Sözleşmeler ve yan işler | Fraksiyon işleri, kurye, koruma, veri çekme | 1.500–20.000 / iş | %20 |
| Soygunlar (tek oyunculu + Online) | Planlama + ekip + pay dağılımı | 80.000–1,2M / soygun | %15 |
| Piyasa ticareti | Bölgeler arası alım-satım ve arbitraj | Değişken | %15 |
| Mülk ve işletme geliri | Satın alınan işletmelerin pasif getirisi | 2.000–15.000 / oyun günü | %10 |
| Dünya aktiviteleri | Yarışlar, kaçak kargo, kurtarma, keşif | 500–8.000 / aktivite | %10 |
| Bölge savaşları ödülleri (Online) | Haftalık kontrol ödemeleri (LW-GDD-06) | Crew kasasına haftalık | %5 |

### Sink'ler (Para Emiciler)

| Sink | Açıklama | Ölçek (LM) | Ekonomideki hedef payı |
| --- | --- | --- | --- |
| Araçlar (200+ model) | Yerden kesik araçlardan yörünge mekiklerine | 18.000–4,5M | %30 |
| Mülkler ve üsler | Daireler, garajlar, Crew üs geliştirmeleri | 90.000–2,8M | %20 |
| Ekipman ve modifikasyon | Silah, implant, araç modifikasyonu (yalnız LM) | 800–150.000 | %15 |
| PANOPT cezaları ve "temizlik" | Aranma sonrası para cezası, kayıt silme rüşveti | 500–75.000 | %10 |
| İşletme ve üs bakımı | Haftalık işletme gideri, Crew kasası aidatı | 1.000–10.000 / hafta | %10 |
| Bilgi ve erişim | Muhbir ödemeleri, kapı kodları, rota izinleri | 250–25.000 | %8 |
| Piyasa işlem vergisi | Bölge borsası kesintisi (%2–6, bölgeye göre) | Oransal | %7 |

### Akış Kuralları

- **LM hesap-bağlıdır:** Tek oyunculu ve Online cüzdanları ayrıdır; tek
  oyunculudan Online'a LM aktarımı yoktur (ekonomi bütünlüğü için).
- **Crew ortak kasası:** 4 kişilik Crew'lar ortak kasaya LM yatırabilir; kasa
  yalnız üs geliştirme, bölge savaşı lojistiği ve soygun ön maliyetlerine
  harcanabilir (ayrıntı: LW-GDD-06). Kasadan kişisel cüzdana geri çekim
  haftalık %25 ile sınırlıdır — "kasa boşaltma" dolandırıcılığını önler.
- **Oyuncular arası doğrudan LM transferi yoktur.** Değer aktarımı yalnız
  piyasa üzerinden, vergilendirilmiş işlemlerle olur; RMT (gerçek para
  ticareti) botlarının ana damarı bilinçli olarak kapatılmıştır.
- **Ölüm/başarısızlık maliyeti:** Online'da hastane/sigorta gideri kazancın
  yüzdesi olarak alınır (tavan: 5.000 LM); tek oyunculuda anlatısal tutulur.

---

## Oyuncu Güdümlü Piyasa

### Mimari

Dokuz bölgenin her birinin kendi **bölge borsası** vardır; fiyatlar, o
bölgedeki simüle vatandaş talebi (LW-GDD-04) + oyuncu işlem hacmi ile her
oyun-saati güncellenir. Mal kategorileri: endüstriyel parça, gıda/biyo ürün,
veri paketi, tıbbi malzeme, lüks tüketim, yörünge kargosu.

| Bölge | Karakteristik arz | Karakteristik talep |
| --- | --- | --- |
| Çekirdek | Finansal enstrüman, temiz veri | Lüks tüketim, güvenlik |
| Neon Liman | Eğlence, lüks tüketim | Gıda, tıbbi malzeme |
| Pas Kuşağı | Endüstriyel parça, hurda | Tıbbi malzeme, enerji hücresi |
| Yükseliş | Yörünge kargosu, yakıt | Endüstriyel parça |
| Sisaltı | Kaçak mal, tuzsuz su teknolojisi | Her şey (ablukalı bölge) |
| Bahçeler | Gıda, biyo ürün | Endüstriyel parça, veri |
| Kordon | — (üretmez) | Lüks tüketim, özel güvenlik |
| Gölgepazar | Veri paketi, gri yazılım | Temiz kimlik, tıbbi malzeme |
| Dış Halka | İşgücü, geri dönüşüm | Gıda, tıbbi malzeme, enerji |

### Bölgeler Arası Arbitraj

- **Fiyat makası:** Aynı malın bölgeler arası fiyat farkı tasarım hedefi
  olarak %15–%60 bandında tutulur; %60 üstü makaslar dinamik olay üretir
  (kaçakçı konvoyları, PANOPT denetimleri).
- **Rota riski fiyata dahildir:** Sisaltı kanallarından kaçak mal taşımak en
  yüksek marjı verir ama PANOPT algılama riski ve fraksiyon haracı içerir.
  Solene'in Yükseliş ↔ Zenit Halkası hattı, en yüksek hacimli ve en yüksek
  sermayeli arbitraj koridorudur (yörünge kargosu, giriş bileti: kendi mekiğin
  ya da Kara Leylek görev hattı).
- **Kesintisiz dünya avantajı:** %100 kesintisiz dünyada (yükleme ekranı yok)
  kargo fiziksel olarak taşınır; ışınlanan envanter yoktur. Arbitraj bir menü
  işlemi değil, bir oynanış döngüsüdür: al → yükle → taşı → hayatta kal → sat.

### Manipülasyon: İzin Verilen ve Engellenen

Piyasa manipülasyonu **kurgu içinde oynanıştır, sistem düzeyinde suistimal
değildir**. Sınırlar:

| Davranış | Durum | Mekanizma |
| --- | --- | --- |
| Stoklama ile bölgesel kıtlık yaratma | İzinli (oynanış) | Kıtlık, dinamik olay ve rakip NPC arzı tetikler |
| Crew ile koordineli alım-satım | İzinli (oynanış) | İşlem vergisi marjı törpüler |
| Yanlış bilgi yayma (Gölgepazar söylenti ağı) | İzinli (kurgu içi) | Söylentiler fiyat beklentisini oynatır, gerçek arzı oynatmaz |
| Tek malda köşe kapmaca (corner) | Sınırlı | Oyuncu başına mal-kategori pozisyon tavanı: bölge arzının %20'si |
| Pompala-boşalt (pump & dump) zincirleri | Sınırlı | Fiyat %35+/oyun-günü oynarsa borsa "devre kesici" 6 oyun-saati işlem durdurur |
| Bot/çoklu hesap hacmi, RMT | Yasak (ihlal) | Telemetri + PANOPT-temalı yaptırım kurgusu; kalıcı piyasa yasağı |

PANOPT'un kurgu içi rolü burada da işler: piyasayı "izleyen" YZ, aşırı
manipülasyonu anlatısal denetimlerle cezalandırır — yaptırım sistemi oyuncuya
dördüncü duvarı kırmadan, dünyanın diliyle konuşur (uyarlanabilir aranma
sisteminin ekonomik karşılığı; bkz. LW-GDD-03).

### Telemetri ve Canlı Ayar

- Ekonomi ekibi her hafta bölge bazında medyan servet, fiyat endeksi ve
  kaynak:sink oranını yayınlar (stüdyo içi pano).
- Fiyat eğrileri sunucu tarafındadır; istemci güncellemesi gerektirmeden
  sezon içinde ayarlanabilir (dağıtım ritmi: LW-GDD-06).
- Herhangi bir canlı ayar, oyuncunun elindeki varlığı geriye dönük silemez;
  yalnız akış hızları değişir ("kazanılmış değer korunur" ilkesi).

---

## Sürümler ve Fiyatlandırma

Tüm sürümler ön siparişe açıktır; fiyatlar ABD doları referansıdır
(yerel karşılıklar için "Bölgesel Fiyatlandırma"). Pazarlama takvimi ve
kampanya planı LW-GDD-09'dadır.

| İçerik | Standard — $69.99 | Deluxe — $99.99 ("En Popüler") | Eternal — $129.99 ("Koleksiyonluk") |
| --- | :-: | :-: | :-: |
| Temel oyun (tek oyunculu kampanya) | ✔ | ✔ | ✔ |
| LUMENFALL Online erişimi | ✔ | ✔ | ✔ |
| "Karartma" araç kaplaması | ✔ | ✔ | ✔ |
| 72 saat erken erişim | — | ✔ | ✔ |
| Dijital sanat kitabı + OST | — | ✔ | ✔ |
| "Gölgepazar" kıyafet koleksiyonu | — | ✔ | ✔ |
| Sezon 01 Prizma paketi | — | ✔ | ✔ |
| İlk yıl genişleme geçişi (2 hikâye paketi) | — | — | ✔ |
| Zenit Halkası dairesi (üs) | — | — | ✔ |
| "Eternal" monogram araç serisi | — | — | ✔ |
| Lumenfall'da sokak adı (ilk 10.000 sipariş) | — | — | ✔ |

### Sürüm Kuralları

1. **Hiçbir sürüm güç satmaz.** Zenit Halkası dairesi bir üstür (konum ve
   manzara); istatistik avantajı, özel görev ödülü çarpanı veya piyasa
   ayrıcalığı içermez. "Eternal" araç serisi, LM ile alınabilen sınıf
   eşdeğerlerinin kozmetik varyantıdır.
2. **72 saat erken erişim yalnız tek oyunculu kampanyayı kapsar.**
   LUMENFALL Online ve bölge savaşları herkes için aynı anda açılır; erken
   erişim Online ekonomisine erken giriş avantajına dönüştürülemez.
3. **Genişleme geçişi hikâye içeriğidir.** İlk yıl çıkacak 2 hikâye paketi
   ayrı ayrı da satın alınabilir; geçiş yalnız paket fiyatına indirimdir.
4. **Sokak adı hakkı** içerik moderasyonuna tabidir (marka, nefret söylemi ve
   gerçek kişi adları reddedilir) ve devredilemez.
5. Sürüm yükseltme (Standard → Deluxe → Eternal) her zaman aradaki fark
   ödenerek yapılabilir; ön sipariş bonusları yükseltmede korunur.

---

## Kozmetik-Only MTX (Prizma) İlkeleri

**Prizma**, LUMENFALL Online'ın kozmetik para birimidir. Kapsamı ve kuralları
aşağıdadır; bu bölümün her maddesi "Pay-to-Win Yasağı" anayasa maddesinin
uygulama yönetmeliğidir.

### Kapsam

| Prizma ile satılabilir | Prizma ile ASLA satılamaz |
| --- | --- |
| Kıyafet, araç kaplaması, boya, monogram | LM, ekipman, silah, implant, mühimmat |
| Üs/daire dekorasyonu, neon tabela | Deneyim/ilerleme çarpanı, "booster" |
| Emote, poz, fotoğraf modu filtresi | Görev, bölge, soygun erişimi (sezon içeriği herkese açıktır — LW-GDD-06) |
| Silah/araç görsel efektleri (iz, egzoz ışıması) | Piyasa avantajı (vergi indirimi, ek pozisyon tavanı) |
| Crew amblemi çerçeveleri | Bekleme süresi/zamanlayıcı atlama (oyunda zamanlayıcı-duvar zaten yoktur) |

### Fiyatlandırma İlkeleri

1. **Doğrusal kur, sabit ve şeffaf:** 100 Prizma = $1.00. Paket boyutu ne
   olursa olsun kur değişmez; "büyük pakette bonus" merdiveni yoktur. Amaç,
   gerçek maliyetin her zaman kafadan hesaplanabilmesidir.
2. **Çift etiket zorunluluğu:** Mağazadaki her ürün hem Prizma hem yerel
   gerçek para karşılığıyla etiketlenir (örn. "800 Prizma · $8.00").
3. **Artık-bakiye tuzağı yasak:** Prizma paketleri mağaza fiyatlarıyla tam
   bölünür (200 / 500 / 1.000 / 2.500 / 5.000); "her zaman 40 Prizma artar"
   tasarımı reddedilir.
4. **Oynayarak kazanılabilir:** Her sezon, sezon etkinlikleriyle 1.200 Prizma
   kazanılabilir (satın alım gerektirmez). Deluxe/Eternal'daki Sezon 01
   Prizma paketi 2.500 Prizma'dır.
5. **LM ↔ Prizma dönüşümü iki yönde de yoktur.** Bu duvar, gerçek paranın
   oyun ekonomisine sızabileceği son kapıyı kapatır.
6. **Mağaza rotasyonu FOMO silahı değildir:** Rotasyondan çıkan her kozmetik
   en geç 2 sezon içinde geri gelir; "son şans" etiketi yalnız gerçekten
   emekliye ayrılan (ve bir daha satılmayacak) ürünlerde kullanılabilir ve
   bu ürünler yıllık planda önceden duyurulur.
7. **İade:** Kullanılmamış kozmetikler 14 gün içinde Prizma olarak iade
   edilebilir; kullanılmamış Prizma bakiyesi yasal zorunluluk olan bölgelerde
   gerçek para olarak iade edilir.

---

## Pay-to-Win Yasağı

Aşağıdaki metin, LUMENFALL Tasarım Anayasası'nın ekonomiyle ilgili maddesidir
ve bu belgenin geri kalanından üstündür. Kanon hükmüdür; majör sürüm
revizyonuyla dahi yumuşatılamaz, yalnız sıkılaştırılabilir.

> ### Tasarım Anayasası — Madde 5: Güç Satılamaz
>
> **5.1.** Oynanışı etkileyen hiçbir şey gerçek parayla satılamaz. "Oynanışı
> etkileyen", şunları içerir ancak bunlarla sınırlı değildir: hasar, zırh,
> hız, kazanç oranı, ilerleme hızı, envanter kapasitesi, piyasa koşulları,
> görev/bölge erişim sırası, eşleştirme önceliği.
>
> **5.2.** Lümen (LM) hiçbir kanaldan, hiçbir promosyonda, hiçbir "paket
> içeriği" olarak gerçek parayla satılamaz veya hediye edilemez.
>
> **5.3.** Gerçek parayla satılabilir tek şey: (a) bu belgede tanımlı sürümler
> ve hikâye genişlemeleri, (b) yalnız kozmetik işlev taşıyan Prizma ürünleri.
>
> **5.4.** Bir ürünün "kozmetik" sayılması için ölçüt: üründen yoksun bir
> oyuncuyla yapılan kör A/B testinde hiçbir oynanış metriğinde (TTK, kazanç,
> görünürlük/kamuflaj, hedef alma) istatistiksel fark üretmemesi. Görsel
> efektli kozmetikler bu teste tabidir; kamuflaj etkisi yaratan renk/desen
> PvP alanlarında normalize edilir.
>
> **5.5.** Her yeni özellik, mağaza ürünü ve sezon içeriği yayın öncesi
> "Madde 5 Denetimi"nden geçer. Denetim, Canlı Servis ve Ekonomi Lideri ile
> Tasarım Direktörlüğü'nün ortak onayını gerektirir; tek taraflı onay
> geçersizdir. Denetimden geçemeyen içerik, gelir hedefi ne olursa olsun
> yayınlanmaz.
>
> **5.6.** Bu maddenin ihlali "hotfix ile geri alınır" kategorisindedir:
> yanlışlıkla yayına çıkan ihlal 72 saat içinde kaldırılır, etkilenen
> oyunculara tazminat verilir ve olay sonrası raporu stüdyo geneline açılır.

**Turnusol testi (tüm ekip için):** "Bu ürünü alan oyuncu, almayan oyuncuya
karşı herhangi bir ölçülebilir avantaj kazanıyor mu?" Cevap "evet" veya
"emin değilim" ise ürün satışa çıkmaz.

---

## Bölgesel Fiyatlandırma

Amaç: LUMENFALL'un dünyanın her pazarında yerel satın alma gücüne göre adil
fiyatlanması. Referans fiyatlar ABD dolarıdır; yerel fiyatlar satın alma gücü
paritesi (SGP) temelli dört kademeyle belirlenir.

| Kademe | Örnek pazarlar | Standard karşılığı (USD eşdeğeri) | Prizma kuru çarpanı |
| --- | --- | :-: | :-: |
| A — Referans | ABD, Kanada, Batı Avrupa, Japonya | $69.99 | 1.00× |
| B — Yüksek SGP farkı | Orta/Doğu Avrupa, Güney Kore | ~$54.99 | 0.80× |
| C — Belirgin SGP farkı | Türkiye, Brezilya, Meksika, Güneydoğu Asya | ~$39.99 | 0.60× |
| D — Erişim öncelikli | Hindistan, MENA (seçili), Sahra-altı Afrika | ~$29.99 | 0.45× |

### Kurallar

1. **Aynı oyun, aynı içerik:** Kademeler yalnız fiyatı değiştirir; hiçbir
   pazara eksik içerik veya "yerel sürüm" kısıtı uygulanmaz.
2. **Yerel para, yerel etiket:** Fiyatlar yerel para biriminde, psikolojik
   yuvarlama yerine düz değerlerle gösterilir; kur şoklarında güncelleme en
   fazla altı ayda bir ve önceden duyurularak yapılır.
3. **Prizma da kademelidir:** Kozmetik kuru aynı kademe çarpanını izler;
   "oyun ucuz, mağaza pahalı" tutarsızlığına izin verilmez.
4. **Bölge arbitrajına karşı orantılı önlem:** Hesap mağaza bölgesi ödeme
   yöntemiyle doğrulanır; bölge değişikliği yılda bir kezle sınırlıdır.
   Amaç cezalandırmak değil, D kademesi fiyatlarının D kademesi oyuncularına
   ulaşmasını korumaktır.
5. **Çapraz platform tutarlılığı:** Aynı pazarda PC, konsol ve bulut fiyatı
   aynıdır (çapraz ilerleme kanonu gereği tek hesap — LW-GDD-06).

---

## Etik Çerçeve

LUMENFALL'un monetizasyonu, oyuncunun bilişsel zaaflarını değil, oyuna olan
sevgisini hedefler. Aşağıdaki yasaklar ve taahhütler pazarlama dahil tüm
yüzeyler için bağlayıcıdır.

### Kesin Yasaklar

1. **Loot box YOKTUR.** Gerçek para veya gerçek parayla alınmış herhangi bir
   ara birimle (Prizma dahil) rastgele içerik satın alınamaz. Her mağaza
   ürünü, ödeme öncesi tam olarak görünür ve önizlenebilirdir.
2. **Kumar benzeri mekanik yasağı:** Gacha, "şansını dene" çarkları, paralı
   yeniden çekiliş, rastgele yükseltme/başarısızlık oranı satın alımı ve
   sanal eşya kumarına dönüşebilecek her sistem yasaktır. Prizma
   kozmetikleri hesaba bağlıdır; oyuncular arası devredilemez ve üçüncü
   taraf pazarlara konu edilemez.
3. **Karanlık desen yasağı:** Geri sayımlı baskı ekranları, "arkadaşların
   aldı" sosyal baskı bildirimleri, kasıtlı karmaşık iptal akışları ve
   varsayılan-işaretli ek satın alımlar yasaktır.
4. **Çocuklara yönelik satış yoktur:** LUMENFALL yetişkin derecelendirmeli
   bir oyundur (hedef: PEGI 18 / ESRB M); mağaza arayüzü reşit olmayanlara
   pazarlama yapacak biçimde tasarlanamaz.

### Kurgu İçi Kumar Hakkında Not

Neon Liman'ın kumarhaneleri dünyanın dokusudur ve oynanabilir; ancak yalnız
**oyun içinde kazanılmış LM** ile çalışır, gerçek parayla veya Prizma ile
fiş alınamaz, kazanç/kayıp eğrileri uzun vadede net-sink olacak şekilde
ayarlanır ve oturum başına masa limiti vardır (50.000 LM). Kurgu içi kumar,
gerçek dünya harcamasından matematiksel olarak yalıtılmıştır; bu yalıtım
Madde 5 Denetimi kapsamında her sezon yeniden doğrulanır.

### Taahhütler

- **Harcama şeffaflığı:** Oyuncu, hesap panelinden yaşam boyu toplam
  harcamasını ve satın alım geçmişini tek ekranda görür.
- **Harcama kontrolleri:** İsteğe bağlı aylık harcama tavanı ve
  "satın alım öncesi 24 saat bekletme" modu sunulur; platform ebeveyn
  kontrolleriyle tam uyum sağlanır.
- **Veri dürüstlüğü:** Mağaza telemetrisi yalnız denge ve kürasyon için
  kullanılır; harcamaya yatkın oyunculara kişiselleştirilmiş fiyat veya
  hedefli baskı gösterimi yapılmaz.
- **Regülasyon uyumu:** Loot box ve sanal para düzenlemeleri (AB, BK,
  Japonya, Güney Kore dahil) pazar bazında izlenir; en sıkı rejim, tüm
  pazarlar için taban kabul edilir.
- **Topluluğa hesap verme:** Her sezon sonunda mağaza ve ekonomi değişiklik
  özeti, sezon notlarıyla birlikte kamuya açık yayınlanır (LW-GDD-06).

---

## Çapraz Referanslar

| Belge | İlgili kesişim |
| --- | --- |
| `06-canli-servis-ve-uzun-omur.md` (LW-GDD-06) | 12 haftalık sezon ritmi, Sezon 01 "Karartma Protokolü", Crew ortak kasası, bölge savaşları ödül ekonomisi, Zenit Kasası soygunu |
| `04-acik-dunya-simulasyonu.md` (LW-GDD-04) | 1.2M simüle vatandaşın arz-talep üretimi, dinamik ekonomi olayları |
| `03-oynanis-sistemleri.md` (LW-GDD-03) | PANOPT uyarlanabilir aranma sistemi ↔ ceza/rüşvet sink'leri, ilerleme ekonomisi |
| `01-dunya-ve-lore.md` (LW-GDD-01) | 9 bölgenin ekonomik kimlikleri, Lumen Compact megakorplarının piyasa rolleri |
| `09-pazarlama-ve-lansman.md` (LW-GDD-09) | Ön sipariş kampanyası, sürüm konumlandırması, 2027 çıkış penceresi |

## Sürüm Geçmişi

| Sürüm | Tarih | Yazar | Değişiklik |
| --- | --- | --- | --- |
| 0.1 | 26 Mayıs 2026 | Lumenworks Tasarım Ekibi | İlk taslak: LM kaynak/sink modeli ve sürüm tablosu |
| 0.2 | 15 Haziran 2026 | Lumenworks Tasarım Ekibi | Piyasa manipülasyon sınırları, bölgesel fiyat kademeleri eklendi |
| 1.0 | 3 Temmuz 2026 | Lumenworks Tasarım Ekibi | Tasarım Anayasası Madde 5 ve Etik Çerçeve tamamlandı; inceleme için yayınlandı |

---

*Bu doküman bir konsept çalışmasıdır. LUMENFALL, Lumenworks Studios ve burada
geçen tüm kişi, kurum, ürün ve fiyatlar tamamen kurgusaldır; herhangi bir
ticari taahhüt oluşturmaz.*
