import type { LocalizedText } from "./types";

export type JourneyStep = {
  number: string;
  title: LocalizedText;
  description: LocalizedText;
};

/** PRD §6.8 — the one section that legitimately earns numbered markers (a real process, not a list). */
export const journeySteps: JourneyStep[] = [
  {
    number: "01",
    title: { en: "Consultation", ar: "الاستشارة" },
    description: {
      en: "An unhurried conversation about your skin, your history, and what you actually want to change.",
      ar: "محادثة هادئة عن بشرتك وتاريخها وما تريدين تغييره فعلاً.",
    },
  },
  {
    number: "02",
    title: { en: "Personalized Plan", ar: "الخطة المخصصة" },
    description: {
      en: "Your doctor maps a treatment arc against your skin analysis — never a generic package.",
      ar: "يضع طبيبك خطة علاجية مبنية على تحليل بشرتك، لا باقة عامة جاهزة.",
    },
  },
  {
    number: "03",
    title: { en: "Treatment", ar: "العلاج" },
    description: {
      en: "Sessions run at a pace your skin can actually absorb, with results tracked between visits.",
      ar: "تُجرى الجلسات بوتيرة تستطيع بشرتك استيعابها، مع متابعة النتائج بين الزيارات.",
    },
  },
  {
    number: "04",
    title: { en: "Aftercare", ar: "العناية اللاحقة" },
    description: {
      en: "A home-care plan and check-ins that protect the result, not just the appointment.",
      ar: "خطة عناية منزلية ومتابعات تحافظ على النتيجة لا على الموعد فقط.",
    },
  },
  {
    number: "05",
    title: { en: "Results", ar: "النتائج" },
    description: {
      en: "Progress reviewed against your original analysis — honestly, including what to expect next.",
      ar: "تُراجع النتائج مقارنة بتحليلك الأول بصدق، بما في ذلك ما يمكن توقعه لاحقاً.",
    },
  },
];
