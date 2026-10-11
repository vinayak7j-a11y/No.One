"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { useFieldClaim } from "@/hooks/useFieldClaim";
import type { FieldFormId, FieldSide } from "@/types/field";

interface FieldSectionProps {
  /** The shape the field takes while this section holds the middle of the screen. */
  form: FieldFormId;
  /** 1 puts the shape on the right, -1 on the left, 0 behind the copy. */
  side?: FieldSide;
  /** Field strength while this section is active. Lower keeps copy crisp. */
  dim?: number;
  className?: string;
  children: React.ReactNode;
}

/**
 * Wraps a page section and claims the living field while it is the one in
 * the middle of the screen. Scroll is how attention moves between sections;
 * the field follows it and returns to the page's resting form when the
 * section leaves. Layout is entirely up to the children.
 */
export default function FieldSection({
  form,
  side = 0,
  dim,
  className,
  children,
}: FieldSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  useFieldClaim(form, inView, 5, side, dim);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
