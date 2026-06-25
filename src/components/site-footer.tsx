/**
 * Site footer — quiet, editorial. Address, hours, contact and the "nine
 * suites above the cove" note, on the same gece/kemik/ay palette.
 */
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div className="foot-brand">
          <span className="brand">CALA</span>
          <p>
            Kaş&apos;ta gizli bir koyda, denize bakan dokuz oda. Sofra denizden
            ve bahçeden kurulur.
          </p>
          <div className="foot-social">
            <a
              href="https://www.instagram.com"
              aria-label="Instagram"
              target="_blank"
              rel="noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </div>
        </div>

        <div className="foot-col">
          <h2 className="foot-col__title">Adres</h2>
          <ul>
            <li>Çukurbağ Yarımadası</li>
            <li>Kaş · Antalya</li>
            <li>Türkiye</li>
          </ul>
        </div>

        <div className="foot-col">
          <h2 className="foot-col__title">Saatler</h2>
          <ul>
            <li>Kahvaltı&nbsp;&nbsp;08:00 – 11:30</li>
            <li>Öğle&nbsp;&nbsp;12:30 – 15:00</li>
            <li>Akşam&nbsp;&nbsp;19:30 · tek oturum</li>
          </ul>
        </div>

        <div className="foot-col">
          <h2 className="foot-col__title">İletişim</h2>
          <ul>
            <li>
              <a href="#rezervasyon">Rezervasyon</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="foot-bottom">
        <span>© 2026 CALA · Kaş</span>
        <span>Denizden ve bahçeden</span>
      </div>
    </footer>
  );
}
