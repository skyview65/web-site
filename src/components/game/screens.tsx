"use client";

import type { CrateResult, MetaState, RoundStats, SkinDef, SkinRarity } from "@/types/game";
import { CRATE_COST } from "@/lib/game/constants";
import {
  PASS_LEVELS,
  RARITY_LABELS,
  SKINS,
  missionLabel,
  passLevelReached,
  skinById,
} from "@/lib/game/meta";
import type { AdKind } from "@/lib/game/ads";
import { cn } from "@/lib/utils";

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
          <p className="mt-2 text-sm text-zinc-400">
            Ye, büyü, hayatta kal — 3 dakikada arenanın kralı ol
          </p>
        </div>

        {dailyToast && (
          <div className="animate-in fade-in slide-in-from-top-2 rounded-xl border border-amber-300/40 bg-amber-400/10 px-4 py-3 text-center text-sm font-semibold text-amber-200 duration-500">
            🎁 Günlük bonus +{dailyToast.granted} 💰
            {dailyToast.streak > 1 && ` · Seri x${dailyToast.streak}`}
          </div>
        )}

        <div className="flex items-center justify-between">
          <CoinBadge coins={meta.coins} />
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-zinc-500">
              Pass Lv.{passLevel} · {meta.passXp} XP
            </span>
            <button
              type="button"
              onClick={onToggleSound}
              aria-label="sesi aç/kapat"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/40 text-sm"
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
                GÜNLÜK GÖREVLER
              </span>
              {claimable > 0 && (
                <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-slate-950">
                  {claimable} ödül hazır
                </span>
              )}
            </div>
            {meta.missions.map((m, i) => {
              const pct = Math.min(100, Math.round((m.progress / m.target) * 100));
              return (
                <div key={m.kind} className="flex items-center gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between text-xs">
                      <span className="truncate text-zinc-300">{missionLabel(m)}</span>
                      <span className="ml-2 shrink-0 font-mono text-zinc-500">
                        {Math.min(m.progress, m.target)}/{m.target}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-black/40">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          m.done ? "bg-emerald-400" : "bg-cyan-400",
                        )}
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
                    <span className="shrink-0 font-mono text-[10px] text-zinc-600">
                      +{m.reward}
                    </span>
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
            placeholder="takma adın…"
            aria-label="Oyuncu adı"
            className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-center font-bold text-white outline-none placeholder:text-zinc-600 focus:border-cyan-400/70"
          />

          <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Kostüm seç">
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
              Arena <b>{arenaCode}</b>
            </span>
            <span className="flex gap-1.5">
              <button
                type="button"
                onClick={onCopyInvite}
                className="rounded-lg border border-white/15 px-2.5 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-white/10"
              >
                {copied ? "✅ kopyalandı" : "🔗 davet linki"}
              </button>
              <button
                type="button"
                onClick={onNewArena}
                className="rounded-lg border border-white/15 px-2.5 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-white/10"
              >
                🎲 yeni
              </button>
            </span>
          </div>
        </div>

        <PanelButton onClick={onPlay} className="w-full py-4 text-lg">
          ▶️ OYNA
        </PanelButton>

        <div className="grid grid-cols-2 gap-3">
          <PanelButton onClick={onShop} variant="ghost" className="w-full">
            🎁 Kasa & Kostüm
          </PanelButton>
          <PanelButton onClick={onPass} variant="ghost" className="w-full">
            🏅 Brainrot Pass
          </PanelButton>
        </div>

        <div className="flex justify-center gap-6 font-mono text-xs text-zinc-500">
          <span>🏆 rekor {meta.bestMass}</span>
          <span>💀 {meta.totalKills} av</span>
          <span>🔁 {meta.roundsPlayed} tur</span>
        </div>
        </div>
      </div>
    </div>
  );
}

export function DeathScreen({
  killedBy,
  canRevive,
  rank,
  nearMiss,
  onRevive,
  onGiveUp,
  adBusy,
}: {
  killedBy: string;
  canRevive: boolean;
  rank: number;
  nearMiss: boolean;
  onRevive: () => void;
  onGiveUp: () => void;
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
          <h2 className="animate-pulse text-3xl font-black text-amber-300">AZ KALDI!</h2>
        ) : (
          <h2 className="text-2xl font-black text-red-300">YENDİN!</h2>
        )}
        <p className="text-sm text-zinc-400">
          <b className="text-white">{killedBy}</b> seni yuttu · sıralaman{" "}
          <b className="text-white">#{rank}</b>
          {nearMiss && " — bir dahaki sefere sen kazan!"}
        </p>
        {canRevive ? (
          <>
            <PanelButton onClick={onRevive} variant="gold" disabled={adBusy} className="w-full">
              📺 Reklam izle → geri dön (1)
            </PanelButton>
            <p className="text-xs text-zinc-500">Kütlenin %35&apos;i ile aynı turda devam et</p>
          </>
        ) : (
          <p className="text-xs text-zinc-500">Geri dönüş hakkın bitti</p>
        )}
        <PanelButton onClick={onGiveUp} variant="ghost" disabled={adBusy} className="w-full">
          Turu bitir
        </PanelButton>
      </div>
    </div>
  );
}

export function ResultsScreen({
  stats,
  arenaCode,
  onShare,
  onShareCard,
  cardBusy,
  onCopy,
  copied,
  shareSupported,
  onPlayAgain,
  onMenu,
}: {
  stats: RoundStats;
  arenaCode: string;
  onShare: () => void;
  onShareCard: () => void;
  cardBusy: boolean;
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
          {stats.won ? "ARENA SENİN!" : "TUR BİTTİ"}
        </h2>

        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "SIRA", value: `#${stats.rank}` },
            { label: "KÜTLE", value: String(Math.round(stats.maxMass)) },
            { label: "AV", value: String(stats.kills) },
            { label: "SERİ", value: `${stats.bestStreak}×` },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-white/10 bg-white/5 px-1 py-3"
            >
              <div className="font-mono text-lg font-bold text-cyan-300">{s.value}</div>
              <div className="text-[10px] tracking-widest text-zinc-500">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 rounded-xl border border-amber-300/30 bg-amber-400/10 px-4 py-3 font-mono text-sm font-bold">
          <span className="text-amber-300">+{stats.coinsEarned} 💰</span>
          <span className="text-fuchsia-300">+{stats.xpEarned} XP</span>
        </div>

        <PanelButton onClick={onShareCard} variant="gold" disabled={cardBusy} className="w-full">
          {cardBusy ? "⏳ kart hazırlanıyor…" : "🖼️ Kartı paylaş"}
        </PanelButton>
        <div className="grid grid-cols-2 gap-2">
          {shareSupported && (
            <PanelButton onClick={onShare} variant="ghost" className="w-full">
              📤 Metin
            </PanelButton>
          )}
          <PanelButton
            onClick={onCopy}
            variant="ghost"
            className={cn("w-full", !shareSupported && "col-span-2")}
          >
            {copied ? "✅ Kopyalandı" : "🔗 Link kopyala"}
          </PanelButton>
        </div>
        <p className="font-mono text-xs text-zinc-500">
          Arena {arenaCode} — arkadaşın aynı arenada seni geçmeye çalışsın
        </p>

        <PanelButton onClick={onPlayAgain} className="w-full py-4 text-lg">
          🔁 BİR TUR DAHA
        </PanelButton>
        <PanelButton onClick={onMenu} variant="ghost" className="w-full">
          🏠 Menü
        </PanelButton>
      </div>
    </div>
  );
}

export function ShopScreen({
  meta,
  crateResult,
  onOpenCrate,
  onEquip,
  onBack,
}: {
  meta: MetaState;
  crateResult: CrateResult | null;
  onOpenCrate: () => void;
  onEquip: (id: string) => void;
  onBack: () => void;
}) {
  return (
    <div className="absolute inset-0 z-20 overflow-y-auto bg-[#070312]/95 p-4">
      <div className="mx-auto max-w-md space-y-5 py-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-white">🎁 Kasa & Kostüm</h2>
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
              <div
                className={cn(
                  "text-lg font-black",
                  RARITY_STYLES[crateResult.skin.rarity].split(" ")[1],
                )}
              >
                {crateResult.skin.name}
              </div>
              <div className="text-xs text-zinc-400">
                {RARITY_LABELS[crateResult.skin.rarity]}
                {crateResult.duplicate && ` · kopya! +${crateResult.refund} 💰 iade`}
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="text-6xl">📦</div>
              <p className="text-xs text-zinc-400">
                %60 sıradan · %25 nadir · %12 epik · %3 efsanevi
              </p>
            </div>
          )}
          <PanelButton
            onClick={onOpenCrate}
            variant="gold"
            disabled={meta.coins < CRATE_COST}
            className="w-full"
          >
            Kasayı aç — {CRATE_COST} 💰
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
                title={`${s.name} · ${RARITY_LABELS[s.rarity]}${s.passExclusive ? " · Pass özel" : ""}`}
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
          ← Geri
        </PanelButton>
      </div>
    </div>
  );
}

export function PassScreen({
  meta,
  onClaim,
  onBack,
}: {
  meta: MetaState;
  onClaim: (level: number) => void;
  onBack: () => void;
}) {
  const reached = passLevelReached(meta.passXp);
  return (
    <div className="absolute inset-0 z-20 overflow-y-auto bg-[#070312]/95 p-4">
      <div className="mx-auto max-w-md space-y-4 py-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-white">🏅 Brainrot Pass</h2>
          <span className="font-mono text-sm font-bold text-fuchsia-300">{meta.passXp} XP</span>
        </div>
        <p className="text-xs text-zinc-500">
          Sezon 1 · Her tur XP kazandırır — 5/10/15. seviyelerde özel kostümler
        </p>

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
                  unlocked
                    ? "border-cyan-400/40 bg-cyan-400/5"
                    : "border-white/10 bg-white/5 opacity-60",
                )}
              >
                <div>
                  <div className="text-sm font-bold text-white">
                    Lv.{l.level} <span className="ml-2">{rewardText}</span>
                  </div>
                  <div className="font-mono text-[10px] text-zinc-500">{l.xpRequired} XP</div>
                </div>
                {claimed ? (
                  <span className="text-xs font-bold text-emerald-400">✅ alındı</span>
                ) : unlocked ? (
                  <button
                    type="button"
                    onClick={() => onClaim(l.level)}
                    className="rounded-lg bg-cyan-400 px-3 py-1.5 text-xs font-bold text-slate-950 active:scale-95"
                  >
                    AL
                  </button>
                ) : (
                  <span className="text-xs text-zinc-600">🔒</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="rounded-xl border border-amber-300/30 bg-amber-400/5 px-4 py-3 text-center text-xs text-amber-200/80">
          ⭐ Premium Pass (2x XP + özel kostümler) portal lansmanında geliyor
        </div>

        <PanelButton onClick={onBack} variant="ghost" className="w-full">
          ← Geri
        </PanelButton>
      </div>
    </div>
  );
}

export function AdOverlay({ kind, remaining }: { kind: AdKind; remaining: number }) {
  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-4 bg-black/95">
      <span className="rounded border border-white/20 px-2 py-0.5 font-mono text-[10px] tracking-[0.3em] text-zinc-400">
        REKLAM
      </span>
      <div className="font-mono text-7xl font-black text-white">{remaining}</div>
      <p className="max-w-xs text-center text-xs text-zinc-500">
        {kind === "rewarded" ? "Ödül: aynı turda geri dönüş" : "Sonraki tur yükleniyor"}
        <br />
        (Portal SDK yuvası — canlıda Poki / CrazyGames reklamı burada oynar)
      </p>
    </div>
  );
}
