import type { Package } from "./types";

export const packages: Package[] = [
  {
    slug: "the-lume-glow",
    name: { en: "The LUMÉ Glow", ar: "برنامج ⁦LUMÉ⁩ غلو" },
    description: {
      en: "A personalized program for radiance — consultation, analysis, and a treatment arc built around your skin's actual needs.",
      ar: "برنامج مخصص للإشراقة، يشمل الاستشارة وتحليل البشرة ورحلة علاجية مبنية على احتياجات بشرتك الفعلية.",
    },
    includes: [
      { en: "Personalized consultation", ar: "استشارة مخصصة" },
      { en: "Skin analysis", ar: "تحليل البشرة" },
      { en: "3-session treatment arc", ar: "رحلة علاجية من 3 جلسات" },
      { en: "Aftercare program", ar: "برنامج عناية لاحقة" },
    ],
    treatmentSlugs: ["hydraglow-facial", "radiant-peel"],
    image: "/images/packages/the-lume-glow.jpg",
  },
  {
    slug: "the-lume-renewal",
    name: { en: "The LUMÉ Renewal", ar: "برنامج ⁦LUMÉ⁩ رينوال" },
    description: {
      en: "A regenerative program for skin that's lost density or bounce — paced across sessions rather than rushed into one visit.",
      ar: "برنامج تجديدي للبشرة التي فقدت كثافتها أو مرونتها، موزّع على عدة جلسات بدل التسرع في زيارة واحدة.",
    },
    includes: [
      { en: "Personalized consultation", ar: "استشارة مخصصة" },
      { en: "4-session regenerative arc", ar: "رحلة تجديدية من 4 جلسات" },
      { en: "Aftercare program", ar: "برنامج عناية لاحقة" },
    ],
    treatmentSlugs: ["renewal-rejuvenation-therapy", "line-relax"],
    image: "/images/packages/the-lume-renewal.jpg",
  },
  {
    slug: "the-lume-contour",
    name: { en: "The LUMÉ Contour", ar: "برنامج ⁦LUMÉ⁩ كونتور" },
    description: {
      en: "A body-contouring program focused on definition, refining the silhouette you already have.",
      ar: "برنامج نحت جسم يركّز على تحديد القوام، لإبراز جمال قوامك الحالي.",
    },
    includes: [
      { en: "Personalized consultation", ar: "استشارة مخصصة" },
      { en: "5-session contouring arc", ar: "رحلة نحت من 5 جلسات" },
      { en: "Aftercare program", ar: "برنامج عناية لاحقة" },
    ],
    treatmentSlugs: ["contour-sculpt"],
    image: "/images/packages/the-lume-contour.jpg",
  },
];
