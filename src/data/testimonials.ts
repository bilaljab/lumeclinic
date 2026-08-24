import type { Testimonial } from "./types";

/** Fictional demo content — see siteConfig.fictionalContentDisclaimer. */
export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote: {
      en: "They explained the science before touching my skin. That's what made me trust the result.",
      ar: "شرحوا لي العلم قبل أن يلمسوا بشرتي، وهذا ما جعلني أثق بالنتيجة.",
    },
    authorInitial: "R.",
    treatmentSlug: "radiant-peel",
  },
  {
    id: "t2",
    quote: {
      en: "Still looks like my face — just rested. Exactly what I asked for.",
      ar: "ما زال وجهي كما هو، لكنه بدا مرتاحاً. هذا بالضبط ما طلبته.",
    },
    authorInitial: "N.",
    treatmentSlug: "line-relax",
  },
  {
    id: "t3",
    quote: {
      en: "The consultation alone felt more thorough than most full appointments elsewhere.",
      ar: "الاستشارة وحدها كانت أدق من مواعيد كاملة في أماكن أخرى.",
    },
    authorInitial: "H.",
  },
  {
    id: "t4",
    quote: {
      en: "A paced program, not a sales pitch. I never felt rushed into a package.",
      ar: "برنامج متدرج لا عرض بيع، لم أشعر يوماً بأنني مضغوطة لشراء باقة.",
    },
    authorInitial: "S.",
    treatmentSlug: "renewal-rejuvenation-therapy",
  },
];
