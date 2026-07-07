/**
 * Lightweight i18n for the whole game. English is the canonical, always-complete
 * source; every other language may omit keys and falls back to English. The
 * language auto-detects from the browser and is overridable + persisted.
 *
 * Strings use {param} placeholders. Announcements are key-based (the engine emits
 * keys + params, the UI translates) so the simulation stays language-agnostic.
 *
 * To add a language: add its code to LANGS, a name to LANG_NAMES, and a dict to
 * DICT (translate the English keys). Missing keys fall back to English — safe.
 */

export type Lang =
  | "en"
  | "tr"
  | "es"
  | "pt"
  | "fr"
  | "de"
  | "ru"
  | "it"
  | "id"
  | "hi"
  | "ar"
  | "ja"
  | "ko"
  | "zh";

export const LANGS: Lang[] = [
  "en", "tr", "es", "pt", "fr", "de", "ru", "it", "id", "hi", "ar", "ja", "ko", "zh",
];

export const LANG_NAMES: Record<Lang, string> = {
  en: "English",
  tr: "Türkçe",
  es: "Español",
  pt: "Português",
  fr: "Français",
  de: "Deutsch",
  ru: "Русский",
  it: "Italiano",
  id: "Indonesia",
  hi: "हिन्दी",
  ar: "العربية",
  ja: "日本語",
  ko: "한국어",
  zh: "中文",
};

export const LANG_FLAGS: Record<Lang, string> = {
  en: "🇬🇧", tr: "🇹🇷", es: "🇪🇸", pt: "🇧🇷", fr: "🇫🇷", de: "🇩🇪", ru: "🇷🇺",
  it: "🇮🇹", id: "🇮🇩", hi: "🇮🇳", ar: "🇸🇦", ja: "🇯🇵", ko: "🇰🇷", zh: "🇨🇳",
};

const RTL_LANGS: Lang[] = ["ar"];
export function isRTL(lang: Lang): boolean {
  return RTL_LANGS.includes(lang);
}

type Dict = Record<string, string>;

const en: Dict = {
  // menu
  "menu.subtitle": "Eat, grow, survive — be king of the arena in 3 minutes",
  "menu.dailyBonus": "🎁 Daily bonus +{n} 💰",
  "menu.streakSuffix": " · Streak x{n}",
  "menu.pass": "Pass Lv.{lvl} · {xp} XP",
  "menu.missions.title": "DAILY MISSIONS",
  "menu.missions.ready": "{n} reward ready",
  "menu.namePlaceholder": "your nickname…",
  "menu.arena": "Arena",
  "menu.inviteLink": "🔗 invite link",
  "menu.copied": "✅ copied",
  "menu.newArena": "🎲 new",
  "menu.play": "▶️ PLAY",
  "menu.shop": "🎁 Crate & Skins",
  "menu.passBtn": "🏅 Brainrot Pass",
  "menu.stat.best": "🏆 best {n}",
  "menu.stat.kills": "💀 {n} kills",
  "menu.stat.rounds": "🔁 {n} rounds",
  "menu.language": "Language",
  // hud
  "hud.leaderboard": "LEADERBOARD",
  "hud.invite": "arena {code} 🔗",
  "hud.inviteFull": " call your friends",
  "hud.inviteCopied": "✅ link copied",
  "hud.combo": "{n}× COMBO",
  // death
  "death.title": "EATEN!",
  "death.nearTitle": "SO CLOSE!",
  "death.line": "{killer} ate you · you ranked #{rank}",
  "death.nearSuffix": " — get them next time!",
  "death.revive": "📺 Watch ad → respawn (1)",
  "death.reviveHint": "Continue this round with 35% of your mass",
  "death.noRevive": "No respawns left",
  "death.shareCard": "🖼️ Share card & challenge {killer} · +25 💰",
  "death.shareCardDone": "✅ +25 💰 shared",
  "death.cardBusy": "⏳ making card…",
  "death.giveUp": "End round",
  // results
  "results.won": "ARENA IS YOURS!",
  "results.over": "ROUND OVER",
  "results.tile.rank": "RANK",
  "results.tile.mass": "MASS",
  "results.tile.kills": "KILLS",
  "results.tile.streak": "STREAK",
  "results.double": "📺 Watch & DOUBLE coins",
  "results.shareCard": "🖼️ Share card · +25 💰",
  "results.shareCardDone": "✅ +25 💰 shared",
  "results.shareText": "📤 Text",
  "results.copy": "🔗 Copy link",
  "results.copied": "✅ Copied",
  "results.hint": "Arena {code} — get your friends to beat you in the same arena",
  "results.again": "🔁 PLAY AGAIN",
  "results.menu": "🏠 Menu",
  // shop
  "shop.title": "🎁 Crate & Skins",
  "shop.odds": "60% common · 25% rare · 12% epic · 3% legendary",
  "shop.open": "Open crate — {n} 💰",
  "shop.dupe": " · dupe! +{n} 💰 back",
  "shop.back": "← Back",
  "rarity.common": "Common",
  "rarity.rare": "Rare",
  "rarity.epic": "Epic",
  "rarity.legendary": "Legendary",
  // pass
  "pass.title": "🏅 Brainrot Pass",
  "pass.season": "Season 1 · every round earns XP — special skins at levels 5/10/15",
  "pass.claim": "CLAIM",
  "pass.claimed": "✅ claimed",
  "pass.premium": "⭐ Premium Pass (2× XP + exclusive skins) coming at portal launch",
  "pass.level": "Lv.{n}",
  "pass.xp": "{xp} XP",
  "pass.back": "← Back",
  // ad
  "ad.label": "AD",
  "ad.rewarded": "Reward: respawn in this round",
  "ad.interstitial": "Loading next round",
  "ad.note": "(Portal SDK slot — a real Poki / CrazyGames ad plays here live)",
  // missions
  "mission.orbs": "Eat {n} orbs",
  "mission.kills": "Eat {n} players",
  "mission.mass": "Reach {n} mass in a round",
  "mission.rank1": "Reach #1 in a round",
  "mission.survive": "Play a full round",
  "mission.streak": "Get a {n} kill streak",
  // announcer (engine-emitted keys)
  "ann.streak.2": "DOUBLE!",
  "ann.streak.3": "TRIPLE!",
  "ann.streak.4": "MONSTER!",
  "ann.streak.5": "UNSTOPPABLE!",
  "ann.streak.6": "LEGENDARY!",
  "ann.streak.7": "GODLIKE!",
  "ann.streak.8": "BRAINROT KING!",
  "ann.streak.sub": "{n}x combo",
  "ann.power.haste": "HASTE!",
  "ann.power.magnet": "MAGNET!",
  "ann.power.shield": "SHIELD!",
  "ann.revenge": "REVENGE! 🎯",
  "ann.revenge.sub": "{name} defeated",
  "ann.rank1": "YOU'RE #1!",
  "ann.rank1.sub": "king of the arena",
  "ann.mass": "{n} MASS!",
  "ann.pb": "NEW RECORD!",
  "ann.pb.sub": "your best mass",
  // share text + card
  "share.title": "🧠 BRAINROT BATTLE",
  "share.line": "🏆 #{rank} · ⚖️ {mass} mass · 💀 {kills} kills",
  "share.cta": "Arena {code} — can you beat me?",
  "share.invite": "🧠 Brainrot Battle — join Arena {code}: {url}",
  "card.won": "👑 ARENA KING",
  "card.rank": "#{rank}",
  "card.killed": "{killer} ate me 😤",
  "card.cta": "can you beat me?",
  "card.arena": "ARENA {code}",
};

const tr: Dict = {
  "menu.subtitle": "Ye, büyü, hayatta kal — 3 dakikada arenanın kralı ol",
  "menu.dailyBonus": "🎁 Günlük bonus +{n} 💰",
  "menu.streakSuffix": " · Seri x{n}",
  "menu.pass": "Pass Lv.{lvl} · {xp} XP",
  "menu.missions.title": "GÜNLÜK GÖREVLER",
  "menu.missions.ready": "{n} ödül hazır",
  "menu.namePlaceholder": "takma adın…",
  "menu.arena": "Arena",
  "menu.inviteLink": "🔗 davet linki",
  "menu.copied": "✅ kopyalandı",
  "menu.newArena": "🎲 yeni",
  "menu.play": "▶️ OYNA",
  "menu.shop": "🎁 Kasa & Kostüm",
  "menu.passBtn": "🏅 Brainrot Pass",
  "menu.stat.best": "🏆 rekor {n}",
  "menu.stat.kills": "💀 {n} av",
  "menu.stat.rounds": "🔁 {n} tur",
  "menu.language": "Dil",
  "hud.leaderboard": "SIRALAMA",
  "hud.invite": "arena {code} 🔗",
  "hud.inviteFull": " arkadaşını çağır",
  "hud.inviteCopied": "✅ link kopyalandı",
  "hud.combo": "{n}× SERİ",
  "death.title": "YENDİN!",
  "death.nearTitle": "AZ KALDI!",
  "death.line": "{killer} seni yuttu · sıralaman #{rank}",
  "death.nearSuffix": " — bir dahaki sefere sen kazan!",
  "death.revive": "📺 Reklam izle → geri dön (1)",
  "death.reviveHint": "Kütlenin %35'i ile aynı turda devam et",
  "death.noRevive": "Geri dönüş hakkın bitti",
  "death.shareCard": "🖼️ Kartı paylaş & {killer}'a meydan oku · +25 💰",
  "death.shareCardDone": "✅ +25 💰 paylaşıldı",
  "death.cardBusy": "⏳ kart hazırlanıyor…",
  "death.giveUp": "Turu bitir",
  "results.won": "ARENA SENİN!",
  "results.over": "TUR BİTTİ",
  "results.tile.rank": "SIRA",
  "results.tile.mass": "KÜTLE",
  "results.tile.kills": "AV",
  "results.tile.streak": "SERİ",
  "results.double": "📺 İzle & coinleri 2 KATLA",
  "results.shareCard": "🖼️ Kartı paylaş · +25 💰",
  "results.shareCardDone": "✅ +25 💰 paylaşıldı",
  "results.shareText": "📤 Metin",
  "results.copy": "🔗 Link kopyala",
  "results.copied": "✅ Kopyalandı",
  "results.hint": "Arena {code} — arkadaşın aynı arenada seni geçmeye çalışsın",
  "results.again": "🔁 BİR TUR DAHA",
  "results.menu": "🏠 Menü",
  "shop.title": "🎁 Kasa & Kostüm",
  "shop.odds": "%60 sıradan · %25 nadir · %12 epik · %3 efsanevi",
  "shop.open": "Kasayı aç — {n} 💰",
  "shop.dupe": " · kopya! +{n} 💰 iade",
  "shop.back": "← Geri",
  "rarity.common": "Sıradan",
  "rarity.rare": "Nadir",
  "rarity.epic": "Epik",
  "rarity.legendary": "Efsanevi",
  "pass.title": "🏅 Brainrot Pass",
  "pass.season": "Sezon 1 · Her tur XP kazandırır — 5/10/15. seviyelerde özel kostümler",
  "pass.claim": "AL",
  "pass.claimed": "✅ alındı",
  "pass.premium": "⭐ Premium Pass (2x XP + özel kostümler) portal lansmanında geliyor",
  "pass.level": "Lv.{n}",
  "pass.xp": "{xp} XP",
  "pass.back": "← Geri",
  "ad.label": "REKLAM",
  "ad.rewarded": "Ödül: aynı turda geri dönüş",
  "ad.interstitial": "Sonraki tur yükleniyor",
  "ad.note": "(Portal SDK yuvası — canlıda Poki / CrazyGames reklamı burada oynar)",
  "mission.orbs": "{n} orb ye",
  "mission.kills": "{n} oyuncu yut",
  "mission.mass": "Bir turda {n} kütleye ulaş",
  "mission.rank1": "Bir turda 1 numara ol",
  "mission.survive": "Bir turu sonuna kadar oyna",
  "mission.streak": "Bir turda {n}'lük seri yap",
  "ann.streak.2": "ÇİFTLEME!",
  "ann.streak.3": "ÜÇLEME!",
  "ann.streak.4": "CANAVAR!",
  "ann.streak.5": "DURDURULAMAZ!",
  "ann.streak.6": "EFSANE!",
  "ann.streak.7": "TANRISAL!",
  "ann.streak.8": "BRAINROT KRALI!",
  "ann.streak.sub": "{n}x seri",
  "ann.power.haste": "HIZ!",
  "ann.power.magnet": "MIKNATIS!",
  "ann.power.shield": "KALKAN!",
  "ann.revenge": "İNTİKAM! 🎯",
  "ann.revenge.sub": "{name} yenildi",
  "ann.rank1": "1 NUMARA SENSİN!",
  "ann.rank1.sub": "arenanın kralı",
  "ann.mass": "{n} KÜTLE!",
  "ann.pb": "YENİ REKOR!",
  "ann.pb.sub": "en iyi kütlen",
  "share.title": "🧠 BRAINROT BATTLE",
  "share.line": "🏆 #{rank} · ⚖️ {mass} kütle · 💀 {kills} av",
  "share.cta": "Arena {code} — beni geçebilir misin?",
  "share.invite": "🧠 Brainrot Battle — Arena {code}'e gel: {url}",
  "card.won": "👑 ARENA KRALI",
  "card.rank": "#{rank}",
  "card.killed": "{killer} beni yedi 😤",
  "card.cta": "beni geçebilir misin?",
  "card.arena": "ARENA {code}",
};

/** DICT is assembled from per-language packs; non-English packs may be partial. */
const DICT: Record<Lang, Dict> = {
  en, tr,
  // filled in by generated language packs (see langs/*.ts); English fallback until then
  es: {}, pt: {}, fr: {}, de: {}, ru: {}, it: {}, id: {}, hi: {}, ar: {}, ja: {}, ko: {}, zh: {},
};

/** register a generated language pack at module load */
export function registerLang(lang: Lang, dict: Dict): void {
  DICT[lang] = dict;
}

export function detectLang(): Lang {
  if (typeof navigator === "undefined") return "en";
  const cands = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
  for (const raw of cands) {
    const code = (raw || "").slice(0, 2).toLowerCase();
    if ((LANGS as string[]).includes(code)) return code as Lang;
  }
  return "en";
}

function interpolate(s: string, params?: Record<string, string | number>): string {
  if (!params) return s;
  let out = s;
  for (const k in params) out = out.split(`{${k}}`).join(String(params[k]));
  return out;
}

/** translate a key; falls back to English, then to the key itself */
export function t(lang: Lang, key: string, params?: Record<string, string | number>): string {
  const s = DICT[lang]?.[key] ?? en[key] ?? key;
  return interpolate(s, params);
}

/** like t() but returns "" when the key is absent everywhere (for optional subs) */
export function tOpt(lang: Lang, key: string, params?: Record<string, string | number>): string {
  const s = DICT[lang]?.[key] ?? en[key];
  return s === undefined ? "" : interpolate(s, params);
}

/** the canonical English source, exported so a translation tool can enumerate keys */
export const SOURCE_STRINGS = en;
