import { notFound } from "next/navigation";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LumenfallWordmark } from "@/components/icons";
import { CityFlight } from "@/components/city-flight";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale } from "@/lib/i18n/locales";

export default async function OynaPage({ params }: PageProps<"/[locale]/oyna">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <div className="scanlines" aria-hidden="true" />
      <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-void/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
          <Link
            href={`/${locale}`}
            aria-label="LUMENFALL"
            className="text-ghost transition-colors hover:text-neon-cyan"
          >
            <LumenfallWordmark className="h-6 w-auto" />
          </Link>
          <LanguageSwitcher
            currentLocale={locale}
            label={dict.nav.selectLanguage}
          />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 pt-24 pb-16 md:px-8 md:pt-28">
        <div className="mb-6 text-center">
          <span className="font-mono text-[11px] tracking-[0.42em] text-neon-cyan uppercase">
            {dict.game.eyebrow}
          </span>
          <h1 className="mt-3 font-display text-3xl font-black tracking-[0.08em] text-ghost md:text-5xl">
            {dict.game.title}
          </h1>
        </div>
        <CityFlight
          game={dict.game}
          characters={dict.protagonists.characters}
          backHref={`/${locale}`}
        />
      </main>
    </>
  );
}
