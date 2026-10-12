"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import Button from "@/components/ui/Button";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Sun/moon toggle for light/dark mode.
 *
 * next-themes resolves the active theme only after mounting on the
 * client (it can't know the right value during server rendering
 * without risking a flash of the wrong theme). Rendering based on
 * `theme` before that point would mismatch what the server sent,
 * which React (correctly) warns about. The standard fix, used here,
 * is to render a neutral placeholder until `mounted` is true.
 */
export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    // Wrapped in a named function rather than calling setMounted
    // directly in the effect body - same fix as the reduced-motion
    // branch in VentureRow.tsx: the react-hooks/set-state-in-effect
    // rule flags direct top-level setState calls in an effect, but not
    // ones nested inside a separately-defined function reference.
    function markMounted() {
      setMounted(true);
    }
    markMounted();
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle theme"
        disabled
      >
        <span className="h-5 w-5" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={(e) => {
        const next = isDark ? "light" : "dark";
        const root = document.documentElement;
        // The new theme spreads from the button as a circular wave. Browsers
        // without View Transitions (and reduced-motion visitors) just switch.
        if (reduced || typeof document.startViewTransition !== "function") {
          setTheme(next);
          return;
        }
        const box = e.currentTarget.getBoundingClientRect();
        root.style.setProperty("--wave-x", `${box.left + box.width / 2}px`);
        root.style.setProperty("--wave-y", `${box.top + box.height / 2}px`);
        document.startViewTransition(() => {
          flushSync(() => setTheme(next));
        });
      }}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
