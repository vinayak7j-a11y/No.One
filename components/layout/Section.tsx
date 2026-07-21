import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";
import Container from "@/components/layout/Container";

const sectionVariants = cva("w-full", {
  variants: {
    spacing: {
      sm: "py-16 md:py-20",
      md: "py-24 md:py-32",
      lg: "py-32 md:py-40",
      none: "py-0",
    },
    background: {
      transparent: "bg-transparent",
      card: "bg-card",
    },
  },
  defaultVariants: {
    spacing: "md",
    background: "transparent",
  },
});

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  /** Renders children inside the shared Container. Defaults to true —
   *  set false for sections that need a full-bleed inner layout. */
  container?: boolean;
}

/**
 * The standard vertical-rhythm wrapper for page sections (Hero, About,
 * Projects, etc). Combines consistent y-padding with the shared
 * Container, so pages compose from `<Section>` instead of every section
 * re-declaring its own spacing.
 */
export default function Section({
  spacing,
  background,
  container = true,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(sectionVariants({ spacing, background }), className)}
      {...props}
    >
      {container ? <Container>{children}</Container> : children}
    </section>
  );
}
