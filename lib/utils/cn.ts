import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Extended twMerge config, teaching it about custom class groups that
 * don't exist in stock Tailwind, so it can tell them apart when
 * resolving conflicts instead of guessing.
 *
 * Without this, `text-body` (a custom font-size utility from the type
 * scale, P1-T04) was being misclassified into the same conflict group
 * as `text-background` (a custom text-color utility, P1-T05), since
 * twMerge's default font-size group only recognizes stock values like
 * text-sm/text-lg. That caused Button's primary variant to silently
 * lose its text color whenever a size variant applied text-body after
 * it in the merged string, twMerge keeps the last class in a
 * conflicting group and drops the earlier one, rendering white text on
 * a white background.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        "text-display",
        "text-h1",
        "text-h2",
        "text-h3",
        "text-h4",
        "text-h5",
        "text-h6",
        "text-body-lg",
        "text-body",
        "text-body-sm",
        "text-caption",
      ],
    },
  },
});

/**
 * Merges class names, resolving Tailwind conflicts (e.g. "text-sm text-lg" -> "text-lg").
 * Every component in `components/ui` should use this instead of manual string concatenation.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
