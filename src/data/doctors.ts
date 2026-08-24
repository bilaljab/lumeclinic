import type { Doctor } from "./types";

export const doctors: Doctor[] = [
  {
    slug: "layla-al-faisal",
    name: { en: "Dr. Layla Al-Faisal", ar: "د. ليلى الفيصل" },
    specialty: { en: "Aesthetic Dermatology", ar: "طب الجلدية التجميلي" },
    experienceYears: 12,
    expertiseAreas: [
      { en: "Pigmentation correction", ar: "تصحيح التصبغات" },
      { en: "Skin barrier restoration", ar: "إصلاح حاجز البشرة" },
    ],
    languages: ["Arabic", "English"],
    bio: {
      en: "Layla trained across London and Riyadh before founding LUMÉ's dermatology practice, built on the belief that skin health always precedes skin styling.",
      ar: "تدربت ليلى بين لندن والرياض قبل أن تؤسس قسم الجلدية في ⁦LUMÉ⁩، انطلاقاً من قناعتها بأن صحة البشرة تسبق دائماً تجميلها.",
    },
    portrait: "/images/doctors/layla-al-faisal.jpg",
  },
  {
    slug: "noor-al-sabhan",
    name: { en: "Dr. Noor Al-Sabhan", ar: "د. نور السبهان" },
    specialty: { en: "Facial Rejuvenation", ar: "تجديد شباب الوجه" },
    experienceYears: 9,
    expertiseAreas: [
      { en: "Injectable precision work", ar: "الحقن الدقيقة" },
      { en: "Regenerative therapies", ar: "العلاجات التجديدية" },
    ],
    languages: ["Arabic", "English", "French"],
    bio: {
      en: "Noor's approach favors restraint — micro-adjustments over dramatic change, and a plan built around how a face actually moves.",
      ar: "تعتمد نور نهجاً يفضّل الاعتدال، تعديلات دقيقة بدلاً من التغيير الجذري، وخطة مبنية على حركة الوجه الطبيعية.",
    },
    portrait: "/images/doctors/noor-al-sabhan.jpg",
  },
  {
    slug: "omar-al-harbi",
    name: { en: "Dr. Omar Al-Harbi", ar: "د. عمر الحربي" },
    specialty: { en: "Body Contouring", ar: "نحت الجسم" },
    experienceYears: 14,
    expertiseAreas: [
      { en: "Non-surgical contouring", ar: "نحت غير جراحي" },
      { en: "Post-treatment aftercare design", ar: "تصميم برامج العناية بعد العلاج" },
    ],
    languages: ["Arabic", "English"],
    bio: {
      en: "Omar built LUMÉ's contouring program around one rule: every plan should enhance a client's own proportions, never override them.",
      ar: "بنى عمر برنامج النحت في ⁦LUMÉ⁩ على قاعدة واحدة: كل خطة يجب أن تُبرز تناسق العميل الطبيعي لا أن تتجاوزه.",
    },
    portrait: "/images/doctors/omar-al-harbi.jpg",
  },
];
