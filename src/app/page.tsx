import { SofraCover } from "@/components/sofra-cover";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <main>
      <SofraCover />

      <section className="sofra-content">
        <Reveal className="blok">
          <div className="foto">
            <span className="pnot">TAŞ TERAS · SABAH</span>
          </div>
          <h3>KAHVALTI</h3>
          <p>
            Kahvaltı taş terasta, geç saatlere dek servis edilir. Bahçeden
            domates ve taze otlar, köy yumurtası, odun fırınından ekmek, Kaş&apos;ın
            balı ve keçi peyniri; demlikte çay, közde pişen kahve.
          </p>
          <div className="saat">
            Hafta içi&nbsp;&nbsp;08:00 – 11:30
            <br />
            Hafta sonu&nbsp;&nbsp;08:00 – 12:00
          </div>
        </Reveal>

        <Reveal className="blok">
          <div className="foto">
            <span className="pnot">ÖĞLE · MANZARAYA KARŞI</span>
          </div>
          <h3>ÖĞLE YEMEĞİ</h3>
          <p>
            Öğle yemeği hafif tutulur: günün taze balığının ızgarası, bahçeden
            yeşillikler, taş fırından ekmek. Masalar gölgede, denize karşı
            kurulur; zaman tamamen size aittir.
          </p>
          <div className="saat">Her gün&nbsp;&nbsp;12:30 – 15:00</div>
        </Reveal>

        <Reveal className="blok">
          <div className="foto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/sofra-poster.webp" alt="Akşam tabağı · ıstakoz ve havyar" />
            <span className="pnot">AKŞAM TABAĞI · ISTAKOZ VE HAVYAR</span>
          </div>
          <h3>AKŞAM YEMEĞİ</h3>
          <p>
            Akşam yemeğinde tek bir menü sunulur: o sabah denizden ve bahçeden
            gelen en iyi ürünlerle hazırlanır. Gün batımında, tek oturumda servis
            edilir. Menü her akşam mutfağın kapısına tebeşirle yazılır. Masanızın
            ayrılması için aynı gün 16:00&apos;ya kadar bildirmeniz yeterlidir.
          </p>
          <div className="saat">
            Her akşam&nbsp;&nbsp;19:30 · Tek oturum
            <br />
            Nisan – Kasım
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </main>
  );
}
