"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/components/language-provider";

/**
 * The cove dive — a pinned, looping underwater video (sticky inside a tall
 * wrapper) with an overlaid caption. Plays only while in view.
 */
export function Dive() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    const vid = videoRef.current;
    if (!el || !vid) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const p = vid.play();
            if (p) p.catch(() => {});
          } else {
            vid.pause();
          }
        });
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="dalis" id="dalis" ref={ref} aria-label="Koya dalış">
      <div className="dalis-sticky">
        <video
          className="dalis-video"
          ref={videoRef}
          poster="/images/dalis-poster.jpg"
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/videos/dalis.mp4" type="video/mp4" />
        </video>
        <div className="dalis-karart" aria-hidden="true" />
        <div className="dalis-yazi">
          <span
            className="d-etiket"
            dangerouslySetInnerHTML={{ __html: t("dalis_tag") }}
          />
          <h2
            className="d-baslik serif"
            dangerouslySetInnerHTML={{ __html: t("dalis_h2") }}
          />
          <p
            className="d-alt"
            dangerouslySetInnerHTML={{ __html: t("dalis_alt") }}
          />
        </div>
      </div>
    </section>
  );
}
