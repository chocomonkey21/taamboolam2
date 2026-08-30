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

  /* Kannada carries neither the uppercase transform nor the 0.2em tracking
     the Latin setting gets — both would break its conjuncts apart, see the
     span below. Losing that treatment also loses the visual weight it gives
     the name, so at an identical font-size the Kannada wordmark reads as
     conspicuously smaller and quieter than "TAAMBOOLAM" does, even though the
     glyphs themselves are not shorter. The same trade already exists for
     .type-eyebrow in globals.css (uppercase+tracking traded for a ~18% size
     increase); this applies that same ratio here rather than leaving the
     wordmark looking like it shrank when the language switches. */
  const scale =
    size === "lg"
      ? kannadaFirst
        ? "text-[clamp(2.3rem,7.5vw,4.4rem)]"
        : "text-[clamp(1.95rem,6.4vw,3.75rem)]"
      : kannadaFirst
        ? "text-[20px] sm:text-[22px]"
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
          house, so it is hidden from screen readers.

          Shown only at the "lg" hero size, where it is large enough to clear
          that floor and genuinely reads as an authored bilingual mark. At
          nav size the companion would render at or below the 11px floor
          itself — texture, not type — inside an already-tight oval that sits
          beside the English/ಕನ್ನಡ toggle, which already states the second
          language plainly. Dropping it there is a legibility fix, not a
          simplification for its own sake. */}
      {size === "lg" ? (
        <span
          aria-hidden="true"
          className="font-heading text-[0.62em] leading-none opacity-70"
          lang={kannadaFirst ? "en" : "kn"}
        >
          {kannadaFirst ? site.name : site.nameKn}
        </span>
      ) : null}
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
