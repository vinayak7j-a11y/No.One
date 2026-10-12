"use client";

import { useSyncExternalStore } from "react";
import {
  getFieldEnabled,
  subscribeFieldPreference,
} from "@/lib/field/preference";

/** Whether the visitor has the living field switched on (default: on). */
export function useFieldEnabled(): boolean {
  return useSyncExternalStore(
    subscribeFieldPreference,
    getFieldEnabled,
    () => true,
  );
}
