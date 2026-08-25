import type { Metadata } from "next";
import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import ContactChannel, { type Channel } from "@/components/contact/ContactChannel";

export const metadata: Metadata = {
  title: "Connect",
  description: "Where to find Vinayak Joshi's work and content.",
};

const channels: Channel[] = [
  {
    id: "instagram",
    name: "Instagram",
    handle: "@_.vinayakjoshi._",
    blurb: "Where I think out loud in public, before it's a finished idea.",
    href: "https://www.instagram.com/_.vinayakjoshi._/",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    handle: "/in/vinayak-joshi-00v",
    blurb: "For anything that starts with a job, a role, or a collaboration.",
    href: "https://www.linkedin.com/in/vinayak-joshi-00v/",
  },
  {
    id: "github",
    name: "GitHub",
    handle: "@vinayak7j-a11y",
    blurb: "The actual work, in progress and otherwise.",
    href: "https://github.com/vinayak7j-a11y",
  },
];

export default function ConnectPage() {
  return (
    <PageLayout>
      <Section spacing="lg">
        <div className="mx-auto max-w-3xl">
          <Text as="p" size="caption" tone="subtle">
            Connect
          </Text>

          <Heading as="h1" size="h1" className="mt-4">
            Where I show up.
          </Heading>

          <Text size="lg" tone="muted" className="mt-10">
            The public record, what I&apos;m building, sharing, and shipping.
            For actually reaching me, that&apos;s a different page.
          </Text>

          <div className="mt-16">
            {channels.map((channel) => (
              <ContactChannel key={channel.id} channel={channel} />
            ))}
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
