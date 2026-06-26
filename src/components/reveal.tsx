import { cloneElement, isValidElement, type ReactElement } from "react";

type RevealChildProps = { className?: string };

/**
 * Marks its single child as a reveal target by adding the `.rv` (or `.rv-mask`)
 * class — no wrapper element, so the DOM stays faithful and `:last-of-type`
 * selectors on `.suit` keep working. The actual fade/slide is driven centrally
 * by <RevealController/> (mounted in layout), mirroring the reference's single
 * IntersectionObserver over all `.rv` nodes.
 */
export function Reveal({
  children,
  variant,
}: {
  children: ReactElement<RevealChildProps>;
  variant?: "mask";
}) {
  if (!isValidElement(children)) return children;
  const base = children.props.className ?? "";
  const className = `${base} rv${variant === "mask" ? " rv-mask" : ""}`.trim();
  return cloneElement(children, { className });
}
