"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionary";

/**
 * NEON KAÇIŞ — a self-contained canvas arcade game set in LUMENFALL.
 * You pilot a hover-bike down a neon canyon, threading the gaps in PANOPT
 * drone walls and grabbing Lümen while the city's threat level climbs.
 * No external assets or libraries: everything is drawn on a 2D canvas and
 * the loop degrades gracefully under prefers-reduced-motion.
 */

type Phase = "idle" | "playing" | "over";

interface Gate {
  x: number;
  gapYf: number; // gap centre as a fraction of the playfield
  gapHf: number; // gap height as a fraction of the playfield
  scored: boolean;
}

interface Token {
  x: number;
  yf: number;
  taken: boolean;
  spin: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  hue: string;
}

interface GameState {
  phase: Phase;
  W: number;
  H: number;
  dpr: number;
  playerY: number; // px
  targetY: number | null; // pointer target, px
  up: boolean;
  down: boolean;
  trail: { x: number; y: number }[];
  gates: Gate[];
  tokens: Token[];
  particles: Particle[];
  meters: number;
  lumen: number;
  speed: number; // playfield-widths per second
  nextGateAt: number; // metres
  shake: number;
  flash: number;
  bg: number; // scrolling background offset
  last: number; // timestamp
  reduced: boolean;
}

const BEST_KEY = "lumenfall_neonrun_best";
const ROAD_TOP = 0.08;
const ROAD_BOTTOM = 0.92;

function scoreOf(meters: number, lumen: number): number {
  return Math.floor(meters) + lumen * 25;
}

export function NeonRun({
  game,
  backHref,
}: {
  game: Dictionary["game"];
  backHref: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<GameState | null>(null);
  const rafRef = useRef<number>(0);

  const [phase, setPhase] = useState<Phase>("idle");
  const [hud, setHud] = useState({ meters: 0, lumen: 0 });
  const [best, setBest] = useState(0);
  const [result, setResult] = useState({ score: 0, best: 0, isNewBest: false });

  useEffect(() => {
    const raw =
      typeof window !== "undefined" ? window.localStorage.getItem(BEST_KEY) : null;
    // One-time sync of the persisted best score after hydration; runs post-paint
    // so there is no server/client mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (raw) setBest(Number(raw) || 0);
  }, []);

  const start = useCallback(() => {
    const s = stateRef.current;
    if (!s) return;
    s.phase = "playing";
    s.playerY = s.H / 2;
    s.targetY = null;
    s.up = false;
    s.down = false;
    s.trail = [];
    s.gates = [];
    s.tokens = [];
    s.particles = [];
    s.meters = 0;
    s.lumen = 0;
    s.speed = 0.5;
    s.nextGateAt = 26;
    s.shake = 0;
    s.flash = 0;
    setHud({ meters: 0, lumen: 0 });
    setPhase("playing");
  }, []);

  // Main loop + input wiring. Set up once; reads live state via the ref.
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const s: GameState = {
      phase: "idle",
      W: 0,
      H: 0,
      dpr: 1,
      playerY: 0,
      targetY: null,
      up: false,
      down: false,
      trail: [],
      gates: [],
      tokens: [],
      particles: [],
      meters: 0,
      lumen: 0,
      speed: 0.5,
      nextGateAt: 26,
      shake: 0,
      flash: 0,
      bg: 0,
      last: 0,
      reduced,
    };
    stateRef.current = s;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = wrap.clientWidth;
      const cssH = Math.max(
        260,
        Math.min(cssW * (9 / 16), window.innerHeight - 220),
      );
      s.W = cssW;
      s.H = cssH;
      s.dpr = dpr;
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      if (s.playerY === 0) s.playerY = cssH / 2;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const spawnParticles = (
      x: number,
      y: number,
      n: number,
      hue: string,
      spread: number,
    ) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = Math.random() * spread + spread * 0.3;
        s.particles.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: 0,
          max: 0.4 + Math.random() * 0.5,
          hue,
        });
      }
    };

    const die = () => {
      if (s.phase !== "playing") return;
      s.phase = "over";
      const px = s.W * 0.24;
      spawnParticles(px, s.playerY, reduced ? 14 : 40, "cyan", s.W * 0.9);
      if (!reduced) {
        s.shake = 16;
        s.flash = 1;
      }
      const score = scoreOf(s.meters, s.lumen);
      const prevBest =
        Number(window.localStorage.getItem(BEST_KEY) || "0") || 0;
      const isNewBest = score > prevBest;
      const newBest = Math.max(score, prevBest);
      if (isNewBest) window.localStorage.setItem(BEST_KEY, String(newBest));
      setBest(newBest);
      setResult({ score, best: newBest, isNewBest });
      setPhase("over");
    };

    const playfield = () => {
      const top = s.H * ROAD_TOP;
      const bottom = s.H * ROAD_BOTTOM;
      return { top, bottom, h: bottom - top };
    };

    let hudAcc = 0;

    const step = (dt: number) => {
      const { top, bottom, h } = playfield();
      const level = Math.floor(s.meters / 320);

      // difficulty ramp
      s.speed = 0.5 + level * 0.055;
      const pxPerSec = s.speed * s.W;
      s.meters += s.speed * 62 * dt;
      s.bg = (s.bg + pxPerSec * dt) % (s.W * 0.5);

      // player vertical control
      const pv = s.H * 1.25; // px/s
      const r = Math.max(9, Math.min(18, s.H * 0.03));
      if (s.targetY != null) {
        s.playerY += (s.targetY - s.playerY) * Math.min(1, dt * 12);
      } else {
        if (s.up) s.playerY -= pv * dt;
        if (s.down) s.playerY += pv * dt;
      }
      s.playerY = Math.max(top + r, Math.min(bottom - r, s.playerY));

      // trail
      const px = s.W * 0.24;
      s.trail.unshift({ x: px, y: s.playerY });
      if (s.trail.length > 14) s.trail.pop();

      // spawn gates
      if (s.meters >= s.nextGateAt) {
        const gapH = Math.max(0.2, 0.34 - level * 0.02);
        const prev = s.gates[s.gates.length - 1];
        let gapY = 0.15 + Math.random() * 0.7;
        if (prev) {
          const d = gapY - prev.gapYf;
          if (Math.abs(d) > 0.42) gapY = prev.gapYf + Math.sign(d) * 0.42;
        }
        s.gates.push({ x: s.W + 40, gapYf: gapY, gapHf: gapH, scored: false });
        // a Lümen token in the gap
        s.tokens.push({ x: s.W + 40, yf: gapY, taken: false, spin: 0 });
        const spacing = Math.max(52, 96 - level * 3);
        s.nextGateAt = s.meters + spacing;
      }

      // move + test gates
      const rx = px;
      for (const g of s.gates) {
        g.x -= pxPerSec * dt;
        const gw = Math.max(10, s.W * 0.016);
        const gapCenter = top + g.gapYf * h;
        const gapHalf = (g.gapHf * h) / 2;
        // collision
        if (rx + r > g.x && rx - r < g.x + gw) {
          if (s.playerY - r < gapCenter - gapHalf || s.playerY + r > gapCenter + gapHalf) {
            die();
          }
        }
        if (!g.scored && g.x + gw < rx - r) {
          g.scored = true;
          s.meters += 8; // clean-pass bonus
        }
      }
      s.gates = s.gates.filter((g) => g.x > -60);

      // tokens
      for (const t of s.tokens) {
        t.x -= pxPerSec * dt;
        t.spin += dt * 4;
        if (t.taken) continue;
        const ty = top + t.yf * h;
        const dx = rx - t.x;
        const dy = s.playerY - ty;
        if (dx * dx + dy * dy < (r + 12) * (r + 12)) {
          t.taken = true;
          s.lumen += 1;
          if (!reduced) s.flash = Math.min(1, s.flash + 0.25);
          spawnParticles(t.x, ty, reduced ? 6 : 16, "amber", s.W * 0.5);
        }
      }
      s.tokens = s.tokens.filter((t) => t.x > -40 && !t.taken);

      // particles
      for (const p of s.particles) {
        p.life += dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= 0.94;
        p.vy *= 0.94;
      }
      s.particles = s.particles.filter((p) => p.life < p.max);

      if (s.shake > 0) s.shake = Math.max(0, s.shake - dt * 40);
      if (s.flash > 0) s.flash = Math.max(0, s.flash - dt * 2.4);

      hudAcc += dt;
      if (hudAcc > 0.1) {
        hudAcc = 0;
        setHud({ meters: Math.floor(s.meters), lumen: s.lumen });
      }
    };

    const col = {
      void: "#07070c",
      cyan: "#67e8f9",
      magenta: "#f0abfc",
      amber: "#fcd34d",
      dim: "#4b4b5c",
    };

    const draw = () => {
      const { W, H } = s;
      const { top, bottom, h } = playfield();
      ctx.save();
      ctx.scale(s.dpr, s.dpr);
      ctx.clearRect(0, 0, W, H);

      // screen shake
      if (s.shake > 0) {
        ctx.translate(
          (Math.random() - 0.5) * s.shake,
          (Math.random() - 0.5) * s.shake,
        );
      }

      // background
      const threat = Math.min(1, s.meters / 2600);
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#05050a");
      g.addColorStop(0.5, `rgb(${9 + threat * 26},7,${16 + threat * 6})`);
      g.addColorStop(1, "#04040a");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      // parallax speed grid
      ctx.strokeStyle = "rgba(103,232,249,0.05)";
      ctx.lineWidth = 1;
      const gridStep = W * 0.08;
      const off = s.reduced ? 0 : s.bg % gridStep;
      for (let x = -off; x < W; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x, top);
        ctx.lineTo(x - W * 0.04, bottom);
        ctx.stroke();
      }

      // canyon edges (neon rails)
      ctx.shadowBlur = s.reduced ? 0 : 16;
      ctx.lineWidth = 2;
      ctx.strokeStyle = col.cyan;
      ctx.shadowColor = col.cyan;
      ctx.beginPath();
      ctx.moveTo(0, top);
      ctx.lineTo(W, top);
      ctx.stroke();
      ctx.strokeStyle = col.magenta;
      ctx.shadowColor = col.magenta;
      ctx.beginPath();
      ctx.moveTo(0, bottom);
      ctx.lineTo(W, bottom);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // tokens (hollow Lümen hexagons)
      for (const t of s.tokens) {
        if (t.taken) continue;
        const ty = top + t.yf * h;
        ctx.save();
        ctx.translate(t.x, ty);
        ctx.rotate(t.spin);
        ctx.strokeStyle = col.amber;
        ctx.shadowColor = col.amber;
        ctx.shadowBlur = s.reduced ? 0 : 12;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI / 3) * i - Math.PI / 2;
          const hx = Math.cos(a) * 8;
          const hy = Math.sin(a) * 8;
          if (i === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }
      ctx.shadowBlur = 0;

      // gates rendered as PANOPT drone walls with a gap
      const gw = Math.max(10, W * 0.016);
      for (const gate of s.gates) {
        const gapCenter = top + gate.gapYf * h;
        const gapHalf = (gate.gapHf * h) / 2;
        ctx.fillStyle = "rgba(240,171,252,0.14)";
        ctx.fillRect(gate.x, top, gw, gapCenter - gapHalf - top);
        ctx.fillRect(gate.x, gapCenter + gapHalf, gw, bottom - (gapCenter + gapHalf));
        // drone units along the wall
        ctx.fillStyle = col.magenta;
        ctx.shadowColor = col.magenta;
        ctx.shadowBlur = s.reduced ? 0 : 10;
        const unit = 15;
        for (let y = top + 8; y < gapCenter - gapHalf; y += unit) {
          ctx.fillRect(gate.x + gw / 2 - 3, y, 6, 6);
        }
        for (let y = gapCenter + gapHalf + 4; y < bottom - 6; y += unit) {
          ctx.fillRect(gate.x + gw / 2 - 3, y, 6, 6);
        }
        // gap edge markers
        ctx.shadowBlur = 0;
        ctx.strokeStyle = col.amber;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(gate.x - 4, gapCenter - gapHalf);
        ctx.lineTo(gate.x + gw + 4, gapCenter - gapHalf);
        ctx.moveTo(gate.x - 4, gapCenter + gapHalf);
        ctx.lineTo(gate.x + gw + 4, gapCenter + gapHalf);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      // player trail
      const px = W * 0.24;
      const r = Math.max(9, Math.min(18, H * 0.03));
      for (let i = s.trail.length - 1; i >= 0; i--) {
        const t = s.trail[i];
        const k = 1 - i / s.trail.length;
        ctx.fillStyle = `rgba(103,232,249,${k * 0.28})`;
        ctx.beginPath();
        ctx.arc(t.x - i * 3, t.y, r * (0.4 + k * 0.6), 0, Math.PI * 2);
        ctx.fill();
      }

      // player hover-bike (chevron)
      if (s.phase !== "over" || s.flash > 0.4) {
        ctx.save();
        ctx.translate(px, s.playerY);
        ctx.shadowColor = col.cyan;
        ctx.shadowBlur = s.reduced ? 4 : 18;
        ctx.fillStyle = col.cyan;
        ctx.beginPath();
        ctx.moveTo(r * 1.3, 0);
        ctx.lineTo(-r, -r * 0.8);
        ctx.lineTo(-r * 0.4, 0);
        ctx.lineTo(-r, r * 0.8);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // particles
      for (const p of s.particles) {
        const k = 1 - p.life / p.max;
        ctx.fillStyle =
          p.hue === "amber"
            ? `rgba(252,211,77,${k})`
            : `rgba(103,232,249,${k})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.4 * k + 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // hit flash
      if (s.flash > 0 && !s.reduced) {
        ctx.fillStyle = `rgba(240,171,252,${s.flash * 0.22})`;
        ctx.fillRect(0, 0, W, H);
      }

      ctx.restore();
    };

    const frame = (ts: number) => {
      if (!s.last) s.last = ts;
      const dt = Math.min(0.05, (ts - s.last) / 1000);
      s.last = ts;
      if (s.phase === "playing") step(dt);
      else {
        // idle/over: keep particles + background alive
        s.bg = (s.bg + s.W * 0.12 * dt) % (s.W * 0.5);
        for (const p of s.particles) {
          p.life += dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vx *= 0.94;
          p.vy *= 0.94;
        }
        s.particles = s.particles.filter((p) => p.life < p.max);
        if (s.shake > 0) s.shake = Math.max(0, s.shake - dt * 40);
        if (s.flash > 0) s.flash = Math.max(0, s.flash - dt * 2.4);
      }
      draw();
      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);

    // input
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "ArrowUp" || e.code === "KeyW") {
        s.up = true;
        s.targetY = null;
        e.preventDefault();
      } else if (e.code === "ArrowDown" || e.code === "KeyS") {
        s.down = true;
        s.targetY = null;
        e.preventDefault();
      } else if (e.code === "Space" || e.code === "Enter") {
        if (s.phase !== "playing") start();
        e.preventDefault();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "ArrowUp" || e.code === "KeyW") s.up = false;
      if (e.code === "ArrowDown" || e.code === "KeyS") s.down = false;
    };
    const pointerY = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      s.targetY = e.clientY - rect.top;
    };
    const onPointerDown = (e: PointerEvent) => {
      if (s.phase !== "playing") {
        start();
        return;
      }
      pointerY(e);
      canvas.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (s.phase === "playing" && s.targetY != null) pointerY(e);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
    };
  }, [start]);

  return (
    <div className="relative w-full">
      <div
        ref={wrapRef}
        className="relative w-full overflow-hidden rounded-xl border border-line bg-void"
      >
        <canvas
          ref={canvasRef}
          className="block w-full touch-none select-none"
          aria-label={`${game.title} — ${game.tagline}`}
        />

        {/* HUD */}
        {phase === "playing" && (
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3 font-mono text-[11px] tracking-[0.18em] uppercase md:p-4 md:text-xs">
            <div className="flex gap-4">
              <span className="text-dim">
                {game.distance}{" "}
                <b className="text-ghost">{hud.meters}m</b>
              </span>
              <span className="text-dim">
                {game.lumen}{" "}
                <b className="text-neon-amber">{hud.lumen}</b>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-dim">{game.threat}</span>
              <span className="relative block h-1.5 w-20 overflow-hidden rounded-full bg-carbon md:w-28">
                <span
                  className="absolute inset-y-0 start-0 bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-amber"
                  style={{
                    width: `${Math.min(100, Math.floor(hud.meters / 26))}%`,
                  }}
                />
              </span>
            </div>
          </div>
        )}

        {/* Start card */}
        {phase === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-void/70 px-6 text-center backdrop-blur-sm">
            <span className="font-mono text-[11px] tracking-[0.42em] text-neon-cyan uppercase">
              {game.eyebrow}
            </span>
            <h2 className="font-display text-4xl font-black tracking-[0.08em] text-ghost md:text-6xl">
              {game.title}
            </h2>
            <p className="max-w-md text-sm text-dim md:text-base">
              {game.tagline}
            </p>
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

        {/* Game over card */}
        {phase === "over" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-void/80 px-6 text-center backdrop-blur-sm">
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
