"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import Section from "@/components/layout/Section";
import { useFieldClaim } from "@/hooks/useFieldClaim";
import { cn } from "@/lib/utils/cn";
import type { FieldFormId, FieldSide } from "@/types/field";

type TextSide = "left" | "right" | "center";

/** Copy on the left means the form sits on the right, and vice versa. */
const FIELD_SIDE: Record<TextSide, FieldSide> = {
  left: 1,
  right: -1,
  center: 0,
};

interface FieldSectionProps {
  /** The shape the field takes while this section is on screen. */
  form: FieldFormId;
  textSide?: TextSide;
  className?: string;
  children: React.ReactNode;
}

/**
 * A full-height page section that claims the living field while it holds
 * the middle of the screen. Scroll is how the visitor moves attention
 * between sections; the field follows it (Law of Attention) and returns
 * to the page's resting form when the section leaves (Law of Return).
 */
export default function FieldSection({
  form,
  textSide = "left",
  className,
  children,
}: FieldSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-50% 0px -50% 0px" });

  useFieldClaim(form, inView, 5, FIELD_SIDE[textSide]);

  return (
    <div ref={ref}>
      <Section
        spacing="lg"
        className={cn("flex min-h-screen items-center", className)}
      >
        <div
          className={cn(
            "w-full max-w-xl",
            textSide === "right" && "md:ml-auto",
            textSide === "center" && "mx-auto max-w-3xl text-center",
          )}
        >
          {children}
        </div>
      </Section>
    </div>
  );
}
