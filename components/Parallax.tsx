"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Lets a full-bleed photograph drift slightly slower than the page.
 *
 * Kept deliberately under the threshold where parallax announces itself: the
 * image moves about 7% of its own height across a full pass through the
 * viewport, which reads as depth rather than as an effect. Anything stronger
 * on a site this quiet would be the loudest thing on it.
 *
 * Three rules it holds to:
 *  - Nothing runs unless the element is actually on screen (IntersectionObserver
 *    gates the scroll listener, so four of these do not all recalculate on
 *    every scroll event of a 12,000px page).
 *  - Work happens in a rAF, and only transform changes — never a layout
 *    property — so it stays on the compositor.
 *  - Under prefers-reduced-motion it never attaches at all and the child sits
 *    exactly where it would have without this component.
 */
export function Parallax({
  children,
  /** Fraction of the element's height to travel. 0.07 ≈ a seventh of a crop. */
  strength = 0.07,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const frame = outer.current;
    const moving = inner.current;
    if (!frame || !moving) return;

    let ticking = false;
    let active = false;

    const update = () => {
      ticking = false;
      const rect = frame.getBoundingClientRect();
      const travel = rect.height * strength;
      // -1 when the element's centre is a viewport below the middle, +1 above.
      const progress =
        (window.innerHeight / 2 - (rect.top + rect.height / 2)) /
        (window.innerHeight / 2 + rect.height / 2);
      moving.style.transform = `translate3d(0, ${(progress * travel).toFixed(2)}px, 0)`;
    };

    const onScroll = () => {
      if (ticking || !active) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        active = entries[0]?.isIntersecting ?? false;
        if (active) update();
      },
      { rootMargin: "10% 0px" },
    );

    observer.observe(frame);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      moving.style.transform = "";
    };
  }, [strength]);

  return (
    <div ref={outer} className={`overflow-hidden ${className}`}>
      {/* Scaled up by the same amount it will travel, so the drift never
          exposes an edge of the frame. */}
      <div
        ref={inner}
        style={{ scale: `${1 + strength * 2}` }}
        className="will-change-transform"
      >
        {children}
      </div>
    </div>
  );
}
