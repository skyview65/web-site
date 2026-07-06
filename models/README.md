# 3D modeller (GLB)

Oyun (`/oyna` — açık dünya) bu klasördeki GLB modelleri **opsiyonel** olarak
yükler. Dosya varsa kutu-geometrinin yerini alır; yoksa oyun mevcut prosedürel
biçimlerle çalışmaya devam eder (skybox ile aynı desen).

| Dosya | Ne | Durum |
| --- | --- | --- |
| `craft.glb` | Oyuncunun hover-craft'ı (kahraman model) | yüklendiğinde kutu-craft yerine geçer |
| `drone.glb` | PANOPT gözcü dronu | (yakında bağlanacak) |
| `lumen.glb` | Toplanan Lümen nesnesi | (yakında bağlanacak) |

## Nasıl üretilir (Higgsfield)

1. Nesnenin temiz bir **konsept görselini** üret (düz/nötr arka plan, tek nesne)
   — Higgsfield Soul 2.0 / Nano Banana / ChatGPT image ile.
2. O görseli **Higgsfield `generate_3d` (image_to_3d)** ile GLB'ye çevir.
3. GLB'yi buraya `craft.glb` (vb.) olarak koy; site yeniden yayınlanınca devreye
   girer.

Model otomatik ölçeklenir, ortalanır ve seçilen pilotun rengiyle tonlanır.
Yönelim (burun yönü) gerçek model geldiğinde ince ayarlanır.
