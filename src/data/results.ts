import type { Result } from "./types";

/**
 * The Before/After scroll-scrubbed peak (Phase 05 signature move,
 * LUME_CREATIVE_DIRECTION.md "Signature move") — kept separate from
 * `results` below so the existing 3-item pointer-drag gallery in
 * `BeforeAfter.tsx` stays untouched, with no repeated pair on the page.
 */
export const peakResult: Result = {
  slug: "renewal-rejuvenation-6-weeks",
  treatmentSlug: "renewal-rejuvenation-therapy",
  doctorSlug: "noor-al-sabhan",
  beforeImage: "/images/results/renewal-rejuvenation-before.jpg",
  afterImage: "/images/results/renewal-rejuvenation-after.jpg",
  sessions: 4,
  timeframe: { en: "6 weeks", ar: "6 أسابيع" },
};

/** Fictional demo content — see siteConfig.fictionalContentDisclaimer. */
export const results: Result[] = [
  {
    slug: "radiant-peel-8-weeks",
    treatmentSlug: "radiant-peel",
    doctorSlug: "layla-al-faisal",
    beforeImage: "/images/results/radiant-peel-before.jpg",
    afterImage: "/images/results/radiant-peel-after.jpg",
    sessions: 3,
    timeframe: { en: "8 weeks", ar: "8 أسابيع" },
  },
  {
    slug: "line-relax-2-weeks",
    treatmentSlug: "line-relax",
    doctorSlug: "noor-al-sabhan",
    beforeImage: "/images/results/line-relax-before.jpg",
    afterImage: "/images/results/line-relax-after.jpg",
    sessions: 1,
    timeframe: { en: "2 weeks", ar: "أسبوعان" },
  },
  {
    slug: "contour-sculpt-12-weeks",
    treatmentSlug: "contour-sculpt",
    doctorSlug: "omar-al-harbi",
    beforeImage: "/images/results/contour-sculpt-before.jpg",
    afterImage: "/images/results/contour-sculpt-after.jpg",
    sessions: 5,
    timeframe: { en: "12 weeks", ar: "12 أسبوعاً" },
  },
];
