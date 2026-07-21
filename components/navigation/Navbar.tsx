import Link from "next/link";
import Container from "@/components/layout/Container";
import NavLink from "@/components/navigation/NavLink";

const NAV_ITEMS = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/notes", label: "Notes" },
  { href: "/contact", label: "Contact" },
] as const;

/**
 * Site-wide navigation header, rendered once in app/layout.tsx.
 * Desktop-only for now — MobileMenu.tsx (still a stub) will handle the
 * collapsed nav in a follow-up task rather than being bolted on here.
 */
export default function Navbar() {
  return (
    <header className="sticky top-0 z-sticky border-b border-border bg-background/80 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-body font-semibold text-foreground">
            No.One
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </Container>
    </header>
  );
}
