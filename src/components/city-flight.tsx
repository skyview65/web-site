"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import type { Dictionary } from "@/lib/i18n/dictionary";

/**
 * LUMENFALL — a real-time 3D flight through the neon megacity, rendered with
 * WebGL (three.js) and an UnrealBloom pass for the neon glow. You pilot a
 * hover-craft down a canyon avenue between emissive towers, weaving past
 * PANOPT drones and collecting Lümen as the city's threat climbs. Endless:
 * building rows recycle from behind the camera to the far horizon. Degrades
 * to a notice if WebGL is unavailable and eases its motion under
 * prefers-reduced-motion.
 */

type Phase = "idle" | "playing" | "over";

const BEST_KEY = "lumenfall_cityflight_best";
const NEON = [0x67e8f9, 0xf0abfc, 0xfcd34d];
const AVENUE = 22; // half-width the craft may roam laterally
const ROWS = 26;
const PER_SIDE = 3;
const SZ = 95; // row spacing along Z

interface Building {
  row: number;
  x: number;
  w: number;
  d: number;
  h: number;
  zj: number;
}

interface Mover {
  mesh: THREE.Object3D;
  z: number;
  x: number;
  y: number;
  active: boolean;
}

export function CityFlight({
  game,
  backHref,
}: {
  game: Dictionary["game"];
  backHref: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<{ start: () => void } | null>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const [hud, setHud] = useState({ meters: 0, lumen: 0 });
  const [best, setBest] = useState(0);
  const [result, setResult] = useState({ score: 0, best: 0, isNewBest: false });
  const [webgl, setWebgl] = useState(true);

  useEffect(() => {
    const raw =
      typeof window !== "undefined" ? window.localStorage.getItem(BEST_KEY) : null;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (raw) setBest(Number(raw) || 0);
  }, []);

  const start = useCallback(() => {
    apiRef.current?.start();
    setHud({ meters: 0, lumen: 0 });
    setPhase("playing");
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    const wrap = wrapRef.current;
    if (!mount || !wrap) return;

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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWebgl(false);
      return;
    }

    const sizeOf = () => {
      const w = wrap.clientWidth;
      const h = Math.max(320, Math.min(w * (9 / 16), window.innerHeight - 210));
      return { w, h };
    };
    let { w, h } = sizeOf();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "none";

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05030b);
    scene.fog = new THREE.FogExp2(0x06040e, 0.0019);

    const camera = new THREE.PerspectiveCamera(66, w / h, 0.1, 4000);
    camera.position.set(0, 13, 42);

    // lights — emissive materials do the heavy lifting; these shape the boxes
    scene.add(new THREE.AmbientLight(0x2a2740, 0.6));
    const hemi = new THREE.HemisphereLight(0xf0abfc, 0x0a1a2a, 0.5);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0x88aaff, 0.5);
    key.position.set(-40, 120, 60);
    scene.add(key);

    // ground with an emissive grid
    const grid = new THREE.GridHelper(6000, 300, 0x67e8f9, 0x14243a);
    const gm = grid.material as THREE.Material;
    gm.transparent = true;
    gm.opacity = 0.24;
    grid.position.y = 0;
    scene.add(grid);
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(6000, 6000),
      new THREE.MeshStandardMaterial({ color: 0x04040b, roughness: 0.9, metalness: 0.1 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.05;
    scene.add(floor);

    // buildings + neon caps as instanced meshes
    const COUNT = ROWS * PER_SIDE * 2;
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const buildMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a16,
      roughness: 0.55,
      metalness: 0.35,
      emissive: 0x0a0a1a,
      emissiveIntensity: 0.4,
    });
    const buildings = new THREE.InstancedMesh(boxGeo, buildMat, COUNT);
    buildings.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(buildings);

    const capMat = new THREE.MeshBasicMaterial({ vertexColors: true });
    const caps = new THREE.InstancedMesh(boxGeo, capMat, COUNT);
    caps.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(caps);

    // window strips: bright emissive slabs on building fronts
    const strips = new THREE.InstancedMesh(boxGeo, new THREE.MeshBasicMaterial({ vertexColors: true }), COUNT);
    strips.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(strips);

    const data: Building[] = [];
    const rowZ: number[] = [];
    for (let r = 0; r < ROWS; r++) rowZ[r] = 20 - r * SZ;

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const randomizeRow = (r: number) => {
      for (let side = 0; side < 2; side++) {
        for (let k = 0; k < PER_SIDE; k++) {
          const i = (r * 2 + side) * PER_SIDE + k;
          const dir = side === 0 ? -1 : 1;
          const lane = AVENUE + 8 + k * 30 + rand(0, 12);
          data[i] = {
            row: r,
            x: dir * lane,
            w: rand(12, 24),
            d: rand(12, 22),
            h: rand(18, 40 + k * 42),
            zj: rand(-34, 34),
          };
        }
      }
    };
    for (let r = 0; r < ROWS; r++) randomizeRow(r);

    const tmp = new THREE.Object3D();
    const colObj = new THREE.Color();
    const paintRow = (r: number) => {
      for (let side = 0; side < 2; side++) {
        for (let k = 0; k < PER_SIDE; k++) {
          const i = (r * 2 + side) * PER_SIDE + k;
          const neon = NEON[(i + r) % NEON.length];
          caps.setColorAt(i, colObj.setHex(neon));
          strips.setColorAt(i, colObj.setHex(neon));
        }
      }
    };
    for (let r = 0; r < ROWS; r++) paintRow(r);
    if (caps.instanceColor) caps.instanceColor.needsUpdate = true;
    if (strips.instanceColor) strips.instanceColor.needsUpdate = true;

    const layout = () => {
      for (let i = 0; i < COUNT; i++) {
        const b = data[i];
        const z = rowZ[b.row] + b.zj;
        tmp.position.set(b.x, b.h / 2, z);
        tmp.scale.set(b.w, b.h, b.d);
        tmp.rotation.set(0, 0, 0);
        tmp.updateMatrix();
        buildings.setMatrixAt(i, tmp.matrix);
        // neon cap
        tmp.position.set(b.x, b.h + 1.2, z);
        tmp.scale.set(b.w * 1.05, 2.4, b.d * 1.05);
        tmp.updateMatrix();
        caps.setMatrixAt(i, tmp.matrix);
        // window strip on the avenue-facing side
        const face = b.x > 0 ? b.x - b.w / 2 - 0.3 : b.x + b.w / 2 + 0.3;
        tmp.position.set(face, b.h * 0.52, z);
        tmp.scale.set(0.6, b.h * 0.84, b.d * 0.55);
        tmp.updateMatrix();
        strips.setMatrixAt(i, tmp.matrix);
      }
      buildings.instanceMatrix.needsUpdate = true;
      caps.instanceMatrix.needsUpdate = true;
      strips.instanceMatrix.needsUpdate = true;
    };
    layout();

    // orbital elevator — the LUMENFALL signature, a distant static landmark
    const elevator = new THREE.Group();
    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(6, 10, 1600, 16, 1, true),
      new THREE.MeshBasicMaterial({ color: 0x0b1420, side: THREE.DoubleSide }),
    );
    shaft.position.y = 800;
    elevator.add(shaft);
    for (let i = 0; i < 26; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(8 + (i % 3), 0.6, 8, 24),
        new THREE.MeshBasicMaterial({ color: NEON[i % 3] }),
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 40 + i * 58;
      elevator.add(ring);
    }
    const beam = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 1.2, 1600, 8),
      new THREE.MeshBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.5 }),
    );
    beam.position.y = 800;
    elevator.add(beam);
    elevator.position.set(150, 0, -1150);
    scene.add(elevator);

    // stars
    const starGeo = new THREE.BufferGeometry();
    const starN = 900;
    const starPos = new Float32Array(starN * 3);
    for (let i = 0; i < starN; i++) {
      starPos[i * 3] = rand(-2000, 2000);
      starPos[i * 3 + 1] = rand(200, 1400);
      starPos[i * 3 + 2] = rand(-2500, 400);
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0x9fb4ff, size: 2.4, sizeAttenuation: false, transparent: true, opacity: 0.8 }),
    );
    scene.add(stars);

    // traffic light-trails: emissive spheres cruising along side lanes
    const traffic: Mover[] = [];
    const sphereGeo = new THREE.SphereGeometry(0.7, 8, 8);
    for (let i = 0; i < 26; i++) {
      const m = new THREE.Mesh(
        sphereGeo,
        new THREE.MeshBasicMaterial({ color: i % 2 ? 0xfcd34d : 0xffffff }),
      );
      scene.add(m);
      traffic.push({
        mesh: m,
        z: rand(-1600, 40),
        x: (Math.random() > 0.5 ? 1 : -1) * rand(AVENUE - 4, AVENUE + 40),
        y: rand(2, 60),
        active: true,
      });
    }

    // the hover-craft
    const ship = new THREE.Group();
    const hull = new THREE.Mesh(
      new THREE.ConeGeometry(1.5, 6, 4),
      new THREE.MeshStandardMaterial({ color: 0x0a2230, emissive: 0x67e8f9, emissiveIntensity: 0.85, metalness: 0.6, roughness: 0.3 }),
    );
    hull.rotation.x = -Math.PI / 2;
    ship.add(hull);
    const wing = new THREE.Mesh(
      new THREE.BoxGeometry(7, 0.3, 2),
      new THREE.MeshStandardMaterial({ color: 0x10121e, emissive: 0xf0abfc, emissiveIntensity: 0.7, metalness: 0.7, roughness: 0.3 }),
    );
    wing.position.z = 1.2;
    ship.add(wing);
    for (const sx of [-2.4, 2.4]) {
      const th = new THREE.Mesh(
        new THREE.SphereGeometry(0.6, 10, 10),
        new THREE.MeshBasicMaterial({ color: 0xfcd34d }),
      );
      th.position.set(sx, 0, 2.4);
      ship.add(th);
    }
    ship.position.set(0, 10, 6);
    scene.add(ship);

    // pickups (Lümen) + drones
    const lumenGeo = new THREE.TorusGeometry(1.4, 0.42, 10, 6);
    const lumenMat = new THREE.MeshBasicMaterial({ color: 0xfcd34d });
    const lumens: Mover[] = [];
    for (let i = 0; i < 10; i++) {
      const m = new THREE.Mesh(lumenGeo, lumenMat);
      m.visible = false;
      scene.add(m);
      lumens.push({ mesh: m, z: 0, x: 0, y: 0, active: false });
    }
    const droneGeo = new THREE.OctahedronGeometry(2.1, 0);
    const droneMat = new THREE.MeshStandardMaterial({ color: 0x2a0a1e, emissive: 0xf0abfc, emissiveIntensity: 1.3, metalness: 0.5, roughness: 0.4 });
    const drones: Mover[] = [];
    for (let i = 0; i < 8; i++) {
      const m = new THREE.Mesh(droneGeo, droneMat);
      m.visible = false;
      scene.add(m);
      drones.push({ mesh: m, z: 0, x: 0, y: 0, active: false });
    }

    // crash particle burst
    const burstGeo = new THREE.BufferGeometry();
    const BURST = 120;
    const burstPos = new Float32Array(BURST * 3);
    const burstVel: THREE.Vector3[] = [];
    for (let i = 0; i < BURST; i++) burstVel.push(new THREE.Vector3());
    burstGeo.setAttribute("position", new THREE.BufferAttribute(burstPos, 3));
    const burst = new THREE.Points(
      burstGeo,
      new THREE.PointsMaterial({ color: 0x67e8f9, size: 3, sizeAttenuation: false, transparent: true, opacity: 1 }),
    );
    burst.visible = false;
    scene.add(burst);
    let burstLife = 0;

    // post-processing (bloom)
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(w, h),
      reduced ? 0.6 : 0.85,
      0.6,
      0.18,
    );
    composer.addPass(bloom);
    composer.addPass(new OutputPass());

    // state
    const st = {
      phase: "idle" as Phase,
      shipX: 0,
      shipY: 10,
      tx: 0,
      ty: 10,
      up: false,
      down: false,
      left: false,
      right: false,
      speed: 130,
      meters: 0,
      lumen: 0,
      last: 0,
      shake: 0,
      hudAcc: 0,
      droneTimer: 0,
      lumenTimer: 0,
      t: 0,
    };

    const spawnFromPool = (pool: Mover[], x: number, y: number) => {
      const m = pool.find((p) => !p.active);
      if (!m) return;
      m.active = true;
      m.mesh.visible = true;
      m.z = -1500;
      m.x = x;
      m.y = y;
      m.mesh.position.set(x, y, m.z);
    };

    const die = () => {
      if (st.phase !== "playing") return;
      st.phase = "over";
      // burst at ship
      for (let i = 0; i < BURST; i++) {
        burstPos[i * 3] = ship.position.x;
        burstPos[i * 3 + 1] = ship.position.y;
        burstPos[i * 3 + 2] = ship.position.z;
        burstVel[i].set(rand(-1, 1), rand(-1, 1), rand(-1, 1)).normalize().multiplyScalar(rand(20, 80));
      }
      burst.visible = true;
      burstLife = 1;
      ship.visible = false;
      if (!reduced) st.shake = 1;
      const score = Math.floor(st.meters) + st.lumen * 25;
      const prev = Number(window.localStorage.getItem(BEST_KEY) || "0") || 0;
      const isNewBest = score > prev;
      const nb = Math.max(prev, score);
      if (isNewBest) window.localStorage.setItem(BEST_KEY, String(nb));
      setBest(nb);
      setResult({ score, best: nb, isNewBest });
      setPhase("over");
    };

    const doStart = () => {
      st.phase = "playing";
      st.shipX = 0;
      st.shipY = 10;
      st.tx = 0;
      st.ty = 10;
      st.speed = 130;
      st.meters = 0;
      st.lumen = 0;
      st.shake = 0;
      st.droneTimer = 1.2;
      st.lumenTimer = 0.5;
      ship.visible = true;
      burst.visible = false;
      for (const d of drones) {
        d.active = false;
        d.mesh.visible = false;
      }
      for (const l of lumens) {
        l.active = false;
        l.mesh.visible = false;
      }
      setHud({ meters: 0, lumen: 0 });
    };
    apiRef.current = { start: doStart };

    const clock = { now: 0 };
    let raf = 0;

    const frame = (ts: number) => {
      if (!st.last) st.last = ts;
      const dt = Math.min(0.05, (ts - st.last) / 1000);
      st.last = ts;
      st.t += dt;

      if (st.phase === "playing") {
        const level = Math.floor(st.meters / 400);
        st.speed = 130 + level * 16;
        st.meters += st.speed * dt * 0.14;

        // steering
        const lat = 34;
        const vert = 26;
        if (st.left) st.tx -= lat * dt;
        if (st.right) st.tx += lat * dt;
        if (st.up) st.ty += vert * dt;
        if (st.down) st.ty -= vert * dt;
        st.tx = Math.max(-AVENUE, Math.min(AVENUE, st.tx));
        st.ty = Math.max(4, Math.min(70, st.ty));
        st.shipX += (st.tx - st.shipX) * Math.min(1, dt * 9);
        st.shipY += (st.ty - st.shipY) * Math.min(1, dt * 9);

        // move city rows toward camera
        for (let r = 0; r < ROWS; r++) {
          rowZ[r] += st.speed * dt;
          if (rowZ[r] > 80) {
            rowZ[r] -= ROWS * SZ;
            randomizeRow(r);
            paintRow(r);
          }
        }
        if (caps.instanceColor) caps.instanceColor.needsUpdate = true;
        if (strips.instanceColor) strips.instanceColor.needsUpdate = true;
        layout();

        // traffic
        for (const tr of traffic) {
          tr.z += st.speed * dt * 0.9;
          if (tr.z > 60) {
            tr.z = rand(-1700, -1200);
            tr.x = (Math.random() > 0.5 ? 1 : -1) * rand(AVENUE - 4, AVENUE + 40);
            tr.y = rand(2, 70);
          }
          tr.mesh.position.set(tr.x, tr.y, tr.z);
        }

        // spawn drones + lumens
        st.droneTimer -= dt;
        if (st.droneTimer <= 0) {
          st.droneTimer = Math.max(0.5, 1.5 - level * 0.08);
          spawnFromPool(drones, rand(-AVENUE, AVENUE), rand(6, 60));
        }
        st.lumenTimer -= dt;
        if (st.lumenTimer <= 0) {
          st.lumenTimer = rand(0.6, 1.1);
          spawnFromPool(lumens, rand(-AVENUE, AVENUE), rand(6, 60));
        }

        const sx = st.shipX;
        const sy = st.shipY;
        for (const d of drones) {
          if (!d.active) continue;
          d.z += st.speed * dt;
          d.mesh.position.set(d.x, d.y, d.z);
          d.mesh.rotation.y += dt * 2;
          d.mesh.rotation.x += dt * 1.4;
          if (d.z > 40) {
            d.active = false;
            d.mesh.visible = false;
          } else if (Math.abs(d.z - 6) < 4) {
            const dx = d.x - sx;
            const dy = d.y - sy;
            if (dx * dx + dy * dy < 9) die();
          }
        }
        for (const l of lumens) {
          if (!l.active) continue;
          l.z += st.speed * dt;
          l.mesh.position.set(l.x, l.y, l.z);
          l.mesh.rotation.z += dt * 3;
          l.mesh.rotation.x += dt * 2;
          if (l.z > 40) {
            l.active = false;
            l.mesh.visible = false;
          } else if (Math.abs(l.z - 6) < 4.5) {
            const dx = l.x - sx;
            const dy = l.y - sy;
            if (dx * dx + dy * dy < 12) {
              l.active = false;
              l.mesh.visible = false;
              st.lumen += 1;
            }
          }
        }

        st.hudAcc += dt;
        if (st.hudAcc > 0.12) {
          st.hudAcc = 0;
          setHud({ meters: Math.floor(st.meters), lumen: st.lumen });
        }
      }

      // ship transform + bank
      ship.position.set(st.shipX, st.shipY, 6);
      ship.rotation.z = (st.tx - st.shipX) * -0.05;
      ship.rotation.x = (st.ty - st.shipY) * -0.02;

      // camera follow
      const bob = reduced ? 0 : Math.sin(st.t * 1.4) * 0.4;
      const shX = st.shake > 0 && !reduced ? (Math.random() - 0.5) * st.shake * 3 : 0;
      const shY = st.shake > 0 && !reduced ? (Math.random() - 0.5) * st.shake * 3 : 0;
      camera.position.x += (st.shipX * 0.35 + shX - camera.position.x) * Math.min(1, dt * 4);
      camera.position.y += (st.shipY * 0.4 + 8 + bob + shY - camera.position.y) * Math.min(1, dt * 4);
      camera.position.z = 42;
      camera.lookAt(st.shipX * 0.5, st.shipY * 0.5 + 4, -80);
      if (st.shake > 0) st.shake = Math.max(0, st.shake - dt * 1.6);

      // rotate elevator rings for life
      elevator.rotation.y += dt * 0.05;

      // burst update
      if (burst.visible) {
        burstLife -= dt * 0.7;
        for (let i = 0; i < BURST; i++) {
          burstPos[i * 3] += burstVel[i].x * dt;
          burstPos[i * 3 + 1] += burstVel[i].y * dt;
          burstPos[i * 3 + 2] += burstVel[i].z * dt;
        }
        burstGeo.attributes.position.needsUpdate = true;
        (burst.material as THREE.PointsMaterial).opacity = Math.max(0, burstLife);
        if (burstLife <= 0) burst.visible = false;
      }

      // twinkle stars
      stars.rotation.y += dt * 0.006;

      clock.now = ts;
      composer.render();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    // input
    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case "ArrowLeft":
        case "KeyA":
          st.left = true;
          break;
        case "ArrowRight":
        case "KeyD":
          st.right = true;
          break;
        case "ArrowUp":
        case "KeyW":
          st.up = true;
          break;
        case "ArrowDown":
        case "KeyS":
          st.down = true;
          break;
        case "Space":
        case "Enter":
          if (st.phase !== "playing") start();
          break;
        default:
          return;
      }
      e.preventDefault();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft" || e.code === "KeyA") st.left = false;
      if (e.code === "ArrowRight" || e.code === "KeyD") st.right = false;
      if (e.code === "ArrowUp" || e.code === "KeyW") st.up = false;
      if (e.code === "ArrowDown" || e.code === "KeyS") st.down = false;
    };
    let dragging = false;
    const applyPointer = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      st.tx = nx * AVENUE;
      st.ty = 4 + (1 - (ny + 1) / 2) * 66;
    };
    const onPointerDown = (e: PointerEvent) => {
      if (st.phase !== "playing") {
        start();
        return;
      }
      dragging = true;
      applyPointer(e);
      renderer.domElement.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (dragging && st.phase === "playing") applyPointer(e);
    };
    const onPointerUp = () => {
      dragging = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    const dom = renderer.domElement;
    dom.addEventListener("pointerdown", onPointerDown);
    dom.addEventListener("pointermove", onPointerMove);
    dom.addEventListener("pointerup", onPointerUp);

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
      dom.removeEventListener("pointerdown", onPointerDown);
      dom.removeEventListener("pointermove", onPointerMove);
      dom.removeEventListener("pointerup", onPointerUp);
      composer.dispose();
      renderer.dispose();
      boxGeo.dispose();
      buildMat.dispose();
      capMat.dispose();
      if (dom.parentNode) dom.parentNode.removeChild(dom);
    };
  }, [start]);

  return (
    <div className="relative w-full">
      <div
        ref={wrapRef}
        className="relative w-full overflow-hidden rounded-xl border border-line bg-void"
      >
        <div ref={mountRef} className="block w-full" style={{ minHeight: 320 }} />

        {!webgl && (
          <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
            <p className="max-w-md text-sm text-dim">
              WebGL {" "}
              <span className="text-neon-magenta">✕</span> — {game.gameOverHint}
            </p>
          </div>
        )}

        {webgl && phase === "playing" && (
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3 font-mono text-[11px] tracking-[0.18em] uppercase md:p-4 md:text-xs">
            <div className="flex gap-4">
              <span className="text-dim">
                {game.distance} <b className="text-ghost">{hud.meters}m</b>
              </span>
              <span className="text-dim">
                {game.lumen} <b className="text-neon-amber">{hud.lumen}</b>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-dim">{game.threat}</span>
              <span className="relative block h-1.5 w-20 overflow-hidden rounded-full bg-carbon md:w-28">
                <span
                  className="absolute inset-y-0 start-0 bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-amber"
                  style={{ width: `${Math.min(100, Math.floor(hud.meters / 26))}%` }}
                />
              </span>
            </div>
          </div>
        )}

        {webgl && phase === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-void/55 px-6 text-center backdrop-blur-[2px]">
            <span className="font-mono text-[11px] tracking-[0.42em] text-neon-cyan uppercase">
              {game.eyebrow}
            </span>
            <h2 className="font-display text-4xl font-black tracking-[0.08em] text-ghost md:text-6xl">
              {game.title}
            </h2>
            <p className="max-w-md text-sm text-dim md:text-base">{game.tagline}</p>
            <button
              type="button"
              onClick={start}
              className="mt-1 border border-neon-cyan/60 bg-neon-cyan/10 px-8 py-3 font-mono text-sm font-semibold tracking-[0.24em] text-neon-cyan uppercase shadow-[0_0_28px_oklch(0.82_0.13_205_/_35%)] transition-colors hover:bg-neon-cyan/20"
            >
              {game.start}
            </button>
            <p className="mt-1 font-mono text-[11px] tracking-[0.16em] text-dim/80 uppercase">
              {game.controls}
            </p>
          </div>
        )}

        {webgl && phase === "over" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-void/75 px-6 text-center backdrop-blur-[2px]">
            <span className="font-mono text-[11px] tracking-[0.42em] text-neon-magenta uppercase">
              {game.gameOver}
            </span>
            <div className="flex items-end gap-8">
              <div className="flex flex-col">
                <span className="font-mono text-[10px] tracking-[0.2em] text-dim uppercase">
                  {game.score}
                </span>
                <span className="font-display text-5xl font-black text-ghost">
                  {result.score}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] tracking-[0.2em] text-dim uppercase">
                  {game.best}
                </span>
                <span className="font-display text-3xl font-bold text-neon-cyan">
                  {result.best}
                </span>
              </div>
            </div>
            {result.isNewBest && (
              <span className="font-mono text-xs tracking-[0.24em] text-neon-amber uppercase">
                ★ {game.newBest}
              </span>
            )}
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
