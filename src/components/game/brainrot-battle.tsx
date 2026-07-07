"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  Announcement,
  CrateResult,
  KillFeedEntry,
  LeaderboardRow,
  MetaState,
  PowerKind,
  RoundStats,
  RoundTallies,
  Vec2,
} from "@/types/game";
import { Engine } from "@/lib/game/engine";
import { Renderer, type JoystickState } from "@/lib/game/render";
import { SimulatedAdProvider, type AdKind, type AdProvider } from "@/lib/game/ads";
import { sfx } from "@/lib/game/audio";
import {
  applyDailyBonus,
  applyRoundToMissions,
  claimMission,
  claimPassLevel,
  computeRoundRewards,
  defaultMeta,
  grantRoundRewards,
  loadMeta,
  openCrate,
  refreshMissions,
  saveMeta,
  skinById,
} from "@/lib/game/meta";
import { isValidArenaCode, randomArenaCode } from "@/lib/game/rng";
import {
  AdOverlay,
  DeathScreen,
  MenuScreen,
  PassScreen,
  ResultsScreen,
  ShopScreen,
} from "./screens";
import { cn } from "@/lib/utils";

type Screen = "menu" | "playing" | "dead" | "results" | "shop" | "pass";

interface InputState {
  keys: Set<string>;
  mouse: Vec2 | null;
  mouseDown: boolean;
  joystick: JoystickState;
  pointerId: number | null;
  /** a second finger is down (mobile boost gesture) */
  secondTouch: boolean;
}

interface PowerHud {
  kind: PowerKind;
  left: number;
}

/** UI-safe copy of the engine state — render never touches the engine ref */
interface HudSnapshot {
  timeLeft: number;
  mass: number;
  kills: number;
  streak: number;
  canBoost: boolean;
  powers: PowerHud[];
  leaderboard: LeaderboardRow[];
  killFeed: KillFeedEntry[];
  playerDeathBy: string;
  canRevive: boolean;
  deathRank: number;
  nearMiss: boolean;
}

function makeSnapshot(eng: Engine): HudSnapshot {
  const p = eng.player;
  const powers: PowerHud[] = [];
  if (p.hasteUntil > eng.time) powers.push({ kind: "haste", left: p.hasteUntil - eng.time });
  if (p.magnetUntil > eng.time) powers.push({ kind: "magnet", left: p.magnetUntil - eng.time });
  if (p.shieldUntil > eng.time) powers.push({ kind: "shield", left: p.shieldUntil - eng.time });
  const rank = eng.playerRank();
  return {
    timeLeft: eng.timeLeft(),
    mass: Math.round(p.mass),
    kills: p.kills,
    streak: eng.streak,
    canBoost: eng.canBoost,
    powers,
    leaderboard: eng.leaderboard(),
    killFeed: eng.killFeed.slice(0, 4),
    playerDeathBy: eng.playerDeathBy,
    canRevive: !eng.reviveUsed,
    deathRank: rank,
    // "so close" if you were near the top or died late — reframes the loss
    nearMiss: rank <= 3 || eng.timeLeft() < 25,
  };
}

function formatTime(sec: number): string {
  const s = Math.ceil(sec);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** Reflect the arena code into the URL. No-op if the origin forbids it
 *  (e.g. opened as a local file:// standalone build). */
function syncArenaUrl(code: string): void {
  try {
    const url = new URL(window.location.href);
    url.searchParams.set("arena", code);
    window.history.replaceState(null, "", url);
  } catch {
    // file:// or sandboxed origin — arena still works, just not shareable via URL bar
  }
}

export function BrainrotBattle() {
  const [meta, setMetaState] = useState<MetaState>(defaultMeta);
  const [screen, setScreen] = useState<Screen>("menu");
  const [name, setName] = useState("");
  const [arenaCode, setArenaCode] = useState("");
  const [roundStats, setRoundStats] = useState<RoundStats | null>(null);
  const [dailyToast, setDailyToast] = useState<{ granted: number; streak: number } | null>(null);
  const [crateResult, setCrateResult] = useState<CrateResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [ad, setAd] = useState<{ kind: AdKind; remaining: number } | null>(null);
  const [shareSupported, setShareSupported] = useState(false);
  const [hud, setHud] = useState<HudSnapshot | null>(null);
  const [banner, setBanner] = useState<Announcement | null>(null);
  const [soundOn, setSoundOn] = useState(true);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<Engine | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const screenRef = useRef<Screen>("menu");
  const viewRef = useRef({ w: 0, h: 0 });
  const inputRef = useRef<InputState>({
    keys: new Set(),
    mouse: null,
    mouseDown: false,
    joystick: { active: false, origin: { x: 0, y: 0 }, vector: { x: 0, y: 0 } },
    pointerId: null,
    secondTouch: false,
  });
  const soundRef = useRef(true);
  const bestMassRef = useRef(0);
  const rewardGrantedRef = useRef(false);
  const replayCountRef = useRef(0);
  const adProviderRef = useRef<AdProvider>(new SimulatedAdProvider());
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bannerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hitStopRef = useRef(0);
  const boostBtnRef = useRef(false);
  const milestoneRef = useRef({ mass: 0, pb: false, deathPlayed: false });

  const showBanner = useCallback((a: Announcement) => {
    setBanner(a);
    if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current);
    bannerTimerRef.current = setTimeout(() => setBanner(null), 1400);
  }, []);

  useEffect(() => {
    screenRef.current = screen;
  }, [screen]);

  const updateMeta = useCallback((next: MetaState) => {
    setMetaState(next);
    saveMeta(next);
  }, []);

  // keep frame-loop refs in sync with React state (read inside the RAF closure)
  useEffect(() => {
    soundRef.current = soundOn;
  }, [soundOn]);
  useEffect(() => {
    bestMassRef.current = meta.bestMass;
  }, [meta.bestMass]);

  // hydrate persisted progress + arena code from the invite URL
  // (one frame after mount — SSR markup stays deterministic)
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      let m = loadMeta();
      m = refreshMissions(m, new Date());
      const daily = applyDailyBonus(m, new Date());
      if (daily) {
        m = daily.meta;
        setDailyToast({ granted: daily.granted, streak: daily.streak });
      }
      saveMeta(m);
      setMetaState(m);
      setName(m.playerName);
      setSoundOn(m.soundOn);
      sfx.setEnabled(m.soundOn);

      const fromUrl = (
        new URLSearchParams(window.location.search).get("arena") ?? ""
      ).toUpperCase();
      const code = isValidArenaCode(fromUrl) ? fromUrl : randomArenaCode();
      setArenaCode(code);
      syncArenaUrl(code);

      setShareSupported("share" in navigator);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // canvas sizing (DPR-aware)
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = container.clientWidth;
      const h = container.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      viewRef.current = { w, h };
      canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // keyboard steering
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (
        screenRef.current === "playing" &&
        ["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(k)
      ) {
        e.preventDefault();
      }
      inputRef.current.keys.add(k);
    };
    const up = (e: KeyboardEvent) => {
      inputRef.current.keys.delete(e.key.toLowerCase());
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  const finishRound = useCallback(() => {
    const eng = engineRef.current;
    if (!eng || rewardGrantedRef.current) return;
    rewardGrantedRef.current = true;
    const p = eng.player;
    const rank = eng.playerRank();
    const totalBlobs = eng.livingCount() + (p.alive ? 0 : 1);
    const { coins, xp } = computeRoundRewards(rank, p.kills, eng.playerMaxMass, eng.bestStreak);
    const stats: RoundStats = {
      rank,
      totalBlobs,
      kills: p.kills,
      maxMass: eng.playerMaxMass,
      survivedSec: eng.playerSurvivedSec,
      coinsEarned: coins,
      xpEarned: xp,
      won: rank === 1 && p.alive,
      bestStreak: eng.bestStreak,
    };
    const tallies: RoundTallies = {
      orbs: eng.orbsEaten,
      kills: p.kills,
      maxMass: eng.playerMaxMass,
      reachedRank1: eng.reachedRank1,
      survivedFull: eng.timeLeft() <= 0,
      bestStreak: eng.bestStreak,
    };
    setRoundStats(stats);
    setMetaState((prev) => {
      let next = grantRoundRewards(prev, stats);
      next = applyRoundToMissions(next, tallies);
      saveMeta(next);
      return next;
    });
    setCopied(false);
    setScreen("results");
  }, []);

  // simulation + render loop (runs while the arena is on screen)
  useEffect(() => {
    if (screen !== "playing" && screen !== "dead") return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const computeDir = (): Vec2 => {
      const { keys, joystick, mouse } = inputRef.current;
      let x = 0;
      let y = 0;
      if (keys.has("w") || keys.has("arrowup")) y -= 1;
      if (keys.has("s") || keys.has("arrowdown")) y += 1;
      if (keys.has("a") || keys.has("arrowleft")) x -= 1;
      if (keys.has("d") || keys.has("arrowright")) x += 1;
      if (x !== 0 || y !== 0) {
        const l = Math.hypot(x, y);
        return { x: x / l, y: y / l };
      }
      if (joystick.active) {
        const l = Math.hypot(joystick.vector.x, joystick.vector.y);
        if (l > 10) return { x: joystick.vector.x / l, y: joystick.vector.y / l };
        return { x: 0, y: 0 };
      }
      if (mouse) {
        const dx = mouse.x - viewRef.current.w / 2;
        const dy = mouse.y - viewRef.current.h / 2;
        const l = Math.hypot(dx, dy);
        if (l > 18) return { x: dx / l, y: dy / l };
      }
      return { x: 0, y: 0 };
    };

    const boostHeld = (): boolean => {
      const { keys, pointerId } = inputRef.current;
      return (
        boostBtnRef.current ||
        keys.has(" ") ||
        keys.has("shift") ||
        inputRef.current.mouseDown ||
        pointerId !== null && inputRef.current.secondTouch // second finger on mobile
      );
    };

    let raf = 0;
    let last = performance.now();
    let hudAcc = 0;
    const frame = (now: number) => {
      const eng = engineRef.current;
      const renderer = rendererRef.current;
      if (!eng || !renderer) return;
      const rawDt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;

      // hit-stop: briefly freeze the sim on a big hit while visuals keep animating
      let dt = rawDt;
      if (hitStopRef.current > 0) {
        hitStopRef.current = Math.max(0, hitStopRef.current - rawDt);
        dt = 0;
      }

      if (screenRef.current === "playing") {
        eng.setPlayerDir(computeDir());
        eng.setPlayerBoosting(boostHeld());
        eng.step(dt);

        // drain events once — feed audio + hit-stop here, render below
        const events = eng.consumeEvents();
        for (const ev of events) {
          if (!soundRef.current) continue;
          if (ev.kind === "orb" && ev.byPlayer) sfx.eat(ev.value * 3);
          else if (ev.kind === "power" && ev.byPlayer) sfx.power();
          else if (ev.kind === "kill" && ev.byPlayer) {
            sfx.kill(ev.streak);
            hitStopRef.current = Math.min(0.12, 0.05 + ev.mass * 0.0006);
          }
        }
        // announcer callouts → banner + matching sound
        for (const a of eng.consumeAnnouncements()) {
          showBanner(a);
          if (soundRef.current) {
            if (a.tone === "rank") sfx.fanfare();
            else if (a.tone === "streak") sfx.levelUp();
            else if (a.tone === "power") sfx.power();
          }
        }
        // live personal-best + mass milestones (component owns meta.bestMass)
        const m = Math.round(eng.player.mass);
        const ms = milestoneRef.current;
        for (const gate of [50, 100, 250, 500, 1000]) {
          if (ms.mass < gate && m >= gate) {
            showBanner({ text: `${gate} KÜTLE!`, tone: "milestone" });
            if (soundRef.current) sfx.levelUp();
          }
        }
        if (!ms.pb && bestMassRef.current > 0 && m > bestMassRef.current) {
          ms.pb = true;
          showBanner({ text: "YENİ REKOR!", sub: "en iyi kütlen", tone: "milestone" });
          if (soundRef.current) sfx.fanfare();
        }
        ms.mass = m;

        if (eng.phase === "playerDead") {
          if (soundRef.current && !ms.deathPlayed) {
            sfx.death();
            ms.deathPlayed = true;
          }
          setHud(makeSnapshot(eng));
          setScreen("dead");
          renderer.draw(ctx, eng, viewRef.current.w, viewRef.current.h, rawDt, inputRef.current.joystick, events);
          raf = requestAnimationFrame(frame);
          return;
        } else if (eng.phase === "ended") {
          finishRound();
        }
        renderer.draw(ctx, eng, viewRef.current.w, viewRef.current.h, rawDt, inputRef.current.joystick, events);
      } else {
        // "dead" screen still animating behind the overlay — no sim, no events
        renderer.draw(ctx, eng, viewRef.current.w, viewRef.current.h, rawDt, inputRef.current.joystick, []);
      }

      hudAcc += rawDt;
      if (hudAcc >= 0.15) {
        hudAcc = 0;
        setHud(makeSnapshot(eng));
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [screen, finishRound, showBanner]);

  const startRound = useCallback(
    (m: MetaState, playerName: string, code: string) => {
      const eng = new Engine({
        arenaCode: code,
        playerName: playerName.trim().slice(0, 14) || "kanka",
        playerEmoji: skinById(m.equippedSkin).emoji,
      });
      engineRef.current = eng;
      // console/QA handle — lets e2e tests and curious players poke the sim
      (window as Window & { __brainrot?: Engine }).__brainrot = eng;
      if (!rendererRef.current) rendererRef.current = new Renderer();
      rendererRef.current.reset();
      rewardGrantedRef.current = false;
      hitStopRef.current = 0;
      milestoneRef.current = { mass: 0, pb: false, deathPlayed: false };
      sfx.resume(); // satisfy autoplay policy from the OYNA gesture
      setBanner(null);
      setRoundStats(null);
      setCopied(false);
      setHud(makeSnapshot(eng));
      setScreen("playing");
    },
    [],
  );

  const runAd = useCallback(async (kind: AdKind): Promise<boolean> => {
    setAd({ kind, remaining: kind === "rewarded" ? 5 : 3 });
    const ok = await adProviderRef.current.show(kind, (remaining) =>
      setAd({ kind, remaining: Math.max(0, remaining) }),
    );
    setAd(null);
    return ok;
  }, []);

  const flashCopied = useCallback(() => {
    setCopied(true);
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
  }, []);

  const inviteUrl = useCallback(
    () => `${window.location.origin}/play?arena=${arenaCode}`,
    [arenaCode],
  );

  const handlePlay = () => {
    const next = { ...meta, playerName: name.trim().slice(0, 14) };
    updateMeta(next);
    startRound(next, name, arenaCode);
  };

  const handleRevive = async () => {
    const eng = engineRef.current;
    if (!eng || eng.reviveUsed) return;
    const ok = await runAd("rewarded");
    if (ok && engineRef.current === eng && eng.phase === "playerDead") {
      eng.revivePlayer();
      milestoneRef.current.deathPlayed = false; // allow the death sting again
      setScreen("playing");
    }
  };

  const handleGiveUp = () => {
    engineRef.current?.endRound();
    finishRound();
  };

  const handlePlayAgain = async () => {
    replayCountRef.current += 1;
    if (replayCountRef.current % 2 === 0) {
      await runAd("interstitial");
    }
    startRound(meta, name, arenaCode);
  };

  const buildShareText = (stats: RoundStats) =>
    [
      "🧠 BRAINROT BATTLE",
      `🏆 #${stats.rank} · ⚖️ ${Math.round(stats.maxMass)} kütle · 💀 ${stats.kills} av`,
      `Arena ${arenaCode} — beni geçebilir misin?`,
      inviteUrl(),
    ].join("\n");

  const handleShare = () => {
    if (!roundStats) return;
    navigator.share({ text: buildShareText(roundStats) }).catch(() => {
      // user dismissed the share sheet — nothing to do
    });
  };

  const copyText = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(flashCopied)
      .catch(() => {
        // clipboard unavailable (permissions/insecure context) — silently skip
      });
  };

  const handleCopyResult = () => {
    if (roundStats) copyText(buildShareText(roundStats));
  };

  const handleCopyInvite = () => {
    copyText(`🧠 Brainrot Battle — Arena ${arenaCode}'e gel: ${inviteUrl()}`);
  };

  const handleNewArena = () => {
    const code = randomArenaCode();
    setArenaCode(code);
    syncArenaUrl(code);
  };

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    soundRef.current = next;
    sfx.setEnabled(next);
    if (next) sfx.resume();
    updateMeta({ ...meta, soundOn: next });
    sfx.click();
  };

  const handleClaimMission = (index: number) => {
    const next = claimMission(meta, index);
    if (next) {
      updateMeta(next);
      if (soundRef.current) sfx.crate();
    }
  };

  const handleOpenCrate = () => {
    const out = openCrate(meta, Math.random);
    if (!out) return;
    updateMeta(out.meta);
    if (soundRef.current) sfx.crate();
    setCrateResult(out.result);
  };

  const handleClaimPass = (level: number) => {
    const next = claimPassLevel(meta, level);
    if (next) updateMeta(next);
  };

  const handleEquip = (id: string) => {
    if (meta.ownedSkins.includes(id)) updateMeta({ ...meta, equippedSkin: id });
  };

  // --- pointer input on the arena ---
  const localPoint = (e: React.PointerEvent): Vec2 => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const input = inputRef.current;
    if (e.pointerType === "touch") {
      if (input.pointerId === null) {
        // first finger steers
        input.pointerId = e.pointerId;
        input.joystick = { active: true, origin: localPoint(e), vector: { x: 0, y: 0 } };
      } else {
        // any additional finger = boost
        input.secondTouch = true;
      }
    } else {
      input.mouse = localPoint(e);
      if (e.button === 0) input.mouseDown = true; // hold to boost on desktop
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const input = inputRef.current;
    if (e.pointerType === "touch") {
      if (input.pointerId === e.pointerId && input.joystick.active) {
        const p = localPoint(e);
        input.joystick.vector = {
          x: p.x - input.joystick.origin.x,
          y: p.y - input.joystick.origin.y,
        };
      }
    } else {
      input.mouse = localPoint(e);
    }
  };

  const releasePointer = (e: React.PointerEvent) => {
    const input = inputRef.current;
    if (e.pointerType !== "touch") {
      input.mouseDown = false;
      return;
    }
    if (input.pointerId === e.pointerId) {
      input.pointerId = null;
      input.joystick = { active: false, origin: { x: 0, y: 0 }, vector: { x: 0, y: 0 } };
    } else {
      input.secondTouch = false;
    }
  };

  // --- HUD data (snapshot refreshed ~5×/s by the game loop) ---
  const hudVisible = (screen === "playing" || screen === "dead") && hud !== null;
  const leaderboard = hud?.leaderboard ?? [];
  const top5 = leaderboard.slice(0, 5);
  const playerIdx = leaderboard.findIndex((r) => r.isPlayer);
  const playerOutsideTop5 = playerIdx >= 5 ? leaderboard[playerIdx] : null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden bg-[#070312] font-sans text-white"
    >
      <canvas
        ref={canvasRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={releasePointer}
        onPointerCancel={releasePointer}
        className="absolute inset-0 h-full w-full touch-none select-none"
      />

      {hudVisible && hud && (
        <>
          <div className="pointer-events-none absolute left-3 top-3 w-36 rounded-xl border border-white/10 bg-black/50 p-2.5 backdrop-blur-sm sm:w-44">
            <div className="mb-1.5 text-[10px] font-bold tracking-widest text-zinc-400">
              SIRALAMA
            </div>
            {top5.map((row, i) => (
              <div
                key={row.id}
                className={cn(
                  "flex items-center justify-between gap-1 font-mono text-xs leading-5",
                  row.isPlayer ? "font-bold text-cyan-300" : "text-zinc-300",
                )}
              >
                <span className="truncate">
                  {i + 1}. {row.emoji} {row.name}
                </span>
                <span>{row.mass}</span>
              </div>
            ))}
            {playerOutsideTop5 && (
              <div className="mt-1 flex items-center justify-between gap-1 border-t border-white/10 pt-1 font-mono text-xs font-bold text-cyan-300">
                <span className="truncate">
                  {playerIdx + 1}. {playerOutsideTop5.emoji} {playerOutsideTop5.name}
                </span>
                <span>{playerOutsideTop5.mass}</span>
              </div>
            )}
          </div>

          <div className="pointer-events-none absolute left-1/2 top-3 flex -translate-x-1/2 flex-col items-center gap-1">
            <div className="rounded-full border border-white/10 bg-black/50 px-4 py-1 font-mono text-lg font-bold backdrop-blur-sm">
              ⏱ {formatTime(hud.timeLeft)}
            </div>
            <button
              type="button"
              onClick={handleCopyInvite}
              className="pointer-events-auto rounded-full border border-fuchsia-400/40 bg-black/50 px-3 py-0.5 font-mono text-[10px] text-fuchsia-300 backdrop-blur-sm hover:bg-fuchsia-400/10"
            >
              {copied ? (
                "✅ link kopyalandı"
              ) : (
                <>
                  arena {arenaCode} 🔗
                  <span className="hidden sm:inline"> arkadaşını çağır</span>
                </>
              )}
            </button>
          </div>

          <div className="pointer-events-none absolute right-3 top-3 w-48 space-y-0.5 text-right">
            {hud.killFeed.map((k, i) => (
              <div
                key={`${k.time}-${i}`}
                className={cn(
                  "truncate rounded-lg bg-black/40 px-2 py-0.5 font-mono text-[10px] backdrop-blur-sm",
                  k.eaterIsPlayer
                    ? "text-emerald-300"
                    : k.eatenIsPlayer
                      ? "text-red-300"
                      : "text-zinc-400",
                )}
              >
                {k.eater} 🍴 {k.eaten}
              </div>
            ))}
          </div>

          <div className="pointer-events-none absolute bottom-3 left-3 rounded-xl border border-white/10 bg-black/50 px-3 py-2 font-mono text-sm font-bold backdrop-blur-sm">
            ⚖️ {hud.mass} · 💀 {hud.kills}
          </div>

          {/* active power-ups */}
          {hud.powers.length > 0 && (
            <div className="pointer-events-none absolute bottom-16 left-3 flex gap-1.5">
              {hud.powers.map((p) => (
                <div
                  key={p.kind}
                  className={cn(
                    "flex items-center gap-1 rounded-lg border px-2 py-1 font-mono text-xs font-bold backdrop-blur-sm",
                    p.kind === "haste"
                      ? "border-amber-300/50 bg-amber-400/10 text-amber-300"
                      : p.kind === "magnet"
                        ? "border-fuchsia-400/50 bg-fuchsia-500/10 text-fuchsia-300"
                        : "border-cyan-400/50 bg-cyan-400/10 text-cyan-300",
                  )}
                >
                  {p.kind === "haste" ? "⚡" : p.kind === "magnet" ? "🧲" : "🛡️"}
                  {Math.ceil(p.left)}s
                </div>
              ))}
            </div>
          )}

          {/* combo meter — the draining bar manufactures "don't break the chain" tension */}
          {hud.streak >= 2 && (
            <div className="pointer-events-none absolute left-1/2 top-24 flex -translate-x-1/2 flex-col items-center">
              <div className="font-mono text-2xl font-black text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.7)]">
                {hud.streak}× SERİ
              </div>
            </div>
          )}

          {/* boost button (mobile) + sound toggle */}
          <button
            type="button"
            aria-label="boost"
            onPointerDown={(e) => {
              e.preventDefault();
              boostBtnRef.current = true;
            }}
            onPointerUp={() => (boostBtnRef.current = false)}
            onPointerLeave={() => (boostBtnRef.current = false)}
            onPointerCancel={() => (boostBtnRef.current = false)}
            className={cn(
              "absolute bottom-6 right-4 flex h-20 w-20 select-none items-center justify-center rounded-full border-2 text-3xl transition-transform active:scale-90",
              hud.canBoost
                ? "border-cyan-300 bg-cyan-400/20 text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                : "border-white/15 bg-white/5 text-white/30",
            )}
          >
            🚀
          </button>
          <button
            type="button"
            onClick={toggleSound}
            aria-label="sesi aç/kapat"
            className="absolute right-4 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/50 text-base backdrop-blur-sm"
          >
            {soundOn ? "🔊" : "🔇"}
          </button>

          {/* center announcer banner */}
          {banner && (
            <div className="pointer-events-none absolute left-1/2 top-1/3 z-10 -translate-x-1/2 text-center">
              <div
                className={cn(
                  "animate-in zoom-in-50 fade-in font-black uppercase tracking-tight duration-200",
                  banner.tone === "streak"
                    ? "text-4xl text-amber-300 drop-shadow-[0_0_16px_rgba(251,191,36,0.8)]"
                    : banner.tone === "rank"
                      ? "text-4xl text-cyan-300 drop-shadow-[0_0_16px_rgba(34,211,238,0.8)]"
                      : banner.tone === "power"
                        ? "text-3xl text-fuchsia-300 drop-shadow-[0_0_16px_rgba(232,121,249,0.8)]"
                        : "text-3xl text-emerald-300 drop-shadow-[0_0_16px_rgba(52,211,153,0.8)]",
                )}
              >
                {banner.text}
              </div>
              {banner.sub && (
                <div className="mt-1 font-mono text-sm text-white/70">{banner.sub}</div>
              )}
            </div>
          )}
        </>
      )}

      {screen === "menu" && (
        <MenuScreen
          meta={meta}
          name={name}
          onNameChange={setName}
          onEquip={handleEquip}
          arenaCode={arenaCode}
          onNewArena={handleNewArena}
          onCopyInvite={handleCopyInvite}
          copied={copied}
          dailyToast={dailyToast}
          soundOn={soundOn}
          onToggleSound={toggleSound}
          onClaimMission={handleClaimMission}
          onPlay={handlePlay}
          onShop={() => {
            setCrateResult(null);
            setScreen("shop");
          }}
          onPass={() => setScreen("pass")}
        />
      )}

      {screen === "dead" && hud && (
        <DeathScreen
          killedBy={hud.playerDeathBy}
          canRevive={hud.canRevive}
          rank={hud.deathRank}
          nearMiss={hud.nearMiss}
          onRevive={handleRevive}
          onGiveUp={handleGiveUp}
          adBusy={ad !== null}
        />
      )}

      {screen === "results" && roundStats && (
        <ResultsScreen
          stats={roundStats}
          arenaCode={arenaCode}
          onShare={handleShare}
          onCopy={handleCopyResult}
          copied={copied}
          shareSupported={shareSupported}
          onPlayAgain={handlePlayAgain}
          onMenu={() => {
            setCopied(false);
            setScreen("menu");
          }}
        />
      )}

      {screen === "shop" && (
        <ShopScreen
          meta={meta}
          crateResult={crateResult}
          onOpenCrate={handleOpenCrate}
          onEquip={handleEquip}
          onBack={() => setScreen("menu")}
        />
      )}

      {screen === "pass" && (
        <PassScreen meta={meta} onClaim={handleClaimPass} onBack={() => setScreen("menu")} />
      )}

      {ad && <AdOverlay kind={ad.kind} remaining={ad.remaining} />}
    </div>
  );
}
