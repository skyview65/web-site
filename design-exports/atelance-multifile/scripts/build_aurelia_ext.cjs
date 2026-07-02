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

// re-encode
lines[mi] = JSON.stringify(man);
lines[ti] = esc(JSON.stringify(tmpl));
if (lines[ti].match(/<\//g)) throw new Error("template still has literal </");

const out = lines.join("\n");
fs.writeFileSync(OUT, out);
console.log("aurelia.html:", (out.length / 1048576).toFixed(2), "MB | assets:", Object.keys(man).length);
console.log("cloudfront left (0):", (out.match(/cloudfront/g) || []).length);
console.log("hero UUID left (0):", (out.match(new RegExp(HERO, "g")) || []).length);
console.log("external video refs:", (out.match(/\/videos\/aurelia_/g) || []).length, "(expect hero+6 in template, may double via JSON)");
