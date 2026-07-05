import type { MetadataRoute } from "next";
import { localeMeta, locales } from "@/lib/i18n/locales";

const siteUrl = "https://lumenfall-city.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    locales.map((l) => [localeMeta[l].hreflang, `${siteUrl}/${l}`]),
  );

  return locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    changeFrequency: "weekly",
    priority: locale === "tr" ? 1 : 0.8,
    alternates: { languages },
  }));
}
