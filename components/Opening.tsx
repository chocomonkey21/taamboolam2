"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { useSite } from "./SiteProvider";

const SEEN_KEY = "taamboolam-opened";

/**
 * The opening: the wordmark alone on warm white, for a little over a second,
 * and then the house.
 *
 * It is non-blocking in every sense that matters — the page beneath is already
 * rendered and interactive, the veil is aria-hidden and cannot take focus, it
 * stops accepting pointer events immediately, and it is skipped entirely for
 * readers with reduced motion and for anyone who has already seen it this
 * session.
 */
export function Opening() {
  const { locale } = useSite();
  const [play, setPlay] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Storage blocked — show it, once, for this page view.
    }
    setPlay(true);
    const done = window.setTimeout(() => setPlay(false), 1400);
    return () => window.clearTimeout(done);
  }, []);

  if (!play) return null;

  const kannada = locale === "kn";

  return (
    <div className="opening-veil pointer-events-none" aria-hidden="true">
      {/* Uppercase and open tracking are a Latin setting only. Kannada has no
          capitals, and letterspacing pulls its conjuncts apart into separate
          marks — ತಾಂಬೂಲಂ must be set solid, the same rule the wordmark follows.
          It also sets a little larger, because losing that treatment loses the
          weight it carries. */}
      <span
        lang={kannada ? "kn" : "en"}
        className={`font-heading leading-none ${
          kannada
            ? "text-[clamp(1.75rem,7vw,3.25rem)]"
            : "text-[clamp(1.5rem,6vw,2.75rem)] tracking-[0.24em] uppercase"
        }`}
      >
        {kannada ? site.nameKn : site.name}
      </span>
    </div>
  );
}
