import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Load-bearing punctuation, not decoration — at most one per three sections
 * per LUME_CREATIVE_DIRECTION.md. Don't place one above every heading.
 */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("text-label uppercase text-accent", className)}>{children}</p>;
}
