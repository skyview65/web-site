# LUMENFALL — AI-Generated Media Assets

Cinematic key art for the **LUMENFALL** marketing site, generated with
Higgsfield and post-processed with `sharp`. Shared visual DNA across every
asset: vantablack megacity at night (2099), electric cyan + hot magenta +
signal amber neon on near-black, wet reflections, volumetric haze,
photoreal AAA game key art — no text, no logos, no watermarks.

## Assets

| File | Purpose | Source aspect |
| --- | --- | --- |
| `public/videos/lumenfall-hero.mp4` | Hero cover video loop (10 s · 720p · 9.4 MB, silent; user-generated via Seedance on the jet-free frame) | 16:9 |
| `public/images/lumenfall-hero.webp` | Hero poster / reduced-data fallback (scroll-pinned, CSS parallax) | 16:9 · 1920w |
| `public/images/lumenfall-city.webp` | "The City" panorama (Ken Burns) | 16:9 · 1920w |
| `public/images/protagonist-mara.webp` | Mara Vex portrait (magenta accent) | 3:4 · 1200w |
| `public/images/protagonist-kaan.webp` | Kaan "Ghost" Demir portrait (cyan accent) | 3:4 · 1200w |
| `public/images/protagonist-solene.webp` | Solene Adeyemi portrait (amber accent) | 3:4 · 1200w |
| `public/images/lumenfall-online.webp` | LUMENFALL Online crew / heist table | 16:9 · 1920w |
| `public/images/lumenfall-editions.webp` | Editions collector key art | 16:9 · 1920w |
| `public/seo/og.jpg` | Open Graph image (1200×630, attention crop of hero) | 1200×630 |

## How they were made (Higgsfield)

- **Model:** `z_image` (Tongyi-MAI) — chosen deliberately: account balance was
  1.18 credits, `z_image` costs 0.15/image, so all 7 assets fit the budget
  (7 × 0.15 = 1.05). `nano_banana_pro` (2cr) and video models were out of reach.
- **Consequence:** no hero *video* this time — the cover uses the 16:9 still
  with the same scroll-progress parallax the template's previous video cover
  used (`--hp` CSS variable + scale/drift), which reads convincingly cinematic.
- **Job IDs** (for regeneration/upscale later):
  - hero `22f1f0e2-e185-4404-aabc-d48d251f694c`
  - city `a9025fb8-fef9-4721-a9a8-95cb7c957060`
  - mara `b0cdae7a-eb8a-4dc1-9676-c333f7a3b221`
  - kaan `66939ab1-9515-4d48-a541-f96224ad8c48`
  - solene `9034778c-daa6-4b66-a59c-7a82ad54578b`
  - online `ee64eb30-38e0-48dc-9ef3-b66eeac06211`
  - editions `2351fd6e-1fce-4da8-9374-19a35d28ca06`

## Post-processing

Playwright's bundled ffmpeg only encodes PNG, so conversion used `sharp`
(installed ad hoc in the session scratchpad, not a repo dependency):

```js
sharp(src).resize({ width: 1920, withoutEnlargement: true })
  .webp({ quality: 82 }).toFile(dst)            // 16:9 backgrounds
sharp(src).resize({ width: 1200 }).webp({ quality: 84 })  // 3:4 portraits
sharp("hero.png").resize(1200, 630, { fit: "cover", position: "attention" })
  .jpeg({ quality: 85 }).toFile("og.jpg")       // OG image
```

Masters were 2048×1152 / 1536×2048 PNGs (4–6 MB each); shipped WebPs are
100–215 KB.

## Upgrade path

With more credits: regenerate hero via `nano_banana_pro` 4K, then animate with
`seedance_2_0` image-to-video (8–10s silent push-in loop) into
`public/videos/lumenfall-hero.mp4` and switch `CinematicHero` back to the
`<video>` variant documented in git history (`sofra-cover.tsx`).
