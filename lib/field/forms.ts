import type { FieldFormId } from "@/types/field";
import { hashString, mulberry32, type Rng } from "@/lib/field/rng";

const TAU = Math.PI * 2;

/** Roughly bell-shaped value in [-1.5, 1.5]. */
const gauss = (r: Rng) => r() + r() + r() - 1.5;

type Generator = (n: number, r: Rng) => Float32Array;

function fibonacciSphere(
  out: Float32Array,
  start: number,
  count: number,
  radius: number,
  r: Rng,
) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (2 * (i + 0.5)) / count;
    const ring = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const rad = radius + (r() - 0.5) * 0.06;
    const o = (start + i) * 3;
    out[o] = Math.cos(theta) * ring * rad;
    out[o + 1] = y * rad;
    out[o + 2] = Math.sin(theta) * ring * rad;
  }
}

const rest: Generator = (n, r) => {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const theta = r() * TAU;
    const phi = Math.acos(2 * r() - 1);
    const halo = r() < 0.18;
    const rad = halo ? 3.6 + r() * 1.8 : 1.6 + Math.pow(r(), 0.7) * 2.0;
    out[i * 3] = rad * Math.sin(phi) * Math.cos(theta) * 1.15;
    out[i * 3 + 1] = rad * Math.cos(phi) * 0.8;
    out[i * 3 + 2] = rad * Math.sin(phi) * Math.sin(theta);
  }
  return out;
};

const seed: Generator = (n, r) => {
  const out = new Float32Array(n * 3);
  fibonacciSphere(out, 0, n, 2.1, r);
  return out;
};

const galaxy: Generator = (n, r) => {
  const out = new Float32Array(n * 3);
  const arms = 3;
  for (let i = 0; i < n; i++) {
    let x: number;
    let y: number;
    let z: number;
    if (r() < 0.12) {
      const rad = Math.pow(r(), 1.6) * 0.9;
      const theta = r() * TAU;
      const phi = Math.acos(2 * r() - 1);
      x = rad * Math.sin(phi) * Math.cos(theta);
      y = rad * Math.cos(phi) * 0.6;
      z = rad * Math.sin(phi) * Math.sin(theta);
    } else {
      const rad = Math.pow(r(), 0.65) * 3.6;
      const angle = ((i % arms) / arms) * TAU + rad * 1.15;
      const spread = 0.55 * (0.4 + rad * 0.3);
      x = Math.cos(angle) * rad + (r() < 0.5 ? -1 : 1) * Math.pow(r(), 3) * spread;
      y = (r() < 0.5 ? -1 : 1) * Math.pow(r(), 3) * spread * 0.5;
      z = Math.sin(angle) * rad + (r() < 0.5 ? -1 : 1) * Math.pow(r(), 3) * spread;
    }
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
};

/** Five stacked pages, with a share of the points snapped to rows so the
 *  sheets read as lines of writing. */
const sheets: Generator = (n, r) => {
  const out = new Float32Array(n * 3);
  const w = 5.6;
  const d = 3.6;
  const rows = 14;
  for (let i = 0; i < n; i++) {
    const sheet = i % 5;
    const y = (sheet - 2) * 0.55;
    const turn = (sheet - 2) * 0.06;
    let x: number;
    let z: number;
    if (r() < 0.3) {
      // border
      const side = r();
      if (side < 0.5) {
        x = (r() - 0.5) * w;
        z = (side < 0.25 ? -0.5 : 0.5) * d;
      } else {
        x = (side < 0.75 ? -0.5 : 0.5) * w;
        z = (r() - 0.5) * d;
      }
    } else if (r() < 0.7) {
      x = (r() - 0.5) * w * 0.86;
      z = (Math.floor(r() * rows) / (rows - 1) - 0.5) * d * 0.8 + gauss(r) * 0.01;
    } else {
      x = (r() - 0.5) * w;
      z = (r() - 0.5) * d;
    }
    const c = Math.cos(turn);
    const s = Math.sin(turn);
    out[i * 3] = x * c - z * s;
    out[i * 3 + 1] = y + gauss(r) * 0.012;
    out[i * 3 + 2] = x * s + z * c;
  }
  return out;
};

/** Two spheres joined by an arc of light. */
const bridge: Generator = (n, r) => {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const roll = r();
    let x: number;
    let y: number;
    let z: number;
    if (roll < 0.62) {
      const theta = r() * TAU;
      const phi = Math.acos(2 * r() - 1);
      const rad = 0.95 * (0.55 + 0.45 * r());
      const cx = roll < 0.31 ? -1.9 : 1.9;
      x = cx + rad * Math.sin(phi) * Math.cos(theta);
      y = rad * Math.cos(phi);
      z = rad * Math.sin(phi) * Math.sin(theta);
    } else {
      const t = r();
      const u = 1 - t;
      const wob = 0.05 + 0.12 * Math.sin(Math.PI * t);
      x = u * u * -1.9 + 2 * u * t * 0 + t * t * 1.9 + gauss(r) * wob;
      y = 2 * u * t * 1.7 + gauss(r) * wob;
      z = 2 * u * t * 0.7 + gauss(r) * wob;
    }
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
};

/**
 * Broadcast: arcs spreading outward from a bright source, like a signal
 * leaving a point. Used for Contact ("reach out").
 */
const signal: Generator = (n, r) => {
  const out = new Float32Array(n * 3);
  const rings = [0.5, 0.95, 1.4, 1.85, 2.3];
  for (let i = 0; i < n; i++) {
    let x: number;
    let y: number;
    let z: number;
    const roll = r();
    if (roll < 0.1) {
      // The source: a dense little cluster.
      x = -2.1 + gauss(r) * 0.16;
      y = gauss(r) * 0.16;
      z = gauss(r) * 0.16;
    } else {
      // Pick a ring (outer rings carry more points) and a point on its arc,
      // opening toward +x.
      const k = Math.min(rings.length - 1, Math.floor(Math.pow(r(), 0.8) * rings.length));
      const rad = rings[k] + gauss(r) * 0.025;
      const a = (r() * 2 - 1) * 0.95;
      x = -2.1 + rad * Math.cos(a);
      y = rad * Math.sin(a);
      z = gauss(r) * 0.06 + Math.sin(a * 3 + k) * 0.12;
    }
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
};

/** Two tori that pass through each other (a Hopf link). */
const link: Generator = (n, r) => {
  const out = new Float32Array(n * 3);
  const major = 1.5;
  const minor = 0.22;
  for (let i = 0; i < n; i++) {
    const u = r() * TAU;
    const v = r() * TAU;
    const ring = major + minor * Math.cos(v);
    if (i % 2 === 0) {
      out[i * 3] = -0.9 + ring * Math.cos(u);
      out[i * 3 + 1] = ring * Math.sin(u);
      out[i * 3 + 2] = minor * Math.sin(v);
    } else {
      out[i * 3] = 0.9 + ring * Math.cos(u);
      out[i * 3 + 1] = minor * Math.sin(v);
      out[i * 3 + 2] = ring * Math.sin(u);
    }
  }
  return out;
};

/** A Mobius strip: one surface, one edge, no end. */
const loop: Generator = (n, r) => {
  const out = new Float32Array(n * 3);
  const radius = 1.9;
  const half = 0.75;
  for (let i = 0; i < n; i++) {
    const u = r() * TAU;
    const edge = r() < 0.35;
    const v = edge ? (r() < 0.5 ? -half : half) : (r() * 2 - 1) * half;
    const ring = radius + v * Math.cos(u / 2);
    out[i * 3] = ring * Math.cos(u) + gauss(r) * 0.02;
    out[i * 3 + 1] = ring * Math.sin(u) + gauss(r) * 0.02;
    out[i * 3 + 2] = v * Math.sin(u / 2) + gauss(r) * 0.02;
  }
  return out;
};

function trefoil(t: number, out: number[]) {
  out[0] = (Math.sin(t) + 2 * Math.sin(2 * t)) * 0.72;
  out[1] = (Math.cos(t) - 2 * Math.cos(2 * t)) * 0.72;
  out[2] = -Math.sin(3 * t) * 0.86;
}

/** A trefoil knot drawn as a tube. */
const knot: Generator = (n, r) => {
  const out = new Float32Array(n * 3);
  const p = [0, 0, 0];
  const q = [0, 0, 0];
  for (let i = 0; i < n; i++) {
    const t = r() * TAU;
    const u = r() * TAU;
    const tube = 0.3 + r() * 0.05;
    trefoil(t, p);
    trefoil(t + 0.001, q);
    let tx = q[0] - p[0];
    let ty = q[1] - p[1];
    let tz = q[2] - p[2];
    const tl = Math.hypot(tx, ty, tz);
    tx /= tl;
    ty /= tl;
    tz /= tl;
    let rx = 0;
    let rz = 1;
    if (Math.abs(tz) > 0.9) {
      rx = 1;
      rz = 0;
    }
    let nx = ty * rz - tz * 0;
    let ny = tz * rx - tx * rz;
    let nz = tx * 0 - ty * rx;
    const nl = Math.hypot(nx, ny, nz);
    nx /= nl;
    ny /= nl;
    nz /= nl;
    const bx = ty * nz - tz * ny;
    const by = tz * nx - tx * nz;
    const bz = tx * ny - ty * nx;
    const c = Math.cos(u) * tube;
    const s = Math.sin(u) * tube;
    out[i * 3] = p[0] + nx * c + bx * s;
    out[i * 3 + 1] = p[1] + ny * c + by * s;
    out[i * 3 + 2] = p[2] + nz * c + bz * s;
  }
  return out;
};

/** A 25 x 25 module grid with three finder squares, like a scan code. */
const grid: Generator = (n, r) => {
  const out = new Float32Array(n * 3);
  const size = 25;
  const cell = 0.22;
  const finderAt = (x: number, y: number, ox: number, oy: number) => {
    const dx = x - ox;
    const dy = y - oy;
    if (dx < 0 || dy < 0 || dx > 6 || dy > 6) return null;
    const ring = Math.max(Math.abs(dx - 3), Math.abs(dy - 3));
    return ring === 3 || ring <= 1;
  };
  const reserved = (x: number, y: number) =>
    (x < 8 && y < 8) || (x > size - 9 && y < 8) || (x < 8 && y > size - 9);

  const filled: number[] = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const f =
        finderAt(x, y, 0, 0) ??
        finderAt(x, y, size - 7, 0) ??
        finderAt(x, y, 0, size - 7);
      const on = f !== null ? f : reserved(x, y) ? false : r() < 0.48;
      if (on) filled.push(x, y);
    }
  }
  const modules = filled.length / 2;
  for (let i = 0; i < n; i++) {
    const m = Math.floor(r() * modules);
    const mx = filled[m * 2];
    const my = filled[m * 2 + 1];
    out[i * 3] = (mx - (size - 1) / 2 + (r() - 0.5) * 0.78) * cell;
    out[i * 3 + 1] = -(my - (size - 1) / 2 + (r() - 0.5) * 0.78) * cell;
    out[i * 3 + 2] = gauss(r) * 0.03;
  }
  return out;
};

/** A dense core with three tilted rings, like a gyroscope. */
const orbit: Generator = (n, r) => {
  const out = new Float32Array(n * 3);
  const core = Math.floor(n * 0.34);
  fibonacciSphere(out, 0, core, 1.25, r);
  const radii = [2.3, 2.7, 3.1];
  const tiltX = [0, 1.05, -0.85];
  const tiltZ = [0, 0.35, -0.5];
  for (let i = core; i < n; i++) {
    const k = i % 3;
    const theta = r() * TAU;
    const x = Math.cos(theta) * radii[k];
    const y = gauss(r) * 0.06;
    const z = Math.sin(theta) * radii[k];
    const cx = Math.cos(tiltX[k]);
    const sx = Math.sin(tiltX[k]);
    const y1 = y * cx - z * sx;
    const z1 = y * sx + z * cx;
    const cz = Math.cos(tiltZ[k]);
    const sz = Math.sin(tiltZ[k]);
    out[i * 3] = x * cz - y1 * sz;
    out[i * 3 + 1] = x * sz + y1 * cz;
    out[i * 3 + 2] = z1;
  }
  return out;
};

const GENERATORS: Record<Exclude<FieldFormId, "wordmark">, Generator> = {
  rest,
  seed,
  galaxy,
  sheets,
  bridge,
  signal,
  link,
  loop,
  knot,
  grid,
  orbit,
};

/**
 * Builds the particle positions for a form. Returns null for `wordmark`,
 * which needs the browser (canvas + the loaded font) and is sampled in
 * lib/field/wordmark.ts instead.
 */
export function buildForm(id: FieldFormId, count: number): Float32Array | null {
  if (id === "wordmark") return null;
  return GENERATORS[id](count, mulberry32(hashString(id)));
}
