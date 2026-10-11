import FieldSection from "@/components/home/FieldSection";
import Reveal from "@/components/home/Reveal";
import SplitHeading from "@/components/home/SplitHeading";
import Text from "@/components/ui/Text";

/** Condensed from LANGUAGE.md; the full wording lives there. */
const LAWS = [
  {
    name: "Rest",
    line: "Everything idles undecorated and at equal weight until something earns attention.",
  },
  {
    name: "Attention",
    line: "Reveal follows intent, not input device. Hover, focus and tap do the same thing.",
  },
  {
    name: "Return",
    line: "Lose attention and it collapses back to rest. There is no close button.",
  },
  {
    name: "Non-Ranking",
    line: "Nothing outranks anything else by default.",
  },
  {
    name: "Relation",
    line: "A connection is a fact about both ends, not only the one that declares it.",
  },
];

export default function LawsSection() {
  return (
    <FieldSection form="sheets" textSide="left">
      <Reveal>
        <Text as="p" size="caption" tone="subtle">
          How it behaves
        </Text>
      </Reveal>
      <SplitHeading as="h2" size="h1" className="mt-4" text="Five laws." />
      <ol className="mt-10 divide-y divide-border border-y border-border">
        {LAWS.map((law, i) => (
          <li key={law.name}>
            <Reveal delay={0.06 * i}>
              <div className="law-row group flex items-baseline gap-5 py-5">
                <span className="font-mono text-caption tracking-widest text-muted-foreground transition-colors duration-300 group-hover:text-[var(--field-accent,var(--accent))]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="transition-transform duration-500 ease-out group-hover:translate-x-1.5">
                  <h3 className="text-h5 font-semibold text-foreground">
                    {law.name}
                  </h3>
                  <p className="mt-1 text-body-sm text-muted">{law.line}</p>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </FieldSection>
  );
}
