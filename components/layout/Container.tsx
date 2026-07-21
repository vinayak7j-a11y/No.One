import { cn } from "@/lib/utils/cn";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Consistent horizontal spacing wrapper. `max-w-content` reads from the
 * --max-width design token (app/globals.css) rather than a hardcoded
 * Tailwind size, so the site-wide content width has one source of truth.
 */
export default function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-content px-6 md:px-10 lg:px-16",
        className,
      )}
    >
      {children}
    </div>
  );
}
