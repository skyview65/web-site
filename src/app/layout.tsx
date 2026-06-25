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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cala-kas.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "CALA · Sofra — THE TABLE",
  description:
    "Kaş'ta gizli bir koyda, denize bakan dokuz oda. Sofra denizden ve bahçeden kurulur — kahvaltıdan gün batımı akşam yemeğine.",
  openGraph: {
    title: "CALA · Sofra — THE TABLE",
    description:
      "Denizden ve bahçeden. Kaş'ta gizli bir koyda kurulan sofra; kahvaltı, öğle ve tek oturumluk akşam yemeği.",
    siteName: "CALA",
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "/images/sofra-hero.webp",
        width: 1600,
        height: 893,
        alt: "CALA · Kaş — denize karşı kurulu akşam sofrası, mavi saat",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CALA · Sofra — THE TABLE",
    description: "Denizden ve bahçeden. Kaş'ta gizli bir koyda kurulan sofra.",
    images: ["/images/sofra-hero.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a1322",
  colorScheme: "dark",
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
