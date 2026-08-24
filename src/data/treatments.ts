import type { Treatment } from "./types";

export const treatments: Treatment[] = [
  {
    slug: "hydraglow-facial",
    name: { en: "HydraGlow Facial", ar: "فيشل هيدرا-غلو" },
    shortDescription: {
      en: "Deep hydration and a luminous, lit-from-within finish.",
      ar: "ترطيب عميق وإشراقة تنبع من الداخل.",
    },
    description: {
      en: "A layered hydration protocol combining gentle exfoliation, nutrient infusion, and barrier repair — engineered for the glow that reads in daylight, not just under studio light.",
      ar: "بروتوكول ترطيب متعدد الطبقات يجمع بين التقشير اللطيف وضخ العناصر الغذائية وإصلاح حاجز البشرة، لإشراقة تظهر في ضوء النهار لا تحت أضواء الاستوديو فقط.",
    },
    category: "skin",
    concerns: ["glow", "hydration"],
    image: "/images/treatments/hydraglow-facial.jpg",
    durationMinutes: 60,
    recovery: { en: "No downtime", ar: "دون فترة تعافٍ" },
  },
  {
    slug: "radiant-peel",
    name: { en: "Radiant Peel", ar: "تقشير راديانت" },
    shortDescription: {
      en: "A calibrated chemical peel that resurfaces tone and texture.",
      ar: "تقشير كيميائي مدروس يعيد توحيد لون البشرة وملمسها.",
    },
    description: {
      en: "A precisely dosed peel series that lifts dullness and evens tone in stages, so results build gradually rather than announcing themselves overnight.",
      ar: "سلسلة تقشير بجرعات دقيقة تزيل الباهتان وتوحّد لون البشرة تدريجياً، فتظهر النتائج بثبات لا بشكل مفاجئ.",
    },
    category: "skin",
    concerns: ["pigmentation", "glow"],
    image: "/images/treatments/radiant-peel.jpg",
    durationMinutes: 45,
    recovery: { en: "1-2 days mild flaking", ar: "تقشّر خفيف ليوم إلى يومين" },
  },
  {
    slug: "clarity-acne-protocol",
    name: { en: "Clarity Acne Protocol", ar: "بروتوكول كلاريتي لحب الشباب" },
    shortDescription: {
      en: "A structured protocol for active breakouts and post-acne marks.",
      ar: "بروتوكول منظم لحب الشباب النشط وآثاره.",
    },
    description: {
      en: "Combines targeted extraction, LED modulation, and a home-care plan built around your skin's actual triggers rather than a generic routine.",
      ar: "يجمع بين التنظيف الموجّه وتقنية ⁦LED⁩ وخطة عناية منزلية مبنية على المسببات الفعلية لبشرتك بدلاً من روتين عام.",
    },
    category: "skin",
    concerns: ["acne"],
    image: "/images/treatments/clarity-acne-protocol.jpg",
    durationMinutes: 50,
    recovery: { en: "No downtime", ar: "دون فترة تعافٍ" },
  },
  {
    slug: "luminous-pigmentation-correction",
    name: { en: "Luminous Pigmentation Correction", ar: "تصحيح التصبغات لومينوس" },
    shortDescription: {
      en: "Laser-led correction for sun spots and uneven pigmentation.",
      ar: "تصحيح بالليزر للبقع الشمسية وتفاوت لون البشرة.",
    },
    description: {
      en: "A precise, low-downtime laser series that breaks up pigment clusters gradually, respecting deeper skin tones throughout.",
      ar: "سلسلة ليزر دقيقة بفترة تعافٍ قصيرة تفتت تجمعات الصبغة تدريجياً، مع مراعاة درجات البشرة الداكنة طوال الرحلة.",
    },
    category: "laser",
    concerns: ["pigmentation"],
    image: "/images/treatments/luminous-pigmentation-correction.jpg",
    durationMinutes: 30,
    recovery: { en: "2-3 days mild redness", ar: "احمرار خفيف ليومين إلى ثلاثة" },
  },
  {
    slug: "contour-sculpt",
    name: { en: "Contour Sculpt", ar: "نحت كونتور" },
    shortDescription: {
      en: "Non-surgical body contouring for definition, not drastic change.",
      ar: "نحت جسم غير جراحي لتحديد القوام لا لتغييره الجذري.",
    },
    description: {
      en: "A body-contouring series aimed at refining silhouette lines — designed to enhance what's already there, not manufacture a different body.",
      ar: "سلسلة نحت جسم تهدف لتحسين خطوط القوام، مصممة لإبراز ما هو موجود لا لصنع جسم مختلف.",
    },
    category: "body",
    concerns: ["contouring"],
    image: "/images/treatments/contour-sculpt.jpg",
    durationMinutes: 75,
    recovery: { en: "No downtime", ar: "دون فترة تعافٍ" },
  },
  {
    slug: "line-relax",
    name: { en: "Line Relax", ar: "لاين ريلاكس" },
    shortDescription: {
      en: "Precision injectables for expression lines, kept natural.",
      ar: "حقن دقيقة لخطوط التعبير مع نتيجة طبيعية.",
    },
    description: {
      en: "Micro-dosed injectable treatment that softens expression lines while keeping full movement — the goal is rested, not frozen.",
      ar: "علاج حقن بجرعات مجهرية يخفف خطوط التعبير مع الحفاظ على حركة الوجه الكاملة، فالهدف مظهر مرتاح لا مجمّد.",
    },
    category: "injectables",
    concerns: ["fine-lines"],
    image: "/images/treatments/line-relax.jpg",
    durationMinutes: 30,
    recovery: { en: "No downtime", ar: "دون فترة تعافٍ" },
  },
  {
    slug: "renewal-rejuvenation-therapy",
    name: { en: "Renewal Rejuvenation Therapy", ar: "علاج التجديد رينوال" },
    shortDescription: {
      en: "A regenerative therapy that restores density and bounce.",
      ar: "علاج تجديدي يستعيد كثافة البشرة ومرونتها.",
    },
    description: {
      en: "Combines micro-needling with a regenerative serum infusion to rebuild collagen density over a guided multi-session arc.",
      ar: "يجمع بين الإبر الدقيقة وضخ سيروم تجديدي لإعادة بناء كثافة الكولاجين عبر رحلة جلسات موجهة.",
    },
    category: "wellness",
    concerns: ["rejuvenation"],
    image: "/images/treatments/renewal-rejuvenation-therapy.jpg",
    durationMinutes: 60,
    recovery: { en: "1 day mild redness", ar: "احمرار خفيف ليوم واحد" },
  },
];
