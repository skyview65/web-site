import type { SVGProps } from "react";

/**
 * LUMENFALL brand marks — hand-drawn SVGs so the identity ships with the
 * bundle (no font dependency for the logo itself).
 */

/** Angular L monogram with a falling light shard, inside a hex-cut frame;
 *  also the favicon source. */
export function LumenfallMonogram(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" {...props}>
      <path
        d="M32 2 58 15v34L32 62 6 49V15L32 2Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M24 20h8v18h12v8H24V20Z" fill="currentColor" />
      <path d="M38 14h6l-4 10h-6l4-10Z" fill="currentColor" opacity="0.55" />
    </svg>
  );
}

/** Horizontal wordmark: monogram + LUMENFALL lettering. */
export function LumenfallWordmark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 236 32" fill="none" aria-hidden="true" {...props}>
      <path
        d="M16 1 29 7.5v17L16 31 3 24.5v-17L16 1Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M12 10h4v9h6v4H12V10Z" fill="currentColor" />
      <path d="M19 7h3l-2 5h-3l2-5Z" fill="currentColor" opacity="0.55" />
      <text
        x="38"
        y="23"
        fill="currentColor"
        fontFamily="var(--font-display), sans-serif"
        fontSize="18"
        fontWeight="700"
        letterSpacing="3.5"
      >
        LUMENFALL
      </text>
    </svg>
  );
}
