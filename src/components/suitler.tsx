import { T } from "@/components/i18n";

const SUITES = [
  { no: "01", id: "s1", tr: "Seher<i>ilk aydınlık</i>", m: "34 m²", oId: "o1", oTr: "DENİZ CEPHESİ" },
  { no: "02", id: "s2", tr: "Şafak<i>kızıl doğuş</i>", m: "36 m²", oId: "o2", oTr: "DENİZ CEPHESİ" },
  { no: "03", id: "s3", tr: "Kuşluk<i>sabah sıcağı</i>", m: "31 m²", oId: "o3", oTr: "BAHÇE" },
  { no: "04", id: "s4", tr: "Öğle<i>dik ışık</i>", m: "40 m²", oId: "o4", oTr: "TERAS + KÜVET" },
  { no: "05", id: "s5", tr: "İkindi<i>uzayan gölge</i>", m: "35 m²", oId: "o5", oTr: "DENİZ CEPHESİ" },
  { no: "06", id: "s6", tr: "Gurup<i>batış saati</i>", m: "42 m²", oId: "o6", oTr: "BATI TERASI" },
  { no: "07", id: "s7", tr: "Alacakaranlık<i>iki ışık arası</i>", m: "33 m²", oId: "o7", oTr: "BAHÇE" },
  { no: "08", id: "s8", tr: "Mehtap<i>ay yolu</i>", m: "38 m²", oId: "o8", oTr: "DENİZ CEPHESİ" },
  { no: "09", id: "s9", tr: "Yıldız<i>çatı penceresi</i>", m: "45 m²", oId: "o9", oTr: "ÇATI SÜİTİ" },
];

/** "Süitler" — nine rooms named for the nine lights of the day. */
export function Suitler() {
  return (
    <section>
      <div className="suitler">
        <T id="suit_tag" tr="DOKUZ SÜİT" className="etiket rv" />
        <T
          id="suit_h2"
          tr="Her süit, günün başka bir <em>ışığını</em> yakalar."
          as="h2"
          className="buyuk rv"
          style={{ marginBottom: "clamp(36px,5vw,56px)" }}
        />
        <T id="suit_baslik" tr="SÜİTLERİMİZ" className="suit-baslik rv" />

        {SUITES.map((s) => (
          <div className="suit rv" key={s.no}>
            <span className="no">{s.no}</span>
            <T id={s.id} tr={s.tr} as="h3" className="serif" />
            <span className="m">{s.m}</span>
            <T id={s.oId} tr={s.oTr} className="o" />
          </div>
        ))}

        <T
          id="suit_not"
          tr="Hiçbir süitte televizyon yoktur. Hepsinde gün boyu değişen ışığı izleyecek bir köşe vardır."
          as="p"
          className="suit-not rv"
        />
      </div>
    </section>
  );
}
