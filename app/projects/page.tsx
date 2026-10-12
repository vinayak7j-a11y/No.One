import type { Metadata } from "next";
import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import VentureList from "@/components/ventures/VentureList";

export const metadata: Metadata = {
  title: "Projects",
  description: "Vinayak Joshi, building in the open.",
};

export default function ProjectsPage() {
  return (
    <PageLayout>
      <Section spacing="lg">
        <div className="mx-auto max-w-3xl">
          <Text as="p" size="caption" tone="subtle">
            Ventures
          </Text>

          <Heading as="h1" size="h1" className="mt-4">
            Building in the open.
          </Heading>

          <Text size="lg" tone="muted" className="mt-10">
            I don&apos;t rank these by success, and I don&apos;t treat them
            like finished resume lines. Some are shipped and validated. Some
            are still just a clear idea I haven&apos;t built yet. Some might
            never ship at all. That&apos;s fine, this is a record of the
            evolution, not a highlight reel.
          </Text>

          <div className="mt-16">
            <VentureList />
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
