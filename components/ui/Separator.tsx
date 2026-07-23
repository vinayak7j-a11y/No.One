import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const separatorVariants = cva("shrink-0 bg-border", {
  variants: {
    orientation: {
      horizontal: "h-px w-full",
      vertical: "h-full w-px",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

export interface SeparatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof separatorVariants> {}

/**
 * Visual divider primitive — between Card sections, form groups, footer
 * columns, or nav items laid out horizontally. Purely presentational
 * (`role="none"`, `aria-hidden`); wrap in a semantic element separately
 * if a divider needs to carry meaning (e.g. an `<hr>` in prose content).
 */
export default function Separator({
  orientation,
  className,
  ...props
}: SeparatorProps) {
  return (
    <div
      role="none"
      className={cn(separatorVariants({ orientation }), className)}
      {...props}
    />
  );
}
