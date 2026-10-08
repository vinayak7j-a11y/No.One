/**
 * Where the home-page heading sits on the document, in CSS pixels. The
 * field reads this so the particle wordmark lands exactly over the real
 * heading (which stays in the DOM for screen readers, search engines and
 * the no-WebGL fallback) instead of at a guessed position.
 */
export interface FieldAnchorRect {
  /** Centre x, relative to the viewport's left edge. */
  cx: number;
  /** Centre y, relative to the top of the document (not the viewport). */
  cy: number;
  w: number;
  h: number;
}

let anchor: FieldAnchorRect | null = null;

export function setFieldAnchor(next: FieldAnchorRect | null) {
  anchor = next;
}

export function getFieldAnchor(): FieldAnchorRect | null {
  return anchor;
}
