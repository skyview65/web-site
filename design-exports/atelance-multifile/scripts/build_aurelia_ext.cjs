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
    "if(window.__collPause)window.__collPause(); V.style.opacity='0'; if(!V._xf){ V._xf=true; V.addEventListener('playing', function(){ this.style.opacity='1'; }); V.addEventListener('canplay', function(){ var p=this.play(); if(p&&p.catch)p.catch(function(){}); }); } V.setAttribute('src', u); try{ V.load(); }catch(e){} var p0=V.play(); if(p0&&p0.catch)p0.catch(function(){});";
  if (tmpl.split(OLD).length - 1 !== 1) throw new Error("defvidsrc play block not found");
  tmpl = tmpl.replace(OLD, NEW);
  const OLDT = "}, 6000); })(V,u);";
  if (tmpl.split(OLDT).length - 1 !== 1) throw new Error("6s fallback not found");
  tmpl = tmpl.replace(OLDT, "}, 1200); })(V,u);");
}

// 5) COLLECTION VIDEOS: each property card plays its clip when scrolled into view.
// (a) insert a lazy <video> layered over the base64 poster image in each card;
// (b) an IntersectionObserver plays the visible ones (pausing off-screen and while
// a detail view is open) — this also warms the HTTP cache so the detail view stays
// instant, replacing the old blind sequential warm-up.
{
  let inserted = 0;
  for (let n = 1; n <= 6; n++) {
    const cardStart = tmpl.indexOf('data-pid="p' + n + '"');
    if (cardStart < 0) throw new Error("collection card p" + n + " not found");
    const marker = 'object-fit:cover">';
    const imgEnd = tmpl.indexOf(marker, cardStart);
    // guard: the img must be inside THIS card (before the next card / far away)
    const nextCard = tmpl.indexOf('data-pid="p' + (n + 1) + '"', cardStart);
    if (imgEnd < 0 || (nextCard > 0 && imgEnd > nextCard)) throw new Error("card p" + n + " poster img not found");
    const at = imgEnd + marker.length;
    // lightweight preview clip (~250KB) for the grid; the detail view uses the
    // full-quality /videos/aurelia_0N.mp4
    const vid = '<video data-collvid="/videos/aurelia_0' + n + '_preview.mp4" muted="" loop="" playsinline="" preload="none" aria-hidden="true" tabindex="-1" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .28s ease;pointer-events:none"></video>';
    tmpl = tmpl.slice(0, at) + vid + tmpl.slice(at);
    inserted++;
  }
  if (inserted !== 6) throw new Error("expected 6 collection videos, inserted " + inserted);

  const COLL =
    '<script>(function(){' +
    'var reduce=false;try{reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;}catch(e){}' +
    'var c=navigator.connection,slow=c&&(c.saveData||/(^|[^45])[23]g/.test(c.effectiveType||""));' +
    'if(reduce||slow)return;' +
    'var hoverCap=false;try{hoverCap=matchMedia("(hover:hover) and (pointer:fine)").matches;}catch(e){}' +
    'var io=null,paused=false,wired=(typeof WeakSet!=="undefined")?new WeakSet():{has:function(){return false;},add:function(){}};' +
    'function vis(v){var r=v.getBoundingClientRect();return r.top<innerHeight&&r.bottom>0&&r.width>0;}' +
    // prebuffer (load without playing) so the clip is ready to move the instant a
    // card is hovered — no lag.
    'function buf(v){if(!v.getAttribute("src")){v.preload="auto";v.setAttribute("src",v.getAttribute("data-collvid"));try{v.load();}catch(_){}}}' +
    'function play(v){if(paused)return;buf(v);var p=v.play();if(p&&p.catch)p.catch(function(){});}' +
    'function stop(v){try{v.pause();}catch(_){}v.style.opacity="0";}' +
    // hover = intent: prefetch the full-quality clip once so the detail view opens fast.
    'var pfd=(typeof WeakSet!=="undefined")?new WeakSet():{has:function(){return false;},add:function(){}};' +
    'function pf(v){if(pfd.has(v))return;pfd.add(v);var full=v.getAttribute("data-collvid").replace("_preview","");var e=document.createElement("video");e.muted=true;e.preload="auto";e.src=full;(window.__pf=window.__pf||[]).push(e);}' +
    // desktop: prebuffer visible cards but only PLAY on hover. touch: autoplay in view.
    'function getIO(){if(io)return io;io=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;if(e.isIntersecting){buf(v);if(!hoverCap)play(v);}else{if(!hoverCap)stop(v);}});},{rootMargin:"600px 0px 600px 0px",threshold:0});return io;}' +
    'function wire(v){if(wired.has(v))return;wired.add(v);v.addEventListener("playing",function(){if(!paused)v.style.opacity="1";});v.addEventListener("error",function(){v.style.opacity="0";});if(hoverCap){var card=(v.closest&&v.closest("[data-pid]"))||v.parentNode;card.addEventListener("mouseenter",function(){play(v);pf(v);});card.addEventListener("mouseleave",function(){stop(v);});card.addEventListener("focusin",function(){play(v);pf(v);});card.addEventListener("focusout",function(){stop(v);});}getIO().observe(v);}' +
    'function scan(){var vs=document.querySelectorAll("video[data-collvid]");for(var i=0;i<vs.length;i++)wire(vs[i]);return vs.length>0;}' +
    'window.__collPause=function(){paused=true;var vs=document.querySelectorAll("video[data-collvid]");for(var i=0;i<vs.length;i++)stop(vs[i]);};' +
    'window.__collResume=function(){paused=false;if(!hoverCap){var vs=document.querySelectorAll("video[data-collvid]");for(var i=0;i<vs.length;i++){if(vis(vs[i]))play(vs[i]);}}};' +
    'function boot(){scan();' +
    'try{new MutationObserver(function(m){for(var i=0;i<m.length;i++){if(m[i].attributeName==="data-detail"){var open=m[i].target.getAttribute("data-detail")==="true";open?window.__collPause():window.__collResume();return;}}}).observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:["data-detail"]});}catch(_){}' +
    'var to=null;try{new MutationObserver(function(){if(to)return;to=setTimeout(function(){to=null;scan();},150);}).observe(document.body,{childList:true,subtree:true});}catch(_){}' +
    // eagerly prebuffer the 6 tiny (~250KB) previews shortly after load so hover is
    // truly instant, not just when a card is already near the viewport.
    'setTimeout(function(){var vs=document.querySelectorAll("video[data-collvid]");for(var i=0;i<vs.length;i++)buf(vs[i]);},1400);' +
    'var k=0,iv=setInterval(function(){scan();if(++k>40)clearInterval(iv);},250);}' +
    'if(document.readyState==="complete")boot();else window.addEventListener("load",boot);' +
    '})();</script>';
  const bc = tmpl.split("</body>").length - 1;
  if (bc !== 1) throw new Error("expected 1 </body> in aurelia template, got " + bc);
  tmpl = tmpl.replace("</body>", COLL + "\n</body>");
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
    ' [style*="min-height:100vh"]{min-height:100svh !important}' +
    ' }' +
    // Native touch feel: contained overlay scroll, designed tap feedback,
    // no tap-flash / double-tap-zoom delay, no iOS focus-zoom, smooth anchors.
    '\n  html{-webkit-text-size-adjust:100%}' +
    '\n  [data-detailview]{overscroll-behavior:contain;-webkit-overflow-scrolling:touch}' +
    '\n  @media (prefers-reduced-motion:no-preference){html{scroll-behavior:smooth}}' +
    '\n  @media (hover:none){ *{-webkit-tap-highlight-color:transparent} a,button,select,input,textarea,[data-pid]{touch-action:manipulation} a:active,button:active,[data-pid]:active{opacity:.7} input,select,textarea{font-size:16px !important} [data-nav] select{padding:5px 8px !important;letter-spacing:0 !important} }';
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
// hide the bundler "Unpacking..." indicator (dev artifact) during unpack
{
  const LD = '<div id="__bundler_loading">Unpacking...</div>';
  if (out.split(LD).length - 1 !== 1) throw new Error("bundler loading div not found");
  out = out.replace(LD, '<div id="__bundler_loading" style="display:none !important"></div>');
}
fs.writeFileSync(OUT, out);
console.log("aurelia.html:", (out.length / 1048576).toFixed(2), "MB | assets:", Object.keys(man).length);
console.log("cloudfront left (0):", (out.match(/cloudfront/g) || []).length);
console.log("hero UUID left (0):", (out.match(new RegExp(HERO, "g")) || []).length);
console.log("external video refs:", (out.match(/\/videos\/aurelia_/g) || []).length, "(expect hero+6 in template, may double via JSON)");
