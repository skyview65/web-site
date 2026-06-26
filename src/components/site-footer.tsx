import { T } from "@/components/i18n";

export function SiteFooter() {
  return (
    <footer>
      <span className="fm">CALA</span>
      <T id="footer_loc" tr="KAŞ · ANTALYA · TÜRKİYE" />
      <T
        id="footer_soc"
        tr='<a href="https://www.instagram.com" target="_blank" rel="noreferrer">INSTAGRAM</a> &nbsp;·&nbsp; <a href="#">GÜNCE</a> &nbsp;·&nbsp; © CALA 2026'
      />
      <T
        id="footer_kurgu"
        tr="KURGUSAL KONSEPT TESİS · TASARIM: KİVANC · YORUMLAR TEMSİLİDİR"
        className="kurgu"
      />
      <span className="atelance" lang="en">
        <span className="by">Designed by</span>{" "}
        <span className="studio">Atelance</span>
      </span>
    </footer>
  );
}
