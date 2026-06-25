"use client";

import { useEffect, useRef } from "react";

/**
 * THE TABLE / "SOFRA" cover.
 *
 * A tall wrapper holds a sticky-pinned video. As the wrapper scrolls through
 * the viewport we compute a 0→1 progress and expose it as the CSS variable
 * `--sp`; globals.css uses it to scale + drift the video, deepen the scrim and
 * parallax the title — so the video visibly moves as you scroll. Mirrors the
 * sticky-video technique CALA uses for its cove ("dalis") section.
 */
export function SofraCover() {
  const wrapRef = useRef<HTMLElement>(null);

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

  return (
    <section ref={wrapRef} className="sofra-wrap" aria-label="Sofra — THE TABLE">
      <div className="sofra-pin">
        <video
          className="sofra-video"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/sofra-poster.webp"
        >
          <source src="/videos/sofra.mp4" type="video/mp4" />
        </video>
        <div className="sofra-scrim" aria-hidden="true" />

        <div className="sofra-center">
          <span className="sofra-tag">CALA · KAŞ</span>
          <h2 className="sofra-h2">SOFRA</h2>
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
