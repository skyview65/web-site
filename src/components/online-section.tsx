import { Reveal } from "@/components/reveal";
import type { Dictionary } from "@/lib/i18n/dictionary";

export function OnlineSection({ online }: { online: Dictionary["online"] }) {
  const tickerItems = online.ticker.split("·").map((s) => s.trim());

  return (
    <section id="online" className="bg-void">
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[0, 1].map((dup) => (
            <span key={dup} className="inline-flex gap-14">
              {tickerItems.map((item, i) => (
                <span key={i}>{item}</span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div className="neon-frame overflow-hidden" style={{ "--ac": "var(--neon-amber)" }}>
            <div className="relative aspect-video overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/lumenfall-online.webp"
                alt={online.imageAlt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div
                className="absolute inset-0 bg-[linear-gradient(to_top,oklch(0.09_0.015_290/70%),transparent_40%)]"
                aria-hidden="true"
              />
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <span className="section-kicker text-neon-amber">
              {online.kicker}
            </span>
            <h2 className="section-title mt-4">{online.title}</h2>
            <p className="mt-6 leading-relaxed text-dim">{online.body}</p>
          </Reveal>
          <ul className="mt-8 space-y-4">
            {online.bullets.map((b, i) => (
              <Reveal key={i} style={{ "--rv-delay": `${i * 0.08}s` }}>
                <li className="flex items-start gap-3 text-sm leading-relaxed text-ghost">
                  <span
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-neon-amber shadow-[0_0_10px_var(--neon-amber)]"
                    aria-hidden="true"
                  />
                  {b}
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
