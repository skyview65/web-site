"use client";

import { useI18n } from "@/components/language-provider";
import { Reveal } from "@/components/reveal";
import type { MessageKey } from "@/lib/i18n/messages";

const SUITES: { no: string; nameKey: MessageKey; m: string; oKey: MessageKey }[] = [
  { no: "01", nameKey: "s1", m: "34 m²", oKey: "o1" },
  { no: "02", nameKey: "s2", m: "36 m²", oKey: "o2" },
  { no: "03", nameKey: "s3", m: "31 m²", oKey: "o3" },
  { no: "04", nameKey: "s4", m: "40 m²", oKey: "o4" },
  { no: "05", nameKey: "s5", m: "35 m²", oKey: "o5" },
  { no: "06", nameKey: "s6", m: "42 m²", oKey: "o6" },
  { no: "07", nameKey: "s7", m: "33 m²", oKey: "o7" },
  { no: "08", nameKey: "s8", m: "38 m²", oKey: "o8" },
  { no: "09", nameKey: "s9", m: "45 m²", oKey: "o9" },
];

export function Suites() {
  const { t } = useI18n();
  return (
    <section className="panel">
      <div className="suitler">
        <Reveal>
          <span
            className="etiket"
            dangerouslySetInnerHTML={{ __html: t("suit_tag") }}
          />
        </Reveal>
        <Reveal>
          <h2
            className="buyuk suit-h2"
            dangerouslySetInnerHTML={{ __html: t("suit_h2") }}
          />
        </Reveal>
        <Reveal>
          <div
            className="suit-baslik"
            dangerouslySetInnerHTML={{ __html: t("suit_baslik") }}
          />
        </Reveal>

        {SUITES.map((s) => (
          <Reveal key={s.no}>
            <div className="suit">
              <span className="no">{s.no}</span>
              <h3
                className="serif"
                dangerouslySetInnerHTML={{ __html: t(s.nameKey) }}
              />
              <span className="m">{s.m}</span>
              <span
                className="o"
                dangerouslySetInnerHTML={{ __html: t(s.oKey) }}
              />
            </div>
          </Reveal>
        ))}

        <Reveal>
          <p
            className="suit-not"
            dangerouslySetInnerHTML={{ __html: t("suit_not") }}
          />
        </Reveal>
      </div>
    </section>
  );
}
