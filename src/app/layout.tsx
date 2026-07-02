import type { Metadata, Viewport } from "next";
import {
  Cormorant_Garamond,
  Inter,
  JetBrains_Mono,
  Italiana,
} from "next/font/google";
import "./globals.css";

// latin-ext covers Turkish (ş, ğ, İ); cyrillic/greek cover the RU/EL locales.
// Arabic and Persian render through system fallbacks, as on the original site.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext", "cyrillic", "greek"],
  weight: ["400", "500"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jb",
  subsets: ["latin", "latin-ext", "cyrillic", "greek"],
  weight: ["400", "500"],
  display: "swap",
});

// Italiana ships latin-only; it renders just the ASCII "CALA" wordmark.
const italiana = Italiana({
  variable: "--font-italiana",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const TITLE = "CALA · Kaş'ta saklı bir koy, dokuz süit";
const DESCRIPTION =
  "Likya kıyısında, yalnızca yetişkinlere özel butik bir otel. Berrak bir koyun kırk metre üzerinde, suya 92 basamak.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "CALA",
    locale: "tr_TR",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/images/hero-koy.webp",
        width: 2200,
        height: 1430,
        alt: "CALA, kayalıklarda gün batımında ışıkları yanan taş otel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/images/hero-koy.webp"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A1322",
};

// The property is fictional (the footer says so); the structured data mirrors
// the page content for completeness.
const hotelJsonLd = {
  "@context": "https://schema.org",
  "@type": "Hotel",
  name: "CALA",
  description: DESCRIPTION,
  url: siteUrl,
  image: `${siteUrl}/images/hero-koy.webp`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kaş",
    addressRegion: "Antalya",
    addressCountry: "TR",
  },
  checkinTime: "15:00",
  checkoutTime: "12:00",
  numberOfRooms: 9,
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    bestRating: "5",
    reviewCount: "100",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${cormorant.variable} ${inter.variable} ${jetbrainsMono.variable} ${italiana.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <noscript>
          <style>{`.loader{display:none}.rv{opacity:1;transform:none}`}</style>
        </noscript>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelJsonLd) }}
        />
      </body>
    </html>
  );
}
