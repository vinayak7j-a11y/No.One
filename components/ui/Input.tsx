import { type InputHTMLAttributes, forwardRef, useId } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const inputVariants = cva(
  "w-full rounded-md border bg-card px-3.5 text-body text-foreground placeholder:text-muted-foreground transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      state: {
        default: "border-border focus-visible:ring-ring",
        error: "border-danger focus-visible:ring-danger",
      },
      size: {
        sm: "h-9 text-body-sm",
        md: "h-11",
        lg: "h-12 text-body-lg",
      },
    },
    defaultVariants: {
      state: "default",
      size: "md",
    },
  },
);

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  /** Visible label rendered above the field. */
  label?: string;
  /** Error message; also switches the field into the `error` visual state. */
  error?: string;
  /** Helper text shown below the field when there's no error. */
  helperText?: string;
}

/**
 * The site-wide text input primitive — built for the future Contact form
 * (P2-T05+) but generic enough for any labeled field. Composes `label`,
 * the field itself, and `error`/`helperText` into one unit so forms don't
 * have to hand-wire `aria-describedby`/`aria-invalid` themselves.
 *
 * `state` is normally driven by passing `error`, not set directly, though
 * it's exposed via `VariantProps` for cases (e.g. live validation on
 * blur) where a caller wants to control the visual state without a
 * message present yet.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, state, size, label, error, helperText, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const messageId = error || helperText ? `${inputId}-message` : undefined;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-body-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(inputVariants({ state: error ? "error" : state, size }), className)}
          aria-invalid={error ? true : undefined}
          aria-describedby={messageId}
          {...props}
        />
        {(error || helperText) && (
          <p
            id={messageId}
            className={cn("text-caption", error ? "text-danger" : "text-muted-foreground")}
          >
            {error ?? helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
