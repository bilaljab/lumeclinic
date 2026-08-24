import type { ComponentProps, ReactNode } from "react";
import { Link as IntlLink } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

const base =
  "underline underline-offset-4 decoration-border decoration-1 transition-colors duration-200 ease-out hover:decoration-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2";

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
