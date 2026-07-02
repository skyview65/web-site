"use client";

import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { LANGS, RTL_LANGS, STRINGS, type Lang, type StringKey } from "@/lib/dictionary";

const STORAGE_KEY = "cala_lang";

interface LanguageContextValue {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (lang: Lang) => void;
  t: (key: StringKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isLang(value: string | null): value is Lang {
  return value !== null && (LANGS as readonly string[]).includes(value);
}

export function dirOf(lang: Lang): "ltr" | "rtl" {
  return RTL_LANGS.includes(lang) ? "rtl" : "ltr";
}

function subscribeToStorage(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function readSavedLang(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null; // storage unavailable (private mode)
  }
}

/**
 * Client-side language switching, as in the original site: the page renders
 * in Turkish, the visitor's saved choice (localStorage `cala_lang`) is applied
 * after hydration, and <html lang>/<html dir> stay in sync — one owner for
 * both, where the original had two scripts fighting over `dir`.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  // Server renders Turkish; the saved choice streams in via the store
  // snapshot right after hydration, without a hydration mismatch.
  const saved = useSyncExternalStore(subscribeToStorage, readSavedLang, () => null);
  const [chosen, setChosen] = useState<Lang | null>(null);
  const lang: Lang = chosen ?? (isLang(saved) ? saved : "tr");

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dirOf(lang);
  }, [lang]);

  // Persist only on an explicit user choice — writing from the sync effect
  // would clobber the saved value with the default "tr" during hydration.
  const setLang = useCallback((next: Lang) => {
    setChosen(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // storage unavailable — the choice simply won't persist
    }
  }, []);
  const t = useCallback((key: StringKey) => STRINGS[key][lang], [lang]);

  return (
    <LanguageContext.Provider value={{ lang, dir: dirOf(lang), setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within <LanguageProvider>");
  return ctx;
}

type RichTag = "em" | "i" | "b";
const TOKEN = /(<\/?(?:em|i|b)>|<br\s*\/?>)/;

/**
 * Renders dictionary strings that carry light markup (<em>, <i>, <b>, <br>)
 * as real React elements. Only these four tags are interpreted; anything else
 * renders as literal text — no innerHTML, unlike the original site.
 */
export function Rich({ text }: { text: string }) {
  const tokens = text.split(TOKEN);
  let index = 0;
  let key = 0;

  const walk = (closeTag: string | null): ReactNode[] => {
    const out: ReactNode[] = [];
    while (index < tokens.length) {
      const tok = tokens[index++];
      if (!tok) continue;
      if (closeTag && tok === closeTag) return out;
      if (/^<br\s*\/?>$/.test(tok)) {
        out.push(createElement("br", { key: key++ }));
        continue;
      }
      const open = /^<(em|i|b)>$/.exec(tok);
      if (open) {
        const tag = open[1] as RichTag;
        out.push(createElement(tag, { key: key++ }, walk(`</${tag}>`)));
        continue;
      }
      if (/^<\/(em|i|b)>$/.test(tok)) continue; // unmatched close — drop
      out.push(tok);
    }
    return out;
  };

  return <>{walk(null)}</>;
}
