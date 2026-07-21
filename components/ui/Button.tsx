import { type ButtonHTMLAttributes, forwardRef } from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-sans font-medium transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        primary: "bg-foreground text-background hover:opacity-90",
        secondary: "bg-card text-foreground border border-border hover:bg-border/40",
        outline: "border border-border text-foreground bg-transparent hover:bg-card",
        ghost: "text-foreground bg-transparent hover:bg-card",
        destructive: "bg-danger text-danger-foreground hover:opacity-90",
      },
      size: {
        sm: "h-9 px-3 text-body-sm",
        md: "h-11 px-5 text-body",
        lg: "h-12 px-6 text-body-lg",
        icon: "h-11 w-11 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

interface BaseButtonProps extends VariantProps<typeof buttonVariants> {
  className?: string;
  children: React.ReactNode;
}

interface ButtonAsButton
  extends BaseButtonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color" | "children"> {
  /** Omit `href` to render a native <button>. */
  href?: undefined;
}

interface ButtonAsLink extends BaseButtonProps {
  /** Provide `href` to render Next's <Link> instead of a <button>. */
  href: string;
  target?: string;
  rel?: string;
}

export type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * The site-wide button primitive. Renders a native <button> by default;
 * pass `href` to render a Next.js <Link> with the same visual variants,
 * so CTAs and nav actions never need a second component.
 */
const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size }), className);

    if ("href" in props && props.href !== undefined) {
      const { href, target, rel } = props;
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={rel}
          className={classes}
        >
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
