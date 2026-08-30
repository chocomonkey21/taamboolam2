"use client";

import Link from "next/link";
import { site } from "@/lib/site";
import { useSite } from "./SiteProvider";

/**
 * The name. A nameplate on a house, not a logo on a product — plain letterforms
 * with open tracking and no mark beside them.
 *
 * The Kannada wordmark leads when the site is being read in Kannada, and sits
 * beside the Latin one otherwise. Both are typographic, never an image.
 */
export function Wordmark({
  className = "",
  size = "sm",
  asLink = true,
}: {
  className?: string;
  size?: "sm" | "lg";
  asLink?: boolean;
}) {
  const { locale } = useSite();
  const kannadaFirst = locale === "kn";

  const scale =
    size === "lg"
      ? "text-[clamp(1.95rem,6.4vw,3.75rem)]"
      : "text-[17px] sm:text-[19px]";

  const inner = (
    <span
      /* Wraps rather than clips: at the hero size the two scripts do not fit
         on one line on a narrow phone, and the companion drops beneath the
         name instead of running off the edge. */
      className={`inline-flex flex-wrap items-baseline gap-x-2.5 gap-y-1 sm:gap-x-3.5 ${scale}`}
    >
      {/* Open tracking and uppercase belong to the Latin setting only.
          Kannada has no capitals, and letterspacing pulls its conjuncts apart
          into separate marks — ತಂಬೋಲಂ must be set solid. */}
      <span
        className={`font-heading leading-none font-normal ${
          kannadaFirst ? "" : "tracking-[0.2em] uppercase"
        }`}
        lang={kannadaFirst ? "kn" : "en"}
      >
        {kannadaFirst ? site.nameKn : site.name}
      </span>
      {/* The other script, set as a companion rather than a translation. Kept
          large enough to be read as a word — below about 11px Kannada
          conjuncts turn to texture — and never letterspaced, which damages
          them. It is decorative here because the primary already names the
          house, so it is hidden from screen readers. */}
      <span
        aria-hidden="true"
        className={`font-heading text-[0.62em] leading-none opacity-70 ${
          size === "sm" ? "hidden xs:inline" : ""
        }`}
        lang={kannadaFirst ? "en" : "kn"}
      >
        {kannadaFirst ? site.name : site.nameKn}
      </span>
    </span>
  );

  if (!asLink) {
    return <span className={className}>{inner}</span>;
  }

  return (
    <Link
      href="/"
      aria-label={`${site.name} — ${site.nameKn}`}
      className={`inline-block transition-opacity duration-200 hover:opacity-70 ${className}`}
    >
      {inner}
    </Link>
  );
}
