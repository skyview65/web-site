# CALA — "Sofra / THE TABLE" Section Video

Cinematic, silent, looping background video for the **`kapak_sofra`** cover
(THE TABLE · *From the sea and the garden*), matching the site's existing
background-video pattern (cf. `.dalis-video` in the cove section).

## Assets
| File | Purpose |
| --- | --- |
| `public/videos/sofra.mp4` | Silent 16:9 background loop, ~8s, blue-hour candlelit dinner (4K) |
| `public/images/sofra-poster.webp` | Poster / first frame (also the LCP fallback) |

## Creative standard (carried over from the prior session)
- **Scene:** the single evening dinner — grilled lobster tail + black caviar
  quenelle, Michelin plating, taper candle, white wine, glass-railed terrace
  above the hidden Kaş cove, glowing lanterns, crescent moon at blue-hour dusk.
- **Locked palette:** deep night-blue `#0A1322`, warm bone/cream `#F1EADB`,
  muted moon-gold `#CBA968`. Low-key cinematic chiaroscuro.
- **Mood:** serene, opulent, understated. No people, no text, no logos.

## How it was made (Higgsfield)
1. **Still (first frame):** `nano_banana_flash`, 16:9 4K — the chosen frame
   of the prior batch (job `ca599149`, the blue-hour / lantern composition).
   Saved as the poster.
2. **Animate:** `seedance_2_0` (Bytedance), **4K**, `mode=std`, `bitrate=high`,
   8s · 16:9 · silent (audio off). Image-to-video from the still above; slow
   continuous push-in, soft candle/lantern flicker, drifting cloud, shimmering
   sea, light breeze in the roses & olive.

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
> A dark scrim (e.g. `bg-[#0A1322]/40`) keeps the "THE TABLE" title legible.
>
> Note: this is a 4K master. For production you may want a 1080p/720p derivative
> + a poster-only fallback on mobile to keep the page light.
