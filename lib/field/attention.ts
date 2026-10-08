import type {
  FieldClaimOptions,
  FieldFormId,
  FieldSide,
} from "@/types/field";

/**
 * Who is asking the field to take a shape. The route claims at priority 0
 * (the page's resting form), a scrolled-into-view section claims at 5, and
 * a venture that has the visitor's attention claims at 10. The field shows
 * whichever claim ranks highest, and falls back as claims are released:
 * Law of Attention in, Law of Return out.
 */
interface Claim {
  form: FieldFormId;
  priority: number;
  side: FieldSide | null;
}

export interface FieldSnapshot {
  form: FieldFormId;
  side: FieldSide | null;
  priority: number;
  pulseSeq: number;
  pulseStrength: number;
}

const claims = new Map<string, Claim>();
const listeners = new Set<() => void>();

let snapshot: FieldSnapshot = {
  form: "rest",
  side: null,
  priority: 0,
  pulseSeq: 0,
  pulseStrength: 0,
};

function emit() {
  listeners.forEach((listener) => listener());
}

function recompute() {
  let best: Claim | null = null;
  for (const claim of claims.values()) {
    // `>=` so that, on a tie, the claim made most recently wins.
    if (!best || claim.priority >= best.priority) best = claim;
  }
  const form = best?.form ?? "rest";
  const side = best?.side ?? null;
  const priority = best?.priority ?? 0;
  if (
    form !== snapshot.form ||
    side !== snapshot.side ||
    priority !== snapshot.priority
  ) {
    snapshot = { ...snapshot, form, side, priority };
    emit();
  }
}

export function claimField(
  id: string,
  form: FieldFormId,
  priority: number,
  options?: FieldClaimOptions,
) {
  // Delete first so a re-claim moves to the end of the map and wins ties.
  claims.delete(id);
  claims.set(id, { form, priority, side: options?.side ?? null });
  recompute();
}

export function releaseField(id: string) {
  if (claims.delete(id)) recompute();
}

/** A one-off shockwave through the field (clicks, page changes). */
export function pulseField(strength = 1) {
  snapshot = {
    ...snapshot,
    pulseSeq: snapshot.pulseSeq + 1,
    pulseStrength: strength,
  };
  emit();
}

export function subscribeField(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getFieldSnapshot(): FieldSnapshot {
  return snapshot;
}
