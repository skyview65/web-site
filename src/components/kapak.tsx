import Image from "next/image";
import { T } from "@/components/i18n";

/**
 * Full-bleed chapter cover (à la "Süitler"): a darkened photograph, a wide-
 * tracked serif title, a bobbing down-arrow and a mono caption.
 */
export function Kapak({
  id,
  img,
  alt,
  h2Id,
  h2Tr,
  altId,
  altTr,
}: {
  id: string;
  img: string;
  alt: string;
  h2Id: string;
  h2Tr: string;
  altId: string;
  altTr: string;
}) {
  return (
    <div className="kapak" id={id}>
      <div className="k-img">
        <Image src={img} alt={alt} fill sizes="100vw" />
      </div>
      <T id={h2Id} tr={h2Tr} as="h2" />
      <svg
        className="ok-asagi"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        aria-hidden="true"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
      <T id={altId} tr={altTr} className="k-alt" />
    </div>
  );
}
