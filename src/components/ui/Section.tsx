import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "./Container";

type Props = {
  children: ReactNode;
  className?: string;
  id?: string;
  /** Full-bleed sections (scrub/hero/gallery) skip the contained max-width. */
  bleed?: boolean;
} & Omit<ComponentProps<"section">, "children" | "className" | "id">;

/** Section wrapper carrying the page's vertical rhythm — never hardcode py-* on a section directly. */
export function Section({ children, className, id, bleed = false, ...rest }: Props) {
  return (
    <section id={id} className={cn("py-section-y-sm md:py-section-y", className)} {...rest}>
      {bleed ? children : <Container>{children}</Container>}
    </section>
  );
}
