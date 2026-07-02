"use client";

import Image from "next/image";
import { Rich, useLanguage } from "./language-provider";
import { Rv } from "./reveal";

export function TasEv() {
  const { t } = useLanguage();
  return (
    <section id="tasev">
      <Rv as="span" className="etiket">
        {t("tasev_tag")}
      </Rv>
      <div className="cift">
        <div>
          <Rv as="h2" className="buyuk">
            <Rich text={t("tasev_h2")} />
          </Rv>
          <Rv as="p" className="aciklama">
            {t("tasev_p")}
          </Rv>
        </div>
        <Rv className="foto">
          <Image
            src="/images/tasev-koy.jpg"
            alt="Koy ve deniz"
            fill
            sizes="(max-width: 760px) 100vw, 48vw"
          />
          <span className="pnot">{t("tasev_pnot")}</span>
        </Rv>
      </div>
    </section>
  );
}
