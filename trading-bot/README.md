# Yerel Yapay Zekâ Alım-Satım Botu 🤖📉

**Tamamen kendi makinenizde çalışan, gizliliğe saygılı** bir algoritmik alım-satım
araç setidir. Boru hattı: veri → öznitelik → makine öğrenmesi modeli →
walk-forward doğrulama → gerçekçi maliyetli backtest → risk yönetimli
paper/canlı işlem. Her şey **sizin bilgisayarınızda** çalışır; canlı işlemi
açıkça etkinleştirmediğiniz sürece hiçbir veri dışarı çıkmaz.

> **Bu bir eğitim ve araştırma yazılımıdır, yatırım tavsiyesi değildir.** Herhangi
> bir işlem yapmadan önce [Dürüst gerçekler](#dürüst-gerçekler-önce-bunu-okuyun)
> bölümünü okuyun.

---

## Dürüst gerçekler (önce bunu okuyun)

Buraya *"21 yaşındaki genç, yapay zekâ Claude botuyla 61 günde 570.665 dolar
kazandı"* gibi bir sosyal medya videosundan geldiyseniz — **o bir pazarlama
içeriğidir ve neredeyse kesinlikle uydurmadır.** Bu proje size şu gerçeği
göstermek için kuruldu:

- **Likit piyasalarda bir sonraki mumun yönünü doğru tahmin etme oranı yazı-tura'ya
  çok yakındır — kabaca %51–55.** Bundan yükseği neredeyse her zaman *sızıntıdır*
  (geleceğe bakma hatası, yanlış çapraz doğrulama, hayatta kalma yanlılığı veya göz
  ardı edilen maliyetler), beceri değil. Bloglardaki %70–90 rakamları çoğunlukla
  yapaydır.
- **İsabet oranı yanlış hedeftir.** 100 dolar kazanmak için 1000 dolar riske atan
  %90 kazançlı bir strateji negatif beklentiye sahiptir ve zamanla erir; %45
  kazançlı ama 2,5:1 ödemeli bir trend stratejisi büyür. Stratejileri **maliyet
  sonrası riske göre düzeltilmiş getiriyle** (Sharpe / Sortino / Calmar /
  maksimum düşüş) değerlendirin, isabet oranıyla değil.
- **Yüksek bir backtest Sharpe'ı genellikle aşırı uyumdur.** Gerçekten iyi,
  dürüstçe doğrulanmış bir retail strateji *canlıda* yaklaşık **0,8–1,5** Sharpe
  gösterir. Çok parametreli bir stratejide ~2–3 üstü backtest Sharpe'ı, dahiyane
  olmaktan çok aşırı uyum ihtimalidir.
- **Taban oranlar acımasızdır.** Israrlı gün-içi yatırımcılar üzerine bir
  çalışmada **%97'si para kaybetti.** Çoğu retail algoritmik strateji, maliyet
  sonrası basit "al ve tut"u geçemez.
- **Piyasalar verimliliğe yakındır.** Bir retail katılımcı için saatlik/günlük
  mumlardaki fiyat/hacim özniteliklerinden gelen büyük, kolay ve kalıcı bir
  avantaj neredeyse kesinlikle yoktur. Bu doğrulama katmanını doğru kurmanın en
  olası — ve en değerli — sonucu, size **test ettiğiniz şeyde kalıcı bir avantaj
  olmadığını** söylemesidir. Bu olumsuz sonucu bir *başarı* olarak görün.

Paket içindeki sentetik veriyle çalışan varsayılan koşu tam da bunu gösterir:
model ~%50 örneklem-dışı isabet alır ve **maliyet sonrası "al ve tut"a yenilir.**
Dürüst ve beklenen sonuç budur — ve paranızı koruyan da budur.

---

## "En yüksek isabet" gerçekte ne anlama gelir

En yüksek isabeti istediniz. Kendinizi kandırmadan bunu meşru şekilde en üste
çekmenin yolu tasarımın içine işlenmiştir:

1. **Sızıntısız, nedensel öznitelikler** — her gösterge yalnızca mum kapanışında
   mevcut olan bilgiyi kullanır; geleceğe bakan tek sütun etikettir.
2. **Purge + embargo'lu walk-forward doğrulama** — örneklem-dışı isabeti dürüstçe
   ölçmenin tek yolu; saf bir eğitim/test bölmesi bunu abartır.
3. **Geçmeniz gereken bir baseline** — lojistik regresyon ve "al ve tut". Gösterişli
   model bunları örneklem-dışı geçemiyorsa avantajı yoktur.
4. **Nicelikten çok sinyal kalitesi** — bir `min_edge` ölü bölgesi ve isteğe bağlı
   ATR ölçekli nötr bölge etiketlemesi, modelin gürültü üzerinde eğitim/işlem
   yapmasını engeller.
5. **Giriş VE çıkışta alınan maliyetler** — yalnızca sıfır maliyette hayatta kalan
   bir "avantaj" gerçek değildir.

Yapamayacağı şey, veride olmayan bir isabeti üretmektir. Dürüst rakamı %50'den
%54'e itmek gerçek bir kazanımdır; %90 iddia eden her şey ya bir hata ya da
yalandır.

---

## İsabet oranı (win rate) hakkında

İsabet oranını en az %52'ye çıkarmanız istendi. Bot varsayılan olarak **"yüksek
isabet" modunda** gelir: dar bir take-profit + geniş bir stop + `hold_to_exit`
(pozisyonu çıkışa kadar tutma). Bu, işlem başına isabet oranını genellikle
**%60–80'e** çıkarır (çok sayıda küçük kazanç, az sayıda büyük kayıp).

**Ama yüksek isabet oranı, kâr demek değildir.** Sentetik veride bu mod ~%75
isabet üretir, buna rağmen para kaybeder ve "al ve tut"a yenilir. Bu, "yüksek
isabet" iddiasının tuzağını gösteren dürüst bir kanıttır. Nötr, kâr açısından
dürüst kurulum için `take_profit_atr: 0` ve `hold_to_exit: false` yapın.

---

## Mimari

Backtest ve canlı işlem tek bir kod yolunu paylaşır:

```
 ccxt / önbellek / sentetik    indicators.py         registry.py
        │                          │                     │
   data/loader.py  ──►  features/pipeline.py  ──►  models/  ──►  walk-forward
   (OHLCV, UTC)         (X öznitelik + y etiket)   (HGB/logit)   backtest/walkforward.py
        │                          │                     │              │
        │                          │                     ▼              ▼
        │                          │              risk/sizing.py   backtest/engine.py
        │                          │              (vol-hedef,      (olay-güdümlü, maliyet,
        │                          │               Kelly, stop)     stop, devre kesici)
        │                          │                                    │
        ▼                          ▼                                    ▼
   execution/paper.py  ◄───────────────────────────────────  execution/live.py
   (simüle broker)             aynı strateji + risk           (GERÇEK para, varsayılan KAPALI)
```

| Katman | Modül | Ne yapar |
|--------|-------|----------|
| Veri | `tradingbot/data/` | Çek (ccxt) → yerel önbellek (Parquet/CSV) → sentetik yedek. UTC, temizlenmiş, boşluk kontrollü. |
| Öznitelik | `tradingbot/features/` | Nedensel göstergeler (RSI, MACD, EMA, Bollinger, ATR, getiri, vol, hacim-z) + sızıntısız etiketler. |
| Model | `tradingbot/models/` | scikit-learn HistGradientBoosting (varsayılan) veya lojistik baseline; tek tip `predict_signal`. |
| Doğrulama | `tradingbot/backtest/walkforward.py` | Genişleyen/kayan pencereli walk-forward + embargo; birleştirilmiş OOS eğrisi. |
| Backtest | `tradingbot/backtest/engine.py` | Olay-güdümlü, yol-bağımlı; her işlemde komisyon + kayma. |
| Risk | `tradingbot/risk/` | Pozisyon boyutlandırma, ATR stop-loss/take-profit, günlük zarar ve düşüş devre kesicileri. |
| Çalıştırma | `tradingbot/execution/` | Paper broker (varsayılan) ve korumalı canlı işlemci (varsayılan kapalı). |
| CLI | `tradingbot/cli.py` | `fetch`, `features`, `backtest`, `train`, `paper`, `live`, `report`. |

---

## Hızlı başlangıç

Python 3.11+ gerektirir.

```bash
cd trading-bot
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp config.example.yaml config.yaml # zevkinize göre düzenleyin (git'e girmez)

# 1) Veriyi ve üretilen öznitelikleri görün (sentetik veriyle tamamen çevrimdışı çalışır)
python -m tradingbot features

# 2) "Al ve tut" / SMA baseline'larına karşı dürüst walk-forward backtest, grafik kaydet
python -m tradingbot backtest --plot reports/equity.png --out reports/metrics.json

# 3) Son mumları canlı-benzeri bir paper-trading oturumu olarak oynat
python -m tradingbot paper --steps 300

# 4) (çevrimiçi) gerçek piyasa verisini indir ve önbelleğe al, sonra backtest'i tekrar çalıştır
python -m tradingbot fetch
python -m tradingbot backtest
```

> **Tasarım gereği çevrimdışı.** Ağ veya önbellek verisi yoksa bot deterministik bir
> **sentetik** seriye düşer, böylece tüm boru hattı yine de çalışır — ama sentetik
> veri *gerçek bir piyasa değildir*, ondan asla sonuç çıkarmayın.

### Yapılandırma

Her şey `config.yaml` içindedir (`config.example.yaml`'ın kopyası). Ana bölümler:
`market` (borsa/sembol/zaman dilimi), `features`, `model`, `backtest` (komisyon,
kayma), `validation` (walk-forward pencereleri, embargo), `risk` (boyutlandırma,
stop, devre kesiciler), `execution` (paper/canlı).

---

## Risk kontrolleri

- **Pozisyon boyutlandırma:** `vol_target` (varsayılan), `fixed_fraction` veya
  kesirli `kelly` (sıkı sınırlı). Çıktı `[-max_leverage, +max_leverage]` aralığına,
  `allow_short` kapalıyken (varsayılan — spot'ta short yapılamaz) `[0, max_leverage]`
  aralığına kısıtlanır.
- **ATR stop-loss / take-profit:** olay-güdümlü motor tarafından mum-içi kontrol edilir.
- **Günlük zarar devre kesicisi:** limit aşıldığında günün geri kalanında pozisyonu kapatır.
- **Maksimum düşüş kill-switch'i:** düşüş `max_drawdown_halt` sınırını aşarsa işlemi durdurur.
- **`min_edge` ölü bölgesi:** model avantajı eşiği geçmeden pozisyon açılmaz.
- **Maliyetler** giriş ve çıkışta alınır; 1,5–2× ile stres testi yapın.

## Canlı işlem güvenliği

Canlı işlem **varsayılan olarak KAPALIDIR** ve tam işlevseldir; yalnızca **tüm**
şu koşullar sağlandığında çalışır:

1. `execution.mode == "live"`, **ve**
2. `execution.live.enabled == true`, **ve**
3. onay ifadesini elle yazarsınız,

ve API anahtarları **ortam değişkenlerinde** bulunur (asla diskte değil —
`config.yaml` ve gizli dosyalar git'e girmez). Borsa **testnet/sandbox** ile
başlar. Ek bir güvenlik olarak, gerçek emir göndermeden önce `dry_run` açıktır
(göndereceği emirleri yalnızca loglar); gerçek emir için bilinçli olarak
`dry_run: false` yaparsınız. Her emir için bir tutar limiti ve bir Ctrl-C
kill-switch'i her zaman aktiftir. **Gerçek para riske atmadan önce haftalarca
paper-trade yapın.**

```bash
export TRADINGBOT_API_KEY=...      # anahtarlarınız makinenizde kalır
export TRADINGBOT_API_SECRET=...
```

---

## Para yatırma / çekme (ÖNEMLİ — önce bunu okuyun)

Bu bot **paranıza dokunmaz, para tutmaz, transfer etmez.** Kasıtlı olarak böyle:

- **Para yatırma/çekme işini borsanın kendisi yapar.** Paranızı yalnızca kendi
  adınıza açtığınız, düzenlemeye tabi (regüle) bir borsada (ör. Binance, Coinbase,
  Kraken) tutarsınız. Bot yalnızca o hesapta, sizin API anahtarınızla **işlem
  açar/kapatır**. Kazancınızı çekmek istediğinizde, **borsanın kendi çekim
  ekranından siz çekersiniz** — botun içinden değil.
- **API anahtarlarını YALNIZCA "işlem" (trade) izniyle oluşturun; "çekim"
  (withdraw) iznini ASLA vermeyin.** Böylece anahtarınız çalınsa bile kimse
  paranızı dışarı gönderemez. Bu bot çekim (withdraw) işlevi *içermez* ve
  içermeyecektir — bir bota para çekme yetkisi vermek en büyük güvenlik açığıdır.
- **"Para yatırıp kazancını çekeceğin" ayrı bir platform KURULMAZ / kurmam.**
  Böyle bir sistem (kullanıcılardan para toplayıp "kâr" dağıtmak) para transferi
  ve menkul kıymet mevzuatına tabidir; lisanssız yapmak çoğu ülkede yasa dışıdır.
  Ayrıca **"paranı yatır, AI botu senin için kazansın, kazancını çek" tam olarak
  başta uyardığım o viral reel dolandırıcılığının yapısıdır** — bu tür platformlar
  parayı yatırmanıza izin verir ama çekmenizi engeller. Sana böyle bir huni
  kurmayacağım; bu seni korumak içindir.

Kısacası güvenli yol: **kendi regüle borsa hesabına, kaybetmeyi göze alabileceğin
kadar para yatır → botu haftalarca paper modda çalıştır → yalnızca işlem izinli
API anahtarıyla küçük başla → kazancını borsadan kendin çek.**

---

## Hızlı işlem / scalping ön ayarı

`config.scalping.example.yaml` dosyası 5 dakikalık mumlarla sık işlem yapan bir ön
ayardır. **Uyarı:** hızlı/sık işlem retail için genellikle en kârlı değil, en
zararlı yoldur — her işlem komisyon+kayma öder ve bunlar birikerek getiriyi yer.
`cp config.scalping.example.yaml config.yaml && python -m tradingbot backtest`
çalıştırıp işlem sayısına ve maliyetlerin getiriyi nasıl etkilediğine bakın.

---

## Testler

```bash
pytest -q
```

Test paketi, doğruluk için gerçekten önemli olan şeylere odaklanır: özniteliklerde/
etiketlerde **geleceğe bakma sızıntısı olmaması**, maliyet muhasebesi, metrik
matematiği, risk kısıtlaması ve istenen ≥%52 isabet oranının doğrulanması.

---

## Yasal uyarılar

- Yalnızca araştırma ve eğitim içindir. Finansal, yatırım veya alım-satım tavsiyesi **değildir.**
- Alım-satım ciddi kayıp riski taşır. Yalnızca tamamını kaybetmeyi göze
  alabileceğiniz sermayeyle. Kayıpları kovalamak için asla para eklemeyin.
- Geçmiş backtest veya paper performansı gelecekteki canlı sonuçları **öngörmez** —
  büyük bir backtest-canlı farkı bekleyin.
- Ücretsiz retail verisi (ccxt açık OHLCV, yfinance) kusurludur: eksik mumlar,
  kesintiler, listeden çıkarmalar, kısıtlamalar, sessiz endpoint değişiklikleri.
- Düzenleyici, vergi ve raporlama yükümlülüklerinden yalnızca siz sorumlusunuz.
- **Olduğu gibi, hiçbir garanti olmadan** sağlanır; yazarlar hiçbir kayıptan sorumlu değildir.
