import type { Concern, LocalizedText, TreatmentCategory } from "./types";

/** Treatment Explorer filter labels (PRD §6.4) — concern-first, not medical terminology. */
export const concernLabels: Record<Concern, LocalizedText> = {
  glow: { en: "Glow", ar: "الإشراقة" },
  hydration: { en: "Hydration", ar: "الترطيب" },
  acne: { en: "Acne", ar: "حب الشباب" },
  pigmentation: { en: "Pigmentation", ar: "التصبغات" },
  "fine-lines": { en: "Fine Lines", ar: "خطوط التعبير" },
  contouring: { en: "Contouring", ar: "النحت" },
  rejuvenation: { en: "Rejuvenation", ar: "التجديد" },
};

export const concernOrder: Concern[] = [
  "glow",
  "hydration",
  "acne",
  "pigmentation",
  "fine-lines",
  "contouring",
  "rejuvenation",
];

/**
 * Choice architecture (post-audit P1): the Explorer's 7 individual concern
 * chips plus "All" exceeded the ~4-chunk working-memory guideline. Grouping
 * into 4 meaningful clusters (+ All) keeps every concern reachable — nothing
 * removed — while cutting the number of decisions a visitor scans at once.
 */
export type ConcernGroup = "glow-hydration" | "clarity" | "renewal" | "contouring";

export const concernGroups: Record<ConcernGroup, Concern[]> = {
  "glow-hydration": ["glow", "hydration"],
  clarity: ["acne", "pigmentation"],
  renewal: ["fine-lines", "rejuvenation"],
  contouring: ["contouring"],
};

export const concernGroupLabels: Record<ConcernGroup, LocalizedText> = {
  "glow-hydration": { en: "Glow & Hydration", ar: "الإشراقة والترطيب" },
  clarity: { en: "Clarity", ar: "النقاء" },
  renewal: { en: "Renewal", ar: "التجديد" },
  contouring: { en: "Contouring", ar: "النحت" },
};

export const concernGroupOrder: ConcernGroup[] = ["glow-hydration", "clarity", "renewal", "contouring"];

/** Featured Treatments' image caption (raw category slug rendered untranslated on /ar — Phase 05 known issue). */
export const categoryLabels: Record<TreatmentCategory, LocalizedText> = {
  skin: { en: "Skin", ar: "البشرة" },
  laser: { en: "Laser", ar: "الليزر" },
  body: { en: "Body", ar: "الجسم" },
  injectables: { en: "Injectables", ar: "الحقن" },
  wellness: { en: "Wellness", ar: "العافية" },
};

/** Doctors' spoken-language list (Doctor.languages is plain English strings) — untranslated on /ar without this. */
export const languageLabels: Record<string, LocalizedText> = {
  Arabic: { en: "Arabic", ar: "العربية" },
  English: { en: "English", ar: "الإنجليزية" },
  French: { en: "French", ar: "الفرنسية" },
};
