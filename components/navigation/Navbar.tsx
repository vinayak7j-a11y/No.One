import Link from "next/link";
import Container from "@/components/layout/Container";
import NavLink from "@/components/navigation/NavLink";
import MobileMenu from "@/components/navigation/MobileMenu";
import { NAV_ITEMS } from "@/config/site";

/**
 * Site-wide navigation header, rendered once in app/layout.tsx.
 * Desktop nav renders inline; MobileMenu owns the collapsed/mobile
 * experience so this component doesn't carry open/close state itself.
 */
export default function Navbar() {
  return (
    <header className="sticky top-0 z-sticky border-b border-border bg-background/80 backdrop-blur relative">
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

          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
