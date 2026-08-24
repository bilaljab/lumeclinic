import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { peakResult } from "@/data/results";
import { treatments } from "@/data/treatments";
import { doctors } from "@/data/doctors";
import type { LocalizedText } from "@/data/types";

/**
 * The page's engineered peak (LUME_CREATIVE_DIRECTION.md "Signature move") —
 * a bidirectional scroll-scrubbed transformation reveal, distinct from the
 * pointer-drag `BeforeAfterSlider` gallery below it. Pure data-sc-* markup
 * driven by the ScrollCraft engine (public/scrollcraft.js): data-sc-reveal
 * with a full "0 1" window makes the after-image clip-path track scroll
 * progress directly, in both directions, for the whole pinned span.
 */
export async function BeforeAfterPeak({ lang }: { lang: keyof LocalizedText }) {
  const t = await getTranslations({ locale: lang, namespace: "results" });
  const a11y = await getTranslations({ locale: lang, namespace: "a11y" });
  const isRtl = lang === "ar";

  const treatment = treatments.find((tr) => tr.slug === peakResult.treatmentSlug);
  const doctor = doctors.find((d) => d.slug === peakResult.doctorSlug);
  if (!treatment || !doctor) return null;

  return (
    <section id="results" data-sc-act="pin" data-sc-span="2.5" className="bg-ink text-canvas">
      <div data-sc-stage>
        {/* next/image's `fill` requires a parent with position absolute/fixed/
            relative — the stage itself is `position: sticky` (set by the
            engine's .sc-stage rule), which Next's dev warning doesn't accept,
            so the fill image gets its own absolute wrapper instead. */}
        <div className="absolute inset-0">
          <Image
            src={peakResult.beforeImage}
            alt={treatment.name[lang]}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div
          className="absolute inset-0"
          data-sc-reveal={isRtl ? "right" : "left"}
          data-sc-reveal-at="0 1"
        >
          <Image
            src={peakResult.afterImage}
            alt={treatment.name[lang]}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <div className="absolute inset-0 z-[5] bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />

        <div className="sc-copy sc-copy--lead" data-sc-cue="0 0.78 0">
          <h2 className="font-display text-display-l text-canvas" data-sc-kinetic="lines">
            {t("peakHeading")}
          </h2>
          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-label uppercase tracking-label text-canvas/70">
            <div className="flex gap-2">
              <dt className="text-canvas/50">{t("treatmentLabel")}</dt>
              <dd>{treatment.name[lang]}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-canvas/50">{t("doctorLabel")}</dt>
              <dd>{doctor.name[lang]}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-canvas/50">{t("sessionsLabel")}</dt>
              <dd>{peakResult.sessions}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-canvas/50">{t("timeframeLabel")}</dt>
              <dd>{peakResult.timeframe[lang]}</dd>
            </div>
          </dl>
        </div>

        <span className="pointer-events-none absolute bottom-6 end-6 z-20 rounded-xs bg-ink/80 px-2 py-1 text-label uppercase tracking-label text-canvas">
          {a11y("beforeLabel")}
        </span>
        <span className="pointer-events-none absolute bottom-6 start-6 z-20 rounded-xs bg-ink/80 px-2 py-1 text-label uppercase tracking-label text-canvas">
          {a11y("afterLabel")}
        </span>
      </div>
    </section>
  );
}
