import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import { getAllNotes, getNoteBySlug } from "@/lib/notes";

interface NotePageProps {
  params: Promise<{ slug: string }>;
}

// Pre-renders a static page per note at build time. Adding a new
// content/notes/*.mdx file automatically produces a new route here,
// no code changes needed - matches PROJECT_GRAPH.md's Phase 5 success
// criteria ("new content can be published without modifying
// application code").
export function generateStaticParams() {
  return getAllNotes().map((note) => ({ slug: note.slug }));
}

export default async function NotePage({ params }: NotePageProps) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);

  if (!note) {
    notFound();
  }

  return (
    <PageLayout>
      <Section spacing="lg">
        <div className="mx-auto max-w-3xl">
          <Text as="p" size="caption" tone="subtle">
            {new Date(note.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>

          <Heading as="h1" size="h1" className="mt-4">
            {note.title}
          </Heading>

          <div className="prose-notes mt-10 text-body leading-relaxed text-foreground">
            <MDXRemote source={note.content} />
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
