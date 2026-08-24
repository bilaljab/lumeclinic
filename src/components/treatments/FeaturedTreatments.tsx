import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { ImageWrapper } from "@/components/ui/ImageWrapper";
import { EditorialLink } from "@/components/ui/Link";
import { BookingIntentCta } from "@/components/booking/BookingIntentCta";
import { buildWhatsAppLink, treatmentWhatsAppMessage } from "@/lib/whatsapp";
import { treatments } from "@/data/treatments";
import { featuredTreatmentSlugs } from "@/data/featured";
import type { LocalizedText } from "@/data/types";

/**
 * PRD §6.5 — curated, editorial, distinct from the Explorer grid above it
 * (post-audit P1: the two sections used to render the same 7 treatments in
 * the same card shape). Three signature treatments, full description copy
 * instead of the Explorer's short blurb, and the engine's horizontal `pan`
 * act (unused elsewhere on the page) instead of a plain overflow-x rail —
 * a real device difference, not just fewer cards.
 */
export async function FeaturedTreatments({ lang }: { lang: keyof LocalizedText }) {
  const t = await getTranslations({ locale: lang, namespace: "featured" });
  const cta = await getTranslations({ locale: lang, namespace: "cta" });
  const common = await getTranslations({ locale: lang, namespace: "common" });

  const featured = featuredTreatmentSlugs
    .map((slug) => treatments.find((tr) => tr.slug === slug))
    .filter((tr): tr is (typeof treatments)[number] => Boolean(tr));

  return (
    <Section id="featured" bleed data-sc-act="pan" data-sc-span="1.8" data-sc-mobile-flow className="bg-canvas">
      <div data-sc-stage className="flex flex-col justify-center gap-10">
        <Container>
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h2 className="mt-3 font-display text-display-l">{t("heading")}</h2>
        </Container>

        <div
          className="rail flex gap-10 overflow-x-auto ps-page-x-sm pe-page-x-sm md:ps-page-x md:pe-page-x"
          data-sc-pan="0.6"
        >
          {featured.map((treatment, i) => (
            <article key={treatment.slug} className="flex w-[85vw] shrink-0 flex-col gap-5 sm:w-[420px]">
              <ImageWrapper
                src={treatment.image}
                alt={treatment.name[lang]}
                fill
                sizes="420px"
                wrapperClassName="aspect-[4/5]"
                caption={`0${i + 1} / 0${featured.length}`}
                tilt={7}
              />
              <div>
                <h3 className="font-display text-display-m">{treatment.name[lang]}</h3>
                <p className="mt-3 max-w-md text-body text-ink/80">{treatment.description[lang]}</p>
                <p className="mt-3 text-label uppercase tracking-label text-neutral">
                  {common("minutesLabel", { count: treatment.durationMinutes })} · {treatment.recovery[lang]}
                </p>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-3">
                <BookingIntentCta intent={{ treatmentSlug: treatment.slug }} variant="primary">
                  {cta("bookTreatment")}
                </BookingIntentCta>
                <EditorialLink
                  href={buildWhatsAppLink(lang, treatmentWhatsAppMessage(treatment.name))}
                  external
                >
                  {cta("viewDetails")}
                </EditorialLink>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
