"use client";

import { useEffect, useState } from "react";
import { useI18n, Msg } from "@/components/language-provider";
import { LANGS, LANG_LABELS } from "@/lib/i18n/messages";
import type { Lang } from "@/lib/i18n/messages";

const MENU = [
  { href: "#tasev", no: "01", k: "menu_1" },
  { href: "#suitler", no: "02", k: "menu_2" },
  { href: "#sofra", no: "03", k: "menu_3" },
  { href: "#yorumlar", no: "04", k: "menu_4" },
  { href: "#rezervasyon", no: "05", k: "menu_5" },
] as const;

export function SiteHeader() {
  const { lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <nav>
        <button
          className="menu-btn"
          onClick={() => setOpen(true)}
          aria-label="Menüyü aç"
          aria-expanded={open}
        >
          <span className="cizgiler" aria-hidden="true">
            <i />
            <i />
          </span>
          <Msg k="nav_menu" />
        </button>

        <a className="amblem" href="#" aria-label="CALA">
          CALA
        </a>

        <span className="nav-sag">
          <select
            className="dil-sec"
            aria-label="Language / Dil"
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
          >
            {LANGS.map((l) => (
              <option key={l} value={l}>
                {LANG_LABELS[l]}
              </option>
            ))}
          </select>
          <a className="rez" href="#rezervasyon">
            <Msg k="nav_rez" />
          </a>
        </span>
      </nav>

      <div
        className={`kaplama${open ? " acik" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <button className="kapat" onClick={() => setOpen(false)}>
          <Msg k="menu_close" />
        </button>
        {MENU.map((m) => (
          <a key={m.href} href={m.href} onClick={() => setOpen(false)}>
            <span className="kno">{m.no}</span> <Msg k={m.k} />
          </a>
        ))}
      </div>
    </>
  );
}
