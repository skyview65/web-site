/**
 * Closing CALA mark + footer.
 *
 * The oversized Italiana wordmark is rendered as an outline stroke (transparent
 * fill) — the reference `.kapanis .marka` — so the iridescent backdrop reads
 * faintly through the letters. Below it, a hairline footer row carries the
 * essentials in JetBrains Mono. Styling lives in globals.css.
 */
export function SiteFooter() {
  return (
    <>
      <div className="kapanis" aria-hidden="true">
        <span className="marka">CALA</span>
      </div>

      <footer className="site-footer" id="rezervasyon">
        <span className="fm">CALA</span>

        <nav className="foot-links" aria-label="Alt gezinme">
          <a href="mailto:rezervasyon@cala.com">REZERVASYON@CALA.COM</a>
          <span className="dot" aria-hidden="true">·</span>
          <a href="tel:+902421234567">+90 242 123 45 67</a>
          <span className="dot" aria-hidden="true">·</span>
          <span>KAŞ · ANTALYA · TÜRKİYE</span>
        </nav>

        <span className="kurgu">
          © 2026 CALA — LİKYA KIYISINDA SAKLI BİR KOY, DOKUZ SÜİT · TÜM HAKLARI
          SAKLIDIR
        </span>
      </footer>
    </>
  );
}
