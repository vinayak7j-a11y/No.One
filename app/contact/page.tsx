import ContactChannel, { type Channel } from "@/components/contact/ContactChannel";
import MessageComposer from "@/components/contact/MessageComposer";

// PLACEHOLDER data, real handles/hrefs need to come from the person,
// not be guessed. Same rule as data/ventures.ts: don't fabricate facts.
const channels: Channel[] = [
  {
    id: "email",
    name: "Email",
    handle: "hello@example.com",
    blurb: "Best for anything that needs a real reply, not a quick reaction.",
    href: "mailto:hello@example.com",
  },
  {
    id: "x",
    name: "X",
    handle: "@example",
    blurb: "Where I think out loud in public, before it's a finished idea.",
    href: "https://x.com/example",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    handle: "/in/example",
    blurb: "For anything that starts with a job, a role, or a collaboration.",
    href: "https://linkedin.com/in/example",
  },
  {
    id: "github",
    name: "GitHub",
    handle: "@example",
    blurb: "The actual work, in progress and otherwise.",
    href: "https://github.com/example",
  },
];

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 pb-32 pt-20 md:pt-28">
      <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        Contact
      </p>
      <h1
        className="mb-8 font-semibold tracking-tight"
        style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
      >
        Reach out.
      </h1>
      <p className="mb-16 max-w-xl text-base leading-relaxed text-muted-foreground">
        No forms you have to fill out just to say hello. Pick whichever of
        these actually fits what you want to say.
      </p>

      <div>
        {channels.map((channel) => (
          <ContactChannel key={channel.id} channel={channel} />
        ))}
      </div>

      <MessageComposer />
    </main>
  );
}
