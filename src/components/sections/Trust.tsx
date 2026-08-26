import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { testimonials } from "@/data/testimonials";
import { treatments } from "@/data/treatments";
import type { LocalizedText } from "@/data/types";
import type { Testimonial } from "@/data/types";

function TestimonialCard({ testimonial, lang }: { testimonial: Testimonial; lang: keyof LocalizedText }) {
  const treatment = testimonial.treatmentSlug
    ? treatments.find((tr) => tr.slug === testimonial.treatmentSlug)
    : undefined;

  return (
    <figure className="flex w-[82vw] shrink-0 snap-start flex-col sm:w-[420px] lg:w-[440px]">
      <div className="relative flex h-full flex-col rounded-sm border border-border bg-canvas p-8">
        <span aria-hidden className="select-none font-display text-[5rem] leading-none text-accent/10">
          &ldquo;
        </span>
        <blockquote className="mt-2 font-display text-display-m leading-snug">
          &ldquo;{testimonial.quote[lang]}&rdquo;
        </blockquote>
        <figcaption className="mt-4 text-label uppercase tracking-label text-neutral">
          {testimonial.authorInitial}
          {treatment ? ` · ${treatment.name[lang]}` : ""}
        </figcaption>
      </div>
    </figure>
  );
}

/**
 * PRD §6.10 — quiet register, no counters/urgency (conversion.md). Pure-CSS
 * horizontal marquee (see globals.css `.testimonial-track`/`marquee-x`) —
 * no JS/GSAP, pause on hover/focus, reduced-motion swaps to a genuinely
 * static 2-up grid rather than a frozen strip, mobile gets native
 * overflow-x scrolling with no animation and no duplicated cards.
 */
export async function Trust({ lang }: { lang: keyof LocalizedText }) {
  const t = await getTranslations({ locale: lang, namespace: "trust" });

  return (
    <Section id="trust">
      <h2 className="font-display text-display-l">{t("heading")}</h2>

      <div className="relative mt-10 -mx-page-x-sm overflow-x-auto lg:mx-0 lg:overflow-hidden">
        <div className="testimonial-track flex w-max gap-8 px-page-x-sm snap-x snap-mandatory lg:w-auto lg:animate-marquee lg:snap-none lg:px-0 lg:hover:[animation-play-state:paused] lg:focus-within:[animation-play-state:paused]">
          <div className="flex shrink-0 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} lang={lang} />
            ))}
          </div>
          <div aria-hidden className="testimonial-track-dup hidden shrink-0 gap-8 lg:flex">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={`dup-${testimonial.id}`} testimonial={testimonial} lang={lang} />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
