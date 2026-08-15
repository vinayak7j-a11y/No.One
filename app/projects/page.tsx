import VentureRow from "@/components/ventures/VentureRow";
import { ventures } from "@/data/ventures";

const STAGGER_PATTERN: (0 | 1 | 2)[] = [0, 2, 1, 0, 2];

export default function ProjectsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 pb-32 pt-20 md:pt-28">
      <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        Ventures
      </p>
      <h1
        className="mb-8 font-semibold tracking-tight"
        style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
      >
        Building in the open.
      </h1>
      <p className="mb-20 max-w-xl text-base leading-relaxed text-muted-foreground">
        I don&apos;t rank these by success, and I don&apos;t treat them like
        finished resume lines. Some are shipped and validated. Some are still
        just a clear idea I haven&apos;t built yet. Some might never ship at
        all. That&apos;s fine, this is a record of the evolution, not a
        highlight reel.
      </p>

      <div>
        {ventures.map((venture, i) => (
          <VentureRow
            key={venture.identity.name}
            venture={venture}
            stagger={STAGGER_PATTERN[i % STAGGER_PATTERN.length]}
          />
        ))}
      </div>
    </main>
  );
}
