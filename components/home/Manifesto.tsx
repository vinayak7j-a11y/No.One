"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Section from "@/components/layout/Section";
import Text from "@/components/ui/Text";
import { useFieldClaim } from "@/hooks/useFieldClaim";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** From docs/VISION.md. */
const STATEMENT =
  "Not just a portfolio. The single place where ideas become products, products become companies, knowledge becomes public, and the journey is documented over time.";

const WORDS = STATEMENT.split(" ");

const TEXT_STYLE = {
  fontSize: "clamp(1.9rem, 4.6vw, 4.25rem)",
  lineHeight: 1.12,
  letterSpacing: "-0.03em",
} as const;

function Word({
  word,
  index,
  progress,
}: {
  word: string;
  index: number;
  progress: MotionValue<number>;
}) {
  // Each word lights up inside its own slice of the scroll, overlapping its
  // neighbours so the read feels continuous rather than stepped.
  const start = (index / WORDS.length) * 0.82;
  const end = start + 0.12;
  const opacity = useTransform(progress, [start, end], [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {word}
      {" "}
    </motion.span>
  );
}

/**
 * The statement is read by scrolling: the section pins to the screen and
 * each word comes up as you move through it. Reduced-motion visitors get
 * the whole statement at full strength with no pinning.
 */
export default function Manifesto() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-35% 0px -35% 0px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useFieldClaim("seed", inView, 5, 0, 0.42);

  if (reduced) {
    return (
      <div ref={ref}>
        <Section spacing="lg">
          <div className="mx-auto max-w-5xl">
            <Text as="p" size="caption" tone="subtle">
              Digital headquarters
            </Text>
            <p className="mt-6 font-semibold text-foreground" style={TEXT_STYLE}>
              {STATEMENT}
            </p>
          </div>
        </Section>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen items-center">
        <Section spacing="none" className="w-full">
          <div className="mx-auto max-w-5xl">
            <Text as="p" size="caption" tone="subtle">
              Digital headquarters
            </Text>
            <p
              className="mt-6 font-semibold text-foreground"
              style={TEXT_STYLE}
              aria-label={STATEMENT}
            >
              {WORDS.map((word, i) => (
                <Word
                  key={`${word}-${i}`}
                  word={word}
                  index={i}
                  progress={scrollYProgress}
                />
              ))}
            </p>
          </div>
        </Section>
      </div>
    </div>
  );
}
