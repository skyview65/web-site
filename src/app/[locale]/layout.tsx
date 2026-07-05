import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter_Tight, JetBrains_Mono, Orbitron } from "next/font/google";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale, localeMeta, locales } from "@/lib/i18n/locales";
import "../globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["500", "700", "900"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jb",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "600"],
});

const siteUrl = "https://lumenfall-city.example.com";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return {
    metadataBase: new URL(siteUrl),
    title: dict.meta.title,
    description: dict.meta.description,
    manifest: "/seo/site.webmanifest",
    icons: {
      icon: [
        { url: "/seo/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/seo/icon-192.png", sizes: "192x192", type: "image/png" },
      ],
      apple: [{ url: "/seo/apple-touch-icon.png", sizes: "180x180" }],
    },
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(
        locales.map((l) => [localeMeta[l].hreflang, `/${l}`]),
      ),
    },
    openGraph: {
      type: "website",
      url: `/${locale}`,
      siteName: "LUMENFALL",
      title: dict.meta.title,
      description: dict.meta.description,
      locale: localeMeta[locale].hreflang,
      images: [
        {
          url: "/seo/og.jpg",
          width: 1200,
          height: 630,
          alt: dict.meta.ogAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: ["/seo/og.jpg"],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html
      lang={localeMeta[locale].hreflang}
      dir={localeMeta[locale].dir}
      className={`${orbitron.variable} ${interTight.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
