"use client";

import { useEffect, useRef } from "react";
import { T } from "@/components/i18n";

/**
 * "Dalış" — the cove, underwater. A sticky full-height clip that plays only
 * while the section is on screen (and pauses otherwise to save battery).
 */
export function Dalis() {
  const secRef = useRef<HTMLElement>(null);
  const vidRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const sec = secRef.current;
    const v = vidRef.current;
    if (!sec || !v) return;
    v.muted = true;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const p = v.play();
            if (p) p.catch(() => {});
          } else {
            v.pause();
          }
        });
      },
      { threshold: 0.12 },
    );
    io.observe(sec);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={secRef} className="dalis" id="dalis" aria-label="Koya dalış">
      <div className="dalis-sticky">
        <video
          ref={vidRef}
          className="dalis-video"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/images/dalis-poster.jpg"
          aria-hidden="true"
        >
          <source src="/videos/dalis.mp4" type="video/mp4" />
        </video>
        <div className="dalis-karart" aria-hidden="true" />
        <div className="dalis-yazi">
          <T id="dalis_tag" tr="KOY · SU ALTI" className="d-etiket" />
          <T
            id="dalis_h2"
            tr="Deniz, beklemesini bilenlerindir."
            as="h2"
            className="d-baslik serif"
          />
          <T
            id="dalis_alt"
            tr="Kırk metre aşağıda, kimsenin görmediği bir berraklık."
            as="p"
            className="d-alt"
          />
        </div>
      </div>
    </section>
  );
}
