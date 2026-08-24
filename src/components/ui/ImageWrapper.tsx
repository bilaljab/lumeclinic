import Image, { type ImageProps } from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = ImageProps & {
  caption?: ReactNode;
  wrapperClassName?: string;
  /**
   * ScrollCraft's pointer-tilt device (degrees) — the site's one shared depth
   * primitive for card imagery (Explorer/Featured/Doctors/Packages), instead
   * of a bespoke 3D treatment per section. Self-gates to (hover:hover) +
   * (pointer:fine) and is inert under reduced motion — nothing to guard here.
   */
  tilt?: number;
};

/** 0-4px radius only, per design.md — never reach for rounded-xl on imagery. */
export function ImageWrapper({ caption, wrapperClassName, className, alt, tilt, ...props }: Props) {
  return (
    <figure
      className={cn("relative overflow-hidden", wrapperClassName)}
      data-sc-tilt={tilt}
      style={tilt ? { transformStyle: "preserve-3d" } : undefined}
    >
      <Image alt={alt} className={cn("rounded-xs object-cover", className)} {...props} />
      {caption ? (
        <figcaption className="mt-2 text-label uppercase text-neutral">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
