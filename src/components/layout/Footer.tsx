"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { EditorialLink, editorialLinkClasses } from "@/components/ui/Link";
import { cn } from "@/lib/cn";
import { siteConfig } from "@/config/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { BLUR_DATA_URL } from "@/lib/blurPlaceholder";
import type { LocalizedText } from "@/data/types";

/**
 * PRD §6.12 — real footer: brand, contact, location, WhatsApp, socials,
 * language, disclaimer. Two things deliberately NOT here, both found during
 * an Impeccable critique pass: a repeated nav-links column (this is a
 * one-page site — those same four anchors already live in the navbar, so a
 * second copy is pure sitemap-template filler, not a new affordance) and a
 * second "Ready to Reimagine Your Skin?" CTA banner (FinalCta.tsx already
 * owns that beat per PRD §6.11 — repeating its exact headline in a flatter
 * register undercuts it instead of closing the page strongly). The booking
 * nudge that conversion.md still requires here lives inline in the brand
 * column instead of as a duplicate hero-style banner.
 */
export function Footer() {
  const nav = useTranslations("nav");
  const footer = useTranslations("footer");
  const cta = useTranslations("cta");
  const locale = useLocale() as keyof LocalizedText;
  const pathname = usePathname();
  const otherLocale = routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;

  return (
    <footer className="border-t border-border bg-canvas">
      {/* Cinematic closing beat: a contained visual moment fading into the
          footer's own canvas background. `data-sc-act="flow"` is what
          actually activates the parallax/reveal devices below — ScrollCraft
          only scans an element's `data-sc-*` children when the element
          itself carries `data-sc-act` (see public/scrollcraft.js's act
          collection pass), so the parallax this band already authored was
          silently inert without it. */}
      <div className="relative h-[34vh] w-full overflow-hidden md:h-[44vh]" data-sc-act="flow">
        <div className="absolute inset-0" data-sc-reveal="up">
          <Image
            src="/images/brand/footer-closing.jpg"
            alt=""
            fill
            sizes="100vw"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover"
            data-sc-parallax="-0.25"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-ground-deep/25 via-ground-deep/10 to-canvas" />
      </div>

      <Container
        className="grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]"
        data-sc-in
        data-sc-stagger="60"
      >
        <div className="flex flex-col gap-4">
          <p className="font-display text-display-l">{siteConfig.brandName}</p>
          <p className="max-w-xs text-body text-ink/80">{siteConfig.tagline[locale]}</p>
          <EditorialLink href="/#booking-form" className="mt-2 w-fit">
            {cta("bookConsultation")}
          </EditorialLink>
        </div>

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
            {cta("whatsapp")}
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
        </div>
      </Container>

      <Container className="flex flex-col gap-3 border-t border-border py-6 text-label text-neutral md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {siteConfig.brandName} — {footer("rights")}
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <p>{siteConfig.fictionalContentDisclaimer[locale]}</p>
          <Link href={pathname} locale={otherLocale} className={cn(editorialLinkClasses, "shrink-0")}>
            {nav("switchLanguage")}
          </Link>
        </div>
      </Container>
    </footer>
  );
}
