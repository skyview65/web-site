# Design Exports

Self-contained HTML exports from the Deki design tool.

## Atelance_8.html

The **Atelance** studio portfolio page — a single self-unpacking bundle
(~27 MB). Its two "work" references are embedded as `text/html` assets inside
the bundle manifest and opened in a new tab when their thumbnail is clicked
(`a[data-site="calaSite"]` / `a[data-site="aureliaSite"]`, via
`openWork()` → `window.__resources`).

### References refreshed

Both embedded references were swapped for their latest standalone versions
(stored gzip+base64, `mime: text/html`, `compressed: true`; each gunzips to a
byte-identical copy of its source):

| Reference | `data-site` | Manifest UUID | Updated to |
| --- | --- | --- | --- |
| Cala | `calaSite` | `90d82a9f-f1e8-4440-97d4-e68e8446e01c` | `cala_4_v13_1_2` |
| Aurelia | `aureliaSite` | `a74ce54c-51d7-40c1-83c4-4c75650b2ec4` | `Aurelia_standalone_2` |

### Video compression

Both references shipped with oversized hero videos (the single file was 52 MB).
Re-encoded, preserving the look:

| Video | Before | After |
| --- | --- | --- |
| Cala "THE TABLE" scroll video | 3840×2160 10-bit **HEVC**, 16 Mbps (~16 MB) | 1920×1080 **H.264** CRF 26 (~1.4 MB) |
| Aurelia hero video | 1920×1080 H.264, 12 Mbps + muted AAC (~12 MB) | 1920×1080 H.264 CRF 26, no audio (~3.3 MB) |

HEVC→H.264 also widens browser support (HEVC doesn't play in Chrome/Firefox).
Audio dropped only from Aurelia's video (the page plays it muted).

Aurelia's **6 property-collection videos** (The Bosphorus Crown, Maison Vendôme,
Skyline Atelier, The Monaco Belvedere, Duplex Aurelia, Celeste Sky Villa) were
external CloudFront URLs (`data-defvidsrc` / `PROPS[*]`), which failed to load
when Aurelia was opened from the Atelance thumbnail (the `openWork()` new-window
context — they only play in the per-property **detail** view). They were
downloaded, re-encoded (960×540 H.264 CRF 34, ~0.65 MB each, ~3.9 MB total —
sized to keep the whole file uploadable) and embedded as Aurelia bundle assets;
the CDN URLs were replaced with the asset UUIDs (resolved to blob URLs at
unpack). The page now makes zero external requests for video. Verified in real
Chrome: Atelance → Aurelia → click a property → the detail video plays from the
embedded blob (0 CloudFront).

### Self-contained (no CDN)

The Deki studio shell loads React, ReactDOM and Babel from `unpkg.com` at
runtime; if the CDN is unreachable the page shows `[bundle] error` and never
renders. `react@18.3.1` and `react-dom@18.3.1` are now embedded — the runtime's
`REACT_URL` / `REACT_DOM_URL` point at inline `data:` URLs instead of unpkg
(SRI/`crossorigin` dropped, since these are first-party embedded bytes). Babel
(`@babel/standalone`) is NOT bundled: the studio component is plain
`React.createElement` JS (no JSX), so `ensureBabel()` is never called
(`window.Babel` stays undefined) — bundling it would only add ~1 MB. The page
renders with **zero external network requests**.

### Layout

The **Atölye** section (`#atelier`) was changed from a two-column grid
(label left, copy right) to a single centered column: the `01 · Atölye`
label, both body paragraphs, and the `Elde işlenmiş · Dünya çapında` tagline
are centered.

### Copy

The Aurelia work-card line (`aureliaLine`, all 8 languages) was reframed from
a "multilingual residence experience" description to a real-estate brand
positioning — e.g. TR: "Lüks rezidanslar ve penthouse'lar sunan bir emlak
markası, ışık ve mermerle çerçevelenmiş."

The two work-card description lines (`calaLine`, `aureliaLine`) were recolored
from muted gray (`var(--mut)`, #8A8377) to white (#fff).

### Encoding note

The bundle embeds the page as a JSON string inside a
`<script type="__bundler/template">` tag, with every `</` written using the
escaped form `<` + `/` so no embedded close-tag prematurely ends the
script element. Edits to the template are re-serialized the same way; using a
plain `JSON.stringify` (which leaves `</head>`, `</body>`, … literal) corrupts
the in-browser parse.

---

## Two builds

| File | Size | Videos | Use |
| --- | --- | --- | --- |
| `Atelance_8.html` | ~27 MB | compressed (Cala 1080p, Aurelia hero 1080p, property 540p) | normal use — opens fast, uploadable, normal git download |
| `Atelance_8_fullquality.html` | ~237 MB | **original/uncompressed** (Cala 4K HEVC, Aurelia hero 1080p 12 Mbps, property videos 720p 13 Mbps) | archive / full quality — Git LFS; ~12 s to unpack in-browser |

Both are the complete Atelance studio with both references (Cala + Aurelia)
embedded and self-contained (zero external network requests).
