import Image, { type ImageProps } from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = ImageProps & {
  caption?: ReactNode;
  wrapperClassName?: string;
};

/** 0-4px radius only, per design.md — never reach for rounded-xl on imagery. */
export function ImageWrapper({ caption, wrapperClassName, className, alt, ...props }: Props) {
  return (
    <figure className={cn("relative overflow-hidden", wrapperClassName)}>
      <Image alt={alt} className={cn("rounded-xs object-cover", className)} {...props} />
      {caption ? (
        <figcaption className="mt-2 text-label uppercase text-neutral">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
