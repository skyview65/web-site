import { Reveal } from "@/components/reveal";
import type { Dictionary } from "@/lib/i18n/dictionary";

export function CitySection({ city }: { city: Dictionary["city"] }) {
  return (
    <section id="city" className="relative bg-void">
      <div className="relative h-[56svh] overflow-hidden md:h-[72svh]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="kenburns absolute inset-0 h-full w-full object-cover"
          src="/images/lumenfall-city.webp"
          alt={city.imageAlt}
          loading="lazy"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--void)_0%,transparent_28%,transparent_60%,var(--void)_100%)]"
          aria-hidden="true"
        />
      </div>

      <div className="mx-auto max-w-3xl px-5 pt-4 pb-20 md:px-8 md:pb-28">
        <Reveal>
          <span className="section-kicker text-neon-cyan">{city.kicker}</span>
          <h2 className="section-title mt-4">{city.title}</h2>
        </Reveal>
        <div className="mt-8 space-y-6">
          {city.paragraphs.map((p, i) => (
            <Reveal key={i}>
              <p className="leading-relaxed text-dim">{p}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14">
          <dl className="grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-4">
            {city.stats.map((s) => (
              <div
                key={s.label}
                className="flex flex-col-reverse gap-2 bg-void px-4 py-6 text-center"
              >
                <dt className="font-mono text-[10px] tracking-[0.2em] text-dim uppercase">
                  {s.label}
                </dt>
                <dd className="font-display text-2xl font-bold text-ghost md:text-3xl">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
