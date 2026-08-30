"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/**
 * Reveals its children once, when they first come into view.
 *
 * The element is fully laid out from the start — only opacity and a small
 * transform change — so nothing shifts and nothing is hidden from a reader who
 * has motion turned off, or from a browser where the observer never fires.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  variant = "rise",
  className = "",
  amount = 0.18,
}: {
  children: ReactNode;
  as?: ElementType;
  /** Stagger, in milliseconds. Keep small — this is pacing, not choreography. */
  delay?: number;
  /** "rise" moves the block; "photo" scales and focuses the image inside it. */
  variant?: "rise" | "photo";
  className?: string;
  amount?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // No observer, or motion is unwelcome: show it immediately and stop.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    // Already on screen at mount (above the fold): reveal without waiting.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { threshold: amount, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [amount]);

  return (
    <Tag
      ref={ref}
      data-shown={shown ? "true" : "false"}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
      className={`${variant === "photo" ? "reveal-photo" : "reveal"} ${className}`}
    >
      {children}
    </Tag>
  );
}
