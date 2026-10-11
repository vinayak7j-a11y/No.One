/**
 * GLSL for the living field. Every particle carries two target positions
 * (aFrom, aTo) and four random numbers (aRand). The vertex shader does the
 * whole morph on the GPU:
 *
 *  - each particle leaves on its own delay, so a form dissolves and
 *    reforms in waves instead of sliding as one block
 *  - while travelling it scatters and twists (the "travel" term)
 *  - at rest it shimmers (uJitter) and drifts on a slow flow field (uFlow)
 *  - the pointer pushes and swirls nearby particles
 *  - uBurst is a spring driven from JS (clicks, page changes, intro)
 */
export const fieldVertexShader = /* glsl */ `
attribute vec3 aFrom;
attribute vec3 aTo;
attribute vec4 aRand;

uniform float uT;
uniform float uTime;
uniform float uSize;
uniform float uPx;
uniform float uBurst;
uniform float uJitter;
uniform float uFlow;
uniform float uAgitate;
uniform vec3 uMouse;

varying float vMix;
varying float vGlow;
varying float vFade;

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

  vec4 mv = modelViewMatrix * vec4(p, 1.0);

  vec2 dm = mv.xy - uMouse.xy;
  float d = length(dm);
  float rep = smoothstep(1.05, 0.0, d);
  vec2 away = dm / (d + 0.0001);
  mv.xy += away * rep * rep * 0.5;
  mv.xy += vec2(-away.y, away.x) * rep * 0.18;

  gl_Position = projectionMatrix * mv;

  float depth = -mv.z;
  vFade = clamp(1.25 - (depth - 4.5) / 5.5, 0.25, 1.0);
  vGlow = travel * 0.8 + rep;
  vMix = aRand.y;
  gl_PointSize = uSize * uPx * (0.45 + aRand.w) * (1.0 + travel * 0.5 + rep * 0.9) * (7.0 / depth);
}
`;

export const fieldFragmentShader = /* glsl */ `
uniform vec3 uColA;
uniform vec3 uColB;
uniform float uAlpha;
uniform float uDim;
uniform float uLight;

varying float vMix;
varying float vGlow;
varying float vFade;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;

  float a = pow(1.0 - d * 2.0, 1.7);
  vec3 col = mix(uColA, uColB, vMix);
  // Dark theme glows brighter near motion; light theme leans toward the
  // second colour instead, since white would vanish on a light page.
  col += (1.0 - uLight) * vec3(vGlow * 0.3);
  col = mix(col, uColB, uLight * clamp(vGlow * 0.5, 0.0, 1.0));

  gl_FragColor = vec4(col, a * uAlpha * vFade * uDim);
  #include <colorspace_fragment>
}
`;
