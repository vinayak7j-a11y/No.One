import { hashString, mulberry32 } from "@/lib/field/rng";

interface WordmarkOptions {
  text: string;
  count: number;
  fontFamily: string;
  weight: number;
  /** Width of the lettering in world units. */
  units: number;
}

/**
 * Turns real, rendered text into particle positions: draw the text on an
 * offscreen canvas in the site's own font, collect every lit pixel, then
 * pick `count` of them at random. Because it samples the same font the
 * heading uses, the particles line up with the heading's on-screen width.
 *
 * Browser only (needs a canvas), so it is called from the field canvas,
 * never during server rendering.
 */
export function sampleWordmark({
  text,
  count,
  fontFamily,
  weight,
  units,
}: WordmarkOptions): Float32Array | null {
  const fontSize = 260;
  const font = `${weight} ${fontSize}px ${fontFamily}`;

  const probe = document.createElement("canvas").getContext("2d");
  if (!probe) return null;
  probe.font = font;
  const metrics = probe.measureText(text);
  const pad = 40;
  const width = Math.ceil(metrics.width) + pad * 2;
  const height = Math.ceil(fontSize * 1.5);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.font = font;
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
