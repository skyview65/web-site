"use client";

import Image from "next/image";
import { Rich, useLanguage } from "./language-provider";

export function Hero() {
  const { t } = useLanguage();
  return (
    <header className="hero">
      <Image
        className="hero-foto"
        src="/images/hero-koy.webp"
        alt="CALA, kayalıklarda gün batımında ışıkları yanan taş otel"
        fill
        priority
        sizes="100vw"
      />
      <div className="hero-shimmer" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-karart" aria-hidden="true" />
      <div className="ay-isigi" aria-hidden="true" />
      <div className="hero-ic">
        <div className="ust-etiket">{t("hero_tag")}</div>
        <h1>
          <span className="s">
            <span>
              <Rich text={t("hero_l1")} />
            </span>
          </span>
          <span className="s">
            <span>
              <Rich text={t("hero_l2")} />
            </span>
          </span>
          <span className="s">
            <span>
              <Rich text={t("hero_l3")} />
            </span>
          </span>
        </h1>
        <p>{t("hero_p")}</p>
      </div>
      <div className="hero-serit">
        <span>{t("serit_1")}</span>
        <span>{t("serit_2")}</span>
        <span>{t("serit_3")}</span>
      </div>
    </header>
  );
}
