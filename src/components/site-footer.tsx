"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { LumenfallMonogram } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import type { Dictionary } from "@/lib/i18n/dictionary";

export function SiteFooter({
  newsletter,
  footer,
  platforms,
}: {
  newsletter: Dictionary["newsletter"];
  footer: Dictionary["footer"];
  platforms: string;
}) {
  const [done, setDone] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDone(true);
  };

  return (
    <footer className="border-t border-line bg-void-deep bg-[radial-gradient(80%_60%_at_50%_100%,oklch(0.18_0.022_290/50%),transparent_70%)]">
      <div id="newsletter" className="mx-auto max-w-2xl scroll-mt-24 px-5 py-20 text-center md:py-24">
        <Reveal>
          <LumenfallMonogram className="mx-auto size-10 text-neon-cyan" />
          <h2 className="section-title mt-6 text-[clamp(22px,3.4vw,36px)]">
            {newsletter.title}
          </h2>
          <p className="mt-4 text-dim">{newsletter.body}</p>

          {done ? (
            <p
              className="mt-8 border border-neon-cyan/40 bg-carbon/60 px-5 py-4 text-sm text-neon-cyan shadow-[0_0_30px_oklch(0.82_0.13_205/15%)]"
              role="status"
            >
              {newsletter.success}
            </p>
          ) : (
            <form
              onSubmit={onSubmit}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                placeholder={newsletter.placeholder}
                aria-label={newsletter.placeholder}
                className="h-11 flex-1 border border-line bg-carbon/50 px-4 text-sm text-ghost placeholder:text-dim/70 focus-visible:border-neon-cyan/60 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
              />
              <Button
                type="submit"
                size="lg"
                className="h-11 px-6 font-mono text-[11px] font-semibold tracking-[0.18em] uppercase shadow-[0_0_24px_oklch(0.8_0.16_75/30%)]"
              >
                {newsletter.button}
              </Button>
            </form>
          )}
          <p className="mt-4 font-mono text-[10px] tracking-wide text-dim/80">
            {newsletter.privacy}
          </p>
        </Reveal>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-5 py-10 text-center md:px-8">
          <p className="font-mono text-[10px] tracking-[0.28em] text-dim uppercase">
            {platforms}
          </p>
          <p className="max-w-2xl text-xs leading-relaxed text-dim/80">
            {footer.fictional}
          </p>
          <p className="font-mono text-[10px] tracking-wide text-dim/60">
            {footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
