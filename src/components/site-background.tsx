/**
 * Global atmospheric backdrop for CALA.
 *
 * A single fixed, non-interactive stack that sits behind every page:
 *   1. the night gradient (on-brand `--gece` so first paint is correct),
 *   2. a subtle, darkened iridescent wash — the supplied oil-slick texture
 *      (`/images/iridescence-wash.webp`) at low opacity so it only shimmers,
 *   3. a gold "moonlight" vignette echoing the reference `.ay-isigi`,
 *   4. a fine film grain (SVG fractal noise).
 *
 * All styling lives in globals.css (`.bg-*`) alongside the rest of the CALA
 * design system. Layers are `aria-hidden` and `pointer-events:none`.
 */
export function SiteBackground() {
  return (
    <div className="bg-stage" aria-hidden="true">
      <div className="bg-night" />
      <div className="bg-irid" />
      <div className="bg-aura" />
      <div className="bg-moon" />
      <div className="bg-grain" />
    </div>
  );
}
