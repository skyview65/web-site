"use client";

import { useEffect, useState } from "react";

/**
 * Brand loader: covers the page briefly, fades out once hydrated, then
 * unmounts entirely (the original kept a hidden fixed overlay in the DOM).
 * A <noscript> rule in the layout hides it for no-JS visitors.
 */
export function Loader() {
  const [gone, setGone] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const fade = setTimeout(() => setGone(true), 500);
    const remove = setTimeout(() => setRemoved(true), 1600);
    return () => {
      clearTimeout(fade);
      clearTimeout(remove);
    };
  }, []);

  if (removed) return null;
  return (
    <div className={`loader${gone ? " gitti" : ""}`} aria-hidden="true">
      <span className="serif">CALA</span>
    </div>
  );
}
