import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { StoneHouse } from "@/components/stone-house";
import { Dive } from "@/components/dive";
import { Cover } from "@/components/cover";
import { Suites } from "@/components/suites";
import { SofraCover } from "@/components/sofra-cover";
import { Dining } from "@/components/dining";
import { Reviews } from "@/components/reviews";
import { InfoGrid } from "@/components/info-grid";
import { Reservation } from "@/components/reservation";
import { Closing } from "@/components/closing";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <StoneHouse />
        <Dive />
        <Cover
          id="suitler"
          src="/images/suite-cover.jpg"
          alt="Süit, taş duvarlı oda, deniz manzarası"
          titleKey="kapak_suit_h2"
          captionKey="kapak_suit_alt"
        />
        <Suites />
        <SofraCover />
        <Dining />
        <Reviews />
        <InfoGrid />
        <Reservation />
        <Closing />
      </main>
      <SiteFooter />
    </>
  );
}
