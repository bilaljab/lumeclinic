import type { LocalizedText } from "./types";

export type BrandStatementBeat = {
  slug: "skin" | "science" | "results";
  label: LocalizedText;
  headline: LocalizedText;
  body: LocalizedText;
};

/** The Skin → Science → Results narrative (PRD §6.3). Static this phase — scroll storytelling is Phase 05. */
export const brandStatementBeats: BrandStatementBeat[] = [
  {
    slug: "skin",
    label: { en: "Skin", ar: "البشرة" },
    headline: { en: "We start with what's there.", ar: "نبدأ بما هو موجود فعلاً." },
    body: {
      en: "Every plan opens with a real reading of your skin — barrier health, texture, pigment behavior — not a menu of treatments.",
      ar: "تبدأ كل خطة بقراءة حقيقية لبشرتك: صحة الحاجز، الملمس، وسلوك الصبغة، لا بقائمة علاجات جاهزة.",
    },
  },
  {
    slug: "science",
    label: { en: "Science", ar: "العلم" },
    headline: { en: "Then the mechanism, explained.", ar: "ثم الآلية، موضّحة بوضوح." },
    body: {
      en: "You'll know what a treatment does before it's done to you — the biology, the timeline, the honest tradeoffs.",
      ar: "ستعرفين ما يفعله العلاج قبل أن يُجرى عليك: البيولوجيا والجدول الزمني والمقايضات الصادقة.",
    },
  },
  {
    slug: "results",
    label: { en: "Results", ar: "النتائج" },
    headline: { en: "Shown, not promised.", ar: "تُعرض، لا تُوعد." },
    body: {
      en: "Progress is measured against your own baseline and shown plainly — including how long it actually takes.",
      ar: "يُقاس التقدم مقارنة بخط أساس بشرتك ويُعرض بوضوح، بما في ذلك المدة التي يستغرقها فعلاً.",
    },
  },
];
