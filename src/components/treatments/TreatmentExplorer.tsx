"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ImageWrapper } from "@/components/ui/ImageWrapper";
import { EditorialLink } from "@/components/ui/Link";
import { BookingIntentCta } from "@/components/booking/BookingIntentCta";
import { cn } from "@/lib/cn";
import { buildWhatsAppLink, treatmentWhatsAppMessage } from "@/lib/whatsapp";
import { concernGroupLabels, concernGroupOrder, concernGroups } from "@/data/concerns";
import { treatments } from "@/data/treatments";
import type { ConcernGroup } from "@/data/concerns";
import type { LocalizedText } from "@/data/types";

type Filter = ConcernGroup | "all";

/** PRD §6.4 — browse by concern, not medical terminology. Local filter state, no backend. */
export function TreatmentExplorer() {
  const lang = useLocale() as keyof LocalizedText;
  const t = useTranslations("explorer");
  const cta = useTranslations("cta");
  const common = useTranslations("common");
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(
    () =>
      filter === "all"
        ? treatments
        : treatments.filter((tr) => tr.concerns.some((c) => concernGroups[filter].includes(c))),
    [filter],
  );

  return (
    <Section id="treatments">
      <SectionHeading size="l" align="start">
        {t("heading")}
      </SectionHeading>
      <p className="mt-4 max-w-lg text-body-l text-ink/80">{t("subheading")}</p>

      <div className="mt-10 flex flex-wrap gap-3" role="group" aria-label={t("heading")}>
        <button
          type="button"
          onClick={() => setFilter("all")}
          aria-pressed={filter === "all"}
          className={cn(
            "scale-100 rounded-sm border px-4 py-2 text-label uppercase tracking-label transition-[color,background-color,border-color,transform] duration-200 ease-editorial hover:scale-[1.02] active:scale-[0.97] active:duration-100 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
            filter === "all"
              ? "border-accent bg-accent text-canvas"
              : "border-border text-ink hover:border-accent hover:text-accent",
          )}
        >
          {t("allLabel")}
        </button>
        {concernGroupOrder.map((group) => (
          <button
            key={group}
            type="button"
            onClick={() => setFilter(group)}
            aria-pressed={filter === group}
            className={cn(
              "scale-100 rounded-sm border px-4 py-2 text-label uppercase tracking-label transition-[color,background-color,border-color,transform] duration-200 ease-editorial hover:scale-[1.02] active:scale-[0.97] active:duration-100 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
              filter === group
                ? "border-accent bg-accent text-canvas"
                : "border-border text-ink hover:border-accent hover:text-accent",
            )}
          >
            {concernGroupLabels[group][lang]}
          </button>
        ))}
      </div>

      <p className="mt-6 text-label uppercase tracking-label text-neutral">
        {t("countLabel", { count: filtered.length })}
      </p>

      {filtered.length === 0 ? (
        <p className="mt-8 text-body text-neutral">{t("emptyLabel")}</p>
      ) : (
        <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3" data-sc-in data-sc-stagger="60">
          {filtered.map((treatment) => (
            <article key={treatment.slug} className="flex flex-col gap-4">
              <ImageWrapper
                src={treatment.image}
                alt={treatment.name[lang]}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                wrapperClassName="aspect-[3/2]"
                className="transition-transform duration-500 ease-editorial hover:scale-[1.03]"
                caption={common("minutesLabel", { count: treatment.durationMinutes })}
                tilt={6}
              />
              <div>
                <h3 className="font-display text-display-m">{treatment.name[lang]}</h3>
                <p className="mt-2 text-body text-ink/80">{treatment.shortDescription[lang]}</p>
                <p className="mt-3 text-label uppercase tracking-label text-neutral">
                  {treatment.recovery[lang]}
                </p>
              </div>
              <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2">
                <BookingIntentCta
                  intent={{ treatmentSlug: treatment.slug }}
                  variant="primary"
                  className="px-4 py-2"
                >
                  {cta("bookTreatment")}
                </BookingIntentCta>
                <EditorialLink
                  href={buildWhatsAppLink(lang, treatmentWhatsAppMessage(treatment.name))}
                  external
                  aria-label={`${cta("viewDetails")} — ${treatment.name[lang]}`}
                >
                  {cta("viewDetails")}
                </EditorialLink>
              </div>
            </article>
          ))}
        </div>
      )}
    </Section>
  );
}
