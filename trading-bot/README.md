# Yerel AI Trading Bot

Tamamen **kendi makinenizde** çalışan, dışarıya hiçbir veri göndermeyen, makine öğrenmesi tabanlı bir alım-satım botu. Bulut yok, abonelik yok, üçüncü taraf sunucu yok — tek dış bağlantı, borsanın herkese açık fiyat API'sidir (canlı emir modunda ise kendi borsa hesabınız).

> ⚠️ **Dürüst uyarı:** Hiçbir model finansal piyasalarda kârı garanti edemez. İyi yapılmış finansal ML modellerinin gerçekçi yön tahmini doğruluğu tipik olarak %50–56 bandındadır; bu botun "yüksek doğruluk" yaklaşımı, tahmin edilemeyen anları ayıklayıp yalnızca modelin **en emin olduğu** anlarda işlem açmaktır (eşik tabanlı sinyal + meta-etiketleme mantığı). Bot, kenar (edge) bulamadığında bunu raporda açıkça söyler ve canlı modda çalışmayı **reddeder**. Önce haftalarca paper (kağıt) modda test edin. Kaybetmeyi göze alamayacağınız parayla asla işlem yapmayın.

## Mimari

```
 ccxt (borsa API)          config.yaml
      │                        │
      ▼                        ▼
 ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────────┐
 │  data.py  │──▶│features.py│──▶│labeling.py│──▶│   model.py   │
 │ indir +   │   │ 29 sızıntı│   │ triple-   │   │ LightGBM     │
 │ parquet   │   │ -sız      │   │ barrier   │   │ tohum topl.  │
 │ önbellek  │   │ özellik   │   │ etiket    │   │ walk-forward │
 └──────────┘   └──────────┘   └──────────┘   └──────┬───────┘
                                                      │ OOS olasılıkları
      ┌───────────────────────────────────────────────┤
      ▼                                               ▼
 ┌──────────────┐    ┌──────────────┐    ┌────────────────────┐
 │ backtest.py  │    │   risk.py    │    │ pipeline.py        │
 │ ücret+kayma  │    │ pozisyon boy.│    │ eşik ayarı, rapor, │
 │ bariyer çıkış│    │ kill-switch  │    │ model paketi       │
 └──────────────┘    └──────┬───────┘    └────────────────────┘
                            ▼
                  ┌────────────────────┐
                  │ live.py + broker.py│
                  │ paper / canlı döngü│
                  └────────────────────┘
```

Tasarım kararlarının tamamı ve araştırma özeti için: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)

## Doğruluğu ne sağlıyor?

| Teknik | Amaç |
|---|---|
| **Triple-barrier etiketleme** | "Fiyat yükselecek mi?" yerine "kâr-al mı zarar-kes mi önce vurulur?" — işlem gerçeğine birebir uyan etiket |
| **Purged walk-forward + embargo** | Etiketler geleceğe baktığı için eğitim/test arasına 48 barlık tampon: sızıntı = şişirilmiş sahte doğruluk. Burada yok |
| **Tohum topluluğu (seed ensemble)** | 3 LightGBM'in olasılık ortalaması — tekil model varyansını düşürür |
| **Eşik tabanlı işlem** | Model her barda işlem açmaz; yalnızca olasılık eşiği aşınca. Az ama isabetli işlem |
| **Ücret + kayma modellenir** | Backtest her işlemde komisyon ve slipaj düşer; kâğıt üstü kârın gerçekte buharlaşmasını önler |
| **Kötümser belirsizlik kuralı** | Aynı barda hem stop hem hedef vurulduysa stop sayılır — hem etikette hem backtestte |
| **Kill-switch** | Azami düşüş veya günlük zarar limitinde bot kendini durdurur |
| **"DO NOT TRADE" kararı** | OOS Sharpe < 1.0 veya kâr faktörü ≤ 1.2 ise rapor açıkça "işlem yapma" der; canlı mod bu modelle **açılmaz** |

## Kurulum

```bash
cd trading-bot
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Python 3.10+ gerekir. Her şey yereldir: veriler `data/`, modeller `models/`, işlem durumu `state/` klasörüne yazılır.

## Kullanım

```bash
# 1) Veri indir (config.yaml'daki borsa/sembol/zaman dilimi)
python -m bot fetch

# 2) Eğit: walk-forward doğrulama + OOS backtest + model kaydı + rapor
python -m bot train

# 3) Raporu tekrar görüntüle / farklı eşik dene
python -m bot report
python -m bot backtest --threshold 0.65

# 4) Paper trading (gerçek veri, simüle emir) — haftalarca burada kalın
python -m bot paper            # sürekli döngü, her bar kapanışında karar
python -m bot paper --once     # tek karar turu (test için)

# 5) Canlı mod (GERÇEK PARA — model "TRADEABLE" değilse çalışmaz)
cp .env.example .env           # API anahtarlarınızı girin
python -m bot live --i-understand-the-risks
```

## Yapılandırma

Tüm ayarlar [`config.yaml`](config.yaml) içinde, Türkçe açıklamalarıyla. En sık değiştirecekleriniz:

- `data.exchange` / `data.symbols` / `data.timeframe` — borsa, parite ve bar süresi
- `model.threshold` / `model.auto_threshold` — işlem açma eşiği (otomatik ayar OOS Sharpe'ı maksimize eder)
- `risk.*` — pozisyon boyutu ve kill-switch sınırları
- `labels.tp_atr` / `labels.sl_atr` — kâr-al / zarar-kes mesafeleri (ATR katı)

## Sık sorulanlar

**Binance `451` hatası veriyor** — Bulunduğunuz ağın bölgesi Binance tarafından engelleniyor. `config.yaml`'da `exchange: coinbaseexchange` veya `kraken` deneyin (Kraken geçmiş veriyi ~720 barla sınırlar; uzun geçmiş için `coinbaseexchange` daha iyi).

**Şirket ağı / MITM proxy arkasındayım, SSL hatası alıyorum** — CA paketinizi `BOT_CA_BUNDLE` (veya `REQUESTS_CA_BUNDLE`) ortam değişkeniyle gösterin; bot bunu ccxt'ye otomatik iletir.

**Veri yokken denemek istiyorum** — `config.yaml`'da `source: synthetic` yapın; boru hattının tamamı çevrimdışı sentetik veriyle çalışır (yalnızca demo/test içindir).

**Kısa devre testi** — `pip install pytest && python -m pytest tests/` : sızıntısızlık, etiketleme ve backtest muhasebesi testleri.

## Sorumluluk reddi

Bu yazılım eğitim amaçlıdır ve "olduğu gibi" sunulur; yatırım tavsiyesi değildir. Kripto varlıklar yüksek risklidir; tüm sermayenizi kaybedebilirsiniz. Canlı modda oluşan her türlü zarar kullanıcının sorumluluğundadır.
