import type {
  CrateResult,
  MetaState,
  Mission,
  MissionKind,
  PassLevel,
  RoundStats,
  RoundTallies,
  SkinDef,
  SkinRarity,
} from "@/types/game";
import { t, type Lang } from "./i18n";
import {
  CRATE_COST,
  DAILY_BONUS_BASE,
  DAILY_STREAK_CAP,
  DUPLICATE_REFUND,
} from "./constants";

const STORAGE_KEY = "brainrot-battle:v1";

export const SKINS: SkinDef[] = [
  { id: "happy", emoji: "🙂", name: "Nöbetçi", rarity: "common", free: true },
  { id: "cool", emoji: "😎", name: "Rizz", rarity: "common", free: true },
  { id: "zany", emoji: "🤪", name: "Delulu", rarity: "common", free: true },
  { id: "grin", emoji: "😀", name: "NPC", rarity: "common" },
  { id: "wink", emoji: "😜", name: "Yapıcı", rarity: "common" },
  { id: "nerd", emoji: "🤓", name: "Kanka", rarity: "common" },
  { id: "sleep", emoji: "😴", name: "AFK", rarity: "common" },
  { id: "moustache", emoji: "🤫", name: "Gizli Ajan", rarity: "common" },
  { id: "steam", emoji: "😤", name: "Tilt", rarity: "common" },
  { id: "robot", emoji: "🤖", name: "Bot Değilim", rarity: "rare" },
  { id: "alien", emoji: "👽", name: "Area 51", rarity: "rare" },
  { id: "pig", emoji: "🐷", name: "Chill Guy", rarity: "rare" },
  { id: "moon", emoji: "🌚", name: "Sus Payı", rarity: "rare" },
  { id: "unicorn", emoji: "🦄", name: "Nadir Bulunur", rarity: "rare" },
  { id: "octopus", emoji: "🐙", name: "Sekiz Kol", rarity: "rare" },
  { id: "skull", emoji: "💀", name: "Ölümüne", rarity: "epic" },
  { id: "clown", emoji: "🤡", name: "Ohio", rarity: "epic" },
  { id: "ogre", emoji: "👹", name: "Final Boss", rarity: "epic" },
  { id: "nazar", emoji: "🧿", name: "Nazar", rarity: "epic" },
  { id: "gorilla", emoji: "🦍", name: "Goril Modu", rarity: "epic" },
  { id: "whale", emoji: "🐳", name: "Balina", rarity: "epic" },
  { id: "brain", emoji: "🧠", name: "Brainrot", rarity: "legendary" },
  { id: "crown", emoji: "👑", name: "Sigma", rarity: "legendary" },
  { id: "fire", emoji: "🔥", name: "Alev Alev", rarity: "legendary" },
  { id: "gem", emoji: "💎", name: "Elmas El", rarity: "legendary" },
  // ---- brainrot karakter serisi (gerçek karakter görselleriyle) ----
  { id: "banana", emoji: "🍌", name: "Chimpanzini Bananini", rarity: "rare", image: "/images/skins/banana.jpg" },
  { id: "patapim", emoji: "🌳", name: "Brr Brr Patapim", rarity: "rare", image: "/images/skins/patapim.jpg" },
  { id: "camelo", emoji: "🐫", name: "Frigo Camelo", rarity: "rare", image: "/images/skins/camelo.jpg" },
  { id: "lirili", emoji: "🐘", name: "Lirili Larila", rarity: "rare", image: "/images/skins/lirili.jpg" },
  { id: "crocodilo", emoji: "🐊", name: "Bombardiro Crocodilo", rarity: "epic", image: "/images/skins/crocodilo.jpg" },
  { id: "cappuccina", emoji: "☕", name: "Ballerina Cappuccina", rarity: "epic", image: "/images/skins/cappuccina.jpg" },
  { id: "trippi", emoji: "🦐", name: "Trippi Troppi", rarity: "epic", image: "/images/skins/trippi.jpg" },
  { id: "vaca", emoji: "🐄", name: "La Vaca Saturno Saturnita", rarity: "epic", image: "/images/skins/vaca.jpg" },
  { id: "sahur", emoji: "🥁", name: "Tung Tung Tung Sahur", rarity: "legendary", image: "/images/skins/sahur.jpg" },
  { id: "assassino", emoji: "🗡️", name: "Cappuccino Assassino", rarity: "legendary", image: "/images/skins/assassino.jpg" },
  // ---- Brainrot Pass özel ödülleri ----
  { id: "frog", emoji: "🐸", name: "Boneca Ambalabu", rarity: "rare", passExclusive: true, image: "/images/skins/frog.jpg" },
  { id: "shark", emoji: "🦈", name: "Tralalero Tralala", rarity: "epic", passExclusive: true, image: "/images/skins/shark.jpg" },
  { id: "moai", emoji: "🗿", name: "Gigachad", rarity: "legendary", passExclusive: true },
];

export const RARITY_ORDER: SkinRarity[] = ["common", "rare", "epic", "legendary"];

export function rarityLabel(lang: Lang, rarity: SkinRarity): string {
  return t(lang, `rarity.${rarity}`);
}

/** crate drop odds by rarity (sums to 1) */
const CRATE_ODDS: Record<SkinRarity, number> = {
  common: 0.6,
  rare: 0.25,
  epic: 0.12,
  legendary: 0.03,
};

/** Season 1 — 15 levels; skins at 5/10/15, coins in between */
export const PASS_LEVELS: PassLevel[] = Array.from({ length: 15 }, (_, i) => {
  const level = i + 1;
  const xpRequired = level * (90 + level * 14);
  let reward: PassLevel["reward"];
  if (level === 5) reward = { type: "skin", skinId: "frog" };
  else if (level === 10) reward = { type: "skin", skinId: "shark" };
  else if (level === 15) reward = { type: "skin", skinId: "moai" };
  else reward = { type: "coins", amount: 30 + level * 10 };
  return { level, xpRequired, reward };
});

export function defaultMeta(): MetaState {
  return {
    coins: 120,
    ownedSkins: SKINS.filter((s) => s.free).map((s) => s.id),
    equippedSkin: "happy",
    playerName: "",
    passXp: 0,
    claimedPassLevels: [],
    bestMass: 0,
    totalKills: 0,
    roundsPlayed: 0,
    lastDailyKey: "",
    dailyStreak: 0,
    soundOn: true,
    missionDay: "",
    missions: [],
    nemesis: null,
    adsRemoved: false,
    lang: "",
  };
}

const MISSION_POOL: Record<MissionKind, { targets: number[]; reward: number }> = {
  orbs: { targets: [40, 60, 90], reward: 40 },
  kills: { targets: [3, 5, 8], reward: 60 },
  mass: { targets: [150, 250, 400], reward: 50 },
  rank1: { targets: [1], reward: 70 },
  survive: { targets: [1], reward: 45 },
  streak: { targets: [2, 3, 4], reward: 55 },
};

const MISSION_KINDS: MissionKind[] = ["orbs", "kills", "mass", "rank1", "survive", "streak"];

export function missionLabel(lang: Lang, m: Mission): string {
  return t(lang, `mission.${m.kind}`, { n: m.target });
}

/** deterministic day key so missions rotate at the player's local midnight */
function dayKey(now: Date): string {
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

/** pick 3 distinct missions for the day, seeded by the date so they're stable */
function rollDailyMissions(day: string): Mission[] {
  let seed = 0;
  for (let i = 0; i < day.length; i++) seed = (seed * 31 + day.charCodeAt(i)) >>> 0;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const kinds = [...MISSION_KINDS];
  for (let i = kinds.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [kinds[i], kinds[j]] = [kinds[j], kinds[i]];
  }
  return kinds.slice(0, 3).map((kind) => {
    const def = MISSION_POOL[kind];
    const target = def.targets[Math.floor(rand() * def.targets.length)];
    return { kind, target, progress: 0, reward: def.reward, done: false, claimed: false };
  });
}

/** ensure today's missions exist; resets progress on a new day */
export function refreshMissions(meta: MetaState, now: Date): MetaState {
  const day = dayKey(now);
  if (meta.missionDay === day && meta.missions.length > 0) return meta;
  return { ...meta, missionDay: day, missions: rollDailyMissions(day) };
}

/** fold a finished round into mission progress; returns updated meta */
export function applyRoundToMissions(meta: MetaState, t: RoundTallies): MetaState {
  const missions = meta.missions.map((m) => {
    if (m.done) return m;
    let progress = m.progress;
    if (m.kind === "orbs") progress += t.orbs;
    else if (m.kind === "kills") progress += t.kills;
    else if (m.kind === "mass") progress = Math.max(progress, Math.round(t.maxMass));
    else if (m.kind === "streak") progress = Math.max(progress, t.bestStreak);
    else if (m.kind === "rank1") progress = t.reachedRank1 ? 1 : progress;
    else if (m.kind === "survive") progress = t.survivedFull ? 1 : progress;
    return { ...m, progress, done: progress >= m.target };
  });
  return { ...meta, missions };
}

export function claimMission(meta: MetaState, index: number): MetaState | null {
  const m = meta.missions[index];
  if (!m || !m.done || m.claimed) return null;
  const missions = meta.missions.map((x, i) => (i === index ? { ...x, claimed: true } : x));
  return { ...meta, coins: meta.coins + m.reward, missions };
}

export function loadMeta(): MetaState {
  if (typeof window === "undefined") return defaultMeta();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultMeta();
    const parsed = JSON.parse(raw) as Partial<MetaState>;
    const base = defaultMeta();
    return {
      ...base,
      ...parsed,
      ownedSkins: Array.isArray(parsed.ownedSkins)
        ? Array.from(new Set([...base.ownedSkins, ...parsed.ownedSkins]))
        : base.ownedSkins,
      claimedPassLevels: Array.isArray(parsed.claimedPassLevels)
        ? parsed.claimedPassLevels
        : [],
    };
  } catch {
    // corrupted storage or private mode — start fresh, never crash the game
    return defaultMeta();
  }
}

export function saveMeta(meta: MetaState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(meta));
  } catch {
    // quota/private mode — progress just won't persist
  }
}

export function skinById(id: string): SkinDef {
  return SKINS.find((s) => s.id === id) ?? SKINS[0];
}

/** rewards granted at the end of a round; mutates a copy, returns it */
export function grantRoundRewards(meta: MetaState, stats: RoundStats): MetaState {
  return {
    ...meta,
    coins: meta.coins + stats.coinsEarned,
    passXp: meta.passXp + stats.xpEarned,
    bestMass: Math.max(meta.bestMass, Math.round(stats.maxMass)),
    totalKills: meta.totalKills + stats.kills,
    roundsPlayed: meta.roundsPlayed + 1,
  };
}

export function computeRoundRewards(
  rank: number,
  kills: number,
  maxMass: number,
  bestStreak = 0,
  revenge = false,
): { coins: number; xp: number } {
  const placementBonus = rank === 1 ? 50 : rank === 2 ? 30 : rank === 3 ? 20 : 0;
  // reward stylish play: a good kill streak pays a bonus on top
  const streakBonus = bestStreak >= 2 ? bestStreak * 8 : 0;
  const revengeBonus = revenge ? 40 : 0;
  const coins = Math.round(maxMass / 12) + kills * 10 + placementBonus + streakBonus + revengeBonus;
  const xp = Math.round(maxMass / 10) + kills * 15 + (rank === 1 ? 40 : 0) + streakBonus + (revenge ? 30 : 0);
  return { coins, xp };
}

export function cratePool(): SkinDef[] {
  return SKINS.filter((s) => !s.free && !s.passExclusive);
}

/** open one crate; duplicates refund coins ("aura tozu") */
export function openCrate(meta: MetaState, rand: () => number): {
  meta: MetaState;
  result: CrateResult;
} | null {
  if (meta.coins < CRATE_COST) return null;
  const pool = cratePool();

  const roll = rand();
  let acc = 0;
  let rarity: SkinRarity = "common";
  for (const r of RARITY_ORDER) {
    acc += CRATE_ODDS[r];
    if (roll < acc) {
      rarity = r;
      break;
    }
  }

  const ofRarity = pool.filter((s) => s.rarity === rarity);
  const unowned = ofRarity.filter((s) => !meta.ownedSkins.includes(s.id));
  // pity: prefer an unowned skin of the rolled rarity
  const candidates = unowned.length > 0 ? unowned : ofRarity;
  const skin = candidates[Math.floor(rand() * candidates.length)];
  const duplicate = meta.ownedSkins.includes(skin.id);

  const next: MetaState = {
    ...meta,
    coins: meta.coins - CRATE_COST + (duplicate ? DUPLICATE_REFUND : 0),
    ownedSkins: duplicate ? meta.ownedSkins : [...meta.ownedSkins, skin.id],
  };
  return { meta: next, result: { skin, duplicate, refund: duplicate ? DUPLICATE_REFUND : 0 } };
}

/** pass level currently reached for a given xp */
export function passLevelReached(xp: number): number {
  let level = 0;
  for (const l of PASS_LEVELS) {
    if (xp >= l.xpRequired) level = l.level;
  }
  return level;
}

export function claimPassLevel(meta: MetaState, level: number): MetaState | null {
  const def = PASS_LEVELS.find((l) => l.level === level);
  if (!def) return null;
  if (meta.passXp < def.xpRequired) return null;
  if (meta.claimedPassLevels.includes(level)) return null;

  let next: MetaState = {
    ...meta,
    claimedPassLevels: [...meta.claimedPassLevels, level],
  };
  if (def.reward.type === "coins") {
    next = { ...next, coins: next.coins + def.reward.amount };
  } else {
    const skinId = def.reward.skinId;
    if (!next.ownedSkins.includes(skinId)) {
      next = { ...next, ownedSkins: [...next.ownedSkins, skinId] };
    }
  }
  return next;
}

export function applyDailyBonus(meta: MetaState, now: Date): {
  meta: MetaState;
  granted: number;
  streak: number;
} | null {
  const today = dayKey(now);
  if (meta.lastDailyKey === today) return null;

  const yesterday = dayKey(new Date(now.getTime() - 24 * 60 * 60 * 1000));
  const streak = meta.lastDailyKey === yesterday ? Math.min(DAILY_STREAK_CAP, meta.dailyStreak + 1) : 1;
  const granted = DAILY_BONUS_BASE * streak;
  return {
    meta: { ...meta, coins: meta.coins + granted, lastDailyKey: today, dailyStreak: streak },
    granted,
    streak,
  };
}
