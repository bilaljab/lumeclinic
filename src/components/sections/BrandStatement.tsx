import { Container } from "@/components/ui/Container";
import { ImageWrapper } from "@/components/ui/ImageWrapper";
import { brandStatementBeats } from "@/data/brandStatement";
import type { LocalizedText } from "@/data/types";

/**
 * Skin → Science → Results narrative (PRD §6.3) — the page's `pin` act
 * (LUME_CREATIVE_DIRECTION.md feeling-curve table, beat 2).
 *
 * "Skin" uses the greet form (already visible when the pin engages, never
 * fades in from nothing) — both because it's the beat's actual meaning
 * ("we start with what's there") and because a pinned act whose first
 * content is a plain fade-in shows an empty stage for its whole ramp-in
 * (devices.md "Ground or greet"); this section has no image/colour ground
 * to fall back on otherwise. "Science" gets the act's one kinetic headline
 * (devices.md: at most one per act). "Results" closes with a plain
 * fade+rise, `to=1` so it can never get stuck lit through the un-pin slide
 * (devices.md cue contract).
 */
const cueWindows: Record<string, string> = {
  skin: "0 1 0 0",
  science: "0.3 1 0.3 0",
  results: "0.6 1 0.3 0",
};

export function BrandStatement({ lang }: { lang: keyof LocalizedText }) {
  return (
    <section
      id="brand-statement"
      data-sc-act="pin"
      data-sc-span="2"
      data-sc-mobile-flow
      className="bg-canvas"
    >
      <div data-sc-stage className="flex items-center">
        <Container>
          <div className="grid gap-12 md:grid-cols-3 md:gap-8">
            {brandStatementBeats.map((beat, i) => (
              <div
                key={beat.slug}
                data-sc-cue={cueWindows[beat.slug]}
                className="flex flex-col gap-5 border-s border-border ps-6 md:border-s-0 md:ps-0"
                style={i === 1 ? { marginTop: "clamp(0px, 4vw, 3rem)" } : undefined}
              >
                {beat.slug === "science" ? (
                  <ImageWrapper
                    src="/images/brand/science.jpg"
                    alt=""
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    wrapperClassName="aspect-[3/2] md:order-first"
                  />
                ) : null}
                <p className="text-label uppercase tracking-label text-accent">{beat.label[lang]}</p>
                {beat.slug === "science" ? (
                  <h2
                    className="font-display text-display-m"
                    data-sc-cue={cueWindows[beat.slug]}
                    data-sc-kinetic="lines"
                  >
                    {beat.headline[lang]}
                  </h2>
                ) : (
                  <h2 className="font-display text-display-m">{beat.headline[lang]}</h2>
                )}
                <p className="max-w-sm text-body text-ink/80">{beat.body[lang]}</p>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
