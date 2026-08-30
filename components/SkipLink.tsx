"use client";

import { useCopy } from "./SiteProvider";

/** First thing in the tab order, invisible until it is focused. */
export function SkipLink() {
  const t = useCopy();
  return (
    <a
      href="#main"
      className="type-label sr-only rounded-sm bg-clay px-4 py-3 text-paper focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-100"
    >
      {t.nav.skipToContent}
    </a>
  );
}
