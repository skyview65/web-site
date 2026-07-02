"use client";

import Image from "next/image";
import { Rich, useLanguage } from "./language-provider";
import { Rv } from "./reveal";

const SUITS = [
  { no: "01", key: "s1", oKey: "o1", m: "34 m²" },
  { no: "02", key: "s2", oKey: "o2", m: "36 m²" },
  { no: "03", key: "s3", oKey: "o3", m: "31 m²" },
  { no: "04", key: "s4", oKey: "o4", m: "40 m²" },
  { no: "05", key: "s5", oKey: "o5", m: "35 m²" },
  { no: "06", key: "s6", oKey: "o6", m: "42 m²" },
  { no: "07", key: "s7", oKey: "o7", m: "33 m²" },
  { no: "08", key: "s8", oKey: "o8", m: "38 m²" },
  { no: "09", key: "s9", oKey: "o9", m: "45 m²" },
] as const;

export function KapakSuitler() {
  const { t } = useLanguage();
  return (
    <div className="kapak" id="suitler">
      <div className="k-img">
        <Image
          src="/images/suitler-kapak.jpg"
          alt="Süit, taş duvarlı oda, deniz manzarası"
          fill
          sizes="100vw"
        />
      </div>
      <h2>{t("kapak_suit_h2")}</h2>
      <svg
        className="ok-asagi"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        aria-hidden="true"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
      <span className="k-alt">{t("kapak_suit_alt")}</span>
    </div>
  );
}

export function Suitler() {
  const { t } = useLanguage();
  return (
    <section aria-label={t("suit_tag")}>
      <div className="suitler">
        <Rv as="span" className="etiket">
          {t("suit_tag")}
        </Rv>
        <Rv as="h2" className="buyuk" style={{ marginBottom: "clamp(36px,5vw,56px)" }}>
          <Rich text={t("suit_h2")} />
        </Rv>
        <Rv className="suit-baslik">{t("suit_baslik")}</Rv>

        {SUITS.map((suit) => (
          <Rv key={suit.no} className="suit">
            <span className="no">{suit.no}</span>
            <h3 className="serif">
              <Rich text={t(suit.key)} />
            </h3>
            <span className="m">{suit.m}</span>
            <span className="o">{t(suit.oKey)}</span>
          </Rv>
        ))}

        <Rv as="p" className="suit-not">
          {t("suit_not")}
        </Rv>
      </div>
    </section>
  );
}
