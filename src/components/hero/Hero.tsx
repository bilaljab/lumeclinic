import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { HeroEntrance } from "./HeroEntrance";
import { HeroImageReveal } from "./HeroImageReveal";
import type { LocalizedText } from "@/data/types";

function arrowChain(text: string) {
  return text.replace(/\.\s*/g, " → ").replace(/→\s*$/, "").trim();
}

/**
 * Curiosity → awe (LUME_CREATIVE_DIRECTION.md feeling-curve, beat 1). GSAP
 * (HeroEntrance/HeroImageReveal) now owns the one-time load-in choreography
 * for the text column and image frame; ScrollCraft keeps the two inner
 * parallax planes (`data-sc-parallax`) it already drives on scroll — the
 * split keeps both engines from writing to the same element's transform.
 */
export async function Hero({ lang }: { lang: keyof LocalizedText }) {
  const t = await getTranslations({ locale: lang, namespace: "cta" });

  return (
    <section
      id="hero"
      data-sc-act="flow"
      className="relative grain flex min-h-[64svh] flex-col justify-between overflow-hidden bg-ground-deep px-page-x-sm py-8 text-canvas sm:min-h-[78svh] md:px-page-x md:py-12"
    >
      <HeroImageReveal>
        <div className="absolute inset-0" data-sc-parallax="-0.6">
          <Image
            src="/images/hero/hero-main-v3.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: "50% 17%" }}
          />
        </div>
        {/* A flat 80%-opacity tint here previously crushed the photo underneath to
            near-solid dark gray — a scrim only where the text actually sits
            (bottom, where the headline/CTAs live) instead, so the photograph
            reads as an intentional premium image rather than disappearing. */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-ground-deep/85 via-ground-deep/30 to-ground-deep/5"
          data-sc-parallax="-0.3"
        />
      </HeroImageReveal>

      <HeroEntrance>
        <p data-hero-eyebrow className="relative z-10 text-label uppercase tracking-label text-canvas/70">
          {arrowChain(siteConfig.positioning[lang])}
        </p>

        <div className="relative z-10 max-w-4xl">
          {lang === "ar" ? (
            <h1 className="font-display text-display-xl uppercase">
              <span data-hero-line className="block">
                {siteConfig.tagline.ar}
              </span>
            </h1>
          ) : (
            <h1 className="font-display text-display-xl uppercase">
              <span data-hero-line className="block">
                Your Skin.
              </span>
              <span data-hero-line className="block">
                Reimagined.
              </span>
            </h1>
          )}

          <div data-hero-cta className="mt-10 flex flex-wrap gap-4">
            <Button href="/#booking-form" variant="primary">
              {t("bookConsultation")}
            </Button>
            <Button href="/#treatments" variant="outline-light">
              {t("exploreTreatments")}
            </Button>
          </div>
        </div>
      </HeroEntrance>
    </section>
  );
}
