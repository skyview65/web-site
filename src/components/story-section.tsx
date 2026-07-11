import { Reveal } from "@/components/reveal";
import type { Dictionary } from "@/lib/i18n/dictionary";

/**
 * The narration: a plain-language story strip between the cover and the
 * city deep-dive. Three short statements anyone can follow — where the
 * game is set, who rules it, who you are — then the thesis line in neon.
 */
export function StorySection({ story }: { story: Dictionary["story"] }) {
  return (
    <section className="relative bg-void" aria-label={story.kicker}>
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-10 px-5 py-24 text-center md:gap-14 md:px-8 md:py-36">
        <Reveal>
          <span className="section-kicker text-neon-cyan">{story.kicker}</span>
        </Reveal>
        {story.lines.map((line, i) => (
          <Reveal key={i} style={{ "--rv-delay": `${i * 120}ms` }}>
            <p className="text-xl leading-snug font-medium text-ghost md:text-3xl md:leading-snug">
              {line}
            </p>
          </Reveal>
        ))}
        <Reveal>
          <p className="font-display text-2xl font-bold tracking-wide text-neon-cyan drop-shadow-[0_0_24px_oklch(0.82_0.13_205_/_45%)] md:text-4xl">
            {story.outro}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
