import { hashString, mulberry32 } from "@/lib/field/rng";

interface WordmarkOptions {
  text: string;
  count: number;
  fontFamily: string;
  weight: number;
  /** Tracking of the real heading, in em (negative tightens). */
  letterSpacingEm?: number;
  /** Width of the lettering in world units. */
  units: number;
}

const SAMPLE_SIZE = 260;

type SpacedContext = CanvasRenderingContext2D & { letterSpacing?: string };

function setup(ctx: SpacedContext, size: number, o: Pick<WordmarkOptions, "weight" | "fontFamily" | "letterSpacingEm">) {
  ctx.font = `${o.weight} ${size}px ${o.fontFamily}`;
  if ("letterSpacing" in ctx) {
    ctx.letterSpacing = `${(o.letterSpacingEm ?? 0) * size}px`;
  }
}

/**
 * Vertical distance, in px, from the centre of a line box to the visual
 * centre of the lettering. Both the anchor (DOM side) and the sampler use
 * the same canvas font metrics, so the particles sit on the real baseline.
 */
export function lettersCentreOffset(
  text: string,
  size: number,
  lineHeightPx: number,
  o: Pick<WordmarkOptions, "weight" | "fontFamily" | "letterSpacingEm">,
): number {
  const ctx = document.createElement("canvas").getContext("2d") as SpacedContext | null;
  if (!ctx) return 0;
  setup(ctx, size, o);
  const m = ctx.measureText(text);
  const fa = m.fontBoundingBoxAscent ?? size * 0.8;
  const fd = m.fontBoundingBoxDescent ?? size * 0.2;
  const baseline = (lineHeightPx - (fa + fd)) / 2 + fa;
  const glyphCentre = baseline - (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2;
  return glyphCentre - lineHeightPx / 2;
}

/**
 * Turns real, rendered text into particle positions: draw the text on an
 * offscreen canvas in the heading's own font and tracking, collect every
 * lit pixel, then pick `count` of them at random.
 *
 * Browser only (needs a canvas), so it is called from the field canvas,
 * never during server rendering.
 */
export function sampleWordmark(o: WordmarkOptions): Float32Array | null {
  const { text, count, units } = o;
  const fontSize = SAMPLE_SIZE;

  const probe = document.createElement("canvas").getContext("2d") as SpacedContext | null;
  if (!probe) return null;
  setup(probe, fontSize, o);
  const metrics = probe.measureText(text);
  const pad = 40;
  const width = Math.ceil(metrics.width) + pad * 2;
  const height = Math.ceil(fontSize * 1.5);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true }) as SpacedContext | null;
  if (!ctx) return null;
  setup(ctx, fontSize, o);
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#fff";
  const baseline = Math.round(height * 0.72);
  ctx.fillText(text, pad, baseline);

  const data = ctx.getImageData(0, 0, width, height).data;
  const lit: number[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 128) lit.push(x, y);
    }
  }
  if (lit.length === 0) return null;

  const ascent = metrics.actualBoundingBoxAscent;
  const descent = metrics.actualBoundingBoxDescent;
  const centreY = baseline - (ascent - descent) / 2;
  const centreX = pad + metrics.width / 2;
  const perPixel = units / metrics.width;

  const r = mulberry32(hashString(`wordmark:${text}`));
  const pixels = lit.length / 2;
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const p = Math.floor(r() * pixels);
    const px = lit[p * 2] + r() - 0.5;
    const py = lit[p * 2 + 1] + r() - 0.5;
    out[i * 3] = (px - centreX) * perPixel;
    out[i * 3 + 1] = -(py - centreY) * perPixel;
    out[i * 3 + 2] = (r() + r() - 1) * 0.04;
  }
  return out;
}
