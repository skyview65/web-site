"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "./language-provider";
import { LANGS, type Lang } from "@/lib/dictionary";

const MENU_ITEMS = [
  { href: "#tasev", no: "01", key: "menu_1" },
  { href: "#suitler", no: "02", key: "menu_2" },
  { href: "#sofra", no: "03", key: "menu_3" },
  { href: "#yorumlar", no: "04", key: "menu_4" },
  { href: "#rezervasyon", no: "05", key: "menu_5" },
] as const;

/**
 * Fixed top bar + full-screen overlay menu. Beyond the original: the trigger
 * carries aria-expanded, the overlay is a dialog with a focus trap, Escape
 * closes it, and focus returns to the trigger — the original had none of it.
 */
export function SiteNav() {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    menuBtnRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    // The overlay animates from visibility:hidden; focusing in the same frame
    // fails, so wait a frame for the visibility flip before moving focus.
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => closeBtnRef.current?.focus());
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = overlayRef.current?.querySelectorAll<HTMLElement>("a[href], button");
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  return (
    <>
      <a className="skip-link" href="#main">
        {t("ui_skip")}
      </a>
      <nav aria-label="CALA">
        <button
          ref={menuBtnRef}
          className="menu-btn"
          aria-label={t("ui_menu_open")}
          aria-expanded={open}
          aria-controls="kaplama"
          onClick={() => setOpen(true)}
        >
          <span className="cizgiler" aria-hidden="true">
            <i />
            <i />
          </span>{" "}
          <span>{t("nav_menu")}</span>
        </button>
        <a className="amblem" href="#" aria-label="CALA">
          CALA
        </a>
        <span className="nav-sag">
          <select
            id="dilSec"
            className="dil-sec"
            aria-label="Language / Dil"
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
          >
            {LANGS.map((l) => (
              <option key={l} value={l}>
                {l.toUpperCase()}
              </option>
            ))}
          </select>
          <a className="rez" href="#rezervasyon">
            {t("nav_rez")}
          </a>
        </span>
      </nav>

      <div
        ref={overlayRef}
        id="kaplama"
        className={`kaplama${open ? " acik" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={t("nav_menu")}
      >
        <button ref={closeBtnRef} className="kapat" onClick={close}>
          <span>{t("menu_close")}</span>
        </button>
        {MENU_ITEMS.map((item) => (
          <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
            <span className="kno">{item.no}</span> <span>{t(item.key)}</span>
          </a>
        ))}
      </div>
    </>
  );
}
