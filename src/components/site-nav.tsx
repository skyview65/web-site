/**
 * Fixed CALA top navigation — the elite frame for the site.
 *
 * A three-column grid mirroring the reference `nav`: a quiet location tag on
 * the left, the Italiana `CALA` emblem centred, and a hairline "REZERVASYON"
 * pill on the right that warms to gold on hover. Styling lives in globals.css
 * (`.site-nav`, `.nav-*`). Static by design — no menu overlay in this view.
 */
export function SiteNav() {
  return (
    <nav className="site-nav" aria-label="Ana gezinme">
      <span className="nav-mark">
        KAŞ · LİKYA
        <i aria-hidden="true">36°12′N</i>
      </span>

      <a href="#top" className="nav-amblem" aria-label="CALA — ana sayfa">
        CALA
      </a>

      <a href="#rezervasyon" className="nav-rez">
        REZERVASYON
      </a>
    </nav>
  );
}
