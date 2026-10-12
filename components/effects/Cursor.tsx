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
 * A thin ring that appears only around things you can press, trails the
 * pointer slightly, and tightens while pressed. Over plain space there is
 * nothing but the normal cursor. Mouse and trackpad only.
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
  const scale = useMotionValue(0);

  const sx = useSpring(x, { stiffness: 420, damping: 34, mass: 0.45 });
  const sy = useSpring(y, { stiffness: 420, damping: 34, mass: 0.45 });
  const ss = useSpring(scale, { stiffness: 300, damping: 26 });

  const enabled = fine && !reduced;

  useEffect(() => {
    if (!enabled) return;
    let over = false;

    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
    }
    function onOver(e: PointerEvent) {
      const target = e.target as Element | null;
      over = Boolean(target?.closest?.(INTERACTIVE));
      scale.set(over ? 1 : 0);
    }
    function onDown() {
      if (over) scale.set(0.75);
    }
    function onUp() {
      if (over) scale.set(1);
    }
    function onLeave() {
      over = false;
      scale.set(0);
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
  }, [enabled, x, y, scale]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[90] -ml-[22px] -mt-[22px] h-[44px] w-[44px] rounded-full border border-white mix-blend-difference"
      style={{ x: sx, y: sy, scale: ss }}
    />
  );
}
