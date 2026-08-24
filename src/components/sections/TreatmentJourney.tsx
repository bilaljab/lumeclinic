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
 *
 * `to` must stay 1 — that's not a style choice, it's the only way a cue
 * holds instead of fading back out: the engine starts fading a cue out at
 * `to - window*rOut` and finishes at `to` itself, so with `to=1` the
 * fade-out branch never triggers (p physically can't exceed 1). Only the
 * `from` values were tuned here, and for a real reason: under mobile's
 * `data-sc-mobile-flow` fallback the act becomes `flow`, whose p=1 is the
 * moment the section has scrolled entirely off the TOP of the viewport
 * (not "held in place" the way a desktop `pin` holds at p=1). The original
 * evenly-spaced `from` values (0/0.2/0.4/0.6/0.8) left step 5 reaching full
 * opacity only ~120px before it scrolled out of view on mobile — visible
 * for a blink, easy to miss. Shifted earlier so every step reaches full
 * opacity with roughly 250-350px of on-screen dwell time before it exits,
 * on both act types. On desktop's `pin` this means the 5-step reveal
 * finishes a bit before the pin releases and holds the completed arc for
 * the remainder, rather than finishing exactly at release — a minor pacing
 * change, not a regression.
 */
const stepCueWindows = [
  "0.06 1 0.3 0",
  "0.19 1 0.3 0",
  "0.33 1 0.3 0",
  "0.46 1 0.3 0",
  "0.6 1 0.3 0",
];

export async function TreatmentJourney({ lang }: { lang: keyof LocalizedText }) {
  const t = await getTranslations({ locale: lang, namespace: "journey" });

  return (
    <Section id="journey" bleed data-sc-act="pin" data-sc-span="2" data-sc-mobile-flow>
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

          <ol className="mt-10 flex flex-col gap-10 md:grid md:grid-cols-5 md:gap-6">
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
