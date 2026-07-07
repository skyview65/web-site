import type { RoundStats } from "@/types/game";
import { skinById } from "./meta";

export interface ShareCardData {
  stats: RoundStats;
  arenaCode: string;
  playerName: string;
  skinId: string;
  killedBy?: string;
}

const W = 1080;
const H = 1350;

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * Render a 1080×1350 brag card to a PNG blob. Images out-click text links
 * everywhere, so this is the game's real virality artifact. Fully offscreen
 * and self-contained, so it works in the single-file standalone build too.
 */
export async function renderShareCard(data: ShareCardData): Promise<Blob | null> {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const { stats, arenaCode, playerName, skinId, killedBy } = data;
  const skin = skinById(skinId);

  // background: deep gradient + neon grid
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0b0620");
  bg.addColorStop(1, "#12043a");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(148, 120, 255, 0.10)";
  ctx.lineWidth = 2;
  for (let x = 0; x <= W; x += 90) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y <= H; y += 90) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // title
  ctx.font = "900 84px ui-sans-serif, system-ui, sans-serif";
  const tg = ctx.createLinearGradient(0, 0, W, 0);
  tg.addColorStop(0, "#67e8f9");
  tg.addColorStop(0.5, "#e879f9");
  tg.addColorStop(1, "#fcd34d");
  ctx.fillStyle = tg;
  ctx.fillText("BRAINROT BATTLE", W / 2, 130);

  // skin avatar in a glowing ring
  const cx = W / 2;
  const cy = 400;
  const rr = 190;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, rr, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(34, 211, 238, 0.12)";
  ctx.fill();
  ctx.clip();
  const img = skin.image ? await loadImage(skin.image) : null;
  if (img) {
    const d = rr * 2;
    ctx.drawImage(img, cx - rr, cy - rr, d, d);
  } else {
    ctx.font = `${rr * 1.4}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
    ctx.fillText(skin.emoji, cx, cy + 10);
  }
  ctx.restore();
  ctx.strokeStyle = stats.won ? "#fcd34d" : "#22d3ee";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(cx, cy, rr, 0, Math.PI * 2);
  ctx.stroke();

  // headline verdict
  ctx.font = "900 76px ui-sans-serif, system-ui, sans-serif";
  ctx.fillStyle = stats.won ? "#fcd34d" : "#f1eadb";
  ctx.fillText(stats.won ? "👑 ARENA KRALI" : `#${stats.rank} SIRADA`, W / 2, 690);

  ctx.font = "600 46px ui-sans-serif, system-ui, sans-serif";
  ctx.fillStyle = "#c4b5fd";
  ctx.fillText(playerName || "kanka", W / 2, 762);

  // stat tiles
  const tiles: Array<[string, string]> = [
    ["KÜTLE", String(Math.round(stats.maxMass))],
    ["AV", String(stats.kills)],
    ["SERİ", `${stats.bestStreak}×`],
  ];
  const tw = 300;
  const th = 200;
  const gap = 30;
  const totalW = tiles.length * tw + (tiles.length - 1) * gap;
  let tx = (W - totalW) / 2;
  const ty = 840;
  for (const [label, value] of tiles) {
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    roundRect(ctx, tx, ty, tw, th, 28);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 2;
    roundRect(ctx, tx, ty, tw, th, 28);
    ctx.stroke();
    ctx.fillStyle = "#67e8f9";
    ctx.font = "900 92px ui-monospace, monospace";
    ctx.fillText(value, tx + tw / 2, ty + 88);
    ctx.fillStyle = "#8b8397";
    ctx.font = "700 34px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText(label, tx + tw / 2, ty + 155);
    tx += tw + gap;
  }

  // killer / taunt line
  if (killedBy && !stats.won) {
    ctx.fillStyle = "#fca5a5";
    ctx.font = "600 40px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText(`${killedBy} beni yedi 😤`, W / 2, 1110);
  }

  // call to action
  ctx.fillStyle = "#f1eadb";
  ctx.font = "800 48px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText("beni geçebilir misin?", W / 2, 1200);
  ctx.fillStyle = "#e879f9";
  ctx.font = "900 56px ui-monospace, monospace";
  ctx.fillText(`ARENA ${arenaCode}`, W / 2, 1270);

  return new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b), "image/png");
  });
}
