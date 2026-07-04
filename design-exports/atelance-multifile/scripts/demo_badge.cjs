// Shared "concept / demo" disclaimer badge.
// Injected before the outer </body>. A tiny fixed pill that re-asserts itself for
// a few seconds so it survives the self-unpacking bundles replacing document.body.
// pointer-events:none so it never blocks clicks. The label follows the page's
// language <select> (Cala #dilSec / Aurelia #aurLang, or any select whose options
// include tr+en) and translates on change; RTL-aware for ar/fa.
const BADGE = `<script>(function(){
var I={tr:"Konsept çalışma · Demo",en:"Concept work · Demo",es:"Trabajo conceptual · Demo",fr:"Travail conceptuel · Démo",ru:"Концепт-проект · Демо",el:"Εννοιολογική εργασία · Demo",de:"Konzeptarbeit · Demo",it:"Lavoro concettuale · Demo",ar:"عمل مفاهيمي · نسخة تجريبية",fa:"کار مفهومی · دمو"};
function sel(){var s=document.getElementById("aurLang")||document.getElementById("dilSec");if(s)return s;var ss=document.getElementsByTagName("select");for(var i=0;i<ss.length;i++){var o=ss[i].options||[],h={};for(var j=0;j<o.length;j++)h[o[j].value]=1;if(h.tr&&h.en)return ss[i];}return null;}
function cur(){var s=sel();var l=(s&&s.value)||document.documentElement.getAttribute("lang")||"tr";return I[l]?l:"en";}
function paint(){var d=document.getElementById("__demo_badge__");if(!d)return;var t=d.firstChild;if(!t||t.className!=="__dbt")return;var l=cur(),v=I[l]||I.en,rtl=(l==="ar"||l==="fa");if(t.textContent!==v)t.textContent=v;t.setAttribute("dir",rtl?"rtl":"ltr");t.style.letterSpacing=rtl?"normal":"";t.style.textTransform=rtl?"none":"";}
function a(){
  if(document.getElementById("__demo_badge__"))return;
  var st=document.createElement("style");
  st.textContent="#__demo_badge__{position:fixed;left:50%;bottom:calc(15px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:2147483647;pointer-events:none;font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif;font-size:10px;line-height:1;letter-spacing:.26em;text-transform:uppercase;white-space:nowrap;color:rgba(255,255,255,.86);background:rgba(10,10,12,.6);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.2);border-radius:999px;padding:8px 15px;box-shadow:0 4px 22px rgba(0,0,0,.4)}@media(max-width:560px){#__demo_badge__{font-size:8px;letter-spacing:.2em;padding:6px 11px;bottom:calc(10px + env(safe-area-inset-bottom,0px));opacity:.85}}";
  var d=document.createElement("div");
  d.id="__demo_badge__";
  var t=document.createElement("span");
  t.className="__dbt";
  d.appendChild(t);
  d.appendChild(st);
  (document.body||document.documentElement).appendChild(d);
  paint();
}
if(document.readyState!=="loading")a();else document.addEventListener("DOMContentLoaded",a);
var n=0,iv=setInterval(function(){a();paint();if(++n>90)clearInterval(iv);},80);
window.addEventListener("load",function(){a();paint();});
if(!window.__dbBound){window.__dbBound=true;
  document.addEventListener("change",function(e){if(e.target&&e.target.tagName==="SELECT"){setTimeout(paint,0);setTimeout(paint,140);}},true);
  try{new MutationObserver(paint).observe(document.documentElement,{attributes:true,attributeFilter:["lang","data-lang","dir"]});}catch(_){}
}
})();</script>`;

function injectBadge(html) {
  if (html.split("</body>").length - 1 !== 1) throw new Error("expected exactly one literal </body>");
  return html.replace("</body>", BADGE + "\n</body>");
}

module.exports = { BADGE, injectBadge };
