"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ElementType,
  type ReactNode,
} from "react";
import {
  LANGS,
  RTL_LANGS,
  messages,
  type Lang,
  type MessageKey,
} from "@/lib/i18n/messages";

type I18nValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: MessageKey) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

const isLang = (v: string): v is Lang => (LANGS as readonly string[]).includes(v);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("tr");

  // restore saved language after mount (avoids hydration mismatch)
  useEffect(() => {
    let saved = "tr";
    try {
      saved = localStorage.getItem("cala_lang") || "tr";
    } catch {
      /* ignore */
    }
    // Restore the persisted language after mount (deliberate: avoids an SSR
    // hydration mismatch — the server always renders the default "tr").
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isLang(saved) && saved !== "tr") setLangState(saved);
  }, []);

  useEffect(() => {
    const el = document.documentElement;
    el.setAttribute("lang", lang);
    el.setAttribute("dir", RTL_LANGS.includes(lang) ? "rtl" : "ltr");
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("cala_lang", l);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (key: MessageKey) => {
      const entry = messages[key] as Record<Lang, string>;
      return entry[lang] || entry.tr;
    },
    [lang],
  );

  const value = useMemo<I18nValue>(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
  return ctx;
}

/**
 * Renders a translated message that may contain inline HTML (<em>, <i>, <br>,
 * <a>, &nbsp;). Faithful to the reference's `data-i18n` innerHTML swaps.
 */
export function Msg({
  k,
  as: Tag = "span",
  className,
}: {
  k: MessageKey;
  as?: ElementType;
  className?: string;
}) {
  const { t } = useI18n();
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: t(k) }} />;
}
