import { siteConfig } from "@/config/site";
import type { LocalizedText } from "@/data/types";

/** Builds a wa.me deep link with a contextual, prefilled, locale-aware message. */
export function buildWhatsAppLink(
  locale: keyof LocalizedText,
  message?: LocalizedText,
): string {
  const text = message?.[locale];
  const query = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${siteConfig.contact.whatsappNumber}${query}`;
}

export function treatmentWhatsAppMessage(treatmentName: LocalizedText): LocalizedText {
  return {
    en: `Hi LUMÉ, I'd like to ask about ${treatmentName.en}.`,
    ar: `مرحباً ⁦LUMÉ⁩، أود الاستفسار عن ${treatmentName.ar}.`,
  };
}

export function doctorWhatsAppMessage(doctorName: LocalizedText): LocalizedText {
  return {
    en: `Hi LUMÉ, I'd like to book a consultation with ${doctorName.en}.`,
    ar: `مرحباً ⁦LUMÉ⁩، أود حجز استشارة مع ${doctorName.ar}.`,
  };
}

export function packageWhatsAppMessage(packageName: LocalizedText): LocalizedText {
  return {
    en: `Hi LUMÉ, I'd like to learn more about ${packageName.en}.`,
    ar: `مرحباً ⁦LUMÉ⁩، أود معرفة المزيد عن ${packageName.ar}.`,
  };
}

export function bookingWhatsAppMessage(treatmentName: LocalizedText | null): LocalizedText {
  return {
    en: treatmentName
      ? `Hi LUMÉ, I just requested a consultation for ${treatmentName.en} and wanted to follow up.`
      : `Hi LUMÉ, I just requested a consultation and wanted to follow up.`,
    ar: treatmentName
      ? `مرحباً ⁦LUMÉ⁩، أرسلت للتو طلب استشارة بخصوص ${treatmentName.ar} وأود المتابعة.`
      : `مرحباً ⁦LUMÉ⁩، أرسلت للتو طلب استشارة وأود المتابعة.`,
  };
}
