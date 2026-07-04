/**
 * Build a single, self-contained HTML file of Brainrot Battle.
 *
 * Reuses the real, tested game code (engine, renderer, meta, React UI):
 *  1. Tailwind CLI compiles every utility class the game uses → CSS
 *  2. esbuild bundles the React app into one minified IIFE (React inlined)
 *  3. The menu video is inlined as a data: URI
 *  4. Everything is written into one dist/brainrot-battle.html
 *
 * Output opens by double-click — no server, no install, works offline.
 *
 * Usage: node scripts/build-standalone.mjs
 */
import { build } from "esbuild";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const p = (...s) => resolve(root, ...s);

mkdirSync(p("dist"), { recursive: true });

// 1. Tailwind CSS ----------------------------------------------------------
console.log("• compiling Tailwind CSS…");
execFileSync(
  p("node_modules/.bin/tailwindcss"),
  ["-i", p("scripts/standalone/input.css"), "-o", p("dist/standalone.css"), "--minify"],
  { stdio: "inherit", cwd: root },
);
const css = readFileSync(p("dist/standalone.css"), "utf8");

// 2. JS bundle -------------------------------------------------------------
console.log("• bundling app with esbuild…");
const result = await build({
  entryPoints: [p("scripts/standalone/entry.tsx")],
  bundle: true,
  minify: true,
  format: "iife",
  jsx: "automatic",
  target: "es2020",
  write: false,
  legalComments: "none",
  define: { "process.env.NODE_ENV": '"production"' },
  alias: { "@": p("src") },
  loader: { ".ts": "ts", ".tsx": "tsx" },
});
let js = result.outputFiles[0].text;

// 3. Inline the menu video -------------------------------------------------
console.log("• inlining video…");
// Inline BOTH sources: VP9 webm (royalty-free, Chromium/Firefox) first,
// H.264 mp4 (Safari) as fallback — so the background plays in every browser.
const webm = readFileSync(p("public/videos/brainrot-menu.webm")).toString("base64");
const mp4 = readFileSync(p("public/videos/brainrot-menu.mp4")).toString("base64");
js = js
  .split("/videos/brainrot-menu.webm").join(`data:video/webm;base64,${webm}`)
  .split("/videos/brainrot-menu.mp4").join(`data:video/mp4;base64,${mp4}`);

// 4. Assemble HTML ---------------------------------------------------------
const html = `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<meta name="theme-color" content="#070312" />
<title>🧠 Brainrot Battle</title>
<style>${css}</style>
</head>
<body>
<div id="root"></div>
<script>${js}</script>
</body>
</html>
`;

const out = p("dist/brainrot-battle.html");
writeFileSync(out, html);
const kb = (Buffer.byteLength(html) / 1024).toFixed(0);
console.log(`✓ wrote ${out} (${kb} KB, self-contained)`);
