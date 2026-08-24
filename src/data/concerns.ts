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
