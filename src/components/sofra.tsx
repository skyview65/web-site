"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Rich, useLanguage } from "./language-provider";
import { Rv } from "./reveal";

/**
 * SOFRA — scroll-scrubbed sticky video cover. As the tall wrapper scrolls
 * through the viewport, a lerp-smoothed 0→1 progress is exposed as the CSS
 * variable --sp; globals.css scales/drifts the video, deepens the vignette
 * and parallaxes the title. The video now streams from /videos/sofra.mp4 —
 * the original decoded a 21 MB base64 blob on the main thread at page load.
 */
export function SofraKapak() {
  const { t } = useLanguage();
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const video = videoRef.current;
    let videoIo: IntersectionObserver | undefined;
    if (video) {
      videoIo = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              video.play().catch(() => {});
            } else {
              video.pause();
            }
          });
        },
        { threshold: 0.1 },
      );
      videoIo.observe(wrap);
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      wrap.style.setProperty("--sp", "0");
      return () => videoIo?.disconnect();
    }

    let target = 0;
    let cur = 0;
    let raf = 0;
    let active = false;

    const measure = () => {
      const rect = wrap.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const p = travel > 0 ? -rect.top / travel : 0;
      target = Math.min(1, Math.max(0, p));
    };
    const tick = () => {
      measure();
      cur += (target - cur) * 0.09;
      if (Math.abs(target - cur) < 0.0004) cur = target;
      wrap.style.setProperty("--sp", cur.toFixed(4));
      if (active || Math.abs(target - cur) > 0.0004) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const scrubIo = new IntersectionObserver(
      (entries) => {
        active = entries[0].isIntersecting;
        if (active) kick();
      },
      { rootMargin: "200px 0px 200px 0px", threshold: 0 },
    );
    scrubIo.observe(wrap);
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    kick();

    return () => {
      scrubIo.disconnect();
      videoIo?.disconnect();
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrapRef} className="kapak" id="sofra">
      <div className="sofra-sticky">
        <div className="k-img">
          <Image
            src="/images/sofra-fallback.jpg"
            alt="Akşam sofrası, deniz manzarası"
            fill
            sizes="100vw"
          />
          <video
            ref={videoRef}
            className="sofra-video"
            src="/videos/sofra.mp4"
            poster="/images/sofra-poster.webp"
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
        </div>
        <h2>{t("kapak_sofra_h2")}</h2>
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
        <span className="k-alt">{t("kapak_sofra_alt")}</span>
        <div className="sofra-vig" aria-hidden="true" />
        <div className="sofra-line" aria-hidden="true" />
      </div>
    </div>
  );
}

const MEALS = [
  {
    img: "/images/kahvalti.webp",
    alt: "Taş terasta kahvaltı sofrası, deniz manzarası",
    pnot: "bf_pnot",
    h3: "bf_h3",
    p: "bf_p",
    saat: "bf_saat",
  },
  {
    img: "/images/ogle-yemegi.webp",
    alt: "Ahşap masada ızgara balık ve beyaz şarap, öğle yemeği",
    pnot: "ln_pnot",
    h3: "ln_h3",
    p: "ln_p",
    saat: "ln_saat",
  },
  {
    img: "/images/aksam-yemegi.webp",
    alt: "Akşam tabağı: ıstakoz ve havyar, gün batımına karşı",
    pnot: "dn_pnot",
    h3: "dn_h3",
    p: "dn_p",
    saat: "dn_saat",
  },
] as const;

export function SofraBloklar() {
  const { t } = useLanguage();
  return (
    <section aria-label={t("kapak_sofra_h2")}>
      {MEALS.map((meal) => (
        <Rv key={meal.h3} className="blok">
          <div className="foto">
            <Image
              src={meal.img}
              alt={meal.alt}
              fill
              sizes="(max-width: 1500px) 100vw, 1500px"
            />
            <span className="pnot">{t(meal.pnot)}</span>
          </div>
          <h3 className="serif">{t(meal.h3)}</h3>
          <p>{t(meal.p)}</p>
          <div className="saat">
            <Rich text={t(meal.saat)} />
          </div>
        </Rv>
      ))}
    </section>
  );
}
