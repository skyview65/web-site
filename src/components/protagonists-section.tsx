import { Reveal } from "@/components/reveal";
import { asset } from "@/lib/asset";
import type { Dictionary } from "@/lib/i18n/dictionary";

/** Visual config joined to dictionary copy by character id. */
const visuals = {
  mara: {
    image: "/images/protagonist-mara.webp",
    accent: "var(--neon-magenta)",
    text: "text-neon-magenta",
  },
  kaan: {
    image: "/images/protagonist-kaan.webp",
    accent: "var(--neon-cyan)",
    text: "text-neon-cyan",
  },
  solene: {
    image: "/images/protagonist-solene.webp",
    accent: "var(--neon-amber)",
    text: "text-neon-amber",
  },
} as const;

export function ProtagonistsSection({
  protagonists,
}: {
  protagonists: Dictionary["protagonists"];
}) {
  return (
    <section id="protagonists" className="bg-void py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="max-w-3xl">
          <span className="section-kicker text-neon-magenta">
            {protagonists.kicker}
          </span>
          <h2 className="section-title mt-4">{protagonists.title}</h2>
          <p className="mt-6 leading-relaxed text-dim">{protagonists.intro}</p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {protagonists.characters.map((c, i) => {
            const v = visuals[c.id];
            return (
              <Reveal key={c.id} style={{ "--rv-delay": `${i * 0.12}s` }}>
                <article
                  className="neon-frame group overflow-hidden"
                  style={{ "--ac": v.accent }}
                  tabIndex={0}
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={asset(v.image)}
                      alt={`${c.name} — ${c.role}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] group-focus-within:scale-[1.04]"
                    />
                    <div
                      className="absolute inset-0 bg-[linear-gradient(to_top,var(--void)_2%,transparent_45%)]"
                      aria-hidden="true"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p
                        className={`font-mono text-[10px] tracking-[0.3em] uppercase ${v.text}`}
                      >
                        {c.role}
                      </p>
                      <h3 className="font-display mt-1.5 text-xl font-bold tracking-wide text-ghost">
                        {c.name}
                      </h3>
                    </div>
                  </div>
                  <div className="space-y-3 p-5">
                    <p className={`text-sm font-medium ${v.text}`}>
                      {c.tagline}
                    </p>
                    <p className="text-sm leading-relaxed text-dim">{c.bio}</p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
