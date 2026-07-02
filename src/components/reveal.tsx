"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

interface RvProps {
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * Fade + slide-up on first scroll into view (`.rv` → `.rv.on`), the reveal
 * CALA applies to its content blocks. Renders the real element (`as`) so the
 * DOM matches the original markup instead of adding wrapper divs.
 */
export function Rv({ as = "div", className = "", style, children }: RvProps) {
  const Tag = as;
  const ref = useRef<HTMLElement | null>(null);
  const [on, setOn] = useState(false);

  // Under prefers-reduced-motion, CSS already forces .rv fully visible, so
  // the observer only ever adds polish — no synchronous state needed here.
  useEffect(() => {
    const el = ref.current;
    if (!el || on) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setOn(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -36px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [on]);

  return (
    <Tag ref={ref} style={style} className={`${className} rv${on ? " on" : ""}`.trim()}>
      {children}
    </Tag>
  );
}
