"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import FieldMount from "@/components/field/FieldMount";
import { formForPath } from "@/config/field";
import { claimField, pulseField, releaseField } from "@/lib/field/attention";

/**
 * Binds the living field to the router. Each route claims its resting
 * form at the lowest priority; sections and ventures claim above it and
 * hand the field back when attention leaves.
 */
export default function FieldProvider() {
  const pathname = usePathname();
  const firstRender = useRef(true);

  useEffect(() => {
    claimField("route", formForPath(pathname), 0);
    return () => releaseField("route");
  }, [pathname]);

  // Every navigation sends one shockwave through the field. Skipped on the
  // first render, where the intro already does that job.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    pulseField(1.2);
  }, [pathname]);

  return <FieldMount />;
}
