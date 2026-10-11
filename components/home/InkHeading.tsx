"use client";

import { useEffect, useRef } from "react";
import Heading, { type HeadingProps } from "@/components/ui/Heading";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface InkHeadingProps extends Omit<HeadingProps, "children"> {
  text: string;
}

const RADIUS = 190;
const MAX_STROKE_EM = 0.034;

/**
 * A heading whose letters thicken near the pointer, like ink pooling under
 * it. The thickening is a text stroke, not a font-weight change, so glyph
 * widths never change and nothing reflows. Mouse only; everyone else gets
 * plain text.
 */
export default function InkHeading({ text, ...heading }: InkHeadingProps) {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const letters = Array.from(root.querySelectorAll<HTMLElement>("[data-ink]"));
    const level = new Float32Array(letters.length);
    const centres = new Float32Array(letters.length * 2);
    let px = -9999;
    let py = -9999;
    let raf = 0;
    let size = 16;

    function measure() {
      size = parseFloat(getComputedStyle(root!).fontSize) || 16;
      letters.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        centres[i * 2] = r.left + r.width / 2;
        centres[i * 2 + 1] = r.top + r.height / 2;
      });
    }

    function tick() {
      raf = 0;
      let moving = false;
      letters.forEach((el, i) => {
        const dx = centres[i * 2] - px;
        const dy = centres[i * 2 + 1] - py;
        const target = Math.exp(-(dx * dx + dy * dy) / (RADIUS * RADIUS));
        level[i] += (target - level[i]) * 0.16;
        if (Math.abs(target - level[i]) > 0.004) moving = true;
        const stroke = level[i] * MAX_STROKE_EM * size;
        el.style.webkitTextStroke = stroke > 0.05 ? `${stroke.toFixed(2)}px currentColor` : "0";
      });
      if (moving) raf = requestAnimationFrame(tick);
    }

    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      px = e.clientX;
      py = e.clientY;
      // Letters move when the page scrolls, so re-measure on each move.
      measure();
      if (!raf) raf = requestAnimationFrame(tick);
    }
    function onLeave() {
      px = py = -9999;
      if (!raf) raf = requestAnimationFrame(tick);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  if (reduced) return <Heading {...heading}>{text}</Heading>;

  const words = text.split(" ");

  return (
    <Heading {...heading}>
      <span className="sr-only">{text}</span>
      <span ref={rootRef} aria-hidden="true">
        {words.map((word, w) => (
          <span key={`${word}-${w}`} className="inline-block whitespace-nowrap">
            {Array.from(word).map((char, c) => (
              <span key={c} data-ink className="inline-block">
                {char}
              </span>
            ))}
            {w < words.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    </Heading>
  );
}
