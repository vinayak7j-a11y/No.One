import { cn } from "@/lib/utils/cn";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Top-level structural wrapper every page renders into. `flex-1` fills
 * whatever space is left between Navbar and Footer (both siblings in
 * app/layout.tsx, which owns the actual `min-h-screen flex-col`) —
 * this no longer claims its own min-h-screen, since that would ignore
 * Navbar/Footer height and push the page taller than one viewport.
 */
export default function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <main className={cn("flex w-full flex-1 flex-col", className)}>
      {children}
    </main>
  );
}
