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
export const REVIVE_MASS_KEEP = 0.35;
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
/** announcer copy per streak count (Turkish, brainrot flavor) */
export const STREAK_WORDS: Record<number, string> = {
  2: "ÇİFTLEME!",
  3: "ÜÇLEME!",
  4: "CANAVAR!",
  5: "DURDURULAMAZ!",
  6: "EFSANE!",
  7: "TANRISAL!",
  8: "BRAINROT KRALI!",
};

/** neon orb hues: cyan, purple, pink, green + gold for value-3 orbs */
export const ORB_HUES = [190, 265, 330, 140] as const;
export const GOLD_ORB_HUE = 45;

export const KILL_FEED_MAX = 6;

/** economy */
export const CRATE_COST = 100;
export const DUPLICATE_REFUND = 40;
export const DAILY_BONUS_BASE = 50;
export const DAILY_STREAK_CAP = 5;

/** bot roster — realistic player usernames so the arena reads like a real
 *  multiplayer lobby (a Turkish-leaning mix of names, gamer tags and handles) */
export const BOT_NAMES = [
  "mehmet_51",
  "zeynep",
  "xXefeXx",
  "kaan34",
  "elifsu",
  "baran_tr",
  "ege2010",
  "pro_can",
  "selin",
  "shadow61",
  "yigit_06",
  "defne",
  "kartal34",
  "berkay07",
  "aleyna",
  "doruk",
  "ghost_tr",
  "mira",
  "kuzey",
  "sniper42",
  "ecrinnn",
  "deniz_x",
  "ada.06",
  "poyraz",
  "nova35",
  "emir_58",
  "buse",
  "arda_10",
  "kayrakaya",
  "melisa",
  "tuna61",
  "alperen",
  "reyyan",
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
