import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/**
 * Central GSAP registration only — never add feature timelines here.
 * Hero's entrance lives in hero/HeroEntrance.tsx; gallery transitions live in
 * spatial/SpatialShowcase.tsx. This file exists so registration happens
 * exactly once, client-side only (GSAP/ScrollTrigger must never run at SSR).
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export { gsap, ScrollTrigger, useGSAP };
