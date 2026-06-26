"use client";

import { useI18n } from "@/components/language-provider";
import type { MessageKey } from "@/lib/i18n/messages";

/**
 * Reusable full-bleed cover (`.kapak`): a darkened image with a centered serif
 * title, down-arrow and a mono caption. Used as the section anchor (e.g. id
 * "suitler") so nav + rail can target it.
 */
export function Cover({
  id,
  src,
  alt,
  titleKey,
  captionKey,
}: {
  id: string;
  src: string;
  alt: string;
  titleKey: MessageKey;
  captionKey: MessageKey;
}) {
  const { t } = useI18n();
  return (
    <div className="kapak" id={id}>
      <div className="k-img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading="lazy" />
      </div>
      <h2 dangerouslySetInnerHTML={{ __html: t(titleKey) }} />
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
      <span className="k-alt" dangerouslySetInnerHTML={{ __html: t(captionKey) }} />
    </div>
  );
}
