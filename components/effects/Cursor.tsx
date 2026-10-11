"use client";

import { useEffect, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const FINE_POINTER = "(hover: hover) and (pointer: fine)";
const INTERACTIVE = "a, button, [role='button'], input, textarea, select, summary";

function subscribe(callback: () => void) {
  const query = window.matchMedia(FINE_POINTER);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

/**
 * A soft ring that trails the real cursor. The native cursor stays (so
 * nothing is hidden from anyone); the ring grows over anything
 * interactive and tightens while pressed. Mouse and trackpad only.
 */
export default function Cursor() {
  const reduced = useReducedMotion();
  const fine = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(FINE_POINTER).matches,
    () => false,
  );

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const scale = useMotionValue(1);
  const opacity = useMotionValue(0);

  const sx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 380, damping: 32, mass: 0.5 });
  const ss = useSpring(scale, { stiffness: 320, damping: 24 });

  const enabled = fine && !reduced;

  useEffect(() => {
    if (!enabled) return;
    let over = false;

    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      opacity.set(1);
    }
    function onOver(e: PointerEvent) {
      const target = e.target as Element | null;
      over = Boolean(target?.closest?.(INTERACTIVE));
      scale.set(over ? 1.9 : 1);
    }
    function onDown() {
      scale.set(over ? 1.4 : 0.7);
    }
    function onUp() {
      scale.set(over ? 1.9 : 1);
    }
    function onLeave() {
      opacity.set(0);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, x, y, scale, opacity]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[90] -ml-[17px] -mt-[17px] h-[34px] w-[34px] rounded-full border border-white mix-blend-difference"
      style={{ x: sx, y: sy, scale: ss, opacity }}
    />
  );
}
