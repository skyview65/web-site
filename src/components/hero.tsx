"use client";

import { Msg } from "@/components/language-provider";

export function Hero() {
  return (
    <header className="hero">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="hero-foto"
        src="/images/cala-hero.webp"
        alt="CALA, kayalıklarda gün batımında ışıkları yanan taş otel"
        aria-hidden="true"
      />
      <div className="hero-shimmer" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-rim" aria-hidden="true" />
      <div className="hero-karart" aria-hidden="true" />
      <div className="ay-isigi" aria-hidden="true" />

      <div className="hero-ic">
        <Msg as="div" className="ust-etiket" k="hero_tag" />
        <h1>
          <span className="s">
            <Msg k="hero_l1" />
          </span>
          <span className="s">
            <Msg k="hero_l2" />
          </span>
          <span className="s">
            <Msg k="hero_l3" />
          </span>
        </h1>
        <Msg as="p" k="hero_p" />
      </div>

      <div className="hero-serit">
        <Msg k="serit_1" />
        <Msg k="serit_2" />
        <Msg k="serit_3" />
      </div>
    </header>
  );
}
