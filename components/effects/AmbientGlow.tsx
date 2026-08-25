"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function AmbientGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    function handlePointerMove(e: PointerEvent) {
      ref.current?.style.setProperty("--glow-x", `${e.clientX}px`);
      ref.current?.style.setProperty("--glow-y", `${e.clientY}px`);
    }

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background:
          "radial-gradient(650px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(242,242,240,0.08), transparent 70%)",
      }}
    />
  );
}
