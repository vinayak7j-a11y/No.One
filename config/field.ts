import type { FieldFormId, FieldSide } from "@/types/field";

/** Camera used by the field canvas. Layout maths in lib/field/engine.ts
 *  derives the visible world size from these two numbers. */
export const FIELD_CAMERA_Z = 7;
export const FIELD_FOV = 45;

/** Width, in world units, of the sampled "No.One" wordmark. The engine
 *  scales it to match the real heading's on-screen width. */
export const WORDMARK_UNITS = 6;

type Palette = readonly [string, string];

export interface FieldFormConfig {
  /** Human name, used for debugging and future captions. */
  label: string;
  /** Two-colour gradient per theme. Dark uses additive blending, so
   *  these are light; light theme uses normal blending, so they are dark. */
  dark: Palette;
  light: Palette;
  /** Default placement next to page copy (a claim can override it). */
  side: FieldSide;
  /** Upper bound on the fitted scale. */
  scale: number;
  /** Half extents (x, y) in world units, used to fit the form on screen. */
  extent: readonly [number, number];
  /** Resting tilt in radians. */
  tilt: { x: number; z: number };
  /** Auto-rotation speed (radians per second). */
  spin: number;
  /** Idle shimmer. Low values keep lettering legible. */
  jitter: number;
  /** Strength of the slow flow field that keeps the cloud alive. */
  flow: number;
  /** Particle size multiplier. */
  size: number;
  /** How much pointer and scroll parallax tilts the form (0 to 1). */
  parallax: number;
}

/**
 * The field's palette is information: each venture owns a hue so the
 * colour on screen tells you which one has your attention. Pages
 * themselves stay in the site's white-and-accent language.
 */
export const FIELD_FORMS: Record<FieldFormId, FieldFormConfig> = {
  rest: {
    label: "Rest",
    dark: ["#d4d4d8", "#3b82f6"],
    light: ["#3f3f46", "#2563eb"],
    side: 0,
    scale: 1,
    extent: [2.8, 2.4],
    tilt: { x: 0, z: 0 },
    spin: 0.035,
    jitter: 1,
    flow: 1,
    size: 1,
    parallax: 1,
  },
  wordmark: {
    label: "No.One",
    dark: ["#ffffff", "#a8c7ff"],
    light: ["#09090b", "#1d4ed8"],
    side: 0,
    scale: 4,
    extent: [3, 1],
    tilt: { x: 0, z: 0 },
    spin: 0,
    jitter: 0.12,
    flow: 0.04,
    size: 0.85,
    parallax: 0.12,
  },
  seed: {
    label: "Seed",
    dark: ["#f4f4f5", "#3b82f6"],
    light: ["#18181b", "#2563eb"],
    side: 1,
    scale: 1.05,
    extent: [2.2, 2.2],
    tilt: { x: 0, z: 0 },
    spin: 0.1,
    jitter: 1,
    flow: 0.25,
    size: 1,
    parallax: 1,
  },
  galaxy: {
    label: "Drift",
    dark: ["#fde7b0", "#7aa2ff"],
    light: ["#a16207", "#1d4ed8"],
    side: 1,
    scale: 1.05,
    extent: [3.7, 2.4],
    tilt: { x: 1.0, z: 0.12 },
    spin: 0.07,
    jitter: 1,
    flow: 0.15,
    size: 0.95,
    parallax: 1,
  },
  sheets: {
    label: "Sheets",
    dark: ["#e4e4e7", "#60a5fa"],
    light: ["#27272a", "#2563eb"],
    side: 1,
    scale: 1.05,
    extent: [3.1, 2.6],
    tilt: { x: 0.85, z: -0.1 },
    spin: 0.04,
    jitter: 0.8,
    flow: 0.1,
    size: 1,
    parallax: 1,
  },
  bridge: {
    label: "Bridge",
    dark: ["#fde68a", "#f472b6"],
    light: ["#b45309", "#be185d"],
    side: 1,
    scale: 1.05,
    extent: [3.2, 1.8],
    tilt: { x: 0.2, z: 0 },
    spin: 0.06,
    jitter: 1,
    flow: 0.15,
    size: 1,
    parallax: 1,
  },
  link: {
    label: "Rent It",
    dark: ["#ffb86b", "#ff6b8b"],
    light: ["#c2410c", "#be123c"],
    side: 1,
    scale: 1.05,
    extent: [2.7, 1.9],
    tilt: { x: 0.25, z: 0.15 },
    spin: 0.13,
    jitter: 0.9,
    flow: 0.1,
    size: 1,
    parallax: 1,
  },
  loop: {
    label: "Keepl",
    dark: ["#6ee7b7", "#38bdf8"],
    light: ["#047857", "#0369a1"],
    side: 1,
    scale: 1.05,
    extent: [2.7, 2.7],
    tilt: { x: 0.9, z: 0 },
    spin: 0.12,
    jitter: 0.9,
    flow: 0.1,
    size: 1,
    parallax: 1,
  },
  knot: {
    label: "Bond",
    dark: ["#a5b4fc", "#e879f9"],
    light: ["#4338ca", "#a21caf"],
    side: 1,
    scale: 1.05,
    extent: [2.4, 2.4],
    tilt: { x: 0.15, z: 0 },
    spin: 0.12,
    jitter: 0.9,
    flow: 0.1,
    size: 1,
    parallax: 1,
  },
  grid: {
    label: "MessPass",
    dark: ["#f4f4f5", "#22d3ee"],
    light: ["#18181b", "#0e7490"],
    side: 1,
    scale: 1.05,
    extent: [2.9, 2.9],
    tilt: { x: -0.1, z: 0 },
    spin: 0,
    jitter: 0.5,
    flow: 0.05,
    size: 0.95,
    parallax: 0.6,
  },
  orbit: {
    label: "No.One",
    dark: ["#ffffff", "#3b82f6"],
    light: ["#09090b", "#2563eb"],
    side: 1,
    scale: 1.05,
    extent: [3.1, 3.1],
    tilt: { x: 0.4, z: 0.2 },
    spin: 0.1,
    jitter: 0.9,
    flow: 0.1,
    size: 1,
    parallax: 1,
  },
};

/** The form each route rests in. Anything not listed rests as `rest`. */
export const ROUTE_FORMS: Record<string, FieldFormId> = {
  "/": "wordmark",
  "/about": "galaxy",
  "/projects": "rest",
  "/notes": "sheets",
  "/connect": "bridge",
  "/contact": "bridge",
};

export function formForPath(pathname: string): FieldFormId {
  if (ROUTE_FORMS[pathname]) return ROUTE_FORMS[pathname];
  if (pathname.startsWith("/notes")) return "sheets";
  return "rest";
}
