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
              className={cn(i % 2 === 1 && "md:mt-10")}
              data-sc-parallax={i % 2 === 0 ? "0.08" : "-0.08"}
            >
              {/*
                data-sc-tilt lives on this inner div, never the figure above —
                the engine writes its own el.style.transform to whichever
                element carries the attribute, every frame, and data-sc-parallax
                already does the same to the figure; same element, either
                device would silently overwrite the other's transform. Nesting
                keeps the scroll drift and the pointer tilt on separate
                elements so both compose instead of fighting.

                The tilt itself is the site's one shared pointer-tilt device
                (also on Explorer/Featured/Doctors/Packages imagery) — not a
                bespoke effect, and not a decoration added on top of the
                card: the quote mark, quote and attribution sit at their own
                translateZ depth *inside* the same tilted plane (preserve-3d
                is already set by the engine's own [data-sc-tilt] CSS), so
                they separate from each other as the card itself tilts,
                like layers in a real object rather than a flat poster.
                Self-gates to hover+fine pointer and is inert under reduced
                motion (engine-level), so touch/mobile just gets the quiet
                static card underneath — no forced idle motion across a
                whole grid of them.
              */}
              <div
                data-sc-tilt="6"
                className="relative rounded-sm border border-border bg-canvas p-8 shadow-[0_20px_44px_-32px_rgba(32,27,24,0)] transition-shadow duration-300 ease-editorial hover:shadow-[0_20px_44px_-32px_rgba(32,27,24,0.28)]"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute top-2 start-4 select-none font-display text-[5rem] leading-none text-accent/10"
                  style={{ transform: "translateZ(-24px)" }}
                >
                  “
                </span>
                <blockquote
                  className="relative font-display text-display-m leading-snug"
                  style={{ transform: "translateZ(6px)" }}
                >
                  “{testimonial.quote[lang]}”
                </blockquote>
                <figcaption
                  className="relative mt-4 text-label uppercase tracking-label text-neutral"
                  style={{ transform: "translateZ(14px)" }}
                >
                  {testimonial.authorInitial}
                  {treatment ? ` · ${treatment.name[lang]}` : ""}
                </figcaption>
              </div>
            </figure>
          );
        })}
      </div>
    </Section>
  );
}
