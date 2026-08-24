import { getTranslations } from "next-intl/server";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { EditorialLink } from "@/components/ui/Link";
import { Section } from "@/components/ui/Section";
import { ImageWrapper } from "@/components/ui/ImageWrapper";
import { BookingIntentCta } from "@/components/booking/BookingIntentCta";
import { buildWhatsAppLink, doctorWhatsAppMessage } from "@/lib/whatsapp";
import { doctors } from "@/data/doctors";
import { languageLabels } from "@/data/concerns";
import type { LocalizedText } from "@/data/types";

/** PRD §6.7 — editorial profiles, not CV cards. Portrait-led, asymmetric, alternating anchor per doctor. */
export async function Doctors({ lang }: { lang: keyof LocalizedText }) {
  const t = await getTranslations({ locale: lang, namespace: "doctors" });
  const cta = await getTranslations({ locale: lang, namespace: "cta" });

  return (
    <Section id="doctors">
      <Eyebrow>{t("eyebrow")}</Eyebrow>
      <h2 className="mt-3 font-display text-display-l">{t("heading")}</h2>

      <div className="mt-10 flex flex-col gap-14">
        {doctors.map((doctor, i) => {
          const reversed = i % 2 === 1;
          return (
            <article
              key={doctor.slug}
              className="grid gap-8 md:grid-cols-12 md:items-end"
              data-sc-in
              data-sc-stagger="90"
            >
              <div className={reversed ? "md:col-span-5 md:col-start-8" : "md:col-span-5"}>
                <ImageWrapper
                  src={doctor.portrait}
                  alt={doctor.name[lang]}
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  wrapperClassName="aspect-square"
                  tilt={5}
                />
              </div>

              <div
                className={
                  reversed
                    ? "flex flex-col gap-4 md:col-span-6 md:col-start-1 md:row-start-1"
                    : "flex flex-col gap-4 md:col-span-6 md:col-start-7"
                }
              >
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
                  <EditorialLink
                    href={buildWhatsAppLink(lang, doctorWhatsAppMessage(doctor.name))}
                    external
                  >
                    {cta("whatsapp")}
                  </EditorialLink>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
