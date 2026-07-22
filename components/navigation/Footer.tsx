import Link from "next/link";
import Container from "@/components/layout/Container";
import Text from "@/components/ui/Text";
import { NAV_ITEMS } from "@/config/site";

/**
 * Site-wide footer, rendered once in app/layout.tsx alongside Navbar.
 * Reuses NAV_ITEMS (config/site.ts) rather than declaring its own link
 * list — same source Navbar and MobileMenu already read from.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <Container>
        <div className="flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
          <Text size="sm" tone="muted">
            © {year} Vinayak Joshi. All rights reserved.
          </Text>

          <nav className="flex flex-wrap items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-body-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </Container>
    </footer>
  );
}
