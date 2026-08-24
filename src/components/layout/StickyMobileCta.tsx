"use client";

import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { buildWhatsAppLink } from "@/lib/whatsapp";

/** Mobile-only persistent booking CTA — conversion.md requires the CTA stay reachable everywhere. */
export function StickyMobileCta() {
  const t = useTranslations("cta");
  const locale = useLocale() as "en" | "ar";

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-border bg-canvas p-3 md:hidden">
      <Button href={buildWhatsAppLink(locale)} external variant="whatsapp" className="flex-1 px-2! whitespace-nowrap">
        {t("whatsapp")}
      </Button>
      <Button href="/#booking-form" variant="primary" className="flex-1 px-2! whitespace-nowrap">
        {t("bookConsultation")}
      </Button>
    </div>
  );
}
