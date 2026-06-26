"use client";

import { useEffect, useState } from "react";

/**
 * Cinematic entrance loader: "CALA" with an iridescent sheen sweep over a thin
 * gold progress hairline. Fades out shortly after the document is ready (mirrors
 * the reference loader timing + 2s safety cap).
 */
export function Loader() {
  const [gone, setGone] = useState(false);
  const [unmount, setUnmount] = useState(false);

  useEffect(() => {
    let done = false;
    const hide = () => {
      if (done) return;
      done = true;
      setGone(true);
      window.setTimeout(() => setUnmount(true), 950);
    };

    const t1 = window.setTimeout(hide, 600);
    const t2 = window.setTimeout(hide, 2000);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  if (unmount) return null;

  return (
    <div className={`loader${gone ? " gitti" : ""}`} aria-hidden="true">
      <span className="lmark">CALA</span>
      <span className="lbar">
        <i />
      </span>
    </div>
  );
}
