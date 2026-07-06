"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { asset } from "@/lib/asset";
import type { CharacterCopy, Dictionary } from "@/lib/i18n/dictionary";

/**
 * LUMENFALL — open-world milestone. A free-roam flight over a fixed neon
 * district: steer (yaw), throttle, climb; a live minimap; mid-run pilot
 * switching; and scattered Lümen objectives that clear the district. Rendered
 * with three.js + UnrealBloom. This is the first real-game milestone beyond
 * the arcade runner; collision, driving mode and missions come next.
 */

type Phase = "idle" | "playing" | "cleared";
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
  const [hud, setHud] = useState({ lumen: 0, speed: 0 });
  const [best, setBest] = useState(0);
  const [webgl, setWebgl] = useState(true);
  const [charId, setCharId] = useState<CharId>("mara");
  const [muted, setMuted] = useState(false);
  const charRef = useRef<CharId>("mara");
  const mutedRef = useRef(false);
  const audioApiRef = useRef<{ setMuted: (m: boolean) => void } | null>(null);

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
  }, []);

  const start = useCallback(() => {
    apiRef.current?.start();
    setHud({ lumen: 0, speed: 0 });
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

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "none";

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05030b);
    scene.fog = new THREE.FogExp2(0x06040e, 0.0016);

    let skyTex: THREE.Texture | null = null;
    new THREE.TextureLoader().load(
      asset("/images/skybox-lumenfall.webp"),
      (tex) => {
        tex.mapping = THREE.EquirectangularReflectionMapping;
        tex.colorSpace = THREE.SRGBColorSpace;
        skyTex = tex;
        scene.background = tex;
        if (scene.fog) (scene.fog as THREE.FogExp2).density = 0.0011;
      },
      undefined,
      () => {},
    );

    const camera = new THREE.PerspectiveCamera(66, w / h, 0.1, 4000);

    scene.add(new THREE.AmbientLight(0x2a2740, 0.6));
    const hemi = new THREE.HemisphereLight(0xf0abfc, 0x0a1a2a, 0.5);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0x88aaff, 0.5);
    key.position.set(-40, 160, 60);
    scene.add(key);

    // ground + street grid
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(HALF * 3, HALF * 3),
      new THREE.MeshStandardMaterial({ color: 0x05050c, roughness: 0.85, metalness: 0.15 }),
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);
    const grid = new THREE.GridHelper(HALF * 2, 24, 0x67e8f9, 0x13233a);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.22;
    scene.add(grid);

    // window facade texture (shared)
    const makeFacade = () => {
      const cv = document.createElement("canvas");
      cv.width = 128;
      cv.height = 256;
      const cx = cv.getContext("2d");
      if (!cx) return new THREE.CanvasTexture(cv);
      cx.fillStyle = "#070710";
      cx.fillRect(0, 0, 128, 256);
      const hues = ["#67e8f9", "#f0abfc", "#fcd34d", "#a5f3fc", "#fde68a"];
      const cols = 6;
      const rows = 14;
      const cw2 = (128 - 4) / cols;
      const ch2 = (256 - 4) / rows;
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) {
          if (Math.random() < 0.46) cx.fillStyle = "#0c0c18";
          else {
            cx.fillStyle = hues[(Math.random() * hues.length) | 0];
            cx.globalAlpha = 0.55 + Math.random() * 0.45;
          }
          cx.fillRect(4 + c * cw2 + 1.5, 4 + r * ch2 + 1.5, cw2 - 3, ch2 - 3);
          cx.globalAlpha = 1;
        }
      const t = new THREE.CanvasTexture(cv);
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    };
    const facade = makeFacade();

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    // fixed district: a grid of towers with street gaps
    const towers: Tower[] = [];
    const step = 62;
    for (let gx = -HALF + 40; gx <= HALF - 40; gx += step)
      for (let gz = -HALF + 40; gz <= HALF - 40; gz += step) {
        if (Math.random() < 0.22) continue; // streets / plazas
        towers.push({
          x: gx + rand(-10, 10),
          z: gz + rand(-10, 10),
          w: rand(16, 30),
          d: rand(16, 30),
          h: rand(24, 92),
        });
      }
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const buildMat = new THREE.MeshStandardMaterial({
      color: 0x11131f,
      roughness: 0.5,
      metalness: 0.3,
      map: facade,
      emissive: 0xffffff,
      emissiveMap: facade,
      emissiveIntensity: 0.8,
    });
    const buildings = new THREE.InstancedMesh(boxGeo, buildMat, towers.length);
    const capMat = new THREE.MeshBasicMaterial();
    const caps = new THREE.InstancedMesh(boxGeo, capMat, towers.length);
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
      caps.setColorAt(i, colObj.setHex(NEON[i % NEON.length]));
    });
    buildings.instanceMatrix.needsUpdate = true;
    caps.instanceMatrix.needsUpdate = true;
    if (caps.instanceColor) caps.instanceColor.needsUpdate = true;
    scene.add(buildings);
    scene.add(caps);

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

    // Lümen objectives — fixed scattered positions
    const orbs: Orb[] = [];
    const orbGeo = new THREE.TorusGeometry(2.4, 0.7, 10, 8);
    const orbMat = new THREE.MeshBasicMaterial({ color: 0xfcd34d });
    for (let i = 0; i < LUMEN_TOTAL; i++) {
      const m = new THREE.Mesh(orbGeo, orbMat);
      const x = rand(-HALF + 30, HALF - 30);
      const z = rand(-HALF + 30, HALF - 30);
      const y = rand(14, 60);
      m.position.set(x, y, z);
      scene.add(m);
      orbs.push({ mesh: m, x, z, y, taken: false });
    }

    // the craft
    const ship = new THREE.Group();
    const hullMat = new THREE.MeshStandardMaterial({
      color: 0x0a2230,
      emissive: 0x67e8f9,
      emissiveIntensity: 1.0,
      metalness: 0.6,
      roughness: 0.3,
    });
    const hull = new THREE.Mesh(new THREE.ConeGeometry(1.6, 6.5, 4), hullMat);
    hull.rotation.x = Math.PI / 2;
    ship.add(hull);
    const wing = new THREE.Mesh(
      new THREE.BoxGeometry(7, 0.35, 2.2),
      new THREE.MeshStandardMaterial({ color: 0x10121e, emissive: 0xf0abfc, emissiveIntensity: 0.7, metalness: 0.7, roughness: 0.3 }),
    );
    wing.position.z = -1.2;
    ship.add(wing);
    scene.add(ship);

    // bloom
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(w, h), reduced ? 0.4 : 0.55, 0.5, 0.36);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());

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
    };

    const applyChar = (c: CharId) => {
      const p = PILOTS[c];
      st.turn = p.turn;
      st.accel = p.accel;
      st.top = p.top;
      hullMat.emissive.setHex(p.color);
    };

    const doStart = () => {
      st.phase = "playing";
      st.x = 0;
      st.z = HALF - 60;
      st.y = 30;
      st.yaw = 0; // face into the district (-Z)
      st.speed = 0;
      st.lumen = 0;
      applyChar(charRef.current);
      for (const o of orbs) {
        o.taken = false;
        o.mesh.visible = true;
      }
      ensureAudio();
      if (audio) {
        void audio.ctx.resume?.();
        audio.engineGain.gain.value = mutedRef.current ? 0 : 0.05;
      }
      setHud({ lumen: 0, speed: 0 });
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

        // collect
        for (const o of orbs) {
          if (o.taken) continue;
          const dx = o.x - st.x;
          const dz = o.z - st.z;
          const dy = o.y - st.y;
          if (dx * dx + dz * dz + dy * dy < 100) {
            o.taken = true;
            o.mesh.visible = false;
            st.lumen += 1;
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

        if (audio && !mutedRef.current)
          audio.engineOsc.frequency.value = 50 + Math.abs(st.speed) * 0.5;

        st.hudAcc += dt;
        if (st.hudAcc > 0.12) {
          st.hudAcc = 0;
          setHud({ lumen: st.lumen, speed: Math.round(Math.abs(st.speed)) });
        }
      }

      // craft transform
      ship.position.set(st.x, st.y, st.z);
      ship.rotation.y = Math.PI - st.yaw;
      ship.rotation.z = (st.keys.has("left") ? 0.22 : 0) - (st.keys.has("right") ? 0.22 : 0);

      // chase camera
      const bx = Math.sin(st.yaw);
      const bz = -Math.cos(st.yaw);
      const tX = st.x - bx * 26;
      const tZ = st.z - bz * 26;
      const tY = st.y + 11;
      st.camX += (tX - st.camX) * Math.min(1, dt * 3);
      st.camY += (tY - st.camY) * Math.min(1, dt * 3);
      st.camZ += (tZ - st.camZ) * Math.min(1, dt * 3);
      camera.position.set(st.camX, st.camY, st.camZ);
      camera.lookAt(st.x + bx * 20, st.y, st.z + bz * 20);

      for (const o of orbs) if (!o.taken) o.mesh.rotation.y += dt * 1.5;
      ring.rotation.z += dt * 0.05;

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
      if (e.code === "Enter" && st.phase !== "playing") {
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
      composer.dispose();
      renderer.dispose();
      boxGeo.dispose();
      buildMat.dispose();
      capMat.dispose();
      facade.dispose();
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
      if (skyTex) skyTex.dispose();
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
