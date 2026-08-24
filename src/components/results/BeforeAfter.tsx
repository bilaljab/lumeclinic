import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { results } from "@/data/results";
import { treatments } from "@/data/treatments";
import { doctors } from "@/data/doctors";
import { siteConfig } from "@/config/site";
import type { LocalizedText } from "@/data/types";

/** PRD §6.6 — the page's peak moment. Real drag/keyboard interaction. */
export async function BeforeAfter({ lang }: { lang: keyof LocalizedText }) {
  const t = await getTranslations({ locale: lang, namespace: "results" });
  const a11y = await getTranslations({ locale: lang, namespace: "a11y" });

  return (
    <Section id="results-gallery" className="bg-ink text-canvas" bleed>
      <Container>
        <SectionHeading size="l" align="start" className="text-canvas">
          {t("heading")}
        </SectionHeading>
        <p className="mt-4 max-w-lg text-body-l text-canvas/80">{t("subheading")}</p>

        <div className="mt-12 grid gap-12 md:grid-cols-3 md:gap-8">
          {results.map((result) => {
            const treatment = treatments.find((tr) => tr.slug === result.treatmentSlug);
            const doctor = doctors.find((d) => d.slug === result.doctorSlug);
            if (!treatment || !doctor) return null;

            return (
              <div key={result.slug} className="flex flex-col gap-4">
                <BeforeAfterSlider
                  beforeSrc={result.beforeImage}
                  afterSrc={result.afterImage}
                  alt={treatment.name[lang]}
                  beforeLabel={a11y("beforeLabel")}
                  afterLabel={a11y("afterLabel")}
                  ariaLabel={a11y("dragHandle")}
                  isRtl={lang === "ar"}
                />
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-label uppercase tracking-label text-canvas/70">
                  <dt className="text-canvas/50">{t("treatmentLabel")}</dt>
                  <dd>{treatment.name[lang]}</dd>
                  <dt className="text-canvas/50">{t("doctorLabel")}</dt>
                  <dd>{doctor.name[lang]}</dd>
                  <dt className="text-canvas/50">{t("sessionsLabel")}</dt>
                  <dd>{result.sessions}</dd>
                  <dt className="text-canvas/50">{t("timeframeLabel")}</dt>
                  <dd>{result.timeframe[lang]}</dd>
                </dl>
              </div>
            );
          })}
        </div>

        <p className="mt-12 max-w-2xl text-label text-canvas/50">
          {siteConfig.fictionalContentDisclaimer[lang]}
        </p>
      </Container>
    </Section>
  );
}
