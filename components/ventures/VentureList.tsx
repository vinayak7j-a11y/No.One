import VentureRow from "@/components/ventures/VentureRow";
import { ventures } from "@/data/ventures";

/**
 * Deterministic pixel stagger that breaks a rigid list read. It is not a
 * ranking signal (see Law of Non-Ranking in LANGUAGE.md).
 */
const STAGGER_PATTERN: (0 | 1 | 2)[] = [0, 2, 1, 0, 2];

/**
 * The full set of ventures, rendered once and reused by /projects and the
 * home page so the attention behaviour lives in a single place.
 */
export default function VentureList() {
  return (
    <div>
      {ventures.map((venture, i) => (
        <VentureRow
          key={venture.slug}
          venture={venture}
          stagger={STAGGER_PATTERN[i % STAGGER_PATTERN.length]}
        />
      ))}
    </div>
  );
}
