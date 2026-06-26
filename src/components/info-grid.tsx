"use client";

import { useI18n } from "@/components/language-provider";
import { Reveal } from "@/components/reveal";
import type { MessageKey } from "@/lib/i18n/messages";

const CELLS: { kKey: MessageKey; vKey?: MessageKey; vLit?: string }[] = [
  { kKey: "b_sezon_k", vKey: "b_sezon_v" },
  { kKey: "b_giris_k", vLit: "15:00 / 12:00" },
  { kKey: "b_misafir_k", vKey: "b_misafir_v" },
  { kKey: "b_ulasim_k", vKey: "b_ulasim_v" },
];

export function InfoGrid() {
  const { t } = useI18n();
  return (
    <section className="panel">
      <Reveal>
        <span
          className="etiket"
          dangerouslySetInnerHTML={{ __html: t("bilgi_tag") }}
        />
      </Reveal>
      <Reveal>
        <div className="bilgi bilgi--flush">
          {CELLS.map((c) => (
            <div key={c.kKey}>
              <div
                className="bk"
                dangerouslySetInnerHTML={{ __html: t(c.kKey) }}
              />
              {c.vKey ? (
                <div
                  className="bv serif"
                  dangerouslySetInnerHTML={{ __html: t(c.vKey) }}
                />
              ) : (
                <div className="bv serif">{c.vLit}</div>
              )}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
