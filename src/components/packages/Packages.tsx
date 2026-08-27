import { getTranslations } from "next-intl/server";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { EditorialLink } from "@/components/ui/Link";
import { Section } from "@/components/ui/Section";
import { BookingIntentCta } from "@/components/booking/BookingIntentCta";
import { ProgramsCarousel } from "@/components/packages/ProgramsCarousel";
import { buildWhatsAppLink, packageWhatsAppMessage } from "@/lib/whatsapp";
import { packages } from "@/data/packages";
import { treatments } from "@/data/treatments";
import type { LocalizedText } from "@/data/types";
import type { SpatialShowcaseItem } from "@/components/spatial/types";

/** PRD §6.9 — programs, not discount cards (conversion.md). Museum-label facts, no pricing/urgency. */
export async function Packages({ lang }: { lang: keyof LocalizedText }) {
  const t = await getTranslations({ locale: lang, namespace: "packages" });
  const cta = await getTranslations({ locale: lang, namespace: "cta" });
  const common = await getTranslations({ locale: lang, namespace: "common" });

  const galleryItems: SpatialShowcaseItem[] = packages.map((pkg) => {
    const includedTreatments = pkg.treatmentSlugs
      .map((slug) => treatments.find((tr) => tr.slug === slug)?.name[lang])
      .filter(Boolean);

    return {
      key: pkg.slug,
      image: { src: pkg.image, alt: pkg.name[lang] },
      overlay: (
        <div className="flex flex-col gap-5">
          <h3 className="font-display text-display-m">{pkg.name[lang]}</h3>
          <p className="text-body text-ink/80">{pkg.description[lang]}</p>

          <dl className="mt-2 flex flex-col gap-2 border-t border-border pt-4">
            <dt className="text-label uppercase tracking-label text-neutral">{t("includesLabel")}</dt>
            <dd>
              <ul className="flex flex-col gap-1 text-body">
                {pkg.includes.map((item) => (
                  <li key={item.en}>{item[lang]}</li>
                ))}
              </ul>
            </dd>
          </dl>
          {includedTreatments.length > 0 ? (
            <p className="-mt-1 text-label uppercase tracking-label text-neutral">
              {includedTreatments.join(" · ")}
            </p>
          ) : null}

          <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-3">
            <BookingIntentCta
              intent={{ packageSlug: pkg.slug, treatmentSlug: pkg.treatmentSlugs[0] ?? "" }}
              variant="primary"
              aria-label={`${cta("discoverPackage")} — ${pkg.name[lang]}`}
            >
              {cta("discoverPackage")}
            </BookingIntentCta>
            <EditorialLink href={buildWhatsAppLink(lang, packageWhatsAppMessage(pkg.name))} external>
              {cta("whatsapp")}
            </EditorialLink>
          </div>
        </div>
      ),
    };
  });

  return (
    <Section id="packages">
      <Eyebrow>{t("eyebrow")}</Eyebrow>
      <h2 className="mt-3 font-display text-display-l">{t("heading")}</h2>

      <div className="mt-10">
        <ProgramsCarousel
          items={galleryItems}
          labels={{
            previous: common("previous"),
            next: common("next"),
            gallery: t("galleryLabel"),
          }}
        />
      </div>
    </Section>
  );
}
