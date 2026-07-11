import * as THREE from "three";

/**
 * city-photolife — makes the photo panorama itself feel alive.
 *
 * Living windows + glints harvested from the brightest pixels of the pano,
 * unseen traffic sweeps along the widest street corridor, and the occasional
 * startled flock crossing the sky. The scene has no lights: everything here
 * is either an additive glow or a near-black silhouette.
 *
 * All pools are allocated once in createPhotoLife(); seed() only repositions
 * and retints; update() performs zero allocations.
 */

export interface PhotoSeed {
  canvas: HTMLCanvasElement;
  depth: Uint8ClampedArray;
  dw: number;
  dh: number;
  radiusOf: (d: number) => number;
  clear: Float32Array;
  azBins: number;
  accent: number;
}

export interface PhotoLife {
  seed(s: PhotoSeed): void;
  update(dt: number, t: number, camera: THREE.Camera): void;
  dispose(): void;
}

const TWO_PI = Math.PI * 2;

// -- windows / glints ---------------------------------------------------------
const SHELL_INSET = 0.985;
const HORIZON_FRACTION = 0.52;
const LUM_THRESHOLD = 150;
const SUPPRESS_RADIUS_SQ = 36; // ~6px non-max suppression
const MIN_WINDOW_RADIUS = 8;
const WINDOW_BASE_OPACITY = 0.1;

const PERSONA_WINDOW = 0;
const PERSONA_GLINT = 1;

const PHASE_STEADY = 0;
const PHASE_STEP = 1;
const PHASE_BLACKOUT = 2;

const STEP_DURATION = 0.15;
const BLACKOUT_CHANCE = 0.12;

// -- traffic ------------------------------------------------------------------
const CORRIDOR_MIN = 18;
const CORRIDOR_MAX = 55;
const TAIL_Y = -1.2;
const UNDERGLOW_Y = -1.45;
const UNDERGLOW_OPACITY = 0.06;
const TAIL_OPACITY = 0.7;

// -- birds --------------------------------------------------------------------
const BIRD_COUNT = 9;
const BIRD_RADIUS = 55;
const BIRD_SPREAD_RATE = 0.05;

interface GlowSprite {
  sprite: THREE.Sprite;
  material: THREE.SpriteMaterial;
  persona: number;
  baseOpacity: number;
  // window persona state machine
  phase: number;
  timer: number;
  wait: number;
  fromMul: number;
  toMul: number;
  curMul: number;
  // glint persona
  period: number;
  phase0: number;
  // unit direction to sprite (for view-dependent glint boost)
  dirX: number;
  dirY: number;
  dirZ: number;
}

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function createGlowTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const half = size / 2;
    const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.25, "rgba(255,255,255,0.55)");
    gradient.addColorStop(0.6, "rgba(255,255,255,0.12)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Push a color slightly toward its dominant channel (mild saturation boost). */
function saturateTowardDominant(color: THREE.Color, amount: number): void {
  const m = Math.max(color.r, color.g, color.b);
  if (m <= 0) return;
  color.r += ((color.r === m ? 1 : color.r * 0.55) - color.r) * amount;
  color.g += ((color.g === m ? 1 : color.g * 0.55) - color.g) * amount;
  color.b += ((color.b === m ? 1 : color.b * 0.55) - color.b) * amount;
}

const _camDir = new THREE.Vector3();
const _seedColor = new THREE.Color();
const _accentColor = new THREE.Color();

export function createPhotoLife(
  scene: THREE.Scene,
  opts: { lowPerf: boolean; reduced: boolean },
): PhotoLife {
  const root = new THREE.Group();
  root.name = "city-photolife";
  scene.add(root);

  const glowTexture = createGlowTexture();

  // ---- 1) living windows + glints (pool) ------------------------------------
  const poolSize = opts.lowPerf ? 16 : 30;
  const glows: GlowSprite[] = [];
  for (let i = 0; i < poolSize; i++) {
    const material = new THREE.SpriteMaterial({
      map: glowTexture,
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const sprite = new THREE.Sprite(material);
    sprite.visible = false;
    root.add(sprite);
    glows.push({
      sprite,
      material,
      persona: PERSONA_WINDOW,
      baseOpacity: WINDOW_BASE_OPACITY,
      phase: PHASE_STEADY,
      timer: 0,
      wait: 0,
      fromMul: 1,
      toMul: 1,
      curMul: 1,
      period: 4,
      phase0: 0,
      dirX: 0,
      dirY: 0,
      dirZ: 1,
    });
  }

  // ---- 2) unseen traffic sweep (single pass, pooled) -------------------------
  const trafficGroup = new THREE.Group();
  trafficGroup.visible = false;
  root.add(trafficGroup);

  const tailMaterialL = new THREE.SpriteMaterial({
    map: glowTexture,
    color: 0xff2318,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const tailMaterialR = new THREE.SpriteMaterial({
    map: glowTexture,
    color: 0xff2318,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const tailL = new THREE.Sprite(tailMaterialL);
  const tailR = new THREE.Sprite(tailMaterialR);
  tailL.scale.set(0.5, 0.5, 1);
  tailR.scale.set(0.5, 0.5, 1);
  trafficGroup.add(tailL);
  trafficGroup.add(tailR);

  const underglowGeometry = new THREE.PlaneGeometry(1, 1);
  const underglowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffdfb0,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const underglow = new THREE.Mesh(underglowGeometry, underglowMaterial);
  underglow.rotation.order = "YXZ";
  underglow.rotation.x = -Math.PI / 2;
  underglow.scale.set(5, 0.5, 1);
  trafficGroup.add(underglow);

  let trafficActive = false;
  let trafficTimer = rand(8, 20);
  let trafficT = 0;
  let trafficDur = 5;
  let trafficSpeed = 8;
  let trafficHalf = 0;
  let trafficFade = 1;
  let trafficBaseX = 0;
  let trafficBaseZ = 0;
  let trafficTanX = 0;
  let trafficTanZ = 1;
  let trafficPerpX = 1;
  let trafficPerpZ = 0;

  // ---- 3) startled birds (skipped entirely on lowPerf) ------------------------
  const birds: THREE.Mesh[] = [];
  let birdGeometry: THREE.BoxGeometry | null = null;
  let birdMaterial: THREE.MeshBasicMaterial | null = null;
  const birdGroup = new THREE.Group();
  birdGroup.visible = false;
  root.add(birdGroup);
  const birdOffsets = new Float32Array(BIRD_COUNT * 3);

  if (!opts.lowPerf) {
    birdGeometry = new THREE.BoxGeometry(0.22, 0.03, 0.06);
    birdMaterial = new THREE.MeshBasicMaterial({ color: 0x05060a });
    for (let i = 0; i < BIRD_COUNT; i++) {
      const mesh = new THREE.Mesh(birdGeometry, birdMaterial);
      birdGroup.add(mesh);
      birds.push(mesh);
    }
  }

  let flockFlying = false;
  let flockTimer = rand(40, 100);
  let flightT = 0;
  let flightDur = 10;
  let flockX = 0;
  let flockY = 15;
  let flockZ = 0;
  let flockVelX = 0;
  let flockVelZ = 0;

  // ---- seed-derived state ----------------------------------------------------
  let seeded = false;
  let corridor: Float32Array = new Float32Array(0);
  let corridorBins = 0;

  const seed = (s: PhotoSeed): void => {
    // Corridor clearances (copied — we never retain seed-owned buffers).
    corridorBins = s.azBins;
    if (corridor.length !== s.azBins) corridor = new Float32Array(s.azBins);
    corridor.set(s.clear.subarray(0, s.azBins));

    // Reset transient systems for the new panorama.
    trafficActive = false;
    trafficGroup.visible = false;
    trafficTimer = rand(8, 20);
    flockFlying = false;
    birdGroup.visible = false;
    flockTimer = rand(40, 100);

    // Harvest bright photo features. Read pixels once; do NOT keep the canvas.
    const w = s.canvas.width;
    const h = s.canvas.height;
    const ctx = s.canvas.getContext("2d");
    let pixels: Uint8ClampedArray | null = null;
    if (ctx && w > 2 && h > 2) {
      try {
        pixels = ctx.getImageData(0, 0, w, h).data;
      } catch {
        pixels = null;
      }
    }
    if (!pixels) {
      for (const g of glows) g.sprite.visible = false;
      seeded = true;
      return;
    }

    // Luminance grid for the sky/skyline band (rows above the horizon only).
    const maxRow = Math.min(h - 1, Math.floor(h * HORIZON_FRACTION));
    const lum = new Float32Array(w * (maxRow + 1));
    for (let py = 0; py <= maxRow; py++) {
      const rowOff = py * w;
      for (let px = 0; px < w; px++) {
        const p = (rowOff + px) * 4;
        lum[rowOff + px] =
          0.3 * pixels[p] + 0.6 * pixels[p + 1] + 0.1 * pixels[p + 2];
      }
    }

    // Local luminance maxima above threshold (8-neighborhood).
    const candX: number[] = [];
    const candY: number[] = [];
    const candL: number[] = [];
    for (let py = 1; py < maxRow; py++) {
      const row = py * w;
      for (let px = 1; px < w - 1; px++) {
        const l = lum[row + px];
        if (l <= LUM_THRESHOLD) continue;
        if (
          l < lum[row + px - 1] ||
          l < lum[row + px + 1] ||
          l < lum[row - w + px - 1] ||
          l < lum[row - w + px] ||
          l < lum[row - w + px + 1] ||
          l < lum[row + w + px - 1] ||
          l < lum[row + w + px] ||
          l < lum[row + w + px + 1]
        ) {
          continue;
        }
        candX.push(px);
        candY.push(py);
        candL.push(l);
      }
    }

    // Brightest-first with ~6px non-max suppression.
    const order = candL.map((_, i) => i);
    order.sort((a, b) => candL[b] - candL[a]);

    _accentColor.setHex(s.accent);
    const placedX: number[] = [];
    const placedY: number[] = [];
    let placed = 0;

    for (let oi = 0; oi < order.length && placed < poolSize; oi++) {
      const ci = order[oi];
      const px = candX[ci];
      const py = candY[ci];

      let suppressed = false;
      for (let j = 0; j < placedX.length; j++) {
        const ddx = px - placedX[j];
        const ddy = py - placedY[j];
        if (ddx * ddx + ddy * ddy <= SUPPRESS_RADIUS_SQ) {
          suppressed = true;
          break;
        }
      }
      if (suppressed) continue;

      // Depth-mapped radius, slightly inside the photo shell.
      const dx = Math.min(s.dw - 1, Math.round((px / (w - 1)) * (s.dw - 1)));
      const dy = Math.min(s.dh - 1, Math.round((py / (h - 1)) * (s.dh - 1)));
      const d = s.depth[(dy * s.dw + dx) * 4] / 255;
      const radius = s.radiusOf(d) * SHELL_INSET;
      if (!(radius >= MIN_WINDOW_RADIUS)) continue;

      // Equirect pixel -> world direction (theta 0 at top row / +Y pole).
      const phi = (px / (w - 1)) * TWO_PI;
      const theta = (py / (h - 1)) * Math.PI;
      const st = Math.sin(theta);
      const dirX = -Math.cos(phi) * st;
      const dirY = Math.cos(theta);
      const dirZ = Math.sin(phi) * st;

      const g = glows[placed];
      g.sprite.position.set(dirX * radius, dirY * radius, dirZ * radius);
      const scale = THREE.MathUtils.clamp(radius * 0.018, 0.3, 3.2);
      g.sprite.scale.set(scale, scale, 1);
      g.dirX = dirX;
      g.dirY = dirY;
      g.dirZ = dirZ;

      // Pixel's own color, slightly saturated toward its dominant channel.
      const p = (py * w + px) * 4;
      _seedColor.setRGB(pixels[p] / 255, pixels[p + 1] / 255, pixels[p + 2] / 255);
      saturateTowardDominant(_seedColor, 0.35);

      g.baseOpacity = WINDOW_BASE_OPACITY;
      if (Math.random() < 0.7) {
        g.persona = PERSONA_WINDOW;
        g.phase = PHASE_STEADY;
        g.timer = 0;
        g.wait = rand(4, 15);
        g.curMul = rand(0.75, 1.05);
        g.fromMul = g.curMul;
        g.toMul = g.curMul;
      } else {
        g.persona = PERSONA_GLINT;
        g.period = rand(2.5, 6);
        g.phase0 = rand(0, TWO_PI);
        g.curMul = 1;
        // Glints pick up a hint of the district's neon accent.
        _seedColor.lerp(_accentColor, 0.25);
      }
      g.material.color.copy(_seedColor);
      g.material.opacity = g.baseOpacity * g.curMul;
      g.sprite.visible = true;

      placedX.push(px);
      placedY.push(py);
      placed++;
    }

    for (let i = placed; i < poolSize; i++) glows[i].sprite.visible = false;
    seeded = true;
  };

  const startTrafficPass = (): boolean => {
    // Widest street corridor within the drivable clearance band.
    let bestBin = -1;
    let bestClear = 0;
    for (let b = 0; b < corridorBins; b++) {
      const c = corridor[b];
      if (c >= CORRIDOR_MIN && c <= CORRIDOR_MAX && c > bestClear) {
        bestClear = c;
        bestBin = b;
      }
    }
    if (bestBin < 0) return false;

    const phi = (bestBin / corridorBins) * TWO_PI;
    const dir = Math.random() < 0.5 ? 1 : -1;
    const r = THREE.MathUtils.clamp(bestClear * 0.75, 20, 45);
    trafficBaseX = -r * Math.cos(phi);
    trafficBaseZ = r * Math.sin(phi);
    trafficTanX = Math.sin(phi) * dir;
    trafficTanZ = Math.cos(phi) * dir;
    trafficPerpX = -Math.cos(phi);
    trafficPerpZ = Math.sin(phi);

    trafficDur = rand(4, 7);
    trafficSpeed = rand(6, 11);
    trafficHalf = trafficSpeed * trafficDur * 0.5;
    trafficFade = trafficDur * 0.25;
    trafficT = 0;

    underglow.rotation.y = Math.atan2(-trafficTanZ, trafficTanX);
    trafficActive = true;
    trafficGroup.visible = true;
    return true;
  };

  const startFlight = (): void => {
    const phi = rand(0, TWO_PI);
    flockX = -BIRD_RADIUS * Math.cos(phi);
    flockZ = BIRD_RADIUS * Math.sin(phi);
    flockY = rand(12, 20);

    // Roughly tangential heading, jittered by up to ±0.4 rad.
    const dir = Math.random() < 0.5 ? 1 : -1;
    const tx = Math.sin(phi) * dir;
    const tz = Math.cos(phi) * dir;
    const e = rand(-0.4, 0.4);
    const ce = Math.cos(e);
    const se = Math.sin(e);
    const hx = tx * ce + tz * se;
    const hz = -tx * se + tz * ce;
    const speed = rand(9, 13);
    flockVelX = hx * speed;
    flockVelZ = hz * speed;

    flightDur = rand(9, 14);
    flightT = 0;

    const heading = Math.atan2(-hz, hx);
    for (let i = 0; i < BIRD_COUNT; i++) {
      birdOffsets[i * 3] = rand(-2.5, 2.5);
      birdOffsets[i * 3 + 1] = rand(-1, 1);
      birdOffsets[i * 3 + 2] = rand(-2.5, 2.5);
      birds[i].rotation.y = heading;
    }
    flockFlying = true;
    birdGroup.visible = true;
  };

  const update = (dt: number, t: number, camera: THREE.Camera): void => {
    // Reduced motion: seeded glows stay at their steady brightness, no sweeps,
    // no flocks — the photo is calm but still lit.
    if (!seeded || opts.reduced) return;

    camera.getWorldDirection(_camDir);

    // ---- windows / glints ----
    for (let i = 0; i < poolSize; i++) {
      const g = glows[i];
      if (!g.sprite.visible) continue;
      if (g.persona === PERSONA_WINDOW) {
        g.timer += dt;
        if (g.phase === PHASE_STEADY) {
          if (g.timer >= g.wait) {
            g.timer = 0;
            if (Math.random() < BLACKOUT_CHANCE) {
              g.phase = PHASE_BLACKOUT;
              g.toMul = g.curMul; // remember brightness to restore
              g.curMul = 0;
              g.wait = rand(0.5, 2);
            } else {
              g.phase = PHASE_STEP;
              g.fromMul = g.curMul;
              g.toMul = rand(0.4, 1.2);
              g.wait = STEP_DURATION;
            }
          }
        } else if (g.phase === PHASE_STEP) {
          const k = Math.min(1, g.timer / g.wait);
          g.curMul = g.fromMul + (g.toMul - g.fromMul) * k;
          if (k >= 1) {
            g.phase = PHASE_STEADY;
            g.timer = 0;
            g.wait = rand(4, 15);
          }
        } else if (g.timer >= g.wait) {
          // Blackout over — step back up to the remembered brightness.
          g.phase = PHASE_STEP;
          g.timer = 0;
          g.fromMul = 0;
          g.wait = STEP_DURATION;
        }
        g.material.opacity = g.baseOpacity * g.curMul;
      } else {
        const pulse = 1 + 0.6 * Math.sin((TWO_PI * t) / g.period + g.phase0);
        const facing = Math.max(
          0,
          _camDir.x * g.dirX + _camDir.y * g.dirY + _camDir.z * g.dirZ,
        );
        g.material.opacity =
          g.baseOpacity * pulse * (0.6 + 0.8 * facing * facing);
      }
    }

    // ---- traffic sweep ----
    if (trafficActive) {
      trafficT += dt;
      if (trafficT >= trafficDur) {
        trafficActive = false;
        trafficGroup.visible = false;
        trafficTimer = rand(8, 20);
      } else {
        const along = -trafficHalf + trafficSpeed * trafficT;
        const cx = trafficBaseX + trafficTanX * along;
        const cz = trafficBaseZ + trafficTanZ * along;
        const env = THREE.MathUtils.clamp(
          Math.min(trafficT, trafficDur - trafficT) / trafficFade,
          0,
          1,
        );
        tailL.position.set(
          cx + trafficPerpX * 0.25,
          TAIL_Y,
          cz + trafficPerpZ * 0.25,
        );
        tailR.position.set(
          cx - trafficPerpX * 0.25,
          TAIL_Y,
          cz - trafficPerpZ * 0.25,
        );
        underglow.position.set(cx, UNDERGLOW_Y, cz);
        tailMaterialL.opacity = TAIL_OPACITY * env;
        tailMaterialR.opacity = TAIL_OPACITY * env;
        underglowMaterial.opacity = UNDERGLOW_OPACITY * env;
      }
    } else {
      trafficTimer -= dt;
      if (trafficTimer <= 0 && !startTrafficPass()) {
        trafficTimer = rand(8, 20); // no corridor found — try again later
      }
    }

    // ---- birds ----
    if (birds.length > 0) {
      if (flockFlying) {
        flightT += dt;
        if (flightT >= flightDur) {
          flockFlying = false;
          birdGroup.visible = false;
          flockTimer = rand(40, 100);
        } else {
          const cx = flockX + flockVelX * flightT;
          const cz = flockZ + flockVelZ * flightT;
          const spread = 1 + flightT * BIRD_SPREAD_RATE;
          for (let i = 0; i < BIRD_COUNT; i++) {
            birds[i].position.set(
              cx + birdOffsets[i * 3] * spread,
              flockY +
                birdOffsets[i * 3 + 1] * spread +
                Math.sin(t * 9 + i) * 0.25,
              cz + birdOffsets[i * 3 + 2] * spread,
            );
          }
        }
      } else {
        flockTimer -= dt;
        if (flockTimer <= 0) startFlight();
      }
    }
  };

  const dispose = (): void => {
    scene.remove(root);
    for (const g of glows) g.material.dispose();
    tailMaterialL.dispose();
    tailMaterialR.dispose();
    underglowGeometry.dispose();
    underglowMaterial.dispose();
    if (birdGeometry) birdGeometry.dispose();
    if (birdMaterial) birdMaterial.dispose();
    glowTexture.dispose();
  };

  return { seed, update, dispose };
}
