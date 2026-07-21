"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const mediaQueryList = window.matchMedia(QUERY);
  mediaQueryList.addEventListener("change", callback);
  return () => mediaQueryList.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

/**
 * Tracks the user's OS-level `prefers-reduced-motion` setting.
 *
 * The CSS in globals.css already shortens all transitions/animations
 * to near-zero for reduced-motion users, which is enough for CSS-driven
 * effects. Framer Motion animations are JS-driven and won't respect
 * that media query on their own — components using `motion.*` should
 * read this hook and swap `animate`/`transition` props (e.g. skip a
 * slide-in, jump straight to the end state) rather than just relying
 * on the CSS fallback.
 *
 * Uses useSyncExternalStore (not useState + useEffect) since this is
 * exactly what it's for: subscribing to a browser API that can change
 * outside of React, without a synchronous setState-in-effect or an
 * SSR/client hydration mismatch.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
