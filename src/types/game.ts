export interface Vec2 {
  x: number;
  y: number;
}

export type SkinRarity = "common" | "rare" | "epic" | "legendary";

export interface SkinDef {
  id: string;
  emoji: string;
  name: string;
  rarity: SkinRarity;
  /** owned from the first launch */
  free?: boolean;
  /** only obtainable through the Brainrot Pass, never drops from crates */
  passExclusive?: boolean;
  /** character artwork (public path); when set, the game draws this
   *  sprite instead of the emoji — emoji stays as the loading fallback */
  image?: string;
}

export type PowerKind = "haste" | "magnet" | "shield";

export interface Blob {
  id: number;
  name: string;
  emoji: string;
  pos: Vec2;
  vel: Vec2;
  /** desired unit direction (zero when idle) */
  dir: Vec2;
  mass: number;
  hue: number;
  isBot: boolean;
  alive: boolean;
  /** sim-time until which this blob cannot be eaten */
  invulnUntil: number;
  kills: number;
  aiNextThink: number;
  /** spending mass to dash this frame */
  boosting: boolean;
  /** power-up expiry times (sim-time); <= now means inactive */
  hasteUntil: number;
  magnetUntil: number;
  shieldUntil: number;
}

export interface Orb {
  id: number;
  pos: Vec2;
  /** 1 = small, 2 = medium, 3 = rare gold */
  value: number;
  hue: number;
  phase: number;
  /** when set, picking this orb grants a temporary power instead of mass */
  power?: PowerKind;
}

export interface KillFeedEntry {
  time: number;
  eater: string;
  eaten: string;
  eaterIsPlayer: boolean;
  eatenIsPlayer: boolean;
}

export type GameEvent =
  | { kind: "orb"; x: number; y: number; hue: number; value: number; byPlayer: boolean }
  | {
      kind: "kill";
      x: number;
      y: number;
      mass: number;
      byPlayer: boolean;
      ofPlayer: boolean;
      streak: number;
    }
  | { kind: "power"; x: number; y: number; power: PowerKind; byPlayer: boolean };

export type AnnounceTone = "streak" | "rank" | "power" | "milestone" | "warn";

export interface Announcement {
  text: string;
  sub?: string;
  tone: AnnounceTone;
}

export type RoundPhase = "playing" | "playerDead" | "ended";

export interface LeaderboardRow {
  id: number;
  name: string;
  emoji: string;
  mass: number;
  isPlayer: boolean;
}

export interface RoundStats {
  rank: number;
  totalBlobs: number;
  kills: number;
  maxMass: number;
  survivedSec: number;
  coinsEarned: number;
  xpEarned: number;
  won: boolean;
  bestStreak: number;
}

export interface CrateResult {
  skin: SkinDef;
  duplicate: boolean;
  refund: number;
}

export type PassReward =
  | { type: "coins"; amount: number }
  | { type: "skin"; skinId: string };

export interface PassLevel {
  level: number;
  xpRequired: number;
  reward: PassReward;
}

export type MissionKind = "orbs" | "kills" | "mass" | "rank1" | "survive" | "streak";

export interface Mission {
  kind: MissionKind;
  target: number;
  progress: number;
  reward: number;
  done: boolean;
  claimed: boolean;
}

export interface MetaState {
  coins: number;
  ownedSkins: string[];
  equippedSkin: string;
  playerName: string;
  passXp: number;
  claimedPassLevels: number[];
  bestMass: number;
  totalKills: number;
  roundsPlayed: number;
  lastDailyKey: string;
  dailyStreak: number;
  soundOn: boolean;
  missionDay: string;
  missions: Mission[];
}

/** per-round tallies the meta layer folds into mission progress */
export interface RoundTallies {
  orbs: number;
  kills: number;
  maxMass: number;
  reachedRank1: boolean;
  survivedFull: boolean;
  bestStreak: number;
}
