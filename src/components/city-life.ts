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

interface Ped {
  g: THREE.Group;
  umbrella: THREE.Group;
  accent: THREE.MeshBasicMaterial;
  feet: THREE.MeshBasicMaterial;
  r: number;
  a0: number;
  a1: number;
  ang: number;
  dir: 1 | -1;
  angSpeed: number;
  ph: number;
}

interface Veh {
  g: THREE.Group;
  accent: THREE.MeshBasicMaterial;
  glow: THREE.MeshBasicMaterial;
  dir: THREE.Vector3;
  pos: THREE.Vector3;
  speed: number;
  seed: number;
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

  const bodyGeo = track(new THREE.CapsuleGeometry(0.22, 0.95, 4, 8));
  const headGeo = track(new THREE.SphereGeometry(0.11, 8, 8));
  const canopyGeo = track(new THREE.ConeGeometry(0.55, 0.2, 10, 1, true));
  const rimGeo = track(new THREE.TorusGeometry(0.55, 0.014, 6, 20));
  const poleGeo = track(new THREE.CylinderGeometry(0.008, 0.008, 0.9, 5));
  const visorGeo = track(new THREE.BoxGeometry(0.16, 0.02, 0.02));
  const feetGeo = track(new THREE.PlaneGeometry(0.9, 0.9));
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
  const peds: Ped[] = [];
  for (let i = 0; i < PED_MAX; i++) {
    const g = new THREE.Group();
    const accent = additive(0x67e8f9, 0.9);
    const feet = additive(0x67e8f9, 0.3, glowTex);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.7;
    g.add(body);
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
    const feetGlow = new THREE.Mesh(feetGeo, feet);
    feetGlow.rotation.x = -Math.PI / 2;
    feetGlow.position.y = 0.02;
    g.add(feetGlow);
    g.visible = false;
    scene.add(g);
    peds.push({
      g, umbrella, accent, feet,
      r: 6, a0: 0, a1: Math.PI * 2, ang: 0, dir: 1, angSpeed: 0.1, ph: rand(0, 10),
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
    g.visible = false;
    scene.add(g);
    vehs.push({
      g, accent, glow,
      dir: new THREE.Vector3(0, 0, -1), pos: new THREE.Vector3(),
      speed: 10, seed: rand(0, 10),
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

  // contiguous free arcs at a radius, with wrap-around handling
  const findArcs = (clear: Float32Array, r: number): Arc[] => {
    const arcs: Arc[] = [];
    const minSpan = azBins * (20 / 360);
    let runStart = -1;
    for (let b = 0; b <= azBins * 2; b++) {
      const free = b < azBins * 2 && clear[b % azBins] > r + 1.4;
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
      for (const r of [4.2, 5.8, 7.6, 9.8]) arcs.push(...findArcs(clear, r));
      if (arcs.length === 0) {
        let best = 0;
        for (let b = 1; b < azBins; b++) if (clear[b] > clear[best]) best = b;
        const phi = (best / azBins) * Math.PI * 2;
        const r = Math.min(clear[best] * 0.55, 4);
        arcs.push({ r, a0: phi - 0.35, a1: phi + 0.35 });
      }
      const nPeds = Math.min(PED_MAX, lowPerf ? Math.ceil(cfg.peds / 2) : cfg.peds);
      peds.forEach((p, i) => {
        if (i >= nPeds) {
          p.g.visible = false;
          return;
        }
        const arc = arcs[i % arcs.length];
        p.r = arc.r;
        p.a0 = arc.a0 + 0.05;
        p.a1 = arc.a1 - 0.05;
        p.ang = rand(p.a0, Math.max(p.a0, p.a1));
        p.dir = Math.random() < 0.5 ? 1 : -1;
        p.angSpeed = rand(0.45, 0.95) / arc.r;
        p.umbrella.visible = Math.random() < 0.65;
        const accent = cfg.accents[i % 3];
        p.accent.color.setHex(accent);
        p.feet.color.setHex(accent);
        p.g.scale.setScalar(rand(0.9, 1.08));
        p.g.visible = true;
      });

      // sky vehicles
      const nVeh = Math.min(VEH_MAX, lowPerf ? Math.ceil(cfg.veh / 2) : cfg.veh);
      vehs.forEach((v, i) => {
        if (i >= nVeh) {
          v.g.visible = false;
          return;
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
        p.ang += p.dir * p.angSpeed * dt;
        if (p.ang > p.a1) {
          p.ang = p.a1;
          p.dir = -1;
        } else if (p.ang < p.a0) {
          p.ang = p.a0;
          p.dir = 1;
        }
        p.ph += dt * 5.2;
        const [px, pz] = posOf(p.ang, p.r);
        p.g.position.set(px, groundY + Math.abs(Math.sin(p.ph)) * 0.03, pz);
        p.g.rotation.y = Math.atan2(Math.sin(p.ang) * p.dir, Math.cos(p.ang) * p.dir);
        p.g.rotation.z = Math.sin(p.ph) * 0.02;
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
      for (const v of vehs) if (v.g.visible) out.vehs.push([v.g.position.x, v.g.position.z]);
      for (const d of drones) if (d.g.visible) out.drones.push([d.g.position.x, d.g.position.z]);
      return out;
    },

    dispose() {
      for (const p of peds) scene.remove(p.g);
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
