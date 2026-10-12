/**
 * Lets a piece of the page drive how gathered the field is, frame by frame.
 * The statement section sets it from scroll progress, so the cloud builds
 * its shape as you read; null hands control back to the field's own logic.
 */
let manual: number | null = null;

export function setFieldAssemble(value: number | null) {
  manual = value === null ? null : Math.min(1, Math.max(0, value));
}

export function getFieldAssemble(): number | null {
  return manual;
}
