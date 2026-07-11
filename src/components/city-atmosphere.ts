import * as THREE from "three";

export interface Atmosphere {
  update(dt: number, t: number, camera: THREE.Camera, playing: boolean): void;
  setWind(w: [number, number]): void;
  getWind(): [number, number];
  getRain(): number;
  seedVents(spots: Array<[number, number]>): void;
  setAccent(hex: number): void;
  dispose(): void;
}

const rand = (a: number, b: number): number => a + Math.random() * (b - a);

const smoothstep = (x: number): number => {
  const c = Math.min(1, Math.max(0, x));
  return c * c * (3 - 2 * c);
};

function makeGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const g = canvas.getContext("2d");
  if (g) {
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.35, "rgba(255,255,255,0.45)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
  }
  return new THREE.CanvasTexture(canvas);
}

// 64x64 soft blotchy radial puff for neon steam vents (drawn once, shared).
function makePuffTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const g = canvas.getContext("2d");
  if (g) {
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,255,255,0.85)");
    grad.addColorStop(0.5, "rgba(255,255,255,0.3)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    for (let i = 0; i < 14; i++) {
      const bx = rand(12, 52);
      const by = rand(12, 52);
      const br = rand(4, 11);
      const blob = g.createRadialGradient(bx, by, 0, bx, by, br);
      blob.addColorStop(0, "rgba(255,255,255,0.2)");
      blob.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = blob;
      g.beginPath();
      g.arc(bx, by, br, 0, Math.PI * 2);
      g.fill();
    }
  }
  return new THREE.CanvasTexture(canvas);
}

interface Ripple {
  mesh: THREE.Mesh;
  mat: THREE.MeshBasicMaterial;
  life: number;
}

interface VentPuff {
  sprite: THREE.Sprite;
  y: number;
  speed: number;
  dx: number;
  dz: number;
}

interface VentPlume {
  group: THREE.Group;
  mat: THREE.SpriteMaterial;
  puffs: VentPuff[];
}

const VENT_PLUMES = 3;
const VENT_PUFFS = 8;
const VENT_HEIGHT = 3;

interface RainLayer {
  lines: THREE.LineSegments;
  geo: THREE.BufferGeometry;
  attr: THREE.BufferAttribute;
  pos: Float32Array;
  mat: THREE.LineBasicMaterial;
  count: number;
  minR: number;
  maxR: number;
  baseOpacity: number;
  gate: boolean;
  speed: Float32Array;
  len: Float32Array;
  jx: Float32Array;
  jz: Float32Array;
}

interface MistSprite {
  sprite: THREE.Sprite;
  mat: THREE.SpriteMaterial;
  ox: number;
  oz: number;
  spin: number;
  phase: number;
}

function makeRainLayer(
  scene: THREE.Scene,
  count: number,
  minR: number,
  maxR: number,
  lenA: number,
  lenB: number,
  spdA: number,
  spdB: number,
  color: number,
  baseOpacity: number,
  gate: boolean,
): RainLayer {
  const pos = new Float32Array(count * 6);
  const speed = new Float32Array(count);
  const len = new Float32Array(count);
  const jx = new Float32Array(count);
  const jz = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = rand(minR, maxR);
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    const y = rand(-2, 10);
    speed[i] = rand(spdA, spdB);
    len[i] = rand(lenA, lenB);
    jx[i] = rand(-0.03, 0.03);
    jz[i] = rand(-0.03, 0.03);
    const o = i * 6;
    pos[o] = x;
    pos[o + 1] = y;
    pos[o + 2] = z;
    pos[o + 3] = x;
    pos[o + 4] = y - len[i];
    pos[o + 5] = z;
  }
  const geo = new THREE.BufferGeometry();
  const attr = new THREE.BufferAttribute(pos, 3);
  geo.setAttribute("position", attr);
  const mat = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: baseOpacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const lines = new THREE.LineSegments(geo, mat);
  lines.frustumCulled = false;
  scene.add(lines);
  return { lines, geo, attr, pos, mat, count, minR, maxR, baseOpacity, gate, speed, len, jx, jz };
}

export function createAtmosphere(
  scene: THREE.Scene,
  opts: { lowPerf: boolean; reduced: boolean; groundY: number },
): Atmosphere {
  const wind: [number, number] = [0, 0];
  const live: [number, number] = [0, 0];
  const windOut: [number, number] = [0, 0];
  let accent = 0x67e8f9;

  // gust brain: two slow incommensurate sines + occasional gust events
  let atmoT = 0;
  let gustIn = rand(15, 45);
  let gustAge = -1;
  let gustMag = 0;
  const gustDir: [number, number] = [1, 1];

  const moteCount = opts.reduced ? 0 : opts.lowPerf ? 140 : 260;
  let motes: THREE.Points | null = null;
  let moteGeo: THREE.BufferGeometry | null = null;
  let moteMat: THREE.PointsMaterial | null = null;
  let moteTex: THREE.CanvasTexture | null = null;
  let moteAttr: THREE.BufferAttribute | null = null;
  let motePos: Float32Array | null = null;

  if (moteCount > 0) {
    moteTex = makeGlowTexture();
    motePos = new Float32Array(moteCount * 3);
    for (let i = 0; i < moteCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = rand(1, 11);
      motePos[i * 3] = Math.cos(a) * r;
      motePos[i * 3 + 1] = rand(-1.4, 6);
      motePos[i * 3 + 2] = Math.sin(a) * r;
    }
    moteGeo = new THREE.BufferGeometry();
    moteAttr = new THREE.BufferAttribute(motePos, 3);
    moteGeo.setAttribute("position", moteAttr);
    moteMat = new THREE.PointsMaterial({
      size: 0.055,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      map: moteTex,
      color: 0x67e8f9,
    });
    motes = new THREE.Points(moteGeo, moteMat);
    scene.add(motes);
  }

  const rippleCount = opts.reduced ? 0 : opts.lowPerf ? 6 : 10;
  const ripples: Ripple[] = [];
  let rippleGeo: THREE.RingGeometry | null = null;
  if (rippleCount > 0) {
    rippleGeo = new THREE.RingGeometry(0.46, 0.5, 24);
    for (let i = 0; i < rippleCount; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xa8d8ff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(rippleGeo, mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.y = opts.groundY + 0.02 + i * 0.004;
      mesh.visible = false;
      scene.add(mesh);
      ripples.push({ mesh, mat, life: -1 });
    }
  }

  const plumes: VentPlume[] = [];
  let puffTex: THREE.CanvasTexture | null = null;
  // additive overdraw is fill-rate; phones get fewer, sparser plumes
  const ventPlumes = opts.lowPerf ? 2 : VENT_PLUMES;
  const ventPuffs = opts.lowPerf ? 5 : VENT_PUFFS;
  if (!opts.reduced) {
    puffTex = makePuffTexture();
    for (let p = 0; p < ventPlumes; p++) {
      const mat = new THREE.SpriteMaterial({
        map: puffTex,
        transparent: true,
        opacity: 0.06,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        color: accent,
      });
      const group = new THREE.Group();
      group.visible = false;
      const puffs: VentPuff[] = [];
      for (let i = 0; i < ventPuffs; i++) {
        const sprite = new THREE.Sprite(mat);
        group.add(sprite);
        puffs.push({
          sprite,
          y: rand(0, VENT_HEIGHT),
          speed: rand(0.25, 0.45),
          dx: rand(-0.15, 0.15),
          dz: rand(-0.15, 0.15),
        });
      }
      scene.add(group);
      plumes.push({ group, mat, puffs });
    }
  }

  const resetPuff = (puff: VentPuff, phase: number): void => {
    puff.y = phase;
    puff.speed = rand(0.25, 0.45);
    puff.dx = rand(-0.15, 0.15);
    puff.dz = rand(-0.15, 0.15);
  };

  // rain intensity brain: two slow sines + smoothed random walk, 0.22 (drizzle) .. 1 (downpour)
  let rainLevel = opts.reduced ? 0.3 : 0.5;
  let rainWalk = 0;
  let rainWalkTarget = 0;
  let rainWalkIn = 0;

  const rainLayers: RainLayer[] = [];
  if (!opts.reduced) {
    rainLayers.push(
      makeRainLayer(scene, opts.lowPerf ? 170 : 340, 0.3, 6, 0.2, 0.3, 9.5, 11.5, 0xd6e6ff, 0.42, false),
      makeRainLayer(scene, opts.lowPerf ? 260 : 560, 5, 14, 0.55, 0.85, 7.5, 9.5, 0x9fb8d8, 0.16, true),
    );
  }

  // downpour mist: big soft ground-hugging sprites, only visible in heavy rain
  const mists: MistSprite[] = [];
  if (!opts.reduced && puffTex) {
    const mistCount = opts.lowPerf ? 2 : 3;
    for (let i = 0; i < mistCount; i++) {
      const mat = new THREE.SpriteMaterial({
        map: puffTex,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        color: 0x8fa8c8,
      });
      const sprite = new THREE.Sprite(mat);
      const s = rand(6, 9);
      sprite.scale.set(s, s, 1);
      sprite.visible = false;
      scene.add(sprite);
      const a = (i / mistCount) * Math.PI * 2 + 0.7;
      mists.push({
        sprite,
        mat,
        ox: Math.cos(a) * 7,
        oz: Math.sin(a) * 7,
        spin: rand(-0.06, 0.06) + 0.02,
        phase: rand(0, Math.PI * 2),
      });
    }
  }

  let rippleIdx = 0;
  let spawnIn = rand(0.1, 0.28);

  return {
    update(dt: number, _t: number, camera: THREE.Camera, playing: boolean): void {
      atmoT += dt;
      if (gustAge < 0) {
        gustIn -= dt;
        if (gustIn <= 0) {
          gustAge = 0;
          gustMag = rand(0.5, 2.2);
          gustDir[0] = Math.random() < 0.5 ? -1 : 1;
          gustDir[1] = Math.random() < 0.5 ? -1 : 1;
        }
      }
      let gx = 0;
      let gz = 0;
      if (gustAge >= 0) {
        gustAge += dt;
        const env = gustAge < 1 ? smoothstep(gustAge) : Math.max(0, 1 - (gustAge - 1) / 3);
        gx = gustDir[0] * gustMag * env;
        gz = gustDir[1] * gustMag * env;
        if (gustAge >= 4) {
          gustAge = -1;
          gustIn = rand(15, 45);
        }
      }
      live[0] = wind[0] + Math.sin((atmoT * Math.PI * 2) / 17) * 0.25 + gx;
      live[1] = wind[1] + Math.sin((atmoT * Math.PI * 2) / 29 + 1.7) * 0.25 + gz;

      if (!opts.reduced) {
        rainWalkIn -= dt;
        if (rainWalkIn <= 0) {
          rainWalkIn = rand(6, 15);
          rainWalkTarget = rand(-0.28, 0.28);
        }
        rainWalk += (rainWalkTarget - rainWalk) * Math.min(1, dt * 0.3);
        const sines =
          Math.sin((atmoT * Math.PI * 2) / 53) * 0.5 + Math.sin((atmoT * Math.PI * 2) / 87 + 2.4) * 0.5;
        rainLevel = Math.min(1, Math.max(0.22, 0.61 + sines * 0.39 + rainWalk));
      }

      if (rainLayers.length > 0) {
        const cx = camera.position.x;
        const cy = camera.position.y;
        const cz = camera.position.z;
        for (const layer of rainLayers) {
          layer.mat.opacity = layer.baseOpacity * (0.25 + 0.75 * rainLevel);
          const p = layer.pos;
          const maxR2 = layer.maxR * layer.maxR;
          for (let i = 0; i < layer.count; i++) {
            const o = i * 6;
            let x = p[o];
            let y = p[o + 1] - layer.speed[i] * dt;
            let z = p[o + 2];
            const dx = x - cx;
            const dz = z - cz;
            if (y < cy - 11 || dx * dx + dz * dz > maxR2) {
              if (layer.gate && i / layer.count > rainLevel) {
                // drizzle: park this far drop out of sight; rechecked each recycle
                x = cx;
                z = cz;
                y = cy - 60;
              } else {
                const a = Math.random() * Math.PI * 2;
                const r = rand(layer.minR, layer.maxR);
                x = cx + Math.cos(a) * r;
                z = cz + Math.sin(a) * r;
                y = cy + rand(2, 10);
              }
            }
            p[o] = x;
            p[o + 1] = y;
            p[o + 2] = z;
            // wind shear: slant streaks with live wind + per-drop jitter, magnitude <= 0.22
            let sx = live[0] * 0.12 + layer.jx[i];
            let sz = live[1] * 0.12 + layer.jz[i];
            const sm2 = sx * sx + sz * sz;
            if (sm2 > 0.22 * 0.22) {
              const k = 0.22 / Math.sqrt(sm2);
              sx *= k;
              sz *= k;
            }
            p[o + 3] = x + sx;
            p[o + 4] = y - layer.len[i];
            p[o + 5] = z + sz;
          }
          layer.attr.needsUpdate = true;
        }
      }

      if (mists.length > 0) {
        const mistOp = (0.045 * Math.max(0, rainLevel - 0.55)) / 0.45;
        for (const m of mists) {
          m.mat.opacity = mistOp;
          m.sprite.visible = mistOp > 0.002;
          if (!m.sprite.visible) continue;
          m.mat.rotation += m.spin * dt;
          m.sprite.position.set(
            camera.position.x + m.ox + Math.sin(atmoT * 0.11 + m.phase) * 0.8,
            opts.groundY + 0.5,
            camera.position.z + m.oz + Math.cos(atmoT * 0.09 + m.phase) * 0.8,
          );
        }
      }

      if (motePos && moteAttr) {
        for (let i = 0; i < moteCount; i++) {
          let x = motePos[i * 3] + live[0] * dt;
          let y = motePos[i * 3 + 1] + 0.14 * dt;
          let z = motePos[i * 3 + 2] + live[1] * dt;
          if (y > 6) y = -1.4;
          if (x * x + z * z > 144) {
            x *= -0.98;
            z *= -0.98;
          }
          motePos[i * 3] = x;
          motePos[i * 3 + 1] = y;
          motePos[i * 3 + 2] = z;
        }
        moteAttr.needsUpdate = true;
      }

      if (ripples.length > 0) {
        if (playing) {
          spawnIn -= dt;
          if (spawnIn <= 0) {
            spawnIn = rand(0.1, 0.28) / (0.25 + rainLevel);
            const r = ripples[rippleIdx];
            rippleIdx = (rippleIdx + 1) % ripples.length;
            const a = Math.random() * Math.PI * 2;
            const d = rand(0.8, 6);
            r.mesh.position.x = camera.position.x + Math.cos(a) * d;
            r.mesh.position.z = camera.position.z + Math.sin(a) * d;
            r.life = 0;
            r.mesh.visible = true;
          }
        }
        for (const r of ripples) {
          if (r.life < 0) continue;
          r.life += dt;
          const k = r.life / 0.7;
          if (k >= 1) {
            r.life = -1;
            r.mesh.visible = false;
            r.mat.opacity = 0;
            continue;
          }
          const s = 0.25 + (2.1 - 0.25) * k;
          r.mesh.scale.set(s, s, s);
          r.mat.opacity = 0.38 * (0.5 + 0.5 * rainLevel) * (1 - k);
        }
      }

      for (const plume of plumes) {
        if (!plume.group.visible) continue;
        for (const puff of plume.puffs) {
          puff.y += puff.speed * dt;
          puff.dx += live[0] * dt * 0.6;
          puff.dz += live[1] * dt * 0.6;
          if (puff.y >= VENT_HEIGHT) resetPuff(puff, rand(0, 0.35));
          const k = puff.y / VENT_HEIGHT;
          // shared material per plume -> per-puff fade near the top is done via scale
          const fade = k > 0.72 ? Math.max(0, 1 - (k - 0.72) / 0.28) : 1;
          const s = (0.5 + (2.2 - 0.5) * k) * fade;
          puff.sprite.position.set(puff.dx, puff.y, puff.dz);
          puff.sprite.scale.set(s, s, 1);
        }
      }
    },
    setWind(w: [number, number]): void {
      wind[0] = w[0];
      wind[1] = w[1];
    },
    getWind(): [number, number] {
      // reused tuple: callers read it immediately, never retain it
      windOut[0] = live[0];
      windOut[1] = live[1];
      return windOut;
    },
    getRain(): number {
      // reduced mode never updates it: constant 0.3
      return rainLevel;
    },
    seedVents(spots: Array<[number, number]>): void {
      for (let i = 0; i < plumes.length; i++) {
        const plume = plumes[i];
        if (i < spots.length) {
          plume.group.position.set(spots[i][0], opts.groundY, spots[i][1]);
          plume.group.visible = true;
          for (const puff of plume.puffs) resetPuff(puff, rand(0, VENT_HEIGHT));
        } else {
          plume.group.visible = false;
        }
      }
    },
    setAccent(hex: number): void {
      accent = hex;
      if (moteMat) moteMat.color.setHex(hex);
      for (const plume of plumes) plume.mat.color.setHex(accent);
    },
    dispose(): void {
      if (motes) scene.remove(motes);
      moteGeo?.dispose();
      moteMat?.dispose();
      moteTex?.dispose();
      for (const r of ripples) {
        scene.remove(r.mesh);
        r.mat.dispose();
      }
      rippleGeo?.dispose();
      for (const plume of plumes) {
        scene.remove(plume.group);
        plume.mat.dispose();
      }
      for (const layer of rainLayers) {
        scene.remove(layer.lines);
        layer.geo.dispose();
        layer.mat.dispose();
      }
      for (const m of mists) {
        scene.remove(m.sprite);
        m.mat.dispose();
      }
      puffTex?.dispose();
    },
  };
}

export interface Storm {
  update(dt: number, playing: boolean): number; // current sky-flash 0..1
  dispose(): void;
}

// Sheet-lightning scheduler. Pure accumulated-dt state, no Date.now, no globals.
export function createStorm(onThunder: (dist01: number) => void): Storm {
  let countdown = rand(20, 50);
  let flash = 0;
  let secondIn = -1;
  let thunderIn = -1;
  let thunderDelay = 0;
  let disposed = false;

  return {
    update(dt: number, playing: boolean): number {
      if (disposed) return 0;
      if (!playing) {
        flash = 0;
        return 0;
      }
      flash = Math.max(0, flash - flash * dt * 9);
      if (secondIn >= 0) {
        secondIn -= dt;
        if (secondIn <= 0) {
          secondIn = -1;
          flash = Math.max(flash, 0.55);
        }
      }
      if (thunderIn >= 0) {
        thunderIn -= dt;
        if (thunderIn <= 0) {
          thunderIn = -1;
          onThunder(thunderDelay / 2.6);
        }
      }
      countdown -= dt;
      if (countdown <= 0) {
        countdown = rand(45, 120);
        flash = rand(0.85, 1);
        secondIn = 0.12;
        thunderDelay = rand(0.6, 2.6);
        thunderIn = thunderDelay;
      }
      return flash;
    },
    dispose(): void {
      disposed = true;
      flash = 0;
      secondIn = -1;
      thunderIn = -1;
    },
  };
}

export interface RadarBlipSets {
  peds: Array<[number, number]>;
  vehs: Array<[number, number]>;
  drones: Array<[number, number]>;
}

const RADAR_RANGE = 45;

export function drawRadar(
  ctx: CanvasRenderingContext2D,
  size: number,
  yaw: number,
  t: number,
  px: number,
  pz: number,
  blips: RadarBlipSets,
): void {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 3;
  const scale = radius / RADAR_RANGE;
  const cos = Math.cos(-yaw);
  const sin = Math.sin(-yaw);

  ctx.save();
  ctx.clearRect(0, 0, size, size);

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();

  const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  bg.addColorStop(0, "rgba(8,12,22,0.85)");
  bg.addColorStop(1, "rgba(3,3,9,0.95)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = "rgba(103,232,249,0.12)";
  ctx.lineWidth = 1;
  for (const ring of [15, 30]) {
    ctx.beginPath();
    ctx.arc(cx, cy, ring * scale, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (typeof ctx.createConicGradient === "function") {
    const sweep = ctx.createConicGradient(t * 1.4, cx, cy);
    sweep.addColorStop(0, "rgba(103,232,249,0)");
    sweep.addColorStop(0.82, "rgba(103,232,249,0)");
    sweep.addColorStop(1, "rgba(103,232,249,0.16)");
    ctx.fillStyle = sweep;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const plot = (bx: number, bz: number): [number, number] => {
    const dx = bx - px;
    const dz = bz - pz;
    return [cx + (cos * dx - sin * dz) * scale, cy + (sin * dx + cos * dz) * scale];
  };

  ctx.shadowBlur = 5;

  ctx.fillStyle = "#a5f3fc";
  ctx.shadowColor = "#a5f3fc";
  for (const [bx, bz] of blips.peds) {
    const [x, y] = plot(bx, bz);
    ctx.beginPath();
    ctx.arc(x, y, 1.6, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#fcd34d";
  ctx.shadowColor = "#fcd34d";
  for (const [bx, bz] of blips.vehs) {
    const [x, y] = plot(bx, bz);
    ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
  }

  ctx.fillStyle = "#f0abfc";
  ctx.shadowColor = "#f0abfc";
  for (const [bx, bz] of blips.drones) {
    const [x, y] = plot(bx, bz);
    ctx.beginPath();
    ctx.arc(x, y, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#67e8f9";
  ctx.shadowColor = "#67e8f9";
  ctx.beginPath();
  ctx.moveTo(cx, cy - 5);
  ctx.lineTo(cx - 3.5, cy + 4);
  ctx.lineTo(cx + 3.5, cy + 4);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  ctx.save();
  ctx.strokeStyle = "rgba(103,232,249,0.55)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();

  // heading-up display: world north (0,-1) rotates around the dial
  const nx = -sin * -1;
  const nz = cos * -1;
  ctx.fillStyle = "rgba(103,232,249,0.6)";
  ctx.font = "7px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("K", cx + nx * (radius - 7), cy + nz * (radius - 7));
  ctx.restore();
}

export interface CityAudio {
  vehGain: GainNode;
  siren(): void;
  thunder(dist01: number): void;
  stinger(): void;
  setDistrictTone(idx: number): void;
  setRainLevel(level: number): void;
  dispose(): void;
}

export function attachCityAudio(ctx: AudioContext, master: GainNode): CityAudio {
  const noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  // echo bus: in -> delay 0.31s -> (feedback 0.42 -> lowpass 2600 -> delay) ; delay -> 0.5 -> master
  const echoIn = ctx.createGain();
  const echoDelay = ctx.createDelay(1);
  echoDelay.delayTime.value = 0.31;
  const echoFb = ctx.createGain();
  echoFb.gain.value = 0.42;
  const echoLp = ctx.createBiquadFilter();
  echoLp.type = "lowpass";
  echoLp.frequency.value = 2600;
  const echoOut = ctx.createGain();
  echoOut.gain.value = 0.5;
  echoIn.connect(echoDelay);
  echoDelay.connect(echoFb).connect(echoLp).connect(echoDelay);
  echoDelay.connect(echoOut).connect(master);

  // neon-hum district chord bed: two detuned saws + a sine fifth -> lowpass -> quiet gain
  const districtF = (idx: number): number => 36 + (idx % 11) * 2.2;
  const humA = ctx.createOscillator();
  humA.type = "sawtooth";
  const humB = ctx.createOscillator();
  humB.type = "sawtooth";
  const humC = ctx.createOscillator();
  humC.type = "sine";
  const f0 = districtF(0);
  humA.frequency.value = f0;
  humB.frequency.value = f0 * 1.011;
  humC.frequency.value = f0 * 1.5;
  const humLp = ctx.createBiquadFilter();
  humLp.type = "lowpass";
  humLp.frequency.value = 300;
  const humGain = ctx.createGain();
  humGain.gain.value = 0.012;
  humA.connect(humLp);
  humB.connect(humLp);
  humC.connect(humLp);
  humLp.connect(humGain).connect(master);
  humA.start();
  humB.start();
  humC.start();

  const setDistrictTone = (idx: number): void => {
    const f = districtF(idx);
    const t0 = ctx.currentTime;
    humA.frequency.setTargetAtTime(f, t0, 0.6);
    humB.frequency.setTargetAtTime(f * 1.011, t0, 0.6);
    humC.frequency.setTargetAtTime(f * 1.5, t0, 0.6);
  };

  // 3s stereo brown-noise bed for thunder (leaky-integrated white, normalized to 0.8 peak)
  const thunderBuf = ctx.createBuffer(2, ctx.sampleRate * 3, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = thunderBuf.getChannelData(ch);
    let acc = 0;
    let peak = 0;
    for (let i = 0; i < d.length; i++) {
      acc = acc * 0.995 + (Math.random() * 2 - 1);
      d[i] = acc;
      const abs = Math.abs(acc);
      if (abs > peak) peak = abs;
    }
    const norm = 0.8 / (peak || 1);
    for (let i = 0; i < d.length; i++) d[i] *= norm;
  }

  const rainSrc = ctx.createBufferSource();
  rainSrc.buffer = noise;
  rainSrc.loop = true;
  const rainHp = ctx.createBiquadFilter();
  rainHp.type = "highpass";
  rainHp.frequency.value = 1500;
  const rainGain = ctx.createGain();
  rainGain.gain.value = 0.018;
  rainSrc.connect(rainHp).connect(rainGain).connect(master);
  rainSrc.start();

  const vehSrc = ctx.createBufferSource();
  vehSrc.buffer = noise;
  vehSrc.loop = true;
  const vehLp = ctx.createBiquadFilter();
  vehLp.type = "lowpass";
  vehLp.frequency.value = 380;
  const vehGain = ctx.createGain();
  vehGain.gain.value = 0;
  vehSrc.connect(vehLp).connect(vehGain).connect(master);
  vehSrc.start();

  const liveSirens = new Set<OscillatorNode>();

  const siren = (): void => {
    const t0 = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(640, t0);
    for (let i = 0; i < 4; i++) {
      const c = t0 + i * 0.8;
      osc.frequency.linearRampToValueAtTime(940, c + 0.4);
      osc.frequency.linearRampToValueAtTime(640, c + 0.8);
    }
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.014, t0 + 0.7);
    g.gain.setValueAtTime(0.014, t0 + 2.5);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 3.2);
    osc.connect(g);
    let tail: AudioNode = g;
    if (typeof StereoPannerNode !== "undefined") {
      const panner = ctx.createStereoPanner();
      panner.pan.value = rand(-0.8, 0.8);
      g.connect(panner);
      tail = panner;
    }
    tail.connect(master);
    const send = ctx.createGain();
    send.gain.value = 0.3;
    tail.connect(send).connect(echoIn);
    osc.start(t0);
    osc.stop(t0 + 3.25);
    liveSirens.add(osc);
    osc.onended = () => {
      liveSirens.delete(osc);
      try {
        osc.disconnect();
        g.disconnect();
        tail.disconnect();
        send.disconnect();
      } catch {
        // already torn down
      }
    };
  };

  const liveThunder = new Set<AudioBufferSourceNode>();

  const thunder = (dist01: number): void => {
    const t0 = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = thunderBuf;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(400, t0);
    lp.frequency.exponentialRampToValueAtTime(90, t0 + 3);
    const g = ctx.createGain();
    const peak = 0.028 * (1 - dist01 * 0.6);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(peak, t0 + 0.03);
    g.gain.exponentialRampToValueAtTime(peak * 0.3, t0 + 0.38);
    g.gain.linearRampToValueAtTime(peak * 0.6, t0 + 0.46);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 3);
    src.connect(lp).connect(g);
    g.connect(master);
    const send = ctx.createGain();
    send.gain.value = 0.4;
    g.connect(send).connect(echoIn);
    src.start(t0);
    src.stop(t0 + 3);
    liveThunder.add(src);
    src.onended = () => {
      liveThunder.delete(src);
      try {
        src.disconnect();
        lp.disconnect();
        g.disconnect();
        send.disconnect();
      } catch {
        // already torn down
      }
    };
  };

  const stinger = (): void => {
    const t0 = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = noise;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 2;
    bp.frequency.setValueAtTime(300, t0);
    bp.frequency.exponentialRampToValueAtTime(3200, t0 + 0.5);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(0.05, t0 + 0.25);
    g.gain.linearRampToValueAtTime(0.0001, t0 + 0.5);
    src.connect(bp).connect(g).connect(master);
    src.start(t0);
    src.stop(t0 + 0.55);
    liveThunder.add(src);
    src.onended = () => {
      liveThunder.delete(src);
      try {
        src.disconnect();
        bp.disconnect();
        g.disconnect();
      } catch {
        // already torn down
      }
    };

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(62, t0 + 0.55);
    osc.frequency.exponentialRampToValueAtTime(38, t0 + 0.9);
    const og = ctx.createGain();
    og.gain.setValueAtTime(0.0001, t0);
    og.gain.setValueAtTime(0.06, t0 + 0.55);
    og.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.1);
    osc.connect(og).connect(master);
    osc.start(t0 + 0.55);
    osc.stop(t0 + 1.15);
    liveSirens.add(osc);
    osc.onended = () => {
      liveSirens.delete(osc);
      try {
        osc.disconnect();
        og.disconnect();
      } catch {
        // already torn down
      }
    };
  };

  const dispose = (): void => {
    for (const src of [rainSrc, vehSrc]) {
      try {
        src.stop();
      } catch {
        // never started or already stopped
      }
    }
    for (const osc of [...liveSirens, humA, humB, humC]) {
      try {
        osc.stop();
      } catch {
        // already stopped
      }
    }
    liveSirens.clear();
    for (const src of liveThunder) {
      try {
        src.stop();
      } catch {
        // already stopped
      }
    }
    liveThunder.clear();
    const nodes: AudioNode[] = [
      rainSrc,
      rainHp,
      rainGain,
      vehSrc,
      vehLp,
      vehGain,
      humA,
      humB,
      humC,
      humLp,
      humGain,
      echoIn,
      echoDelay,
      echoFb,
      echoLp,
      echoOut,
    ];
    for (const node of nodes) {
      try {
        node.disconnect();
      } catch {
        // already disconnected
      }
    }
  };

  const setRainLevel = (level: number): void => {
    const l = Math.min(1, Math.max(0, level));
    // downpour: louder and fuller (the highpass opens downward)
    rainGain.gain.setTargetAtTime(0.008 + l * 0.024, ctx.currentTime, 0.8);
    rainHp.frequency.setTargetAtTime(1900 - l * 700, ctx.currentTime, 0.8);
  };

  return { vehGain, siren, thunder, stinger, setDistrictTone, setRainLevel, dispose };
}
