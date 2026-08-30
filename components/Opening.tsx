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

  return (
    <div className="opening-veil pointer-events-none" aria-hidden="true">
      <span className="font-heading text-[clamp(1.5rem,6vw,2.75rem)] leading-none tracking-[0.24em] uppercase">
        {locale === "kn" ? site.nameKn : site.name}
      </span>
    </div>
  );
}
