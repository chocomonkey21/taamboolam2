"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/**
 * The two things on this site that arrive rather than simply being there.
 *
 * This used to wrap almost every block on every page and fade it up from
 * opacity 0. Two things were wrong with that. Scrolling quickly left whole
 * blank viewports behind — the observer had not fired yet, so a reader moving
 * at any speed met a page of empty cream. And when it did fire, every section
 * on the site made the identical eight-pixel rise, which is not choreography,
 * it is a tic.
 *
 * So ordinary text is never wrapped in this any more. Body copy, lists and
 * links are at full opacity in the first paint, and this component now does
 * exactly two jobs:
 *
 *  - "photo": a photograph settles out of a slightly larger crop. A focus
 *    pull, not an entrance — and a photograph at 0.6 opacity for 300ms is
 *    never mistaken for broken the way half-legible body copy is.
 *  - "wipe": a mask opens across a heading from its leading edge, so the words
 *    are drawn rather than dimmed. Reserved for the two or three genuine
 *    chapter openings on a page.
 *
 * ── Nothing is hidden before it can be shown ──
 *
 * The resting state carries no mask and no opacity at all. The hidden state is
 * applied by `data-anim`, which is only ever set from a client effect, and only
 * on an element that is BELOW THE FOLD at that moment.
 *
 * Both halves of that matter. Setting it from an effect means the server's HTML
 * and every pre-hydration paint show the content outright — the first version
 * of this masked the heading in CSS from the first byte, so the Experience page
 * rendered its title as an empty three-line hole for as long as hydration took,
 * which on a slow phone is the whole first impression. And restricting it to
 * elements off screen means an element the reader is ALREADY LOOKING AT is
 * never animated: it does not blink out and wipe back in the moment the page
 * becomes interactive. What is on screen stays; what is not yet on screen gets
 * an entrance.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  variant = "photo",
  className = "",
  amount = 0.02,
  id,
}: {
  children: ReactNode;
  as?: ElementType;
  /** Stagger, in milliseconds. Keep small — this is pacing, not choreography. */
  delay?: number;
  variant?: "photo" | "wipe";
  className?: string;
  amount?: number;
  /**
   * Forwarded to the rendered element. A wiped heading is often the target of
   * an `aria-labelledby` on the section around it, and the id has to land on
   * the heading itself rather than on a wrapper.
   */
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Motion is unwelcome, or there is no observer to drive it: leave the
    // element exactly as it rendered and stop.
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      return;
    }

    // Already in view: this is not an entrance, it is the page. Leave it.
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;

    setArmed(true);

    /* Armed before the observer, because from here on the element IS hidden
       and every path has to end with it visible: a zero-height viewport, a
       browser that mis-measures a transformed ancestor, an observer that never
       fires. Worst case it appears without the animation, which is the correct
       way for this to fail. */
    const failsafe = window.setTimeout(() => setShown(true), 1200);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      /* A generous bottom margin: the trigger zone reaches most of a viewport
         PAST the bottom edge, so the animation has already finished by the
         time the element is actually on screen. The old 12% fired as the
         element crossed the edge, which is why a fast scroll outran it. */
      { threshold: amount, rootMargin: "0px 0px 65% 0px" },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, [amount]);

  return (
    <Tag
      ref={ref}
      id={id}
      data-anim={armed ? "true" : undefined}
      data-shown={shown ? "true" : "false"}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
      className={`${variant === "photo" ? "reveal-photo" : "wipe"} ${className}`}
    >
      {children}
    </Tag>
  );
}
