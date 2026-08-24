import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "whatsapp" | "outline-light";

/**
 * Hover/press feedback (apple-design skill): scale is the only motion added —
 * transform is compositor-friendly and reads as premium restraint rather than
 * a shadow/glow effect. Press (active) must read as an instant response, not
 * a slow ease, so it gets its own faster transition-duration than the hover
 * scale/color change. `prefers-reduced-motion` is handled globally
 * (globals.css zeroes all transition-durations under that query), so no
 * extra guard is needed here.
 */
const base =
  "inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 text-label uppercase scale-100 transition-[color,background-color,border-color,transform] duration-200 ease-editorial hover:scale-[1.02] active:scale-[0.97] active:duration-100 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-canvas hover:bg-accent-hover",
  secondary: "border border-ink text-ink hover:border-accent hover:text-accent",
  whatsapp: "border border-border text-ink hover:border-accent hover:text-accent",
  /** For CTAs placed over dark/full-bleed grounds (hero, final CTA) — secondary can't use ink borders there. */
  "outline-light": "border border-canvas/50 text-canvas hover:border-canvas hover:bg-canvas hover:text-ink",
};

type CommonProps = {
  variant?: Variant;
  className?: string;
  children: ReactNode;
};

type LinkVariant = CommonProps & {
  href: string;
  external?: boolean;
} & Omit<ComponentProps<"a">, "href" | "className" | "children">;

type ButtonVariant = CommonProps & {
  href?: undefined;
} & Omit<ComponentProps<"button">, "className" | "children">;

export type ButtonProps = LinkVariant | ButtonVariant;

export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  const classes = cn(base, variants[variant], className);

  if (props.href) {
    const { href, external, ...rest } = props;
    if (external) {
      return (
        <a href={href} target="_blank" rel="noreferrer" className={classes} {...rest}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  // `props.href` was falsy above (LinkVariant already returned), so this is ButtonVariant —
  // TS can't narrow the union on an optional-string-vs-undefined discriminant via truthiness.
  const buttonProps = props as ButtonVariant;
  return (
    <button type={buttonProps.type ?? "button"} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
