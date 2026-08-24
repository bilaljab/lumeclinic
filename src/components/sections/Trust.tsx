import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { testimonials } from "@/data/testimonials";
import { treatments } from "@/data/treatments";
import { cn } from "@/lib/cn";
import type { LocalizedText } from "@/data/types";

/** PRD §6.10 — quiet register, no counters/urgency (conversion.md); no eyebrow, this section stays calm. */
export async function Trust({ lang }: { lang: keyof LocalizedText }) {
  const t = await getTranslations({ locale: lang, namespace: "trust" });

  return (
    <Section id="trust">
      <h2 className="font-display text-display-l">{t("heading")}</h2>

      <div className="mt-10 grid gap-x-12 gap-y-12 md:grid-cols-2" data-sc-in data-sc-stagger="70">
        {testimonials.map((testimonial, i) => {
          const treatment = testimonial.treatmentSlug
            ? treatments.find((tr) => tr.slug === testimonial.treatmentSlug)
            : undefined;

          return (
            <figure
              key={testimonial.id}
              // A soft vertical offset on every other column breaks the grid
              // into a looser, spatial arrangement instead of a flat table of cards.
              // Restrained parallax drift (alternating direction) gives this
              // section its own scroll signature — Packages directly above it
              // uses the same stagger-reveal device, so a static grid here
              // would read as the same section twice.
              className={cn("border-t border-border pt-6", i % 2 === 1 && "md:mt-10")}
              data-sc-parallax={i % 2 === 0 ? "0.08" : "-0.08"}
            >
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
