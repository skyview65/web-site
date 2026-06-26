import Image from "next/image";
import { T } from "@/components/i18n";

const MEALS = [
  {
    img: "/images/kahvalti.webp",
    alt: "Taş terasta kahvaltı sofrası, deniz manzarası",
    pnotId: "bf_pnot",
    pnotTr: "TAŞ TERAS · SABAH",
    h3Id: "bf_h3",
    h3Tr: "KAHVALTI",
    pId: "bf_p",
    pTr: "Kahvaltı taş terasta, geç saatlere dek servis edilir. Bahçeden domates ve taze otlar, köy yumurtası, odun fırınından ekmek, Kaş'ın balı ve keçi peyniri; demlikte çay, közde pişen kahve.",
    saatId: "bf_saat",
    saatTr: "Hafta içi&nbsp;&nbsp;08:00 – 11:30<br>Hafta sonu&nbsp;&nbsp;08:00 – 12:00",
  },
  {
    img: "/images/ogle.webp",
    alt: "Ahşap masada ızgara balık ve beyaz şarap, öğle yemeği",
    pnotId: "ln_pnot",
    pnotTr: "ÖĞLE · MANZARAYA KARŞI",
    h3Id: "ln_h3",
    h3Tr: "ÖĞLE YEMEĞİ",
    pId: "ln_p",
    pTr: "Öğle yemeği hafif tutulur: günün taze balığının ızgarası, bahçeden yeşillikler, taş fırından ekmek. Masalar gölgede, denize karşı kurulur; zaman tamamen size aittir.",
    saatId: "ln_saat",
    saatTr: "Her gün&nbsp;&nbsp;12:30 – 15:00",
  },
  {
    img: "/images/aksam.webp",
    alt: "Akşam tabağı: ıstakoz ve havyar, gün batımına karşı",
    pnotId: "dn_pnot",
    pnotTr: "AKŞAM TABAĞI · ISTAKOZ VE HAVYAR",
    h3Id: "dn_h3",
    h3Tr: "AKŞAM YEMEĞİ",
    pId: "dn_p",
    pTr: "Akşam yemeğinde tek bir menü sunulur: o sabah denizden ve bahçeden gelen en iyi ürünlerle hazırlanır. Gün batımında, tek oturumda servis edilir. Menü her akşam mutfağın kapısına tebeşirle yazılır. Masanızın ayrılması için aynı gün 16:00'ya kadar bildirmeniz yeterlidir.",
    saatId: "dn_saat",
    saatTr: "Her akşam&nbsp;&nbsp;19:30 · Tek oturum<br>Nisan – Kasım",
  },
];

/** The three meals of the day — breakfast, lunch, dinner. */
export function Sofra() {
  return (
    <section className="sofra-content">
      {MEALS.map((m) => (
        <div className="blok rv" key={m.h3Id}>
          <div className="foto">
            <Image
              src={m.img}
              alt={m.alt}
              fill
              sizes="(max-width: 720px) 100vw, 680px"
            />
            <T id={m.pnotId} tr={m.pnotTr} className="pnot" />
          </div>
          <T id={m.h3Id} tr={m.h3Tr} as="h3" className="serif" />
          <T id={m.pId} tr={m.pTr} as="p" />
          <T id={m.saatId} tr={m.saatTr} className="saat" />
        </div>
      ))}
    </section>
  );
}
