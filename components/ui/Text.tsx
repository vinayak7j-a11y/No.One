import { createElement, type ElementType } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const textVariants = cva("font-sans", {
  variants: {
    size: {
      lg: "text-body-lg",
      base: "text-body",
      sm: "text-body-sm",
      caption: "text-caption uppercase",
    },
    tone: {
      default: "text-foreground",
      muted: "text-muted",
      subtle: "text-muted-foreground",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
    },
  },
  defaultVariants: {
    size: "base",
    tone: "default",
    weight: "normal",
  },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof textVariants> {
  as?: ElementType;
}

export default function Text({
  as = "p",
  size,
  tone,
  weight,
  className,
  children,
  ...props
}: TextProps) {
  return createElement(
    as,
    { className: cn(textVariants({ size, tone, weight }), className), ...props },
    children,
  );
}
