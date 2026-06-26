import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Inter,
  JetBrains_Mono,
  Italiana,
} from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/components/i18n";
import { IridescentBackground } from "@/components/iridescent-background";
import { Grain } from "@/components/grain";
import { Loader } from "@/components/loader";
import { Nav } from "@/components/nav";
import { RevealObserver } from "@/components/reveal";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
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
  title: "CALA · Kaş'ta saklı bir koy, dokuz süit",
  description:
    "Likya kıyısında, yalnızca yetişkinlere özel butik bir otel. Berrak bir koyun kırk metre üzerinde, suya 92 basamak.",
  metadataBase: new URL("https://cala-kas.com"),
  openGraph: {
    title: "CALA · Kaş'ta saklı bir koy, dokuz süit",
    description:
      "Yalnızca yetişkinlere özel butik bir otel. Berrak bir koyun kırk metre üzerinde. Nisan'dan Kasım'a açık.",
    type: "website",
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
        <I18nProvider>
          <IridescentBackground />
          <div className="bg-wash" aria-hidden="true" />
          <Grain />
          <Loader />
          <Nav />
          {children}
          <RevealObserver />
        </I18nProvider>
      </body>
    </html>
  );
}
