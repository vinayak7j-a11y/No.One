import FieldAnchor from "@/components/field/FieldAnchor";
import BigLinks from "@/components/home/BigLinks";
import FieldSection from "@/components/home/FieldSection";
import Manifesto from "@/components/home/Manifesto";
import Reveal from "@/components/home/Reveal";
import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import VentureList from "@/components/ventures/VentureList";

const DISPLAY_STYLE = {
  fontSize: "clamp(3rem, 7.2vw, 6.5rem)",
  lineHeight: 1.02,
} as const;

export default function Home() {
  return (
    <PageLayout>
      {/* 1. Hero: the wordmark is formed by the field over this heading. */}
      <Section
        spacing="none"
        className="flex min-h-[calc(100svh-4rem)] items-center"
      >
        <div className="relative w-full text-center">
          <Text as="p" size="caption" tone="subtle">
            Vinayak Joshi
          </Text>

          {/* The heading stays real text. While the living field is
              running, the particles form this same word over it
              (FieldAnchor reports where it sits and how it is typeset). */}
          <Heading
            as="h1"
            size="display"
            className="mt-4"
            style={{ fontSize: "clamp(4.5rem, 16vw, 13rem)", lineHeight: 1 }}
          >
            <FieldAnchor>No.One</FieldAnchor>
          </Heading>

          <Text size="lg" tone="muted" className="mx-auto mt-6 max-w-xl">
            The Digital Headquarters of Vinayak Joshi.
          </Text>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Button href="/about">About</Button>
            <Button variant="outline" href="/projects">
              Projects
            </Button>
          </div>

          <div aria-hidden="true" className="scroll-cue mx-auto mt-16" />
        </div>
      </Section>

      {/* 2. Statement, read by scrolling. */}
      <Manifesto />

      {/* 3. Ventures: copy pinned on the left, the list on the right. */}
      <FieldSection form="rest" side={0} dim={0.5}>
        <Section spacing="lg">
          <div className="grid gap-14 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-20">
            <div className="md:sticky md:top-28 md:self-start">
              <Reveal>
                <Text as="p" size="caption" tone="subtle">
                  Ventures
                </Text>
                <Heading as="h2" size="h1" className="mt-4">
                  Building in the open.
                </Heading>
                <Text size="lg" tone="muted" className="mt-8">
                  I don&apos;t rank these by success, and I don&apos;t treat
                  them like finished resume lines. This is a record of the
                  evolution, not a highlight reel.
                </Text>
              </Reveal>
            </div>
            <Reveal delay={0.1}>
              <VentureList />
            </Reveal>
          </div>
        </Section>
      </FieldSection>

      {/* 4. About: one big line, one quiet column. */}
      <FieldSection form="galaxy" side={0} dim={0.55}>
        <Section spacing="lg" className="flex min-h-[80svh] items-center">
          <div className="grid w-full gap-12 md:grid-cols-2 md:items-end md:gap-20">
            <Reveal>
              <Text as="p" size="caption" tone="subtle">
                About
              </Text>
              <Heading
                as="h2"
                size="display"
                className="mt-4"
                style={DISPLAY_STYLE}
              >
                Karma, not categories.
              </Heading>
            </Reveal>
            <Reveal delay={0.1}>
              <Text size="lg" tone="muted">
                I&apos;m Vinayak. I don&apos;t do life in parts.
              </Text>
              <Text size="lg" tone="muted" className="mt-6">
                I live to live. Everything else — the startups, the projects,
                the content, the wins and the ones nobody sees — is just that,
                in disguise.
              </Text>
              <div className="mt-8">
                <Button variant="outline" href="/about">
                  Read more
                </Button>
              </div>
            </Reveal>
          </div>
        </Section>
      </FieldSection>

      {/* 5. Connect: two big doors. */}
      <FieldSection form="bridge" side={0} dim={0.5}>
        <Section spacing="lg">
          <Reveal>
            <Text as="p" size="caption" tone="subtle" className="mb-8">
              Let&apos;s connect
            </Text>
            <BigLinks />
          </Reveal>
        </Section>
      </FieldSection>
    </PageLayout>
  );
}
