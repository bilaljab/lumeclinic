import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { BookingFlowLazy } from "./BookingFlowLazy";
import type { LocalizedText } from "@/data/types";

/**
 * The booking flow itself (schema, steps, intent preselection, WhatsApp
 * confirmation) is untouched — this only adds a decorative atmosphere layer
 * behind it: a faint technical grid (scientific/spatial, per design.md) and
 * a soft accent glow, both `aria-hidden` and non-interactive.
 */
export async function BookingSection({ lang }: { lang: keyof LocalizedText }) {
  const t = await getTranslations({ locale: lang, namespace: "booking" });

  return (
    <div className="relative isolate overflow-hidden bg-canvas">
      <div
        aria-hidden
        data-sc-parallax="-0.15"
        className="pointer-events-none absolute inset-0 opacity-[0.32] [background-image:linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_80%_65%_at_50%_35%,black,transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[55%] w-[85%] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
      />

      <Section id="booking-form" className="relative">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-display-l">{t("heading")}</h2>
          <p className="mt-4 text-body-l text-ink/80">{t("subheading")}</p>
          <div className="mt-10">
            <BookingFlowLazy />
          </div>
        </div>
      </Section>
    </div>
  );
}
