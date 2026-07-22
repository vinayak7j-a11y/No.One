import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const cardVariants = cva("rounded-lg border border-border bg-card", {
  variants: {
    padding: {
      none: "p-0",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    },
    hover: {
      true: "transition-colors duration-200 hover:border-muted-foreground",
      false: "",
    },
  },
  defaultVariants: {
    padding: "md",
    hover: false,
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

/**
 * The site-wide surface primitive — project cards, note previews, form
 * groupings, and anything else that needs to read as a distinct block
 * on the pure-black background. Uses the shadow scale from Design
 * Tokens (P1-T05) only via the `shadow-*` utilities directly on
 * instances that need elevation; the base card relies on the border +
 * `--card` fill (P1-T05's ADR-007 reasoning: on #000, a border reads
 * more reliably than a shadow at rest).
 */
export default function Card({
  padding,
  hover,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div className={cn(cardVariants({ padding, hover }), className)} {...props}>
      {children}
    </div>
  );
}
