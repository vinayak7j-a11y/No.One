"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const SIZE = 650;

/**
 * A soft light that follows the pointer.
 *
 * The gradient is painted once on a fixed disc and only moved with a
 * compositor transform, batched to one update per animation frame. The
 * old version rewrote CSS variables on every pointer event, which made
 * the browser repaint a full-screen gradient each time.
 */
export default function AmbientGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const el = ref.current;
    if (!el) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let frame = 0;

    const place = () => {
      frame = 0;
      el.style.transform = `translate3d(${x - SIZE / 2}px, ${y - SIZE / 2}px, 0)`;
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = requestAnimationFrame(place);
    };

    place();
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-0 rounded-full"
      style={{
        width: SIZE,
        height: SIZE,
        willChange: "transform",
        background:
          "radial-gradient(circle at center, rgba(242,242,240,0.08), transparent 70%)",
      }}
    />
  );
}
