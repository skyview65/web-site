"use client";

import Image from "next/image";
import { useI18n } from "@/components/i18n";

/** A title line whose inner span slides up from a clipped baseline. */
function Line({ id, tr }: { id: string; tr: string }) {
  const { t } = useI18n();
  const html = t(id) ?? tr;
  return (
    <span className="s">
      <span dangerouslySetInnerHTML={{ __html: html }} />
    </span>
  );
}

export function Hero() {
  const { t } = useI18n();
  return (
    <header className="hero">
      <Image
        className="hero-foto"
        src="/images/hero.webp"
        alt="CALA, kayalıklarda gün batımında ışıkları yanan taş otel"
        fill
        priority
        sizes="100vw"
        aria-hidden="true"
      />
      <div className="hero-shimmer" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-karart" aria-hidden="true" />
      <div className="ay-isigi" aria-hidden="true" />

      <div className="hero-ic">
        <div
          className="ust-etiket"
          dangerouslySetInnerHTML={{
            __html: t("hero_tag") ?? "KAŞ · TÜRKİYE · LİKYA KIYISI",
          }}
        />
        <h1>
          <Line id="hero_l1" tr="Saklı bir koyun üstünde," />
          <Line id="hero_l2" tr="ışığı yakalayan" />
          <Line id="hero_l3" tr="<em>dokuz süit.</em>" />
        </h1>
        <p
          dangerouslySetInnerHTML={{
            __html:
              t("hero_p") ??
              "Yalnızca yetişkinlere özel butik bir otel. Berrak bir koyun kırk metre üzerinde. Nisan'dan Kasım'a açık.",
          }}
        />
      </div>

      <div className="hero-serit">
        <span dangerouslySetInnerHTML={{ __html: t("serit_1") ?? "DOKUZ SÜİT" }} />
        <span
          dangerouslySetInnerHTML={{
            __html: t("serit_2") ?? "YALNIZCA YETİŞKİNLER",
          }}
        />
        <span
          dangerouslySetInnerHTML={{ __html: t("serit_3") ?? "SUYA 92 BASAMAK" }}
        />
      </div>
    </header>
  );
}
