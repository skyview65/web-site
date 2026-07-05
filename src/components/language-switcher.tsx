"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Globe } from "lucide-react";
import { locales, localeMeta, type Locale } from "@/lib/i18n/locales";

export function LanguageSwitcher({
  currentLocale,
  label,
}: {
  currentLocale: Locale;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 font-mono text-[11px] tracking-[0.18em] text-dim uppercase transition-colors hover:border-neon-cyan/60 hover:text-ghost focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <Globe className="size-3.5" aria-hidden="true" />
        {currentLocale}
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={label}
          className="absolute end-0 top-full z-50 mt-2 max-h-[60svh] w-44 overflow-y-auto border border-line bg-carbon/95 py-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl"
        >
          {locales.map((code) => (
            <li key={code} role="option" aria-selected={code === currentLocale}>
              <Link
                href={`/${code}`}
                aria-current={code === currentLocale ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`flex items-baseline justify-between px-3.5 py-2 text-sm transition-colors hover:bg-void/60 hover:text-neon-cyan ${
                  code === currentLocale ? "text-neon-cyan" : "text-ghost"
                }`}
              >
                <span>{localeMeta[code].label}</span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-dim uppercase">
                  {code}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
