"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { FIELD_CAMERA_Z, FIELD_FORMS, FIELD_FOV, WORDMARK_UNITS } from "@/config/field";
import { anchorFontKey, getFieldAnchor, subscribeFieldAnchor } from "@/lib/field/anchor";
import { getFieldAssemble } from "@/lib/field/assemble";
import { getFieldSnapshot, pulseField, subscribeField } from "@/lib/field/attention";
import { FieldEngine } from "@/lib/field/engine";
import { sampleWordmark } from "@/lib/field/wordmark";

interface FieldCanvasProps {
  theme: "dark" | "light";
  reduced: boolean;
  /** Phones and tablets: fewer particles. */
  coarse: boolean;
}

const HALF_HEIGHT = Math.tan((FIELD_FOV / 2) * (Math.PI / 180)) * FIELD_CAMERA_Z;
const IDLE_FRAME_MS = 1000 / 30;

/**
 * The page background for each theme (the --background token in
 * globals.css). Not read from computed style: when the theme changes this
 * runs before next-themes has switched the class on <html>, and would
 * return the previous theme's colour.
 */
function readBackground(theme: "dark" | "light") {
  return theme === "dark" ? "#000000" : "#ffffff";
}

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

/**
 * Owns the canvas and the frame loop for the living field. It is
 * deliberately thin: all the drawing is in lib/field/engine.ts.
 *
 * Frame budget rules:
 *  - nothing renders while the tab is hidden
 *  - when the field has settled and nobody is moving the pointer or
 *    scrolling, it idles at 30 fps
 *  - reduced motion renders only when something actually changes
 *  - if frames stay slow it steps down: pixel ratio first, then particles
 */
export default function FieldCanvas({ theme, reduced, coarse }: FieldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();

  const engineRef = useRef<FieldEngine | null>(null);
  const themeRef = useRef(theme);
  const reducedRef = useRef(reduced);
  const homeRef = useRef(pathname === "/");
  const requestRef = useRef<() => void>(() => {});

  useEffect(() => {
    homeRef.current = pathname === "/";
    requestRef.current();
  }, [pathname]);

  useEffect(() => {
    reducedRef.current = reduced;
    requestRef.current();
  }, [reduced]);

  useEffect(() => {
    themeRef.current = theme;
    engineRef.current?.setTheme(theme, readBackground(theme));
    const form = document.documentElement.dataset.fieldForm;
    if (form && form in FIELD_FORMS) {
      document.documentElement.style.setProperty(
        "--field-accent",
        FIELD_FORMS[form as keyof typeof FIELD_FORMS][theme][1],
      );
    }
    requestRef.current();
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let engine: FieldEngine;
    try {
      engine = new FieldEngine(canvas, coarse ? 16000 : 36000);
    } catch (error) {
      // No WebGL2 (or a driver refusing a shader): leave the plain site
      // exactly as it was, and say why in the console.
      console.warn("[field] disabled:", error);
      return;
    }
    engineRef.current = engine;
    const root = document.documentElement;

    engine.setTheme(themeRef.current, readBackground(themeRef.current));
    if (!reducedRef.current) engine.intro();

    // --- Attention store -> engine ----------------------------------------
    let lastPulse = getFieldSnapshot().pulseSeq;
    function applySnapshot() {
      const snap = getFieldSnapshot();
      engine.setTarget(snap.form, snap.side, reducedRef.current);
      root.dataset.fieldForm = snap.form;
      root.style.setProperty(
        "--field-accent",
        FIELD_FORMS[snap.form][themeRef.current][1],
      );
      if (snap.pulseSeq !== lastPulse) {
        lastPulse = snap.pulseSeq;
        if (!reducedRef.current) engine.pulse(snap.pulseStrength);
      }
      requestRef.current();
    }
    applySnapshot();
    const unsubscribeField = subscribeField(applySnapshot);

    // --- Wordmark, in the heading's own typography -------------------------
    let cancelled = false;
    let lastKey = "";
    async function sample() {
      await document.fonts.ready;
      if (cancelled) return;
      const anchor = getFieldAnchor();
      const key = anchorFontKey(anchor);
      if (key === lastKey) return;
      const positions = sampleWordmark({
        text: "No.One",
        count: engine.count,
        fontFamily: anchor?.font.family ?? getComputedStyle(document.body).fontFamily,
        weight: anchor?.font.weight ?? 600,
        letterSpacingEm: anchor?.font.letterSpacingEm ?? 0,
        units: WORDMARK_UNITS,
      });
      if (positions && !cancelled) {
        lastKey = key;
        engine.setWordmark(positions);
        requestRef.current();
      }
    }
    void sample();
    const unsubscribeAnchor = subscribeFieldAnchor(() => void sample());

    // --- Pointer, scroll, size -------------------------------------------
    const pointer = { x: 0, y: 0, active: false };
    let lastInput = performance.now();
    const touch = () => {
      lastInput = performance.now();
      requestRef.current();
    };

    function onMove(e: PointerEvent) {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
      pointer.active = true;
      touch();
    }
    function onLeave() {
      pointer.active = false;
      touch();
    }
    function onDown(e: PointerEvent) {
      const target = e.target as Element | null;
      if (target?.closest?.("a, button, input, textarea, select, [role='button']")) return;
      pulseField(0.8);
    }
    function onUp(e: PointerEvent) {
      if (e.pointerType !== "mouse") onLeave();
    }

    // Quality steps: 0 full, 1 pixel ratio 1, 2 also 60% of the particles.
    let level = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let cssW = window.innerWidth;
    let cssH = window.innerHeight;
    function resize() {
      cssW = window.innerWidth;
      cssH = window.innerHeight;
      dpr = level >= 1 ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
      engine.resize(cssW, cssH, dpr);
      touch();
    }
    resize();

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("scroll", touch, { passive: true });
    window.addEventListener("resize", resize);
    document.addEventListener("pointerleave", onLeave);

    // --- Frame loop ---------------------------------------------------------
    let raf = 0;
    let last = performance.now();
    let lastDraw = 0;
    let slow = 0;
    let fps = 60;
    let ready = false;

    function frame(now: number) {
      raf = 0;
      const reducedNow = reducedRef.current;
      const settled = engine.isSettled();
      const quiet = now - lastInput > 1200;
      const idle = settled && quiet;

      // Idle: half rate. Reduced motion: no loop at all, draw on demand.
      if (!reducedNow && idle && now - lastDraw < IDLE_FRAME_MS - 1) {
        raf = requestAnimationFrame(frame);
        return;
      }

      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      lastDraw = now;

      const snap = getFieldSnapshot();
      const dim =
        snap.dim ?? (snap.priority >= 10 ? 0.9 : homeRef.current ? 1 : 0.55);
      const scrollY = window.scrollY;
      const anchor = getFieldAnchor();

      // The wordmark dissolves as you scroll away from the hero; sections
      // may also drive the gathering themselves (the statement does).
      const manual = getFieldAssemble();
      const assemble =
        manual ??
        (snap.form === "wordmark" ? 1 - smoothstep(0.12, 0.7, scrollY / cssH) : 1);

      engine.update({
        dt: reducedNow ? 1 : dt,
        time: now / 1000,
        pointer,
        halfH: HALF_HEIGHT,
        halfW: HALF_HEIGHT * (cssW / cssH),
        width: cssW,
        height: cssH,
        dpr,
        scrollY,
        anchor,
        reduced: reducedNow,
        dim,
        assemble,
      });
      engine.draw();

      if (!ready) {
        ready = true;
        root.dataset.field = "ready";
      }

      // Step quality down when the frame rate stays low (never judged while
      // idling, since half rate is deliberate).
      if (!reducedNow && !idle && dt > 0) {
        fps += (1 / dt - fps) * 0.05;
        slow = fps < 30 ? slow + dt : 0;
        if (slow > 2.5 && level < 2) {
          level += 1;
          slow = 0;
          if (level === 1) resize();
          else engine.setDrawFraction(0.6);
        }
      }

      if (!reducedNow || !settled) raf = requestAnimationFrame(frame);
    }

    function request() {
      if (!raf && !document.hidden) raf = requestAnimationFrame(frame);
    }
    requestRef.current = request;
    function onVisibility() {
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      } else {
        last = performance.now();
        request();
      }
    }
    document.addEventListener("visibilitychange", onVisibility);
    request();

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      requestRef.current = () => {};
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("scroll", touch);
      window.removeEventListener("resize", resize);
      unsubscribeField();
      unsubscribeAnchor();
      engine.dispose();
      engineRef.current = null;
      delete root.dataset.field;
      delete root.dataset.fieldForm;
      root.style.removeProperty("--field-accent");
    };
  }, [coarse]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
