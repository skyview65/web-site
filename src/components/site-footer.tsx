"use client";

import { useLanguage } from "./language-provider";

export function SiteFooter() {
  const { t } = useLanguage();
  return (
    <>
      <div className="kapanis" aria-hidden="true">
        <span className="marka">CALA</span>
      </div>
      <footer>
        <span className="fm">CALA</span>
        <span>{t("footer_loc")}</span>
        <span>
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
            {t("footer_instagram")}
          </a>
          {"  ·  "}
          <a href="#">{t("footer_journal")}</a>
          {"  ·  "}© CALA 2026
        </span>
        <span className="kurgu">{t("footer_kurgu")}</span>
        <span className="atelance">
          <span className="by">{t("ui_designed_by")}</span>{" "}
          <span className="studio">Atelance</span>
        </span>
      </footer>
    </>
  );
}
