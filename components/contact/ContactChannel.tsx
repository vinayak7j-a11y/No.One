"use client";

import { useId, useRef, useState } from "react";

export interface Channel {
  id: string;
  name: string;
  handle: string;
  blurb: string;
  href: string;
}

export default function ContactChannel({ channel }: { channel: Channel }) {
  // Same three-way attention split as VentureRow, and the same reasoning
  // behind keeping them separate (see components/ventures/VentureRow.tsx
  // for the touch stuck-state bug this avoids).
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
      className="group relative"
      onPointerMove={handlePointerMove}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(false)}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(280px circle at var(--mx, 50%) var(--my, 50%), rgba(242,242,240,0.05), transparent 70%)",
        }}
      />

      <a
        href={channel.href}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full py-5 focus:outline-none focus-visible:ring-1 focus-visible:ring-foreground/40 rounded-sm"
        aria-describedby={detailsId}
        onPointerDown={(e) => {
          lastPointerTypeRef.current = e.pointerType;
        }}
        onClick={() => {
          setPinned((p) => !p);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        <span
          className={`block font-semibold tracking-tight transition-[color] duration-300 ${
            active ? "text-foreground" : "text-muted-foreground"
          }`}
          style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)" }}
        >
          {channel.name}
        </span>
      </a>

      <div
        id={detailsId}
        className="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: active ? "1fr" : "0fr" }}
      >
        <div className="min-h-0">
          <div className="pb-5 max-w-md">
            <p className="mb-1 font-mono text-xs text-muted-foreground">{channel.handle}</p>
            <p className="text-sm leading-relaxed text-muted-foreground/90">{channel.blurb}</p>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-foreground/[0.06]" />
    </div>
  );
}
