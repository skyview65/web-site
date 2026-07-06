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
favicon.ico                # brand icon, served at the root for every page
og-home.jpg / og-cala.jpg / og-aurelia.jpg   # 1200x630 social-share images
                             # (index work-card thumbnails are embedded 1920x1080)
work/cala.html             # Cala reference   -> /videos/cala_scroll.mp4
work/aurelia.html          # Aurelia reference-> /videos/aurelia_hero.mp4 + aurelia_01..06.mp4
fonts/                     # Cala's self-hosted fonts: cala-fonts.css + 24 woff2
                             # (Italiana, Cormorant Garamond, Inter, JetBrains Mono)
videos/
  cala_scroll.mp4          # 4K H.264,  9.0 MB   (Cala "THE TABLE" scroll video)
  aurelia_hero.mp4         # 1080p H.264, 11.8 MB (Aurelia hero)
  aurelia_01.mp4           # 720p H.264, 3.8 MB   (The Bosphorus Crown — single clip)
  aurelia_02.mp4           # 720p H.264, 21.0 MB  (Maison Vendôme)
  aurelia_03.mp4           # 720p H.264, 21.9 MB  (Skyline Atelier)
  aurelia_04.mp4           # 720p H.264, 23.5 MB  (The Monaco Belvedere)
  aurelia_05.mp4           # 720p H.264, 23.6 MB  (Duplex Aurelia)
  aurelia_06.mp4           # 720p H.264, 24.3 MB  (Celeste Sky Villa)
  aurelia_01..06_preview.mp4  # ~250 KB each — lightweight 720p/8s loops that
                              # autoplay in the collection grid (detail view uses
                              # the full-quality clip above)
```

The HTML files in `site/` are the deploy-ready pages; the `videos/` folder is not
committed here (175 MB) — see **Assembling videos** below.

## Video quality

All videos are the **original, full-quality** encodes, with one exception:

| Video | Source | In this build |
| --- | --- | --- |
| Cala scroll | 3840×2160 **HEVC** 16 Mbps | 3840×2160 **H.264** CRF 20, 9.0 MB |
| Aurelia hero | 1920×1080 H.264 12 Mbps | **original, untouched** (11.8 MB) |
| Aurelia 01 | 1280×720, two clips spliced together | **first clip only** (0–6.6 s), H.264 CRF 18, 3.8 MB |
| Aurelia 02–06 | 1280×720 H.264 ~11–13.5 Mbps | **original, untouched** (21–24 MB each) |

Two videos were re-encoded; the rest are the exact original files:

- **Cala scroll** — the original is 4K **HEVC**, which Chrome and Firefox cannot
  play. It was transcoded to 4K **H.264** (visually lossless at CRF 20, and *smaller*
  than the HEVC source) so it plays in every browser.
- **Aurelia 01 (The Bosphorus Crown)** — the source clip was a botched splice of two
  unrelated shots (a wide Bosphorus waterfront aerial, then a penthouse-terrace
  close-up). Only the first shot (0–6.6 s) matches the property poster, so the second
  was dropped and the first re-encoded as a clean single loop.

Re-encode commands:

```bash
# Cala scroll: 4K HEVC -> 4K H.264
ffmpeg -i Cala_THE_TABLE_scroll_4K_HEVC.mp4 \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 20 -preset slow \
  -movflags +faststart -an cala_scroll.mp4

# Aurelia 01: keep only the first clip (0–6.6 s), drop the spliced second shot
ffmpeg -ss 0 -t 6.6 -i Aurelia_01_The_Bosphorus_Crown_720p.mp4 \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 18 -preset slow \
  -movflags +faststart -an aurelia_01.mp4
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

**All three pages make zero external network requests.** `index.html` and
`work/aurelia.html` inline the React runtime; `work/cala.html`'s two former CDN
dependencies were removed in a bug-scan pass:

- **Google Fonts** (Italiana, Cormorant Garamond, Inter, JetBrains Mono) are now
  self-hosted in `/fonts/` — 24 woff2 files plus a rewritten `cala-fonts.css`.
  No CDN-outage / blocked-network exposure, and no Google Fonts hotlink (which
  German courts have ruled a GDPR violation).
- **three.js r128** (cdnjs) was **deleted as dead code**: its only consumer is the
  particle-sea block, disabled in the source ("foto hero: devre dışı") — it needs
  a `#deniz` canvas that no longer exists and sits behind
  `if(canvas && window.THREE)`, so dropping the 603 KB script changes nothing.
  The build script asserts `#deniz` is still absent so the deletion stays safe.

### Languages (full 11-language set)

Every page's selector offers the same **11 languages** — Turkish, English, Spanish,
French, Russian, Greek, German, Italian, Arabic, Persian, Swedish — each with
professional, independently native-reviewed translations:

- **index** used 8; German, Russian and Greek were added. New blocks live in
  `scripts/index_langs_extra.cjs`; the embedded fonts already carry Cyrillic and
  Greek glyphs (Cormorant Garamond / Jost), so ru/el render in the display serif,
  not a fallback.
- **Cala** used 9 (base `en/es/fr/ru/el/de` + `ar`/`it` runtime augments). **Persian
  and Swedish** were added the same way (`scripts/i18n/cala_fa.json`,
  `cala_sv.json`), and a latent bug was fixed: `set()` only flipped `dir=rtl` for
  Arabic, so Persian rendered left-to-right — it now flips for `ar` **and** `fa`.
- **Aurelia** used 10 (I18N dict keyed by English source). **Swedish** was added to
  all 117 keys (`scripts/i18n/aurelia_sv.json`) plus the selector option.
- Persian uses Eastern-Arabic digits (۹۲, ۰۸:۰۰, ۴٫۹) and «…» guillemets; Swedish
  uses the decimal comma (4,9) and ”…” quotes; each language's translation was
  vetted by an independent native-fluency reviewer and corrections applied.
- Verified in Chrome: all 11 languages × 3 pages switch cleanly — real translated
  content (not fallback), correct RTL for ar/fa, no `undefined`/`NaN` leaks, no
  horizontal scroll, and the demo badge translates (incl. Swedish).

### Quality pass (accuracy + polish)

- **Content accuracy:** `© 2025` → `© 2026` in all index languages; `E posta` →
  `E-posta`; Latin commas inside the Arabic/Farsi copy replaced with the Arabic
  comma (`،`); Aurelia's links to social accounts that don't belong to the brand
  were neutralized (`href="#"`, labels kept — mirrors Cala's own footer).
- **Head/meta:** every page now has a real `<title>`, `meta description`,
  `theme-color`, favicon link and OpenGraph/Twitter tags with brand-accurate
  1200×630 `og-*.jpg` images (hero screenshots). The `og:image`/`og:url` values
  point at the preview host — **swap the domain when moving to Namecheap**
  (single search-replace of `preview--proud-pebble-833.higgsfield.app`).
- **Instant video start (Aurelia):** the property detail video used to stay
  hidden until `canplaythrough` (a large buffer on a ~25 MB file, with a 6 s
  fallback). It now calls `play()` immediately and reveals on `playing`, with no
  loop-seam blink — visibly playing in ~0.8 s. (Cache warming is now handled by
  the collection video wall below, so the old blind sequential warm-up was
  removed.)
- **Mobile (full pass):** Aurelia's fixed header no longer clips the CTA
  (logo subtitles hide ≤560 px). At ≤700 px every inline multi-column grid
  collapses to one column (with tasteful exceptions: stats 2×2, gallery mosaic,
  label/value pairs) — this fixes the previously **clipped contact form, footer
  columns and detail-view künye card** on phones; the detail-view sticky header
  fits 390 px. Cala's MENÜ button/language select got comfortable tap targets and
  its 9 px labels are legible on phones; index/Cala/Aurelia footer links have
  padded tap areas. The demo badge shrinks on phones and respects the iPhone
  safe-area. The Aurelia video warm-up skips itself under Data Saver / 2-3G.
- **Native touch feel (all pages):** designed tap feedback (`:active` dim) with
  the gray tap-flash removed; `touch-action: manipulation` (no double-tap-zoom
  delay); 16 px form fields on touch devices (kills the iOS focus-zoom jump);
  heroes use `100svh` (no iOS address-bar jump); the Aurelia detail overlay
  scroll is contained (`overscroll-behavior`) so it never scroll-chains into the
  page behind; smooth anchor scrolling (respects `prefers-reduced-motion`).
- **404s:** unknown URLs redirect to the homepage (worker `notFoundComponent`).
- Verified in Chrome: 35-point checklist across desktop + 390 px mobile, TR/EN/
  IT/AR (RTL) switching, zero console errors, zero 4xx/5xx on all three pages.
- **Deep bug scan (second pass):** all 6 Aurelia property details open, play the
  right clip and close (button + Escape); collection hover still works after six
  open/close cycles and stops on mouse-leave; all 11 languages on every page
  render with no `undefined`/`NaN` leaks, correct RTL and no
  horizontal scroll; Cala menu opens/closes; forms don't navigate away; anchor
  targets and internal links all resolve; no broken images; mobile tap-to-open
  detail works. Live preview verified byte-identical to this package (videos and
  fonts exact, HTML equal modulo the preview host's injected watermark).

### Startup-error fixes

Two console 404s that fired on page load were removed:

- **`favicon.ico`** — no page declared an icon, so every page (incl. Aurelia) had the
  browser request `/favicon.ico` → 404. A brand `favicon.ico` is now served at the root.
- **Cala `/cdn-cgi/…/email-decode.min.js`** — a Cloudflare email-protection script
  baked into the Cala export that 404s off Cloudflare. Removed (the page has no
  obfuscated emails, so nothing depends on it).

## Assembling `videos/`

The deployable `videos/` folder is built from the source clips in
`../source-videos/` (LFS): copy the six 720p Aurelia clips to `aurelia_01..06.mp4`,
the hero to `aurelia_hero.mp4`, and run the Cala transcode above. Then drop the
folder next to `index.html`.

## Deploying to Namecheap

This is a plain static site — upload the deploy root (`index.html`, `work/`,
`fonts/`, `videos/`) to the hosting document root (e.g. `public_html/`) via cPanel
File Manager or FTP. The video and font URLs are root-relative (`/videos/...`,
`/fonts/...`), so serve the site from the domain root. No build step, no server
code, and no external CDN dependencies.
