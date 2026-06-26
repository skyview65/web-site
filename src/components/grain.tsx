/**
 * Fixed film-grain overlay — a faint analog tooth over the whole page so the
 * deep navy never looks flat. Pure CSS (see `.grain` in globals.css).
 */
export function Grain() {
  return <div className="grain" aria-hidden="true" />;
}
