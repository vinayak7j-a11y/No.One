import FieldAnchor from "@/components/field/FieldAnchor";
import BigLinks from "@/components/home/BigLinks";
import FieldSection from "@/components/home/FieldSection";
import InkHeading from "@/components/home/InkHeading";
import Manifesto from "@/components/home/Manifesto";
import Reveal from "@/components/home/Reveal";
import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";

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

      {/* 3. One closing section: the line, then the doors to everything
          else. The pages themselves hold the content, so it is not repeated
          here. */}
      <FieldSection form="galaxy" side={0} dim={0.85}>
        <Section spacing="lg" className="flex min-h-[90svh] items-center">
          <div className="w-full">
            <Reveal>
              <InkHeading
                as="h2"
                size="display"
                style={DISPLAY_STYLE}
                text="Karma, not categories."
              />
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-14 md:mt-20">
                <BigLinks />
              </div>
            </Reveal>
          </div>
        </Section>
      </FieldSection>
    </PageLayout>
  );
}
