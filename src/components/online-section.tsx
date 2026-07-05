import { Globe, Landmark, Swords, Truck } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { asset } from "@/lib/asset";
import type { Dictionary } from "@/lib/i18n/dictionary";

const modeVisuals = [
  { icon: Swords, accent: "var(--neon-magenta)", text: "text-neon-magenta" },
  { icon: Landmark, accent: "var(--neon-cyan)", text: "text-neon-cyan" },
  { icon: Truck, accent: "var(--neon-amber)", text: "text-neon-amber" },
  { icon: Globe, accent: "var(--neon-cyan)", text: "text-neon-cyan" },
];

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

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pt-20 pb-12 md:px-8 md:pt-28 md:pb-14 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div className="neon-frame overflow-hidden" style={{ "--ac": "var(--neon-amber)" }}>
            <div className="relative aspect-video overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset("/images/lumenfall-online.webp")}
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

      <div className="mx-auto max-w-7xl px-5 pb-20 md:px-8 md:pb-28">
        <div className="grid gap-6 sm:grid-cols-2">
          {online.modes.map((mode, i) => {
            const v = modeVisuals[i % modeVisuals.length];
            const Icon = v.icon;
            return (
              <Reveal key={mode.name} style={{ "--rv-delay": `${(i % 2) * 0.1}s` }}>
                <article
                  className="neon-frame h-full p-6"
                  style={{ "--ac": v.accent }}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`size-5 ${v.text}`} aria-hidden="true" />
                    <h3 className="font-display text-lg font-bold tracking-wide text-ghost">
                      {mode.name}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-dim">
                    {mode.body}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
