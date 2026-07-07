import type { Engine } from "./engine";
import { ORB_RADIUS, POWER_HUE, radiusFor, WORLD_SIZE } from "./constants";
import { SKINS } from "./meta";
import type { GameEvent, Vec2 } from "@/types/game";

/** character-art lookup: any blob (player or bot) whose emoji belongs to a
 *  skin with artwork gets drawn as that sprite */
const SPRITE_BY_EMOJI = new Map<string, string>(
  SKINS.filter((s) => s.image).map((s) => [s.emoji, s.image as string]),
);

interface CachedSprite {
  img: HTMLImageElement;
  ready: boolean;
  failed: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
  /** when set, the particle is sucked toward this live point (absorption) */
  suck?: { x: number; y: number };
}

interface Shockwave {
  x: number;
  y: number;
  r: number;
  max: number;
  life: number;
  maxLife: number;
  hue: number;
}

interface Floater {
  x: number;
  y: number;
  life: number;
  text: string;
  hue: number;
}

export interface JoystickState {
  active: boolean;
  origin: Vec2;
  vector: Vec2;
}

const EMOJI_FONT = '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
const LABEL_FONT = "600 13px ui-sans-serif, system-ui, sans-serif";

/**
 * Canvas 2D renderer. Owns purely visual state (camera, particles, shake);
 * reads the engine, never mutates it.
 */
export class Renderer {
  private particles: Particle[] = [];
  private floaters: Floater[] = [];
  private shockwaves: Shockwave[] = [];
  /** trauma-model shake: accumulates on impact, decays, rendered as trauma² */
  private trauma = 0;
  private flash = 0;
  private cam = { x: WORLD_SIZE / 2, y: WORLD_SIZE / 2, zoom: 1 };
  private elapsed = 0;
  private sprites = new Map<string, CachedSprite>();

  /** lazy-load a sprite; falls back to emoji until ready (or forever on 404) */
  private sprite(src: string): CachedSprite {
    let entry = this.sprites.get(src);
    if (!entry) {
      const img = new Image();
      const fresh: CachedSprite = { img, ready: false, failed: false };
      img.onload = () => {
        fresh.ready = true;
      };
      img.onerror = () => {
        fresh.failed = true;
      };
      img.src = src;
      this.sprites.set(src, fresh);
      entry = fresh;
    }
    return entry;
  }

  reset(): void {
    this.particles = [];
    this.floaters = [];
    this.shockwaves = [];
    this.trauma = 0;
    this.flash = 0;
  }

  draw(
    ctx: CanvasRenderingContext2D,
    engine: Engine,
    width: number,
    height: number,
    dt: number,
    joystick: JoystickState,
    events: GameEvent[],
  ): void {
    this.elapsed += dt;
    const player = engine.player;
    for (const ev of events) {
      if (ev.kind === "orb") {
        this.burst(ev.x, ev.y, ev.hue, 4 + ev.value * 2, 2.2);
        if (ev.byPlayer) {
          this.trauma = Math.min(1, this.trauma + 0.05);
          this.floaters.push({ x: ev.x, y: ev.y, life: 1, text: `+${ev.value * 2}`, hue: ev.hue });
        }
      } else if (ev.kind === "power") {
        const hue = POWER_HUE[ev.power] ?? 55;
        this.burst(ev.x, ev.y, hue, 30, 5);
        this.shockwaves.push({ x: ev.x, y: ev.y, r: 10, max: 90, life: 0.5, maxLife: 0.5, hue });
        if (ev.byPlayer) this.trauma = Math.min(1, this.trauma + 0.4);
      } else {
        // kill: burst + trauma + shockwave scale with the streak for escalating juice
        const streak = ev.byPlayer ? Math.max(1, ev.streak) : 1;
        this.burst(ev.x, ev.y, ev.byPlayer ? 140 : 0, 26 + streak * 8, 4.5 + streak * 0.5);
        if (ev.byPlayer) {
          // absorption implosion: rival matter sucked into your blob
          this.implode(ev.x, ev.y, player.pos, 18 + streak * 6, 140);
          this.shockwaves.push({ x: ev.x, y: ev.y, r: 12, max: 140, life: 0.45, maxLife: 0.45, hue: 140 });
          this.flash = Math.min(0.6, 0.25 + ev.mass * 0.002);
          this.trauma = Math.min(1, this.trauma + Math.min(0.9, 0.35 + ev.mass * 0.001) + streak * 0.06);
          this.floaters.push({
            x: ev.x,
            y: ev.y,
            life: 1.4,
            text: `+${Math.round(ev.mass * 0.82)}`,
            hue: 140,
          });
        } else if (ev.ofPlayer) {
          this.shockwaves.push({ x: ev.x, y: ev.y, r: 12, max: 160, life: 0.5, maxLife: 0.5, hue: 0 });
          this.trauma = 1;
          this.flash = 0.5;
        }
      }
    }

    const pr = radiusFor(player.mass);
    const targetZoom = Math.min(1.1, Math.max(0.55, 0.55 + 42 / pr));
    const lerp = Math.min(1, dt * 4);
    this.cam.zoom += (targetZoom - this.cam.zoom) * lerp;
    this.cam.x += (player.pos.x - this.cam.x) * Math.min(1, dt * 6);
    this.cam.y += (player.pos.y - this.cam.y) * Math.min(1, dt * 6);

    // trauma² gives a sharp punch with a graceful falloff (vs. linear noise)
    this.trauma = Math.max(0, this.trauma - dt * 1.4);
    const amp = 26 * this.trauma * this.trauma;
    const shakeX = amp > 0 ? (Math.random() - 0.5) * amp : 0;
    const shakeY = amp > 0 ? (Math.random() - 0.5) * amp : 0;
    this.flash = Math.max(0, this.flash - dt * 3);

    ctx.fillStyle = "#070312";
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(width / 2 + shakeX, height / 2 + shakeY);
    ctx.scale(this.cam.zoom, this.cam.zoom);
    ctx.translate(-this.cam.x, -this.cam.y);

    this.drawGrid(ctx, width, height);
    this.drawBorder(ctx);
    this.drawOrbs(ctx, engine, width, height);
    this.drawShockwaves(ctx, dt);
    this.drawParticles(ctx, dt);
    this.drawBlobs(ctx, engine);
    this.drawFloaters(ctx, dt);

    ctx.restore();

    if (this.flash > 0.01) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = `rgba(120, 255, 200, ${this.flash * 0.25})`;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }

    this.drawVignette(ctx, width, height);
    this.drawMinimap(ctx, engine, width, height);
    this.drawJoystick(ctx, joystick);
  }

  private drawShockwaves(ctx: CanvasRenderingContext2D, dt: number): void {
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const s = this.shockwaves[i];
      s.life -= dt;
      if (s.life <= 0) {
        this.shockwaves.splice(i, 1);
        continue;
      }
      const t = 1 - s.life / s.maxLife;
      const r = s.r + (s.max - s.r) * t;
      const a = (1 - t) * 0.6;
      ctx.strokeStyle = s.hue === 0 ? `rgba(255,80,80,${a})` : `hsla(${s.hue}, 95%, 65%, ${a})`;
      ctx.lineWidth = 4 * (1 - t) + 1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  private viewHalf(width: number, height: number): { hw: number; hh: number } {
    return { hw: width / 2 / this.cam.zoom, hh: height / 2 / this.cam.zoom };
  }

  private drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const { hw, hh } = this.viewHalf(width, height);
    const step = 140;
    const x0 = Math.max(0, Math.floor((this.cam.x - hw) / step) * step);
    const x1 = Math.min(WORLD_SIZE, this.cam.x + hw);
    const y0 = Math.max(0, Math.floor((this.cam.y - hh) / step) * step);
    const y1 = Math.min(WORLD_SIZE, this.cam.y + hh);

    ctx.strokeStyle = "rgba(148, 120, 255, 0.07)";
    ctx.lineWidth = 1 / this.cam.zoom;
    ctx.beginPath();
    for (let x = x0; x <= x1; x += step) {
      ctx.moveTo(x, Math.max(0, this.cam.y - hh));
      ctx.lineTo(x, y1);
    }
    for (let y = y0; y <= y1; y += step) {
      ctx.moveTo(Math.max(0, this.cam.x - hw), y);
      ctx.lineTo(x1, y);
    }
    ctx.stroke();
  }

  private drawBorder(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = "rgba(167, 139, 250, 0.5)";
    ctx.lineWidth = 6;
    ctx.strokeRect(0, 0, WORLD_SIZE, WORLD_SIZE);
    ctx.strokeStyle = "rgba(34, 211, 238, 0.25)";
    ctx.lineWidth = 14;
    ctx.strokeRect(-7, -7, WORLD_SIZE + 14, WORLD_SIZE + 14);
  }

  private drawOrbs(
    ctx: CanvasRenderingContext2D,
    engine: Engine,
    width: number,
    height: number,
  ): void {
    const { hw, hh } = this.viewHalf(width, height);
    const minX = this.cam.x - hw - 20;
    const maxX = this.cam.x + hw + 20;
    const minY = this.cam.y - hh - 20;
    const maxY = this.cam.y + hh + 20;

    for (const orb of engine.orbs) {
      const { x, y } = orb.pos;
      if (x < minX || x > maxX || y < minY || y > maxY) continue;

      if (orb.power) {
        // power-up: pulsing glowing star with a symbol
        const hue = POWER_HUE[orb.power] ?? 55;
        const pulse = 1 + 0.28 * Math.sin(this.elapsed * 5 + orb.phase);
        const r = 15 * pulse;
        ctx.fillStyle = `hsla(${hue}, 95%, 65%, 0.28)`;
        ctx.beginPath();
        ctx.arc(x, y, r * 2.4, 0, Math.PI * 2);
        ctx.fill();
        this.star(ctx, x, y, r, r * 0.5, `hsl(${hue}, 95%, 62%)`);
        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.font = `${r * 1.1}px ${EMOJI_FONT}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const sym = orb.power === "haste" ? "⚡" : orb.power === "magnet" ? "🧲" : "🛡️";
        ctx.fillText(sym, x, y + r * 0.05);
        continue;
      }

      const pulse = 1 + 0.18 * Math.sin(this.elapsed * 3 + orb.phase);
      const r = (ORB_RADIUS - 2 + orb.value * 1.6) * pulse;
      // cheap two-pass glow (shadowBlur is too slow at this count)
      ctx.fillStyle = `hsla(${orb.hue}, 95%, 65%, 0.22)`;
      ctx.beginPath();
      ctx.arc(x, y, r * 2.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `hsl(${orb.hue}, 95%, ${orb.value === 3 ? 60 : 68}%)`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private star(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    outer: number,
    inner: number,
    fill: string,
  ): void {
    ctx.fillStyle = fill;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const rr = i % 2 === 0 ? outer : inner;
      const a = (Math.PI / 5) * i - Math.PI / 2;
      const px = cx + Math.cos(a) * rr;
      const py = cy + Math.sin(a) * rr;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }

  private drawBlobs(ctx: CanvasRenderingContext2D, engine: Engine): void {
    const living = engine.blobs.filter((b) => b.alive).sort((a, b) => a.mass - b.mass);
    for (const b of living) {
      const r = radiusFor(b.mass);
      const { x, y } = b.pos;
      const isPlayer = b.id === engine.playerId;

      // boost trail: a streak of fading ghosts behind the velocity
      if (b.boosting) {
        const speed = Math.hypot(b.vel.x, b.vel.y);
        if (speed > 5) {
          const ux = -b.vel.x / speed;
          const uy = -b.vel.y / speed;
          for (let i = 1; i <= 4; i++) {
            const t = i / 4;
            ctx.fillStyle = isPlayer
              ? `hsla(190, 100%, 65%, ${0.18 * (1 - t)})`
              : `hsla(${b.hue}, 80%, 60%, ${0.14 * (1 - t)})`;
            ctx.beginPath();
            ctx.arc(x + ux * r * t * 1.5, y + uy * r * t * 1.5, r * (1 - t * 0.5), 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // active power auras (shield ring, haste/magnet glow)
      const hasteOn = b.hasteUntil > engine.time;
      const magnetOn = b.magnetUntil > engine.time;
      const shieldOn = b.shieldUntil > engine.time;
      if (hasteOn || magnetOn || shieldOn) {
        const auraHue = shieldOn ? 200 : magnetOn ? 305 : 55;
        const ring = r + 6 + 3 * Math.sin(this.elapsed * 6);
        ctx.strokeStyle = `hsla(${auraHue}, 95%, 65%, 0.8)`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, ring, 0, Math.PI * 2);
        ctx.stroke();
        if (shieldOn) {
          ctx.fillStyle = `hsla(200, 95%, 65%, 0.1)`;
          ctx.beginPath();
          ctx.arc(x, y, ring, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.fillStyle = isPlayer
        ? "hsla(190, 100%, 60%, 0.28)"
        : `hsla(${b.hue}, 70%, 55%, 0.2)`;
      ctx.beginPath();
      ctx.arc(x, y, r * 1.12, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = isPlayer ? "hsl(222, 45%, 16%)" : `hsl(${b.hue}, 40%, 16%)`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.lineWidth = Math.max(2, r * 0.07);
      ctx.strokeStyle = isPlayer ? "hsl(190, 100%, 62%)" : `hsl(${b.hue}, 75%, 58%)`;
      ctx.stroke();

      if (engine.time < b.invulnUntil) {
        const blink = Math.sin(this.elapsed * 12) > 0 ? 0.9 : 0.35;
        ctx.strokeStyle = `rgba(255, 255, 255, ${blink})`;
        ctx.setLineDash([8, 8]);
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(x, y, r + 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      const spriteSrc = SPRITE_BY_EMOJI.get(b.emoji);
      const cached = spriteSrc ? this.sprite(spriteSrc) : null;
      if (cached && cached.ready && !cached.failed) {
        // character artwork, clipped to the blob circle
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, r * 0.94, 0, Math.PI * 2);
        ctx.clip();
        const d = r * 1.88;
        ctx.drawImage(cached.img, x - d / 2, y - d / 2, d, d);
        ctx.restore();
      } else {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `${Math.max(14, r * 1.05)}px ${EMOJI_FONT}`;
        ctx.fillText(b.emoji, x, y + r * 0.04);
      }

      if (this.cam.zoom > 0.6 || isPlayer) {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = LABEL_FONT;
        ctx.fillStyle = isPlayer ? "#e0f6ff" : "rgba(255,255,255,0.82)";
        ctx.fillText(b.name, x, y - r - 14);
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fillText(String(Math.round(b.mass)), x, y - r - 1);
      }
    }
  }

  private drawParticles(ctx: CanvasRenderingContext2D, dt: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      if (p.suck) {
        // accelerate toward the eater — matter being absorbed
        p.vx += (p.suck.x - p.x) * dt * 14;
        p.vy += (p.suck.y - p.y) * dt * 14;
        p.vx *= 1 - dt * 2;
        p.vy *= 1 - dt * 2;
      } else {
        p.vx *= 1 - dt * 3;
        p.vy *= 1 - dt * 3;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      const a = p.life / p.maxLife;
      ctx.fillStyle = `hsla(${p.hue}, 95%, 65%, ${a * 0.9})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * a, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /** spawn particles that stream from (x,y) into a live target (the eater) */
  private implode(x: number, y: number, target: Vec2, count: number, hue: number): void {
    if (this.particles.length > 400) return;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 20 + Math.random() * 40;
      const maxLife = 0.35 + Math.random() * 0.3;
      this.particles.push({
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        vx: 0,
        vy: 0,
        life: maxLife,
        maxLife,
        size: 3 + Math.random() * 3,
        hue,
        suck: target,
      });
    }
  }

  private drawFloaters(ctx: CanvasRenderingContext2D, dt: number): void {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = this.floaters.length - 1; i >= 0; i--) {
      const f = this.floaters[i];
      f.life -= dt;
      if (f.life <= 0) {
        this.floaters.splice(i, 1);
        continue;
      }
      f.y -= 46 * dt;
      ctx.font = "700 17px ui-sans-serif, system-ui, sans-serif";
      ctx.fillStyle = `hsla(${f.hue}, 90%, 70%, ${Math.min(1, f.life)})`;
      ctx.fillText(f.text, f.x, f.y);
    }
  }

  private drawVignette(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const g = ctx.createRadialGradient(
      width / 2,
      height / 2,
      Math.min(width, height) * 0.42,
      width / 2,
      height / 2,
      Math.max(width, height) * 0.75,
    );
    g.addColorStop(0, "rgba(7, 3, 18, 0)");
    g.addColorStop(1, "rgba(7, 3, 18, 0.55)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);
  }

  private drawMinimap(
    ctx: CanvasRenderingContext2D,
    engine: Engine,
    width: number,
    height: number,
  ): void {
    const size = 110;
    const pad = 14;
    const x0 = width - size - pad;
    const y0 = height - size - pad;
    const scale = size / WORLD_SIZE;

    ctx.fillStyle = "rgba(10, 5, 26, 0.78)";
    ctx.fillRect(x0, y0, size, size);
    ctx.strokeStyle = "rgba(167, 139, 250, 0.45)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x0, y0, size, size);

    for (const b of engine.blobs) {
      if (!b.alive) continue;
      const isPlayer = b.id === engine.playerId;
      const dot = isPlayer ? 3.5 : Math.min(3, 1 + radiusFor(b.mass) * 0.012);
      ctx.fillStyle = isPlayer ? "#ffffff" : `hsla(${b.hue}, 80%, 60%, 0.9)`;
      ctx.beginPath();
      ctx.arc(x0 + b.pos.x * scale, y0 + b.pos.y * scale, dot, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private drawJoystick(ctx: CanvasRenderingContext2D, joy: JoystickState): void {
    if (!joy.active) return;
    const { origin, vector } = joy;
    const limit = 56;
    const len = Math.hypot(vector.x, vector.y);
    const cl = len > limit ? limit / len : 1;

    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(origin.x, origin.y, limit, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "rgba(34, 211, 238, 0.55)";
    ctx.beginPath();
    ctx.arc(origin.x + vector.x * cl, origin.y + vector.y * cl, 22, 0, Math.PI * 2);
    ctx.fill();
  }

  private burst(x: number, y: number, hue: number, count: number, size: number): void {
    if (this.particles.length > 400) return;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 180;
      const maxLife = 0.4 + Math.random() * 0.5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: maxLife,
        maxLife,
        size: size * (0.6 + Math.random() * 0.8),
        hue: hue === 0 ? Math.random() * 360 : hue,
      });
    }
  }
}
