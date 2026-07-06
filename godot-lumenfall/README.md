# LUMENFALL — Neon Sürüş (Godot 4 prototipi)

Bu klasör, **gerçek bir oyun motorunda** (Godot 4) çalışan oynanabilir bir 3B
LUMENFALL prototipidir. Tarayıcı sürümünden (`/oyna`) farkı: bunu indirip
kendi bilgisayarında motor içinde açar, düzenler ve derleyebilirsin (Windows /
macOS / Linux için `.exe` / uygulama olarak dışa aktarabilirsin).

## Nasıl çalıştırılır (2 dakika)

1. **Godot 4'ü indir** (ücretsiz, tek dosya, kurulum gerektirmez):
   https://godotengine.org/download — sürüm **4.2 veya üzeri**.
2. Godot'u aç → **Import** (İçe Aktar) → bu klasördeki **`project.godot`**
   dosyasını seç → **Import & Edit**.
3. Sağ üstteki **▶ (Play / F5)** düğmesine bas. Oyun açılır.

## İki mod (iki sahne)

- **`openworld.tscn` — Bölge Dolaşımı (varsayılan / ana sahne):** sabit bir neon
  şehir bölgesinde **serbest uçuş**. 12 Lümen halkasını topla, bölgeyi temizle.
- **`main.tscn` — Neon Kaçış (arcade):** sonsuz koşucu; dronlardan kaç, Lümen topla.
  Açmak için Godot'ta FileSystem panelinden `main.tscn`'e çift tıkla → sonra ▶.

## Kontroller

**Bölge Dolaşımı (serbest uçuş):**

| Tuş | İşlev |
| --- | --- |
| **BOŞLUK / ENTER** | Başla / yeniden başla |
| **A / D** | Dön (yaw) |
| **W / S** | Gaz / fren |
| **BOŞLUK (oyun içinde)** yüksel · **Shift** alçal | İrtifa |

**Neon Kaçış (arcade):** BOŞLUK/ENTER başlat · **WASD / oklar** yönlendir.

## Nasıl çalışır (teknik)

- **`project.godot`** — Godot proje yapılandırması; ana sahne `main.tscn`.
- **`main.tscn`** — yalnızca `scripts/main.gd` betiğini taşıyan tek bir
  `Node3D`. Sahnede elle yerleştirilmiş hiçbir şey yoktur.
- **`scripts/main.gd`** — bütün dünya burada, kod içinde prosedürel olarak
  kurulur: WorldEnvironment (bloom/glow + sis + ACES tonlama), zemin, neon
  binalar (sonsuz geri dönüşümlü sıralar), hover-craft, kamera takibi, Lümen
  ve dron havuzları, çarpışma, HUD ve oyun döngüsü. Hazır varlık (asset)
  içermez; her şey `MeshInstance3D` + `StandardMaterial3D` ile üretilir.

Bu, tarayıcı sürümüyle aynı oynanışın motor tarafındaki karşılığıdır ve
buradan itibaren dokular, ses, karakterler ve gerçek şehir modeli eklenerek
büyütülebilir.

## Sonraki adımlar (yol haritası)

- Dokulu/pencereli binalar ve gerçek gökyüzü (HDRI)
- Üç oynanabilir karakter (Mara / Kaan / Solene) — farklı craft ve stat
- Ses ve müzik (Godot AudioStreamPlayer)
- Kayıt sistemi ve skor tablosu
- Yer seviyesinde sürüş modu ve görevler

> Bu bir konsept prototipidir. LUMENFALL kurgusal bir oyundur; ayrıntılar için
> deponun `docs/game-design/` klasörüne bakın.
