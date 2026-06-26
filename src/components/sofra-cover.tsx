"use client";

import { useEffect, useRef } from "react";
import { T } from "@/components/i18n";

/**
 * "Sofra" / THE TABLE cover.
 *
 * A tall wrapper (`#sofra`) holds a sticky-pinned clip. As it scrolls through
 * the viewport we expose a 0→1 progress as `--sp`; globals.css uses it to scale
 * + drift the video, deepen the vignette, draw a gold hairline and parallax the
 * title. The video plays only while in view.
 */
export function SofraCover() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const vidRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const v = vidRef.current;
    if (!wrap) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cleanupVid: (() => void) | undefined;
    if (v) {
      v.muted = true;
      const io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              const p = v.play();
              if (p) p.catch(() => {});
            } else {
              v.pause();
            }
          }),
        { threshold: 0.15 },
      );
      io.observe(wrap);
      cleanupVid = () => io.disconnect();
    }

    if (reduce) return cleanupVid;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = wrap.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const p = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
      wrap.style.setProperty("--sp", p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      cleanupVid?.();
    };
  }, []);

  return (
    <div className="kapak" id="sofra" ref={wrapRef}>
      <div className="sofra-sticky">
        <div className="k-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/sofra-kapak.jpg"
            alt="Akşam sofrası, deniz manzarası"
            loading="lazy"
          />
          <video
            ref={vidRef}
            className="sofra-video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/images/sofra-poster.webp"
            aria-hidden="true"
          >
            <source src="/videos/sofra.mp4" type="video/mp4" />
          </video>
        </div>
        <T id="kapak_sofra_h2" tr="SOFRA" as="h2" />
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
        <T id="kapak_sofra_alt" tr="DENİZDEN VE BAHÇEDEN" className="k-alt" />
        <div className="sofra-vig" aria-hidden="true" />
        <div className="sofra-line" aria-hidden="true" />
      </div>
    </div>
  );
}
