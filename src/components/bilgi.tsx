"use client";

import { useLanguage } from "./language-provider";
import { Rv } from "./reveal";

export function Bilgi() {
  const { t } = useLanguage();
  return (
    <section aria-label={t("bilgi_tag")}>
      <Rv as="span" className="etiket">
        {t("bilgi_tag")}
      </Rv>
      <Rv className="bilgi">
        <div>
          <div className="bk">{t("b_sezon_k")}</div>
          <div className="bv serif">{t("b_sezon_v")}</div>
        </div>
        <div>
          <div className="bk">{t("b_giris_k")}</div>
          <div className="bv serif">15:00 / 12:00</div>
        </div>
        <div>
          <div className="bk">{t("b_misafir_k")}</div>
          <div className="bv serif">{t("b_misafir_v")}</div>
        </div>
        <div>
          <div className="bk">{t("b_ulasim_k")}</div>
          <div className="bv serif">{t("b_ulasim_v")}</div>
        </div>
      </Rv>
    </section>
  );
}
