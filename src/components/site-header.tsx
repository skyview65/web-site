"use client";

import { useEffect, useRef, useState } from "react";

const LINKS = [
  { href: "#sofra", label: "Sofra" },
  { href: "#kahvalti", label: "Kahvaltı" },
  { href: "#ogle", label: "Öğle" },
  { href: "#aksam", label: "Akşam" },
] as const;

/**
 * Fixed site header. Transparent over the hero, then condenses to a
 * backdrop-blurred bar once scrolled. Drives the top scroll-progress
 * hairline, scroll-spies the active section, and exposes an accessible
 * full-screen menu on mobile.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("sofra");
  const barRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 60);
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      if (barRef.current) {
        barRef.current.style.setProperty("--progress", p.toFixed(4));
      }
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

  // Scroll-spy: highlight the section currently crossing the viewport band.
  useEffect(() => {
    const ids = LINKS.map((l) => l.href.slice(1));
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Lock scroll + manage focus + close on Escape while the menu is open.
  useEffect(() => {
    if (!menuOpen) return;
    closeBtnRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      menuBtnRef.current?.focus();
    };
  }, [menuOpen]);

  return (
    <>
      <div className="scroll-progress" ref={barRef} aria-hidden="true" />

      <header className={`site-header${scrolled ? " scrolled" : ""}`}>
        <div className="site-header__inner">
          <a className="brand" href="#sofra" aria-label="CALA — ana sayfa">
            CALA
          </a>

          <nav className="nav" aria-label="Birincil">
            {LINKS.map((l) => {
              const active = activeId === l.href.slice(1);
              return (
                <a
                  key={l.href}
                  href={l.href}
                  className={active ? "active" : undefined}
                  aria-current={active ? "true" : undefined}
                >
                  {l.label}
                </a>
              );
            })}
          </nav>

          <div className="header-actions">
            <a className="btn btn--ghost header-cta" href="#rezervasyon">
              Rezervasyon
            </a>
            <button
              ref={menuBtnRef}
              type="button"
              className="menu-btn"
              aria-label="Menüyü aç"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(true)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={`mobile-menu${menuOpen ? " open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <button
          ref={closeBtnRef}
          type="button"
          className="mobile-menu__close"
          aria-label="Menüyü kapat"
          onClick={() => setMenuOpen(false)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>
            {l.label}
          </a>
        ))}
        <a
          className="btn btn--gold"
          href="#rezervasyon"
          onClick={() => setMenuOpen(false)}
        >
          Rezervasyon
        </a>
      </div>
    </>
  );
}
