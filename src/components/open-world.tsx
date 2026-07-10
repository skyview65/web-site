"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { asset } from "@/lib/asset";
import type { CharacterCopy, Dictionary } from "@/lib/i18n/dictionary";
import { createCityLife, type DistrictCfg } from "./city-life";
import {
  attachCityAudio,
  createAtmosphere,
  drawRadar,
  type CityAudio,
} from "./city-atmosphere";

/**
 * LUMENFALL — first-person walk INSIDE the real photoreal city. Each district
 * is one of the AI-generated 360° panoramas turned into navigable 3D: a depth
 * map (estimated per panorama) displaces the photo onto a real surface, so the
 * near street/rail and the far skyline sit at their true distances and
 * parallax correctly as you move — you are literally inside that image, not
 * looking at boxes in front of it. A full-panorama background dome fills any
 * disocclusion. Walk with WASD, look with the mouse (pointer-lock) or by
 * dragging on touch; walk into the far edge — or press ◄ ► / Q·E — to cross to
 * the next district. Rain, a cinematic grade and per-district labels complete
 * the mood. No objectives, no chase: a pure free-exploration demo.
 */

type Phase = "idle" | "playing";
type CharId = "mara" | "kaan" | "solene";

// Each protagonist you can embody — colour tints the HUD, and gives a subtle
// pace difference (Solène strides, Kaan is heavier).
const PILOTS: Record<CharId, { color: number; walk: number; sprint: number }> = {
  mara: { color: 0x67e8f9, walk: 2.6, sprint: 4.8 },
  kaan: { color: 0xfcd34d, walk: 2.3, sprint: 4.2 },
  solene: { color: 0xf0abfc, walk: 3.0, sprint: 5.4 },
};

const CHAR_ACCENT: Record<CharId, { on: string; text: string }> = {
  mara: { on: "border-neon-cyan bg-neon-cyan/10", text: "text-neon-cyan" },
  kaan: { on: "border-neon-amber bg-neon-amber/10", text: "text-neon-amber" },
  solene: { on: "border-neon-magenta bg-neon-magenta/10", text: "text-neon-magenta" },
};

// Parallel arrays: clean photoreal panorama, its estimated depth map, label.
// One entry per district; textures + depth are generated from the watermark-
// free 360 panoramas.
const SKYBOXES = Array.from({ length: 11 }, (_, i) => `/images/city-${String(i + 1).padStart(2, "0")}.webp`);
const DEPTHS = Array.from({ length: 11 }, (_, i) => `/images/city-${String(i + 1).padStart(2, "0")}-d.png`);
const DISTRICTS = [
  "MERKEZ", "BULVAR", "EĞLENCE BÖLGESİ", "ARA SOKAK", "PANOPT BÖLGESİ",
  "KANAL KIYISI", "NEON TÜNEL", "GÖK KÖPRÜSÜ", "LİMAN", "TAPINAK", "ZİRVE",
];

// Per-district life profile: neon accent palette, how many pedestrians /
// sky-vehicles / patrol drones / holo billboards populate it, and the drift
// direction of the floating neon motes. Interiors (tunnel, alley) get no sky
// traffic; rooftops get heavy lanes. Values are hand-tuned per panorama.
const CITY_CFG: DistrictCfg[] = [
  { accents: [0x67e8f9, 0x8fb8ff, 0xf0abfc], peds: 7, veh: 10, drones: 1, holos: 3, wind: [0.10, 0.04] },   // MERKEZ
  { accents: [0xfcd34d, 0xff9a5a, 0x67e8f9], peds: 14, veh: 4, drones: 0, holos: 2, wind: [0.06, -0.05] },  // BULVAR
  { accents: [0xf0abfc, 0x67e8f9, 0xff5ea8], peds: 14, veh: 8, drones: 1, holos: 3, wind: [-0.08, 0.05] },  // EĞLENCE
  { accents: [0xff5ea8, 0x67e8f9, 0xfcd34d], peds: 6, veh: 0, drones: 1, holos: 1, wind: [0.04, 0.08] },    // ARA SOKAK
  { accents: [0xf0abfc, 0x67e8f9, 0xff2b4e], peds: 5, veh: 2, drones: 2, holos: 1, wind: [-0.05, -0.06] },  // PANOPT
  { accents: [0xf0abfc, 0x2dd4bf, 0xfcd34d], peds: 8, veh: 4, drones: 1, holos: 2, wind: [0.09, 0.02] },    // KANAL
  { accents: [0xf0abfc, 0x67e8f9, 0xa3e635], peds: 4, veh: 0, drones: 1, holos: 0, wind: [0.00, 0.12] },    // TÜNEL
  { accents: [0xff2b4e, 0x67e8f9, 0xfcd34d], peds: 4, veh: 12, drones: 2, holos: 3, wind: [0.14, 0.06] },   // GÖK KÖPRÜSÜ
  { accents: [0x2dd4bf, 0xff9a5a, 0xf0abfc], peds: 5, veh: 6, drones: 1, holos: 2, wind: [-0.11, 0.03] },   // LİMAN
  { accents: [0x2dd4bf, 0xfcd34d, 0xff9a5a], peds: 8, veh: 2, drones: 0, holos: 1, wind: [0.03, -0.07] },   // TAPINAK
  { accents: [0x67e8f9, 0xff2b4e, 0xf0abfc], peds: 3, veh: 12, drones: 2, holos: 3, wind: [0.16, 0.09] },   // ZİRVE
];
const GROUND_Y = -1.62; // street level relative to the capture eye height

export function OpenWorld({
  game,
  characters,
  backHref,
}: {
  game: Dictionary["game"];
  characters: CharacterCopy[];
  backHref: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<{
    start: () => void;
    setChar: (c: CharId) => void;
    go: (d: number) => void;
  } | null>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const [webgl, setWebgl] = useState(true);
  const [charId, setCharId] = useState<CharId>("mara");
  const [muted, setMuted] = useState(false);
  const charRef = useRef<CharId>("mara");
  const mutedRef = useRef(false);
  const audioApiRef = useRef<{ setMuted: (m: boolean) => void } | null>(null);
  const joyRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const sprintRef = useRef<HTMLButtonElement>(null);
  const miniRef = useRef<HTMLCanvasElement>(null);
  const [touch, setTouch] = useState(false);
  const [district, setDistrict] = useState(DISTRICTS[0]);

  const selectChar = useCallback((id: CharId) => {
    charRef.current = id;
    setCharId(id);
    apiRef.current?.setChar(id);
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      mutedRef.current = next;
      audioApiRef.current?.setMuted(next);
      return next;
    });
  }, []);

  useEffect(() => {
    const needsTouch =
      typeof window !== "undefined" &&
      (window.matchMedia?.("(pointer: coarse)").matches ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (needsTouch) setTouch(true);
  }, []);

  const start = useCallback(() => {
    apiRef.current?.start();
    setPhase("playing");
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    const wrap = wrapRef.current;
    if (!mount || !wrap) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowPerf =
      reduced ||
      (typeof window !== "undefined" &&
        Math.min(window.innerWidth, window.innerHeight) < 760);
    const coarsePointer =
      typeof window !== "undefined" &&
      (window.matchMedia?.("(pointer: coarse)").matches ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0);
    const desktopLook = !coarsePointer;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    } catch {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWebgl(false);
      return;
    }
    if (!renderer.getContext()) {
      setWebgl(false);
      return;
    }

    const sizeOf = () => {
      const cw = wrap.clientWidth;
      const ch = Math.max(320, Math.min(cw * (9 / 16), window.innerHeight - 210));
      return { w: cw, h: ch };
    };
    let { w, h } = sizeOf();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPerf ? 1.4 : 2));
    renderer.setSize(w, h);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "none";

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05030b);
    const camera = new THREE.PerspectiveCamera(80, w / h, 0.05, 2000);

    // --- depth-displaced panorama --------------------------------------------
    // Radial displacement: near pixels (depth≈1) sit close to the eye, far
    // pixels (depth≈0) are pushed out to the skyline radius. A unit photosphere
    // gives correct equirect UVs; we clone its dirs and re-radius each vertex.
    const R_NEAR = 5.5;
    const R_FAR = 260;
    const GAMMA = 1.25;
    const CULL = 0.12; // drop triangles spanning a big depth jump → clean edges
    const BUBBLE = 3.0; // how far you can walk from the capture point
    const SEG_X = lowPerf ? 320 : 560;
    const SEG_Y = SEG_X / 2;
    const radiusOf = (d: number) => R_NEAR + (R_FAR - R_NEAR) * Math.pow(1 - d, GAMMA);

    const base = new THREE.SphereGeometry(1, SEG_X, SEG_Y);
    const basePos = base.attributes.position.array as Float32Array;
    const baseUv = base.attributes.uv.array as Float32Array;
    const baseIdx = base.index!.array as Uint32Array | Uint16Array;
    const vertCount = basePos.length / 3;

    const depthCanvas = document.createElement("canvas");
    const depthCtx = depthCanvas.getContext("2d", { willReadFrequently: true });

    const buildGeometry = (dData: Uint8ClampedArray, DW: number, DH: number) => {
      const positions = new Float32Array(basePos.length);
      const vDepth = new Float32Array(vertCount);
      for (let i = 0; i < vertCount; i++) {
        const x = basePos[i * 3], y = basePos[i * 3 + 1], z = basePos[i * 3 + 2];
        const u = baseUv[i * 2], v = baseUv[i * 2 + 1];
        // texture uv (0,0)=bottom-left; canvas (0,0)=top-left → flip v
        const px = Math.min(DW - 1, Math.max(0, Math.round(u * (DW - 1))));
        const py = Math.min(DH - 1, Math.max(0, Math.round((1 - v) * (DH - 1))));
        const d = dData[(py * DW + px) * 4] / 255;
        vDepth[i] = d;
        const r = radiusOf(d);
        positions[i * 3] = x * r;
        positions[i * 3 + 1] = y * r;
        positions[i * 3 + 2] = z * r;
      }
      const newIdx: number[] = [];
      for (let t = 0; t < baseIdx.length; t += 3) {
        const a = baseIdx[t], b = baseIdx[t + 1], c = baseIdx[t + 2];
        const mn = Math.min(vDepth[a], vDepth[b], vDepth[c]);
        const mx = Math.max(vDepth[a], vDepth[b], vDepth[c]);
        if (mx - mn < CULL) newIdx.push(a, b, c);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      g.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(baseUv), 2));
      g.setIndex(newIdx);
      return g;
    };

    // Street clearance per azimuth: how far the photo's nearest surface sits in
    // each direction around the eye (min radius over a near-horizon band). NPCs
    // are only placed inside genuinely open space, so nobody spawns inside a
    // wall or behind a railing. skyR is the same probe at +12° elevation, used
    // to hang holo billboards in front of open sky, not through a facade.
    const AZ_BINS = 128;
    const computeClearance = (dData: Uint8ClampedArray, DW: number, DH: number) => {
      const clear = new Float32Array(AZ_BINS);
      const skyR = new Float32Array(AZ_BINS);
      const rows = [-0.1, -0.05, 0, 0.05, 0.1].map((e) =>
        Math.min(DH - 1, Math.max(0, Math.round((0.5 - e / Math.PI) * (DH - 1)))),
      );
      const rowSky = Math.min(DH - 1, Math.max(0, Math.round((0.5 - 0.21 / Math.PI) * (DH - 1))));
      for (let b = 0; b < AZ_BINS; b++) {
        const px = Math.round((b / AZ_BINS) * (DW - 1));
        let mn = 60;
        for (const py of rows) mn = Math.min(mn, radiusOf(dData[(py * DW + px) * 4] / 255));
        clear[b] = mn;
        skyR[b] = radiusOf(dData[(rowSky * DW + px) * 4] / 255);
      }
      return { clear, skyR };
    };

    // foreground displaced shell + background full-panorama dome (fills holes)
    const fgMat = new THREE.MeshBasicMaterial({ side: THREE.BackSide, toneMapped: true });
    const fgMesh = new THREE.Mesh(new THREE.BufferGeometry(), fgMat);
    fgMesh.frustumCulled = false;
    scene.add(fgMesh);
    const bgMat = new THREE.MeshBasicMaterial({ side: THREE.BackSide, toneMapped: true });
    const bgMesh = new THREE.Mesh(new THREE.SphereGeometry(R_FAR * 1.04, 96, 48), bgMat);
    scene.add(bgMesh);

    // ambient life + atmosphere pools (seeded per district from its depth map)
    const city = createCityLife(scene, { lowPerf, reduced, groundY: GROUND_Y, azBins: AZ_BINS });
    const atmo = createAtmosphere(scene, { lowPerf, reduced, groundY: GROUND_Y });
    const mini = miniRef.current;
    const mctx = mini ? mini.getContext("2d") : null;

    const texLoader = new THREE.TextureLoader();
    const loadTex = (src: string) =>
      new Promise<THREE.Texture>((res, rej) => {
        texLoader.load(
          asset(src),
          (t) => {
            t.colorSpace = THREE.SRGBColorSpace;
            t.anisotropy = renderer.capabilities.getMaxAnisotropy();
            res(t);
          },
          undefined,
          rej,
        );
      });
    const loadDepth = (src: string) =>
      new Promise<{ data: Uint8ClampedArray; w: number; h: number }>((res, rej) => {
        const img = new Image();
        img.onload = () => {
          if (!depthCtx) return rej(new Error("no ctx"));
          depthCanvas.width = img.width;
          depthCanvas.height = img.height;
          depthCtx.drawImage(img, 0, 0);
          const d = depthCtx.getImageData(0, 0, img.width, img.height).data;
          res({ data: d, w: img.width, h: img.height });
        };
        img.onerror = rej;
        img.src = asset(src);
      });

    interface Pack {
      idx: number;
      tex: THREE.Texture;
      geo: THREE.BufferGeometry;
      clear: Float32Array;
      skyR: Float32Array;
    }
    const loadDistrict = (idx: number): Promise<Pack> =>
      Promise.all([loadTex(SKYBOXES[idx]), loadDepth(DEPTHS[idx])]).then(([tex, dep]) => ({
        idx,
        tex,
        geo: buildGeometry(dep.data, dep.w, dep.h),
        ...computeClearance(dep.data, dep.w, dep.h),
      }));

    let curTex: THREE.Texture | null = null;
    const swapTo = (pack: Pack) => {
      const oldGeo = fgMesh.geometry;
      fgMesh.geometry = pack.geo;
      if (oldGeo) oldGeo.dispose();
      const oldTex = curTex;
      curTex = pack.tex;
      fgMat.map = pack.tex;
      bgMat.map = pack.tex;
      fgMat.needsUpdate = true;
      bgMat.needsUpdate = true;
      if (oldTex && oldTex !== pack.tex) oldTex.dispose();
      st.idx = pack.idx;
      st.x = 0;
      st.z = 0;
      st.yaw = 0;
      st.pitch = 0;
      st.edge = 0;
      const cfg = CITY_CFG[pack.idx] ?? CITY_CFG[0];
      city.seed(pack.idx, cfg, pack.clear, pack.skyR, DISTRICTS[pack.idx] ?? "");
      atmo.setWind(cfg.wind);
      atmo.setAccent(cfg.accents[0]);
      setDistrict(DISTRICTS[pack.idx] ?? "");
    };

    // rain around the eye
    const RAIN_N = reduced ? 0 : lowPerf ? 420 : 900;
    const RAIN_SPREAD = 9;
    const RAIN_TOP = 11;
    const RAIN_LEN = 0.28;
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const rainPos = new Float32Array(RAIN_N * 2 * 3);
    for (let i = 0; i < RAIN_N; i++) {
      const x = rand(-RAIN_SPREAD, RAIN_SPREAD);
      const z = rand(-RAIN_SPREAD, RAIN_SPREAD);
      const y = rand(-RAIN_TOP, RAIN_TOP);
      rainPos[i * 6] = x; rainPos[i * 6 + 1] = y; rainPos[i * 6 + 2] = z;
      rainPos[i * 6 + 3] = x; rainPos[i * 6 + 4] = y - RAIN_LEN; rainPos[i * 6 + 5] = z;
    }
    const rainGeo = new THREE.BufferGeometry();
    rainGeo.setAttribute("position", new THREE.BufferAttribute(rainPos, 3));
    const rain = new THREE.LineSegments(
      rainGeo,
      new THREE.LineBasicMaterial({ color: 0xbcd4ff, transparent: true, opacity: 0.28 }),
    );
    rain.frustumCulled = false;
    if (RAIN_N > 0) scene.add(rain);

    // Post: gentle bloom for the neon + a light cinematic grade (vignette,
    // faint grain, subtle aberration). The photo is already graded, so keep it
    // restrained — no crushing of the city lights.
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(w, h), reduced ? 0.22 : 0.32, 0.7, 0.72);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
    const gradePass = new ShaderPass({
      uniforms: {
        tDiffuse: { value: null },
        uTime: { value: 0 },
        uGrain: { value: reduced ? 0.0 : 0.035 },
        uAberration: { value: 0.0016 },
        uVignette: { value: 1.1 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float uTime, uGrain, uAberration, uVignette;
        varying vec2 vUv;
        float rnd(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
        void main() {
          vec2 dir = vUv - 0.5;
          float ca = uAberration * dot(dir, dir) * 4.0;
          vec3 col;
          col.r = texture2D(tDiffuse, vUv + dir * ca).r;
          col.g = texture2D(tDiffuse, vUv).g;
          col.b = texture2D(tDiffuse, vUv - dir * ca).b;
          float vig = smoothstep(0.95, 0.32, length(dir) * uVignette);
          col *= mix(0.62, 1.0, vig);
          float g1 = rnd(vUv * vec2(1920.0, 1080.0) + uTime);
          float g2 = rnd(vUv * vec2(1920.0, 1080.0) - uTime * 1.3);
          col += (g1 - 0.5) * uGrain;
          col += (g1 - g2) / 255.0;
          gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
        }`,
    });
    composer.addPass(gradePass);

    // ---- audio: city hum + rain bed + traffic whoosh + footsteps + sirens ----
    type AudioBox = { ctx: AudioContext; master: GainNode; ambGain: GainNode; ambOsc: OscillatorNode };
    let audio: AudioBox | null = null;
    let cityAudio: CityAudio | null = null;
    const ensureAudio = () => {
      if (audio) return;
      try {
        const Ctx =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctx) return;
        const ctx = new Ctx();
        const master = ctx.createGain();
        master.gain.value = mutedRef.current ? 0 : 0.5;
        master.connect(ctx.destination);
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 320;
        const ambGain = ctx.createGain();
        ambGain.gain.value = 0;
        const ambOsc = ctx.createOscillator();
        ambOsc.type = "sawtooth";
        ambOsc.frequency.value = 42;
        ambOsc.connect(filter);
        filter.connect(ambGain);
        ambGain.connect(master);
        ambOsc.start();
        audio = { ctx, master, ambGain, ambOsc };
        cityAudio = attachCityAudio(ctx, master);
      } catch {
        audio = null;
      }
    };
    const footstep = () => {
      if (!audio || mutedRef.current) return;
      const { ctx, master } = audio;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(116, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(52, ctx.currentTime + 0.09);
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.1, ctx.currentTime + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.16);
      o.connect(g);
      g.connect(master);
      o.start();
      o.stop(ctx.currentTime + 0.18);
    };
    const whoosh = () => {
      if (!audio || mutedRef.current) return;
      const { ctx, master } = audio;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(320, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.4);
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
      o.connect(g);
      g.connect(master);
      o.start();
      o.stop(ctx.currentTime + 0.52);
    };
    audioApiRef.current = {
      setMuted: (m: boolean) => {
        if (audio) audio.master.gain.value = m ? 0 : 0.5;
      },
    };

    // ---- state ----
    const st = {
      phase: "idle" as Phase,
      idx: 0,
      x: 0,
      z: 0,
      yaw: 0,
      pitch: 0,
      walk: PILOTS.mara.walk,
      sprint: PILOTS.mara.sprint,
      keys: new Set<string>(),
      last: 0,
      t: 0,
      bob: 0,
      moveAmt: 0,
      step: 0,
      edge: 0, // how long you've pushed into the far edge (auto-advance)
      sirenT: 14, // countdown to the next distant siren
      whoosh: 0, // smoothed traffic-proximity loudness
      // transition
      busy: false,
      fade: 0,
      fadeDir: 0 as -1 | 0 | 1,
      pending: null as null | Pack,
    };
    const setOverlay = (a: number) => {
      if (fadeRef.current) fadeRef.current.style.opacity = String(a);
    };

    const applyChar = (c: CharId) => {
      const p = PILOTS[c];
      st.walk = p.walk;
      st.sprint = p.sprint;
    };

    const go = (delta: number) => {
      if (st.busy) return;
      const target = ((st.idx + delta) % SKYBOXES.length + SKYBOXES.length) % SKYBOXES.length;
      st.busy = true;
      st.fadeDir = -1;
      whoosh();
      loadDistrict(target)
        .then((pack) => { st.pending = pack; })
        .catch(() => { st.busy = false; st.fadeDir = st.fade > 0 ? 1 : 0; });
    };

    const doStart = () => {
      st.phase = "playing";
      st.keys.clear();
      st.x = 0; st.z = 0; st.yaw = 0; st.pitch = 0;
      st.moveAmt = 0; st.step = 0; st.edge = 0;
      applyChar(charRef.current);
      ensureAudio();
      if (audio) {
        void audio.ctx.resume?.();
        audio.ambGain.gain.value = mutedRef.current ? 0 : 0.05;
      }
      if (desktopLook) renderer.domElement.requestPointerLock?.();
    };
    apiRef.current = {
      start: doStart,
      setChar: (c) => applyChar(c),
      go: (d) => go(d),
    };

    // first district (a random one per session for variety)
    st.idx = Math.floor(Math.random() * SKYBOXES.length);
    setDistrict(DISTRICTS[st.idx] ?? "");
    setOverlay(1);
    loadDistrict(st.idx).then((pack) => {
      swapTo(pack);
      setOverlay(0);
    });

    let raf = 0;
    const frame = (ts: number) => {
      if (!st.last) st.last = ts;
      const dt = Math.min(0.05, (ts - st.last) / 1000);
      st.last = ts;
      st.t += dt;

      // look basis
      const fX = Math.sin(st.yaw);
      const fZ = -Math.cos(st.yaw);
      const rX = Math.cos(st.yaw);
      const rZ = Math.sin(st.yaw);

      if (st.phase === "playing" && !st.busy) {
        const k = st.keys;
        const sprinting = k.has("sprint");
        const spd = sprinting ? st.sprint : st.walk;
        const fwd = (k.has("fwd") ? 1 : 0) - (k.has("back") ? 1 : 0);
        const strafe = (k.has("strafeR") ? 1 : 0) - (k.has("strafeL") ? 1 : 0);
        let mx = fX * fwd + rX * strafe;
        let mz = fZ * fwd + rZ * strafe;
        const mlen = Math.hypot(mx, mz);
        const moving = mlen > 0.0001;
        if (moving) {
          mx /= mlen; mz /= mlen;
          const dist = spd * dt;
          st.x += mx * dist;
          st.z += mz * dist;
          st.step += dist;
          if (st.step > (sprinting ? 0.62 : 0.82)) { st.step = 0; footstep(); }
        }
        st.moveAmt += ((moving ? 1 : 0) - st.moveAmt) * Math.min(1, dt * 10);

        // stay inside the good-parallax bubble; holding forward against the far
        // edge crosses to the next district (walk through the city).
        const r = Math.hypot(st.x, st.z);
        if (r > BUBBLE) {
          st.x *= BUBBLE / r;
          st.z *= BUBBLE / r;
          // pushing outward?
          if (moving && (mx * st.x + mz * st.z) > 0) {
            st.edge += dt;
            if (st.edge > 0.5) { st.edge = 0; go(1); }
          } else {
            st.edge = Math.max(0, st.edge - dt * 2);
          }
        } else {
          st.edge = Math.max(0, st.edge - dt * 2);
        }

        if (audio && !mutedRef.current)
          audio.ambGain.gain.value = 0.045 + st.moveAmt * 0.03;
        st.bob += dt * (sprinting ? 15 : 10) * st.moveAmt;
      }

      // transition fades
      if (st.fadeDir < 0) {
        st.fade = Math.min(1, st.fade + dt / 0.32);
        setOverlay(st.fade);
        if (st.fade >= 1 && st.pending) {
          swapTo(st.pending);
          st.pending = null;
          st.fadeDir = 1;
        }
      } else if (st.fadeDir > 0) {
        st.fade = Math.max(0, st.fade - dt / 0.4);
        setOverlay(st.fade);
        if (st.fade <= 0) { st.fadeDir = 0; st.busy = false; }
      }

      // first-person camera at the capture point + walk bob + idle breathing
      const idle = 1 - st.moveAmt;
      const bobY =
        Math.sin(st.bob * 2) * 0.045 * st.moveAmt + Math.sin(st.t * 1.05) * 0.008 * idle;
      const bobX =
        Math.cos(st.bob) * 0.035 * st.moveAmt + Math.sin(st.t * 0.7) * 0.004 * idle;
      const cx = st.x + rX * bobX;
      const cz = st.z + rZ * bobX;
      camera.position.set(cx, bobY, cz);
      const cp = Math.cos(st.pitch);
      camera.lookAt(cx + Math.sin(st.yaw) * cp, bobY + Math.sin(st.pitch), cz - Math.cos(st.yaw) * cp);

      // ambient life: pedestrians, sky traffic, drones, holos, motes, ripples
      const nearestVeh = city.update(dt, st.t, camera);
      atmo.update(dt, st.t, camera, st.phase === "playing");
      if (cityAudio && !mutedRef.current) {
        // traffic bed swells as a vehicle passes close overhead
        const target = Math.max(0, (30 - nearestVeh) / 30) * 0.05;
        st.whoosh += (target - st.whoosh) * Math.min(1, dt * 3);
        cityAudio.vehGain.gain.value = st.whoosh;
      }
      if (st.phase === "playing") {
        st.sirenT -= dt;
        if (st.sirenT <= 0) {
          st.sirenT = rand(16, 40);
          if (!mutedRef.current) cityAudio?.siren();
        }
      }

      // neon radar (heading-up)
      if (mini && mctx && st.phase === "playing") {
        drawRadar(mctx, mini.width, st.yaw, st.t, st.x, st.z, city.blips());
      }

      // rain falls around the eye
      if (RAIN_N > 0) {
        const arr = rainGeo.attributes.position.array as Float32Array;
        const fall = 9 * dt;
        for (let i = 0; i < RAIN_N; i++) {
          const b = i * 6;
          let y = arr[b + 1] - fall;
          if (y < camera.position.y - RAIN_TOP) {
            const nx = camera.position.x + rand(-RAIN_SPREAD, RAIN_SPREAD);
            const nz = camera.position.z + rand(-RAIN_SPREAD, RAIN_SPREAD);
            y = camera.position.y + RAIN_TOP;
            arr[b] = nx; arr[b + 2] = nz; arr[b + 3] = nx; arr[b + 5] = nz;
          }
          arr[b + 1] = y;
          arr[b + 4] = y - RAIN_LEN;
        }
        rainGeo.attributes.position.needsUpdate = true;
      }

      gradePass.uniforms.uTime.value = st.t * 55;
      composer.render();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    // input — WASD/arrows walk + strafe, Shift sprint, Q/E change district
    const map: Record<string, string> = {
      KeyW: "fwd", ArrowUp: "fwd",
      KeyS: "back", ArrowDown: "back",
      KeyA: "strafeL", ArrowLeft: "strafeL",
      KeyD: "strafeR", ArrowRight: "strafeR",
      ShiftLeft: "sprint", ShiftRight: "sprint",
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.code === "Enter" || e.code === "Space") && st.phase !== "playing") {
        start();
        e.preventDefault();
        return;
      }
      if (st.phase === "playing" && e.code === "KeyQ") { go(-1); e.preventDefault(); return; }
      if (st.phase === "playing" && e.code === "KeyE") { go(1); e.preventDefault(); return; }
      const m = map[e.code];
      if (m) { st.keys.add(m); e.preventDefault(); }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const m = map[e.code];
      if (m) st.keys.delete(m);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    // desktop mouse-look via Pointer Lock
    const canvasEl = renderer.domElement;
    const PITCH_LIMIT = 1.2;
    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== canvasEl) return;
      st.yaw += e.movementX * 0.0022;
      st.pitch -= e.movementY * 0.0022;
      st.pitch = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, st.pitch));
    };
    const onCanvasClick = () => {
      if (desktopLook && st.phase === "playing") canvasEl.requestPointerLock?.();
    };
    if (desktopLook) {
      document.addEventListener("mousemove", onMouseMove);
      canvasEl.addEventListener("click", onCanvasClick);
    }

    // touch look: dragging on the canvas turns the view (joystick captures its own)
    let lookId: number | null = null;
    let lookX = 0, lookY = 0;
    const onLookDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" || st.phase !== "playing" || lookId !== null) return;
      lookId = e.pointerId; lookX = e.clientX; lookY = e.clientY;
    };
    const onLookMove = (e: PointerEvent) => {
      if (e.pointerId !== lookId) return;
      st.yaw += (e.clientX - lookX) * 0.005;
      st.pitch -= (e.clientY - lookY) * 0.005;
      st.pitch = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, st.pitch));
      lookX = e.clientX; lookY = e.clientY;
      e.preventDefault();
    };
    const onLookUp = (e: PointerEvent) => { if (e.pointerId === lookId) lookId = null; };
    if (!desktopLook) {
      canvasEl.addEventListener("pointerdown", onLookDown);
      canvasEl.addEventListener("pointermove", onLookMove);
      canvasEl.addEventListener("pointerup", onLookUp);
      canvasEl.addEventListener("pointercancel", onLookUp);
    }

    // touch joystick (walk + strafe) + sprint hold
    const touchCleanup: Array<() => void> = [];
    const joy = joyRef.current;
    const knob = knobRef.current;
    if (joy && knob) {
      let joyId: number | null = null;
      const clearMove = () => {
        st.keys.delete("strafeL"); st.keys.delete("strafeR");
        st.keys.delete("fwd"); st.keys.delete("back");
      };
      const moveTo = (clientX: number, clientY: number) => {
        const rct = joy.getBoundingClientRect();
        const max = rct.width / 2;
        let dx = clientX - (rct.left + max);
        let dy = clientY - (rct.top + rct.height / 2);
        const d = Math.hypot(dx, dy) || 1;
        if (d > max) { dx = (dx / d) * max; dy = (dy / d) * max; }
        knob.style.transform = `translate(${dx}px, ${dy}px)`;
        const nx = dx / max, ny = dy / max;
        clearMove();
        if (nx < -0.32) st.keys.add("strafeL");
        else if (nx > 0.32) st.keys.add("strafeR");
        if (ny < -0.32) st.keys.add("fwd");
        else if (ny > 0.32) st.keys.add("back");
      };
      const onDown = (e: PointerEvent) => { joyId = e.pointerId; joy.setPointerCapture(e.pointerId); moveTo(e.clientX, e.clientY); e.preventDefault(); };
      const onMove = (e: PointerEvent) => { if (joyId === null || e.pointerId !== joyId) return; moveTo(e.clientX, e.clientY); e.preventDefault(); };
      const onUp = (e: PointerEvent) => { if (joyId !== null && e.pointerId !== joyId) return; joyId = null; knob.style.transform = ""; clearMove(); };
      joy.addEventListener("pointerdown", onDown);
      joy.addEventListener("pointermove", onMove);
      joy.addEventListener("pointerup", onUp);
      joy.addEventListener("pointercancel", onUp);
      touchCleanup.push(() => {
        joy.removeEventListener("pointerdown", onDown);
        joy.removeEventListener("pointermove", onMove);
        joy.removeEventListener("pointerup", onUp);
        joy.removeEventListener("pointercancel", onUp);
      });
    }
    const sprintBtn = sprintRef.current;
    if (sprintBtn) {
      const d = (e: PointerEvent) => { st.keys.add("sprint"); e.preventDefault(); };
      const u = () => st.keys.delete("sprint");
      sprintBtn.addEventListener("pointerdown", d);
      sprintBtn.addEventListener("pointerup", u);
      sprintBtn.addEventListener("pointerleave", u);
      sprintBtn.addEventListener("pointercancel", u);
      touchCleanup.push(() => {
        sprintBtn.removeEventListener("pointerdown", d);
        sprintBtn.removeEventListener("pointerup", u);
        sprintBtn.removeEventListener("pointerleave", u);
        sprintBtn.removeEventListener("pointercancel", u);
      });
    }

    const onResize = () => {
      ({ w, h } = sizeOf());
      renderer.setSize(w, h);
      composer.setSize(w, h);
      bloom.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(wrap);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      if (desktopLook) {
        document.removeEventListener("mousemove", onMouseMove);
        canvasEl.removeEventListener("click", onCanvasClick);
        if (document.pointerLockElement === canvasEl) document.exitPointerLock?.();
      } else {
        canvasEl.removeEventListener("pointerdown", onLookDown);
        canvasEl.removeEventListener("pointermove", onLookMove);
        canvasEl.removeEventListener("pointerup", onLookUp);
        canvasEl.removeEventListener("pointercancel", onLookUp);
      }
      touchCleanup.forEach((fn) => fn());
      city.dispose();
      atmo.dispose();
      cityAudio?.dispose();
      composer.dispose();
      renderer.dispose();
      base.dispose();
      if (curTex) curTex.dispose();
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh & {
          geometry?: THREE.BufferGeometry;
          material?: THREE.Material | THREE.Material[];
        };
        mesh.geometry?.dispose?.();
        const mat = mesh.material;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat?.dispose?.();
      });
      if (audio) {
        try { audio.ambOsc.stop(); void audio.ctx.close(); } catch { /* closed */ }
      }
      if (renderer.domElement.parentNode)
        renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, [start]);

  return (
    <div className="relative w-full">
      <div
        ref={wrapRef}
        className="relative w-full overflow-hidden rounded-xl border border-line bg-void"
      >
        <div ref={mountRef} className="block w-full" style={{ minHeight: 320 }} />

        {/* district cross-fade overlay */}
        <div
          ref={fadeRef}
          className="pointer-events-none absolute inset-0 z-30 bg-void"
          style={{ opacity: 1, transition: "opacity 60ms linear" }}
        />

        {/* neon radar (heading-up) */}
        <canvas
          ref={miniRef}
          width={140}
          height={140}
          className={`absolute end-3 top-3 z-10 h-[96px] w-[96px] rounded-full border border-neon-cyan/30 shadow-[0_0_20px_oklch(0.82_0.13_205/25%)] md:h-[124px] md:w-[124px] ${
            webgl && phase === "playing" ? "block" : "hidden"
          }`}
        />

        {/* touch controls (shown on touch devices while playing) */}
        <div
          className={`absolute inset-0 z-20 select-none ${
            webgl && touch && phase === "playing" ? "" : "hidden"
          }`}
          style={{ pointerEvents: "none" }}
        >
          <div
            ref={joyRef}
            aria-label="yürü ve yönel"
            className="absolute bottom-4 left-4 size-28 rounded-full border border-neon-cyan/40 bg-void/40 backdrop-blur-sm"
            style={{ pointerEvents: "auto", touchAction: "none" }}
          >
            <div
              ref={knobRef}
              className="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-neon-cyan/70 bg-neon-cyan/20 shadow-[0_0_20px_oklch(0.82_0.13_205/45%)]"
            />
          </div>
          <button
            ref={sprintRef}
            type="button"
            aria-label="koş"
            className="absolute end-4 bottom-6 size-16 rounded-full border border-neon-magenta/50 bg-void/50 font-mono text-[10px] tracking-[0.15em] text-neon-magenta uppercase backdrop-blur-sm active:bg-neon-magenta/25"
            style={{ pointerEvents: "auto", touchAction: "none" }}
          >
            KOŞ
          </button>
        </div>

        {webgl && phase !== "playing" && (
          <button
            type="button"
            onClick={toggleMute}
            aria-label="ses"
            className="absolute end-3 top-3 z-10 rounded-md border border-line bg-void/70 p-1.5 text-dim transition-colors hover:text-neon-cyan"
          >
            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
        )}

        {!webgl && (
          <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
            <p className="max-w-md text-sm text-dim">
              WebGL <span className="text-neon-magenta">✕</span> — {game.tagline}
            </p>
          </div>
        )}

        {/* first-person crosshair */}
        {webgl && phase === "playing" && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <span className="block size-1.5 rounded-full bg-neon-cyan/70 shadow-[0_0_8px_oklch(0.82_0.13_205/70%)]" />
          </div>
        )}

        {/* district label + change controls */}
        {webgl && phase === "playing" && (
          <div className="pointer-events-none absolute inset-x-0 top-9 z-10 flex items-center justify-center gap-2 md:top-11">
            <button
              type="button"
              aria-label="önceki bölge"
              onClick={() => apiRef.current?.go(-1)}
              className="pointer-events-auto grid size-7 place-items-center rounded-full border border-neon-cyan/40 bg-void/50 text-neon-cyan backdrop-blur-sm transition-colors hover:bg-neon-cyan/15"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="rounded-full border border-neon-cyan/40 bg-void/50 px-4 py-1 font-mono text-[10px] tracking-[0.3em] text-neon-cyan uppercase backdrop-blur-sm md:text-xs">
              ◈ {district}
            </span>
            <button
              type="button"
              aria-label="sonraki bölge"
              onClick={() => apiRef.current?.go(1)}
              className="pointer-events-auto grid size-7 place-items-center rounded-full border border-neon-cyan/40 bg-void/50 text-neon-cyan backdrop-blur-sm transition-colors hover:bg-neon-cyan/15"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}

        {webgl && phase === "idle" && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-3.5 overflow-y-auto bg-void/60 px-4 py-6 text-center backdrop-blur-[2px] md:gap-5 md:px-6">
            <span className="font-mono text-[11px] tracking-[0.42em] text-neon-cyan uppercase">
              {game.eyebrow}
            </span>
            <h2 className="font-display text-3xl font-black tracking-[0.08em] text-ghost md:text-5xl">
              {game.title}
            </h2>
            <p className="font-mono text-[11px] tracking-[0.24em] text-dim uppercase">
              {game.choose}
            </p>
            <div className="flex flex-wrap items-stretch justify-center gap-2.5 md:gap-3">
              {characters.map((c) => {
                const active = c.id === charId;
                const accent = CHAR_ACCENT[c.id];
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => selectChar(c.id)}
                    aria-pressed={active}
                    className={`flex w-[6.5rem] flex-col items-center gap-1 rounded-lg border p-2 transition-colors md:w-32 ${
                      active ? accent.on : "border-line bg-void/40 hover:border-dim"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={asset(`/images/protagonist-${c.id}.webp`)}
                      alt={c.name}
                      className="h-20 w-full rounded object-cover md:h-24"
                      loading="lazy"
                    />
                    <span className={`font-display text-xs font-bold ${active ? accent.text : "text-ghost"}`}>
                      {c.name}
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.12em] text-dim uppercase">
                      {c.role}
                    </span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={start}
              className="border border-neon-cyan/60 bg-neon-cyan/10 px-8 py-3 font-mono text-sm font-semibold tracking-[0.24em] text-neon-cyan uppercase shadow-[0_0_28px_oklch(0.82_0.13_205_/_35%)] transition-colors hover:bg-neon-cyan/20"
            >
              {game.start}
            </button>
            <p className="max-w-md font-mono text-[11px] tracking-[0.16em] text-dim/80 uppercase">
              {game.controls}
            </p>
          </div>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-dim uppercase transition-colors hover:text-neon-cyan"
        >
          <ArrowLeft className="size-4" />
          {game.backHome}
        </Link>
        <span className="font-mono text-[11px] tracking-[0.18em] text-dim/70 uppercase">
          {game.controls}
        </span>
      </div>
    </div>
  );
}
