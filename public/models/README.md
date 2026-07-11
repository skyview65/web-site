# 3D modeller (GLB)

Oyun (`/oyna` — açık dünya) bu klasördeki GLB modelleri **opsiyonel** olarak
yükler. Dosya varsa kutu-geometrinin yerini alır; yoksa oyun mevcut prosedürel
biçimlerle çalışmaya devam eder (skybox ile aynı desen).

| Dosya | Ne | Durum |
| --- | --- | --- |
| `craft.glb` | Oyuncunun kahraman aracı (spor araba mesh'i) | **bağlı** — kutu-craft yerine geçer, pilotun rengiyle metalik boyanır |
| `drone.glb` | PANOPT gözcü dronu | (yakında bağlanacak) |
| `lumen.glb` | Toplanan Lümen nesnesi | (yakında bağlanacak) |

### `craft.glb` kaynağı / atıf

Şu an bağlı olan model, three.js örnek varlıklarından gelen yüksek kaliteli spor
araba mesh'idir (`three.js/examples/models/gltf/ferrari.glb`). Oyun içinde her
parça yeniden malzemelenir: gövde pilotun neon rengiyle metalik boyanır, cam
dumanlı yapılır, jantlar krom olur; araca hareket eden renkli bir ışık havuzu
eşlik eder. İstersen bunu Higgsfield ile üretilmiş özgün bir LUMENFALL
hover-craft'ıyla değiştirebiliriz (aşağıdaki akış).

## Nasıl üretilir (Higgsfield)

1. Nesnenin temiz bir **konsept görselini** üret (düz/nötr arka plan, tek nesne)
   — Higgsfield Soul 2.0 / Nano Banana / ChatGPT image ile.
2. O görseli **Higgsfield `generate_3d` (image_to_3d)** ile GLB'ye çevir.
3. GLB'yi buraya `craft.glb` (vb.) olarak koy; site yeniden yayınlanınca devreye
   girer.

Model otomatik ölçeklenir, ortalanır ve seçilen pilotun rengiyle tonlanır.
Yönelim (burun yönü) gerçek model geldiğinde ince ayarlanır.
