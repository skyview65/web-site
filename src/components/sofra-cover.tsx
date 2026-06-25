"use client";

import { useEffect, useRef } from "react";

/**
 * THE TABLE / "SOFRA" cover.
 *
 * A tall wrapper holds a sticky-pinned video. As the wrapper scrolls through
 * the viewport we compute a 0→1 progress and expose it as the CSS variable
 * `--sp`; globals.css uses it to scale + drift the video, deepen the scrim and
 * parallax the title — so the video visibly moves as you scroll. The blue-hour
 * still doubles as the poster, so the hero is pixel-perfect even before the
 * video loads (or when motion is reduced). Mirrors the sticky-video technique
 * CALA uses for its cove section.
 */
export function SofraCover() {
  const wrapRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Scroll-driven parallax (skipped when motion is reduced).
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
    };
  }, []);

  // Play only while on-screen; honour reduced-motion (poster stays).
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.removeAttribute("autoplay");
      video.pause();
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.01 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={wrapRef}
      id="sofra"
      className="sofra-wrap"
      aria-label="Sofra — THE TABLE"
    >
      <div className="sofra-pin">
        <video
          ref={videoRef}
          className="sofra-video"
          poster="/images/sofra-hero.webp"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/videos/sofra-hero.webm" type="video/webm" />
          <source src="/videos/sofra-hero.mp4" type="video/mp4" />
        </video>
        <div className="sofra-scrim" aria-hidden="true" />

        <div className="sofra-center">
          <span className="sofra-tag">CALA · KAŞ</span>
          <h1 className="sofra-h2">
            <span className="sr-only">CALA · Kaş — </span>SOFRA
          </h1>
        </div>

        <span className="sofra-alt">DENİZDEN VE BAHÇEDEN</span>
        <svg
          className="sofra-arrow"
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
