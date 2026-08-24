"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";
import { MobileMenuTrigger } from "./MobileMenuTrigger";

const anchors = [
  { href: "/#treatments", key: "treatments" as const },
  { href: "/#doctors", key: "doctors" as const },
  { href: "/#results", key: "results" as const },
  { href: "/#packages", key: "packages" as const },
];

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const locale = useLocale();
  const otherLocale = routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-canvas/95 backdrop-blur-sm">
      <div className="relative mx-auto flex max-w-contained items-center justify-between px-page-x-sm py-4 md:px-page-x">
        <Link href="/" className="font-display text-display-m">
          LUMÉ
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {anchors.map((a) => (
            <Link key={a.key} href={a.href} className="py-1 text-label uppercase">
              {t(a.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-6 md:flex">
          <Link href={pathname} locale={otherLocale} className="py-1 text-label uppercase">
            {t("switchLanguage")}
          </Link>
          <Button href="/#booking-form" variant="primary">
            {t("bookConsultation")}
          </Button>
        </div>

        <MobileMenuTrigger label={t("menu")} closeLabel={t("closeMenu")}>
          <div className="flex flex-col gap-6">
            {anchors.map((a) => (
              <Link key={a.key} href={a.href} className="py-1 text-label uppercase">
                {t(a.key)}
              </Link>
            ))}
            <Link href={pathname} locale={otherLocale} className="py-1 text-label uppercase">
              {t("switchLanguage")}
            </Link>
            <Button href="/#booking-form" variant="primary">
              {t("bookConsultation")}
            </Button>
          </div>
        </MobileMenuTrigger>
      </div>
    </header>
  );
}
