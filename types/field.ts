/**
 * Every shape the living field can take. `rest` is the idle cloud (Law of
 * Rest), `wordmark` is the home-page lettering sampled from the real
 * font, and the rest are either page forms or the form owned by one
 * venture (see `identity.form` in data/ventures.ts).
 */
export type FieldFormId =
  | "rest"
  | "wordmark"
  | "seed"
  | "galaxy"
  | "sheets"
  | "bridge"
  | "signal"
  | "link"
  | "loop"
  | "knot"
  | "grid"
  | "orbit";

/**
 * Horizontal placement of a form relative to the page copy.
 * 1 = right, -1 = left, 0 = centred behind the copy.
 */
export type FieldSide = -1 | 0 | 1;

export interface FieldClaimOptions {
  side?: FieldSide;
  /** Field strength while this claim is winning. Lower keeps copy legible. */
  dim?: number;
}
