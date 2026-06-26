import { T } from "@/components/i18n";

/** "Rezervasyon" — the invitation to write, with the gold request CTA. */
export function Rezervasyon() {
  return (
    <section id="rezervasyon">
      <T id="rez_tag" tr="REZERVASYON" className="etiket rv" />
      <T
        id="rez_h2"
        tr="Deniz, <em>beklemesini</em><br>bilenlerindir."
        as="h2"
        className="rv"
      />
      <a className="rez-cta rv" href="mailto:rezervasyon@cala-kas.com">
        <T id="rez_cta" tr="Rezervasyon talebi gönderin" />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M3 12h18M14 5l7 7-7 7" />
        </svg>
      </a>
      <T
        id="rez_detay"
        tr="KONUM · Likya Yolu sapağı, Kaş / Antalya"
        as="div"
        className="rez-detay rv"
      />
    </section>
  );
}
