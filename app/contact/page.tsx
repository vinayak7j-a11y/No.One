import ContactChannel, { type Channel } from "@/components/contact/ContactChannel";
import MessageComposer from "@/components/contact/MessageComposer";

const channels: Channel[] = [
  {
    id: "email",
    name: "Email",
    handle: "vinayak00j@gmail.com",
    blurb: "Best for anything that needs a real reply, not a quick reaction.",
    href: "mailto:vinayak00j@gmail.com",
  },
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
