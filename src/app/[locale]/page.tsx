import { Hero } from "@/components/hero/Hero";
import { BrandStatement } from "@/components/sections/BrandStatement";
import { TreatmentExplorer } from "@/components/treatments/TreatmentExplorer";
import { BeforeAfterPeak } from "@/components/results/BeforeAfterPeak";
import { BeforeAfter } from "@/components/results/BeforeAfter";
import { Doctors } from "@/components/doctors/Doctors";
import { TreatmentJourney } from "@/components/sections/TreatmentJourney";
import { Packages } from "@/components/packages/Packages";
import { Trust } from "@/components/sections/Trust";
import { FinalCta } from "@/components/sections/FinalCta";
import { BookingSection } from "@/components/booking/BookingSection";
import { BookingIntentProvider } from "@/components/booking/BookingIntentContext";
import type { LocalizedText } from "@/data/types";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lang = locale as keyof LocalizedText;

  return (
    <BookingIntentProvider>
      <Hero lang={lang} />
      <BrandStatement lang={lang} />
      <TreatmentExplorer />
      <BeforeAfterPeak lang={lang} />
      <BeforeAfter lang={lang} />
      <Doctors lang={lang} />
      <TreatmentJourney lang={lang} />
      <Packages lang={lang} />
      <Trust lang={lang} />
      <FinalCta lang={lang} />
      <BookingSection lang={lang} />
    </BookingIntentProvider>
  );
}
