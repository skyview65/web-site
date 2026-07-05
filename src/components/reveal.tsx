"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Fade + slide-up on first scroll into view, via IntersectionObserver —
 * the same reveal CALA applies to its content blocks (`.rv` → `.on`).
 */
export function Reveal({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("on");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("on");
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -36px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`rv ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}
