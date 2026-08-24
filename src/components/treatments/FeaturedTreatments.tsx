import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { ImageWrapper } from "@/components/ui/ImageWrapper";
import { treatments } from "@/data/treatments";
import { categoryLabels } from "@/data/concerns";
import type { LocalizedText } from "@/data/types";

/**
 * PRD §6.5 — curated visual rail, not dense medical info. Full-bleed with a
 * native horizontal scroll-snap; becomes the mobile pan-rail for free
 * (creative-direction "Mobile composition").
 */
export async function FeaturedTreatments({ lang }: { lang: keyof LocalizedText }) {
  const t = await getTranslations({ locale: lang, namespace: "featured" });
  const common = await getTranslations({ locale: lang, namespace: "common" });

  return (
    <Section id="featured" bleed>
      <Container>
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h2 className="mt-3 font-display text-display-l">{t("heading")}</h2>
      </Container>

      <div
        className="rail mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto ps-page-x-sm pe-page-x-sm md:ps-page-x md:pe-page-x"
        data-sc-in
        data-sc-stagger="60"
      >
        {treatments.map((treatment) => (
          <article
            key={treatment.slug}
            className="flex w-[78vw] shrink-0 snap-start flex-col gap-4 sm:w-[340px]"
          >
            <ImageWrapper
              src={treatment.image}
              alt={treatment.name[lang]}
              fill
              sizes="340px"
              wrapperClassName="aspect-[3/4]"
              caption={categoryLabels[treatment.category][lang]}
            />
            <div>
              <h3 className="font-display text-display-m">{treatment.name[lang]}</h3>
              <p className="mt-2 text-body text-ink/80">{treatment.shortDescription[lang]}</p>
              <p className="mt-3 text-label uppercase tracking-label text-neutral">
                {common("minutesLabel", { count: treatment.durationMinutes })} · {treatment.recovery[lang]}
              </p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
