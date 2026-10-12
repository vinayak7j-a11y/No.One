"use client";

import { useEffect, useId } from "react";
import { claimField, releaseField } from "@/lib/field/attention";
import type { FieldFormId, FieldSide } from "@/types/field";

/**
 * While `active` is true, ask the living field to take `form`. Releasing
 * (active goes false, or the component unmounts) hands the field back to
 * whatever claim ranks next, and finally to the page's resting form.
 *
 * Priorities in use: 0 route, 5 a section scrolled into view, 10 a
 * venture that has the visitor's attention.
 */
export function useFieldClaim(
  form: FieldFormId | undefined,
  active: boolean,
  priority = 5,
  side?: FieldSide,
  dim?: number,
) {
  const id = useId();

  useEffect(() => {
    if (!active || !form) return;
    claimField(id, form, priority, { side, dim });
    return () => releaseField(id);
  }, [id, active, form, priority, side, dim]);
}
