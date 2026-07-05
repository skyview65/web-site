import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { asset } from "@/lib/asset";
import type { Dictionary } from "@/lib/i18n/dictionary";

const tierStyles = {
  standard: { accent: "var(--neon-cyan)", text: "text-neon-cyan" },
  deluxe: { accent: "var(--neon-magenta)", text: "text-neon-magenta" },
  eternal: { accent: "var(--neon-amber)", text: "text-neon-amber" },
} as const;

export function EditionsSection({
  editions,
}: {
  editions: Dictionary["editions"];
}) {
  return (
    <section id="editions" className="relative overflow-hidden bg-void py-20 md:py-28">
      <div className="absolute inset-0" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset("/images/lumenfall-editions.webp")}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--void)_0%,oklch(0.13_0.02_290/72%)_40%,var(--void)_100%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="max-w-3xl">
          <span className="section-kicker text-neon-magenta">
            {editions.kicker}
          </span>
          <h2 className="section-title mt-4">{editions.title}</h2>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {editions.tiers.map((tier, i) => {
            const s = tierStyles[tier.id];
            const highlight = tier.id === "deluxe";
            return (
              <Reveal key={tier.id} style={{ "--rv-delay": `${i * 0.12}s` }}>
                <article
                  className={`neon-frame flex h-full flex-col p-7 ${
                    highlight ? "lg:-translate-y-3" : ""
                  }`}
                  style={{ "--ac": s.accent }}
                >
                  {tier.tag ? (
                    <span
                      className={`mb-4 self-start border px-2.5 py-1 font-mono text-[10px] tracking-[0.24em] uppercase ${s.text}`}
                      style={{ borderColor: "color-mix(in oklab, var(--ac) 55%, transparent)" }}
                    >
                      {tier.tag}
                    </span>
                  ) : (
                    <span className="mb-4 h-[26px]" aria-hidden="true" />
                  )}
                  <h3 className="font-display text-2xl font-bold tracking-wide text-ghost">
                    {tier.name}
                  </h3>
                  <p className={`font-display mt-2 text-xl font-medium ${s.text}`}>
                    {tier.price}
                  </p>
                  <ul className="mt-6 flex-1 space-y-3">
                    {tier.contents.map((c, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2.5 text-sm leading-relaxed text-dim"
                      >
                        <Check
                          className={`mt-0.5 size-4 shrink-0 ${s.text}`}
                          aria-hidden="true"
                        />
                        {c}
                      </li>
                    ))}
                  </ul>
                  <Button
                    render={<a href="#newsletter" />}
                    nativeButton={false}
                    variant={highlight ? "default" : "outline"}
                    size="lg"
                    className="mt-8 w-full font-mono text-[11px] font-semibold tracking-[0.18em] uppercase"
                  >
                    {tier.cta}
                  </Button>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-10">
          <p className="max-w-3xl font-mono text-[11px] leading-relaxed tracking-wide text-dim">
            {editions.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
