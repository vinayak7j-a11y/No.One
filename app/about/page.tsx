import type { Metadata } from "next";
import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";

export const metadata: Metadata = {
  title: "About",
  description: "Vinayak Joshi — building an interesting life, on purpose.",
};

export default function AboutPage() {
  return (
    <PageLayout>
      <Section spacing="lg">
        <Text as="p" size="caption" tone="subtle">
          About
        </Text>

        <Heading as="h1" size="h1" className="mt-4 max-w-3xl">
          Karma, not categories.
        </Heading>

        <div className="mt-10 flex max-w-2xl flex-col gap-6">
          <Text size="lg" tone="muted">
            I&apos;m Vinayak. I don&apos;t do life in parts.
          </Text>

          <Text size="lg" tone="muted">
            I don&apos;t split it into categories. Work, health, relationships,
            adventure — I don&apos;t do one and then wait my turn for the next.
            Building something, meeting someone new, saying yes to what scares
            me, resting — it&apos;s all the same motion wearing different
            shapes. Action, or the choice not to act. Karma, not columns on a
            list. I&apos;m not trying to get good at one part of life while the
            rest sits and waits. I&apos;m trying to get good at all of it,
            together, because it was never actually separate to begin with.
          </Text>

          <Text size="lg" tone="muted">
            I live to live. Everything else — the startups, the projects, the
            content, the wins and the ones nobody sees — is just that, in
            disguise.
          </Text>

          <Text size="lg" tone="muted">
            Some of it plays out elsewhere: code on GitHub, videos on YouTube,
            thoughts on X and LinkedIn. Scattered like that, it&apos;s just
            pieces. Here, it becomes one story — what I&apos;m building, what
            I&apos;m reading, what I&apos;m learning, what I&apos;ve shipped,
            and enough of the personal side to make it real. Not a highlight
            reel. A record, and the thread that ties it together.
          </Text>
        </div>
      </Section>
    </PageLayout>
  );
}
