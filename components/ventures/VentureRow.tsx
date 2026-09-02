"use client";

import { useId, useRef, useState } from "react";
import type { Venture } from "@/data/ventures";

interface VentureRowProps {
  venture: Venture;
  stagger: 0 | 1 | 2;
}

const STAGGER_CLASS: Record<0 | 1 | 2, string> = {
  0: "md:pl-0",
  1: "md:pl-10",
  2: "md:pl-5",
};

export default function VentureRow({ venture, stagger }: VentureRowProps) {
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
            {(venture.content.link || venture.content.github || venture.content.instagram) && (
              <div className="mt-3 flex gap-4">
                {venture.content.link && (
                  <a
                    href={venture.content.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs uppercase tracking-widest text-muted-foreground underline decoration-foreground/20 underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground/60"
                  >
                    Live
                  </a>
                )}
                {venture.content.github && (
                  <a
                    href={venture.content.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs uppercase tracking-widest text-muted-foreground underline decoration-foreground/20 underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground/60"
                  >
                    Code
                  </a>
                )}
                {venture.content.instagram && (
                  <a
                    href={venture.content.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs uppercase tracking-widest text-muted-foreground underline decoration-foreground/20 underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground/60"
                  >
                    Instagram
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-foreground/[0.06]" />
    </div>
  );
}
