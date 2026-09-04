"use client";

import { site } from "@/lib/site";
import { useSite } from "./SiteProvider";

/**
 * Where the house is.
 *
 * This was a hand-drawn schematic for most of the project's life, because the
 * pin was a geocoded guess and a drawing could not overstate a precision
 * nobody had confirmed. The owner has since supplied the house's own Google
 * Maps record, so the map can now be the real one.
 *
 * It is Google's keyless `output=embed`, and it is the only third-party thing
 * on the site. Two consequences, both handled rather than hoped away:
 *
 *  - `middleware.ts` carries a `frame-src` for www.google.com. Without it the
 *    Content-Security-Policy blocks this frame silently — a blank panel with
 *    an error only in the console.
 *  - The privacy page no longer claims there is no third-party anything. It
 *    says the map is Google's and that loading the page tells them so.
 *
 * `loading="lazy"` keeps it out of the initial load: the map sits at the very
 * bottom of a long page, so most readers never reach it and never pay for it.
 * `referrerPolicy` sends the origin and not the path.
 *
 * The frame is given the page's own border and radius so it reads as part of
 * the footer rather than a window punched through it, and "Directions" below
 * still hands the reader to real routing.
 */
export function MapPanel({ className = "" }: { className?: string }) {
  const { t } = useSite();

  return (
    <figure className={`relative ${className}`}>
      <div className="rule-atmos overflow-hidden rounded-[var(--radius-md)] border">
        <iframe
          src={site.location.mapEmbed}
          title={t.footer.mapTitle}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block h-[16rem] w-full border-0 md:h-[18rem]"
        />
      </div>

      <figcaption className="type-caption mt-3">
        {t.footer.mapSchematic}
      </figcaption>
    </figure>
  );
}
