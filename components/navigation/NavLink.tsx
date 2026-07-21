"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * A nav-specific link that knows whether it's the active route.
 * Kept separate from Button since nav items need active-state styling
 * that a generic button variant shouldn't have to carry.
 */
export default function NavLink({ href, children, className }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "text-body-sm font-medium transition-colors duration-200",
        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      {children}
    </Link>
  );
}
