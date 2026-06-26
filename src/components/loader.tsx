"use client";

import { useEffect, useState } from "react";

/**
 * Opening curtain: the CALA wordmark breathes over the night ground, a gold
 * hairline draws beneath it, then the whole layer lifts away once the page is
 * ready (and never lingers past a hard 2s cap).
 */
export function Loader() {
  const [gone, setGone] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let done = false;
    const leave = () => {
      if (done) return;
      done = true;
      setGone(true);
      window.setTimeout(() => setHidden(true), 900);
    };
    const onReady = () => window.setTimeout(leave, 480);
    if (document.readyState === "complete") onReady();
    else window.addEventListener("load", onReady, { once: true });
    const cap = window.setTimeout(leave, 2000);
    return () => {
      window.removeEventListener("load", onReady);
      window.clearTimeout(cap);
    };
  }, []);

  if (hidden) return null;
  return (
    <div className={`loader${gone ? " gitti" : ""}`} aria-hidden="true">
      <span className="loader-mark serif">CALA</span>
      <span className="loader-line" />
    </div>
  );
}
