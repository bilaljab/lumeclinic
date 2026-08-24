import { getTranslations } from "next-intl/server";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { EditorialLink } from "@/components/ui/Link";
import { Section } from "@/components/ui/Section";
import { ImageWrapper } from "@/components/ui/ImageWrapper";
import { BookingIntentCta } from "@/components/booking/BookingIntentCta";
import { buildWhatsAppLink, packageWhatsAppMessage } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";
import { packages } from "@/data/packages";
import { treatments } from "@/data/treatments";
import type { LocalizedText } from "@/data/types";

/** PRD §6.9 — programs, not discount cards (conversion.md). Museum-label facts, no pricing/urgency. */
export async function Packages({ lang }: { lang: keyof LocalizedText }) {
  const t = await getTranslations({ locale: lang, namespace: "packages" });
  const cta = await getTranslations({ locale: lang, namespace: "cta" });

  return (
    <Section id="packages">
      <Eyebrow>{t("eyebrow")}</Eyebrow>
      <h2 className="mt-3 font-display text-display-l">{t("heading")}</h2>

      <div className="mt-10 flex flex-col gap-12">
        {packages.map((pkg, i) => {
          const includedTreatments = pkg.treatmentSlugs
            .map((slug) => treatments.find((tr) => tr.slug === slug)?.name[lang])
            .filter(Boolean);
          const reversed = i % 2 === 1;

          return (
            <article
              key={pkg.slug}
              className="grid gap-8 md:grid-cols-12 md:items-center"
              data-sc-in
              data-sc-stagger="90"
            >
              <div className={cn("relative", reversed ? "md:col-span-5 md:col-start-8" : "md:col-span-5")}>
                {/* Layered-plane depth: a rotated backing card behind the
                    photograph reads as a stacked object, not a flat cutout.
                    Must extend PAST the photo's own box (positive inset would
                    sit entirely inside it, fully hidden behind the opaque
                    image with nothing visible to peek out). */}
                <div
                  aria-hidden
                  className="absolute -inset-3 -z-10 rotate-2 border border-border bg-border/40"
                />
                <ImageWrapper
                  src={pkg.image}
                  alt={pkg.name[lang]}
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  wrapperClassName="aspect-[16/11]"
                  caption={`0${i + 1}`}
                  tilt={4}
                />
              </div>

              <div
                className={
                  reversed
                    ? "flex flex-col gap-5 md:col-span-6 md:col-start-1 md:row-start-1"
                    : "flex flex-col gap-5 md:col-span-6 md:col-start-7"
                }
              >
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
                  <EditorialLink
                    href={buildWhatsAppLink(lang, packageWhatsAppMessage(pkg.name))}
                    external
                  >
                    {cta("whatsapp")}
                  </EditorialLink>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
