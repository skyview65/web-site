import * as THREE from "three";

export interface Atmosphere {
  update(dt: number, t: number, camera: THREE.Camera, playing: boolean): void;
  setWind(w: [number, number]): void;
  setAccent(hex: number): void;
  dispose(): void;
}

const rand = (a: number, b: number): number => a + Math.random() * (b - a);

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

interface Ripple {
  mesh: THREE.Mesh;
  mat: THREE.MeshBasicMaterial;
  life: number;
}

export function createAtmosphere(
  scene: THREE.Scene,
  opts: { lowPerf: boolean; reduced: boolean; groundY: number },
): Atmosphere {
  const wind: [number, number] = [0, 0];

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

  let rippleIdx = 0;
  let spawnIn = rand(0.1, 0.28);

  return {
    update(dt: number, _t: number, camera: THREE.Camera, playing: boolean): void {
      if (motePos && moteAttr) {
        for (let i = 0; i < moteCount; i++) {
          let x = motePos[i * 3] + wind[0] * dt;
          let y = motePos[i * 3 + 1] + 0.14 * dt;
          let z = motePos[i * 3 + 2] + wind[1] * dt;
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
            spawnIn = rand(0.1, 0.28);
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
          r.mat.opacity = 0.38 * (1 - k);
        }
      }
    },
    setWind(w: [number, number]): void {
      wind[0] = w[0];
      wind[1] = w[1];
    },
    setAccent(hex: number): void {
      if (moteMat) moteMat.color.setHex(hex);
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
  dispose(): void;
}

export function attachCityAudio(ctx: AudioContext, master: GainNode): CityAudio {
  const noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

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
    osc.start(t0);
    osc.stop(t0 + 3.25);
    liveSirens.add(osc);
    osc.onended = () => {
      liveSirens.delete(osc);
      try {
        osc.disconnect();
        g.disconnect();
        tail.disconnect();
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
    for (const osc of liveSirens) {
      try {
        osc.stop();
      } catch {
        // already stopped
      }
    }
    liveSirens.clear();
    for (const node of [rainSrc, rainHp, rainGain, vehSrc, vehLp, vehGain]) {
      try {
        node.disconnect();
      } catch {
        // already disconnected
      }
    }
  };

  return { vehGain, siren, dispose };
}
