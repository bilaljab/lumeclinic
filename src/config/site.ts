import type { LocalizedText } from "@/data/types";

/**
 * Central brand configuration (PRD §14 / Tech Stack §19). Swapping this file
 * — plus theme.ts and data/*.ts — is what re-skins the template for a new
 * clinic. Never hardcode these values inside a component.
 */
export const siteConfig = {
  brandName: "LUMÉ",
  tagline: {
    en: "Your skin. Reimagined.",
    ar: "بشرتك بمنظور جديد.",
  } satisfies LocalizedText,
  positioning: {
    en: "Skin. Science. Results.",
    ar: "البشرة. العلم. النتائج.",
  } satisfies LocalizedText,
  logo: {
    wordmark: "LUMÉ",
    src: "/logo.svg",
  },
  contact: {
    // Fictional demo numbers — LUMÉ is not a real clinic (see CLAUDE.md).
    whatsappNumber: "966501234567",
    phoneDisplay: "+966 50 123 4567",
    phoneHref: "tel:+966501234567",
    email: "hello@lume-clinic.example",
  },
  location: {
    city: {
      en: "Riyadh",
      ar: "الرياض",
    } satisfies LocalizedText,
    addressLine: {
      en: "Al Olaya District, Riyadh, Saudi Arabia",
      ar: "حي العليا، الرياض، المملكة العربية السعودية",
    } satisfies LocalizedText,
  },
  social: {
    instagram: "https://instagram.com/lume.clinic",
    tiktok: "https://tiktok.com/@lume.clinic",
  },
  finalCta: {
    headline: {
      en: "Ready to Reimagine Your Skin?",
      ar: "هل أنت مستعدة لإعادة تصور بشرتك؟",
    },
    sub: {
      en: "Start with a consultation — no pressure, no package pitch, just a plan.",
      ar: "ابدئي باستشارة، بلا ضغط ولا عرض باقات، مجرد خطة.",
    },
  } satisfies { headline: LocalizedText; sub: LocalizedText },
  fictionalContentDisclaimer: {
    en: "LUMÉ is a fictional brand created for portfolio purposes. Doctors, results, and testimonials shown are not real.",
    ar: "⁦LUMÉ⁩ علامة تجارية افتراضية أُنشئت لأغراض العرض، والأطباء والنتائج والآراء الظاهرة هنا غير حقيقية.",
  } satisfies LocalizedText,
  locales: ["en", "ar"] as const,
  defaultLocale: "en" as const,
} as const;

export type SiteConfig = typeof siteConfig;
