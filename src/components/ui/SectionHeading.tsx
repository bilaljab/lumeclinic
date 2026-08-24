import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "./Eyebrow";

type Size = "xl" | "l" | "m";

const sizeClasses: Record<Size, string> = {
  xl: "text-display-xl",
  l: "text-display-l",
  m: "text-display-m",
};

type Props = {
  children: ReactNode;
  eyebrow?: ReactNode;
  size?: Size;
  align?: "start" | "center" | "end";
  /**
   * A finite tag union, not `ElementType` — a fully generic polymorphic `as`
   * collides with @react-three/fiber's global JSX.IntrinsicElements
   * augmentation (its huge tag union collapses the inferred `children` prop
   * type to `never`). Only heading levels are ever needed here.
   */
  as?: "h1" | "h2" | "h3" | "h4";
  className?: string;
};

/** Editorial headline block — asymmetric alignment is a per-section choice, not a global default. */
export function SectionHeading({
  children,
  eyebrow,
  size = "l",
  align = "start",
  as: Tag = "h2",
  className,
}: Props) {
  return (
    <div className={cn("flex flex-col gap-3", `text-${align}`, className)}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <Tag className={cn("font-display", sizeClasses[size])}>{children}</Tag>
    </div>
  );
}
