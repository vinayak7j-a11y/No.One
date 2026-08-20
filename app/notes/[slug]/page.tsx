import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
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
    <main className="mx-auto max-w-2xl px-6 pb-32 pt-20 md:pt-28">
      <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {new Date(note.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      <h1
        className="mb-10 font-semibold tracking-tight"
        style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
      >
        {note.title}
      </h1>
      <div className="prose-notes text-body leading-relaxed text-foreground">
        <MDXRemote source={note.content} />
      </div>
    </main>
  );
}
