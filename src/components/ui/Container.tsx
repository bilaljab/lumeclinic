import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Contained mode for copy-dense sections; full-bleed sections just skip this. */
export function Container({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
} & Omit<ComponentProps<"div">, "children" | "className">) {
  return (
    <div className={cn("mx-auto max-w-contained px-page-x-sm md:px-page-x", className)} {...rest}>
      {children}
    </div>
  );
}
