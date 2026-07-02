"use client";

import { Rich, useLanguage } from "./language-provider";
import { Rv } from "./reveal";
import type { Lang } from "@/lib/dictionary";

const REVIEWS = [
  { stars: 5, q: "rev_q1", k: "rev_k1" },
  { stars: 5, q: "rev_q2", k: "rev_k2" },
  { stars: 5, q: "rev_q3", k: "rev_k3" },
  { stars: 4, q: "rev_q4", k: "rev_k4" },
] as const;

// Arabic and Persian copy uses Eastern digits throughout.
const DIGIT_SETS: Partial<Record<Lang, string>> = { ar: "٠١٢٣٤٥٦٧٨٩", fa: "۰۱۲۳۴۵۶۷۸۹" };

function localDigits(n: number, lang: Lang): string {
  const set = DIGIT_SETS[lang];
  return set ? String(n).replace(/\d/g, (d) => set[Number(d)]) : String(n);
}

function Stars({ n }: { n: number }) {
  const { lang, t } = useLanguage();
  return (
    <span className="yildizlar" role="img" aria-label={t("ui_stars").replace("{n}", localDigits(n, lang))}>
      {"★".repeat(n)}
      {"☆".repeat(5 - n)}
    </span>
  );
}

export function Yorumlar() {
  const { t } = useLanguage();
  return (
    <section id="yorumlar">
      <div className="yorum-baslik">
        <Rv as="span" className="etiket" style={{ marginBottom: 18 }}>
          {t("rev_tag")}
        </Rv>
        <Rv as="h2" className="buyuk" style={{ margin: "0 auto" }}>
          <Rich text={t("rev_h2")} />
        </Rv>
        <Rv className="puan">
          <Rich text={t("rev_puan")} />
        </Rv>
      </div>

      <div className="yorumlar">
        {REVIEWS.map((review) => (
          <Rv key={review.q} className="yorum">
            <Stars n={review.stars} />
            <q>
              <Rich text={t(review.q)} />
            </q>
            <span className="kim">
              <Rich text={t(review.k)} />
            </span>
          </Rv>
        ))}
      </div>
    </section>
  );
}
