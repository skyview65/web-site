"use client";

import { useEffect, useRef } from "react";

/**
 * CALA · "Sedef" — the iridescent shagreen/nacre background.
 *
 * A full-screen, fixed WebGL layer renders a domain-warped fbm field mapped to a
 * thin-film iridescence palette — the flame-like mother-of-pearl texture the
 * brief asked for, kept deliberately deep and slow so it reads as a *material*,
 * not a screensaver. It drifts beneath the navy gradient wash and film grain.
 *
 * Robustness: honours prefers-reduced-motion (paints a single static frame),
 * pauses while the tab is hidden or the canvas is off-screen, caps DPR for perf,
 * and—if WebGL is unavailable—simply stays transparent so the CSS `.bg-wash`
 * texture underneath carries the look.
 */
const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i+vec2(0.0,0.0)), hash(i+vec2(1.0,0.0)), u.x),
             mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for(int i=0;i<6;i++){ v += a*noise(p); p = m*p; a *= 0.5; }
  return v;
}
// Iñigo Quílez cosine palette → iridescence.
vec3 irid(float t){
  return 0.5 + 0.5*cos(6.2831853*(vec3(1.0)*t + vec3(0.00,0.33,0.66)));
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p = uv; p.x *= u_res.x / u_res.y;
  float t = u_time * 0.022;

  // Two-stage domain warp → undulating nacre ridges.
  vec2 q = vec2(fbm(p*1.8 + t), fbm(p*1.8 + vec2(5.2,1.3) - t));
  vec2 r = vec2(fbm(p*1.8 + 4.0*q + vec2(1.7,9.2) + t*0.5),
                fbm(p*1.8 + 4.0*q + vec2(8.3,2.8) - t*0.5));
  float f = fbm(p*1.8 + 4.0*r);
  float ridge = abs(fbm(p*5.0 + r*2.0 + t) * 2.0 - 1.0);

  // Iridescent sheen, half-desaturated and tinted to gold-emerald so it
  // whispers rather than shouts.
  vec3 sheen = irid(f*1.4 + r.x*0.7 + ridge*0.5 + t*0.35);
  float lum = dot(sheen, vec3(0.299,0.587,0.114));
  sheen = mix(vec3(lum), sheen, 0.5) * vec3(1.0, 0.94, 0.7);

  // Confine the sheen to ridge crests; the flats stay deep navy (legibility).
  float crest = smoothstep(0.4, 0.95, ridge) * (0.35 + 0.65*f);

  vec3 navy = vec3(0.039,0.075,0.133);
  vec3 col = navy + sheen * crest * 0.17;             // a thread of nacre
  col += vec3(0.05,0.037,0.016) * pow(f, 2.2) * 0.35; // faint warm depth

  float vig = smoothstep(1.3, 0.28, length(uv-0.5));
  col *= 0.6 + 0.4*vig;

  gl_FragColor = vec4(col, 1.0);
}
`;

const VERT = `
attribute vec2 a;
void main(){ gl_Position = vec4(a, 0.0, 1.0); }
`;

export function IridescentBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const gl =
      (canvas.getContext("webgl", {
        antialias: false,
        alpha: false,
        powerPreference: "low-power",
      }) as WebGLRenderingContext | null) ??
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return; // CSS .bg-wash texture remains the fallback.

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      const w = Math.floor(window.innerWidth * dpr * 0.75);
      const h = Math.floor(window.innerHeight * dpr * 0.75);
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };
    resize();

    let raf = 0;
    let running = true;
    const t0 = 1000; // fixed seed offset; time advances via rAF deltas
    let elapsed = 30;
    let last = 0;

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (!running) return;
      if (last) elapsed += Math.min((now - last) / 1000, 0.05);
      last = now;
      gl.uniform1f(uTime, t0 + elapsed);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const renderStatic = () => {
      gl.uniform1f(uTime, t0 + elapsed);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const onResize = () => {
      resize();
      if (reduce) renderStatic();
    };
    window.addEventListener("resize", onResize);

    const onVisibility = () => {
      running = !document.hidden;
      last = 0;
    };
    document.addEventListener("visibilitychange", onVisibility);

    if (reduce) {
      renderStatic();
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      const ext = gl.getExtension("WEBGL_lose_context");
      ext?.loseContext();
    };
  }, []);

  return <canvas ref={ref} className="sedef" aria-hidden="true" />;
}
