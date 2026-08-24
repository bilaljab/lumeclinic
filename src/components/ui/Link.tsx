import type { ComponentProps, ReactNode } from "react";
import { Link as IntlLink } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

/** Text link, so no scale (apple-design skill: scaling inline text reflows
 * neighboring words and reads as broken, not premium) — the press feedback
 * is a colour step further than hover instead, on its own faster transition. */
const base =
  "underline underline-offset-4 decoration-border decoration-1 transition-colors duration-200 ease-editorial hover:decoration-accent hover:text-accent active:text-accent-hover active:duration-100 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2";

type Props = {
  href: string;
  external?: boolean;
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<"a">, "href" | "className" | "children">;

export function EditorialLink({ href, external, className, children, ...rest }: Props) {
  const classes = cn(base, className);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <IntlLink href={href} className={classes} {...rest}>
      {children}
    </IntlLink>
  );
}
