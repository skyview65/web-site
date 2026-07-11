"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LumenfallWordmark } from "@/components/icons";
import type { Dictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locales";

const anchors = [
  { id: "city", key: "city" },
  { id: "protagonists", key: "protagonists" },
  { id: "features", key: "features" },
  { id: "online", key: "online" },
  { id: "editions", key: "editions" },
] as const;

export function SiteNav({
  locale,
  nav,
}: {
  locale: Locale;
  nav: Dictionary["nav"];
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
        scrolled
          ? "border-b border-line bg-void/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
        <a
          href="#top"
          aria-label="LUMENFALL"
          className="text-ghost transition-colors hover:text-neon-cyan"
        >
          <LumenfallWordmark className="h-6 w-auto" />
        </a>

        <nav aria-label="LUMENFALL" className="hidden items-center gap-7 lg:flex">
          {anchors.map((a) => (
            <a
              key={a.id}
              href={`#${a.id}`}
              className="font-mono text-[11px] tracking-[0.22em] text-dim uppercase transition-colors hover:text-neon-cyan"
            >
              {nav[a.key]}
            </a>
          ))}
          <Link
            href={`/${locale}/oyna`}
            className="font-mono text-[11px] tracking-[0.22em] text-neon-cyan uppercase transition-colors hover:text-neon-amber"
          >
            {nav.play}
          </Link>
        </nav>

        <div className="flex items-center gap-2.5">
          <LanguageSwitcher currentLocale={locale} label={nav.selectLanguage} />
          <Button
            render={<a href="#newsletter" />}
            nativeButton={false}
            className="hidden font-mono text-[11px] font-semibold tracking-[0.18em] uppercase shadow-[0_0_24px_oklch(0.8_0.16_75_/_35%)] sm:inline-flex"
          >
            {nav.preorder}
          </Button>
          <button
            type="button"
            aria-label={nav.menuOpen}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className="text-ghost transition-colors hover:text-neon-cyan lg:hidden"
          >
            <Menu className="size-6" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-void/95 backdrop-blur-2xl lg:hidden">
          <div className="flex h-16 items-center justify-between px-5">
            <LumenfallWordmark className="h-6 w-auto text-ghost" />
            <button
              type="button"
              aria-label={nav.menuClose}
              onClick={() => setMenuOpen(false)}
              className="text-ghost transition-colors hover:text-neon-magenta"
            >
              <X className="size-7" />
            </button>
          </div>
          <nav
            aria-label="LUMENFALL"
            className="flex flex-1 flex-col items-center justify-center gap-8"
          >
            {anchors.map((a) => (
              <a
                key={a.id}
                href={`#${a.id}`}
                onClick={() => setMenuOpen(false)}
                className="font-display text-2xl font-bold tracking-[0.12em] text-ghost uppercase transition-colors hover:text-neon-cyan"
              >
                {nav[a.key]}
              </a>
            ))}
            <Link
              href={`/${locale}/oyna`}
              onClick={() => setMenuOpen(false)}
              className="font-display text-2xl font-bold tracking-[0.12em] text-neon-cyan uppercase transition-colors hover:text-neon-amber"
            >
              {nav.play}
            </Link>
            <a
              href="#newsletter"
              onClick={() => setMenuOpen(false)}
              className="mt-4 border border-neon-amber/50 px-6 py-3 font-mono text-sm tracking-[0.24em] text-neon-amber uppercase"
            >
              {nav.preorder}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
