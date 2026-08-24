import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import type { LocalizedText } from "@/data/types";

function arrowChain(text: string) {
  return text.replace(/\.\s*/g, " → ").replace(/→\s*$/, "").trim();
}

/**
 * Curiosity → awe (LUME_CREATIVE_DIRECTION.md feeling-curve, beat 1). The
 * headline uses the cue's greet form (already visible, never fades in from
 * nothing, per PRD) while the background gets a subtle parallax recession
 * as the visitor scrolls past — both are `flow`-act devices (not `pin`) so
 * the hero doesn't hold the scroll and risk a second sticky context
 * stacking against the sticky Navbar right above it.
 */
export async function Hero({ lang }: { lang: keyof LocalizedText }) {
  const t = await getTranslations({ locale: lang, namespace: "cta" });

  return (
    <section
      id="hero"
      data-sc-act="flow"
      className="relative grain flex min-h-[78svh] flex-col justify-between overflow-hidden bg-ground-deep px-page-x-sm py-8 text-canvas sm:min-h-[92svh] md:px-page-x md:py-12"
    >
      <div className="absolute inset-0" data-sc-parallax="-0.6">
        <Image
          src="/images/hero/hero-main.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-ground-deep/80" />

      <p
        className="relative z-10 text-label uppercase tracking-label text-canvas/70"
        data-sc-cue="0 1 0 0"
      >
        {arrowChain(siteConfig.positioning[lang])}
      </p>

      <div className="relative z-10 max-w-4xl" data-sc-cue="0 1 0 0">
        {/*
          No data-sc-kinetic here: line-splitting flattens the element's
          textContent, which would swallow the intentional <br/> line break
          in the English headline. The greet-form cue above already lands
          this fully visible with no fade-from-nothing, satisfying the PRD
          requirement without needing the text-split effect too.
        */}
        {lang === "ar" ? (
          <h1 className="font-display text-display-xl uppercase">{siteConfig.tagline.ar}</h1>
        ) : (
          <h1 className="font-display text-display-xl uppercase">
            Your Skin.
            <br />
            Reimagined.
          </h1>
        )}

        <div className="mt-10 flex flex-wrap gap-4">
          <Button href="/#booking-form" variant="primary">
            {t("bookConsultation")}
          </Button>
          <Button href="/#treatments" variant="outline-light">
            {t("exploreTreatments")}
          </Button>
        </div>
      </div>
    </section>
  );
}
