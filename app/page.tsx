import FieldAnchor from "@/components/field/FieldAnchor";
import FieldSection from "@/components/home/FieldSection";
import Reveal from "@/components/home/Reveal";
import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import VentureList from "@/components/ventures/VentureList";

export default function Home() {
  return (
    <PageLayout>
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
              (FieldAnchor reports where it sits). */}
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

      <FieldSection form="seed" textSide="left">
        <Reveal>
          <Text as="p" size="caption" tone="subtle">
            Digital headquarters
          </Text>
          <Heading as="h2" size="h1" className="mt-4">
            Not a portfolio.
          </Heading>
        </Reveal>
        <Reveal delay={0.12}>
          <Text size="lg" tone="muted" className="mt-8">
            Ideas become products, products become companies, knowledge
            becomes public, and the journey is documented over time.
          </Text>
        </Reveal>
      </FieldSection>

      <FieldSection form="rest" textSide="center">
        <Reveal>
          <Text as="p" size="caption" tone="subtle">
            Ventures
          </Text>
          <Heading as="h2" size="h1" className="mt-4">
            Building in the open.
          </Heading>
          <Text size="lg" tone="muted" className="mx-auto mt-8 max-w-2xl">
            I don&apos;t rank these by success, and I don&apos;t treat them
            like finished resume lines.
          </Text>
        </Reveal>
        <Reveal delay={0.12} className="mt-16 text-left">
          <VentureList />
        </Reveal>
      </FieldSection>

      <FieldSection form="galaxy" textSide="right">
        <Reveal>
          <Text as="p" size="caption" tone="subtle">
            About
          </Text>
          <Heading as="h2" size="h1" className="mt-4">
            Karma, not categories.
          </Heading>
        </Reveal>
        <Reveal delay={0.12}>
          <Text size="lg" tone="muted" className="mt-8">
            I&apos;m Vinayak. I don&apos;t do life in parts.
          </Text>
          <div className="mt-8">
            <Button variant="outline" href="/about">
              Read more
            </Button>
          </div>
        </Reveal>
      </FieldSection>

      <FieldSection form="bridge" textSide="left">
        <Reveal>
          <Text as="p" size="caption" tone="subtle">
            Connect
          </Text>
          <Heading as="h2" size="h1" className="mt-4">
            Let&apos;s connect.
          </Heading>
        </Reveal>
        <Reveal delay={0.12}>
          <Text size="lg" tone="muted" className="mt-8">
            Everything I build, learn and share links back here.
          </Text>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button href="/connect">Connect</Button>
            <Button variant="outline" href="/contact">
              Contact
            </Button>
          </div>
        </Reveal>
      </FieldSection>
    </PageLayout>
  );
}
