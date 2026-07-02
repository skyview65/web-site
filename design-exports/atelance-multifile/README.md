# Atelance — multi-file, full-quality build

A **multi-file** version of the Atelance studio site, split so every asset stays
under Cloudflare's **25 MiB per-file** limit and can be hosted anywhere (a static
host, Cloudflare, or the user's Namecheap hosting). This is the counterpart to the
single-file bundles in `../Atelance_8.html` (compressed) and
`../Atelance_8_fullquality.html` (~237 MB, one file).

## Live preview

Deployed via Higgsfield website hosting (preview):

> **https://preview--proud-pebble-833.higgsfield.app**

`/` serves the Atelance studio; the two work thumbnails link to `/work/cala` and
`/work/aurelia`. Every video streams from `/videos/*.mp4`.

## Why multi-file

The single full-quality file is ~237 MB — too big for a per-file-limited host and
awkward to download. Splitting it means:

- `index.html` (2.8 MB) — the Atelance studio shell, self-contained.
- `work/cala.html` (7.3 MB) + `work/aurelia.html` (5.7 MB) — the two references.
- `videos/*.mp4` — the heavy media, as **separate original/full-quality files**,
  each well under 25 MiB.

Opening `index.html` is instant; each video loads on demand from its own URL.

## Layout (deploy root)

```
index.html                 # Atelance studio (self-contained; 0 external requests)
work/cala.html             # Cala reference   -> /videos/cala_scroll.mp4
work/aurelia.html          # Aurelia reference-> /videos/aurelia_hero.mp4 + aurelia_01..06.mp4
videos/
  cala_scroll.mp4          # 4K H.264,  9.0 MB   (Cala "THE TABLE" scroll video)
  aurelia_hero.mp4         # 1080p H.264, 11.8 MB (Aurelia hero)
  aurelia_01.mp4           # 720p H.264, 24.0 MB  (The Bosphorus Crown)
  aurelia_02.mp4           # 720p H.264, 21.0 MB  (Maison Vendôme)
  aurelia_03.mp4           # 720p H.264, 21.9 MB  (Skyline Atelier)
  aurelia_04.mp4           # 720p H.264, 23.5 MB  (The Monaco Belvedere)
  aurelia_05.mp4           # 720p H.264, 23.6 MB  (Duplex Aurelia)
  aurelia_06.mp4           # 720p H.264, 24.3 MB  (Celeste Sky Villa)
```

The HTML files in `site/` are the deploy-ready pages; the `videos/` folder is not
committed here (175 MB) — see **Assembling videos** below.

## Video quality

All videos are the **original, full-quality** encodes, with one exception:

| Video | Source | In this build |
| --- | --- | --- |
| Cala scroll | 3840×2160 **HEVC** 16 Mbps | 3840×2160 **H.264** CRF 20, 9.0 MB |
| Aurelia hero | 1920×1080 H.264 12 Mbps | **original, untouched** (11.8 MB) |
| Aurelia 01–06 | 1280×720 H.264 ~11–13.5 Mbps | **original, untouched** (21–24 MB each) |

Only Cala changed: the original is 4K **HEVC**, which Chrome and Firefox cannot
play. It was transcoded to 4K **H.264** (visually lossless at CRF 20, and *smaller*
than the HEVC source) so it plays in every browser. Every other video is the exact
original file.

Cala transcode command:

```bash
ffmpeg -i Cala_THE_TABLE_scroll_4K_HEVC.mp4 \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 20 -preset slow \
  -movflags +faststart -an cala_scroll.mp4
```

## How the externalization works

Each page is a self-unpacking bundle; the videos were pulled out of the bundle and
pointed at external `/videos/*.mp4` URLs. The build scripts in `scripts/` reproduce
each page from the original uploads:

- **`build_index_ext.cjs`** — Atelance. Removes the two embedded reference assets
  (`calaSite`, `aureliaSite`) from the manifest, empties `ext_resources`, and strips
  `onclick="{{ openWork }}"` from the two work links so a click is a **plain
  navigation** to `work/cala.html` / `work/aurelia.html` (no more in-page
  blob/`window.open` unpacking). Keeps the self-contained React runtime, the centered
  Atölye section, the white work-card lines, and the reworded Aurelia copy.
- **`build_cala_ext.cjs`** — Cala. Empties the 21 MB `sofra-vid-b64` base64 `<script>`
  and rewrites the decoder to `vid.src = "/videos/cala_scroll.mp4"`.
- **`build_aurelia_ext.cjs`** — Aurelia. Replaces the hero `<source src="UUID">` with
  `/videos/aurelia_hero.mp4` (and drops the embedded hero asset), and replaces the 6
  CloudFront property URLs with `/videos/aurelia_01..06.mp4`.

All three re-serialize the bundle template with the required `</` → `</`
escaping so the in-browser JSON parse isn't corrupted.

### Self-contained

`index.html` and `work/aurelia.html` make **zero external network requests** (React
is inlined). `work/cala.html` still pulls Google Fonts + three.js (r128) from public
CDNs — part of the original Cala design; both resolve in any normal browser.

## Assembling `videos/`

The deployable `videos/` folder is built from the source clips in
`../source-videos/` (LFS): copy the six 720p Aurelia clips to `aurelia_01..06.mp4`,
the hero to `aurelia_hero.mp4`, and run the Cala transcode above. Then drop the
folder next to `index.html`.

## Deploying to Namecheap

This is a plain static site — upload the deploy root (`index.html`, `work/`,
`videos/`) to the hosting document root (e.g. `public_html/`) via cPanel File
Manager or FTP. The video URLs are root-relative (`/videos/...`), so serve the site
from the domain root. No build step, no server code.
