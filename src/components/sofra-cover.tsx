"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/components/language-provider";

/**
 * SOFRA cover — a tall `#sofra.kapak` whose inner layer is sticky-pinned. As the
 * wrapper scrolls through, a lerp-smoothed 0→1 progress is written to `--sp`;
 * globals.css uses it to scale the video, deepen the vignette, parallax the
 * title and draw the gold underline. Mirrors the reference sofra section.
 */
export function SofraCover() {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const sec = ref.current;
    if (!sec) return;

    const vid = videoRef.current;
    if (vid) {
      const p = vid.play();
      if (p) p.catch(() => {});
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sec.style.setProperty("--sp", "0");
      return;
    }

    let target = 0;
    let cur = 0;
    let raf = 0;
    let active = false;

    const measure = () => {
      const r = sec.getBoundingClientRect();
      const travel = r.height - window.innerHeight;
      const tt = travel > 0 ? -r.top / travel : 0;
      target = tt < 0 ? 0 : tt > 1 ? 1 : tt;
    };
    const tick = () => {
      measure();
      cur += (target - cur) * 0.09;
      if (Math.abs(target - cur) < 0.0004) cur = target;
      sec.style.setProperty("--sp", cur.toFixed(4));
      if (active || Math.abs(target - cur) > 0.0004) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        active = entries[0].isIntersecting;
        if (active) kick();
      },
      { rootMargin: "200px 0px 200px 0px", threshold: 0 },
    );
    io.observe(sec);
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    kick();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="kapak" id="sofra" ref={ref}>
      <div className="sofra-sticky">
        <div className="k-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/sofra-table.jpg"
            alt="Akşam sofrası, deniz manzarası"
            loading="lazy"
          />
          <video
            className="sofra-video"
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/images/sofra-video-poster.webp"
          >
            <source src="/videos/sofra.mp4" type="video/mp4" />
          </video>
        </div>
        <h2 dangerouslySetInnerHTML={{ __html: t("kapak_sofra_h2") }} />
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
        <span
          className="k-alt"
          dangerouslySetInnerHTML={{ __html: t("kapak_sofra_alt") }}
        />
        <div className="sofra-vig" aria-hidden="true" />
        <div className="sofra-line" aria-hidden="true" />
      </div>
    </div>
  );
}
