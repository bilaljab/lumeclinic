import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";
import { fontVariables } from "@/lib/fonts";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StickyMobileCta } from "@/components/layout/StickyMobileCta";
import { SkipLink } from "@/components/layout/SkipLink";
import { ScrollCraftMount } from "@/components/motion/ScrollCraftMount";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: `${siteConfig.brandName} — ${siteConfig.tagline[locale as "en" | "ar"]}`,
    description: siteConfig.metaDescription[locale as "en" | "ar"],
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "a11y" });
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} className={fontVariables}>
      <body className="min-h-screen pb-20 antialiased md:pb-0">
        <NextIntlClientProvider>
          <ScrollCraftMount />
          <SkipLink label={t("skipToContent")} targetId="main-content" />
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
          <StickyMobileCta />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
