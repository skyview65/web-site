"use client";

import { useEffect, type RefObject } from "react";

/**
 * Writes a 0→1 scroll progress into a CSS variable on the element as it
 * travels through the viewport (rAF-throttled). Extracted from the
 * template's original scroll-pinned cover so any section can be
 * scroll-driven via CSS alone. No-ops under prefers-reduced-motion.
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  cssVar: string,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const p = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
      el.style.setProperty(cssVar, p.toFixed(4));
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
  }, [ref, cssVar]);
}
