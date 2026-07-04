# 🧠 Brainrot Battle — Oyun Tasarımı & Gelir Yol Haritası

> `.io` tarzı, linkle anında oynanan arena oyunu + hybrid-casual meta-katman.
> Rota: `/play` — davet linki: `/play?arena=KOD`

## Neden bu kategori?

Çok kaynaklı pazar araştırmasının (AppMagic, Sensor Tower, PocketGamer, Liftoff 2024–2026 verileri) özeti:

- **Viralite şampiyonu** UGC platformları (Roblox) — ama orada kiracısın, web build'i değil.
- **Kazanç şampiyonu** strateji/4X (2024: $17.5Mr) ve sosyal casino — ama küçük ekip için erişilmez/organik yayılmaz.
- **Web'de sahip olunabilir en iyi kesişim:** `.io` çok oyunculu arena (viralite 8–8.5) + hybrid-casual monetizasyon (ARPDAU $0.15–0.50). Kanıtlanmış reçete: *Stumble Guys* (TikTok viralitesi + kozmetik gacha → $100M+ IAP), *Chicken Road* (sıfır reklam harcamasıyla 42M oturum — portal algoritması).
- Kural: **viral döngü ile harcama yüzeyi aynı anda canlı olmalı** (Monopoly GO! dersi). Wordle (viral ama $0) ve Royal Match (kazançlı ama satın alınmış erişim) zıt kutup hatalarıdır.

## Mevcut MVP (bu repo'da çalışıyor)

| Sistem | Durum | Dosya |
|---|---|---|
| Saf TS simülasyon motoru (bot AI, ye-büyü-kaç, tur) | ✅ | `src/lib/game/engine.ts` |
| Canvas renderer (kamera, partikül, minimap, joystick) | ✅ | `src/lib/game/render.ts` |
| Girdi: fare + WASD + dokunmatik joystick | ✅ | `src/components/game/brainrot-battle.tsx` |
| Arena kodu (seed'li) + davet linki + paylaşım metni | ✅ | `src/lib/game/rng.ts` |
| Ekonomi: coin, kasa (gacha), günlük seri | ✅ | `src/lib/game/meta.ts` |
| Brainrot Pass (15 seviye, 3 özel kostüm) | ✅ | `src/lib/game/meta.ts` |
| Reklam soyutlaması (ödüllü + interstitial, simüle) | ✅ | `src/lib/game/ads.ts` |
| Ölüm → reklamla geri dönüş (tur başına 1) | ✅ | e2e ile doğrulandı |

Doğrulama: `npm run check` temiz + 25/25 Playwright e2e kontrolü (masaüstü + mobil dokunmatik).

## Monetizasyon yığını (mimariye gömülü)

1. **Ödüllü reklam** — ölüm ekranında "izle & geri dön". En yüksek eCPM'li, oyuncu-dostu yerleşim.
2. **Interstitial** — her 2 turda bir, tur arasında. (Cadence `replayCountRef` ile ayarlı.)
3. **Kozmetik gacha kasası** — 100 coin; %60/25/12/3 nadirlik; kopya → %40 iade. Pay-to-win yok.
4. **Sezon pası** — XP izi; premium katman (2x XP) portal ödeme SDK'sı bağlanınca açılır.
5. **Günlük seri bonusu** — retention çengeli (x5'e kadar).

`AdProvider` arayüzü tek değişim noktası: canlıya çıkarken `SimulatedAdProvider` yerine
Poki (`PokiSDK.rewardedBreak()`) veya CrazyGames (`SDK.ad.requestAd("rewarded")`) adaptörü yazılır — oyunun geri kalanı değişmez.

## Gelir yol haritası

### Faz 1 — Portal lansmanı (2–4 hafta)
- CrazyGames + Poki'ye başvuru; tek build, iki portal. CrazyGames'in **2 aylık münhasırlık = +%50 gelir payı** teklifini lansmanda değerlendir.
- Gerçek reklam adaptörlerini yaz (`ads.ts` seam'i), GameAnalytics/Amplitude ekle.
- KPI hedefleri: D1 ≥ %35, oturum ≥ 8 dk, tur/oturum ≥ 3, ödüllü reklam izlenme ≥ %40.

### Faz 2 — Gerçek çok oyunculu (4–8 hafta)
- Authoritative WebSocket sunucusu (Node + uWebSockets.js veya Colyseus; Fly.io/Hetzner, oda bazlı).
- `Engine` sınıfı sunucuya taşınır — renderer/UI değişmez (bilinçli mimari kararı).
- Davet linkleri gerçek canlı lobiye bağlanır → web'in en güçlü K-faktörü mekaniği tamamlanır.
- Botlar boş lobileri doldurmaya devam eder (anında eğlence garantisi).

### Faz 3 — Hybrid-casual derinleşme (sürekli)
- Premium Pass satışı (portal IAP veya Stripe), kozmetik mağaza rotasyonu.
- **Canlı-ops takvimi:** TikTok trendlerine bağlı haftalık kostüm damlaları (48 saatlik trend penceresi — erken içerik görüntülemelerin %60-70'ini alır). Sezonlar 6-8 hafta.
- A/B: tur süresi (150/180/210sn), kasa fiyatı, interstitial sıklığı.

### Faz 4 — Dağıtım genişlemesi
- **Telegram Mini App** (500M+ kullanıcı yüzeyi), Discord Activity, Facebook Instant köprüsü.
- Aynı Next.js build'i WebView sarmalayıcılarla gider; arena-linki mekaniği her yüzeyde çalışır.

## Gelir beklentisi (dürüst aralıklar)

- İlk portal oyunu tabanı: ~$500–3.000/ay (portal reklam payı; sektör aralığı).
- Viral kırılım + IAP katmanı ile üst bant belirgin şekilde büyür; ancak **viralite garanti edilemez** — tasarım onu mümkün kılar, canlı-ops treadmill'i sürdürür.
- Bu bir **hacim işi**: ARPDAU tavanı strateji/casinonun ~1/10'u; telafi mekanizması sıfır CAC (davet linki + portal algoritması).

## Riskler

1. **Netcode maliyeti** (Faz 2'nin tek büyük mühendislik kalemi) — gecikme/anti-cheat kötüyse oyun ölür.
2. **Portal bağımlılığı** — çok-portal + Telegram ile erken çeşitlendir.
3. **Meme yarı ömrü** — Fall Guys -%97.6 dersi; spike'ı sezonlarla yıllık gelire çevir.
4. **Trend zamanlaması kontrol edilemez** — çok sayıda kostüm/mod denemesi şart.
