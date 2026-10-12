/**
 * GLSL ES 3.00 for the living field. Every particle carries two target
 * positions (aFrom, aTo) and four random numbers (aRand). The vertex shader
 * does the whole morph on the GPU:
 *
 *  - each particle leaves on its own delay, so a form dissolves and
 *    reforms in waves instead of sliding as one block
 *  - while travelling it scatters and twists (the "travel" term)
 *  - uAssemble gathers the cloud together (1) or lets it drift apart (0);
 *    the page ties it to scroll, so reading a section builds the shape
 *  - at rest it shimmers (uJitter) and drifts on a slow flow field (uFlow)
 *  - the pointer pushes and swirls nearby particles
 *  - uBurst is a spring driven from JS (clicks, page changes, intro)
 *
 * Colours arrive in display (sRGB) values and are blended as-is, so no
 * colour-space conversion is needed.
 */
export const fieldVertexShader = /* glsl */ `#version 300 es
precision highp float;

in vec3 aFrom;
in vec3 aTo;
in vec4 aRand;

uniform mat4 uMV;
uniform mat4 uProj;
uniform float uT;
uniform float uTime;
uniform float uSize;
uniform float uPx;
uniform float uBurst;
uniform float uJitter;
uniform float uFlow;
uniform float uAgitate;
uniform float uAssemble;
uniform vec3 uMouse;

out float vMix;
out float vGlow;
out float vFade;

mat2 rot(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat2(c, -s, s, c);
}

void main() {
  float delay = aRand.x * 0.45;
  float k = smoothstep(delay, delay + 0.55, uT);
  vec3 p = mix(aFrom, aTo, k);
  float travel = sin(k * 3.14159265);

  vec3 dir = normalize(aRand.yzw - 0.5 + 0.0001);
  p += dir * travel * (0.7 + aRand.w * 1.8);
  p.xz = rot(travel * (aRand.y - 0.5) * 3.6) * p.xz;

  // Gathering: every particle has its own moment to fall into place.
  float gather = smoothstep(aRand.x * 0.55, aRand.x * 0.55 + 0.45, uAssemble);
  float loose = 1.0 - gather;
  p += normalize(aRand.wzy - 0.5 + 0.0001) * loose * (1.8 + aRand.z * 3.2);
  p.xz = rot(loose * (aRand.y - 0.5) * 2.4) * p.xz;

  float tt = uTime * 0.55 + aRand.x * 6.2831;
  vec3 wob = vec3(
    sin(tt + aRand.y * 6.0),
    cos(tt * 1.13 + aRand.z * 6.0),
    sin(tt * 0.87 + aRand.w * 6.0)
  );
  p += wob * 0.045 * uJitter;

  vec3 fl = vec3(
    sin(p.y * 1.1 + uTime * 0.35),
    sin(p.z * 1.3 - uTime * 0.28),
    sin(p.x * 1.2 + uTime * 0.31)
  );
  p += fl * (0.16 * uFlow + 0.10 * uAgitate);

  p += normalize(p + 0.0001) * uBurst * (1.0 + aRand.z * 2.0) * 0.6;

  vec4 mv = uMV * vec4(p, 1.0);

  vec2 dm = mv.xy - uMouse.xy;
  float d = length(dm);
  float rep = smoothstep(1.05, 0.0, d);
  vec2 away = dm / (d + 0.0001);
  mv.xy += away * rep * rep * 0.5;
  mv.xy += vec2(-away.y, away.x) * rep * 0.18;

  gl_Position = uProj * mv;

  float depth = -mv.z;
  vFade = clamp(1.25 - (depth - 4.5) / 5.5, 0.25, 1.0) * mix(0.3, 1.0, gather);
  vGlow = travel * 0.8 + rep;
  vMix = aRand.y;
  // The quad is 1.7x the visible dot: the extra margin holds a soft halo.
  gl_PointSize = 1.7 * uSize * uPx * (0.45 + aRand.w) *
    (1.0 + travel * 0.5 + rep * 0.9) * (7.0 / depth);
}
`;

export const fieldFragmentShader = /* glsl */ `#version 300 es
precision highp float;

uniform vec3 uColA;
uniform vec3 uColB;
uniform float uAlpha;
uniform float uDim;
uniform float uLight;

in float vMix;
in float vGlow;
in float vFade;

out vec4 outColor;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float r = length(c) * 2.0;
  if (r > 1.0) discard;

  // Bright core (the dot itself) plus a faint halo in the margin.
  float core = pow(max(1.0 - r / 0.62, 0.0), 0.9);
  float halo = pow(1.0 - r, 3.0) * mix(0.28, 0.14, uLight);
  float a = core + halo;

  vec3 col = mix(uColA, uColB, vMix);
  // Dark theme glows brighter near motion; light theme leans toward the
  // second colour instead, since white would vanish on a light page.
  col += (1.0 - uLight) * vec3(vGlow * 0.3);
  col = mix(col, uColB, uLight * clamp(vGlow * 0.5, 0.0, 1.0));

  outColor = vec4(col, a * uAlpha * vFade * uDim);
}
`;

/** Far dust: a static shell of tiny glints that never morphs. */
export const dustVertexShader = /* glsl */ `#version 300 es
precision highp float;

in vec3 aPos;
uniform mat4 uMV;
uniform mat4 uProj;
uniform float uSize;
uniform float uPx;

void main() {
  vec4 mv = uMV * vec4(aPos, 1.0);
  gl_Position = uProj * mv;
  gl_PointSize = uSize * uPx * (7.0 / -mv.z);
}
`;

export const dustFragmentShader = /* glsl */ `#version 300 es
precision highp float;

uniform vec3 uColor;
uniform float uAlpha;
out vec4 outColor;

void main() {
  float r = length(gl_PointCoord - 0.5) * 2.0;
  if (r > 1.0) discard;
  outColor = vec4(uColor, pow(1.0 - r, 1.6) * uAlpha);
}
`;
