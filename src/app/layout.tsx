import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Inter,
  JetBrains_Mono,
  Italiana,
} from "next/font/google";
import "./globals.css";
import { Iridescence } from "@/components/iridescence";
import { Loader } from "@/components/loader";
import { SectionRail } from "@/components/section-rail";
import { RevealController } from "@/components/reveal-controller";
import { LanguageProvider } from "@/components/language-provider";

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
        <LanguageProvider>
          <Iridescence />
          <div className="grain" aria-hidden="true" />
          <Loader />
          {children}
          <SectionRail />
          <RevealController />
        </LanguageProvider>
      </body>
    </html>
  );
}
