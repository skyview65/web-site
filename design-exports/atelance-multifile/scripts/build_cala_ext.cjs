const fs = require("fs");
const U = "/root/.claude/uploads/02a7b614-0e01-5664-8264-953bea6c3062";
const OUT = "/tmp/claude-0/-home-user-web-site/02a7b614-0e01-5664-8264-953bea6c3062/scratchpad/site_out/work/cala.html";

let txt = fs.readFileSync(U + "/9bea04ef-cala_4_v13_1_2.html", "utf8");
const lines = txt.split("\n");

// 1) empty the giant sofra base64 script (line 848, 0-indexed 847)
const L = 847;
if (!/^<script id="sofra-vid-b64" type="text\/plain">/.test(lines[L]))
  throw new Error("line 848 not the sofra base64 script: " + lines[L].slice(0, 60));
lines[L] = '<script id="sofra-vid-b64" type="text/plain"></script>';
txt = lines.join("\n");

// 2) rewrite the decoder to load the external file instead of decoding base64
const OLD =
'    var h=document.getElementById("sofra-vid-b64");\n' +
'    if(h&&h.textContent){\n' +
'      var b=atob(h.textContent.trim()),u=new Uint8Array(b.length),i=0;\n' +
'      for(;i<b.length;i++)u[i]=b.charCodeAt(i);\n' +
'      vid.src=URL.createObjectURL(new Blob([u],{type:"video/mp4"}));\n' +
'      vid.load();var pr=vid.play();if(pr&&pr.catch)pr.catch(function(){});\n' +
'    }';
const NEW =
'    vid.src="/videos/cala_scroll.mp4";\n' +
'    vid.load();var pr=vid.play();if(pr&&pr.catch)pr.catch(function(){});';
if (txt.split(OLD).length - 1 !== 1) throw new Error("decoder block match != 1");
txt = txt.replace(OLD, NEW);

// 3) remove the Cloudflare email-protection script (404s off Cloudflare; no obfuscated emails on the page)
const CF = '<script data-cfasync="false" src="/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"></script>';
const cfCount = txt.split(CF).length - 1;
if (cfCount === 1) txt = txt.replace(CF, "");
else if (cfCount !== 0) throw new Error("unexpected cf email-decode count: " + cfCount);
if (txt.includes("/cdn-cgi/")) throw new Error("cdn-cgi reference still present");

// guards
if (txt.includes("sofra-vid-b64") && /textContent/.test(txt.slice(txt.indexOf("getElementById(\"sofra\")")))) {
  // ok: the empty script tag id remains, but no decoder reads it
}
if (!txt.includes('vid.src="/videos/cala_scroll.mp4";')) throw new Error("external src not injected");
if (/atob\(h\.textContent/.test(txt)) throw new Error("old decoder still present");

// 4) "concept / demo" disclaimer badge (this is a demo brand, not a real business)
const { injectBadge } = require("./demo_badge.cjs");
txt = injectBadge(txt);

// 5) head meta: theme-color / favicon / OG / twitter (title + description already exist)
const BASE = "https://preview--proud-pebble-833.higgsfield.app";
{
  const DESC = '<meta name="description" content="Likya kıyısında, yalnızca yetişkinlere özel butik bir otel. Berrak bir koyun kırk metre üzerinde, suya 92 basamak.">';
  if (txt.split(DESC).length - 1 !== 1) throw new Error("cala description meta not found");
  const META = [
    DESC,
    '<meta name="theme-color" content="#0A1322">',
    '<link rel="icon" href="/favicon.ico" sizes="32x32">',
    '<meta property="og:type" content="website">',
    '<meta property="og:site_name" content="CALA">',
    "<meta property=\"og:title\" content=\"CALA · Kaş'ta saklı bir koy, dokuz süit\">",
    '<meta property="og:description" content="Yalnızca yetişkinlere özel butik otel. Berrak bir koyun kırk metre üzerinde. Kurgusal konsept çalışma · Demo.">',
    '<meta property="og:url" content="' + BASE + '/work/cala.html">',
    '<meta property="og:image" content="' + BASE + '/og-cala.jpg">',
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    '<meta name="twitter:card" content="summary_large_image">',
    // Mobile ergonomics: comfortable tap targets + legible labels on phones
    // (MENÜ button was 62x11px; form labels & footer were 9px).
    "<style>@media (max-width:700px){" +
      ".menu-btn{padding:12px 10px}" +
      ".dil-sec{font-size:11px;padding:9px 22px 9px 10px;min-height:34px}" +
      ".rez{padding:12px 18px;font-size:10px}" +
      "label{font-size:10px}" +
      ".rez-note{font-size:10px}" +
      "footer a{display:inline-block;padding:6px 2px}" +
    "}</style>",
  ].join("\n");
  txt = txt.replace(DESC, META);
}

fs.writeFileSync(OUT, txt);
console.log("cala.html:", (txt.length / 1048576).toFixed(2), "MB");
console.log("data:video count (dalis inline, expect 1):", (txt.match(/src="data:video/g) || []).length);
console.log("external video refs:", (txt.match(/\/videos\/cala_scroll\.mp4/g) || []).length);
