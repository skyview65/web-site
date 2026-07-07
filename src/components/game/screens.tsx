"use client";

import type { CrateResult, MetaState, RoundStats, SkinDef, SkinRarity } from "@/types/game";
import { CRATE_COST } from "@/lib/game/constants";
import { PASS_LEVELS, SKINS, missionLabel, passLevelReached, rarityLabel, skinById } from "@/lib/game/meta";
import { LANGS, LANG_FLAGS, LANG_NAMES, type Lang } from "@/lib/game/i18n";
import type { AdKind } from "@/lib/game/ads";
import { cn } from "@/lib/utils";

/** bound translator handed down from the shell (already carries the language) */
type T = (key: string, params?: Record<string, string | number>) => string;

const RARITY_STYLES: Record<SkinRarity, string> = {
  common: "border-zinc-500/60 text-zinc-300",
  rare: "border-cyan-400/70 text-cyan-300",
  epic: "border-fuchsia-400/70 text-fuchsia-300",
  legendary: "border-amber-300/80 text-amber-300",
};

function PanelButton({
  onClick,
  children,
  variant = "primary",
  disabled,
  className,
}: {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "gold";
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-xl px-5 py-3 text-sm font-bold tracking-wide transition-transform duration-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40",
        variant === "primary" &&
          "bg-cyan-400 text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.45)] hover:bg-cyan-300",
        variant === "gold" &&
          "bg-amber-400 text-slate-950 shadow-[0_0_24px_rgba(251,191,36,0.4)] hover:bg-amber-300",
        variant === "ghost" &&
          "border border-white/15 bg-white/5 text-zinc-200 hover:bg-white/10",
        className,
      )}
    >
      {children}
    </button>
  );
}

/** skin avatar: character artwork when available, emoji otherwise
 *  (plain <img>: sprites are tiny local assets and must also work in the
 *  single-file standalone build, where next/image has no optimizer) */
function SkinFace({ skin, emojiClass, imgClass }: { skin: SkinDef; emojiClass: string; imgClass: string }) {
  if (skin.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={skin.image} alt={skin.name} className={cn("object-contain", imgClass)} />;
  }
  return <span className={emojiClass}>{skin.emoji}</span>;
}

function CoinBadge({ coins }: { coins: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/40 bg-amber-400/10 px-3 py-1 font-mono text-sm font-bold text-amber-300">
      💰 {coins}
    </span>
  );
}

export function MenuScreen({
  meta,
  lang,
  t,
  onSetLang,
  name,
  onNameChange,
  onEquip,
  arenaCode,
  onNewArena,
  onCopyInvite,
  copied,
  dailyToast,
  soundOn,
  onToggleSound,
  onClaimMission,
  onPlay,
  onShop,
  onPass,
}: {
  meta: MetaState;
  lang: Lang;
  t: T;
  onSetLang: (l: Lang) => void;
  name: string;
  onNameChange: (v: string) => void;
  onEquip: (id: string) => void;
  arenaCode: string;
  onNewArena: () => void;
  onCopyInvite: () => void;
  copied: boolean;
  dailyToast: { granted: number; streak: number } | null;
  soundOn: boolean;
  onToggleSound: () => void;
  onClaimMission: (index: number) => void;
  onPlay: () => void;
  onShop: () => void;
  onPass: () => void;
}) {
  const owned = SKINS.filter((s) => meta.ownedSkins.includes(s.id));
  const passLevel = passLevelReached(meta.passXp);
  const claimable = meta.missions.filter((m) => m.done && !m.claimed).length;

  return (
    <div className="absolute inset-0 z-20 overflow-y-auto bg-[#070312]">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="pointer-events-none fixed inset-0 h-full w-full object-cover opacity-40 motion-reduce:hidden"
      >
        <source src="/videos/brainrot-menu.webm" type="video/webm" />
        <source src="/videos/brainrot-menu.mp4" type="video/mp4" />
      </video>
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-[#070312]/75 via-[#070312]/55 to-[#070312]/85" />
      <div className="relative mx-auto flex min-h-full w-full max-w-md items-center justify-center p-4">
        <div className="w-full space-y-5 py-6">
          <div className="text-center">
            <h1 className="text-5xl font-black tracking-tight text-white drop-shadow-[0_0_30px_rgba(167,139,250,0.6)]">
              🧠 BRAINROT
              <span className="block bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">
                BATTLE
              </span>
            </h1>
            <p className="mt-2 text-sm text-zinc-400">{t("menu.subtitle")}</p>
          </div>

          {dailyToast && (
            <div className="animate-in fade-in slide-in-from-top-2 rounded-xl border border-amber-300/40 bg-amber-400/10 px-4 py-3 text-center text-sm font-semibold text-amber-200 duration-500">
              {t("menu.dailyBonus", { n: dailyToast.granted })}
              {dailyToast.streak > 1 && t("menu.streakSuffix", { n: dailyToast.streak })}
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            <CoinBadge coins={meta.coins} />
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-zinc-500">
                {t("menu.pass", { lvl: passLevel, xp: meta.passXp })}
              </span>
              <div className="relative">
                <select
                  value={lang}
                  onChange={(e) => onSetLang(e.target.value as Lang)}
                  aria-label={t("menu.language")}
                  className="h-11 cursor-pointer appearance-none rounded-full border border-white/15 bg-black/40 pl-2 pr-2 text-center text-lg outline-none"
                >
                  {LANGS.map((l) => (
                    <option key={l} value={l}>
                      {LANG_FLAGS[l]} {LANG_NAMES[l]}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={onToggleSound}
                aria-label="sound on/off"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/40 text-base"
              >
                {soundOn ? "🔊" : "🔇"}
              </button>
            </div>
          </div>

          {/* daily missions — partially filled cards are open loops that pull retention */}
          {meta.missions.length > 0 && (
            <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-widest text-zinc-400">
                  {t("menu.missions.title")}
                </span>
                {claimable > 0 && (
                  <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-slate-950">
                    {t("menu.missions.ready", { n: claimable })}
                  </span>
                )}
              </div>
              {meta.missions.map((m, i) => {
                const pct = Math.min(100, Math.round((m.progress / m.target) * 100));
                return (
                  <div key={m.kind} className="flex items-center gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between text-xs">
                        <span className="truncate text-zinc-300">{missionLabel(lang, m)}</span>
                        <span className="ms-2 shrink-0 font-mono text-zinc-500">
                          {Math.min(m.progress, m.target)}/{m.target}
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-black/40">
                        <div
                          className={cn("h-full rounded-full", m.done ? "bg-emerald-400" : "bg-cyan-400")}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    {m.claimed ? (
                      <span className="text-xs text-emerald-400">✅</span>
                    ) : m.done ? (
                      <button
                        type="button"
                        onClick={() => onClaimMission(i)}
                        className="shrink-0 rounded-lg bg-amber-400 px-2.5 py-1 text-xs font-bold text-slate-950 active:scale-95"
                      >
                        +{m.reward} 💰
                      </button>
                    ) : (
                      <span className="shrink-0 font-mono text-[10px] text-zinc-600">+{m.reward}</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <input
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              maxLength={14}
              placeholder={t("menu.namePlaceholder")}
              aria-label={t("menu.namePlaceholder")}
              className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-center font-bold text-white outline-none placeholder:text-zinc-600 focus:border-cyan-400/70"
            />

            <div className="flex gap-2 overflow-x-auto pb-1">
              {owned.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onEquip(s.id)}
                  title={s.name}
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 text-2xl transition-transform active:scale-90",
                    meta.equippedSkin === s.id
                      ? "border-cyan-400 bg-cyan-400/15 shadow-[0_0_14px_rgba(34,211,238,0.5)]"
                      : "border-white/10 bg-black/30 hover:border-white/30",
                  )}
                >
                  <SkinFace skin={s} emojiClass="" imgClass="h-10 w-10" />
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2">
              <span className="font-mono text-sm text-fuchsia-300">
                {t("menu.arena")} <b>{arenaCode}</b>
              </span>
              <span className="flex gap-1.5">
                <button
                  type="button"
                  onClick={onCopyInvite}
                  className="rounded-lg border border-white/15 px-2.5 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-white/10"
                >
                  {copied ? t("menu.copied") : t("menu.inviteLink")}
                </button>
                <button
                  type="button"
                  onClick={onNewArena}
                  className="rounded-lg border border-white/15 px-2.5 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-white/10"
                >
                  {t("menu.newArena")}
                </button>
              </span>
            </div>
          </div>

          <PanelButton onClick={onPlay} className="w-full py-4 text-lg">
            {t("menu.play")}
          </PanelButton>

          <div className="grid grid-cols-2 gap-3">
            <PanelButton onClick={onShop} variant="ghost" className="w-full">
              {t("menu.shop")}
            </PanelButton>
            <PanelButton onClick={onPass} variant="ghost" className="w-full">
              {t("menu.passBtn")}
            </PanelButton>
          </div>

          <div className="flex justify-center gap-6 font-mono text-xs text-zinc-500">
            <span>{t("menu.stat.best", { n: meta.bestMass })}</span>
            <span>{t("menu.stat.kills", { n: meta.totalKills })}</span>
            <span>{t("menu.stat.rounds", { n: meta.roundsPlayed })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DeathScreen({
  t,
  killedBy,
  canRevive,
  rank,
  nearMiss,
  onRevive,
  onGiveUp,
  onShareCard,
  cardBusy,
  shareReward,
  adBusy,
}: {
  t: T;
  killedBy: string;
  canRevive: boolean;
  rank: number;
  nearMiss: boolean;
  onRevive: () => void;
  onGiveUp: () => void;
  onShareCard: () => void;
  cardBusy: boolean;
  shareReward: boolean;
  adBusy: boolean;
}) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 p-4 backdrop-blur-[2px]">
      <div
        className={cn(
          "animate-in fade-in zoom-in-95 w-full max-w-sm space-y-4 rounded-2xl border bg-[#12040c]/95 p-6 text-center duration-300",
          nearMiss ? "border-amber-300/50" : "border-red-400/30",
        )}
      >
        <div className="text-6xl">{nearMiss ? "😤" : "💀"}</div>
        {nearMiss ? (
          <h2 className="animate-pulse text-3xl font-black text-amber-300">{t("death.nearTitle")}</h2>
        ) : (
          <h2 className="text-2xl font-black text-red-300">{t("death.title")}</h2>
        )}
        <p className="text-sm text-zinc-400">
          {t("death.line", { killer: killedBy, rank })}
          {nearMiss && t("death.nearSuffix")}
        </p>
        {canRevive ? (
          <>
            <PanelButton onClick={onRevive} variant="gold" disabled={adBusy} className="w-full">
              {t("death.revive")}
            </PanelButton>
            <p className="text-xs text-zinc-500">{t("death.reviveHint")}</p>
          </>
        ) : (
          <p className="text-xs text-zinc-500">{t("death.noRevive")}</p>
        )}
        <PanelButton onClick={onShareCard} variant="ghost" disabled={adBusy || cardBusy} className="w-full">
          {cardBusy
            ? t("death.cardBusy")
            : shareReward
              ? t("death.shareCardDone")
              : t("death.shareCard", { killer: killedBy })}
        </PanelButton>
        <PanelButton onClick={onGiveUp} variant="ghost" disabled={adBusy} className="w-full">
          {t("death.giveUp")}
        </PanelButton>
      </div>
    </div>
  );
}

export function ResultsScreen({
  t,
  stats,
  arenaCode,
  onShare,
  onShareCard,
  cardBusy,
  shareReward,
  onDouble,
  doubled,
  doublePending,
  onCopy,
  copied,
  shareSupported,
  onPlayAgain,
  onMenu,
}: {
  t: T;
  stats: RoundStats;
  arenaCode: string;
  onShare: () => void;
  onShareCard: () => void;
  cardBusy: boolean;
  shareReward: boolean;
  onDouble: () => void;
  doubled: boolean;
  doublePending: boolean;
  onCopy: () => void;
  copied: boolean;
  shareSupported: boolean;
  onPlayAgain: () => void;
  onMenu: () => void;
}) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center overflow-y-auto bg-[#070312]/92 p-4 backdrop-blur-sm">
      <div className="animate-in fade-in zoom-in-95 w-full max-w-sm space-y-4 py-6 text-center duration-300">
        <div className="text-6xl">{stats.won ? "👑" : "🏁"}</div>
        <h2 className="text-3xl font-black text-white">
          {stats.won ? t("results.won") : t("results.over")}
        </h2>

        <div className="grid grid-cols-4 gap-2">
          {[
            { label: t("results.tile.rank"), value: `#${stats.rank}` },
            { label: t("results.tile.mass"), value: String(Math.round(stats.maxMass)) },
            { label: t("results.tile.kills"), value: String(stats.kills) },
            { label: t("results.tile.streak"), value: `${stats.bestStreak}×` },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 px-1 py-3">
              <div className="font-mono text-lg font-bold text-cyan-300">{s.value}</div>
              <div className="text-[10px] tracking-widest text-zinc-500">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 rounded-xl border border-amber-300/30 bg-amber-400/10 px-4 py-3 font-mono text-sm font-bold">
          <span className="text-amber-300">
            +{doubled ? stats.coinsEarned * 2 : stats.coinsEarned} 💰
            {doubled && <span className="ms-1 text-emerald-300">2×!</span>}
          </span>
          <span className="text-fuchsia-300">+{stats.xpEarned} XP</span>
        </div>

        {stats.coinsEarned > 0 && !doubled && (
          <PanelButton onClick={onDouble} variant="gold" disabled={doublePending} className="w-full">
            {t("results.double")}
          </PanelButton>
        )}

        <PanelButton onClick={onShareCard} variant="gold" disabled={cardBusy} className="w-full">
          {cardBusy ? t("death.cardBusy") : shareReward ? t("results.shareCardDone") : t("results.shareCard")}
        </PanelButton>
        <div className="grid grid-cols-2 gap-2">
          {shareSupported && (
            <PanelButton onClick={onShare} variant="ghost" className="w-full">
              {t("results.shareText")}
            </PanelButton>
          )}
          <PanelButton
            onClick={onCopy}
            variant="ghost"
            className={cn("w-full", !shareSupported && "col-span-2")}
          >
            {copied ? t("results.copied") : t("results.copy")}
          </PanelButton>
        </div>
        <p className="font-mono text-xs text-zinc-500">{t("results.hint", { code: arenaCode })}</p>

        <PanelButton onClick={onPlayAgain} className="w-full py-4 text-lg">
          {t("results.again")}
        </PanelButton>
        <PanelButton onClick={onMenu} variant="ghost" className="w-full">
          {t("results.menu")}
        </PanelButton>
      </div>
    </div>
  );
}

export function ShopScreen({
  meta,
  lang,
  t,
  crateResult,
  onOpenCrate,
  onEquip,
  onBack,
}: {
  meta: MetaState;
  lang: Lang;
  t: T;
  crateResult: CrateResult | null;
  onOpenCrate: () => void;
  onEquip: (id: string) => void;
  onBack: () => void;
}) {
  return (
    <div className="absolute inset-0 z-20 overflow-y-auto bg-[#070312]/95 p-4">
      <div className="mx-auto max-w-md space-y-5 py-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-white">{t("shop.title")}</h2>
          <CoinBadge coins={meta.coins} />
        </div>

        <div className="space-y-3 rounded-2xl border border-fuchsia-400/30 bg-fuchsia-500/5 p-5 text-center">
          {crateResult ? (
            <div
              key={crateResult.skin.id + String(meta.roundsPlayed) + String(meta.coins)}
              className="animate-in zoom-in-50 fade-in space-y-1 duration-500"
            >
              <div className="flex justify-center text-6xl">
                <SkinFace skin={crateResult.skin} emojiClass="" imgClass="h-24 w-24" />
              </div>
              <div className={cn("text-lg font-black", RARITY_STYLES[crateResult.skin.rarity].split(" ")[1])}>
                {crateResult.skin.name}
              </div>
              <div className="text-xs text-zinc-400">
                {rarityLabel(lang, crateResult.skin.rarity)}
                {crateResult.duplicate && t("shop.dupe", { n: crateResult.refund })}
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="text-6xl">📦</div>
              <p className="text-xs text-zinc-400">{t("shop.odds")}</p>
            </div>
          )}
          <PanelButton onClick={onOpenCrate} variant="gold" disabled={meta.coins < CRATE_COST} className="w-full">
            {t("shop.open", { n: CRATE_COST })}
          </PanelButton>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {SKINS.map((s) => {
            const ownedSkin = meta.ownedSkins.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                disabled={!ownedSkin}
                onClick={() => onEquip(s.id)}
                title={`${s.name} · ${rarityLabel(lang, s.rarity)}`}
                className={cn(
                  "flex aspect-square flex-col items-center justify-center gap-0.5 rounded-xl border-2 bg-black/30 text-2xl transition-transform active:scale-90",
                  RARITY_STYLES[s.rarity].split(" ")[0],
                  meta.equippedSkin === s.id && "ring-2 ring-cyan-300",
                  !ownedSkin && "opacity-30 grayscale",
                )}
              >
                {ownedSkin ? (
                  <SkinFace skin={s} emojiClass="" imgClass="h-9 w-9" />
                ) : (
                  <span>{s.passExclusive ? "🏅" : "🔒"}</span>
                )}
                <span className="px-0.5 text-[9px] leading-tight text-zinc-400">{s.name}</span>
              </button>
            );
          })}
        </div>

        <PanelButton onClick={onBack} variant="ghost" className="w-full">
          {t("shop.back")}
        </PanelButton>
      </div>
    </div>
  );
}

export function PassScreen({
  meta,
  t,
  onClaim,
  onBack,
}: {
  meta: MetaState;
  t: T;
  onClaim: (level: number) => void;
  onBack: () => void;
}) {
  const reached = passLevelReached(meta.passXp);
  return (
    <div className="absolute inset-0 z-20 overflow-y-auto bg-[#070312]/95 p-4">
      <div className="mx-auto max-w-md space-y-4 py-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-white">{t("pass.title")}</h2>
          <span className="font-mono text-sm font-bold text-fuchsia-300">{t("pass.xp", { xp: meta.passXp })}</span>
        </div>
        <p className="text-xs text-zinc-500">{t("pass.season")}</p>

        <div className="space-y-2">
          {PASS_LEVELS.map((l) => {
            const unlocked = reached >= l.level;
            const claimed = meta.claimedPassLevels.includes(l.level);
            const rewardText =
              l.reward.type === "coins"
                ? `${l.reward.amount} 💰`
                : `${skinById(l.reward.skinId).emoji} ${skinById(l.reward.skinId).name}`;
            return (
              <div
                key={l.level}
                className={cn(
                  "flex items-center justify-between rounded-xl border px-4 py-3",
                  unlocked ? "border-cyan-400/40 bg-cyan-400/5" : "border-white/10 bg-white/5 opacity-60",
                )}
              >
                <div>
                  <div className="text-sm font-bold text-white">
                    {t("pass.level", { n: l.level })} <span className="ms-2">{rewardText}</span>
                  </div>
                  <div className="font-mono text-[10px] text-zinc-500">{l.xpRequired} XP</div>
                </div>
                {claimed ? (
                  <span className="text-xs font-bold text-emerald-400">{t("pass.claimed")}</span>
                ) : unlocked ? (
                  <button
                    type="button"
                    onClick={() => onClaim(l.level)}
                    className="rounded-lg bg-cyan-400 px-3 py-1.5 text-xs font-bold text-slate-950 active:scale-95"
                  >
                    {t("pass.claim")}
                  </button>
                ) : (
                  <span className="text-xs text-zinc-600">🔒</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="rounded-xl border border-amber-300/30 bg-amber-400/5 px-4 py-3 text-center text-xs text-amber-200/80">
          {t("pass.premium")}
        </div>

        <PanelButton onClick={onBack} variant="ghost" className="w-full">
          {t("pass.back")}
        </PanelButton>
      </div>
    </div>
  );
}

export function AdOverlay({ t, kind, remaining }: { t: T; kind: AdKind; remaining: number }) {
  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-4 bg-black/95">
      <span className="rounded border border-white/20 px-2 py-0.5 font-mono text-[10px] tracking-[0.3em] text-zinc-400">
        {t("ad.label")}
      </span>
      <div className="font-mono text-7xl font-black text-white">{remaining}</div>
      <p className="max-w-xs text-center text-xs text-zinc-500">
        {kind === "rewarded" ? t("ad.rewarded") : t("ad.interstitial")}
        <br />
        {t("ad.note")}
      </p>
    </div>
  );
}
