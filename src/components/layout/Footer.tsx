"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";
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
  const cta = useTranslations("cta");
  const locale = useLocale() as keyof LocalizedText;
  const pathname = usePathname();
  const otherLocale = routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;

  return (
    <footer className="border-t border-border bg-canvas">
      {/* Cinematic closing beat: one contained visual moment fading into the
          footer's own canvas background, not a full-screen block — the
          page's last piece of imagery before it resolves into plain text. */}
      <div className="relative h-[34vh] w-full overflow-hidden md:h-[44vh]" data-sc-parallax="-0.25">
        <Image
          src="/images/brand/science.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ground-deep/25 via-ground-deep/10 to-canvas" />
      </div>

      <Container
        className="flex flex-wrap items-center justify-between gap-6 border-b border-border py-8"
        data-sc-in
      >
        <p className="font-display text-display-m">{siteConfig.finalCta.headline[locale]}</p>
        <div className="flex flex-wrap gap-4">
          <Button href="/#booking-form" variant="primary">
            {cta("bookConsultation")}
          </Button>
          <Button href={buildWhatsAppLink(locale)} external variant="secondary">
            {cta("whatsapp")}
          </Button>
        </div>
      </Container>

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
          <EditorialLink href={siteConfig.contact.phoneHref}>
            {/* Arabic bidi: an unisolated Latin/numeral run inside RTL text
                gets its space-separated groups reordered by the bidi
                algorithm ("+966 50 123 4567" → "4567 123 50 966+"). */}
            <span dir="ltr" className="inline-block">
              {siteConfig.contact.phoneDisplay}
            </span>
          </EditorialLink>
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
          <Link href={pathname} locale={otherLocale} className="mt-2 py-1 text-label uppercase tracking-label underline underline-offset-4">
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
