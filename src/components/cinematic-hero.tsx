"use client";

import { useRef } from "react";
import { LumenfallMonogram } from "@/components/icons";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import type { Dictionary } from "@/lib/i18n/dictionary";

/**
 * Scroll-pinned cinematic cover. A tall wrapper pins the key art for nearly
 * two viewports; scroll progress (--hp) scales and drifts the art while the
 * title block parallaxes away — the template's proven cover pattern.
 */
export function CinematicHero({ hero }: { hero: Dictionary["hero"] }) {
  const wrapRef = useRef<HTMLElement>(null);
  useScrollProgress(wrapRef, "--hp");

  return (
    <section ref={wrapRef} className="hero-wrap" aria-label="LUMENFALL">
      <div className="hero-pin">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="hero-media"
          src="/images/lumenfall-hero.webp"
          alt={hero.imageAlt}
          fetchPriority="high"
        />
        <div className="hero-scrim" aria-hidden="true" />

        <div className="hero-center">
          <span className="hero-kicker">{hero.kicker}</span>
          <LumenfallMonogram className="mb-6 size-14 text-neon-cyan drop-shadow-[0_0_18px_oklch(0.82_0.13_205_/_60%)] md:size-16" />
          <h1 className="hero-title">
            LUMEN
            <br />
            FALL
          </h1>
          <p className="hero-tagline">{hero.tagline}</p>
          <div className="hero-meta">
            <span className="hero-year">{hero.releaseWindow}</span>
            <span className="hero-platforms">{hero.platforms}</span>
          </div>
        </div>

        <svg
          className="hero-arrow"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </section>
  );
}
