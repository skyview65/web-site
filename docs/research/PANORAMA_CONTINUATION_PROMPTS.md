# LUMENFALL — Devam Panoraması Üretim Rehberi

## Hangi siteyi kullanıyoruz?

**Blockade Labs — Skybox AI** → **https://skybox.blockadelabs.com**

- Plan: **Essential** (satın alındı — filigransız indirme bu planla geliyor)
- Stil: **"M3 Photoreal"** (şimdiye kadarki 11 bölgenin tamamı bu stille üretildi)
- İndirme: sağ üst **Download → JPG (equirectangular, 2048×1024)**.
  (Varsa **Depth Map** export'unu da indir — oyundaki derinliği daha da keskinleştirir;
  yoksa sorun değil, derinliği kendimiz üretiyoruz.)
- Üretince görselleri sohbete gönder; oyuna rota düğümü olarak ben yerleştiririm
  (`city-01b.webp` gibi, mevcut bölgenin devamına).

## Amaç

Şu an her bölge tek panorama; ileri yürüyünce SONRAKİ bölgeye ışınlanıyorsun.
Her bölgenin "aynı caddenin 50-80 m ilerisi" panoraması üretilirse, ileri yürümek
gerçekten aynı sokakta ilerlemek gibi olur (geri yürümek de geri döndürür).

Aşağıdaki prompt'lar her bölgenin devam sahnesini, aynı palet/malzeme diliyle
tarif eder. **Style: M3 Photoreal** seçili olsun; prompt'u aynen yapıştır.

## Prompt'lar (bölge → devamı)

1. **MERKEZ → MERKEZ-2** — `Night city plaza at street level, closer to the illuminated glass towers seen across the water, wet pavement reflecting cyan and blue skyscraper light, elevated walkway overhead, sparse silhouetted pedestrians far away, cinematic photoreal, rainy haze, no text`
2. **BULVAR → BULVAR-2** — `Continuation of a lantern-lit market boulevard at night, further down the same street, amber and gold paper lanterns, closed wooden shopfronts with warm neon signs, wet stone pavement, steam from a food stall, photoreal cinematic rain haze, no text`
3. **EĞLENCE → EĞLENCE-2** — `Deeper into a neon entertainment plaza at night, giant magenta and cyan LED billboard walls on both sides, mirror-wet street, arcade entrances glowing, confetti-like neon reflections, cinematic photoreal, light rain, no text`
4. **ARA SOKAK → ARA SOKAK-2** — `Further down a narrow cyberpunk back alley at night, dripping pipes, pink and cyan neon tube lights on concrete walls, puddles reflecting signage, fire escape stairs above, moody photoreal, rain, no text`
5. **PANOPT → PANOPT-2** — `Brutalist surveillance district street at night, continuation of the same concrete canyon, tall magenta and cyan light slabs embedded in walls, security cameras, harsh reflections on wet asphalt, oppressive atmosphere, photoreal cinematic, no text`
6. **KANAL → KANAL-2** — `Following the same illuminated canal at night, next bridge further along, purple-lit iron bridge ahead, old brick warehouses with golden windows on both banks, teal water reflections, wet cobblestone quay, photoreal cinematic rain, no text`
7. **TÜNEL → TÜNEL-2** — `Deeper inside the same neon pedestrian tunnel, curving section, magenta and cyan light strips along curved concrete walls, wet floor reflections stretching ahead, distant exit glow, photoreal cinematic, no text`
8. **GÖK KÖPRÜSÜ → GÖK KÖPRÜSÜ-2** — `Further along the same rooftop skybridge at night, closer to the glowing beacon tower, glass walkway with cyan edge lighting, city panorama and river below, red pylon structures behind, clouds at eye level, photoreal cinematic, no text`
9. **LİMAN → LİMAN-2** — `Same neon harbor at night, further along the quay, closer to the illuminated cranes, teal and orange industrial lighting, container stacks, purple ship silhouette, oily water reflections, photoreal cinematic rain, no text`
10. **TAPINAK → TAPINAK-2** — `Inner courtyard of the same neon-lit temple complex at night, past the first gate, teal edge-lit stone platforms, golden lanterns, pagoda silhouettes closer now, wet flagstones, incense haze, photoreal cinematic, no text`
11. **ZİRVE → ZİRVE-2** — `Other side of the same summit platform above the clouds at night, closer to the UFO-like observation disc, cyan rim lighting, red antenna beacon, sea of clouds glowing amber from the city below, wet dark tiles, photoreal cinematic, no text`

## Üretim ipuçları

- Negatif kutusu varsa: `text, letters, watermark, logo, people close to camera, cartoon, illustration`
- Bir bölgenin devamı "tutmadıysa" aynı prompt'la **Remix/Reroll** — palet uyumu
  en önemli kriter (ör. KANAL hep mor köprü + altın pencere + turkuaz su).
- Sıra önemli değil; kaç tane üretirsen o kadarını rotaya eklerim.
