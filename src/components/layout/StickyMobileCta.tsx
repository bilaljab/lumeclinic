import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { LocalizedText } from "@/data/types";

/** Mobile-only persistent booking CTA — conversion.md requires the CTA stay reachable everywhere. */
export async function StickyMobileCta({ lang }: { lang: keyof LocalizedText }) {
  const t = await getTranslations({ locale: lang, namespace: "cta" });

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-border bg-canvas p-3 md:hidden">
      <Button href={buildWhatsAppLink(lang)} external variant="whatsapp" className="flex-1 px-2! whitespace-nowrap">
        {t("whatsapp")}
      </Button>
      <Button href="/#booking-form" variant="primary" className="flex-1 px-2! whitespace-nowrap">
        {t("bookConsultation")}
      </Button>
    </div>
  );
}
