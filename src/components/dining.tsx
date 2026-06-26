"use client";

import { useI18n } from "@/components/language-provider";
import { Reveal } from "@/components/reveal";
import type { MessageKey } from "@/lib/i18n/messages";

const MEALS: {
  img: string;
  alt: string;
  pnotKey: MessageKey;
  h3Key: MessageKey;
  pKey: MessageKey;
  saatKey: MessageKey;
}[] = [
  {
    img: "/images/breakfast.webp",
    alt: "Taş terasta kahvaltı sofrası, deniz manzarası",
    pnotKey: "bf_pnot",
    h3Key: "bf_h3",
    pKey: "bf_p",
    saatKey: "bf_saat",
  },
  {
    img: "/images/lunch.webp",
    alt: "Ahşap masada ızgara balık ve beyaz şarap, öğle yemeği",
    pnotKey: "ln_pnot",
    h3Key: "ln_h3",
    pKey: "ln_p",
    saatKey: "ln_saat",
  },
  {
    img: "/images/dinner.webp",
    alt: "Akşam tabağı: ıstakoz ve havyar, gün batımına karşı",
    pnotKey: "dn_pnot",
    h3Key: "dn_h3",
    pKey: "dn_p",
    saatKey: "dn_saat",
  },
];

export function Dining() {
  const { t } = useI18n();
  return (
    <section className="panel">
      {MEALS.map((meal) => (
        <Reveal key={meal.img}>
          <div className="blok">
            <div className="foto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={meal.img} alt={meal.alt} loading="lazy" />
              <span
                className="pnot"
                dangerouslySetInnerHTML={{ __html: t(meal.pnotKey) }}
              />
            </div>
            <h3
              className="serif"
              dangerouslySetInnerHTML={{ __html: t(meal.h3Key) }}
            />
            <p dangerouslySetInnerHTML={{ __html: t(meal.pKey) }} />
            <div
              className="saat"
              dangerouslySetInnerHTML={{ __html: t(meal.saatKey) }}
            />
          </div>
        </Reveal>
      ))}
    </section>
  );
}
