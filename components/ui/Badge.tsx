import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-sans font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-card text-foreground border border-border",
        accent: "bg-accent text-accent-foreground",
        success: "bg-success text-success-foreground",
        warning: "bg-warning text-warning-foreground",
        danger: "bg-danger text-danger-foreground",
        outline: "bg-transparent text-foreground border border-border",
      },
      size: {
        sm: "h-5 px-2 text-caption",
        md: "h-6 px-2.5 text-body-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * Small status/label primitive — tags on project cards, note categories,
 * status indicators. Built from the same semantic state tokens
 * (`success`/`warning`/`danger`) added in Design Tokens (P1-T05), so it
 * shares vocabulary with Button's `destructive` variant and any future
 * `components/feedback` work rather than inventing new colors.
 */
export default function Badge({
  variant,
  size,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {children}
    </span>
  );
}
