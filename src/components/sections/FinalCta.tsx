import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/config/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { LocalizedText } from "@/data/types";

/**
 * PRD §6.11 — the resolving close, not a fade-to-nothing (creative-direction
 * feeling curve, "Resolve": pinned close, spotlight + magnetic CTA). The
 * spotlight/magnet pointer devices are native to the ScrollCraft engine
 * (data-sc-spotlight/data-sc-magnet) — self-gated to (hover:hover) and
 * (pointer:fine) and inert under reduced motion, no extra code needed here.
 */
export async function FinalCta({ lang }: { lang: keyof LocalizedText }) {
  const t = await getTranslations({ locale: lang, namespace: "cta" });

  return (
    <Section id="book" bleed data-sc-spotlight className="grain bg-ground-deep text-canvas">
      <Container className="flex flex-col items-start gap-8 text-start" data-sc-in data-sc-stagger="80">
        <h2 className="font-display text-display-l">{siteConfig.finalCta.headline[lang]}</h2>
        <p className="max-w-md text-body-l text-canvas/80">{siteConfig.finalCta.sub[lang]}</p>
        <div className="flex flex-wrap gap-4">
          <div data-sc-magnet="0.3" className="inline-block">
            <Button href="/#booking-form" variant="primary">
              {t("bookConsultation")}
            </Button>
          </div>
          <Button href={buildWhatsAppLink(lang)} external variant="outline-light">
            {t("whatsapp")}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
