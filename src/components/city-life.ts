import * as THREE from "three";

/**
 * Ambient life for the depth-panorama city walk: umbrella-silhouette
 * pedestrians, sky vehicles, patrol drones and holo billboards. The scene has
 * no lights — the photo is the lighting — so everything here is either a
 * near-black silhouette (MeshBasicMaterial) or an additive neon glow. NPCs are
 * only placed in space the district's depth map proves is open, so nothing
 * spawns inside the photo's walls; the displaced photo mesh writes real depth,
 * so the city correctly occludes them.
 *
 * Azimuth convention (must match the host's clearance bins): bin b of azBins →
 * phi = (b/azBins)·2π; a point at radius r sits at (-r·cosφ, y, r·sinφ); the
 * walking tangent with sign dir is (sinφ·dir, 0, cosφ·dir).
 */

export interface DistrictCfg {
  accents: [number, number, number];
  peds: number;
  veh: number;
  drones: number;
  holos: number;
  wind: [number, number];
}

export interface RadarBlips {
  peds: Array<[number, number]>;
  vehs: Array<[number, number]>;
  drones: Array<[number, number]>;
}

export interface CityLife {
  seed(idx: number, cfg: DistrictCfg, clear: Float32Array, skyR: Float32Array, districtName: string): void;
  update(dt: number, t: number, camera: THREE.Camera): number;
  blips(): RadarBlips;
  dispose(): void;
}

const rand = (a: number, b: number): number => a + Math.random() * (b - a);

type PedVariant = "umbrella" | "hood" | "phone" | "plain";

const rollVariant = (): PedVariant => {
  const x = Math.random();
  if (x < 0.45) return "umbrella";
  if (x < 0.75) return "hood";
  if (x < 0.9) return "phone";
  return "plain";
};

const makeGlowTexture = (): THREE.CanvasTexture => {
  const cv = document.createElement("canvas");
  cv.width = 64;
  cv.height = 64;
  const g = cv.getContext("2d");
  if (g) {
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.35, "rgba(255,255,255,0.45)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
  }
  return new THREE.CanvasTexture(cv);
};

const makeSignTexture = (text: string, hex: number, sub?: string): THREE.CanvasTexture => {
  const cv = document.createElement("canvas");
  cv.width = 512;
  cv.height = 256;
  const g = cv.getContext("2d");
  if (g) {
    const col = "#" + hex.toString(16).padStart(6, "0");
    g.fillStyle = "#000000";
    g.fillRect(0, 0, 512, 256);
    g.strokeStyle = col;
    g.lineWidth = 6;
    g.strokeRect(16, 16, 480, 224);
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.shadowColor = col;
    g.shadowBlur = 32;
    g.fillStyle = "#ffffff";
    g.font = "900 82px 'Arial Black', Arial, sans-serif";
    g.fillText(text, 256, sub ? 104 : 128, 440);
    if (sub) {
      g.font = "700 44px Arial, sans-serif";
      g.fillStyle = col;
      g.fillText(sub, 256, 188, 440);
    }
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

interface Arc {
  r: number;
  a0: number;
  a1: number;
}

type PedState = "walk" | "pause";

interface Ped {
  g: THREE.Group;
  umbrella: THREE.Group;
  hood: THREE.Mesh;
  phone: THREE.Group;
  accent: THREE.MeshBasicMaterial;
  feet: THREE.MeshBasicMaterial;
  torso: THREE.Mesh;
  legL: THREE.Mesh;
  legR: THREE.Mesh;
  armL: THREE.Mesh;
  armR: THREE.Mesh;
  variant: PedVariant;
  r: number;
  a0: number;
  a1: number;
  ang: number;
  dir: 1 | -1;
  base: number; // cruise speed, m/s
  speed: number; // current speed, m/s (eased)
  stride: number; // persistent per-ped step length, m
  ph: number; // walk phase
  heading: number; // current yaw, slewed toward the target each frame
  state: PedState;
  stateT: number; // walk: time until next pause · pause: time left
  turnPending: boolean; // reverse dir when the end-of-arc pause finishes
  blocked: boolean; // halted at the player's bubble
  scanYaw: number; // yaw anchor for the idle look-around
  scanPh: number;
}

interface Cat {
  g: THREE.Group;
  r: number;
  a0: number;
  a1: number;
  ang: number;
  dir: 1 | -1;
  angSpeed: number;
  ph: number;
  walkT: number; // time until the next sit
  sitT: number; // time left sitting
}

interface Strobes {
  blue: THREE.SpriteMaterial;
  red: THREE.SpriteMaterial;
  sprites: [THREE.Sprite, THREE.Sprite];
}

interface Veh {
  g: THREE.Group;
  accent: THREE.MeshBasicMaterial;
  glow: THREE.MeshBasicMaterial;
  dir: THREE.Vector3;
  pos: THREE.Vector3;
  speed: number;
  seed: number;
  freighter: boolean;
  police: boolean;
  strobes: Strobes | null;
}

interface Drone {
  g: THREE.Group;
  cone: THREE.Mesh;
  blink: THREE.SpriteMaterial;
  orbR: number;
  orb: number;
  orbSpd: number;
  baseY: number;
  seed: number;
}

interface Holo {
  m: THREE.Mesh;
  mat: THREE.MeshBasicMaterial;
  baseY: number;
  seed: number;
  ownsMap: boolean;
}

export function createCityLife(
  scene: THREE.Scene,
  opts: { lowPerf: boolean; reduced: boolean; groundY: number; azBins: number },
): CityLife {
  const { lowPerf, groundY, azBins } = opts;
  const glowTex = makeGlowTexture();
  const disposables: Array<{ dispose: () => void }> = [glowTex];
  const track = <T extends { dispose: () => void }>(d: T): T => {
    disposables.push(d);
    return d;
  };

  // ---- shared silhouette materials / geometries ---------------------------
  const bodyMat = track(new THREE.MeshBasicMaterial({ color: 0x0a0b12 }));
  const headMat = track(new THREE.MeshBasicMaterial({ color: 0x14161f }));
  const darkMat = track(new THREE.MeshBasicMaterial({ color: 0x0d0e15, side: THREE.DoubleSide }));
  const hullMat = track(new THREE.MeshBasicMaterial({ color: 0x0a0c13 }));
  const cabMat = track(new THREE.MeshBasicMaterial({ color: 0x090a10 }));

  const torsoGeo = track(new THREE.CapsuleGeometry(0.16, 0.5, 4, 8));
  // limbs pivot at their top (hip / shoulder), so swing is a pure rotation.x
  const legGeo = track(new THREE.CapsuleGeometry(0.05, 0.62, 3, 6).translate(0, -0.36, 0));
  const armGeo = track(new THREE.CapsuleGeometry(0.035, 0.36, 3, 6).translate(0, -0.215, 0));
  const headGeo = track(new THREE.SphereGeometry(0.11, 8, 8));
  const canopyGeo = track(new THREE.ConeGeometry(0.55, 0.2, 10, 1, true));
  const rimGeo = track(new THREE.TorusGeometry(0.55, 0.014, 6, 20));
  const poleGeo = track(new THREE.CylinderGeometry(0.008, 0.008, 0.9, 5));
  const visorGeo = track(new THREE.BoxGeometry(0.16, 0.02, 0.02));
  const feetGeo = track(new THREE.PlaneGeometry(0.9, 0.9));
  const hoodGeo = track(new THREE.ConeGeometry(0.17, 0.24, 8));
  const phoneGeo = track(new THREE.PlaneGeometry(0.09, 0.13));
  const catBodyGeo = track(new THREE.CapsuleGeometry(0.07, 0.22, 3, 6));
  const catHeadGeo = track(new THREE.SphereGeometry(0.06, 8, 8));
  const catTailGeo = track(new THREE.BoxGeometry(0.015, 0.015, 0.22));
  const hullGeo = track(new THREE.BoxGeometry(0.9, 0.22, 2.0));
  const cabGeo = track(new THREE.BoxGeometry(0.55, 0.16, 0.7));
  const stripGeo = track(new THREE.BoxGeometry(0.03, 0.03, 1.6));
  const underGeo = track(new THREE.PlaneGeometry(0.8, 1.8));
  const droneGeo = track(new THREE.OctahedronGeometry(0.16));
  const coneGeo = track(new THREE.ConeGeometry(1.4, 6, 12, 1, true));
  const holoGeo = track(new THREE.PlaneGeometry(1, 1));

  const additive = (hex: number, opacity: number, map?: THREE.Texture): THREE.MeshBasicMaterial =>
    track(
      new THREE.MeshBasicMaterial({
        color: hex,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        map: map ?? null,
        side: map ? THREE.DoubleSide : THREE.FrontSide,
      }),
    );

  // ---- pedestrians ---------------------------------------------------------
  const PED_MAX = lowPerf ? 7 : 14;
  const phoneMat = track(new THREE.MeshBasicMaterial({
    color: 0xcfe8ff, transparent: true, opacity: 0.85,
    blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
  }));
  const faceGlowMat = track(new THREE.SpriteMaterial({
    map: glowTex, color: 0xbfe0ff, transparent: true, opacity: 0.4,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  const peds: Ped[] = [];
  for (let i = 0; i < PED_MAX; i++) {
    const g = new THREE.Group();
    const accent = additive(0x67e8f9, 0.9);
    const feet = additive(0x67e8f9, 0.3, glowTex);
    const torso = new THREE.Mesh(torsoGeo, bodyMat);
    torso.position.y = 0.95;
    g.add(torso);
    const legL = new THREE.Mesh(legGeo, bodyMat);
    legL.position.set(-0.09, 0.78, 0);
    g.add(legL);
    const legR = new THREE.Mesh(legGeo, bodyMat);
    legR.position.set(0.09, 0.78, 0);
    g.add(legR);
    const armL = new THREE.Mesh(armGeo, bodyMat);
    armL.position.set(-0.21, 1.25, 0);
    g.add(armL);
    const armR = new THREE.Mesh(armGeo, bodyMat);
    armR.position.set(0.21, 1.25, 0);
    g.add(armR);
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.32;
    g.add(head);
    const visor = new THREE.Mesh(visorGeo, accent);
    visor.position.set(0, 1.33, 0.1);
    g.add(visor);
    const umbrella = new THREE.Group();
    const canopy = new THREE.Mesh(canopyGeo, darkMat);
    canopy.position.y = 1.8;
    umbrella.add(canopy);
    const rim = new THREE.Mesh(rimGeo, accent);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 1.72;
    umbrella.add(rim);
    const pole = new THREE.Mesh(poleGeo, darkMat);
    pole.position.y = 1.35;
    umbrella.add(pole);
    g.add(umbrella);
    const hood = new THREE.Mesh(hoodGeo, darkMat);
    hood.position.y = 1.4;
    hood.visible = false;
    g.add(hood);
    const phone = new THREE.Group();
    const screen = new THREE.Mesh(phoneGeo, phoneMat);
    // held clear of the body capsule (radius 0.22) or the opaque torso hides it
    screen.position.set(0.06, 1.02, 0.28);
    screen.rotation.x = -0.5;
    phone.add(screen);
    const face = new THREE.Sprite(faceGlowMat);
    face.scale.setScalar(0.16);
    face.position.set(0, 1.28, 0.26);
    phone.add(face);
    phone.visible = false;
    g.add(phone);
    const feetGlow = new THREE.Mesh(feetGeo, feet);
    feetGlow.rotation.x = -Math.PI / 2;
    feetGlow.position.y = 0.02;
    g.add(feetGlow);
    g.visible = false;
    scene.add(g);
    peds.push({
      g, umbrella, hood, phone, accent, feet, torso, legL, legR, armL, armR,
      variant: "plain",
      r: 6, a0: 0, a1: Math.PI * 2, ang: 0, dir: 1,
      base: 1.1, speed: 0, stride: 0.75, ph: rand(0, 10),
      heading: 0, state: "walk", stateT: 10, turnPending: false, blocked: false,
      scanYaw: 0, scanPh: 0,
    });
  }

  // ---- stray cats ----------------------------------------------------------
  const CAT_MAX = lowPerf ? 1 : 2;
  const catEyeMat = track(new THREE.SpriteMaterial({
    map: glowTex, color: 0x8affd8, transparent: true, opacity: 0.9,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  const cats: Cat[] = [];
  for (let i = 0; i < CAT_MAX; i++) {
    const g = new THREE.Group();
    const body = new THREE.Mesh(catBodyGeo, cabMat);
    body.rotation.z = Math.PI / 2;
    body.position.y = 0.12;
    g.add(body);
    const head = new THREE.Mesh(catHeadGeo, cabMat);
    head.position.set(0.17, 0.16, 0);
    g.add(head);
    const tail = new THREE.Mesh(catTailGeo, cabMat);
    tail.position.set(-0.16, 0.2, 0);
    tail.rotation.set(-Math.PI / 2, -0.67, 0);
    g.add(tail);
    for (const ez of [-0.028, 0.028]) {
      const eye = new THREE.Sprite(catEyeMat);
      eye.scale.setScalar(0.035);
      eye.position.set(0.22, 0.17, ez);
      g.add(eye);
    }
    g.visible = false;
    scene.add(g);
    cats.push({
      g, r: 5, a0: 0, a1: Math.PI * 2, ang: 0, dir: 1, angSpeed: 0.3,
      ph: rand(0, 10), walkT: rand(4, 12), sitT: 0,
    });
  }

  // ---- sky vehicles --------------------------------------------------------
  const VEH_MAX = lowPerf ? 6 : 12;
  const vehs: Veh[] = [];
  for (let i = 0; i < VEH_MAX; i++) {
    const g = new THREE.Group();
    const accent = additive(0x67e8f9, 0.9);
    const glow = additive(0x67e8f9, 0.22, glowTex);
    g.add(new THREE.Mesh(hullGeo, hullMat));
    const cab = new THREE.Mesh(cabGeo, cabMat);
    cab.position.set(0, 0.18, 0.15);
    g.add(cab);
    for (const sx of [-0.47, 0.47]) {
      const strip = new THREE.Mesh(stripGeo, accent);
      strip.position.set(sx, 0, 0);
      g.add(strip);
    }
    const under = new THREE.Mesh(underGeo, glow);
    under.rotation.x = -Math.PI / 2;
    under.position.y = -0.14;
    g.add(under);
    const head = new THREE.Sprite(
      track(new THREE.SpriteMaterial({
        map: glowTex, color: 0xdff0ff, transparent: true,
        blending: THREE.AdditiveBlending, depthWrite: false,
      })),
    );
    head.scale.setScalar(0.55);
    head.position.z = -1.1;
    g.add(head);
    const tail = new THREE.Sprite(
      track(new THREE.SpriteMaterial({
        map: glowTex, color: 0xff2b4e, transparent: true,
        blending: THREE.AdditiveBlending, depthWrite: false,
      })),
    );
    tail.scale.setScalar(0.45);
    tail.position.z = 1.1;
    g.add(tail);
    let strobes: Strobes | null = null;
    if (i === 1) {
      // only the pool's police candidate carries strobe hardware
      const blue = track(new THREE.SpriteMaterial({
        map: glowTex, color: 0x3b82f6, transparent: true, opacity: 0.95,
        blending: THREE.AdditiveBlending, depthWrite: false,
      }));
      const red = track(new THREE.SpriteMaterial({
        map: glowTex, color: 0xff2b4e, transparent: true, opacity: 0.1,
        blending: THREE.AdditiveBlending, depthWrite: false,
      }));
      const sb = new THREE.Sprite(blue);
      sb.scale.setScalar(0.4);
      sb.position.set(-0.3, 0.14, -0.4);
      sb.visible = false;
      g.add(sb);
      const sr = new THREE.Sprite(red);
      sr.scale.setScalar(0.4);
      sr.position.set(0.3, 0.14, -0.4);
      sr.visible = false;
      g.add(sr);
      strobes = { blue, red, sprites: [sb, sr] };
    }
    g.visible = false;
    scene.add(g);
    vehs.push({
      g, accent, glow,
      dir: new THREE.Vector3(0, 0, -1), pos: new THREE.Vector3(),
      speed: 10, seed: rand(0, 10),
      freighter: false, police: false, strobes,
    });
  }
  const respawnVeh = (v: Veh): void => {
    const a = rand(0, Math.PI * 2);
    v.dir.set(Math.sin(a), 0, -Math.cos(a));
    const o = rand(-45, 45);
    const back = rand(100, 140);
    v.pos.set(
      Math.cos(a) * o - v.dir.x * back,
      rand(7, 26),
      Math.sin(a) * o - v.dir.z * back,
    );
    v.speed = rand(7, 18);
    if (v.freighter) {
      v.speed = Math.min(9, Math.max(5, v.speed));
      v.pos.y = rand(18, 26);
    }
    v.g.rotation.y = Math.atan2(-v.dir.x, -v.dir.z);
  };

  // ---- patrol drones -------------------------------------------------------
  const DRONE_MAX = lowPerf ? 1 : 2;
  const drones: Drone[] = [];
  for (let i = 0; i < DRONE_MAX; i++) {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(droneGeo, hullMat));
    const blink = track(new THREE.SpriteMaterial({
      map: glowTex, color: 0xff2b4e, transparent: true, opacity: 0.9,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    const nav = new THREE.Sprite(blink);
    nav.scale.setScalar(0.3);
    nav.position.y = 0.16;
    g.add(nav);
    const cone = new THREE.Mesh(coneGeo, additive(0x9fd8ff, 0.05));
    cone.position.y = -3.05;
    g.add(cone);
    g.visible = false;
    scene.add(g);
    drones.push({
      g, cone, blink,
      orbR: rand(12, 30), orb: rand(0, Math.PI * 2),
      orbSpd: (Math.random() < 0.5 ? -1 : 1) * rand(0.05, 0.12),
      baseY: rand(8, 14), seed: rand(0, 10),
    });
  }

  // ---- holo billboards -----------------------------------------------------
  const HOLO_MAX = lowPerf ? 2 : 3;
  const staticSigns = [
    makeSignTexture("LUMENFALL", 0xf0abfc, "2099"),
    makeSignTexture("PANOPT", 0x67e8f9, "GÖZETİM"),
    makeSignTexture("光·2099", 0xff5ea8),
  ];
  staticSigns.forEach((s) => track(s));
  const holos: Holo[] = [];
  for (let i = 0; i < HOLO_MAX; i++) {
    const mat = track(new THREE.MeshBasicMaterial({
      map: staticSigns[i % staticSigns.length],
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    }));
    const m = new THREE.Mesh(holoGeo, mat);
    m.visible = false;
    scene.add(m);
    holos.push({ m, mat, baseY: 10, seed: rand(0, 10), ownsMap: false });
  }

  const posOf = (phi: number, r: number): [number, number] => [-Math.cos(phi) * r, Math.sin(phi) * r];

  // Contiguous free arcs at a radius, with wrap-around handling. A bin counts
  // as walkable street only when the photo surface is open-but-BOUNDED there:
  // corridors read as moderate clearance, while open water / empty skyline
  // saturate the clearance cap — placing a walker there reads as walking on
  // water, so ultra-open bins are rejected.
  const CLEAR_WALL = 1.4; // margin to the nearest photo wall
  const CLEAR_MAX = 45; // beyond this the "street" is likely water / a void
  const findArcs = (clear: Float32Array, r: number): Arc[] => {
    const arcs: Arc[] = [];
    const minSpan = azBins * (20 / 360);
    let runStart = -1;
    for (let b = 0; b <= azBins * 2; b++) {
      const c = clear[b % azBins];
      const free = b < azBins * 2 && c > r + CLEAR_WALL && c < CLEAR_MAX;
      if (free && runStart < 0) runStart = b;
      if (!free && runStart >= 0) {
        const len = Math.min(b - runStart, azBins);
        if (runStart < azBins && len >= minSpan) {
          const a0 = (runStart / azBins) * Math.PI * 2;
          arcs.push({ r, a0, a1: a0 + (len / azBins) * Math.PI * 2 });
        }
        runStart = -1;
      }
    }
    return arcs;
  };

  return {
    seed(idx, cfg, clear, skyR, districtName) {
      // pedestrians on genuinely open street arcs
      const arcs: Arc[] = [];
      for (const r of [5, 6.5, 8, 10]) arcs.push(...findArcs(clear, r));
      if (arcs.length === 0) {
        // fallback: the bin whose clearance is closest to a street-like 8m —
        // NOT the most open one (that would be water / the skyline void)
        let best = 0;
        for (let b = 1; b < azBins; b++)
          if (Math.abs(clear[b] - 8) < Math.abs(clear[best] - 8)) best = b;
        const phi = (best / azBins) * Math.PI * 2;
        const r = Math.min(clear[best] * 0.5, 4.5);
        arcs.push({ r, a0: phi - 0.35, a1: phi + 0.35 });
      }
      const nPeds = Math.min(PED_MAX, lowPerf ? Math.ceil(cfg.peds / 2) : cfg.peds);
      peds.forEach((p, i) => {
        if (i >= nPeds) {
          p.g.visible = false;
          return;
        }
        const arc = arcs[i % arcs.length];
        p.variant = rollVariant();
        p.r = arc.r;
        p.a0 = arc.a0 + 0.05;
        p.a1 = arc.a1 - 0.05;
        p.dir = Math.random() < 0.5 ? 1 : -1;
        if (p.variant === "phone") {
          // phone peds loiter near an arc end, glued to the screen
          p.base = 0;
          p.speed = 0;
          p.ang = Math.random() < 0.5
            ? Math.min(p.a1, p.a0 + rand(0.02, 0.08))
            : Math.max(p.a0, p.a1 - rand(0.02, 0.08));
        } else {
          p.base = rand(0.9, 1.5);
          p.speed = p.base * rand(0.6, 1);
          p.ang = rand(p.a0, Math.max(p.a0, p.a1));
        }
        p.stride = rand(0.65, 0.85);
        p.state = "walk";
        p.stateT = rand(6, 18);
        p.turnPending = false;
        p.blocked = false;
        p.heading = Math.atan2(Math.sin(p.ang) * p.dir, Math.cos(p.ang) * p.dir);
        p.umbrella.visible = p.variant === "umbrella";
        p.hood.visible = p.variant === "hood" || (p.variant === "phone" && Math.random() < 0.5);
        p.phone.visible = p.variant === "phone";
        const accent = cfg.accents[i % 3];
        p.accent.color.setHex(accent);
        p.feet.color.setHex(accent);
        p.g.scale.setScalar(rand(0.9, 1.08));
        p.g.visible = true;
      });

      // couples: occasionally glue a ped to the next one so they stroll together
      for (let i = 0; i + 1 < nPeds; i++) {
        const lead = peds[i];
        const mate = peds[i + 1];
        if (lead.variant === "phone" || mate.variant === "phone") continue;
        if (Math.random() >= 0.3) continue;
        mate.r = lead.r + (Math.random() < 0.5 ? -0.28 : 0.28);
        mate.a0 = lead.a0;
        mate.a1 = lead.a1;
        mate.dir = lead.dir;
        // couples stroll at the slower partner's pace
        const pace = Math.min(lead.base, mate.base);
        lead.base = pace;
        mate.base = pace;
        mate.speed = lead.speed;
        mate.ang = Math.min(lead.a1, Math.max(lead.a0, lead.ang + 0.02));
        i++; // a follower never leads the next pair
      }

      // stray cats trot the tightest open arcs of busy districts
      let smallest = arcs[0];
      for (const arc of arcs) if (arc.r < smallest.r) smallest = arc;
      const tightArcs = arcs.filter((arc) => arc.r <= 6);
      const catArcs = tightArcs.length > 0 ? tightArcs : [smallest];
      const nCats = cfg.peds >= 6 ? CAT_MAX : 0;
      cats.forEach((c, i) => {
        if (i >= nCats) {
          c.g.visible = false;
          return;
        }
        const arc = catArcs[i % catArcs.length];
        c.r = arc.r;
        c.a0 = arc.a0 + 0.04;
        c.a1 = arc.a1 - 0.04;
        c.ang = rand(c.a0, Math.max(c.a0, c.a1));
        c.dir = Math.random() < 0.5 ? 1 : -1;
        c.angSpeed = rand(1.1, 1.7) / arc.r;
        c.ph = rand(0, 10);
        c.g.visible = true;
      });

      // sky vehicles
      const nVeh = Math.min(VEH_MAX, lowPerf ? Math.ceil(cfg.veh / 2) : cfg.veh);
      const heavyTraffic = cfg.veh >= 5;
      vehs.forEach((v, i) => {
        if (i >= nVeh) {
          v.g.visible = false;
          return;
        }
        v.freighter = heavyTraffic && i === 0;
        v.police = heavyTraffic && i === 1;
        v.g.scale.setScalar(v.freighter ? 1.9 : 1);
        if (v.strobes) {
          for (const s of v.strobes.sprites) s.visible = v.police;
        }
        v.accent.color.setHex(cfg.accents[i % 3]);
        v.glow.color.setHex(cfg.accents[i % 3]);
        respawnVeh(v);
        v.g.visible = true;
      });

      // drones
      const nDrones = Math.min(DRONE_MAX, cfg.drones);
      drones.forEach((d, i) => {
        d.g.visible = i < nDrones;
        if (d.g.visible) {
          d.orbR = rand(12, 30);
          d.baseY = rand(8, 14);
        }
      });

      // holo billboards toward open sky
      const cand: number[] = [];
      for (let b = 0; b < azBins; b++) if (skyR[b] > 26) cand.push(b);
      const nHolos = cand.length === 0 ? 0 : Math.min(HOLO_MAX, lowPerf ? Math.min(cfg.holos, 2) : cfg.holos);
      holos.forEach((hd, i) => {
        if (i >= nHolos) {
          hd.m.visible = false;
          return;
        }
        const bin = cand[Math.floor((i + 0.5) * (cand.length / Math.max(1, nHolos))) % cand.length];
        const phi = (bin / azBins) * Math.PI * 2;
        const r = Math.min(skyR[bin] * 0.8, 70);
        const [hx, hz] = posOf(phi, r);
        hd.baseY = r * 0.22 + rand(2, 6);
        const wdt = rand(6, 10);
        hd.m.scale.set(wdt, wdt / 2, 1);
        hd.m.position.set(hx, hd.baseY, hz);
        hd.m.lookAt(0, hd.baseY, 0);
        if (i === 0) {
          // first holo always advertises the district itself
          if (hd.ownsMap && hd.mat.map) hd.mat.map.dispose();
          hd.mat.map = makeSignTexture(districtName || "LUMENFALL", cfg.accents[0]);
          hd.mat.needsUpdate = true;
          hd.ownsMap = true;
        }
        hd.m.visible = true;
      });
      void idx;
    },

    update(dt, t, camera) {
      for (const p of peds) {
        if (!p.g.visible) continue;
        const still = p.variant === "phone";
        const [cx, cz] = posOf(p.ang, p.r);

        if (still) {
          // loiterer: glued to the screen, shifting weight slowly
          p.ph += dt * 0.6;
          p.speed = 0;
        } else {
          // never walk through the player: ease to a stop at their bubble
          const dC = Math.hypot(cx - camera.position.x, cz - camera.position.z);
          p.blocked = dC < 1.6;
          if (p.state === "walk") {
            const target = p.blocked ? 0 : p.base;
            p.speed += (target - p.speed) * Math.min(1, dt * 3);
            p.ang += p.dir * (p.speed / p.r) * dt;
            p.stateT -= dt;
            if (p.ang > p.a1 || p.ang < p.a0) {
              // reached the end of the walkable arc: pause, then turn back
              p.ang = Math.min(p.a1, Math.max(p.a0, p.ang));
              p.state = "pause";
              p.stateT = rand(0.4, 1.2);
              p.turnPending = true;
              p.scanYaw = p.heading;
              p.scanPh = 0;
            } else if (p.stateT <= 0 && !p.blocked) {
              // idle stop: look around for a moment like a real passer-by
              p.state = "pause";
              p.stateT = rand(1, 4);
              p.turnPending = false;
              p.scanYaw = p.heading;
              p.scanPh = 0;
            }
          } else {
            p.speed += (0 - p.speed) * Math.min(1, dt * 5);
            p.stateT -= dt;
            p.scanPh += dt;
            if (p.stateT <= 0) {
              if (p.turnPending) {
                p.dir = p.dir === 1 ? -1 : 1;
                p.turnPending = false;
              }
              p.state = "walk";
              p.stateT = rand(8, 20);
            }
          }
          // gait phase from actual ground covered (per-ped stride cadence)
          p.ph += (p.speed / p.stride) * dt * Math.PI;
        }

        // heading: slew smoothly toward the travel direction (or the idle scan)
        let want = p.heading;
        if (!still) {
          if (p.state === "walk" && p.speed > 0.05) {
            want = Math.atan2(Math.sin(p.ang) * p.dir, Math.cos(p.ang) * p.dir);
          } else if (p.state === "pause") {
            want = p.scanYaw + Math.sin(p.scanPh * 0.9) * 0.35;
          }
        }
        let dh = want - p.heading;
        dh = Math.atan2(Math.sin(dh), Math.cos(dh));
        const maxTurn = 2.5 * dt;
        p.heading += Math.max(-maxTurn, Math.min(maxTurn, dh));

        // real gait: double-frequency bob, hip sway, forward lean, limb swing
        const speedK = still ? 0 : Math.min(1, p.speed / 1.2);
        const sw = Math.sin(p.ph);
        p.g.position.set(cx, groundY + Math.abs(Math.sin(p.ph)) * 0.015 * speedK, cz);
        p.g.rotation.y = p.heading;
        p.g.rotation.z = sw * 0.025 * speedK + (still ? Math.sin(p.ph) * 0.03 : 0);
        p.torso.rotation.x = 0.06 * speedK;
        p.legL.rotation.x = sw * 0.5 * speedK;
        p.legR.rotation.x = -sw * 0.5 * speedK;
        p.armL.rotation.x = -sw * 0.35 * speedK;
        if (p.umbrella.visible) {
          p.armR.rotation.x = -2.55; // holding the umbrella pole overhead
        } else if (still) {
          p.armL.rotation.x = -1.55; // both hands on the phone
          p.armR.rotation.x = -1.35;
        } else {
          p.armR.rotation.x = sw * 0.35 * speedK;
        }
      }

      for (const c of cats) {
        if (!c.g.visible) continue;
        if (c.sitT > 0) {
          // sitting: haunches down, tail twitching, no travel
          c.sitT -= dt;
          c.g.scale.y = 0.85;
          if (c.sitT <= 0) c.walkT = rand(4, 12);
        } else {
          c.g.scale.y = 1;
          c.walkT -= dt;
          if (c.walkT <= 0) c.sitT = rand(0.5, 2);
          c.ang += c.dir * c.angSpeed * dt;
          if (c.ang > c.a1) {
            c.ang = c.a1;
            c.dir = -1;
          } else if (c.ang < c.a0) {
            c.ang = c.a0;
            c.dir = 1;
          }
          c.ph += dt * 11;
        }
        const [cx, cz] = posOf(c.ang, c.r);
        c.g.position.set(cx, groundY + Math.abs(Math.sin(c.ph)) * 0.02, cz);
        // cat model faces local +x, so aim +x along the walking tangent
        c.g.rotation.y = Math.atan2(-Math.cos(c.ang) * c.dir, Math.sin(c.ang) * c.dir);
      }

      let nearest = Infinity;
      for (const v of vehs) {
        if (!v.g.visible) continue;
        v.pos.addScaledVector(v.dir, v.speed * dt);
        if (Math.hypot(v.pos.x, v.pos.z) > 140) respawnVeh(v);
        v.g.position.set(
          v.pos.x,
          v.pos.y + Math.sin(t * 1.3 + v.seed) * 0.15,
          v.pos.z,
        );
        v.g.rotation.z = Math.sin(t * 0.9 + v.seed) * 0.04;
        if (v.police && v.strobes) {
          const blueOn = Math.sin(t * 8 + v.seed) > 0;
          v.strobes.blue.opacity = blueOn ? 0.95 : 0.1;
          v.strobes.red.opacity = blueOn ? 0.1 : 0.95;
        }
        const d = v.g.position.distanceTo(camera.position);
        if (d < nearest) nearest = d;
      }

      for (const d of drones) {
        if (!d.g.visible) continue;
        d.orb += d.orbSpd * dt;
        const [dx, dz] = posOf(d.orb, d.orbR);
        d.g.position.set(dx, d.baseY + Math.sin(t * 0.4 + d.seed) * 1.2, dz);
        d.g.rotation.y = t * 0.3;
        d.cone.rotation.x = Math.sin(t * 0.6 + d.seed) * 0.09;
        d.cone.rotation.z = Math.cos(t * 0.5 + d.seed) * 0.09;
        d.blink.opacity = Math.sin(t * 5 + d.seed) > 0.5 ? 0.9 : 0.15;
      }

      for (const hd of holos) {
        if (!hd.m.visible) continue;
        hd.m.position.y = hd.baseY + Math.sin(t * 0.5 + hd.seed) * 0.4;
        const flick =
          0.62 +
          0.18 * Math.sin(t * 2.2 + hd.seed) +
          (Math.sin(t * 13 + hd.seed * 7) > 0.96 ? -0.28 : 0);
        hd.mat.opacity = Math.min(0.85, Math.max(0.25, flick));
      }

      return nearest;
    },

    blips() {
      const out: RadarBlips = { peds: [], vehs: [], drones: [] };
      for (const p of peds) if (p.g.visible) out.peds.push([p.g.position.x, p.g.position.z]);
      for (const c of cats) if (c.g.visible) out.peds.push([c.g.position.x, c.g.position.z]);
      for (const v of vehs) if (v.g.visible) out.vehs.push([v.g.position.x, v.g.position.z]);
      for (const d of drones) if (d.g.visible) out.drones.push([d.g.position.x, d.g.position.z]);
      return out;
    },

    dispose() {
      for (const p of peds) scene.remove(p.g);
      for (const c of cats) scene.remove(c.g);
      for (const v of vehs) scene.remove(v.g);
      for (const d of drones) scene.remove(d.g);
      for (const hd of holos) {
        scene.remove(hd.m);
        if (hd.ownsMap && hd.mat.map) hd.mat.map.dispose();
      }
      disposables.forEach((d) => d.dispose());
    },
  };
}
