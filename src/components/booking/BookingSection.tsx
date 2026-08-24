import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { BookingFlow } from "./BookingFlow";
import type { LocalizedText } from "@/data/types";

export async function BookingSection({ lang }: { lang: keyof LocalizedText }) {
  const t = await getTranslations({ locale: lang, namespace: "booking" });

  return (
    <Section id="booking-form">
      <div className="mx-auto max-w-2xl">
        <h2 className="font-display text-display-l">{t("heading")}</h2>
        <p className="mt-4 text-body-l text-ink/80">{t("subheading")}</p>
        <div className="mt-10">
          <BookingFlow />
        </div>
      </div>
    </Section>
  );
}
