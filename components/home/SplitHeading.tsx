"use client";

import { motion } from "framer-motion";
import Heading, { type HeadingProps } from "@/components/ui/Heading";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface SplitHeadingProps extends Omit<HeadingProps, "children"> {
  text: string;
  delay?: number;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * A heading whose words rise out of a mask one after another when it
 * scrolls into view. The full text is kept once for assistive tech and
 * the visual words are hidden from it, so the heading reads normally.
 */
export default function SplitHeading({
  text,
  delay = 0,
  ...heading
}: SplitHeadingProps) {
  const reduced = useReducedMotion();

  if (reduced) return <Heading {...heading}>{text}</Heading>;

  const words = text.split(" ");

  return (
    <Heading {...heading}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="inline-block overflow-hidden pb-[0.14em] align-bottom"
          >
            <motion.span
              className="inline-block"
              initial={{ y: "115%", rotate: 4 }}
              whileInView={{ y: "0%", rotate: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.95, delay: delay + i * 0.08, ease: EASE }}
            >
              {word}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </span>
    </Heading>
  );
}
