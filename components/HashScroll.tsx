"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Scrolls to `#floor3` (or whatever is in the URL) after a cross-page jump.
 *
 * The browser resolves a hash against the document it already has. Navigating
 * from Home to `/experience#floor3` is a client-side route change, so at the
 * moment the URL updates the Experience page has not rendered and `#floor3`
 * does not exist yet — the browser finds nothing, gives up, and never tries
 * again once React fills the page in. The floor ledger's rows all landed at
 * the top of the Experience page instead of at their floor.
 *
 * So the scroll is redone by hand once the target actually exists. Two frames
 * is enough for the new route's DOM to be laid out; the retry covers the case
 * where an image above the target settles late and moves it.
 *
 * `scroll-mt-*` on the chapter sections keeps the floating header from
 * covering the heading, so the offset is not repeated here.
 */
export function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash.length < 2) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let attempt = 0;
    let frame = 0;
    let timer = 0;

    const tryScroll = () => {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({
          behavior: reduced ? "auto" : "smooth",
          block: "start",
        });
        return;
      }
      // Not mounted yet. Try again next frame, but do not spin forever.
      if (attempt++ < 20) frame = requestAnimationFrame(tryScroll);
    };

    frame = requestAnimationFrame(tryScroll);
    // One late correction, for when a photograph above the target loads and
    // pushes it down after the first scroll has already run.
    timer = window.setTimeout(tryScroll, 500);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
