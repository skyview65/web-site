"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/i18n";
import { LANGS, type Lang } from "@/lib/i18n";

const MENU = [
  { href: "#tasev", no: "01", id: "menu_1", tr: "Taş Ev" },
  { href: "#suitler", no: "02", id: "menu_2", tr: "Süitler" },
  { href: "#sofra", no: "03", id: "menu_3", tr: "Sofra" },
  { href: "#yorumlar", no: "04", id: "menu_4", tr: "Misafir Defteri" },
  { href: "#rezervasyon", no: "05", id: "menu_5", tr: "Rezervasyon" },
];

export function Nav() {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <nav className={scrolled ? "inilen" : ""}>
        <button
          className="menu-btn"
          aria-label="Menüyü aç"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <span className="cizgiler">
            <i />
            <i />
          </span>{" "}
          <span>{t("nav_menu") ?? "MENÜ"}</span>
        </button>

        <a className="amblem" href="#" aria-label="CALA">
          CALA
        </a>

        <span className="nav-sag">
          <span className="dil-sar">
            <select
              className="dil-sec"
              aria-label="Language / Dil"
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
            >
              {LANGS.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </span>
          <a className="rez" href="#rezervasyon">
            {t("nav_rez") ?? "REZERVASYON"}
          </a>
        </span>
      </nav>

      <div className={`kaplama${open ? " acik" : ""}`} aria-hidden={!open}>
        <button className="kapat" onClick={() => setOpen(false)}>
          {t("menu_close") ?? "KAPAT"}
        </button>
        <nav className="kaplama-list" aria-label="Bölümler">
          {MENU.map((m) => (
            <a key={m.href} href={m.href} onClick={() => setOpen(false)}>
              <span className="kno">{m.no}</span>
              <span>{t(m.id) ?? m.tr}</span>
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
