import type { Metadata } from "next";
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
    <main className="mx-auto max-w-4xl px-6 pb-32 pt-20 md:pt-28">
      <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        Connect
      </p>
      <h1
        className="mb-8 font-semibold tracking-tight"
        style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
      >
        Where I show up.
      </h1>
      <p className="mb-16 max-w-xl text-base leading-relaxed text-muted-foreground">
        The public record, what I&apos;m building, sharing, and shipping.
        For actually reaching me, that&apos;s a different page.
      </p>

      <div>
        {channels.map((channel) => (
          <ContactChannel key={channel.id} channel={channel} />
        ))}
      </div>
    </main>
  );
}
