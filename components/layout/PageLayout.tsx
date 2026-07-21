import { cn } from "@/lib/utils/cn";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Top-level structural wrapper every page renders into. Keeps the page
 * shell (min-height, flex column for header/content/footer once those
 * exist) in one place instead of each page re-declaring `<main>` rules.
 */
export default function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <main className={cn("flex min-h-screen w-full flex-col", className)}>
      {children}
    </main>
  );
}
