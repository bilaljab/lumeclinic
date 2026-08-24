/** Bilingual copy field — every content string that reaches the UI is one of these. */
export type LocalizedText = {
  en: string;
  ar: string;
};

/** Concerns Treatment Explorer filters by (PRD §6.4). */
export type Concern =
  | "glow"
  | "hydration"
  | "acne"
  | "pigmentation"
  | "fine-lines"
  | "contouring"
  | "rejuvenation";

export type TreatmentCategory = "injectables" | "skin" | "laser" | "body" | "wellness";

export type Treatment = {
  slug: string;
  name: LocalizedText;
  shortDescription: LocalizedText;
  description: LocalizedText;
  category: TreatmentCategory;
  concerns: Concern[];
  image: string;
  durationMinutes: number;
  recovery: LocalizedText;
};

export type Doctor = {
  slug: string;
  name: LocalizedText;
  specialty: LocalizedText;
  experienceYears: number;
  expertiseAreas: LocalizedText[];
  languages: string[];
  bio: LocalizedText;
  portrait: string;
};

export type Package = {
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  includes: LocalizedText[];
  treatmentSlugs: string[];
  image: string;
};

export type Result = {
  slug: string;
  treatmentSlug: string;
  doctorSlug: string;
  beforeImage: string;
  afterImage: string;
  sessions: number;
  timeframe: LocalizedText;
};

export type Testimonial = {
  id: string;
  quote: LocalizedText;
  authorInitial: string;
  treatmentSlug?: string;
};
