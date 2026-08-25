import type { Metadata } from "next";
import Link from "next/link";
import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import { getAllNotes } from "@/lib/notes";

export const metadata: Metadata = {
  title: "Notes",
  description: "Vinayak Joshi, things learned.",
};

export default function NotesPage() {
  const notes = getAllNotes();

  return (
    <PageLayout>
      <Section spacing="lg">
        <div className="mx-auto max-w-3xl">
          <Text as="p" size="caption" tone="subtle">
            Notes
          </Text>

          <Heading as="h1" size="h1" className="mt-4">
            Things learned.
          </Heading>

          {notes.length === 0 ? (
            <div className="mt-10 flex flex-col gap-3">
              <Text size="lg" tone="muted">
                Nothing written yet. This is where it lives once there is
                something worth writing down, not before.
              </Text>
              <Text size="caption" tone="subtle">
                In the meantime,{" "}
                <Link
                  href="/projects"
                  className="underline decoration-foreground/20 underline-offset-4 transition-colors hover:decoration-foreground/60"
                >
                  see what is actually being built
                </Link>
                .
              </Text>
            </div>
          ) : (
            <div className="mt-16">
              {notes.map((note) => (
                <Link
                  key={note.slug}
                  href={`/notes/${note.slug}`}
                  className="block border-b border-foreground/[0.06] py-6"
                >
                  <span className="block font-semibold tracking-tight text-foreground">
                    {note.title}
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {note.excerpt}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </Section>
    </PageLayout>
  );
}
