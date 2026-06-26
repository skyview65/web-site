#!/usr/bin/env python3
"""
Procedural oil-slick / thin-film iridescence generator for CALA.

Recreates the supplied reference texture: dense vertical "flame-lick" iridescent
strands in chartreuse / yellow-green with magenta-violet and cyan fringes, over a
warm-olive night ground, soft-focus with subtle chromatic fringing.

Pure numpy + Pillow (no scipy). Domain-warped, vertically-stretched fractal value
noise drives a cosine spectral palette; an independent fbm mask carves the bright
filaments. Used to fill the closing CALA wordmark in SiteFooter. (The page
backdrop itself uses the supplied reference image, public/images/bg-iridescent.jpg.)

Usage:  python3 scripts/generate-iridescence.py
Deps:   pip install numpy pillow
Writes: public/images/iridescence.webp        (vivid spectral texture)
"""
import os

import numpy as np
from PIL import Image, ImageFilter

W, H = 1600, 2200
SEED = 7
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "images")


def value_noise(h, w, sx, sy, seed):
    """Bilinearly-upsampled white noise -> smooth value noise.
    sx, sy are cell sizes in px (sy >> sx gives vertical strands)."""
    rng = np.random.default_rng(seed)
    gx = max(2, int(round(w / sx)))
    gy = max(2, int(round(h / sy)))
    grid = (rng.random((gy, gx)) * 255).astype(np.uint8)
    img = Image.fromarray(grid).resize((w, h), Image.BICUBIC)
    return np.asarray(img, dtype=np.float32) / 255.0


def fbm(h, w, sx, sy, seed, octaves=5, lac=2.0, gain=0.55):
    """Fractal sum of value-noise octaves (anisotropic: sx vs sy)."""
    out = np.zeros((h, w), np.float32)
    amp, tot = 1.0, 0.0
    for o in range(octaves):
        out += amp * value_noise(h, w, sx / lac**o, sy / lac**o, seed + o * 17)
        tot += amp
        amp *= gain
    return out / tot


def warp(field, dx, dy, strength):
    """Resample `field` at coords displaced by (dx,dy)*strength (bilinear)."""
    h, w = field.shape
    ys, xs = np.mgrid[0:h, 0:w].astype(np.float32)
    sx = np.clip(xs + dx * strength, 0, w - 1.001)
    sy = np.clip(ys + dy * strength, 0, h - 1.001)
    x0 = np.floor(sx).astype(int); y0 = np.floor(sy).astype(int)
    x1 = x0 + 1; y1 = y0 + 1
    fx = sx - x0; fy = sy - y0
    return (field[y0, x0] * (1 - fx) * (1 - fy)
            + field[y0, x1] * fx * (1 - fy)
            + field[y1, x0] * (1 - fx) * fy
            + field[y1, x1] * fx * fy)


def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def main():
    # phase field: tall cells -> vertical flames, domain-warped for the licks
    base = fbm(H, W, sx=130, sy=520, seed=SEED, octaves=6)
    dx = fbm(H, W, sx=180, sy=300, seed=SEED + 100) - 0.5
    dy = fbm(H, W, sx=220, sy=380, seed=SEED + 200) - 0.5
    phase = warp(base, dx, dy, strength=240.0)
    phase = warp(phase, dy, dx, strength=120.0)            # second warp = curl
    phase = (phase - phase.min()) / (phase.max() - phase.min())

    # thin-film stacks many interference orders: multiply phase to cycle spectrum
    t = phase * 3.1 + 0.12 * fbm(H, W, 90, 90, SEED + 5)

    # cosine spectral palette (IQ), tuned green/yellow + violet/cyan fringes
    a = np.array([0.46, 0.50, 0.42])
    b = np.array([0.46, 0.45, 0.52])
    c = np.array([1.00, 1.00, 1.00])
    d = np.array([0.00, 0.13, 0.62])
    tt = t[..., None]
    irid = a + b * np.cos(2 * np.pi * (c * tt + d))
    irid = irid * np.array([0.92, 1.05, 0.74])             # warm-green bias
    lum = (irid * np.array([0.299, 0.587, 0.114])).sum(-1, keepdims=True)
    irid = irid * 0.84 + lum * 0.16                        # pull back the neon
    irid = np.clip(irid, 0, 1)

    # filament mask: bright licks on a dark ground (dense -> even shimmer)
    mask = fbm(H, W, sx=120, sy=460, seed=SEED + 9, octaves=6)
    mask = warp(mask, dx, dy, 200.0)
    mask = smoothstep(0.34, 0.80, mask) ** 1.05
    glow = fbm(H, W, sx=70, sy=180, seed=SEED + 31)
    mask = np.clip(mask + 0.20 * smoothstep(0.52, 0.92, glow), 0, 1)

    ground = np.array([0.043, 0.066, 0.092])               # warm-olive night ground
    col = ground * (1 - mask[..., None]) + irid * mask[..., None]
    hot = smoothstep(0.82, 1.0, mask)[..., None]
    col = col + hot * np.array([0.16, 0.15, 0.05])         # white-gold sparkle
    col = np.clip(col, 0, 1)

    # gentle vignette so edges sink into the night
    ys, xs = np.mgrid[0:H, 0:W]
    vig = 1 - 0.5 * (((xs / W - 0.5) ** 2) * 1.6 + ((ys / H - 0.5) ** 2) * 0.7)
    col *= np.clip(vig, 0.45, 1)[..., None]

    rgb = (np.clip(col, 0, 1) * 255).astype(np.uint8)
    im = Image.fromarray(rgb, "RGB")

    # soft-focus macro look + chromatic fringe
    im = im.filter(ImageFilter.GaussianBlur(1.4))
    r, g, bch = im.split()
    r = r.transform(r.size, Image.AFFINE, (1, 0, -1.4, 0, 1, 0))
    bch = bch.transform(bch.size, Image.AFFINE, (1, 0, 1.6, 0, 1, 0))
    im = Image.merge("RGB", (r, g, bch))

    # fine film grain
    rng = np.random.default_rng(99)
    grain = rng.normal(0, 5.0, (H, W, 1)).astype(np.float32)
    arr = np.clip(np.asarray(im, np.float32) + grain, 0, 255).astype(np.uint8)
    im = Image.fromarray(arr, "RGB")

    out = os.path.normpath(OUT_DIR)
    os.makedirs(out, exist_ok=True)
    im.save(os.path.join(out, "iridescence.webp"), "WEBP", quality=86, method=6)

    p = os.path.join(out, "iridescence.webp")
    print("iridescence.webp", os.path.getsize(p) // 1024, "KB")
    print("done")


if __name__ == "__main__":
    main()
