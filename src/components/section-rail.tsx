"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "tasev", label: "01" },
  { id: "dalis", label: "02" },
  { id: "suitler", label: "03" },
  { id: "sofra", label: "04" },
  { id: "yorumlar", label: "05" },
  { id: "rezervasyon", label: "06" },
] as const;

/**
 * Fixed editorial progress rail. Mono numerals down the right edge; the section
 * currently in view is highlighted via IntersectionObserver. Hidden on small
 * screens (see globals.css `.rail`).
 */
export function SectionRail() {
  const [active, setActive] = useState<string>("tasev");

  useEffect(() => {
    const targets = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (!targets.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <nav className="rail" aria-label="Bölümler">
      {SECTIONS.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className={active === s.id ? "active" : undefined}
        >
          <span className="dot" />
          <span className="rl">{s.label}</span>
        </a>
      ))}
    </nav>
  );
}
