export type VentureStage = "concept" | "prototype" | "active";

/**
 * The relationship vocabulary between artifacts, organized into families
 * so new types have to earn membership rather than sprawling into an
 * arbitrary tag system over time.
 *
 * Not yet rendered anywhere on the page — this exists so the data
 * architecture is ready for relationship visualization later without a
 * rebuild. No relationships are populated yet below; inventing them
 * without confirmation would mean asserting connections as fact that
 * haven't actually been described. Add real ones here whenever they're
 * defined.
 */
export type RelationType =
  // Sequential — directional, time-ordered
  | "led_to"
  | "expanded_into"
  | "continues_as"
  // Evidentiary — directional, one artifact describes another
  | "documents"
  | "references"
  // Influential — directional, softer than causal
  | "inspired_by"
  | "influenced_by"
  // Collaborative — reciprocal
  | "built_with";

export interface VentureRelation {
  slug: string;
  type: RelationType;
}

export interface Venture {
  slug: string;
  /** Identity — what it is. */
  identity: {
    name: string;
    stage: VentureStage;
    statusLabel: string;
  };
  /** Content — what someone discovers when engaging with it. */
  content: {
    description: string;
    link?: string;
  };
  /**
   * Relationships — how it connects to other artifacts. Optional and
   * currently unpopulated (see note above the type).
   *
   * Note: "Behavior" — the fourth part of No.One's artifact anatomy —
   * is deliberately not a field here. Behavior belongs to the shared
   * physics every artifact obeys (rest / arrival / engagement, encoded
   * in `VentureRow`), not to per-artifact authored data.
   */
  relations?: VentureRelation[];
}

export const ventures: Venture[] = [
  {
    slug: "rent-it",
    identity: {
      name: "Rent It",
      stage: "prototype",
      statusLabel: "In Development",
    },
    content: {
      description:
        "A trust-first way to access things instead of owning them. It starts with clothing, but the real goal is a marketplace for anything people don't use every day — the hard part isn't the rental, it's the trust: escrow, identity, fit, and booking, built to scale past one category.",
    },
  },
  {
    slug: "keepl",
    identity: {
      name: "Keepl",
      stage: "active",
      statusLabel: "MVP, Validated",
    },
    content: {
      description:
        "A loyalty and retention platform for local businesses — real rewards, digitized, built and tested with actual businesses instead of assumptions. Real usage first, everything else after.",
    },
  },
  {
    slug: "bond",
    identity: {
      name: "Bond",
      stage: "concept",
      statusLabel: "Concept",
    },
    content: {
      description:
        "A physical and digital identity product — share your professional self and online presence instantly, through a seamless interaction rather than a business card or a link. Still early, still research. The vision matters more than the how, right now.",
    },
  },
  {
    slug: "messpass",
    identity: {
      name: "MessPass",
      stage: "prototype",
      statusLabel: "Prototype",
    },
    content: {
      description:
        "QR-based meal management for hostels, colleges, and mess providers, so tracking who ate what doesn't have to mean paper registers and guesswork. Attendance, verification, and meal tracking, simplified into one scan.",
    },
  },
  {
    slug: "levelup",
    identity: {
      name: "LevelUp",
      stage: "active",
      statusLabel: "Active",
    },
    content: {
      description:
        "A growth studio — websites, AI, automation, and digital systems that help businesses actually show up online. Where I turn what I learn building my own ventures into results for someone else's.",
    },
  },
];
