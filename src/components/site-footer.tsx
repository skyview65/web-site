"use client";

import { useI18n } from "@/components/language-provider";

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer>
      <span className="fm">CALA</span>
      <span dangerouslySetInnerHTML={{ __html: t("footer_loc") }} />
      <span dangerouslySetInnerHTML={{ __html: t("footer_soc") }} />
      <span className="kurgu" dangerouslySetInnerHTML={{ __html: t("footer_kurgu") }} />
      <span className="atelance" lang="en">
        <span className="by">Designed by</span>{" "}
        <span className="studio">Atelance</span>
      </span>
    </footer>
  );
}
