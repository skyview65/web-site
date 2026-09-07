# Mimari ve Araştırma Notları

Bu belge iki bölümden oluşur: (1) sektördeki AI trading bot mimarilerinin araştırma özeti, (2) bu botun tasarım kararları ve gerekçeleri.

## 1. Araştırma özeti

_(Aşağıdaki bölüm web araştırması tamamlandığında doldurulacaktır.)_

## 2. Bu botun tasarım kararları

### Katmanlar ve veri akışı

```
İndirme (ccxt) → Önbellek (parquet) → Özellikler → Etiketler → Model →
OOS değerlendirme → Eşik ayarı → Backtest → Karar (verdict) → Paper/Canlı döngü
```

Her katman tek bir modüle karşılık gelir ve tek başına test edilebilir. Eğitim
hattı (`pipeline.py`) ile canlı döngü (`live.py`) **aynı** özellik fonksiyonunu
(`features.build_features`) kullanır — eğitim/servis kayması (training/serving
skew) yapısal olarak engellenmiştir.

### Neden LightGBM, neden LSTM/transformer değil?

Tablosal OHLCV özelliklerinde gradyan artırmalı ağaçlar (LightGBM/XGBoost)
pratikte derin öğrenme mimarilerine eşdeğer veya üstün sonuç verir, kat kat
daha hızlı eğitilir, CPU'da çalışır (yerel-öncelik şartı) ve
hiperparametrelere karşı çok daha az kırılgandır. Finansal seriler düşük
sinyal/gürültü oranına sahiptir; büyük modeller bu gürültüyü ezberler.

### Neden triple-barrier etiketleme?

Sabit-ufuk "N bar sonra fiyat yukarı mı?" etiketi, gerçek işlem mekaniğiyle
(stop-loss, take-profit) örtüşmez. Triple-barrier (López de Prado, *Advances
in Financial Machine Learning*, böl. 3) etiketi doğrudan "bu işlem kazanır
mıydı?" sorusuna dönüştürür; ATR'ye oranlı bariyerler volatilite rejimlerine
otomatik uyum sağlar. Aynı barda iki bariyer birden vurulduğunda bar-içi sıra
bilinemez; **kötümser kural** (stop önce) hem etikette hem backtestte aynıdır —
iyimser yanlılık yerine tutarlı kötümserlik.

### Neden purged walk-forward + embargo?

Standart k-fold finansal serilerde geçersizdir: etiket, t+`max_holding` bara
kadar bilgi içerir; rastgele bölme bu bilgiyi eğitime sızdırır ve doğruluğu
yapay olarak şişirir. Çözüm: her eğitim penceresi ile test penceresi arasına
`embargo >= max_holding` (varsayılan 48 ≥ 24) barlık boşluk konur ve model
yalnızca testten **kesinlikle eski** verilerle eğitilir. Rapordaki her sayı
gerçek anlamda örneklem-dışıdır (out-of-sample).

### Neden eşik tabanlı işlem ("doğruluk payını" asıl yükselten şey)?

Piyasanın çoğu anı tahmin edilemez; %50'ye yakın ham doğruluk normaldir.
Kullanılabilir kenar, modelin olasılık dağılımının kuyruğundadır: yalnızca
`P(kazanç) ≥ eşik` olduğunda işlem açmak, işlem sayısını azaltıp isabet oranını
taban oranın belirgin üstüne çıkarır (meta-etiketlemenin tek modelli hali).
Eşik, OOS tahminleri üzerinde backtest Sharpe'ını maksimize eden değere
otomatik ayarlanır (`auto_threshold`). Bilinçli ödünleşim: eşik seçimi aynı
OOS kümesi üzerinde yapıldığı için rapordaki backtest hafif iyimser kalabilir
(seçilim yanlılığı); bu yüzden nihai karar tek metriğe değil Sharpe + kâr
faktörü + işlem sayısı üçlüsüne bakar ve paper modda doğrulama zorunludur.

### Neden tohum topluluğu?

LightGBM'in tekil çıktısı tohuma (satır/sütun alt örnekleme) duyarlıdır. Üç
farklı tohumla eğitilen modellerin olasılık ortalaması, tek modelin
varyansını düşürür — ucuz ve etkili bir istikrar kazanımı.

### Gerçekçi sürtünme modeli

Her işlemde taraf başına 10 bp komisyon + 5 bp kayma düşülür; girişler sinyal
barının **kapanışında değil, bir sonraki barın açılışında** doldurulur (canlı
döngü de aynı zamanlamayla çalışır). Kâğıt üstünde kârlı görünen ama
sürtünmeyle buharlaşan stratejiler bu sayede elenmeden raporlanmaz.

### Güvenlik rayları

1. **Verdict kapısı** — OOS Sharpe ≥ 1.0, kâr faktörü > 1.2 ve ≥ 30 işlem
   şartlarını sağlamayan model "DO NOT TRADE" damgası yer; canlı mod bu
   modelle başlatılamaz.
2. **Kill-switch** — tepe sermayeden `max_drawdown_pct` düşüşte bot durur;
   günlük zarar `daily_loss_limit_pct`'yi aşarsa o gün yeni giriş yapılmaz.
3. **Pozisyon boyutlama** — işlem başına riske edilen tutar sermayenin
   %1'i (giriş-stop mesafesine bölünerek adet hesaplanır), tek pozisyon
   sermayenin %25'ini aşamaz.
4. **Canlı mod çift kilit** — hem `--i-understand-the-risks` bayrağı hem
   "tradeable" model şartı; API anahtarları yalnızca `.env`'de, asla log'a
   veya diske yazılmaz.

### Yerel-öncelik (local-first) seçimleri

- Veri: parquet dosyaları (`data/`), hiçbir veritabanı sunucusu gerekmez.
- Model: joblib paketi (`models/`), CPU'da saniyeler içinde yüklenir.
- Durum: düz JSON (`state/`) + işlem geçmişi CSV — her şey insan-okunur.
- Ağ: yalnızca borsanın herkese açık OHLCV ucu; telemetri/analitik yok.

### Bilinen sınırlar ve dürüst notlar

- Yalnızca long/spot; short ve vadeli işlemler kapsam dışı (bilinçli:
  kaldıraç, acemi kullanıcı için en hızlı sermaye imha yoludur).
- Tek sembol/tek zaman dilimi başına bir model; portföy optimizasyonu yok.
- Rejim değişimi (ör. boğadan ayıya) modelin kenarını eritebilir — raporu
  periyodik olarak yeniden üretin (`train --refresh`).
- Kraken'in OHLC ucu ~720 barla sınırlıdır; uzun geçmiş için
  `coinbaseexchange` veya (bölge izin veriyorsa) `binance` kullanın.
