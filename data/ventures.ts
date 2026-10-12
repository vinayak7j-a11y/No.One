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
      link: "https://keepl.onrender.com",
    },
  },
  {
    slug: "bond",
    identity: {
      name: "Bond",
      stage: "active",
      statusLabel: "Live",
    },
    content: {
      description:
        "A physical and digital identity product, share your professional self and online presence instantly, through a seamless interaction rather than a business card or a link. Still early, still research. The vision matters more than the how, right now.",
      link: "https://bond-five-swart.vercel.app/",
    },
  },
  {
    slug: "messpass",
    identity: {
      name: "MessPass",
      stage: "active",
      statusLabel: "Live",
    },
    content: {
      description:
        "QR-based meal management for hostels, colleges, and mess providers, so tracking who ate what doesn't have to mean paper registers and guesswork. Attendance, verification, and meal tracking, simplified into one scan.",
      link: "https://messpass-mocha.vercel.app/",
    },
  },
  {
    slug: "no-one",
    identity: {
      name: "No.One",
      stage: "active",
      statusLabel: "Live",
    },
    content: {
      description:
        "The Digital Headquarters of Vinayak Joshi. This site itself, the living record of everything else here, built to grow for years without a rewrite rather than shipped once and left alone.",
      link: "https://no-one-rho.vercel.app/",
      github: "https://github.com/vinayak7j-a11y/No.One",
    },
  },
];
