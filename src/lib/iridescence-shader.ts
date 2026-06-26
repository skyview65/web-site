// Living iridescence — a WebGL nacre / oil-slick field tuned to the CALA palette.
// Domain-warped FBM carves labyrinthine filaments (echoing the uploaded macro
// texture); a thin-film interference ramp paints them in navy → teal → gold →
// pearl → violet, with restrained chromatic-aberration edges. Slow drift makes it
// read as light breathing across lacquer, not a screensaver.

export const VERT_SRC = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

export const FRAG_SRC = `
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform float uIntensity;
uniform float uMobile;

// -- value noise ------------------------------------------------------------
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p) {
  float s = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    s += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return s;
}

// thin-film interference ramp (iridescent cosine palette)
vec3 iri(float t) {
  vec3 a = vec3(0.21, 0.25, 0.30);
  vec3 b = vec3(0.52, 0.48, 0.40);
  vec3 c = vec3(1.00, 1.00, 1.00);
  vec3 d = vec3(0.06, 0.24, 0.42); // chartreuse / gold / teal / violet rotation
  return a + b * cos(6.2831853 * (c * t + d));
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  vec2 p = uv;
  p.x *= uRes.x / uRes.y;

  float T = uTime * 0.035;
  float scale = mix(3.2, 2.4, uMobile);

  // two-stage domain warp -> flowing nacre filaments
  vec2 q = vec2(
    fbm(p * scale + vec2(0.0, T)),
    fbm(p * scale + vec2(5.2, 1.3 - T))
  );
  vec2 r = vec2(
    fbm(p * scale + q * 2.0 + vec2(1.7, 9.2) + 0.15 * T),
    fbm(p * scale + q * 2.0 + vec2(8.3, 2.8) - 0.13 * T)
  );
  float f = fbm(p * scale + r * 2.4);

  // labyrinthine ridge lines (the worm-like iridescent veins)
  float ridge = abs(sin((r.x + r.y) * 6.0 + f * 8.0 + T * 1.4));
  ridge = pow(1.0 - ridge, 2.2);

  // iridescent phase + thin-film color
  float phase = f * 0.9 + r.x * 0.5 + ridge * 0.55 + 0.08 * T;
  vec3 col = iri(phase);

  // brighten the veins toward gold / chartreuse with a chromatic lift
  vec3 vein = col * 1.7 + vec3(0.10, 0.13, 0.02);
  col = mix(col * 0.35, vein, ridge);

  // settle everything onto a deep CALA-navy ground
  vec3 base = vec3(0.043, 0.075, 0.133); // ~#0B1322
  col = mix(base, col, 0.20 + 0.6 * ridge);

  // gentle vignette so the field frames content
  float vig = smoothstep(1.35, 0.15, length(uv - 0.5) * 1.4);
  col *= mix(0.50, 1.0, vig);

  col *= uIntensity;
  gl_FragColor = vec4(col, 1.0);
}
`;
