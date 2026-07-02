import { LanguageProvider } from "@/components/language-provider";
import { Loader } from "@/components/loader";
import { SiteNav } from "@/components/site-nav";
import { Hero } from "@/components/hero";
import { TasEv } from "@/components/tas-ev";
import { Dalis } from "@/components/dalis";
import { KapakSuitler, Suitler } from "@/components/suitler";
import { SofraBloklar, SofraKapak } from "@/components/sofra";
import { Yorumlar } from "@/components/yorumlar";
import { Bilgi } from "@/components/bilgi";
import { Rezervasyon } from "@/components/rezervasyon";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <LanguageProvider>
      <Loader />
      <div className="bg-wash" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <SiteNav />
      <main id="main">
        <Hero />
        <TasEv />
        <Dalis />
        <KapakSuitler />
        <Suitler />
        <SofraKapak />
        <SofraBloklar />
        <Yorumlar />
        <Bilgi />
        <Rezervasyon />
      </main>
      <SiteFooter />
    </LanguageProvider>
  );
}
