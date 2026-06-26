import Image from "next/image";
import { T } from "@/components/i18n";

/** "Taş Ev" — the editorial pair: the story of the stone house beside the cove. */
export function TasEv() {
  return (
    <section id="tasev">
      <T id="tasev_tag" tr="TAŞ EV" className="etiket rv" />
      <div className="cift">
        <div>
          <T
            id="tasev_h2"
            tr="Yol burada biter. Patika, zeytin ağaçlarının arasından <em>aşağı</em> kıvrılır."
            as="h2"
            className="buyuk rv"
          />
          <T
            id="tasev_p"
            tr="CALA, Akdeniz'de gizli bir koyun adıdır: ana yoldan görünmez, denizden güçlükle seçilir. 1960'larda bir balıkçı evi olarak inşa edilen taş yapı, özgün duvarlarına dokunulmadan dokuz süite dönüştürüldü. Amaç ilk günkü gibi: dünyadan bir süre uzaklaşmak."
            as="p"
            className="aciklama rv"
          />
        </div>
        <div className="foto cift-foto rv">
          <Image
            src="/images/tasev-koy.jpg"
            alt="Koy ve deniz"
            fill
            sizes="(max-width: 760px) 100vw, 50vw"
          />
          <T id="tasev_pnot" tr="KOY · ÖĞLEDEN SONRA" className="pnot" />
        </div>
      </div>
    </section>
  );
}
