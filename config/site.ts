export interface NavItem {
  href: string;
  label: string;
}

/**
 * Shared nav items — Navbar (desktop) and MobileMenu (mobile) both read
 * from this single list instead of each declaring their own.
 */
export const NAV_ITEMS: NavItem[] = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/notes", label: "Notes" },
  { href: "/contact", label: "Contact" },
];
