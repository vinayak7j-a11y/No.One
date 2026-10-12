"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useFieldEnabled } from "@/hooks/useFieldEnabled";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// The field engine is client-only. Loading it lazily keeps it out of the
// first paint, so text still arrives first.
const FieldCanvas = dynamic(() => import("@/components/field/FieldCanvas"), {
  ssr: false,
});

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2"));
  } catch {
    return false;
  }
}

/**
 * Decides whether the field runs at all, and when. It waits for the
 * browser to be idle, skips browsers without WebGL, and respects both the
 * visitor's own on/off choice and prefers-reduced-motion. If it does not
 * mount, the page is exactly the site as it was before the field existed.
 */
export default function FieldMount() {
  const enabled = useFieldEnabled();
  const reduced = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const [armed, setArmed] = useState(false);
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    if (!enabled || armed) return;
    if (!supportsWebGL()) return;

    function arm() {
      setCoarse(
        window.matchMedia("(pointer: coarse)").matches ||
          (navigator.hardwareConcurrency ?? 8) <= 4,
      );
      setArmed(true);
    }

    if (typeof window.requestIdleCallback === "function") {
      const handle = window.requestIdleCallback(arm, { timeout: 1200 });
      return () => window.cancelIdleCallback(handle);
    }
    const handle = window.setTimeout(arm, 400);
    return () => window.clearTimeout(handle);
  }, [enabled, armed]);

  if (!enabled || !armed) return null;

  return (
    <FieldCanvas
      theme={resolvedTheme === "light" ? "light" : "dark"}
      reduced={reduced}
      coarse={coarse}
    />
  );
}
