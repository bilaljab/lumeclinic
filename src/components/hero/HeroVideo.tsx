"use client";

import { useMediaQuery } from "@/lib/useMediaQuery";

/**
 * Desktop-only: the 3.5MB autoplay loop is real weight on a cellular
 * connection for no visual gain on a phone-sized frame, and the hero
 * <Image> underneath already covers mobile (and the reduced-motion
 * fallback) on its own. Same (min-width: 1024px) desktop threshold
 * SpatialShowcase already uses for its own heavy-media gate.
 */
export function HeroVideo() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  if (!isDesktop) return null;

  return (
    <video
      aria-hidden
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster="/images/hero/hero-main-v3.jpg"
      className="absolute inset-0 hidden h-full w-full object-cover motion-safe:block"
      style={{ objectPosition: "50% 17%" }}
    >
      <source src="/videos/hero-loop.mp4" type="video/mp4" />
    </video>
  );
}
