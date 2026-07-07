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
import { asset } from "@/lib/asset";
import type { CharacterCopy, Dictionary } from "@/lib/i18n/dictionary";

/**
 * LUMENFALL — first-person city walk. Roam the neon streets of the district on
 * foot: WASD to walk and strafe, mouse-look (pointer-lock) on desktop or
 * drag-to-look on touch, sprint with Shift. No objectives, no chase, no fail
 * state — a pure free-exploration demo inside the photoreal skybox city, with
 * living traffic overhead, pedestrians on the street, rain, a wet-asphalt
 * mirror, a live radar and per-district labelling. Rendered with three.js +
 * UnrealBloom and a cinematic grade pass.
 */

type Phase = "idle" | "playing";
type CharId = "mara" | "kaan" | "solene";

const HALF = 240; // district half-extent (world units)
const EYE = 2.35; // camera eye height above the street
const NEON = [0x67e8f9, 0xf0abfc, 0xfcd34d];

// Each protagonist you can embody — colour tints your HUD + personal light,
// and gives a subtle pace difference (Solène strides, Kaan is heavier).
const PILOTS: Record<CharId, { color: number; walk: number; sprint: number }> = {
  mara: { color: 0x67e8f9, walk: 9.5, sprint: 18 },
  kaan: { color: 0xfcd34d, walk: 8.6, sprint: 16 },
  solene: { color: 0xf0abfc, walk: 10.5, sprint: 20 },
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
  const [webgl, setWebgl] = useState(true);
  const [charId, setCharId] = useState<CharId>("mara");
  const [muted, setMuted] = useState(false);
  const charRef = useRef<CharId>("mara");
  const mutedRef = useRef(false);
  const audioApiRef = useRef<{ setMuted: (m: boolean) => void } | null>(null);
  const joyRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const sprintRef = useRef<HTMLButtonElement>(null);
  const [touch, setTouch] = useState(false);
  const [district, setDistrict] = useState("");

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
    // Show on-screen controls on any touch-capable OR phone-sized screen, so a
    // device never ends up playable-by-keyboard-only with no way to move.
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
    // Desktop (fine pointer, no touch) gets pointer-lock mouse-look; touch
    // devices look by dragging instead.
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
      "/images/lumenfall-skybox-3.webp",
      "/images/lumenfall-skybox-4.webp",
      "/images/lumenfall-skybox-5.webp",
      "/images/lumenfall-skybox-6.webp",
      "/images/lumenfall-skybox-7.webp",
      "/images/lumenfall-skybox-8.webp",
      "/images/lumenfall-skybox-9.webp",
      "/images/lumenfall-skybox-10.webp",
      "/images/lumenfall-skybox-11.webp",
      "/images/lumenfall-skybox-12.webp",
    ];
    const DISTRICTS = [
      "MERKEZ", "BULVAR", "NEON SOKAK", "ARA SOKAK", "PANOPT BÖLGESİ",
      "KANAL KIYISI", "NEON TÜNEL", "GÖK KÖPRÜSÜ", "LİMAN",
      "EĞLENCE BÖLGESİ", "TAPINAK", "ZİRVE",
    ];
    const skyIdx = Math.floor(Math.random() * SKYBOXES.length);
    const skySrc = SKYBOXES[skyIdx];
    setDistrict(DISTRICTS[skyIdx] ?? "");
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
      // keep sky-traffic clearly overhead of the walker (Blade-Runner lanes)
      const y = rand(16, 58);
      v.position.set(x, y, z);
      scene.add(v);
      npcs.push({ mesh: v, vx, vz, x, y, z });
    }

    // --- Pedestrian NPCs ----------------------------------------------------
    // Small glowing figures walking the streets (dark body + neon head + a
    // ground pool). They bob as they walk and recycle around the player.
    const pedBodyGeo = new THREE.CapsuleGeometry(0.32, 1.1, 4, 8);
    const pedHeadGeo = new THREE.SphereGeometry(0.28, 8, 8);
    const pedGlowGeo = new THREE.CircleGeometry(0.55, 12);
    const pedBodyMat = new THREE.MeshStandardMaterial({
      color: 0x0b0c14,
      metalness: 0.35,
      roughness: 0.6,
      envMapIntensity: 1.0,
    });
    const makePed = (hex: number) => {
      const g = new THREE.Group();
      const body = new THREE.Mesh(pedBodyGeo, pedBodyMat);
      body.position.y = 0.9;
      g.add(body);
      const head = new THREE.Mesh(pedHeadGeo, new THREE.MeshBasicMaterial({ color: hex }));
      head.position.y = 1.72;
      g.add(head);
      const glow = new THREE.Mesh(
        pedGlowGeo,
        new THREE.MeshBasicMaterial({
          color: hex,
          transparent: true,
          opacity: 0.4,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      glow.rotation.x = -Math.PI / 2;
      glow.position.y = 0.04;
      g.add(glow);
      return g;
    };
    const PED_N = lowPerf ? 10 : 26;
    const PED_RANGE = 120;
    const peds: {
      mesh: THREE.Group;
      vx: number;
      vz: number;
      x: number;
      z: number;
      ph: number;
    }[] = [];
    for (let i = 0; i < PED_N; i++) {
      const p = makePed(NEON[i % NEON.length]);
      const ang = Math.random() * Math.PI * 2;
      const spd = rand(3, 8);
      const x = rand(-PED_RANGE, PED_RANGE);
      const z = HALF - 60 + rand(-PED_RANGE, PED_RANGE);
      p.position.set(x, 0, z);
      scene.add(p);
      peds.push({ mesh: p, vx: Math.cos(ang) * spd, vz: Math.sin(ang) * spd, x, z, ph: Math.random() * 10 });
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

    // Personal light — a soft neon pool (in the protagonist's colour) that
    // travels with the walker, catching nearby pedestrians and the wet street
    // so you feel embodied in the scene rather than a floating camera.
    const playerLight = new THREE.PointLight(PILOTS[charRef.current].color, 3.2, 30, 2);
    playerLight.position.set(0, EYE + 1.5, 0);
    scene.add(playerLight);

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
    // A low ambient city drone that swells slightly while you walk, plus soft
    // footstep taps timed to the head-bob. No engine — this is a walk.
    type AudioBox = { ctx: AudioContext; master: GainNode; ambGain: GainNode; ambOsc: OscillatorNode };
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
        filter.frequency.value = 340;
        const ambGain = ctx.createGain();
        ambGain.gain.value = 0;
        const ambOsc = ctx.createOscillator();
        ambOsc.type = "sawtooth";
        ambOsc.frequency.value = 44;
        ambOsc.connect(filter);
        filter.connect(ambGain);
        ambGain.connect(master);
        ambOsc.start();
        audio = { ctx, master, ambGain, ambOsc };
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
      o.frequency.setValueAtTime(118, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(52, ctx.currentTime + 0.09);
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.16);
      o.connect(g);
      g.connect(master);
      o.start();
      o.stop(ctx.currentTime + 0.18);
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
      yaw: 0, // heading (0 = facing into the district, -Z)
      pitch: 0, // look up/down, clamped
      walk: PILOTS.mara.walk,
      sprint: PILOTS.mara.sprint,
      keys: new Set<string>(),
      last: 0,
      t: 0,
      bob: 0, // head-bob phase
      moveAmt: 0, // smoothed 0..1 "is walking" for bob/light
      speed: 0, // current planar speed (for radar/audio)
      step: 0, // distance since last footstep
    };

    const applyChar = (c: CharId) => {
      const p = PILOTS[c];
      st.walk = p.walk;
      st.sprint = p.sprint;
      playerLight.color.setHex(p.color);
    };

    const doStart = () => {
      st.phase = "playing";
      st.keys.clear();
      st.x = 0;
      st.z = HALF - 60;
      st.yaw = 0; // face into the district (-Z)
      st.pitch = 0;
      st.speed = 0;
      st.moveAmt = 0;
      st.step = 0;
      applyChar(charRef.current);
      ensureAudio();
      if (audio) {
        void audio.ctx.resume?.();
        audio.ambGain.gain.value = mutedRef.current ? 0 : 0.05;
      }
      // Desktop: capture the mouse for look. The Start-button click counts as
      // the user gesture, so the pointer-lock request is honoured.
      if (desktopLook) renderer.domElement.requestPointerLock?.();
    };
    apiRef.current = {
      start: doStart,
      setChar: (c) => {
        applyChar(c);
      },
    };

    // minimap
    const mctx = mini.getContext("2d");
    // Player-centred neon radar map: scrolling grid, building dots, live
    // pedestrian + sky-traffic blips, heading arrow fixed at centre, circular
    // frame + north tick.
    const drawMini = () => {
      if (!mctx) return;
      const s = mini.width;
      const cx = s / 2;
      const cy = s / 2;
      const rad = s / 2 - 2;
      const scale = rad / 135; // world-units of radius shown
      const w2m = (wx: number, wz: number): [number, number] => [
        cx + (wx - st.x) * scale,
        cy + (wz - st.z) * scale,
      ];
      mctx.clearRect(0, 0, s, s);
      mctx.save();
      mctx.beginPath();
      mctx.arc(cx, cy, rad, 0, Math.PI * 2);
      mctx.clip();
      const grd = mctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
      grd.addColorStop(0, "rgba(8,12,22,0.82)");
      grd.addColorStop(1, "rgba(3,3,9,0.94)");
      mctx.fillStyle = grd;
      mctx.fillRect(0, 0, s, s);
      // scrolling grid
      mctx.strokeStyle = "rgba(103,232,249,0.10)";
      mctx.lineWidth = 1;
      const gstep = 50 * scale;
      const ox = (((-st.x * scale) % gstep) + gstep) % gstep;
      const oz = (((-st.z * scale) % gstep) + gstep) % gstep;
      for (let gx = ox; gx < s; gx += gstep) {
        mctx.beginPath();
        mctx.moveTo(gx, 0);
        mctx.lineTo(gx, s);
        mctx.stroke();
      }
      for (let gz = oz; gz < s; gz += gstep) {
        mctx.beginPath();
        mctx.moveTo(0, gz);
        mctx.lineTo(s, gz);
        mctx.stroke();
      }
      // buildings
      mctx.fillStyle = "rgba(159,184,255,0.32)";
      for (const t of towers) {
        const [mx, mz] = w2m(t.x, t.z);
        mctx.fillRect(mx - 1.3, mz - 1.3, 2.6, 2.6);
      }
      // sky traffic (faint amber)
      mctx.fillStyle = "rgba(252,211,77,0.5)";
      for (const n of npcs) {
        const [mx, mz] = w2m(n.x, n.z);
        mctx.fillRect(mx - 1, mz - 1, 2, 2);
      }
      // pedestrians on the street (glowing cyan dots)
      mctx.shadowBlur = 5;
      mctx.shadowColor = "#67e8f9";
      mctx.fillStyle = "#a5f3fc";
      for (const p of peds) {
        const [mx, mz] = w2m(p.x, p.z);
        mctx.beginPath();
        mctx.arc(mx, mz, 1.7, 0, Math.PI * 2);
        mctx.fill();
      }
      mctx.shadowBlur = 0;
      mctx.restore();
      // player heading arrow, fixed at centre
      mctx.save();
      mctx.translate(cx, cy);
      mctx.rotate(st.yaw);
      mctx.shadowBlur = 8;
      mctx.shadowColor = "#67e8f9";
      mctx.fillStyle = "#67e8f9";
      mctx.beginPath();
      mctx.moveTo(0, -6.5);
      mctx.lineTo(4.5, 5);
      mctx.lineTo(-4.5, 5);
      mctx.closePath();
      mctx.fill();
      mctx.shadowBlur = 0;
      mctx.restore();
      // frame + north tick
      mctx.strokeStyle = "rgba(103,232,249,0.55)";
      mctx.lineWidth = 1.5;
      mctx.beginPath();
      mctx.arc(cx, cy, rad, 0, Math.PI * 2);
      mctx.stroke();
      mctx.fillStyle = "rgba(103,232,249,0.6)";
      mctx.font = "7px monospace";
      mctx.textAlign = "center";
      mctx.fillText("K", cx, 9);
    };

    let raf = 0;
    const frame = (ts: number) => {
      if (!st.last) st.last = ts;
      const dt = Math.min(0.05, (ts - st.last) / 1000);
      st.last = ts;
      st.t += dt;

      // world forward / right from the current heading (yaw = 0 faces -Z)
      const fX = Math.sin(st.yaw);
      const fZ = -Math.cos(st.yaw);
      const rX = Math.cos(st.yaw);
      const rZ = Math.sin(st.yaw);

      if (st.phase === "playing") {
        const k = st.keys;
        const sprinting = k.has("sprint");
        const spd = sprinting ? st.sprint : st.walk;

        // desired planar move from WASD (forward/back + strafe), normalised so
        // diagonals aren't faster
        const fwd = (k.has("fwd") ? 1 : 0) - (k.has("back") ? 1 : 0);
        const strafe = (k.has("strafeR") ? 1 : 0) - (k.has("strafeL") ? 1 : 0);
        let mx = fX * fwd + rX * strafe;
        let mz = fZ * fwd + rZ * strafe;
        const mlen = Math.hypot(mx, mz);
        const moving = mlen > 0.0001;
        if (moving) {
          mx /= mlen;
          mz /= mlen;
          const dist = spd * dt;
          st.x += mx * dist;
          st.z += mz * dist;
          st.speed = spd;
          // footsteps timed to distance walked
          st.step += dist;
          if (st.step > (sprinting ? 1.5 : 2.0)) {
            st.step = 0;
            footstep();
          }
        } else {
          st.speed = 0;
        }
        // smoothed walk amount drives head-bob + light breathing
        st.moveAmt += ((moving ? 1 : 0) - st.moveAmt) * Math.min(1, dt * 10);

        // soft boundary — keep the walker inside the district ring
        const rr = Math.hypot(st.x, st.z);
        if (rr > HALF) {
          st.x *= HALF / rr;
          st.z *= HALF / rr;
        }

        // building collision — the walker is always below the roofline, so every
        // tower is a solid wall. Push out along the shallowest overlap axis.
        const PR = 1.6; // person radius
        for (const t of towers) {
          const halfW = t.w / 2 + PR;
          const halfD = t.d / 2 + PR;
          const dx = st.x - t.x;
          const dz = st.z - t.z;
          if (Math.abs(dx) < halfW && Math.abs(dz) < halfD) {
            const px = halfW - Math.abs(dx);
            const pz = halfD - Math.abs(dz);
            if (px < pz) st.x = t.x + Math.sign(dx || 1) * halfW;
            else st.z = t.z + Math.sign(dz || 1) * halfD;
          }
        }

        // ambient city hum swells a touch while moving
        if (audio && !mutedRef.current)
          audio.ambGain.gain.value = 0.045 + st.moveAmt * 0.03;

        // advance the head-bob phase with pace + walk amount
        st.bob += dt * (sprinting ? 15 : 10) * st.moveAmt;
      }

      // --- first-person camera ------------------------------------------------
      // eye at head height with a subtle vertical bob + lateral sway; look
      // direction taken from yaw (heading) + pitch (up/down).
      const bobY = Math.sin(st.bob * 2) * 0.06 * st.moveAmt;
      const bobX = Math.cos(st.bob) * 0.05 * st.moveAmt;
      const eyeY = EYE + bobY;
      const camX = st.x + rX * bobX;
      const camZ = st.z + rZ * bobX;
      camera.position.set(camX, eyeY, camZ);
      const cp = Math.cos(st.pitch);
      camera.lookAt(
        camX + Math.sin(st.yaw) * cp,
        eyeY + Math.sin(st.pitch),
        camZ - Math.cos(st.yaw) * cp,
      );

      // personal neon pool follows the walker
      playerLight.position.set(st.x, EYE + 1.5, st.z);

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

      // pedestrians: walk + bob + recycle around the player
      for (let i = 0; i < peds.length; i++) {
        const p = peds[i];
        p.x += p.vx * dt;
        p.z += p.vz * dt;
        if (p.x - st.x > PED_RANGE) p.x -= PED_RANGE * 2;
        else if (st.x - p.x > PED_RANGE) p.x += PED_RANGE * 2;
        if (p.z - st.z > PED_RANGE) p.z -= PED_RANGE * 2;
        else if (st.z - p.z > PED_RANGE) p.z += PED_RANGE * 2;
        p.ph += dt * 8;
        p.mesh.position.set(p.x, Math.abs(Math.sin(p.ph)) * 0.12, p.z);
        p.mesh.rotation.y = Math.atan2(p.vx, p.vz);
      }

      gradePass.uniforms.uTime.value = st.t * 55;
      composer.render();
      drawMini();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    // input — WASD/arrows walk + strafe, Shift sprints; mouse (pointer-lock)
    // looks on desktop.
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

    // Desktop mouse-look via Pointer Lock. Clicking the canvas while playing
    // re-captures the mouse (Esc releases it); movement deltas drive yaw/pitch.
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

    // Touch look: dragging anywhere on the canvas (a pointer that isn't the
    // joystick — the joystick captures its own) turns the view.
    let lookId: number | null = null;
    let lookX = 0;
    let lookY = 0;
    const onLookDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" || st.phase !== "playing" || lookId !== null) return;
      lookId = e.pointerId;
      lookX = e.clientX;
      lookY = e.clientY;
    };
    const onLookMove = (e: PointerEvent) => {
      if (e.pointerId !== lookId) return;
      st.yaw += (e.clientX - lookX) * 0.005;
      st.pitch -= (e.clientY - lookY) * 0.005;
      st.pitch = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, st.pitch));
      lookX = e.clientX;
      lookY = e.clientY;
      e.preventDefault();
    };
    const onLookUp = (e: PointerEvent) => {
      if (e.pointerId === lookId) lookId = null;
    };
    if (!desktopLook) {
      canvasEl.addEventListener("pointerdown", onLookDown);
      canvasEl.addEventListener("pointermove", onLookMove);
      canvasEl.addEventListener("pointerup", onLookUp);
      canvasEl.addEventListener("pointercancel", onLookUp);
    }

    // Touch controls: a virtual joystick (walk + strafe) and a sprint hold,
    // feeding the same st.keys the keyboard uses so the sim is shared. Looking
    // is handled by drag-on-canvas above.
    const touchCleanup: Array<() => void> = [];
    const joy = joyRef.current;
    const knob = knobRef.current;
    if (joy && knob) {
      let joyId: number | null = null;
      const clearMove = () => {
        st.keys.delete("strafeL");
        st.keys.delete("strafeR");
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
        if (nx < -0.32) st.keys.add("strafeL");
        else if (nx > 0.32) st.keys.add("strafeR");
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
    bindHold(sprintRef.current, "sprint");

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
          audio.ambOsc.stop();
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
          className={`absolute end-3 bottom-3 h-[110px] w-[110px] rounded-full border border-neon-cyan/30 shadow-[0_0_20px_oklch(0.82_0.13_205/25%)] md:h-[140px] md:w-[140px] ${
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

        {webgl && phase === "playing" && district && (
          <div className="pointer-events-none absolute inset-x-0 top-9 flex justify-center md:top-11">
            <span className="rounded-full border border-neon-cyan/40 bg-void/50 px-4 py-1 font-mono text-[10px] tracking-[0.3em] text-neon-cyan uppercase backdrop-blur-sm md:text-xs">
              ◈ {district}
            </span>
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
