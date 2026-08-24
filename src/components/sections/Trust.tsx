import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { testimonials } from "@/data/testimonials";
import { treatments } from "@/data/treatments";
import type { LocalizedText } from "@/data/types";

/** PRD §6.10 — quiet register, no counters/urgency (conversion.md); no eyebrow, this section stays calm. */
export async function Trust({ lang }: { lang: keyof LocalizedText }) {
  const t = await getTranslations({ locale: lang, namespace: "trust" });

  return (
    <Section id="trust">
      <h2 className="font-display text-display-l">{t("heading")}</h2>

      <div className="mt-14 grid gap-x-12 gap-y-12 md:grid-cols-2" data-sc-in data-sc-stagger="70">
        {testimonials.map((testimonial) => {
          const treatment = testimonial.treatmentSlug
            ? treatments.find((tr) => tr.slug === testimonial.treatmentSlug)
            : undefined;

          return (
            <figure key={testimonial.id} className="border-t border-border pt-6">
              <blockquote className="font-display text-display-m leading-snug">
                “{testimonial.quote[lang]}”
              </blockquote>
              <figcaption className="mt-4 text-label uppercase tracking-label text-neutral">
                {testimonial.authorInitial}
                {treatment ? ` · ${treatment.name[lang]}` : ""}
              </figcaption>
            </figure>
          );
        })}
      </div>
    </Section>
  );
}
