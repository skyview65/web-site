# CALA — "Sofra / THE TABLE" Section Video

Cinematic, silent, looping background video for the **`kapak_sofra`** cover
(THE TABLE · *From the sea and the garden*), matching the site's existing
background-video pattern (cf. `.dalis-video` in the cove section).

## Assets
| File | Purpose |
| --- | --- |
| `public/videos/sofra.mp4` | Silent 16:9 background loop, ~8s, golden-hour sunset dinner |
| `public/images/sofra-poster.webp` | Poster / first frame (also the LCP fallback) |

## Creative standard (carried over from the prior session)
- **Scene:** the single sunset dinner — grilled lobster tail + black caviar
  quenelle, Michelin plating, one candle, white wine, infinity-edge terrace
  above the hidden Kaş cove, golden sun on the horizon.
- **Locked palette:** deep night-blue `#0A1322`, warm bone/cream `#F1EADB`,
  muted moon-gold `#CBA968`. Low-key cinematic chiaroscuro.
- **Mood:** serene, opulent, understated. No people, no text, no logos.

## How it was made (Higgsfield)
1. **Still (first frame):** `nano_banana_flash`, 16:9 4K — the chosen frame
   of the prior batch (job `f68201d6`). Saved as the poster.
2. **Animate:** `cinematic_studio_3_0` (audio off), 8s, 16:9, slow continuous
   push-in; soft candle flicker, drifting sunset cloud, shimmering sea/pool,
   light breeze in the lavender & olive. Image-to-video from the still above.
3. **Upscale:** Topaz video → 1080p for crisp full-screen playback.

## Usage (matches the `.dalis-video` cover pattern)
```tsx
<video
  className="sofra-video"
  autoPlay
  muted
  loop
  playsInline
  poster="/images/sofra-poster.webp"
>
  <source src="/videos/sofra.mp4" type="video/mp4" />
</video>
```

> Tip for a seamless ambient loop: the clip is a slow one-directional push, so
> a ping-pong (alternate forward/reverse) playback reads perfectly seamless.
> A dark scrim (e.g. `bg-[#0A1322]/40`) keeps the "THE TABLE" title legible
> over the bright sunset third of the frame.
