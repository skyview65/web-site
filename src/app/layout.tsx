import type { Metadata, Viewport } from "next";
import {
  Cormorant_Garamond,
  Inter,
  JetBrains_Mono,
  Italiana,
} from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { siteUrl } from "@/lib/site";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jb",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const italiana = Italiana({
  variable: "--font-italiana",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "CALA · Sofra — THE TABLE",
  description:
    "Kaş'ta gizli bir koyda, denize bakan dokuz oda. Sofra denizden ve bahçeden kurulur — kahvaltıdan gün batımı akşam yemeğine.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "CALA · Sofra — THE TABLE",
    description:
      "Denizden ve bahçeden. Kaş'ta gizli bir koyda kurulan sofra; kahvaltı, öğle ve tek oturumluk akşam yemeği.",
    siteName: "CALA",
    locale: "tr_TR",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "CALA · Sofra — THE TABLE",
    description: "Denizden ve bahçeden. Kaş'ta gizli bir koyda kurulan sofra.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a1322",
  colorScheme: "dark",
};

const restaurantJsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "CALA",
  description:
    "Kaş'ta gizli bir koyda, denize bakan dokuz oda. Sofra denizden ve bahçeden kurulur.",
  servesCuisine: ["Mediterranean", "Turkish", "Seafood"],
  priceRange: "$$$",
  image: `${siteUrl}/opengraph-image.jpg`,
  url: siteUrl,
  acceptsReservations: true,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Çukurbağ Yarımadası",
    addressLocality: "Kaş",
    addressRegion: "Antalya",
    postalCode: "07580",
    addressCountry: "TR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 36.1975,
    longitude: 29.6256,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "11:30",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday"],
      opens: "08:00",
      closes: "12:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "12:30",
      closes: "15:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "19:30",
      closes: "23:00",
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
        />
        <a className="skip-link" href="#icerik">
          İçeriğe geç
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
