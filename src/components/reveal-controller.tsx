"use client";

import { useEffect } from "react";

/**
 * Drives every `.rv` reveal with one IntersectionObserver — the exact technique
 * the reference CALA site uses. Mounted once in layout; its effect runs after
 * the whole page has mounted, so it sees all `.rv` nodes. Honors
 * `prefers-reduced-motion` by revealing everything immediately.
 */
export function RevealController() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".rv"));
    if (!nodes.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach((el) => el.classList.add("on"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("on");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -36px 0px" },
    );
    nodes.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
