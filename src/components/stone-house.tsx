"use client";

import { useI18n } from "@/components/language-provider";
import { Reveal } from "@/components/reveal";

export function StoneHouse() {
  const { t } = useI18n();
  return (
    <section id="tasev" className="panel">
      <Reveal>
        <span
          className="etiket"
          dangerouslySetInnerHTML={{ __html: t("tasev_tag") }}
        />
      </Reveal>
      <div className="cift">
        <div>
          <Reveal>
            <h2
              className="buyuk"
              dangerouslySetInnerHTML={{ __html: t("tasev_h2") }}
            />
          </Reveal>
          <Reveal>
            <p
              className="aciklama"
              dangerouslySetInnerHTML={{ __html: t("tasev_p") }}
            />
          </Reveal>
        </div>
        <Reveal>
          <div className="foto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/cove.jpg" alt="Koy ve deniz" loading="lazy" />
            <span
              className="pnot"
              dangerouslySetInnerHTML={{ __html: t("tasev_pnot") }}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
