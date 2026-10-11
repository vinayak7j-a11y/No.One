"use client";

import { useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FIELD_FORMS } from "@/config/field";
import { ventures } from "@/data/ventures";
import { useFieldEnabled } from "@/hooks/useFieldEnabled";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getFieldSnapshot, subscribeField } from "@/lib/field/attention";

/** A small caption that names whatever shape the field is holding. */
export default function FieldHud() {
  const enabled = useFieldEnabled();
  const reduced = useReducedMotion();
  const snap = useSyncExternalStore(
    subscribeField,
    getFieldSnapshot,
    getFieldSnapshot,
  );

  if (!enabled) return null;

  const venture = ventures.find((v) => v.identity.form === snap.form);
  const label = (venture?.identity.name ?? FIELD_FORMS[snap.form].label).toUpperCase();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-5 left-5 z-20 hidden items-center gap-3 font-mono text-caption text-muted-foreground md:flex"
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{
          background: "var(--field-accent, var(--accent))",
          boxShadow: "0 0 12px var(--field-accent, var(--accent))",
        }}
      />
      <span className="tracking-[0.2em]">FIELD</span>
      <span className="relative inline-block h-[1.2em] min-w-24 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={label}
            className="absolute left-0 top-0 whitespace-nowrap text-foreground"
            initial={reduced ? false : { y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={reduced ? undefined : { y: "-100%", opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {label}
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  );
}
