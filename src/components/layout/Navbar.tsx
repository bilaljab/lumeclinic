"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
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
  const [scrolled, setScrolled] = useState(false);

  // Once the hero has scrolled out from under the sticky header, the bar
  // condenses and its backdrop deepens — one boolean flip off an
  // IntersectionObserver, not a continuous scroll-position calculation.
  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting), {
      rootMargin: "-72px 0px 0px 0px",
      threshold: 0,
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className="sticky top-0 z-40 border-b border-border bg-canvas/95 backdrop-blur-sm transition-[background-color,box-shadow] duration-300 ease-editorial data-[scrolled=true]:bg-canvas/98 data-[scrolled=true]:shadow-[0_12px_28px_-24px_rgba(32,27,24,0.35)]"
    >
      <div
        className={cn(
          "relative mx-auto flex max-w-contained items-center justify-between px-page-x-sm transition-[padding] duration-300 ease-editorial md:px-page-x",
          scrolled ? "py-3" : "py-4",
        )}
      >
        <Link href="/" className="font-display text-display-m">
          {siteConfig.logo.wordmark}
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {anchors.map((a) => (
            <Link key={a.key} href={a.href} className="py-1 text-label uppercase">
              {t(a.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
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
