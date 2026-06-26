import { T } from "@/components/i18n";

/** "Bilgiler" — the practical grid: season, check-in, guests, access. */
export function Bilgiler() {
  return (
    <section>
      <T id="bilgi_tag" tr="BİLGİLER" className="etiket rv" />
      <div className="bilgi rv" style={{ marginTop: 0 }}>
        <div>
          <T id="b_sezon_k" tr="SEZON" className="bk" />
          <T id="b_sezon_v" tr="Nisan'dan Kasım'a" className="bv serif" />
        </div>
        <div>
          <T id="b_giris_k" tr="GİRİŞ / ÇIKIŞ" className="bk" />
          <div className="bv serif">15:00 / 12:00</div>
        </div>
        <div>
          <T id="b_misafir_k" tr="MİSAFİR" className="bk" />
          <T id="b_misafir_v" tr="Yalnızca yetişkinler" className="bv serif" />
        </div>
        <div>
          <T id="b_ulasim_k" tr="ULAŞIM" className="bk" />
          <T id="b_ulasim_v" tr="Kaş merkeze 14 dk" className="bv serif" />
        </div>
      </div>
    </section>
  );
}
