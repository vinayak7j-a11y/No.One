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
  | "led_to"
  | "expanded_into"
  | "continues_as"
  | "documents"
  | "references"
  | "inspired_by"
  | "influenced_by"
  | "built_with";

export interface VentureRelation {
  slug: string;
  type: RelationType;
}

export interface Venture {
  slug: string;
  identity: {
    name: string;
    stage: VentureStage;
    statusLabel: string;
  };
  content: {
    description: string;
    link?: string;
    github?: string;
    instagram?: string;
  };
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
        "A trust-first way to access things instead of owning them. It starts with clothing, but the real goal is a marketplace for anything people don't use every day, the hard part isn't the rental, it's the trust: escrow, identity, fit, and booking, built to scale past one category.",
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
        "A loyalty and retention platform for local businesses, real rewards, digitized, built and tested with actual businesses instead of assumptions. Real usage first, everything else after.",
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
        "A physical and digital identity product, share your professional self and online presence instantly, through a seamless interaction rather than a business card or a link. Still early, still research. The vision matters more than the how, right now.",
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
        "A growth studio, websites, AI, automation, and digital systems that help businesses actually show up online. Where I turn what I learn building my own ventures into results for someone else's.",
    },
  },
];
