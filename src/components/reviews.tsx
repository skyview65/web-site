"use client";

import { useI18n } from "@/components/language-provider";
import { Reveal } from "@/components/reveal";
import type { MessageKey } from "@/lib/i18n/messages";

const REVIEWS: { stars: string; qKey: MessageKey; kimKey: MessageKey }[] = [
  { stars: "★★★★★", qKey: "rev_q1", kimKey: "rev_k1" },
  { stars: "★★★★★", qKey: "rev_q2", kimKey: "rev_k2" },
  { stars: "★★★★★", qKey: "rev_q3", kimKey: "rev_k3" },
  { stars: "★★★★☆", qKey: "rev_q4", kimKey: "rev_k4" },
];

export function Reviews() {
  const { t } = useI18n();
  return (
    <section id="yorumlar" className="panel">
      <div className="yorum-baslik">
        <Reveal>
          <span
            className="etiket rev-etiket"
            dangerouslySetInnerHTML={{ __html: t("rev_tag") }}
          />
        </Reveal>
        <Reveal>
          <h2
            className="buyuk rev-h2"
            dangerouslySetInnerHTML={{ __html: t("rev_h2") }}
          />
        </Reveal>
        <Reveal>
          <div
            className="puan"
            dangerouslySetInnerHTML={{ __html: t("rev_puan") }}
          />
        </Reveal>
      </div>

      <div className="yorumlar">
        {REVIEWS.map((r) => (
          <Reveal key={r.qKey}>
            <div className="yorum">
              <span className="yildizlar">{r.stars}</span>
              <q dangerouslySetInnerHTML={{ __html: t(r.qKey) }} />
              <span
                className="kim"
                dangerouslySetInnerHTML={{ __html: t(r.kimKey) }}
              />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
