"use client";

import { useEffect, useRef } from "react";
import { setFieldAnchor } from "@/lib/field/anchor";
import { cn } from "@/lib/utils/cn";

interface FieldAnchorProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wraps the home heading's text. It tells the field where that text sits
 * so the particle wordmark lands exactly over it. The text itself stays in
 * the DOM (screen readers, search engines, no-WebGL fallback) and is only
 * made visually transparent while the field is showing the wordmark,
 * see `.field-anchor` in app/globals.css.
 */
export default function FieldAnchor({ children, className }: FieldAnchorProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    function measure() {
      if (!element) return;
      const rect = element.getBoundingClientRect();
      setFieldAnchor({
        cx: rect.left + rect.width / 2,
        cy: rect.top + window.scrollY + rect.height / 2,
        w: rect.width,
        h: rect.height,
      });
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    window.addEventListener("resize", measure);
    void document.fonts?.ready.then(measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      setFieldAnchor(null);
    };
  }, []);

  return (
    <span ref={ref} className={cn("field-anchor inline-block", className)}>
      {children}
    </span>
  );
}
