import type {
  Announcement,
  Blob,
  GameEvent,
  KillFeedEntry,
  LeaderboardRow,
  Orb,
  PowerKind,
  RoundPhase,
  Vec2,
} from "@/types/game";
import {
  BOOST_DRAIN,
  BOOST_MIN_MASS,
  BOOST_SPEED,
  BOT_COUNT,
  BOT_EMOJIS,
  BOT_NAMES,
  BOT_RESPAWN_DELAY,
  COMBO_WINDOW,
  DECAY_RATE,
  DECAY_START_MASS,
  EAT_ABSORB,
  GOLD_ORB_HUE,
  HASTE_SPEED,
  KILL_FEED_MAX,
  MAGNET_RANGE,
  ORB_COUNT,
  ORB_HUES,
  ORB_MASS_GAIN,
  ORB_RADIUS,
  POWER_DURATION,
  POWER_ORB_CHANCE,
  radiusFor,
  REVIVE_INVULN_SEC,
  REVIVE_MASS_KEEP,
  ROUND_SEC,
  speedFor,
  START_MASS,
  STREAK_WORDS,
  WORLD_SIZE,
} from "./constants";
import { hashSeed, mulberry32, pick, randRange, shuffled } from "./rng";

const POWER_KINDS: PowerKind[] = ["haste", "magnet", "shield"];

export interface EngineOptions {
  arenaCode: string;
  playerName: string;
  playerEmoji: string;
}

/**
 * Pure, framework-free simulation. The arena code seeds the bot roster and
 * orb layout so an invite link reproduces the same arena for a friend.
 * (Live multiplayer swaps this class for a server-authoritative sim — the
 * renderer and UI shell stay untouched.)
 */
export class Engine {
  readonly arenaCode: string;
  readonly playerId: number;

  time = 0;
  phase: RoundPhase = "playing";
  blobs: Blob[] = [];
  orbs: Orb[] = [];
  killFeed: KillFeedEntry[] = [];
  playerDeathBy = "";
  playerDeathMass = 0;
  playerMaxMass = START_MASS;
  playerSurvivedSec = 0;
  reviveUsed = false;

  /** combo/streak + tallies for missions & flair */
  streak = 0;
  bestStreak = 0;
  orbsEaten = 0;
  reachedRank1 = false;

  private events: GameEvent[] = [];
  private announcements: Announcement[] = [];
  private rand: () => number;
  private nextId = 1;
  private botNamePool: string[];
  private botNameCursor = 0;
  private respawnQueue: number[] = [];
  private playerBlob: Blob;
  private playerBoosting = false;
  private lastKillTime = -99;

  constructor(opts: EngineOptions) {
    this.arenaCode = opts.arenaCode;
    this.rand = mulberry32(hashSeed(opts.arenaCode));
    this.botNamePool = shuffled(this.rand, BOT_NAMES);

    for (let i = 0; i < ORB_COUNT; i++) {
      this.orbs.push(this.makeOrb());
    }

    // bots first, so the player's initial spawn can steer clear of anything
    // that would eat them on contact
    for (let i = 0; i < BOT_COUNT; i++) {
      this.blobs.push(this.makeBot(randRange(this.rand, 12, 60)));
    }

    const player: Blob = {
      id: this.nextId++,
      name: opts.playerName,
      emoji: opts.playerEmoji,
      pos: this.safeSpawnPos(START_MASS),
      vel: { x: 0, y: 0 },
      dir: { x: 0, y: 0 },
      mass: START_MASS,
      hue: 190,
      isBot: false,
      alive: true,
      invulnUntil: 1.5,
      kills: 0,
      aiNextThink: 0,
      boosting: false,
      hasteUntil: 0,
      magnetUntil: 0,
      shieldUntil: 0,
    };
    this.playerId = player.id;
    this.playerBlob = player;
    this.blobs.push(player);
  }

  get player(): Blob {
    return this.playerBlob;
  }

  setPlayerDir(dir: Vec2): void {
    const p = this.player;
    p.dir.x = dir.x;
    p.dir.y = dir.y;
  }

  setPlayerBoosting(on: boolean): void {
    this.playerBoosting = on;
  }

  /** true if the player currently has enough mass to boost */
  get canBoost(): boolean {
    return this.player.alive && this.player.mass > BOOST_MIN_MASS;
  }

  consumeEvents(): GameEvent[] {
    const out = this.events;
    this.events = [];
    return out;
  }

  consumeAnnouncements(): Announcement[] {
    const out = this.announcements;
    this.announcements = [];
    return out;
  }

  private announce(a: Announcement): void {
    this.announcements.push(a);
  }

  /** active power kinds on a blob, for the renderer/HUD */
  activePowers(b: Blob): PowerKind[] {
    const out: PowerKind[] = [];
    if (b.hasteUntil > this.time) out.push("haste");
    if (b.magnetUntil > this.time) out.push("magnet");
    if (b.shieldUntil > this.time) out.push("shield");
    return out;
  }

  step(dt: number): void {
    if (this.phase !== "playing") return;
    this.time += dt;

    // combo resets if you go too long between kills
    if (this.streak > 0 && this.time - this.lastKillTime > COMBO_WINDOW) {
      this.streak = 0;
    }

    for (const b of this.blobs) {
      if (b.alive && b.isBot && this.time >= b.aiNextThink) this.think(b);
    }

    for (const b of this.blobs) {
      if (!b.alive) continue;

      // boost: spend mass to lunge (player-driven; bots set b.boosting in think)
      const wantsBoost = b.id === this.playerId ? this.playerBoosting : b.boosting;
      const canBoost = wantsBoost && b.mass > BOOST_MIN_MASS && (b.dir.x !== 0 || b.dir.y !== 0);
      b.boosting = canBoost;
      let speed = speedFor(b.mass);
      if (canBoost) {
        speed *= BOOST_SPEED;
        b.mass = Math.max(BOOST_MIN_MASS, b.mass - BOOST_DRAIN * dt);
      }
      if (b.hasteUntil > this.time) speed *= HASTE_SPEED;

      const targetVx = b.dir.x * speed;
      const targetVy = b.dir.y * speed;
      const blend = Math.min(1, dt * 8);
      b.vel.x += (targetVx - b.vel.x) * blend;
      b.vel.y += (targetVy - b.vel.y) * blend;
      b.pos.x += b.vel.x * dt;
      b.pos.y += b.vel.y * dt;

      const r = radiusFor(b.mass);
      if (b.pos.x < r) {
        b.pos.x = r;
        b.vel.x = 0;
      } else if (b.pos.x > WORLD_SIZE - r) {
        b.pos.x = WORLD_SIZE - r;
        b.vel.x = 0;
      }
      if (b.pos.y < r) {
        b.pos.y = r;
        b.vel.y = 0;
      } else if (b.pos.y > WORLD_SIZE - r) {
        b.pos.y = WORLD_SIZE - r;
        b.vel.y = 0;
      }

      if (b.mass > DECAY_START_MASS) {
        b.mass -= b.mass * DECAY_RATE * dt;
      }
    }

    this.pickupOrbs();
    this.resolveEating();

    while (this.respawnQueue.length > 0 && this.respawnQueue[0] <= this.time) {
      this.respawnQueue.shift();
      const lateGameBonus = Math.min(80, this.time * 0.4);
      this.blobs.push(this.makeBot(randRange(this.rand, 15, 45 + lateGameBonus)));
    }

    const p = this.player;
    if (p.alive) {
      this.playerMaxMass = Math.max(this.playerMaxMass, p.mass);
      this.playerSurvivedSec = this.time;
      // first time you top the board — a celebratory milestone
      if (!this.reachedRank1 && this.playerRank() === 1 && this.time > 2) {
        this.reachedRank1 = true;
        this.announce({ text: "1 NUMARA SENSİN!", sub: "arenanın kralı", tone: "rank" });
      }
    }

    if (this.time >= ROUND_SEC) {
      this.phase = "ended";
    }
  }

  /** current standings among living blobs, heaviest first */
  leaderboard(): LeaderboardRow[] {
    return this.blobs
      .filter((b) => b.alive)
      .sort((a, b) => b.mass - a.mass)
      .map((b) => ({
        id: b.id,
        name: b.name,
        emoji: b.emoji,
        mass: Math.round(b.mass),
        isPlayer: b.id === this.playerId,
      }));
  }

  playerRank(): number {
    const p = this.player;
    const living = this.blobs.filter((b) => b.alive && b.id !== this.playerId);
    if (!p.alive) return living.length + 1;
    return 1 + living.filter((b) => b.mass > p.mass).length;
  }

  livingCount(): number {
    return this.blobs.filter((b) => b.alive).length;
  }

  timeLeft(): number {
    return Math.max(0, ROUND_SEC - this.time);
  }

  revivePlayer(): void {
    if (this.reviveUsed || this.phase !== "playerDead") return;
    this.reviveUsed = true;
    const p = this.player;
    p.alive = true;
    p.mass = Math.max(START_MASS, this.playerDeathMass * REVIVE_MASS_KEEP);
    p.pos = this.safeSpawnPos(p.mass);
    p.vel = { x: 0, y: 0 };
    p.invulnUntil = this.time + REVIVE_INVULN_SEC;
    this.phase = "playing";
  }

  /** player declined the revive — round is over */
  endRound(): void {
    this.phase = "ended";
  }

  private pickupOrbs(): void {
    for (const b of this.blobs) {
      if (!b.alive) continue;
      const r = radiusFor(b.mass);
      const magnet = b.magnetUntil > this.time ? MAGNET_RANGE : 0;
      const reach = r + ORB_RADIUS + magnet;
      const reach2 = reach * reach;
      const isPlayer = b.id === this.playerId;
      for (const orb of this.orbs) {
        const dx = b.pos.x - orb.pos.x;
        const dy = b.pos.y - orb.pos.y;
        if (dx * dx + dy * dy < reach2) {
          if (orb.power) {
            this.grantPower(b, orb.power);
            this.events.push({
              kind: "power",
              x: orb.pos.x,
              y: orb.pos.y,
              power: orb.power,
              byPlayer: isPlayer,
            });
          } else {
            b.mass += orb.value * ORB_MASS_GAIN;
            if (isPlayer) this.orbsEaten++;
            this.events.push({
              kind: "orb",
              x: orb.pos.x,
              y: orb.pos.y,
              hue: orb.hue,
              value: orb.value,
              byPlayer: isPlayer,
            });
          }
          // keep orb density constant — respawn elsewhere
          const fresh = this.makeOrb();
          orb.pos = fresh.pos;
          orb.value = fresh.value;
          orb.hue = fresh.hue;
          orb.phase = fresh.phase;
          orb.power = fresh.power;
        }
      }
    }
  }

  private grantPower(b: Blob, power: PowerKind): void {
    const until = this.time + POWER_DURATION;
    if (power === "haste") b.hasteUntil = until;
    else if (power === "magnet") b.magnetUntil = until;
    else b.shieldUntil = until;
    if (b.id === this.playerId) {
      const label =
        power === "haste" ? "HIZ!" : power === "magnet" ? "MIKNATIS!" : "KALKAN!";
      this.announce({ text: label, tone: "power" });
    }
  }

  private resolveEating(): void {
    // any rounded-mass advantage kills on touch; equal score = safe contact
    const living = this.blobs.filter((b) => b.alive).sort((a, b) => b.mass - a.mass);
    for (let i = 0; i < living.length; i++) {
      const eater = living[i];
      if (!eater.alive) continue;
      const rEater = radiusFor(eater.mass);
      for (let j = i + 1; j < living.length; j++) {
        const victim = living[j];
        if (!victim.alive || !eater.alive) continue;
        if (Math.round(eater.mass) <= Math.round(victim.mass)) continue;
        if (this.time < victim.invulnUntil) continue;
        if (victim.shieldUntil > this.time) continue; // shield blocks the kill
        const rVictim = radiusFor(victim.mass);
        const dx = eater.pos.x - victim.pos.x;
        const dy = eater.pos.y - victim.pos.y;
        const touch = rEater + rVictim;
        if (dx * dx + dy * dy < touch * touch) {
          this.kill(eater, victim);
        }
      }
    }
  }

  private kill(eater: Blob, victim: Blob): void {
    victim.alive = false;
    eater.mass += victim.mass * EAT_ABSORB;
    eater.kills++;

    const byPlayer = eater.id === this.playerId;
    const ofPlayer = victim.id === this.playerId;

    // combo tracking (player kills only)
    let streak = 0;
    if (byPlayer) {
      this.streak = this.time - this.lastKillTime <= COMBO_WINDOW ? this.streak + 1 : 1;
      this.lastKillTime = this.time;
      this.bestStreak = Math.max(this.bestStreak, this.streak);
      streak = this.streak;
      const word = STREAK_WORDS[Math.min(8, streak)];
      if (word) this.announce({ text: word, sub: `${streak}x seri`, tone: "streak" });
    } else if (ofPlayer) {
      this.streak = 0;
    }

    this.killFeed.unshift({
      time: this.time,
      eater: eater.name,
      eaten: victim.name,
      eaterIsPlayer: byPlayer,
      eatenIsPlayer: ofPlayer,
    });
    if (this.killFeed.length > KILL_FEED_MAX) this.killFeed.pop();

    this.events.push({
      kind: "kill",
      x: victim.pos.x,
      y: victim.pos.y,
      mass: victim.mass,
      byPlayer,
      ofPlayer,
      streak,
    });

    if (ofPlayer) {
      this.playerDeathBy = eater.name;
      this.playerDeathMass = victim.mass;
      this.phase = "playerDead";
    } else {
      this.respawnQueue.push(this.time + BOT_RESPAWN_DELAY);
      // drop dead bots from the array lazily to keep ids stable this round
    }
  }

  private think(bot: Blob): void {
    bot.aiNextThink = this.time + randRange(this.rand, 0.3, 0.55);
    const r = radiusFor(bot.mass);

    let threat: Blob | null = null;
    let threatDist2 = Infinity;
    let prey: Blob | null = null;
    let preyDist2 = Infinity;

    const myScore = Math.round(bot.mass);
    for (const other of this.blobs) {
      if (!other.alive || other.id === bot.id) continue;
      const otherScore = Math.round(other.mass);
      const dx = other.pos.x - bot.pos.x;
      const dy = other.pos.y - bot.pos.y;
      const d2 = dx * dx + dy * dy;
      const dangerRange = 380 + radiusFor(other.mass) * 1.5;
      if (otherScore > myScore && d2 < dangerRange * dangerRange) {
        if (d2 < threatDist2) {
          threat = other;
          threatDist2 = d2;
        }
      } else if (myScore > otherScore && d2 < 550 * 550) {
        if (d2 < preyDist2 && this.time >= other.invulnUntil) {
          prey = other;
          preyDist2 = d2;
        }
      }
    }

    let dx = 0;
    let dy = 0;
    // boost to flee a close threat or to close in for a kill — makes the
    // arena feel alive and gives the touch-kill rule real bite
    bot.boosting = false;
    if (threat) {
      dx = bot.pos.x - threat.pos.x;
      dy = bot.pos.y - threat.pos.y;
      if (threatDist2 < 240 * 240 && bot.mass > BOOST_MIN_MASS && this.rand() < 0.7) {
        bot.boosting = true;
      }
    } else if (prey) {
      dx = prey.pos.x - bot.pos.x;
      dy = prey.pos.y - bot.pos.y;
      if (preyDist2 < 220 * 220 && bot.mass > BOOST_MIN_MASS && this.rand() < 0.4) {
        bot.boosting = true;
      }
    } else {
      let nearest: Orb | null = null;
      let nearest2 = Infinity;
      // sample a slice of orbs — enough for natural foraging, cheap per think
      for (let i = 0; i < 24; i++) {
        const orb = this.orbs[Math.floor(this.rand() * this.orbs.length)];
        const ox = orb.pos.x - bot.pos.x;
        const oy = orb.pos.y - bot.pos.y;
        const d2 = ox * ox + oy * oy;
        if (d2 < nearest2) {
          nearest = orb;
          nearest2 = d2;
        }
      }
      if (nearest) {
        dx = nearest.pos.x - bot.pos.x;
        dy = nearest.pos.y - bot.pos.y;
      }
    }

    // wall repulsion + wobble so bots don't grind along edges
    const margin = 160 + r;
    if (bot.pos.x < margin) dx += (margin - bot.pos.x) * 0.02;
    if (bot.pos.x > WORLD_SIZE - margin) dx -= (bot.pos.x - (WORLD_SIZE - margin)) * 0.02;
    if (bot.pos.y < margin) dy += (margin - bot.pos.y) * 0.02;
    if (bot.pos.y > WORLD_SIZE - margin) dy -= (bot.pos.y - (WORLD_SIZE - margin)) * 0.02;
    dx += (this.rand() - 0.5) * 0.6;
    dy += (this.rand() - 0.5) * 0.6;

    const len = Math.hypot(dx, dy);
    if (len > 0.001) {
      bot.dir.x = dx / len;
      bot.dir.y = dy / len;
    } else {
      bot.dir.x = 0;
      bot.dir.y = 0;
    }
  }

  private makeBot(mass: number): Blob {
    const baseName = this.botNamePool[this.botNameCursor % this.botNamePool.length];
    const suffix = this.botNameCursor >= this.botNamePool.length ? `_${this.botNameCursor}` : "";
    this.botNameCursor++;
    return {
      id: this.nextId++,
      name: `${baseName}${suffix}`,
      emoji: pick(this.rand, BOT_EMOJIS),
      pos: this.randomPos(100),
      vel: { x: 0, y: 0 },
      dir: { x: 0, y: 0 },
      mass,
      hue: Math.floor(this.rand() * 360),
      isBot: true,
      alive: true,
      invulnUntil: this.time + 1,
      kills: 0,
      aiNextThink: this.time + this.rand() * 0.5,
      boosting: false,
      hasteUntil: 0,
      magnetUntil: 0,
      shieldUntil: 0,
    };
  }

  private makeOrb(): Orb {
    // rare power-up orb
    if (this.rand() < POWER_ORB_CHANCE) {
      const power = pick(this.rand, POWER_KINDS);
      return {
        id: this.nextId++,
        pos: this.randomPos(30),
        value: 0,
        hue: 0,
        phase: this.rand() * Math.PI * 2,
        power,
      };
    }
    const roll = this.rand();
    const value = roll < 0.03 ? 3 : roll < 0.15 ? 2 : 1;
    return {
      id: this.nextId++,
      pos: this.randomPos(30),
      value,
      hue: value === 3 ? GOLD_ORB_HUE : pick(this.rand, ORB_HUES),
      phase: this.rand() * Math.PI * 2,
    };
  }

  private randomPos(margin: number): Vec2 {
    return {
      x: randRange(this.rand, margin, WORLD_SIZE - margin),
      y: randRange(this.rand, margin, WORLD_SIZE - margin),
    };
  }

  /** spawn away from anything that could immediately eat this mass */
  private safeSpawnPos(mass: number): Vec2 {
    const score = Math.round(mass);
    for (let attempt = 0; attempt < 24; attempt++) {
      const pos = this.randomPos(150);
      let safe = true;
      for (const b of this.blobs) {
        if (!b.alive || Math.round(b.mass) <= score) continue;
        const dx = b.pos.x - pos.x;
        const dy = b.pos.y - pos.y;
        if (dx * dx + dy * dy < 600 * 600) {
          safe = false;
          break;
        }
      }
      if (safe) return pos;
    }
    return this.randomPos(150);
  }
}
