/** All gameplay tunables in one place — balance patches touch only this file. */

export const WORLD_SIZE = 4200;
export const ROUND_SEC = 180;

export const START_MASS = 20;
export const BOT_COUNT = 13;
export const ORB_COUNT = 340;

/** radius in world px for a given mass */
export function radiusFor(mass: number): number {
  return 3.5 * Math.sqrt(mass);
}

/** movement speed falls off gently as you grow (classic .io balance) */
export function speedFor(mass: number): number {
  const v = 300 * Math.pow(START_MASS / mass, 0.25);
  return Math.min(300, Math.max(90, v));
}

/**
 * Eating rule: ANY advantage in displayed (rounded) mass — even a single
 * point — kills the smaller blob the moment the circles touch. Equal
 * displayed mass = harmless contact. (Rounded so the rule matches the
 * score players actually see; raw float ties never coin-flip a kill.)
 */
/** fraction of the victim's mass the eater absorbs */
export const EAT_ABSORB = 0.82;

/** mass gained per orb value point */
export const ORB_MASS_GAIN = 2;
export const ORB_RADIUS = 7;

/** blobs above this mass slowly shrink — anti-snowball */
export const DECAY_START_MASS = 150;
export const DECAY_RATE = 0.002;

export const BOT_RESPAWN_DELAY = 2.2;
/** mass kept per revive: 1st ad-revive keeps 35%, 2nd keeps 25% */
export const REVIVE_KEEPS = [0.35, 0.25] as const;
export const MAX_REVIVES = 2;
export const REVIVE_INVULN_SEC = 2.5;

/** boost / dash — spend mass to lunge (the core .io skill lever) */
export const BOOST_SPEED = 1.95;
/** mass/sec while boosting — proportional so a leader pays fairly and a
 *  small blob isn't bled dry (min floor keeps it meaningful) */
export const BOOST_DRAIN_FLOOR = 12;
export const BOOST_DRAIN_FRAC = 0.06;
export const BOOST_MIN_MASS = 15; // low enough to boost from spawn (START_MASS 20)

/** power-ups */
export const POWER_ORB_CHANCE = 0.02; // share of orbs that are power-ups
export const POWER_DURATION = 6.5;
export const HASTE_SPEED = 1.4;
export const MAGNET_RANGE = 150; // extra pickup reach while magnet is up
export const POWER_HUE: Record<string, number> = {
  haste: 55, // gold
  magnet: 305, // magenta
  shield: 200, // cyan
};

/** kill-streak combo — consecutive kills inside the window ramp the multiplier */
export const COMBO_WINDOW = 8;
/** announcer streak copy now lives in i18n (ann.streak.2 … ann.streak.8) */

/** neon orb hues: cyan, purple, pink, green + gold for value-3 orbs */
export const ORB_HUES = [190, 265, 330, 140] as const;
export const GOLD_ORB_HUE = 45;

export const KILL_FEED_MAX = 6;

/** economy */
export const CRATE_COST = 100;
export const DUPLICATE_REFUND = 40;
export const DAILY_BONUS_BASE = 50;
export const DAILY_STREAK_CAP = 5;
/** hard pity: an epic+ is guaranteed within this many crates */
export const PITY_LIMIT = 8;
/** rewarded-ad free crate cooldown */
export const FREE_CRATE_COOLDOWN_MS = 4 * 60 * 60 * 1000;
/** daily featured-skin direct-buy price */
export const DEAL_COST = 300;
/** first N rounds each day earn double XP */
export const XP_BOOST_ROUNDS = 3;
/** lifetime "Aura level": xp needed for level L is LEVEL_XP_STEP * L² */
export const LEVEL_XP_STEP = 50;
export const LEVEL_REWARD_PER = 25;
/** extra coins when returning after 3+ days away */
export const COMEBACK_BONUS = 150;
/** collection-completion milestones (percent owned → coin reward) */
export const COLLECTION_MILESTONES = [
  { pct: 25, reward: 100 },
  { pct: 50, reward: 200 },
  { pct: 75, reward: 300 },
  { pct: 100, reward: 500 },
] as const;

/** bot roster — globally recognized brainrot / Gen-Z internet slang in a
 *  gamer-username format, so the arena reads like a real lobby AND stays
 *  on-concept for a worldwide audience (no locale-specific names) */
export const BOT_NAMES = [
  "skibidi_toilet",
  "sigma_grindset",
  "xX_rizzler_Xx",
  "final_boss_69",
  "gyatt_lord",
  "npc_andy",
  "mewing_king",
  "gigachad_69",
  "tralalero_69",
  "bombardiro_bro",
  "only_in_ohio",
  "fanum_tax",
  "brainrot_boss",
  "sussy_baka",
  "delulu",
  "rizzgod_420",
  "skibidi_rizz",
  "grimace_shake",
  "sigma_male",
  "amogus_sus",
  "lil_brainrot",
  "ohio_rizzler",
  "no_cap_fr",
  "sheeeesh",
  "based_dept",
  "tung_tung_bro",
  "slay_kween",
  "cap_detector",
  "gng_fr_fr",
  "aura_9000",
  "edgar_gaming",
  "w_rizz",
  "npc_moment",
] as const;

export const BOT_EMOJIS = [
  "😈",
  "🤠",
  "🥶",
  "😼",
  "🤑",
  "😭",
  "🤥",
  "😾",
  "🥴",
  "🦝",
  "🐔",
  "🦆",
  "🐍",
  "👾",
  "🐻",
  "🦊",
  // brainrot karakter havuzu — arena kadroyu yansıtsın
  "🐊",
  "☕",
  "🥁",
  "🍌",
  "🌳",
  "🐫",
  "🐄",
  "🗡️",
  "🐘",
  "🦐",
] as const;
