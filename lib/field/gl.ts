/**
 * The small amount of WebGL plumbing the field needs, so it can run with no
 * graphics library at all. Matrices are column-major Float32Arrays, the
 * layout WebGL expects.
 */

export function perspective(
  out: Float32Array,
  fovYRad: number,
  aspect: number,
  near: number,
  far: number,
) {
  const f = 1 / Math.tan(fovYRad / 2);
  const nf = 1 / (near - far);
  out.fill(0);
  out[0] = f / aspect;
  out[5] = f;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[14] = 2 * far * near * nf;
}

/**
 * Translate * RotateXYZ * UniformScale, with Euler angles applied in the
 * conventional X-then-Y-then-Z order (matches how the layout maths thinks
 * about tilt, spin and roll).
 */
export function modelView(
  out: Float32Array,
  px: number,
  py: number,
  pz: number,
  rx: number,
  ry: number,
  rz: number,
  s: number,
) {
  const a = Math.cos(rx);
  const b = Math.sin(rx);
  const c = Math.cos(ry);
  const d = Math.sin(ry);
  const e = Math.cos(rz);
  const f = Math.sin(rz);
  const ae = a * e;
  const af = a * f;
  const be = b * e;
  const bf = b * f;

  out[0] = c * e * s;
  out[1] = (af + be * d) * s;
  out[2] = (bf - ae * d) * s;
  out[3] = 0;
  out[4] = -c * f * s;
  out[5] = (ae - bf * d) * s;
  out[6] = (be + af * d) * s;
  out[7] = 0;
  out[8] = d * s;
  out[9] = -b * c * s;
  out[10] = a * c * s;
  out[11] = 0;
  out[12] = px;
  out[13] = py;
  out[14] = pz;
  out[15] = 1;
}

export type Rgb = [number, number, number];

/** "#rgb" / "#rrggbb" to 0..1 channels. Anything else falls back to black. */
export function parseHex(input: string): Rgb {
  const hex = input.trim().replace("#", "");
  const full =
    hex.length === 3
      ? hex
          .split("")
          .map((c) => c + c)
          .join("")
      : hex;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return [0, 0, 0];
  return [
    parseInt(full.slice(0, 2), 16) / 255,
    parseInt(full.slice(2, 4), 16) / 255,
    parseInt(full.slice(4, 6), 16) / 255,
  ];
}

export function lerpRgb(a: Rgb, b: Rgb, t: number) {
  a[0] += (b[0] - a[0]) * t;
  a[1] += (b[1] - a[1]) * t;
  a[2] += (b[2] - a[2]) * t;
}

export function compile(
  gl: WebGL2RenderingContext,
  vertex: string,
  fragment: string,
): WebGLProgram {
  const build = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) throw new Error("Could not create shader");
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(`Shader compile failed: ${log}`);
    }
    return shader;
  };
  const program = gl.createProgram();
  if (!program) throw new Error("Could not create program");
  const vs = build(gl.VERTEX_SHADER, vertex);
  const fs = build(gl.FRAGMENT_SHADER, fragment);
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Program link failed: ${log}`);
  }
  return program;
}

/** Looks uniform locations up once and remembers them. */
export function uniformMap(gl: WebGL2RenderingContext, program: WebGLProgram) {
  const cache = new Map<string, WebGLUniformLocation | null>();
  return (name: string) => {
    if (!cache.has(name)) cache.set(name, gl.getUniformLocation(program, name));
    return cache.get(name) ?? null;
  };
}
