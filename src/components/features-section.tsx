import { Car, Cpu, Orbit, Radio, Coins, Users } from "lucide-react";
import { Reveal } from "@/components/reveal";
import type { Dictionary } from "@/lib/i18n/dictionary";

const icons = [Orbit, Cpu, Users, Radio, Coins, Car];
const accents = [
  "text-neon-cyan",
  "text-neon-magenta",
  "text-neon-amber",
  "text-neon-cyan",
  "text-neon-amber",
  "text-neon-magenta",
];

export function FeaturesSection({
  features,
}: {
  features: Dictionary["features"];
}) {
  return (
    <section id="features" className="relative bg-void py-20 md:py-28">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_0%,oklch(0.18_0.022_290/60%),transparent_70%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="max-w-3xl">
          <span className="section-kicker text-neon-amber">
            {features.kicker}
          </span>
          <h2 className="section-title mt-4">{features.title}</h2>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.items.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <Reveal key={item.title} style={{ "--rv-delay": `${(i % 3) * 0.1}s` }}>
                <article className="h-full border border-line bg-carbon/40 p-6 transition-colors duration-500 hover:border-neon-cyan/40">
                  <Icon
                    className={`size-6 ${accents[i % accents.length]}`}
                    aria-hidden="true"
                  />
                  <h3 className="font-display mt-5 text-lg font-bold tracking-wide text-ghost">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-dim">
                    {item.body}
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
