import { notFound } from "next/navigation";
import { CinematicHero } from "@/components/cinematic-hero";
import { CitySection } from "@/components/city-section";
import { EditionsSection } from "@/components/editions-section";
import { FeaturesSection } from "@/components/features-section";
import { OnlineSection } from "@/components/online-section";
import { ProtagonistsSection } from "@/components/protagonists-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale } from "@/lib/i18n/locales";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <a
        href="#city"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[70] focus:bg-carbon focus:px-4 focus:py-2 focus:text-sm focus:text-ghost"
      >
        {dict.nav.skipToContent}
      </a>
      <div className="scanlines" aria-hidden="true" />
      <SiteNav locale={locale} nav={dict.nav} />
      <main id="top">
        <CinematicHero hero={dict.hero} />
        <CitySection city={dict.city} />
        <ProtagonistsSection protagonists={dict.protagonists} />
        <FeaturesSection features={dict.features} />
        <OnlineSection online={dict.online} />
        <EditionsSection editions={dict.editions} />
      </main>
      <SiteFooter
        newsletter={dict.newsletter}
        footer={dict.footer}
        platforms={dict.hero.platforms}
      />
    </>
  );
}
