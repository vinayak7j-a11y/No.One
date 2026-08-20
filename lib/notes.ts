import fs from "fs";
import path from "path";
import matter from "gray-matter";

const NOTES_DIR = path.join(process.cwd(), "content", "notes");

export interface NoteFrontmatter {
  title: string;
  date: string; // ISO 8601, e.g. "2026-08-17"
  excerpt: string;
}

export interface NoteSummary extends NoteFrontmatter {
  slug: string;
}

export interface Note extends NoteSummary {
  content: string; // raw MDX body, compiled by the caller
}

/**
 * Returns every note's frontmatter + slug, sorted newest first.
 * Reads content/notes/*.mdx directly, no build-time content plugin
 * (contentlayer/velite) - simple enough at this scale, and avoids an
 * extra dependency + build step for a folder that's currently empty.
 * Revisit if this ever needs incremental build performance at scale.
 */
export function getAllNotes(): NoteSummary[] {
  if (!fs.existsSync(NOTES_DIR)) {
    return [];
  }

  const files = fs.readdirSync(NOTES_DIR).filter((f) => f.endsWith(".mdx"));

  const notes = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(NOTES_DIR, filename), "utf8");
    const { data } = matter(raw);
    return {
      slug,
      title: data.title as string,
      date: data.date as string,
      excerpt: data.excerpt as string,
    };
  });

  return notes.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Returns a single note's frontmatter + raw MDX body by slug, or null
 * if it doesn't exist. The caller is responsible for compiling
 * `content` (via next-mdx-remote/rsc's <MDXRemote>) - this function
 * only reads and parses, keeping file-system access out of the page
 * component itself.
 */
export function getNoteBySlug(slug: string): Note | null {
  const filePath = path.join(NOTES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    excerpt: data.excerpt as string,
    content,
  };
}
