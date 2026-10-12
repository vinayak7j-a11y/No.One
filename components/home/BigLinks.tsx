import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const LINKS = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/notes", label: "Notes" },
  { href: "/connect", label: "Connect" },
];

/**
 * Oversized links to the inner pages. Hovering or focusing a row tints it with the field's
 * current hue and sends the arrow off toward the corner.
 */
export default function BigLinks() {
  return (
    <ul className="border-t border-border">
      {LINKS.map((link, i) => (
        <li key={link.href} className="border-b border-border">
          <Link
            href={link.href}
            className="group flex items-center justify-between gap-6 py-5 md:py-8"
          >
            <span className="flex items-baseline gap-5 md:gap-8">
              <span className="font-mono text-caption tracking-widest text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className="font-semibold leading-none tracking-tight text-foreground transition-[color,transform] duration-500 ease-out group-hover:translate-x-2 group-hover:text-[var(--field-accent,var(--accent))] group-focus-visible:text-[var(--field-accent,var(--accent))]"
                style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)" }}
              >
                {link.label}
              </span>
            </span>
            <ArrowUpRight
              aria-hidden="true"
              className="h-8 w-8 shrink-0 text-muted-foreground transition-all duration-500 ease-out group-hover:-translate-y-1.5 group-hover:translate-x-1.5 group-hover:text-[var(--field-accent,var(--accent))] md:h-14 md:w-14"
              strokeWidth={1.25}
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
