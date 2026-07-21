import { createElement, type ElementType } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const headingVariants = cva("font-sans font-semibold text-foreground", {
  variants: {
    size: {
      display: "text-display",
      h1: "text-h1",
      h2: "text-h2",
      h3: "text-h3",
      h4: "text-h4",
      h5: "text-h5",
      h6: "text-h6",
    },
    weight: {
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    size: "h2",
    weight: "semibold",
  },
});

type HeadingElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: HeadingElement;
}

export default function Heading({
  as,
  size = "h2",
  weight,
  className,
  children,
  ...props
}: HeadingProps) {
  const tag: ElementType =
    as ?? (size === "display" ? "h1" : (size as HeadingElement));

  return createElement(
    tag,
    { className: cn(headingVariants({ size, weight }), className), ...props },
    children,
  );
}
