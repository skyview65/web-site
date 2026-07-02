"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "./language-provider";

/**
 * "Koya dalış" — a pinned, looping underwater video. Playback is driven by an
 * IntersectionObserver so the clip only runs while the section is on screen.
 */
export function Dalis() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.12 },
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="dalis" id="dalis" aria-label={t("dalis_tag")}>
      <div className="dalis-sticky">
        <video
          ref={videoRef}
          className="dalis-video"
          src="/videos/dalis.mp4"
          poster="/images/dalis-poster.jpg"
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
        <div className="dalis-karart" aria-hidden="true" />
        <div className="dalis-yazi">
          <span className="d-etiket">{t("dalis_tag")}</span>
          <h2 className="d-baslik serif">{t("dalis_h2")}</h2>
          <p className="d-alt">{t("dalis_alt")}</p>
        </div>
      </div>
    </section>
  );
}
