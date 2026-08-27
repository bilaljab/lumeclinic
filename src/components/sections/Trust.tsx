import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { TestimonialMarquee } from "./TestimonialMarquee";
import type { LocalizedText } from "@/data/types";

/**
 * PRD §6.10 — quiet register, no counters/urgency (conversion.md). Horizontal
 * strip the visitor can move themselves (mouse-drag desktop, touch mobile),
 * plus a gentle idle auto-scroll on desktop — see TestimonialMarquee.
 */
export async function Trust({ lang }: { lang: keyof LocalizedText }) {
  const t = await getTranslations({ locale: lang, namespace: "trust" });

  return (
    <Section id="trust">
      <h2 className="font-display text-display-l">{t("heading")}</h2>
      <TestimonialMarquee />
    </Section>
  );
}
