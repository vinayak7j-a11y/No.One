import Link from "next/link";
import { getAllNotes } from "@/lib/notes";

export default function NotesPage() {
  const notes = getAllNotes();

  return (
    <main className="mx-auto max-w-4xl px-6 pb-32 pt-20 md:pt-28">
      <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        Notes
      </p>
      <h1
        className="mb-8 font-semibold tracking-tight"
        style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
      >
        Things learned.
      </h1>

      {notes.length === 0 ? (
        <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
          Nothing here yet. When there&apos;s something worth writing
          down, it&apos;ll show up here.
        </p>
      ) : (
        <div>
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
    </main>
  );
}
