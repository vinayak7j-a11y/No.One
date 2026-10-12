/**
 * Where the home-page heading sits on the document, in CSS pixels, and how
 * it is typeset. The field reads this so the particle wordmark lands on the
 * real heading (which stays in the DOM for screen readers, search engines
 * and the no-WebGL fallback) with the same font, spacing and baseline,
 * instead of at a guessed position.
 */
export interface FieldAnchorRect {
  /** Centre x, relative to the viewport's left edge. */
  cx: number;
  /** Centre y of the element box, relative to the top of the document. */
  cy: number;
  w: number;
  h: number;
  /** Px from the box centre down to the visual centre of the lettering. */
  dy: number;
  /** Typeset values read from the heading, so the sampler can match them. */
  font: { family: string; weight: number; letterSpacingEm: number };
}

let anchor: FieldAnchorRect | null = null;
const listeners = new Set<() => void>();

export function setFieldAnchor(next: FieldAnchorRect | null) {
  anchor = next;
  listeners.forEach((listener) => listener());
}

export function getFieldAnchor(): FieldAnchorRect | null {
  return anchor;
}

export function subscribeFieldAnchor(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Changes whenever the lettering would need to be sampled again. */
export function anchorFontKey(a: FieldAnchorRect | null) {
  return a
    ? `${a.font.family}|${a.font.weight}|${a.font.letterSpacingEm.toFixed(4)}`
    : "none";
}
