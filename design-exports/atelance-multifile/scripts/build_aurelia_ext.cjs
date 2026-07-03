const fs = require("fs");
const U = "/root/.claude/uploads/02a7b614-0e01-5664-8264-953bea6c3062";
const OUT = "/tmp/claude-0/-home-user-web-site/02a7b614-0e01-5664-8264-953bea6c3062/scratchpad/site_out/work/aurelia.html";

const lines = fs.readFileSync(U + "/ec4674c7-Aurelia_standalone_2.html", "utf8").split("\n");

// manifest = longest line
let mi = -1, ml = 0;
lines.forEach((l, i) => { if (l.length > ml) { ml = l.length; mi = i; } });
// template = JSON-string line decoding to HTML with cloudfront
let ti = -1, tmpl = null;
for (let i = 0; i < lines.length; i++) {
  if (i === mi) continue;
  const l = lines[i];
  if (l.length > 3000 && l[0] === '"') {
    try { const s = JSON.parse(l); if (typeof s === "string" && s.includes("cloudfront.net")) { ti = i; tmpl = s; break; } } catch (e) {}
  }
}
if (ti < 0) throw new Error("aurelia template not found");
const man = JSON.parse(lines[mi]);

const esc = (s) => s.replace(/<\//g, "<\\u002F");
if (esc(JSON.stringify(JSON.parse(lines[ti]))) !== lines[ti]) throw new Error("template encoding mismatch");

// 1) externalize hero video: <source src="UUID"> -> external path; drop the asset
const HERO = "7af19db3-81b4-4e4e-bc77-725ced9670c0";
if (!man[HERO] || man[HERO].mime !== "video/mp4") throw new Error("hero asset missing");
const heroRefs = tmpl.split(HERO).length - 1;
if (heroRefs !== 1) throw new Error("hero UUID in template count=" + heroRefs);
tmpl = tmpl.split(HERO).join("/videos/aurelia_hero.mp4");
delete man[HERO];

// 2) externalize 6 property videos: cloudfront URL -> /videos/aurelia_0X.mp4
const urls = fs.readFileSync("/tmp/cf_urls.txt", "utf8").split("\n").map(s => s.trim()).filter(Boolean);
if (urls.length !== 6) throw new Error("expected 6 cf urls");
urls.forEach((url, i) => {
  const path = "/videos/aurelia_0" + (i + 1) + ".mp4";
  const c = tmpl.split(url).length - 1;
  if (c !== 1) throw new Error("cf url " + (i + 1) + " count=" + c);
  tmpl = tmpl.split(url).join(path);
});

// 3) neutralize fake social-account links (accounts not owned; footer label kept)
for (const soc of [
  '<a href="https://www.instagram.com/aurelia.residences/" target="_blank" rel="noopener noreferrer"',
  '<a href="https://www.linkedin.com/company/aurelia-residences/" target="_blank" rel="noopener noreferrer"',
]) {
  const c = tmpl.split(soc).length - 1;
  if (c !== 1) throw new Error("social anchor not found: " + soc.slice(0, 60));
  tmpl = tmpl.replace(soc, '<a href="#"');
}

// 4) INSTANT video start in the property detail view.
// Before: video hidden (opacity 0) until `canplaythrough` (large buffer on a ~25MB
// file) with a 6s fallback -> long blank wait. Also blinked at every loop seam.
// After: play() fires immediately + on `canplay`; video appears on `playing`;
// no loop-seam blink; fallback tightened to 1.2s.
{
  const OLD =
    "V.style.opacity='0'; if(!V._xf){ V._xf=true; V.addEventListener('timeupdate', function(){ var dd=this.duration||0; if(dd){ this.style.opacity=(dd-this.currentTime<0.35)?'0':'1'; } }); V.addEventListener('canplaythrough', function(){ if(this.style.opacity!=='1'){ this.style.opacity='1'; var p=this.play(); if(p&&p.catch)p.catch(function(){}); } }); } V.setAttribute('src', u); try{ V.load(); }catch(e){}";
  const NEW =
    "if(window.__vwarmAbort)window.__vwarmAbort(); V.style.opacity='0'; if(!V._xf){ V._xf=true; V.addEventListener('playing', function(){ this.style.opacity='1'; }); V.addEventListener('canplay', function(){ var p=this.play(); if(p&&p.catch)p.catch(function(){}); }); } V.setAttribute('src', u); try{ V.load(); }catch(e){} var p0=V.play(); if(p0&&p0.catch)p0.catch(function(){});";
  if (tmpl.split(OLD).length - 1 !== 1) throw new Error("defvidsrc play block not found");
  tmpl = tmpl.replace(OLD, NEW);
  const OLDT = "}, 6000); })(V,u);";
  if (tmpl.split(OLDT).length - 1 !== 1) throw new Error("6s fallback not found");
  tmpl = tmpl.replace(OLDT, "}, 1200); })(V,u);");
}

// 5) warm the browser cache for all 6 property videos right after load, so the
// detail view starts instantly (preload=auto buffers the opening seconds)
{
  // Sequential warm-up: one video at a time (never starves the hero or a detail
  // video of connections/bandwidth); aborts the moment a detail video loads.
  const WARM =
    '<script>(function(){var c=navigator.connection;if(c&&(c.saveData||/(^|[^45])[23]g/.test(c.effectiveType||"")))return;var urls=["/videos/aurelia_01.mp4","/videos/aurelia_02.mp4","/videos/aurelia_03.mp4","/videos/aurelia_04.mp4","/videos/aurelia_05.mp4","/videos/aurelia_06.mp4"];var stop=false,cur=null;window.__vwarmAbort=function(){stop=true;if(cur){try{cur.removeAttribute("src");cur.load();}catch(e){}cur=null;}};function next(i){if(stop||i>=urls.length){cur=null;return;}var v=document.createElement("video");cur=v;v.muted=true;v.preload="auto";v.src=urls[i];var done=false;function go(){if(done)return;done=true;setTimeout(function(){next(i+1);},200);}v.addEventListener("canplaythrough",go);v.addEventListener("error",go);setTimeout(go,2500);(window.__vwarm=window.__vwarm||[]).push(v);}function start(){var h=document.getElementById("hero-v1");if(h&&h.readyState<4){var s=false;var kick=function(){if(s)return;s=true;setTimeout(function(){next(0);},500);};h.addEventListener("canplaythrough",kick);setTimeout(kick,4000);}else{setTimeout(function(){next(0);},800);}}if(document.readyState==="complete"){start();}else{window.addEventListener("load",start);}})();</script>';
  const c = tmpl.split("</body>").length - 1;
  if (c !== 1) throw new Error("expected 1 </body> in aurelia template, got " + c);
  tmpl = tmpl.replace("</body>", WARM + "\n</body>");
}

// 6) head meta via <helmet> + lang
const BASE = "https://preview--proud-pebble-833.higgsfield.app";
{
  const HELM = "<helmet>\n";
  if (tmpl.split(HELM).length - 1 !== 1) throw new Error("helmet open not found");
  const META = [
    "<title>AURELIA — Lüks Rezidanslar & Penthouse'lar</title>",
    '<meta name="description" content="Işık ve mermerle çerçevelenmiş, kürate edilmiş rezidans koleksiyonu. Altı imza mülk. Konsept çalışma · Demo.">',
    '<meta name="theme-color" content="#16211d">',
    '<link rel="icon" href="/favicon.ico" sizes="32x32">',
    '<meta property="og:type" content="website">',
    '<meta property="og:site_name" content="AURELIA">',
    "<meta property=\"og:title\" content=\"AURELIA — Lüks Rezidanslar & Penthouse'lar\">",
    '<meta property="og:description" content="Kürate edilmiş rezidans koleksiyonu. Konsept çalışma · Demo.">',
    '<meta property="og:url" content="' + BASE + '/work/aurelia.html">',
    '<meta property="og:image" content="' + BASE + '/og-aurelia.jpg">',
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    '<meta name="twitter:card" content="summary_large_image">',
  ].join("\n");
  tmpl = tmpl.replace(HELM, HELM + META + "\n");
  if (tmpl.split("<html><head>").length - 1 === 1) tmpl = tmpl.replace("<html><head>", '<html lang="tr"><head>');
}

// 7) mobile header: at ≤560px the fixed header (logo subtitles + select + CTA)
// overflowed and the Randevu button was clipped. Hide the logo subtitles and
// tighten paddings on small screens.
{
  const MQ = "@media (max-width:860px){ [data-nav] nav{display:none !important} }";
  if (tmpl.split(MQ).length - 1 !== 1) throw new Error("860px media rule not found");
  const MQ_NEW = MQ +
    '\n  @media (max-width:560px){ [data-nav]{padding:12px 14px !important} [data-nav]>a[href="#top"] span+span{display:none !important} [data-nav] a[href="#contact"]{padding:9px 13px !important;font-size:11px !important} [data-nav] select{min-height:34px} }' +
    // Mobile layout: collapse every inline multi-column grid to one column, with
    // tasteful exceptions (stats 2x2, gallery mosaic, label/value pairs). Fixes
    // the clipped contact form, footer columns and detail künye card at 390px.
    '\n  @media (max-width:700px){' +
    ' div[style*="grid-template-columns"]{grid-template-columns:1fr !important}' +
    ' div[style*="repeat(4,1fr)"]{grid-template-columns:repeat(2,1fr) !important}' +
    ' div[style*="grid-template-columns:repeat(2,1fr)"]{grid-template-columns:repeat(2,1fr) !important}' +
    ' div[style*="grid-template-columns:1fr 1fr"]{grid-template-columns:1fr 1fr !important}' +
    ' div[style*="1fr auto 1fr"]{justify-items:center;row-gap:12px;text-align:center}' +
    ' div[style*="1.6fr 1fr 1fr 1fr"] a{display:inline-block;padding:5px 0}' +
    ' [data-detailview]>div:first-child{padding:10px 14px !important}' +
    ' [data-detailview]>div:first-child a[href="#contact"]{padding:9px 12px !important;font-size:10px !important;white-space:nowrap}' +
    ' [data-detailview]>div:first-child button{font-size:10px !important}' +
    ' }';
  tmpl = tmpl.replace(MQ, MQ_NEW);
}

// re-encode
lines[mi] = JSON.stringify(man);
lines[ti] = esc(JSON.stringify(tmpl));
if (lines[ti].match(/<\//g)) throw new Error("template still has literal </");

// "concept / demo" disclaimer badge (this is a demo brand, not a real business)
const { injectBadge } = require("./demo_badge.cjs");
let out = injectBadge(lines.join("\n"));
// outer shell: real title + lang (shown during unpack)
if (out.split("<title>Bundled Page</title>").length - 1 === 1) {
  out = out.replace("<title>Bundled Page</title>", "<title>AURELIA — Lüks Rezidanslar</title>");
  out = out.replace("<html>", '<html lang="tr">');
}
fs.writeFileSync(OUT, out);
console.log("aurelia.html:", (out.length / 1048576).toFixed(2), "MB | assets:", Object.keys(man).length);
console.log("cloudfront left (0):", (out.match(/cloudfront/g) || []).length);
console.log("hero UUID left (0):", (out.match(new RegExp(HERO, "g")) || []).length);
console.log("external video refs:", (out.match(/\/videos\/aurelia_/g) || []).length, "(expect hero+6 in template, may double via JSON)");
