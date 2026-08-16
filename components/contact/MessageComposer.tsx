"use client";

import { useId, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function MessageComposer() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const panelId = useId();

  // PLACEHOLDER send behavior: opens a mailto: with the fields prefilled.
  // This is intentionally not a real backend submission, no email
  // service (Resend, Formspree, custom API route, etc.) has been chosen
  // yet. Swap this handler once that decision is made; the UI/state
  // above it doesn't need to change.
  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Message from ${name || "No.One visitor"}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`);
    window.location.href = `mailto:hello@example.com?subject=${subject}&body=${body}`;
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        className="font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors duration-300 hover:text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-foreground/40 rounded-sm"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "collapse" : "or write directly"}
      </button>

      <div
        id={panelId}
        className="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="min-h-0">
          <form onSubmit={handleSend} className="max-w-md space-y-4 pt-8">
            <Input
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div>
              <label
                htmlFor="composer-message"
                className="mb-1 block text-sm text-muted-foreground"
              >
                Message
              </label>
              <textarea
                id="composer-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                className="w-full resize-none rounded-md border border-foreground/10 bg-transparent px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-foreground/30"
              />
            </div>
            <Button type="submit" variant="primary" size="md">
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
