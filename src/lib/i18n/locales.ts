export const locales = [
  "tr",
  "en",
  "de",
  "fr",
  "es",
  "it",
  "pt",
  "ru",
  "ar",
  "ja",
  "ko",
  "zh",
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "tr";

export interface LocaleMeta {
  /** Native name shown in the language switcher */
  label: string;
  dir: "ltr" | "rtl";
  /** BCP 47 tag used for <html lang> and hreflang alternates */
  hreflang: string;
}

export const localeMeta: Record<Locale, LocaleMeta> = {
  tr: { label: "Türkçe", dir: "ltr", hreflang: "tr" },
  en: { label: "English", dir: "ltr", hreflang: "en" },
  de: { label: "Deutsch", dir: "ltr", hreflang: "de" },
  fr: { label: "Français", dir: "ltr", hreflang: "fr" },
  es: { label: "Español", dir: "ltr", hreflang: "es" },
  it: { label: "Italiano", dir: "ltr", hreflang: "it" },
  pt: { label: "Português", dir: "ltr", hreflang: "pt" },
  ru: { label: "Русский", dir: "ltr", hreflang: "ru" },
  ar: { label: "العربية", dir: "rtl", hreflang: "ar" },
  ja: { label: "日本語", dir: "ltr", hreflang: "ja" },
  ko: { label: "한국어", dir: "ltr", hreflang: "ko" },
  zh: { label: "中文", dir: "ltr", hreflang: "zh" },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
