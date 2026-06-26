"use client";

import { useI18n } from "@/components/language-provider";
import { Reveal } from "@/components/reveal";

export function Reservation() {
  const { t } = useI18n();
  return (
    <section id="rezervasyon" className="panel">
      <Reveal>
        <span
          className="etiket"
          dangerouslySetInnerHTML={{ __html: t("rez_tag") }}
        />
      </Reveal>
      <Reveal>
        <h2 dangerouslySetInnerHTML={{ __html: t("rez_h2") }} />
      </Reveal>
      <Reveal>
        <a className="rez-cta" href="mailto:rezervasyon@cala-kas.com">
          <span dangerouslySetInnerHTML={{ __html: t("rez_cta") }} />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M3 12h18M14 5l7 7-7 7" />
          </svg>
        </a>
      </Reveal>
      <Reveal>
        <div
          className="rez-detay"
          dangerouslySetInnerHTML={{ __html: t("rez_detay") }}
        />
      </Reveal>
    </section>
  );
}
