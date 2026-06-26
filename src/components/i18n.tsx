"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { I18N, LANGS, type Lang } from "@/lib/i18n";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Resolve a key to the active language, or null to fall back to JSX (Turkish). */
  t: (key: string) => string | null;
};

const I18nContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "cala-lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  // Always start at "tr" so SSR and first client render match (Turkish lives in
  // the JSX). A stored preference is applied after mount.
  const [lang, setLangState] = useState<Lang>("tr");

  useEffect(() => {
    // Apply the stored preference after mount. Reading it during render would
    // diverge from the server ("tr") and break hydration, so this synchronisation
    // from an external system (localStorage) belongs in an effect.
    const stored = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored && LANGS.some((l) => l.code === stored)) setLangState(stored);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = l;
  }, []);

  const t = useCallback(
    (key: string): string | null => {
      if (lang === "tr") return null;
      return I18N[key]?.[lang] ?? null;
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): Ctx {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

/**
 * Renders the active-language string for `id` inside `<as>` (default span),
 * falling back to the Turkish source string `tr` when no translation exists.
 * Both source and translations may carry inline markup (<em>, <i>, <b>, <br>,
 * <a>), so the string is injected as HTML — the content is our own static
 * dictionary, never user input. The element is always emitted (even for the
 * Turkish fallback) so `.rv` reveal classes and flex layout stay attached.
 */
export function T({
  id,
  tr,
  as: Tag = "span",
  className,
  style,
}: {
  id: string;
  tr: string;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { t } = useI18n();
  const html = t(id) ?? tr;
  return (
    <Tag
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
