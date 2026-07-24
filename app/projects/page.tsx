import type { Metadata } from "next";
import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import VentureRow from "@/components/ventures/VentureRow";
import { ventures } from "@/data/ventures";

export const metadata: Metadata = {
  title: "Projects",
  description: "Ventures in progress — Vinayak Joshi.",
};

export default function ProjectsPage() {
  return (
    <PageLayout>
      <Section spacing="lg">
        <Text as="p" size="caption" tone="subtle">
          Ventures
        </Text>

        <Heading as="h1" size="h1" className="mt-4 max-w-3xl">
          Building in the open.
        </Heading>

        <Text size="lg" tone="muted" className="mt-8 max-w-2xl">
          I don&apos;t rank these by success, and I don&apos;t treat them like
          finished résumé lines. Some are shipped and validated. Some are
          still just a clear idea I haven&apos;t built yet. Some might never
          ship at all. That&apos;s fine — this is a record of the evolution,
          not a highlight reel.
        </Text>

        <div className="mt-20 flex max-w-3xl flex-col">
          {ventures.map((venture) => (
            <VentureRow key={venture.slug} venture={venture} />
          ))}
        </div>
      </Section>
    </PageLayout>
  );
}
