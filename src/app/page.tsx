import { SofraCover } from "@/components/sofra-cover";
import { Reveal } from "@/components/reveal";

export default function Home() {
  return (
    <main id="icerik">
      <SofraCover />

      <section className="ethos" aria-label="CALA hakkında">
        <div className="rule" aria-hidden="true" />
        <span className="eyebrow">CALA · KAŞ</span>
        <h2>Denizden ve bahçeden.</h2>
        <p>
          Kaş&apos;ın saklı bir koyunda, denize inen taş teraslarda küçük bir
          yer. Gün burada üç sofrayla ölçülür: sabahın ışığı, öğlenin gölgesi ve
          akşamın tek ateşi. Sofraya gelen her şey, o sabah denizden ve bahçeden
          toplanır.
        </p>
      </section>

      <section className="sofra-content">
        <div className="meals">
          <Reveal id="kahvalti" className="blok">
            <div className="foto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/kahvalti.webp"
                alt="Kahvaltı · taş terasta, sabah ışığı"
                loading="lazy"
              />
              <span className="pnot">TAŞ TERAS · SABAH</span>
            </div>
            <div className="meal__body">
              <div className="meal__head">
                <span className="meal__index">I</span>
                <span className="meal__eyebrow">Sabah · taş teras</span>
              </div>
              <h2 className="meal__title">KAHVALTI</h2>
              <p className="meal__desc">
                Kahvaltı taş terasta, geç saatlere dek servis edilir. Bahçeden
                domates ve taze otlar, köy yumurtası, odun fırınından ekmek,
                Kaş&apos;ın balı ve keçi peyniri; demlikte çay, közde pişen
                kahve.
              </p>
              <div className="meal__hours">
                Hafta içi&nbsp;&nbsp;08:00 – 11:30
                <br />
                Hafta sonu&nbsp;&nbsp;08:00 – 12:00
              </div>
            </div>
          </Reveal>

          <Reveal id="ogle" className="blok">
            <div className="foto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/ogle.webp"
                alt="Öğle yemeği · denize karşı, gölgede"
                loading="lazy"
              />
              <span className="pnot">ÖĞLE · MANZARAYA KARŞI</span>
            </div>
            <div className="meal__body">
              <div className="meal__head">
                <span className="meal__index">II</span>
                <span className="meal__eyebrow">Öğlen · manzaraya karşı</span>
              </div>
              <h2 className="meal__title">ÖĞLE YEMEĞİ</h2>
              <p className="meal__desc">
                Öğle yemeği hafif tutulur: günün taze balığının ızgarası,
                bahçeden yeşillikler, taş fırından ekmek. Masalar gölgede, denize
                karşı kurulur; zaman tamamen size aittir.
              </p>
              <div className="meal__hours">Her gün&nbsp;&nbsp;12:30 – 15:00</div>
            </div>
          </Reveal>

          <Reveal id="aksam" className="blok">
            <div className="foto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/aksam.webp"
                alt="Akşam tabağı · ıstakoz ve havyar"
                loading="lazy"
              />
              <span className="pnot">AKŞAM TABAĞI · ISTAKOZ VE HAVYAR</span>
            </div>
            <div className="meal__body">
              <div className="meal__head">
                <span className="meal__index">III</span>
                <span className="meal__eyebrow">Akşam · gün batımı</span>
              </div>
              <h2 className="meal__title">AKŞAM YEMEĞİ</h2>
              <p className="meal__desc">
                Akşam yemeğinde tek bir menü sunulur: o sabah denizden ve
                bahçeden gelen en iyi ürünlerle hazırlanır. Gün batımında, tek
                oturumda servis edilir. Menü her akşam mutfağın kapısına
                tebeşirle yazılır.
              </p>
              <div className="meal__hours">
                Her akşam&nbsp;&nbsp;19:30 · Tek oturum
                <br />
                Nisan – Kasım
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="rezervasyon" className="reserve" aria-label="Rezervasyon">
        <div className="reserve__inner">
          <div className="rule" aria-hidden="true" />
          <span className="eyebrow">Rezervasyon</span>
          <h2>Akşam, tek oturum.</h2>
          <p>
            Akşam yemeği her akşam gün batımında, tek oturumda servis edilir.
            Menü o günün denizine ve bahçesine göre yazılır. Masanızı ayırmak
            için aynı gün 16:00&apos;ya kadar bize ulaşmanız yeterli.
          </p>
          <div className="reserve__actions">
            <a className="btn btn--gold" href="mailto:rezervasyon@cala-kas.com">
              E-posta ile yazın
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <a className="btn btn--ghost" href="tel:+902420000000">
              +90 242 000 00 00
            </a>
          </div>
          <div className="reserve__meta">
            Her akşam&nbsp;19:30 · Tek oturum
            <br />
            Nisan – Kasım
          </div>
        </div>
      </section>
    </main>
  );
}
