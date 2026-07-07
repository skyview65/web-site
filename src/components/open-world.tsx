"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { Reflector } from "three/examples/jsm/objects/Reflector.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { asset } from "@/lib/asset";
import type { CharacterCopy, Dictionary } from "@/lib/i18n/dictionary";

/**
 * LUMENFALL — open-world milestone. A free-roam flight over a fixed neon
 * district: steer (yaw), throttle, climb; a live minimap; mid-run pilot
 * switching; and scattered Lümen objectives that clear the district. Rendered
 * with three.js + UnrealBloom. This is the first real-game milestone beyond
 * the arcade runner; collision, driving mode and missions come next.
 */

type Phase = "idle" | "playing" | "cleared" | "over";
type CharId = "mara" | "kaan" | "solene";

const BEST_KEY = "lumenfall_openworld_best";
const HALF = 240; // district half-extent (world units)
const LUMEN_TOTAL = 12;
const NEON = [0x67e8f9, 0xf0abfc, 0xfcd34d];

const PILOTS: Record<CharId, { color: number; turn: number; accel: number; top: number }> = {
  mara: { color: 0x67e8f9, turn: 1.9, accel: 60, top: 95 },
  kaan: { color: 0xfcd34d, turn: 1.4, accel: 52, top: 82 },
  solene: { color: 0xf0abfc, turn: 1.7, accel: 70, top: 120 },
};

const CHAR_ACCENT: Record<CharId, { on: string; text: string }> = {
  mara: { on: "border-neon-cyan bg-neon-cyan/10", text: "text-neon-cyan" },
  kaan: { on: "border-neon-amber bg-neon-amber/10", text: "text-neon-amber" },
  solene: { on: "border-neon-magenta bg-neon-magenta/10", text: "text-neon-magenta" },
};

interface Tower {
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
}
interface Orb {
  mesh: THREE.Mesh;
  beam: THREE.Mesh;
  x: number;
  z: number;
  y: number;
  taken: boolean;
}

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
  const miniRef = useRef<HTMLCanvasElement>(null);
  const apiRef = useRef<{ start: () => void; setChar: (c: CharId) => void } | null>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const [hud, setHud] = useState({ lumen: 0, speed: 0, wanted: 0 });
  const [best, setBest] = useState(0);
  const [webgl, setWebgl] = useState(true);
  const [charId, setCharId] = useState<CharId>("mara");
  const [muted, setMuted] = useState(false);
  const charRef = useRef<CharId>("mara");
  const mutedRef = useRef(false);
  const audioApiRef = useRef<{ setMuted: (m: boolean) => void } | null>(null);
  const joyRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const upRef = useRef<HTMLButtonElement>(null);
  const downRef = useRef<HTMLButtonElement>(null);
  const [touch, setTouch] = useState(false);

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
    const raw =
      typeof window !== "undefined" ? window.localStorage.getItem(BEST_KEY) : null;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (raw) setBest(Number(raw) || 0);
    // Show on-screen controls on any touch-capable OR phone-sized screen, so a
    // device never ends up playable-by-keyboard-only with no way to steer.
    const needsTouch =
      typeof window !== "undefined" &&
      (window.matchMedia?.("(pointer: coarse)").matches ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0);
    if (needsTouch) setTouch(true);
  }, []);

  const start = useCallback(() => {
    apiRef.current?.start();
    setHud({ lumen: 0, speed: 0, wanted: 0 });
    setPhase("playing");
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    const wrap = wrapRef.current;
    const mini = miniRef.current;
    if (!mount || !wrap || !mini) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Phones can't afford a full-res mirror + heavy rain every frame; scale the
    // expensive effects down on small screens so play stays smooth.
    const lowPerf =
      reduced ||
      (typeof window !== "undefined" &&
        Math.min(window.innerWidth, window.innerHeight) < 760);

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

    // cap the pixel ratio hard on phones — the full-screen bloom + grade passes
    // are fill-rate bound, so a lower ratio buys a lot of frame time.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPerf ? 1.3 : 2));
    renderer.setSize(w, h);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "none";

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05030b);
    scene.fog = new THREE.FogExp2(0x0a0518, 0.0015);

    // Cinematic gradient sky dome: deep space overhead melting into a magenta
    // horizon glow — replaces the flat background so the skyline has depth.
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: {
        uTop: { value: new THREE.Color(0x02010a) },
        uMid: { value: new THREE.Color(0x140a2e) },
        uHorizon: { value: new THREE.Color(0x3a1846) },
        uGlow: { value: new THREE.Color(0xc93b86) },
      },
      vertexShader: `
        varying vec3 vDir;
        void main() {
          vDir = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: `
        varying vec3 vDir;
        uniform vec3 uTop, uMid, uHorizon, uGlow;
        void main() {
          float h = normalize(vDir).y;
          vec3 c = h > 0.0
            ? mix(uMid, uTop, pow(clamp(h, 0.0, 1.0), 0.55))
            : mix(uMid, uHorizon, pow(clamp(-h, 0.0, 1.0), 0.5));
          c += uGlow * exp(-abs(h) * 16.0) * 0.34;        // horizon band
          c += uGlow * 0.05 * exp(-abs(h) * 4.0);          // soft city bloom
          gl_FragColor = vec4(c, 1.0);
        }`,
    });
    const sky = new THREE.Mesh(new THREE.SphereGeometry(2200, 40, 20), skyMat);
    scene.add(sky);

    // Photoreal city as a full 360 environment — a true equirectangular skybox
    // (AI-generated neon street), so it surrounds the player correctly in every
    // direction. The gradient dome hides once it loads; towers stay dark glass.
    let cycloTex: THREE.Texture | null = null;
    let envRT: THREE.WebGLRenderTarget | null = null;
    const pmrem = new THREE.PMREMGenerator(renderer);
    // Pool of photoreal 360 skyboxes — one is picked per session for variety.
    // Drop more equirect files here as they are generated.
    const SKYBOXES = [
      "/images/lumenfall-skybox.webp",
      "/images/lumenfall-skybox-2.webp",
    ];
    const skySrc = SKYBOXES[Math.floor(Math.random() * SKYBOXES.length)];
    new THREE.TextureLoader().load(
      asset(skySrc),
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.mapping = THREE.EquirectangularReflectionMapping;
        cycloTex = tex;
        scene.background = tex;
        // Pre-filter the skybox into a proper IBL map so the glass towers and
        // the car mirror the neon city with correct, roughness-aware reflections.
        envRT = pmrem.fromEquirectangular(tex);
        scene.environment = envRT.texture;
        scene.environmentIntensity = 1.15; // skybox drives the IBL
        scene.backgroundIntensity = 0.95; // seat the sky a touch below pure
        sky.visible = false;
      },
      undefined,
      () => {},
    );

    const camera = new THREE.PerspectiveCamera(58, w / h, 0.1, 5000);

    // Let the photoreal skybox (PMREM env) do most of the lighting; keep only
    // light fills + one key so nothing goes muddy. environmentIntensity is set
    // once the skybox loads.
    scene.add(new THREE.AmbientLight(0x1a1830, 0.22));
    const hemi = new THREE.HemisphereLight(0xd6a8fc, 0x0a1a2a, 0.2);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0x9ec0ff, 0.5);
    key.position.set(-40, 160, 60);
    scene.add(key);

    // Wet-asphalt ground. On desktop a real-time mirror reflects the neon
    // skyline and craft (dimmed by a translucent plane) — but that re-renders
    // the whole scene every frame, which is far too heavy for phones. On
    // low-power devices we skip the mirror entirely and use a cheap glossy
    // floor that still catches the moving craft light. This keeps mobile
    // playable (the mirror + big cyclorama together could stall a phone GPU).
    let mirror: Reflector | null = null;
    if (!lowPerf) {
      mirror = new Reflector(new THREE.PlaneGeometry(HALF * 3, HALF * 3), {
        color: 0x0a0a12,
        textureWidth: 1024,
        textureHeight: 1024,
        clipBias: 0.004,
      });
      mirror.rotation.x = -Math.PI / 2;
      mirror.position.y = -0.02;
      scene.add(mirror);
    }
    const wet = new THREE.Mesh(
      new THREE.PlaneGeometry(HALF * 3, HALF * 3),
      lowPerf
        ? new THREE.MeshStandardMaterial({
            color: 0x06060d,
            roughness: 0.34,
            metalness: 0.6,
          })
        : new THREE.MeshBasicMaterial({
            color: 0x05050c,
            transparent: true,
            opacity: 0.42,
            depthWrite: false,
          }),
    );
    wet.rotation.x = -Math.PI / 2;
    scene.add(wet);
    const grid = new THREE.GridHelper(HALF * 2, 24, 0x67e8f9, 0x13233a);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.28;
    grid.position.y = 0.02;
    scene.add(grid);


    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    // fixed district: a dense grid of towers with street gaps and a few
    // landmark spires that punch through the skyline.
    const towers: Tower[] = [];
    const step = 50;
    for (let gx = -HALF + 34; gx <= HALF - 34; gx += step)
      for (let gz = -HALF + 34; gz <= HALF - 34; gz += step) {
        // keep a clear plaza around the fixed spawn (0, HALF-60) so the craft
        // never starts embedded in a tower and gets wedged by collision.
        if (Math.hypot(gx, gz - (HALF - 60)) < 52) continue;
        if (Math.random() < 0.14) continue; // streets / plazas
        const landmark = Math.random() < 0.12;
        towers.push({
          x: gx + rand(-9, 9),
          z: gz + rand(-9, 9),
          w: rand(14, 30),
          d: rand(14, 30),
          h: landmark ? rand(120, 190) : rand(26, 100),
        });
      }
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    // Dark glass towers: near-black, highly reflective slabs with no cartoon
    // window grid — they mirror the photoreal neon city (scene.environment) and
    // wear only the neon roof caps, like the shadowed skyscrapers in the hero
    // art. This kills the "boxy game" read while keeping the canyon to fly.
    const buildMat = new THREE.MeshStandardMaterial({
      color: 0x0a0c16,
      roughness: 0.12,
      metalness: 1.0,
      envMapIntensity: 2.6,
    });
    const buildings = new THREE.InstancedMesh(boxGeo, buildMat, towers.length);
    const capMat = new THREE.MeshBasicMaterial();
    const caps = new THREE.InstancedMesh(boxGeo, capMat, towers.length);
    // Vertical neon accent strips running up two faces of every tower, so they
    // read as lit skyscrapers matching the skybox instead of black slabs.
    const stripMat = new THREE.MeshBasicMaterial();
    const strips = new THREE.InstancedMesh(boxGeo, stripMat, towers.length * 2);
    const tmp = new THREE.Object3D();
    const colObj = new THREE.Color();
    towers.forEach((t, i) => {
      tmp.position.set(t.x, t.h / 2, t.z);
      tmp.scale.set(t.w, t.h, t.d);
      tmp.updateMatrix();
      buildings.setMatrixAt(i, tmp.matrix);
      tmp.position.set(t.x, t.h + 1.1, t.z);
      tmp.scale.set(t.w * 1.05, 2.2, t.d * 1.05);
      tmp.updateMatrix();
      caps.setMatrixAt(i, tmp.matrix);
      const neon = colObj.setHex(NEON[i % NEON.length]).clone();
      caps.setColorAt(i, neon);
      // strip on the +Z face
      tmp.position.set(t.x - t.w * 0.28, t.h * 0.5 + 3, t.z + t.d / 2 + 0.15);
      tmp.scale.set(0.9, t.h * 0.82, 0.4);
      tmp.updateMatrix();
      strips.setMatrixAt(i * 2, tmp.matrix);
      strips.setColorAt(i * 2, neon);
      // strip on the +X face, offset colour for variety
      const neon2 = colObj.setHex(NEON[(i + 2) % NEON.length]).clone();
      tmp.position.set(t.x + t.w / 2 + 0.15, t.h * 0.5 + 3, t.z + t.d * 0.28);
      tmp.scale.set(0.4, t.h * 0.82, 0.9);
      tmp.updateMatrix();
      strips.setMatrixAt(i * 2 + 1, tmp.matrix);
      strips.setColorAt(i * 2 + 1, neon2);
    });
    buildings.instanceMatrix.needsUpdate = true;
    caps.instanceMatrix.needsUpdate = true;
    strips.instanceMatrix.needsUpdate = true;
    if (caps.instanceColor) caps.instanceColor.needsUpdate = true;
    if (strips.instanceColor) strips.instanceColor.needsUpdate = true;
    scene.add(buildings);
    scene.add(caps);
    scene.add(strips);

    // --- Holographic billboards -------------------------------------------
    // Instanced emissive scan-line panels mounted on tower faces, each turned
    // to face its street. One additive InstancedMesh + a cheap animated shader
    // = dense neon city life matching the photoreal skybox, for the cost of a
    // single draw call. Per-instance colour + seed decorrelate the animation.
    // Readable neon signs painted to CanvasTextures (real LUMENFALL wording,
    // not abstract scan-lines) mounted on tower faces toward the street.
    const makeSign = (text: string, hex: number, sub?: string) => {
      const cv = document.createElement("canvas");
      cv.width = 512;
      cv.height = 256;
      const x = cv.getContext("2d");
      const col = "#" + hex.toString(16).padStart(6, "0");
      if (!x) return new THREE.CanvasTexture(cv);
      x.fillStyle = "#05060e";
      x.fillRect(0, 0, 512, 256);
      x.strokeStyle = col;
      x.lineWidth = 6;
      x.strokeRect(14, 14, 484, 228);
      x.textAlign = "center";
      x.textBaseline = "middle";
      x.shadowColor = col;
      x.shadowBlur = 32;
      x.fillStyle = "#ffffff";
      x.font = "900 108px 'Arial Black', Arial, sans-serif";
      x.fillText(text, 256, sub ? 106 : 130);
      if (sub) {
        x.font = "700 48px Arial, sans-serif";
        x.fillStyle = col;
        x.fillText(sub, 256, 190);
      }
      const t = new THREE.CanvasTexture(cv);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      return t;
    };
    const signTex = [
      makeSign("LUMENFALL", 0xf0abfc, "2099"),
      makeSign("PANOPT", 0x67e8f9, "GÖZETİM"),
      makeSign("LÜMEN", 0xfcd34d),
      makeSign("光 · 2099", 0xff5ea8),
      makeSign("ZENİT", 0x67e8f9, "KULE"),
      makeSign("NEON KAÇIŞ", 0xa5f3fc),
      makeSign("KARANLIK PARLAR", 0xf0abfc),
      makeSign("MARA · KAAN · SOLENE", 0xfde68a),
    ];
    const signMat = signTex.map(
      (t) =>
        new THREE.MeshBasicMaterial({
          map: t,
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false,
        }),
    );
    const bbGeo = new THREE.PlaneGeometry(1, 1);
    const BB_FACES = [
      { rot: 0, nx: 0, nz: 1 },
      { rot: Math.PI, nx: 0, nz: -1 },
      { rot: Math.PI / 2, nx: 1, nz: 0 },
      { rot: -Math.PI / 2, nx: -1, nz: 0 },
    ];
    const billboards = new THREE.Group();
    const BB_CAP = lowPerf ? 22 : 54;
    let bbN = 0;
    for (let i = 0; i < towers.length && bbN < BB_CAP; i++) {
      const t = towers[i];
      if (t.h < 46) continue;
      if (Math.random() < (lowPerf ? 0.55 : 0.3)) continue;
      const fc = BB_FACES[i % 4];
      const faceW = fc.nz !== 0 ? t.w : t.d;
      const bw = Math.min(faceW * 0.82, 18);
      if (bw < 7) continue;
      const off = (fc.nz !== 0 ? t.d / 2 : t.w / 2) + 0.35;
      const m = new THREE.Mesh(bbGeo, signMat[(i * 3 + bbN) % signMat.length]);
      m.position.set(t.x + fc.nx * off, rand(t.h * 0.42, t.h * 0.82), t.z + fc.nz * off);
      m.rotation.y = fc.rot;
      m.scale.set(bw, bw * 0.5, 1);
      billboards.add(m);
      bbN++;
    }
    scene.add(billboards);

    // --- NPC hover-car traffic ---------------------------------------------
    // Procedural neon vehicles that cruise the district at varied altitudes and
    // recycle around the player, giving the streets life. Shared geo/materials;
    // only a per-car underglow is tinted. Fewer cars on phones.
    const npcBodyGeo = new THREE.BoxGeometry(2.2, 0.8, 5.2);
    const npcCanopyGeo = new THREE.BoxGeometry(1.5, 0.7, 2.4);
    const npcLightGeo = new THREE.BoxGeometry(1.9, 0.18, 0.14);
    const npcGlowGeo = new THREE.PlaneGeometry(2.0, 4.2);
    const npcBodyMat = new THREE.MeshStandardMaterial({
      color: 0x0a0c16,
      metalness: 0.95,
      roughness: 0.28,
      envMapIntensity: 1.4,
    });
    const npcCanopyMat = new THREE.MeshStandardMaterial({
      color: 0x05070c,
      metalness: 0.4,
      roughness: 0.08,
      transparent: true,
      opacity: 0.55,
    });
    const npcTailMat = new THREE.MeshBasicMaterial({ color: 0xff2b4e });
    const npcHeadMat = new THREE.MeshBasicMaterial({ color: 0xdff0ff });
    const makeVehicle = (hex: number) => {
      const g = new THREE.Group();
      const body = new THREE.Mesh(npcBodyGeo, npcBodyMat);
      g.add(body);
      const canopy = new THREE.Mesh(npcCanopyGeo, npcCanopyMat);
      canopy.position.set(0, 0.55, 0.1);
      g.add(canopy);
      const tail = new THREE.Mesh(npcLightGeo, npcTailMat);
      tail.position.set(0, 0, 2.6);
      g.add(tail);
      const head = new THREE.Mesh(npcLightGeo, npcHeadMat);
      head.position.set(0, 0, -2.6);
      g.add(head);
      const glow = new THREE.Mesh(
        npcGlowGeo,
        new THREE.MeshBasicMaterial({
          color: hex,
          transparent: true,
          opacity: 0.7,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      glow.rotation.x = -Math.PI / 2;
      glow.position.y = -0.5;
      g.add(glow);
      return g;
    };
    const NPC_N = lowPerf ? 9 : 20;
    const NPC_RANGE = 175;
    const npcs: { mesh: THREE.Group; vx: number; vz: number; x: number; y: number; z: number }[] = [];
    for (let i = 0; i < NPC_N; i++) {
      const v = makeVehicle(NEON[i % NEON.length]);
      const along = Math.random() < 0.5;
      const dir = Math.random() < 0.5 ? 1 : -1;
      const spd = rand(28, 74);
      const vx = along ? dir * spd : 0;
      const vz = along ? 0 : dir * spd;
      v.rotation.y = Math.atan2(-vx, -vz); // headlights (-Z) face travel
      const x = rand(-NPC_RANGE, NPC_RANGE);
      const z = HALF - 60 + rand(-NPC_RANGE, NPC_RANGE);
      const y = rand(3, 46);
      v.position.set(x, y, z);
      scene.add(v);
      npcs.push({ mesh: v, vx, vz, x, y, z });
    }

    // boundary ring (neon fence)
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(HALF * 1.02, 1.2, 8, 96),
      new THREE.MeshBasicMaterial({ color: 0xf0abfc }),
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 6;
    scene.add(ring);

    // stars
    const starGeo = new THREE.BufferGeometry();
    const sp = new Float32Array(700 * 3);
    for (let i = 0; i < 700; i++) {
      sp[i * 3] = rand(-1600, 1600);
      sp[i * 3 + 1] = rand(120, 900);
      sp[i * 3 + 2] = rand(-1600, 1600);
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3));
    scene.add(
      new THREE.Points(
        starGeo,
        new THREE.PointsMaterial({ color: 0x9fb4ff, size: 2.2, sizeAttenuation: false, transparent: true, opacity: 0.8 }),
      ),
    );

    // Rain: streaks recycled in a column around the camera. Each drop is a short
    // line segment (top + bottom vertex); the frame loop rains them down and
    // re-seeds any that fall past the camera. Off under reduced-motion.
    const RAIN_N = reduced ? 0 : lowPerf ? 600 : 1200;
    const RAIN_SPREAD = 150;
    const RAIN_TOP = 170;
    const RAIN_LEN = 3.2;
    const rainPos = new Float32Array(RAIN_N * 2 * 3);
    for (let i = 0; i < RAIN_N; i++) {
      const x = rand(-RAIN_SPREAD, RAIN_SPREAD);
      const z = rand(-RAIN_SPREAD, RAIN_SPREAD);
      const y = rand(0, RAIN_TOP);
      rainPos[i * 6] = x;
      rainPos[i * 6 + 1] = y;
      rainPos[i * 6 + 2] = z;
      rainPos[i * 6 + 3] = x;
      rainPos[i * 6 + 4] = y - RAIN_LEN;
      rainPos[i * 6 + 5] = z;
    }
    const rainGeo = new THREE.BufferGeometry();
    rainGeo.setAttribute("position", new THREE.BufferAttribute(rainPos, 3));
    const rain = new THREE.LineSegments(
      rainGeo,
      new THREE.LineBasicMaterial({ color: 0x8fb8ff, transparent: true, opacity: 0.34 }),
    );
    rain.frustumCulled = false;
    if (RAIN_N > 0) scene.add(rain);

    // Lümen objectives — a marker beam (light pillar) rises from each so they
    // can be spotted across the district, GTA-collectible style.
    const orbs: Orb[] = [];
    const orbGeo = new THREE.TorusGeometry(2.4, 0.7, 10, 8);
    const orbMat = new THREE.MeshBasicMaterial({ color: 0xfcd34d });
    const beamGeo = new THREE.CylinderGeometry(0.7, 1.8, 260, 12, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xfcd34d,
      transparent: true,
      opacity: 0.14,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    for (let i = 0; i < LUMEN_TOTAL; i++) {
      const m = new THREE.Mesh(orbGeo, orbMat);
      const x = rand(-HALF + 30, HALF - 30);
      const z = rand(-HALF + 30, HALF - 30);
      const y = rand(14, 60);
      m.position.set(x, y, z);
      scene.add(m);
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.set(x, 120, z);
      scene.add(beam);
      orbs.push({ mesh: m, beam, x, z, y, taken: false });
    }

    // pickup flash — a small pool of expanding rings, reused on each collect
    const burstGeo = new THREE.RingGeometry(0.6, 3.2, 28);
    const bursts = Array.from({ length: 4 }, () => {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xfef3c7,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(burstGeo, mat);
      mesh.visible = false;
      scene.add(mesh);
      return { mesh, mat, t: 0, active: false };
    });
    let burstIdx = 0;
    const fireBurst = (bx2: number, by2: number, bz2: number) => {
      burstIdx = (burstIdx + 1) % bursts.length;
      const b = bursts[burstIdx];
      b.mesh.position.set(bx2, by2, bz2);
      b.mesh.scale.setScalar(1);
      b.mat.opacity = 0.95;
      b.t = 0;
      b.active = true;
      b.mesh.visible = true;
    };

    // PANOPT patrol drones — hand-built menacing gaze drone: dark octahedral
    // core, a glowing magenta eye + ring, four arms with tip lights.
    const droneShell = new THREE.MeshStandardMaterial({
      color: 0x1a0a16,
      emissive: 0x2a0a1e,
      emissiveIntensity: 0.5,
      metalness: 0.7,
      roughness: 0.4,
    });
    const droneGlow = new THREE.MeshBasicMaterial({ color: 0xf0abfc });
    const makeDrone = () => {
      const g = new THREE.Group();
      const core = new THREE.Mesh(new THREE.OctahedronGeometry(1.4, 0), droneShell);
      g.add(core);
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.5, 12, 12), droneGlow);
      eye.position.z = 1.25;
      g.add(eye);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.11, 8, 20), droneGlow);
      ring.position.z = 1.1;
      g.add(ring);
      for (const [ax, az] of [
        [1, 1],
        [-1, 1],
        [1, -1],
        [-1, -1],
      ]) {
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 1.9), droneShell);
        arm.position.set(ax * 0.7, 0.15, az * 0.7);
        arm.rotation.y = Math.atan2(ax, az);
        g.add(arm);
        const tip = new THREE.Mesh(new THREE.SphereGeometry(0.24, 8, 8), droneGlow);
        tip.position.set(ax * 1.5, 0.15, az * 1.5);
        g.add(tip);
      }
      return g;
    };
    const droneTemplate = makeDrone();
    const DRONE_MAX = 4;
    const drones: {
      mesh: THREE.Object3D;
      x: number;
      y: number;
      z: number;
      active: boolean;
    }[] = [];
    for (let i = 0; i < DRONE_MAX; i++) {
      const container = new THREE.Group();
      container.add(droneTemplate.clone());
      container.visible = false;
      scene.add(container);
      drones.push({ mesh: container, x: 0, y: 0, z: 0, active: false });
    }
    // Optional generated drone model: public/models/drone.glb replaces the
    // primitive drone in every container. Falls back to the built-in gaze drone.
    new GLTFLoader().load(
      asset("/models/drone.glb"),
      (gltf) => {
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const size = box.getSize(new THREE.Vector3());
        const s = 4 / Math.max(size.x, size.y, size.z, 0.001);
        const center = box.getCenter(new THREE.Vector3());
        for (const d of drones) {
          d.mesh.clear();
          const model = gltf.scene.clone();
          model.scale.setScalar(s);
          model.position.sub(center.clone().multiplyScalar(s));
          d.mesh.add(model);
        }
      },
      undefined,
      () => {},
    );

    // the craft
    const ship = new THREE.Group();
    const hullMat = new THREE.MeshStandardMaterial({
      color: 0x0a2230,
      emissive: 0x67e8f9,
      emissiveIntensity: 1.0,
      metalness: 0.6,
      roughness: 0.3,
    });
    // Hand-built detailed hover-craft (nose at +Z). The glowing accent parts
    // share hullMat, so the pilot colour tints the whole craft's neon.
    const craftPrimitive = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x0b1622,
      metalness: 0.85,
      roughness: 0.32,
      emissive: 0x0a1018,
      emissiveIntensity: 0.4,
    });
    const engineGlow = new THREE.MeshBasicMaterial({ color: 0xfcd34d });

    const body = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 16), bodyMat);
    body.scale.set(1.5, 1.05, 3.5);
    craftPrimitive.add(body);

    const nose = new THREE.Mesh(new THREE.ConeGeometry(1.05, 3, 16), bodyMat);
    nose.rotation.x = Math.PI / 2; // apex -> +Z (forward)
    nose.position.z = 4.3;
    craftPrimitive.add(nose);

    const canopy = new THREE.Mesh(
      new THREE.SphereGeometry(0.95, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({
        color: 0x0a1a24,
        metalness: 0.4,
        roughness: 0.1,
        emissive: 0x67e8f9,
        emissiveIntensity: 0.25,
        transparent: true,
        opacity: 0.85,
      }),
    );
    canopy.scale.set(1, 0.7, 1.7);
    canopy.position.set(0, 0.65, 1.2);
    craftPrimitive.add(canopy);

    for (const sx of [-1, 1]) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.3, 2.6), bodyMat);
      fin.position.set(sx * 2.0, 0.1, -1.4);
      fin.rotation.z = sx * 0.5;
      fin.rotation.x = 0.22;
      craftPrimitive.add(fin);
      const finEdge = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.12, 2.7), hullMat);
      finEdge.position.set(sx * 2.35, 0.72, -1.4);
      finEdge.rotation.z = sx * 0.5;
      finEdge.rotation.x = 0.22;
      craftPrimitive.add(finEdge);
    }

    for (const sx of [-1.35, 1.35]) {
      const eng = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.72, 2.4, 14), bodyMat);
      eng.rotation.x = Math.PI / 2;
      eng.position.set(sx, -0.15, -2.5);
      craftPrimitive.add(eng);
      const exhaust = new THREE.Mesh(new THREE.CircleGeometry(0.56, 14), engineGlow);
      exhaust.position.set(sx, -0.15, -3.72);
      exhaust.rotation.y = Math.PI; // face rear
      craftPrimitive.add(exhaust);
    }

    const spine = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 5.0), hullMat);
    spine.position.set(0, 0.98, 0.2);
    craftPrimitive.add(spine);
    for (const sx of [-1, 1]) {
      const sideLine = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 4.0), hullMat);
      sideLine.position.set(sx * 1.45, -0.15, 0);
      craftPrimitive.add(sideLine);
    }

    const underglow = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 5), hullMat);
    underglow.rotation.x = -Math.PI / 2;
    underglow.position.y = -1.02;
    craftPrimitive.add(underglow);

    craftPrimitive.scale.setScalar(0.85);
    ship.add(craftPrimitive);

    // a coloured light pool travels with the craft — rim-lights the hero car
    // and throws a neon reflection onto the wet street below it.
    const craftLight = new THREE.PointLight(PILOTS[charRef.current].color, 4.2, 100, 2);
    craftLight.position.set(0, 7, 1);
    ship.add(craftLight);
    // cool rim/back light travels with the craft — lifts it off the city behind
    const rimLight = new THREE.PointLight(0x9fe4ff, 2.4, 46, 2);
    rimLight.position.set(0, 6, -7);
    ship.add(rimLight);

    // forward headlight cone — sweeps the wet street ahead of the craft
    const headTarget = new THREE.Object3D();
    headTarget.position.set(0, -6, 34);
    ship.add(headTarget);
    const headlight = new THREE.SpotLight(0xdff0ff, 6, 130, 0.62, 0.5, 1.4);
    headlight.position.set(0, 1.5, 4);
    headlight.target = headTarget;
    ship.add(headlight);
    scene.add(ship);

    // Thruster trail: an additive ribbon of the craft's recent path that widens
    // and brightens with speed (tinted per pilot). Fades to nothing at rest.
    const TRAIL_N = 28;
    const trailHist: number[][] = [];
    const trailPos = new Float32Array(TRAIL_N * 2 * 3);
    const trailAlpha = new Float32Array(TRAIL_N * 2);
    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute("position", new THREE.BufferAttribute(trailPos, 3));
    trailGeo.setAttribute("aAlpha", new THREE.BufferAttribute(trailAlpha, 1));
    const trailIdx: number[] = [];
    for (let i = 0; i < TRAIL_N - 1; i++) {
      const a = i * 2;
      trailIdx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
    trailGeo.setIndex(trailIdx);
    const trailMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      uniforms: { uColor: { value: new THREE.Color(PILOTS[charRef.current].color) } },
      vertexShader: `
        attribute float aAlpha; varying float vA;
        void main() { vA = aAlpha; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `
        uniform vec3 uColor; varying float vA;
        void main() { gl_FragColor = vec4(uColor, vA); }`,
    });
    const trail = new THREE.Mesh(trailGeo, trailMat);
    trail.frustumCulled = false;
    scene.add(trail);

    // Real 3D craft model (public/models/craft.glb — a sports-car mesh). Loaded
    // async; when present it replaces the primitive hull: auto-scaled, centred,
    // oriented, and given a per-part neon-noir finish (metallic paint in the
    // pilot's colour, smoked glass, chrome rims, an additive underglow). Falls
    // back to the primitive hull if the file is missing (same optional-asset
    // pattern as the skybox).
    let craftModel: THREE.Object3D | null = null;
    const tintCraft = (hex: number) => {
      craftLight.color.setHex(hex);
      trailMat.uniforms.uColor.value.setHex(hex);
      if (!craftModel) return;
      const paint = new THREE.Color(hex);
      craftModel.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        const mat = mesh.material as THREE.MeshStandardMaterial | undefined;
        if (!mat || !("emissive" in mat)) return;
        const name = mesh.name.toLowerCase();
        if (name.includes("glass") || name.includes("window") || name.includes("shield")) {
          // smoked cockpit glass with a faint interior glow
          mat.color.setHex(0x05070c);
          mat.metalness = 0.2;
          mat.roughness = 0.05;
          mat.transparent = true;
          mat.opacity = 0.4;
          mat.emissive.copy(paint).multiplyScalar(0.25);
          mat.emissiveIntensity = 0.5;
        } else if (name.includes("wheel") || name.includes("tire") || name.includes("tyre")) {
          mat.color.setHex(0x090b0f);
          mat.metalness = 0.35;
          mat.roughness = 0.75;
          mat.emissive.setHex(0x000000);
        } else if (
          name.includes("rim") ||
          name.includes("trim") ||
          name.includes("chrome") ||
          name.includes("light")
        ) {
          // chrome / bright trim picks up a hint of the pilot neon
          mat.color.setHex(0xcfd6e0);
          mat.metalness = 1.0;
          mat.roughness = 0.25;
          mat.emissive.copy(paint).multiplyScalar(0.3);
          mat.emissiveIntensity = 0.6;
        } else {
          // body paint
          mat.color.copy(paint);
          mat.metalness = 0.9;
          mat.roughness = 0.3;
          mat.emissive.copy(paint);
          mat.emissiveIntensity = 0.5;
        }
        mat.needsUpdate = true;
      });
    };
    new GLTFLoader().load(
      asset("/models/craft.glb"),
      (gltf) => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const s = 10 / Math.max(size.x, size.y, size.z, 0.001);
        model.scale.setScalar(s);
        const center = box.getCenter(new THREE.Vector3()).multiplyScalar(s);
        model.position.sub(center);
        model.rotation.y = Math.PI; // orient the nose to craft-forward (+Z)
        model.traverse((o) => {
          o.castShadow = false;
          o.receiveShadow = false;
        });
        craftPrimitive.visible = false;
        ship.add(model);
        craftModel = model;
        tintCraft(PILOTS[charRef.current].color);
      },
      undefined,
      () => {
        /* no craft model — keep the primitive hull */
      },
    );

    // Post: bloom for the neon, then a single cinematic grade pass — subtle
    // chromatic aberration toward the edges, teal/magenta split-tone, vignette
    // and animated film grain. Order: scene → bloom → sRGB output → grade.
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(w, h), reduced ? 0.34 : 0.44, 0.55, 0.55);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
    const gradePass = new ShaderPass({
      uniforms: {
        tDiffuse: { value: null },
        uTime: { value: 0 },
        uGrain: { value: reduced ? 0.0 : 0.05 },
        uAberration: { value: 0.0022 },
        uVignette: { value: 1.12 },
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
          // ---- filmic grade ----
          float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
          // teal-lifted shadows, warm highlights (neon-noir split tone)
          col *= mix(vec3(0.90, 1.0, 1.10), vec3(1.10, 0.98, 1.0), smoothstep(0.12, 0.9, l));
          // gentle S-curve contrast
          col = mix(col, col * col * (3.0 - 2.0 * col), 0.55);
          // saturation lift
          col = mix(vec3(l), col, 1.16);
          // vignette
          float vig = smoothstep(0.95, 0.28, length(dir) * uVignette);
          col *= mix(0.58, 1.0, vig);
          // film grain + triangular-PDF dither to kill banding
          float g1 = rnd(vUv * vec2(1920.0, 1080.0) + uTime);
          float g2 = rnd(vUv * vec2(1920.0, 1080.0) - uTime * 1.3);
          col += (g1 - 0.5) * uGrain;
          col += (g1 - g2) / 255.0;
          gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
        }`,
    });
    composer.addPass(gradePass);

    // ---- audio ----
    type AudioBox = { ctx: AudioContext; master: GainNode; engineGain: GainNode; engineOsc: OscillatorNode };
    let audio: AudioBox | null = null;
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
        filter.frequency.value = 720;
        const engineGain = ctx.createGain();
        engineGain.gain.value = 0;
        const engineOsc = ctx.createOscillator();
        engineOsc.type = "sawtooth";
        engineOsc.frequency.value = 56;
        engineOsc.connect(filter);
        filter.connect(engineGain);
        engineGain.connect(master);
        engineOsc.start();
        audio = { ctx, master, engineGain, engineOsc };
      } catch {
        audio = null;
      }
    };
    const blip = () => {
      if (!audio || mutedRef.current) return;
      const { ctx, master } = audio;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "triangle";
      o.frequency.setValueAtTime(920, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(1840, ctx.currentTime + 0.09);
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.24, ctx.currentTime + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
      o.connect(g);
      g.connect(master);
      o.start();
      o.stop(ctx.currentTime + 0.22);
    };
    const thud = () => {
      if (!audio || mutedRef.current) return;
      const { ctx, master } = audio;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(180, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(46, ctx.currentTime + 0.18);
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.34, ctx.currentTime + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.28);
      o.connect(g);
      g.connect(master);
      o.start();
      o.stop(ctx.currentTime + 0.3);
    };
    audioApiRef.current = {
      setMuted: (m: boolean) => {
        if (audio) audio.master.gain.value = m ? 0 : 0.5;
      },
    };

    // ---- state ----
    const st = {
      phase: "idle" as Phase,
      x: 0,
      z: HALF - 60,
      y: 30,
      yaw: 0,
      speed: 0,
      lumen: 0,
      turn: PILOTS.mara.turn,
      accel: PILOTS.mara.accel,
      top: PILOTS.mara.top,
      keys: new Set<string>(),
      last: 0,
      t: 0,
      hudAcc: 0,
      camX: 0,
      camY: 45,
      camZ: HALF,
      wanted: 0, // PANOPT attention, 0..100
      shake: 0, // decaying camera jolt on impact
    };

    const applyChar = (c: CharId) => {
      const p = PILOTS[c];
      st.turn = p.turn;
      st.accel = p.accel;
      st.top = p.top;
      hullMat.emissive.setHex(p.color);
      tintCraft(p.color);
    };

    const doStart = () => {
      st.phase = "playing";
      st.keys.clear();
      st.x = 0;
      st.z = HALF - 60;
      st.y = 30;
      st.yaw = 0; // face into the district (-Z)
      st.speed = 0;
      st.lumen = 0;
      st.wanted = 0;
      applyChar(charRef.current);
      for (const o of orbs) {
        o.taken = false;
        o.mesh.visible = true;
      }
      for (const d of drones) {
        d.active = false;
        d.mesh.visible = false;
      }
      ensureAudio();
      if (audio) {
        void audio.ctx.resume?.();
        audio.engineGain.gain.value = mutedRef.current ? 0 : 0.05;
      }
      setHud({ lumen: 0, speed: 0, wanted: 0 });
    };
    apiRef.current = {
      start: doStart,
      setChar: (c) => {
        if (st.phase === "playing") applyChar(c);
      },
    };

    // minimap
    const mctx = mini.getContext("2d");
    const drawMini = () => {
      if (!mctx) return;
      const s = mini.width;
      mctx.clearRect(0, 0, s, s);
      mctx.fillStyle = "rgba(5,4,12,0.72)";
      mctx.fillRect(0, 0, s, s);
      const toMap = (wx: number, wz: number) => [
        ((wx + HALF) / (HALF * 2)) * s,
        ((wz + HALF) / (HALF * 2)) * s,
      ];
      // buildings
      mctx.fillStyle = "rgba(103,232,249,0.28)";
      for (const t of towers) {
        const [mx, mz] = toMap(t.x, t.z);
        mctx.fillRect(mx - 1.5, mz - 1.5, 3, 3);
      }
      // orbs
      for (const o of orbs) {
        if (o.taken) continue;
        const [mx, mz] = toMap(o.x, o.z);
        mctx.fillStyle = "#fcd34d";
        mctx.beginPath();
        mctx.arc(mx, mz, 2.6, 0, Math.PI * 2);
        mctx.fill();
      }
      // PANOPT drones
      for (const d of drones) {
        if (!d.active) continue;
        const [mx, mz] = toMap(d.x, d.z);
        mctx.fillStyle = "#f0abfc";
        mctx.beginPath();
        mctx.arc(mx, mz, 3, 0, Math.PI * 2);
        mctx.fill();
      }
      // player triangle
      const [px, pz] = toMap(st.x, st.z);
      mctx.save();
      mctx.translate(px, pz);
      mctx.rotate(st.yaw);
      mctx.fillStyle = "#67e8f9";
      mctx.beginPath();
      mctx.moveTo(0, -6);
      mctx.lineTo(4, 5);
      mctx.lineTo(-4, 5);
      mctx.closePath();
      mctx.fill();
      mctx.restore();
      mctx.strokeStyle = "rgba(240,171,252,0.5)";
      mctx.strokeRect(0.5, 0.5, s - 1, s - 1);
    };

    let raf = 0;
    const frame = (ts: number) => {
      if (!st.last) st.last = ts;
      const dt = Math.min(0.05, (ts - st.last) / 1000);
      st.last = ts;
      st.t += dt;

      if (st.phase === "playing") {
        const k = st.keys;
        const turn = st.turn;
        if (k.has("left")) st.yaw += turn * dt;
        if (k.has("right")) st.yaw -= turn * dt;
        if (k.has("fwd")) st.speed = Math.min(st.top, st.speed + st.accel * dt);
        else if (k.has("back")) st.speed = Math.max(-st.top * 0.4, st.speed - st.accel * dt);
        else st.speed *= 1 - Math.min(1, dt * 0.8); // drag
        if (k.has("up")) st.y = Math.min(140, st.y + 46 * dt);
        if (k.has("down")) st.y = Math.max(8, st.y - 46 * dt);

        const fx = Math.sin(st.yaw);
        const fz = -Math.cos(st.yaw);
        st.x += fx * st.speed * dt;
        st.z += fz * st.speed * dt;
        // soft boundary
        const r = Math.hypot(st.x, st.z);
        if (r > HALF) {
          st.x *= HALF / r;
          st.z *= HALF / r;
          st.speed *= 0.5;
        }

        // building collision — only when below the roofline (fly over to pass).
        // Push the craft out along its shallowest overlap axis and scrub speed.
        const CR = 4.2; // craft half-extent
        for (const t of towers) {
          if (st.y > t.h + 1.5) continue; // clear the roof → no collision
          const halfW = t.w / 2 + CR;
          const halfD = t.d / 2 + CR;
          const dx = st.x - t.x;
          const dz = st.z - t.z;
          if (Math.abs(dx) < halfW && Math.abs(dz) < halfD) {
            const hit = Math.abs(st.speed) > 26;
            const px = halfW - Math.abs(dx);
            const pz = halfD - Math.abs(dz);
            if (px < pz) st.x = t.x + Math.sign(dx || 1) * halfW;
            else st.z = t.z + Math.sign(dz || 1) * halfD;
            st.speed *= 0.28;
            if (hit) {
              thud();
              st.shake = 0.5; // brief camera jolt
            }
          }
        }

        // collect
        for (const o of orbs) {
          if (o.taken) continue;
          const dx = o.x - st.x;
          const dz = o.z - st.z;
          const dy = o.y - st.y;
          if (dx * dx + dz * dz + dy * dy < 100) {
            o.taken = true;
            o.mesh.visible = false;
            o.beam.visible = false;
            fireBurst(o.x, o.y, o.z);
            st.lumen += 1;
            st.wanted = Math.min(100, st.wanted + 22); // stealing draws PANOPT
            blip();
            if (st.lumen >= LUMEN_TOTAL) {
              st.phase = "cleared";
              const prev = Number(window.localStorage.getItem(BEST_KEY) || "0") || 0;
              const nb = prev + 1;
              window.localStorage.setItem(BEST_KEY, String(nb));
              setBest(nb);
              setPhase("cleared");
              if (audio) audio.engineGain.gain.value = 0;
            }
          }
        }

        // PANOPT wanted level: decays high in the sky (you shed heat above 100),
        // otherwise creeps up slowly. Drones spawn to match the level.
        if (st.phase === "playing") {
          if (st.y > 100) st.wanted = Math.max(0, st.wanted - 14 * dt);
          else st.wanted = Math.min(100, st.wanted + 1.2 * dt);

          const want = Math.floor(st.wanted / 25); // 0..4 drones
          let live = 0;
          for (const d of drones) if (d.active) live++;
          if (live < want) {
            // spawn a drone at the district edge behind the craft
            const d = drones.find((q) => !q.active);
            if (d) {
              const a = Math.random() * Math.PI * 2;
              d.x = st.x + Math.cos(a) * 180;
              d.z = st.z + Math.sin(a) * 180;
              d.y = st.y + rand(-10, 20);
              d.active = true;
              d.mesh.visible = true;
            }
          } else if (live > want) {
            for (const d of drones)
              if (d.active) {
                d.active = false;
                d.mesh.visible = false;
                break;
              }
          }

          // home the drones; catch = game over
          const droneSpeed = 46 + want * 4;
          for (const d of drones) {
            if (!d.active) continue;
            const ddx = st.x - d.x;
            const ddy = st.y - d.y;
            const ddz = st.z - d.z;
            const dist = Math.hypot(ddx, ddy, ddz) || 1;
            d.x += (ddx / dist) * droneSpeed * dt;
            d.y += (ddy / dist) * droneSpeed * dt;
            d.z += (ddz / dist) * droneSpeed * dt;
            d.mesh.position.set(d.x, d.y, d.z);
            d.mesh.rotation.y += dt * 2.2; // eye sweeps like a searchlight
            d.mesh.position.y += Math.sin(st.t * 3 + d.x) * 0.02; // hover bob
            if (dist < 7 && st.phase === "playing") {
              st.phase = "over";
              if (audio) audio.engineGain.gain.value = 0;
              setPhase("over");
            }
          }
        }

        if (audio && !mutedRef.current)
          audio.engineOsc.frequency.value = 50 + Math.abs(st.speed) * 0.5;

        st.hudAcc += dt;
        if (st.hudAcc > 0.12) {
          st.hudAcc = 0;
          setHud({
            lumen: st.lumen,
            speed: Math.round(Math.abs(st.speed)),
            wanted: Math.round(st.wanted),
          });
        }
      }

      // craft transform
      ship.position.set(st.x, st.y, st.z);
      ship.rotation.y = Math.PI - st.yaw;
      ship.rotation.z = (st.keys.has("left") ? 0.22 : 0) - (st.keys.has("right") ? 0.22 : 0);

      // thruster trail: push the rear point, rebuild the tapered ribbon (width
      // and opacity scale with speed, so it vanishes at rest)
      {
        const fx = Math.sin(st.yaw);
        const fz = -Math.cos(st.yaw);
        trailHist.unshift([st.x - fx * 5, st.y - 0.4, st.z - fz * 5]);
        if (trailHist.length > TRAIL_N) trailHist.pop();
        const spd = Math.min(1, Math.abs(st.speed) / 42);
        const px = -fz;
        const pz = fx;
        for (let i = 0; i < TRAIL_N; i++) {
          const p = trailHist[Math.min(i, trailHist.length - 1)];
          const taper = 1 - i / TRAIL_N;
          const wdt = taper * 1.7 * spd + 0.15;
          trailPos[i * 6] = p[0] + px * wdt;
          trailPos[i * 6 + 1] = p[1];
          trailPos[i * 6 + 2] = p[2] + pz * wdt;
          trailPos[i * 6 + 3] = p[0] - px * wdt;
          trailPos[i * 6 + 4] = p[1];
          trailPos[i * 6 + 5] = p[2] - pz * wdt;
          const a = taper * taper * 0.55 * spd;
          trailAlpha[i * 2] = a;
          trailAlpha[i * 2 + 1] = a;
        }
        trailGeo.attributes.position.needsUpdate = true;
        trailGeo.attributes.aAlpha.needsUpdate = true;
      }

      // chase camera — low and close so the hero car fills the frame
      const bx = Math.sin(st.yaw);
      const bz = -Math.cos(st.yaw);
      const tX = st.x - bx * 14.5;
      const tZ = st.z - bz * 14.5;
      const tY = st.y + 6.2;
      st.camX += (tX - st.camX) * Math.min(1, dt * 3);
      st.camY += (tY - st.camY) * Math.min(1, dt * 3);
      st.camZ += (tZ - st.camZ) * Math.min(1, dt * 3);
      let sh = 0;
      if (st.shake > 0) {
        st.shake = Math.max(0, st.shake - dt * 1.6);
        sh = st.shake * 2.2 * Math.sin(st.t * 60);
      }
      camera.position.set(st.camX + sh, st.camY + sh * 0.6, st.camZ);
      camera.lookAt(st.x + bx * 16, st.y + 1.0, st.z + bz * 16);

      for (const o of orbs) if (!o.taken) o.mesh.rotation.y += dt * 1.5;
      beamMat.opacity = 0.1 + Math.sin(st.t * 2) * 0.045; // beams breathe
      for (const b of bursts) {
        if (!b.active) continue;
        b.t += dt;
        const k = b.t / 0.5;
        if (k >= 1) {
          b.active = false;
          b.mesh.visible = false;
          continue;
        }
        b.mesh.scale.setScalar(1 + k * 7);
        b.mat.opacity = 0.95 * (1 - k);
        b.mesh.lookAt(camera.position); // billboard toward the camera
      }
      ring.rotation.z += dt * 0.05;

      // rain: rain the streaks down and re-seed any that pass the camera
      if (RAIN_N > 0) {
        const cx = camera.position.x;
        const cy = camera.position.y;
        const cz = camera.position.z;
        const fall = 165 * dt;
        const arr = rainGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < RAIN_N; i++) {
          const b = i * 6;
          let y = arr[b + 1] - fall;
          if (y < cy - 55 || Math.abs(arr[b] - cx) > RAIN_SPREAD || Math.abs(arr[b + 2] - cz) > RAIN_SPREAD) {
            const nx = cx + rand(-RAIN_SPREAD, RAIN_SPREAD);
            const nz = cz + rand(-RAIN_SPREAD, RAIN_SPREAD);
            y = cy + rand(70, RAIN_TOP);
            arr[b] = nx;
            arr[b + 2] = nz;
            arr[b + 3] = nx;
            arr[b + 5] = nz;
          }
          arr[b + 1] = y;
          arr[b + 4] = y - RAIN_LEN;
        }
        rainGeo.attributes.position.needsUpdate = true;
      }

      // NPC traffic: cruise their lane and recycle around the player
      for (let i = 0; i < npcs.length; i++) {
        const n = npcs[i];
        n.x += n.vx * dt;
        n.z += n.vz * dt;
        if (n.x - st.x > NPC_RANGE) n.x -= NPC_RANGE * 2;
        else if (st.x - n.x > NPC_RANGE) n.x += NPC_RANGE * 2;
        if (n.z - st.z > NPC_RANGE) n.z -= NPC_RANGE * 2;
        else if (st.z - n.z > NPC_RANGE) n.z += NPC_RANGE * 2;
        n.mesh.position.set(n.x, n.y, n.z);
      }

      gradePass.uniforms.uTime.value = st.t * 55;
      composer.render();
      drawMini();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    // input
    const map: Record<string, string> = {
      ArrowLeft: "left", KeyA: "left",
      ArrowRight: "right", KeyD: "right",
      ArrowUp: "fwd", KeyW: "fwd",
      ArrowDown: "back", KeyS: "back",
      Space: "up", ShiftLeft: "down", ShiftRight: "down",
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.code === "Enter" || e.code === "Space") && st.phase !== "playing") {
        start();
        e.preventDefault();
        return;
      }
      const m = map[e.code];
      if (m) {
        st.keys.add(m);
        e.preventDefault();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const m = map[e.code];
      if (m) st.keys.delete(m);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    // Touch controls: a virtual joystick (steer + throttle) and altitude
    // buttons, feeding the same st.keys the keyboard uses so the sim is shared.
    const touchCleanup: Array<() => void> = [];
    const joy = joyRef.current;
    const knob = knobRef.current;
    if (joy && knob) {
      let joyId: number | null = null;
      const clearMove = () => {
        st.keys.delete("left");
        st.keys.delete("right");
        st.keys.delete("fwd");
        st.keys.delete("back");
      };
      const moveTo = (clientX: number, clientY: number) => {
        const r = joy.getBoundingClientRect();
        const max = r.width / 2;
        let dx = clientX - (r.left + max);
        let dy = clientY - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy) || 1;
        if (d > max) {
          dx = (dx / d) * max;
          dy = (dy / d) * max;
        }
        knob.style.transform = `translate(${dx}px, ${dy}px)`;
        const nx = dx / max;
        const ny = dy / max;
        clearMove();
        if (nx < -0.32) st.keys.add("left");
        else if (nx > 0.32) st.keys.add("right");
        if (ny < -0.32) st.keys.add("fwd");
        else if (ny > 0.32) st.keys.add("back");
      };
      const onDown = (e: PointerEvent) => {
        joyId = e.pointerId;
        joy.setPointerCapture(e.pointerId);
        moveTo(e.clientX, e.clientY);
        e.preventDefault();
      };
      const onMove = (e: PointerEvent) => {
        if (joyId === null || e.pointerId !== joyId) return;
        moveTo(e.clientX, e.clientY);
        e.preventDefault();
      };
      const onUp = (e: PointerEvent) => {
        if (joyId !== null && e.pointerId !== joyId) return;
        joyId = null;
        knob.style.transform = "";
        clearMove();
      };
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
    const bindHold = (el: HTMLElement | null, keyName: string) => {
      if (!el) return;
      const d = (e: PointerEvent) => {
        st.keys.add(keyName);
        e.preventDefault();
      };
      const u = () => st.keys.delete(keyName);
      el.addEventListener("pointerdown", d);
      el.addEventListener("pointerup", u);
      el.addEventListener("pointerleave", u);
      el.addEventListener("pointercancel", u);
      touchCleanup.push(() => {
        el.removeEventListener("pointerdown", d);
        el.removeEventListener("pointerup", u);
        el.removeEventListener("pointerleave", u);
        el.removeEventListener("pointercancel", u);
      });
    };
    bindHold(upRef.current, "up");
    bindHold(downRef.current, "down");

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
      touchCleanup.forEach((fn) => fn());
      composer.dispose();
      renderer.dispose();
      boxGeo.dispose();
      buildMat.dispose();
      capMat.dispose();
      stripMat.dispose();
      bbGeo.dispose();
      signTex.forEach((t) => t.dispose());
      signMat.forEach((m) => m.dispose());
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
      if (cycloTex) cycloTex.dispose();
      if (envRT) envRT.dispose();
      pmrem.dispose();
      if (audio) {
        try {
          audio.engineOsc.stop();
          void audio.ctx.close();
        } catch {
          /* closed */
        }
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

        {/* minimap */}
        <canvas
          ref={miniRef}
          width={150}
          height={150}
          className={`absolute end-3 bottom-3 h-[110px] w-[110px] rounded-md border border-line/80 md:h-[150px] md:w-[150px] ${
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
            aria-label="yön ve gaz"
            className="absolute bottom-4 left-4 size-28 rounded-full border border-neon-cyan/40 bg-void/40 backdrop-blur-sm"
            style={{ pointerEvents: "auto", touchAction: "none" }}
          >
            <div
              ref={knobRef}
              className="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-neon-cyan/70 bg-neon-cyan/20 shadow-[0_0_20px_oklch(0.82_0.13_205/45%)]"
            />
          </div>
          <div className="absolute end-3 top-1/2 flex -translate-y-1/2 flex-col gap-3">
            <button
              ref={upRef}
              type="button"
              aria-label="yüksel"
              className="size-14 rounded-full border border-neon-cyan/50 bg-void/50 font-mono text-lg text-neon-cyan backdrop-blur-sm active:bg-neon-cyan/25"
              style={{ pointerEvents: "auto", touchAction: "none" }}
            >
              ▲
            </button>
            <button
              ref={downRef}
              type="button"
              aria-label="alçal"
              className="size-14 rounded-full border border-neon-cyan/50 bg-void/50 font-mono text-lg text-neon-cyan backdrop-blur-sm active:bg-neon-cyan/25"
              style={{ pointerEvents: "auto", touchAction: "none" }}
            >
              ▼
            </button>
          </div>
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
              WebGL <span className="text-neon-magenta">✕</span> — {game.gameOverHint}
            </p>
          </div>
        )}

        {webgl && phase === "playing" && (
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3 font-mono text-[11px] tracking-[0.18em] uppercase md:p-4 md:text-xs">
            <div className="flex gap-4">
              <span className="text-dim">
                {game.lumen}{" "}
                <b className="text-neon-amber">
                  {hud.lumen}/{LUMEN_TOTAL}
                </b>
              </span>
              <span className="text-dim">
                {game.distance} <b className="text-ghost">{hud.speed}</b>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={hud.wanted > 60 ? "text-neon-magenta" : "text-dim"}>
                {game.threat}
              </span>
              <span className="relative block h-1.5 w-20 overflow-hidden rounded-full bg-carbon md:w-28">
                <span
                  className="absolute inset-y-0 start-0 bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-amber transition-[width] duration-200"
                  style={{ width: `${hud.wanted}%` }}
                />
              </span>
            </div>
          </div>
        )}

        {webgl && phase === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3.5 overflow-y-auto bg-void/60 px-4 py-6 text-center backdrop-blur-[2px] md:gap-5 md:px-6">
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

        {webgl && phase === "cleared" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-void/80 px-6 text-center backdrop-blur-[2px]">
            <span className="font-mono text-[11px] tracking-[0.42em] text-neon-cyan uppercase">
              {game.cleared}
            </span>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] tracking-[0.2em] text-dim uppercase">
                {game.lumen}
              </span>
              <span className="font-display text-5xl font-black text-neon-amber">
                {LUMEN_TOTAL}/{LUMEN_TOTAL}
              </span>
            </div>
            <button
              type="button"
              onClick={start}
              className="mt-1 border border-neon-cyan/60 bg-neon-cyan/10 px-8 py-3 font-mono text-sm font-semibold tracking-[0.24em] text-neon-cyan uppercase transition-colors hover:bg-neon-cyan/20"
            >
              {game.restart}
            </button>
          </div>
        )}

        {webgl && phase === "over" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-void/80 px-6 text-center backdrop-blur-[2px]">
            <span className="font-mono text-[11px] tracking-[0.42em] text-neon-magenta uppercase">
              {game.gameOver}
            </span>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] tracking-[0.2em] text-dim uppercase">
                {game.lumen}
              </span>
              <span className="font-display text-5xl font-black text-ghost">
                {hud.lumen}/{LUMEN_TOTAL}
              </span>
            </div>
            <p className="max-w-sm text-sm text-dim">{game.gameOverHint}</p>
            <button
              type="button"
              onClick={start}
              className="mt-1 border border-neon-cyan/60 bg-neon-cyan/10 px-8 py-3 font-mono text-sm font-semibold tracking-[0.24em] text-neon-cyan uppercase transition-colors hover:bg-neon-cyan/20"
            >
              {game.restart}
            </button>
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
          {best > 0 ? `${game.best}: ${best}` : ""}
        </span>
      </div>
    </div>
  );
}
