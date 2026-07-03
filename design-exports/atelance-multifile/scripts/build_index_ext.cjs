const fs = require("fs"), zlib = require("zlib");
const S = "/tmp/claude-0/-home-user-web-site/02a7b614-0e01-5664-8264-953bea6c3062/scratchpad";
const U = "/root/.claude/uploads/02a7b614-0e01-5664-8264-953bea6c3062";
const OUT = S + "/site_out/index.html";

const rt = fs.readFileSync(S + "/dc_runtime_patched.js", "utf8"); // react+react-dom inlined, no babel
const lines = fs.readFileSync(U + "/cde29a89-Atelance_8.html", "utf8").split("\n");
const manIdx = 164;
let tIdx = -1;
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  if (l.length > 2000 && l[0] === '"' && l.includes("atelierBody1")) {
    try { const s = JSON.parse(l); if (s.includes('id="atelier"')) { tIdx = i; break; } } catch (e) {}
  }
}
if (tIdx < 0) throw new Error("template not found");
const man = JSON.parse(lines[manIdx]);
let tmpl = JSON.parse(lines[tIdx]);

// 1) REMOVE the two embedded work references (now separate files work/cala.html + work/aurelia.html)
const CALA = "90d82a9f-f1e8-4440-97d4-e68e8446e01c";
const AURELIA = "a74ce54c-51d7-40c1-83c4-4c75650b2ec4";
if (!man[CALA] || !man[AURELIA]) throw new Error("embedded refs missing");
delete man[CALA];
delete man[AURELIA];

// 2) self-contained runtime (React/ReactDOM inlined as data: URLs)
{
  const gz = zlib.gzipSync(Buffer.from(rt, "utf8"), { level: 9 });
  const u = "219d49ab-4bb7-4080-b822-6469046bf0d7";
  man[u] = { ...man[u], data: gz.toString("base64"), mime: "text/javascript", compressed: true };
}

// 3) empty ext_resources (no more calaSite/aureliaSite -> window.__resources = {})
let erIdx = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].startsWith('[{"id":"calaSite"')) { erIdx = i; break; }
}
if (erIdx < 0) throw new Error("ext_resources data line not found");
lines[erIdx] = "[]";

// 4) center atelier section (unchanged from delivered build)
const GRID = '<div data-grid2="" style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.7fr);gap:clamp(36px,6vw,110px);align-items:start">';
const GRID_NEW = '<div data-grid2="" style="display:flex;flex-direction:column;align-items:center;text-align:center;gap:clamp(26px,4.5vw,56px);max-width:820px;margin:0 auto">';
const sI = tmpl.indexOf('<section id="atelier"');
const gI = tmpl.indexOf(GRID, sI);
if (gI < 0 || gI > tmpl.indexOf("{{ t.atelierLabel }}", sI)) throw new Error("atelier scope");
tmpl = tmpl.slice(0, gI) + GRID_NEW + tmpl.slice(gI + GRID.length);
const B2 = 'max-width:56ch;transition-delay:.12s">{{ t.atelierBody2 }}</p>';
const B2N = 'max-width:56ch;margin-left:auto;margin-right:auto;transition-delay:.12s">{{ t.atelierBody2 }}</p>';
if (tmpl.split(B2).length - 1 !== 1) throw new Error("body2 scope");
tmpl = tmpl.replace(B2, B2N);

// 5) aureliaLine 8-lang real-estate copy (positional, sanity-checked)
const newVals = [
  "Lüks rezidanslar ve penthouse’lar sunan bir emlak markası, ışık ve mermerle çerçevelenmiş.",
  "A real-estate brand offering luxury residences and penthouses, framed by light and marble.",
  "Un marchio immobiliare di residenze di lusso e attici, incorniciati da luce e marmo.",
  "Une marque immobilière de résidences de luxe et de penthouses, cadrés par la lumière et le marbre.",
  "Una marca inmobiliaria de residencias de lujo y áticos, enmarcados por luz y mármol.",
  "علامة عقارية للمساكن الفاخرة والبنتهاوسات، يؤطّرها الضوء والرخام.",
  "برندی املاکی برای رزیدنس‌های لوکس و پنت‌هاوس‌ها، قاب‌گرفته در نور و مرمر.",
  "Ett fastighetsvarumärke med lyxbostäder och takvåningar, inramade av ljus och marmor.",
];
const sanity = ["çatı", "multilingual", "residenziale", "résidentielle", "residencial", "متعددة", "چندزبانه", "boendeupplevelse"];
const matches = [...tmpl.matchAll(/aureliaLine:"([^"]*)"/g)];
if (matches.length !== 8) throw new Error("expected 8 aureliaLine, found " + matches.length);
matches.forEach((m, i) => { if (!m[1].includes(sanity[i])) throw new Error("lang order mismatch at " + i); });
for (let i = matches.length - 1; i >= 0; i--) {
  const m = matches[i];
  tmpl = tmpl.slice(0, m.index) + 'aureliaLine:"' + newVals[i] + '"' + tmpl.slice(m.index + m[0].length);
}

// 6) work-card description lines: muted gray -> white
for (const key of ["calaLine", "aureliaLine"]) {
  const oldP = '<p style="margin-top:14px;color:var(--mut);font-size:clamp(15px,1.4vw,18px);max-width:54ch">{{ t.' + key + ' }}</p>';
  const newP = '<p style="margin-top:14px;color:#fff;font-size:clamp(15px,1.4vw,18px);max-width:54ch">{{ t.' + key + ' }}</p>';
  if (tmpl.split(oldP).length - 1 !== 1) throw new Error("work-line not found: " + key);
  tmpl = tmpl.split(oldP).join(newP);
}

// 7) strip openWork onclick -> plain navigation to href (work/cala.html, work/aurelia.html)
const OC = ' onclick="{{ openWork }}"';
const ocCount = tmpl.split(OC).length - 1;
if (ocCount !== 2) throw new Error("expected 2 onclick openWork, found " + ocCount);
tmpl = tmpl.split(OC).join("");

// 8) intro: the loading wordmark pulsed opacity .28<->1 forever ("kapanıp açılma").
// Make it fade in ONCE and hold steady so the brand name appears cleanly (the cover
// then fades out to the hero via the existing `lout`).
const PULSE_KF = '@keyframes lpulse{0%,100%{opacity:.28}50%{opacity:1}}';
if (tmpl.split(PULSE_KF).length - 1 !== 1) throw new Error("lpulse keyframe not found");
tmpl = tmpl.replace(PULSE_KF, '@keyframes lpulse{0%{opacity:0}100%{opacity:1}}');
const PULSE_EL = 'animation:lpulse 1.6s ease-in-out infinite';
if (tmpl.split(PULSE_EL).length - 1 !== 1) throw new Error("lpulse element not found");
tmpl = tmpl.replace(PULSE_EL, 'animation:lpulse .8s ease-out both');

// 9) content accuracy fixes
//  a) stale copyright year (all 8 languages)
{
  const c = tmpl.split("© 2025 Atelance").length - 1;
  if (c !== 8) throw new Error("expected 8x '© 2025 Atelance', got " + c);
  tmpl = tmpl.split("© 2025 Atelance").join("© 2026 Atelance");
}
//  b) "E posta" -> "E-posta" (TR)
{
  const c = tmpl.split("E posta").length - 1;
  if (c !== 1) throw new Error("expected 1x 'E posta', got " + c);
  tmpl = tmpl.replace("E posta", "E-posta");
}
//  c) Latin commas inside Arabic/Farsi copy -> Arabic comma ،
{
  const AR_COMMA = /([؀-ۿ]), ?(?=[؀-ۿ])/g;
  const c = (tmpl.match(AR_COMMA) || []).length;
  if (c !== 8) throw new Error("expected 8 latin commas in AR/FA, got " + c);
  tmpl = tmpl.replace(AR_COMMA, "$1، ");
}

// 10) head meta: title/description/OG/theme/favicon via <helmet>, lang on <html>
const BASE = "https://preview--proud-pebble-833.higgsfield.app";
{
  const HELM = "<helmet>\n";
  if (tmpl.split(HELM).length - 1 !== 1) throw new Error("helmet open not found");
  const META = [
    '<title>Atelance — Dijitalin Haute Couture\'ü</title>',
    '<meta name="description" content="Atelance bir dijital atölyedir: web sitelerini elde tasarlar ve kodlar. Editoryal, sinematik arayüzler; hızlı, elde yazılmış kod.">',
    '<meta name="theme-color" content="#0B0A0C">',
    '<link rel="icon" href="/favicon.ico" sizes="32x32">',
    '<meta property="og:type" content="website">',
    '<meta property="og:site_name" content="Atelance">',
    '<meta property="og:title" content="Atelance — Dijitalin Haute Couture\'ü">',
    '<meta property="og:description" content="Web sitelerini elde tasarlayan ve kodlayan dijital atölye.">',
    '<meta property="og:url" content="' + BASE + '/">',
    '<meta property="og:image" content="' + BASE + '/og-home.jpg">',
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    '<meta name="twitter:card" content="summary_large_image">',
    // Mobile ergonomics + native feel: comfortable tap targets, designed touch
    // feedback (no gray tap-flash), no double-tap-zoom delay, no iOS focus-zoom
    // (16px form fields), svh heroes (no address-bar jump), smooth anchors.
    "<style>" +
    "html{-webkit-text-size-adjust:100%}" +
    "@media (prefers-reduced-motion:no-preference){html{scroll-behavior:smooth}}" +
    "@media (hover:none){" +
      "*{-webkit-tap-highlight-color:transparent}" +
      "a,button,select,input,textarea{touch-action:manipulation}" +
      "a:active,button:active{opacity:.7}" +
      "input,select,textarea{font-size:16px !important}" +
    "}" +
    '@media (max-width:700px){ div[style*="text-align:end"] a{display:inline-block;padding:5px 0} a[href^="mailto"]{display:inline-block;padding:5px 0} [style*="min-height:100vh"]{min-height:100svh !important} }' +
    "</style>",
  ].join("\n");
  tmpl = tmpl.replace(HELM, HELM + META + "\n");
  if (tmpl.split("<html><head>").length - 1 !== 1) throw new Error("template html tag not found");
  tmpl = tmpl.replace("<html><head>", '<html lang="tr"><head>');
}

// re-encode with </ -> /
const esc = (s) => s.replace(/<\//g, "<\\u002F");
lines[manIdx] = esc(JSON.stringify(man));
lines[tIdx] = esc(JSON.stringify(tmpl));

let out = lines.join("\n");
// 11) outer shell: real title + lang (shown during the ~1s unpack)
{
  if (out.split("<title>Bundled Page</title>").length - 1 !== 1) throw new Error("outer title not found");
  out = out.replace("<title>Bundled Page</title>", "<title>Atelance — Dijital Atölye</title>");
  out = out.replace("<html>", '<html lang="tr">'); // first occurrence = outer shell
}
fs.writeFileSync(OUT, out);
console.log("index.html:", (out.length / 1048576).toFixed(2), "MB | assets:", Object.keys(man).length);
console.log("template literal </ (must be 0):", (lines[tIdx].match(/<\//g) || []).length);
console.log("openWork onclick left (0):", (out.match(/onclick[^>]*openWork/g) || []).length);
console.log("cala/aurelia asset refs in manifest (0):", (man[CALA] ? 1 : 0) + (man[AURELIA] ? 1 : 0));
console.log("hrefs -> work pages:", (out.match(/href=\\"work\/(cala|aurelia)\.html\\"/g) || []).length);
