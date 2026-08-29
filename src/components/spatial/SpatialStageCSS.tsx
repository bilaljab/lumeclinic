import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/blurPlaceholder";
import type { SpatialShowcaseItem } from "./types";

type Props = {
  items: SpatialShowcaseItem[];
  activeIndex: number;
  rtl: boolean;
  neighborWindow?: number;
};

/**
 * Mobile/tablet, reduced-motion, and no-WebGL fallback stage for
 * SpatialShowcase. Same active/neighbor math as the WebGL stage, but as
 * plain CSS 3D transforms with a CSS transition — no render loop, idle at
 * rest by construction (nothing re-renders this until activeIndex changes).
 */
export function SpatialStageCSS({ items, activeIndex, rtl, neighborWindow = 1 }: Props) {
  const sign = rtl ? -1 : 1;

  return (
    <div className="absolute inset-0" style={{ perspective: "1200px" }} aria-hidden>
      {items.map((item, i) => {
        const offset = i - activeIndex;
        if (Math.abs(offset) > neighborWindow) return null;

        const isActive = offset === 0;
        const translateX = offset * sign * 62;
        const rotateY = offset * sign * -22;
        const scale = isActive ? 1 : 0.78;
        const opacity = isActive ? 1 : 0.45;

        return (
          <div
            key={item.key}
            className="absolute inset-0 transition-[transform,opacity] duration-500 ease-editorial"
            style={{
              transform: `translateX(${translateX}%) translateZ(${isActive ? 0 : -160}px) rotateY(${rotateY}deg) scale(${scale})`,
              opacity,
              zIndex: isActive ? 2 : 1,
              transformStyle: "preserve-3d",
            }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-xs">
              <Image
                src={item.image.src}
                alt={item.image.alt}
                fill
                sizes="(min-width: 1024px) 45vw, 90vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
