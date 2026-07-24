"use client";

import { useState } from "react";
import { useInView } from "@/hooks/useInView";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import { cn } from "@/lib/utils/cn";
import type { Venture, VentureStage } from "@/data/ventures";

const nodeStyles: Record<VentureStage, string> = {
  concept: "border-border",
  prototype: "border-dashed border-muted-foreground",
  active: "border-accent bg-accent",
};

interface VentureRowProps {
  venture: Venture;
}

/**
 * A single artifact in the Ventures thread. Implements No.One's
 * three-state attention model rather than exposing everything at once:
 *
 * - Rest: invisible and stage-neutral. Nothing about a venture —
 *   including its own existence on the page — is declared before intent
 *   arrives near it. This is the Law of Rest and Law of Non-Ranking made
 *   literal: an active venture and a concept-stage one look identical
 *   (absent) until attended to.
 * - Arrival (intent via scroll proximity): the artifact settles into
 *   place and its true identity — stage, status — becomes legible.
 * - Engagement (intent via hover, keyboard focus, or tap — deliberately
 *   device-agnostic): the artifact's content opens. Tap is handled via a
 *   `pinned` state so touch devices, which have no hover concept, get
 *   the same engagement behavior as pointer devices rather than a
 *   separate always-open fallback.
 *
 * `prefers-reduced-motion` is already handled globally (see globals.css,
 * P1-T07) — all transitions here collapse automatically for users who
 * have that preference set, without any extra logic in this component.
 * Rest-state dimming is opacity/transform only (never `display`/
 * `visibility`), so content stays in the accessibility tree at every
 * stage regardless of visual state.
 */
export default function VentureRow({ venture }: VentureRowProps) {
  const { ref, isInView } = useInView<HTMLDivElement>();
  const [pinned, setPinned] = useState(false);
  const descriptionId = `${venture.slug}-description`;

  return (
    <div
      ref={ref}
      className={cn(
        "group relative border-l-2 pb-14 pl-8 transition-[opacity,transform,border-color] duration-700 ease-out last:pb-0 md:pl-12",
        isInView
          ? "translate-y-0 border-border opacity-100 hover:border-accent focus-within:border-accent"
          : "translate-y-2 border-border/30 opacity-0",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute -left-2 top-1.5 h-4 w-4 rounded-full border-2 bg-background transition-colors duration-500",
          isInView ? nodeStyles[venture.identity.stage] : "border-border/30",
        )}
      />

      <button
        type="button"
        aria-expanded={pinned}
        aria-controls={descriptionId}
        onClick={() => setPinned((current) => !current)}
        className="flex w-full flex-col gap-2 text-left md:flex-row md:items-baseline md:justify-between md:gap-6"
      >
        <Heading
          as="h2"
          size="h3"
          className="transition-colors duration-300 group-hover:text-accent"
        >
          {venture.identity.name}
        </Heading>

        <Text
          as="span"
          size="caption"
          tone="subtle"
          className={cn(
            "shrink-0 font-mono tracking-wider transition-opacity duration-500",
            isInView ? "opacity-100" : "opacity-0",
          )}
        >
          {venture.identity.statusLabel}
        </Text>
      </button>

      <div
        id={descriptionId}
        className={cn(
          "grid transition-[grid-template-rows] duration-500 ease-out",
          pinned
            ? "grid-rows-[1fr]"
            : "grid-rows-[0fr] group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr]",
        )}
      >
        <div className="overflow-hidden">
          <Text size="lg" tone="muted" className="max-w-2xl pt-4">
            {venture.content.description}
          </Text>
        </div>
      </div>
    </div>
  );
}
