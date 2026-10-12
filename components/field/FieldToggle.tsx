"use client";

import Button from "@/components/ui/Button";
import { useFieldEnabled } from "@/hooks/useFieldEnabled";
import { setFieldEnabled } from "@/lib/field/preference";

/**
 * Lets any visitor turn the living field off (and back on). Motion and
 * WebGL are never forced on someone: this sits next to the OS-level
 * reduced-motion handling as an explicit, remembered choice.
 */
export default function FieldToggle() {
  const enabled = useFieldEnabled();

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-pressed={enabled}
      aria-label="Living field background"
      onClick={() => setFieldEnabled(!enabled)}
    >
      <span className="font-mono text-caption uppercase tracking-widest">
        Field {enabled ? "on" : "off"}
      </span>
    </Button>
  );
}
