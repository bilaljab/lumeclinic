import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { journeySteps } from "@/data/journey";
import type { LocalizedText } from "@/data/types";

/**
 * PRD §6.8 — the one section that legitimately earns numbered markers: a
 * real, ordered process. The page's other `pin` act (Confidence/understanding,
 * LUME_CREATIVE_DIRECTION.md feeling-curve beat 7) — each step's cue window
 * opens in sequence and holds (to=1), so the completed 5-step arc is what
 * the visitor carries into Packages.
 */
const stepCueWindows = ["0 1 0.2 0", "0.2 1 0.2 0", "0.4 1 0.2 0", "0.6 1 0.2 0", "0.8 1 0.2 0"];

export async function TreatmentJourney({ lang }: { lang: keyof LocalizedText }) {
  const t = await getTranslations({ locale: lang, namespace: "journey" });

  return (
    <Section id="journey" bleed data-sc-act="pin" data-sc-span="2.5" data-sc-mobile-flow>
      {/*
        Container goes INSIDE the stage, not around it. Section's own
        non-bleed mode wraps children in an auto-height Container *outside*
        data-sc-stage — that extra ancestor's height collapses to match the
        stage's own height, which breaks position:sticky (its containing
        block ends up exactly as tall as the sticky element itself, leaving
        no room to stick across the pin's scroll range).
      */}
      <div data-sc-stage className="flex flex-col justify-center">
        <Container>
          {/*
            Greet form, no kinetic split here (kept simple and used as the
            pin's visible ground the instant it engages — see devices.md
            "Ground or greet"). Splitting text is only ever safe on a leaf
            element with plain text content, never on the <li>s below, which
            nest a number span, a heading and a paragraph.
          */}
          <h2 className="font-display text-display-l" data-sc-cue="0 1 0 0">
            {t("heading")}
          </h2>

          <ol className="mt-14 flex flex-col gap-10 md:grid md:grid-cols-5 md:gap-6">
            {journeySteps.map((step, i) => (
              <li key={step.number} className="border-t border-border pt-6" data-sc-cue={stepCueWindows[i]}>
                <span className="font-display text-display-m text-accent">{step.number}</span>
                <h3 className="mt-3 text-label uppercase tracking-label">{step.title[lang]}</h3>
                <p className="mt-2 text-body text-ink/80">{step.description[lang]}</p>
              </li>
            ))}
          </ol>
        </Container>
      </div>
    </Section>
  );
}
