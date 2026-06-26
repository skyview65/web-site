import { Hero } from "@/components/hero";
import { TasEv } from "@/components/tasev";
import { Dalis } from "@/components/dalis";
import { Kapak } from "@/components/kapak";
import { Suitler } from "@/components/suitler";
import { SofraCover } from "@/components/sofra-cover";
import { Sofra } from "@/components/sofra";
import { Yorumlar } from "@/components/yorumlar";
import { Bilgiler } from "@/components/bilgiler";
import { Rezervasyon } from "@/components/rezervasyon";
import { Kapanis } from "@/components/kapanis";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <TasEv />
        <Dalis />
        <Kapak
          id="suitler"
          img="/images/suitler-kapak.jpg"
          alt="Süit, taş duvarlı oda, deniz manzarası"
          h2Id="kapak_suit_h2"
          h2Tr="SÜİTLER"
          altId="kapak_suit_alt"
          altTr="DOKUZ ODA · DOKUZ IŞIK"
        />
        <Suitler />
        <SofraCover />
        <Sofra />
        <Yorumlar />
        <Bilgiler />
        <Rezervasyon />
      </main>
      <Kapanis />
      <SiteFooter />
    </>
  );
}
