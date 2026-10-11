"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";
import {
  FIELD_CAMERA_Z,
  FIELD_FORMS,
  FIELD_FOV,
  WORDMARK_UNITS,
} from "@/config/field";
import {
  anchorFontKey,
  getFieldAnchor,
  subscribeFieldAnchor,
} from "@/lib/field/anchor";
import {
  getFieldSnapshot,
  pulseField,
  subscribeField,
} from "@/lib/field/attention";
import { FieldEngine } from "@/lib/field/engine";
import { sampleWordmark } from "@/lib/field/wordmark";

interface FieldCanvasProps {
  theme: "dark" | "light";
  reduced: boolean;
  /** Phones and tablets: fewer particles, no bloom. */
  coarse: boolean;
}

interface SceneProps extends FieldCanvasProps {
  level: number;
  onDegrade: (level: number) => void;
}

const HALF_HEIGHT = Math.tan(THREE.MathUtils.degToRad(FIELD_FOV / 2)) * FIELD_CAMERA_Z;

function readBackground(theme: "dark" | "light") {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue("--background")
    .trim();
  return value || (theme === "dark" ? "#000000" : "#ffffff");
}

function Scene({ theme, reduced, coarse, level, onDegrade }: SceneProps) {
  const getState = useThree((s) => s.get);
  const invalidate = useThree((s) => s.invalidate);
  const pathname = usePathname();

  const engineRef = useRef<FieldEngine | null>(null);
  const pointer = useRef({ x: 0, y: 0, active: false });
  const isHome = useRef(pathname === "/");
  const reducedRef = useRef(reduced);
  const stats = useRef({ fps: 60, slow: 0, level: 0, ready: false });
  const themeRef = useRef(theme);

  // Latest props, readable from callbacks without re-subscribing.
  useEffect(() => {
    isHome.current = pathname === "/";
    reducedRef.current = reduced;
    invalidate();
  }, [pathname, reduced, invalidate]);

  // Publish the current form's accent hue as a CSS variable so the page
  // (glow, progress bar, caption) can follow what the field is showing.
  useEffect(() => {
    themeRef.current = theme;
    const form = document.documentElement.dataset.fieldForm;
    if (form && form in FIELD_FORMS) {
      document.documentElement.style.setProperty(
        "--field-accent",
        FIELD_FORMS[form as keyof typeof FIELD_FORMS][theme][1],
      );
    }
  }, [theme]);

  // Create the engine once per particle budget and wire it to the store.
  useEffect(() => {
    const scene = getState().scene;
    const engine = new FieldEngine(coarse ? 16000 : 36000);
    engineRef.current = engine;
    scene.add(engine.group);
    scene.background = engine.background;
    engine.setTheme(theme, readBackground(theme));
    if (!reducedRef.current) engine.intro();

    let lastPulse = getFieldSnapshot().pulseSeq;
    function apply() {
      const snap = getFieldSnapshot();
      engine.setTarget(snap.form, snap.side, reducedRef.current);
      document.documentElement.dataset.fieldForm = snap.form;
      document.documentElement.style.setProperty(
        "--field-accent",
        FIELD_FORMS[snap.form][themeRef.current][1],
      );
      if (snap.pulseSeq !== lastPulse) {
        lastPulse = snap.pulseSeq;
        if (!reducedRef.current) engine.pulse(snap.pulseStrength);
      }
      invalidate();
    }
    apply();
    const unsubscribe = subscribeField(apply);

    return () => {
      unsubscribe();
      scene.remove(engine.group);
      scene.background = null;
      engine.dispose();
      engineRef.current = null;
      delete document.documentElement.dataset.field;
      delete document.documentElement.dataset.fieldForm;
      document.documentElement.style.removeProperty("--field-accent");
    };
    // `theme` is applied by its own effect below; re-creating the engine
    // on a theme change would throw away the current form.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getState, coarse, invalidate]);

  useEffect(() => {
    engineRef.current?.setTheme(theme, readBackground(theme));
    invalidate();
  }, [theme, invalidate]);

  useEffect(() => {
    engineRef.current?.setDrawFraction(level >= 3 ? 0.5 : 1);
  }, [level]);

  // Sample the wordmark in the heading's own font and tracking, and again
  // whenever that typography changes (for example after a route change).
  useEffect(() => {
    let cancelled = false;
    let lastKey = "";

    async function sample() {
      await document.fonts.ready;
      const engine = engineRef.current;
      if (cancelled || !engine) return;
      const anchor = getFieldAnchor();
      const key = anchorFontKey(anchor);
      if (key === lastKey) return;
      const positions = sampleWordmark({
        text: "No.One",
        count: engine.count,
        fontFamily:
          anchor?.font.family ?? getComputedStyle(document.body).fontFamily,
        weight: anchor?.font.weight ?? 600,
        letterSpacingEm: anchor?.font.letterSpacingEm ?? 0,
        units: WORDMARK_UNITS,
      });
      if (positions && !cancelled) {
        lastKey = key;
        engine.setWordmark(positions);
        invalidate();
      }
    }

    void sample();
    const unsubscribe = subscribeFieldAnchor(() => void sample());
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [coarse, invalidate]);

  // Pointer, and click-to-burst on anything that is not a control.
  useEffect(() => {
    function onMove(e: PointerEvent) {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
      pointer.current.active = true;
    }
    function onLeave() {
      pointer.current.active = false;
    }
    function onDown(e: PointerEvent) {
      const target = e.target as Element | null;
      if (target?.closest?.("a, button, input, textarea, select, [role='button']")) {
        return;
      }
      pulseField(0.8);
    }
    function onUp(e: PointerEvent) {
      if (e.pointerType !== "mouse") onLeave();
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  useFrame((state, delta) => {
    const engine = engineRef.current;
    if (!engine) return;

    const dt = Math.min(delta, 0.05);
    const { width, height } = state.size;
    const snap = getFieldSnapshot();
    // Copy stays readable: the field is full strength on the home page and
    // while a venture has attention, and recedes behind everything else.
    const dim =
      snap.dim ?? (snap.priority >= 10 ? 0.9 : isHome.current ? 1 : 0.55);

    engine.update({
      dt,
      time: state.clock.elapsedTime,
      pointer: pointer.current,
      halfH: HALF_HEIGHT,
      halfW: HALF_HEIGHT * (width / height),
      width,
      height,
      dpr: state.gl.getPixelRatio(),
      scrollY: window.scrollY,
      anchor: getFieldAnchor(),
      reduced: reducedRef.current,
      dim,
    });

    if (!stats.current.ready) {
      stats.current.ready = true;
      document.documentElement.dataset.field = "ready";
    }

    // Step quality down when the frame rate stays low.
    if (!reducedRef.current && delta > 0) {
      const s = stats.current;
      s.fps += (1 / delta - s.fps) * 0.05;
      s.slow = s.fps < 30 ? s.slow + delta : 0;
      if (s.slow > 2.5 && s.level < 3) {
        s.level += 1;
        s.slow = 0;
        onDegrade(s.level);
      }
    }
  });

  return null;
}

export default function FieldCanvas({ theme, reduced, coarse }: FieldCanvasProps) {
  const [level, setLevel] = useState(0);
  const bloom = theme === "dark" && !coarse && level < 1;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        dpr={[1, level >= 2 ? 1 : 1.5]}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, FIELD_CAMERA_Z], fov: FIELD_FOV, near: 0.1, far: 60 }}
        frameloop={reduced ? "demand" : "always"}
        resize={{ scroll: false }}
      >
        <Scene
          theme={theme}
          reduced={reduced}
          coarse={coarse}
          level={level}
          onDegrade={setLevel}
        />
        {bloom && (
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={0.6}
              luminanceThreshold={0.1}
              luminanceSmoothing={0.85}
              mipmapBlur
              radius={0.65}
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
