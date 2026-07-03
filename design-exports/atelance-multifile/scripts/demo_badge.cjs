// Shared "concept / demo" disclaimer badge.
// Injected before the outer </body>. A tiny fixed pill that re-asserts itself for
// a few seconds so it survives the self-unpacking bundles replacing document.body.
// pointer-events:none so it never blocks clicks.
const BADGE = `<script>(function(){
function a(){
  if(document.getElementById("__demo_badge__"))return;
  var s=document.createElement("style");
  s.textContent="#__demo_badge__{position:fixed;left:50%;bottom:15px;transform:translateX(-50%);z-index:2147483647;pointer-events:none;font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif;font-size:10px;line-height:1;letter-spacing:.26em;text-transform:uppercase;white-space:nowrap;color:rgba(255,255,255,.86);background:rgba(10,10,12,.6);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.2);border-radius:999px;padding:8px 15px;box-shadow:0 4px 22px rgba(0,0,0,.4)}#__demo_badge__{bottom:calc(15px + env(safe-area-inset-bottom,0px))}@media(max-width:560px){#__demo_badge__{font-size:8px;letter-spacing:.2em;padding:6px 11px;bottom:calc(10px + env(safe-area-inset-bottom,0px));opacity:.85}}";
  var d=document.createElement("div");
  d.id="__demo_badge__";
  d.textContent="Konsept çalışma · Demo";
  d.appendChild(s);
  (document.body||document.documentElement).appendChild(d);
}
if(document.readyState!=="loading")a();else document.addEventListener("DOMContentLoaded",a);
var n=0,iv=setInterval(function(){a();if(++n>90)clearInterval(iv);},80);
window.addEventListener("load",a);
})();</script>`;

function injectBadge(html) {
  if (html.split("</body>").length - 1 !== 1) throw new Error("expected exactly one literal </body>");
  return html.replace("</body>", BADGE + "\n</body>");
}

module.exports = { BADGE, injectBadge };
