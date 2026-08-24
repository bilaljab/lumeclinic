"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { EditorialLink } from "@/components/ui/Link";
import { siteConfig } from "@/config/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { LocalizedText } from "@/data/types";

const anchors = [
  { href: "/#treatments", key: "treatments" as const },
  { href: "/#doctors", key: "doctors" as const },
  { href: "/#results", key: "results" as const },
  { href: "/#packages", key: "packages" as const },
];

/** PRD §6.12 — real footer: brand, contact, location, WhatsApp, socials, nav, language, disclaimer. */
export function Footer() {
  const nav = useTranslations("nav");
  const footer = useTranslations("footer");
  const locale = useLocale() as keyof LocalizedText;
  const pathname = usePathname();
  const otherLocale = routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;

  return (
    <footer className="border-t border-border bg-canvas">
      <Container className="grid gap-12 py-16 md:grid-cols-4" data-sc-in data-sc-stagger="60">
        <div className="flex flex-col gap-3 md:col-span-1">
          <p className="font-display text-display-m">{siteConfig.brandName}</p>
          <p className="max-w-xs text-body text-ink/80">{siteConfig.tagline[locale]}</p>
        </div>

        <nav aria-label={footer("navHeading")} className="flex flex-col gap-3">
          <p className="text-label uppercase tracking-label text-neutral">{footer("navHeading")}</p>
          {anchors.map((a) => (
            <EditorialLink key={a.key} href={a.href}>
              {nav(a.key)}
            </EditorialLink>
          ))}
        </nav>

        <div className="flex flex-col gap-3">
          <p className="text-label uppercase tracking-label text-neutral">{footer("contactHeading")}</p>
          <p className="text-body text-ink/80">{siteConfig.location.addressLine[locale]}</p>
          <EditorialLink href={siteConfig.contact.phoneHref}>{siteConfig.contact.phoneDisplay}</EditorialLink>
          <EditorialLink href={buildWhatsAppLink(locale)} external>
            WhatsApp
          </EditorialLink>
          <EditorialLink href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</EditorialLink>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-label uppercase tracking-label text-neutral">{footer("followHeading")}</p>
          <EditorialLink href={siteConfig.social.instagram} external>
            Instagram
          </EditorialLink>
          <EditorialLink href={siteConfig.social.tiktok} external>
            TikTok
          </EditorialLink>
          <Link href={pathname} locale={otherLocale} className="mt-2 text-label uppercase tracking-label underline underline-offset-4">
            {nav("switchLanguage")}
          </Link>
        </div>
      </Container>

      <Container className="flex flex-col gap-2 border-t border-border py-6 text-label text-neutral md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {siteConfig.brandName} — {footer("rights")}
        </p>
        <p>{siteConfig.fictionalContentDisclaimer[locale]}</p>
      </Container>
    </footer>
  );
}
