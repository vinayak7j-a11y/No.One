"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const KEYS: Record<string, { href: string; label: string }> = {
  h: { href: "/", label: "Home" },
  a: { href: "/about", label: "About" },
  p: { href: "/projects", label: "Projects" },
  n: { href: "/notes", label: "Notes" },
  c: { href: "/connect", label: "Connect" },
  m: { href: "/contact", label: "Contact" },
};

const ARM_MS = 1400;

/**
 * Keyboard travel: press g, then a letter, to go somewhere. A small panel
 * lists the letters while g is armed. Ignored while typing in a field, and
 * with any modifier held, so it never fights the browser or the palette.
 */
export default function KeyNav() {
  const router = useRouter();
  const [armed, setArmed] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const disarm = () => {
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = null;
      setArmed(false);
    };
    let isArmed = false;

    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.tagName === "SELECT" ||
          t.isContentEditable)
      ) {
        return;
      }
      const key = e.key.toLowerCase();
      if (!isArmed) {
        if (key === "g") {
          isArmed = true;
          setArmed(true);
          timer.current = window.setTimeout(() => {
            isArmed = false;
            disarm();
          }, ARM_MS);
        }
        return;
      }
      const dest = KEYS[key];
      isArmed = false;
      disarm();
      if (dest) {
        e.preventDefault();
        router.push(dest.href);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [router]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full border border-border bg-background/80 px-5 py-3 text-caption text-muted-foreground backdrop-blur transition-all duration-300 ${
        armed ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
    >
      {armed && (
        <span className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          {Object.entries(KEYS).map(([k, v]) => (
            <span key={k}>
              <kbd className="font-mono text-foreground">{k}</kbd> {v.label}
            </span>
          ))}
        </span>
      )}
    </div>
  );
}
