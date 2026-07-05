import type { Locale } from "./locales";
import { ar } from "./dictionaries/ar";
import { de } from "./dictionaries/de";
import { en } from "./dictionaries/en";
import { es } from "./dictionaries/es";
import { fr } from "./dictionaries/fr";
import { it } from "./dictionaries/it";
import { ja } from "./dictionaries/ja";
import { ko } from "./dictionaries/ko";
import { pt } from "./dictionaries/pt";
import { ru } from "./dictionaries/ru";
import { tr } from "./dictionaries/tr";
import { zh } from "./dictionaries/zh";

export interface CharacterCopy {
  /** Stable id used to join with the visual config (image, accent color) */
  id: "mara" | "kaan" | "solene";
  name: string;
  role: string;
  tagline: string;
  /** In-character line, shown as a pull quote on the card */
  quote: string;
  bio: string;
  /** One sentence on how this character plays and who should pick them */
  playstyle: string;
}

export interface EditionCopy {
  id: "standard" | "deluxe" | "eternal";
  name: string;
  /** Ribbon label, e.g. "En Popüler" — empty string hides the ribbon */
  tag: string;
  price: string;
  contents: string[];
  cta: string;
}

export interface Dictionary {
  meta: {
    title: string;
    description: string;
    ogAlt: string;
  };
  nav: {
    city: string;
    protagonists: string;
    features: string;
    online: string;
    editions: string;
    preorder: string;
    menuOpen: string;
    menuClose: string;
    selectLanguage: string;
    skipToContent: string;
  };
  hero: {
    kicker: string;
    tagline: string;
    releaseWindow: string;
    platforms: string;
    cta: string;
    scrollHint: string;
    imageAlt: string;
  };
  /**
   * Plain-language narrative strip right under the cover: three short
   * statements anyone can follow (where — who rules — who you are),
   * closed by the thesis line rendered in neon.
   */
  story: {
    kicker: string;
    lines: string[];
    outro: string;
  };
  city: {
    kicker: string;
    title: string;
    paragraphs: string[];
    stats: { value: string; label: string }[];
    imageAlt: string;
  };
  protagonists: {
    kicker: string;
    title: string;
    intro: string;
    characters: CharacterCopy[];
  };
  features: {
    kicker: string;
    title: string;
    items: { title: string; body: string }[];
  };
  online: {
    kicker: string;
    title: string;
    body: string;
    bullets: string[];
    modes: { name: string; body: string }[];
    ticker: string;
    imageAlt: string;
  };
  editions: {
    kicker: string;
    title: string;
    tiers: EditionCopy[];
    note: string;
    imageAlt: string;
  };
  newsletter: {
    title: string;
    body: string;
    placeholder: string;
    button: string;
    success: string;
    privacy: string;
  };
  footer: {
    fictional: string;
    rights: string;
    studio: string;
  };
}

const dictionaries: Record<Locale, Dictionary> = {
  tr,
  en,
  de,
  fr,
  es,
  it,
  pt,
  ru,
  ar,
  ja,
  ko,
  zh,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
