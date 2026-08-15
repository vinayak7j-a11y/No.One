"use client";

import { useId, useRef, useState } from "react";
import type { Venture } from "@/data/ventures";

interface VentureRowProps {
  venture: Venture;
  /**
   * Small deterministic offset (0–2) used to break the rigid list-row read.
   * Not a ranking signal — purely spatial, has no bearing on status or order.
   */
  stagger: 0 | 1 | 2;
}

const STAGGER_CLASS: Record<0 | 1 | 2, string> = {
  0: "md:pl-0",
  1: "md:pl-10",
  2: "md:pl-5",
};

export default function VentureRow({ venture, stagger }: VentureRowProps) {
  // Three independent sources of attention, kept separate on purpose.
  // Merging hover/focus into one flag caused a real bug: on touch, a tap
  // both focuses the button and sets `pinned`, and since focus doesn't
  // clear on a second tap of the same element, a merged flag stayed
  // stuck "active" even after `pinned` toggled off. Keeping them apart
  // means each device's interaction fully resets on its own terms.
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pinned, setPinned] = useState(false);

  const rowRef = useRef<HTMLDivElement>(null);
  const lastPointerTypeRef = useRef<string | null>(null);
  const detailsId = useId();

  const active = hovered || focused || pinned;

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const rect = rowRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    rowRef.current?.style.setProperty("--mx", `${x}%`);
    rowRef.current?.style.setProperty("--my", `${y}%`);
  }

  return (
    <div
      ref={rowRef}
      className={`group relative ${STAGGER_CLASS[stagger]}`}
      onPointerMove={handlePointerMove}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(false)}
    >
      {/* Pointer-attention glow — decorative only, never required for function */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%), rgba(242,242,240,0.06), transparent 70%)",
        }}
      />

      <button
        type="button"
        className="block w-full py-6 text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-foreground/40 rounded-sm"
        aria-expanded={active}
        aria-controls={detailsId}
        onPointerDown={(e) => {
          lastPointerTypeRef.current = e.pointerType;
        }}
        onClick={(e) => {
          setPinned((p) => !p);
          // Only touch taps risk the stuck-focus problem described above —
          // a keyboard-triggered click has no preceding pointerdown, so
          // this never fires for keyboard users and their focus ring is
          // left untouched.
          if (lastPointerTypeRef.current === "touch") {
            e.currentTarget.blur();
          }
          lastPointerTypeRef.current = null;
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        <span
          className={`block font-semibold tracking-tight transition-[color] duration-300 ${
            active ? "text-foreground" : "text-muted-foreground"
          }`}
          style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
        >
          {venture.identity.name}
        </span>
      </button>

      <div
        id={detailsId}
        className="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: active ? "1fr" : "0fr" }}
      >
        <div className="min-h-0">
          <div className="pb-6 pl-1 max-w-xl">
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {venture.identity.statusLabel}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground/90">
              {venture.content.description}
            </p>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-foreground/[0.06]" />
    </div>
  );
}
