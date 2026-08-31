import type { Metadata } from "next";
import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import ContactChannel, { type Channel } from "@/components/contact/ContactChannel";
import MessageComposer from "@/components/contact/MessageComposer";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach Vinayak Joshi directly.",
};

const channels: Channel[] = [
  {
    id: "email",
    name: "Email",
    handle: "vinayak00j@gmail.com",
    blurb: "Best for anything that needs a real reply, not a quick reaction.",
    href: "mailto:vinayak00j@gmail.com",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    handle: "+91 92852 73124",
    blurb: "For quick back and forth, if a longer email feels like overkill.",
    href: "https://wa.me/919285273124",
  },
];

export default function ContactPage() {
  return (
    <PageLayout>
      <Section spacing="lg">
        <div className="mx-auto max-w-3xl">
          <Text as="p" size="caption" tone="subtle">
            Contact
          </Text>

          <Heading as="h1" size="h1" className="mt-4">
            Reach out.
          </Heading>

          <Text size="lg" tone="muted" className="mt-10">
            This is for actually reaching me, not for browsing what I post.
            A question, an idea, a problem you want another set of hands on,
            or a straightforward job or collaboration ask, all fit here.
          </Text>

          <div className="mt-16">
            {channels.map((channel) => (
              <ContactChannel key={channel.id} channel={channel} />
            ))}
          </div>

          <MessageComposer />
        </div>
      </Section>
    </PageLayout>
  );
}
