import { getTranslations } from "next-intl/server";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { EditorialLink } from "@/components/ui/Link";
import { Section } from "@/components/ui/Section";
import { BookingIntentCta } from "@/components/booking/BookingIntentCta";
import { SpatialShowcase } from "@/components/spatial/SpatialShowcase";
import { buildWhatsAppLink, doctorWhatsAppMessage } from "@/lib/whatsapp";
import { doctors } from "@/data/doctors";
import { languageLabels } from "@/data/concerns";
import type { LocalizedText } from "@/data/types";
import type { SpatialShowcaseItem } from "@/components/spatial/types";

/**
 * PRD §6.7 — editorial profiles, not CV cards. Doctors.tsx stays a Server
 * Component (translations resolved server-side); the per-doctor overlay JSX
 * is pre-rendered here and handed to the client SpatialShowcase as plain
 * data (SpatialShowcaseItem.overlay), the same way any Server Component
 * hands a Client Component its `children` — functions can't cross that
 * boundary, but already-rendered elements can.
 */
export async function Doctors({ lang }: { lang: keyof LocalizedText }) {
  const t = await getTranslations({ locale: lang, namespace: "doctors" });
  const cta = await getTranslations({ locale: lang, namespace: "cta" });
  const common = await getTranslations({ locale: lang, namespace: "common" });

  const items: SpatialShowcaseItem[] = doctors.map((doctor) => ({
    key: doctor.slug,
    image: { src: doctor.portrait, alt: doctor.name[lang] },
    overlay: (
      <div className="flex flex-col gap-4">
        <p className="text-label uppercase tracking-label text-accent">{doctor.specialty[lang]}</p>
        <h3 className="font-display text-display-m">{doctor.name[lang]}</h3>
        <p className="max-w-md text-body text-ink/80">{doctor.bio[lang]}</p>

        <dl className="mt-2 flex flex-col gap-2 text-label uppercase tracking-label text-neutral">
          <div className="flex gap-2">
            <dt className="shrink-0">{t("experienceLabel", { years: doctor.experienceYears })}</dt>
          </div>
          <div className="flex gap-2">
            <dt className="shrink-0">{t("expertiseLabel")}:</dt>
            <dd>{doctor.expertiseAreas.map((a) => a[lang]).join(" · ")}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="shrink-0">{t("languagesLabel")}:</dt>
            <dd>{doctor.languages.map((l) => languageLabels[l]?.[lang] ?? l).join(" · ")}</dd>
          </div>
        </dl>

        <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-3">
          <BookingIntentCta intent={{ doctorSlug: doctor.slug }} variant="primary">
            {cta("bookWith", { name: doctor.name[lang] })}
          </BookingIntentCta>
          <EditorialLink href={buildWhatsAppLink(lang, doctorWhatsAppMessage(doctor.name))} external>
            {cta("whatsapp")}
          </EditorialLink>
        </div>
      </div>
    ),
  }));

  return (
    <Section id="doctors">
      <Eyebrow>{t("eyebrow")}</Eyebrow>
      <h2 className="mt-3 font-display text-display-l">{t("heading")}</h2>

      <div className="mt-10">
        <SpatialShowcase
          items={items}
          mode="doctor"
          labels={{ previous: common("previous"), next: common("next"), gallery: t("galleryLabel") }}
        />
      </div>
    </Section>
  );
}
