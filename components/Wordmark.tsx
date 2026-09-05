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
  size?: "sm" | "lg" | "column";
  asLink?: boolean;
}) {
  const { locale } = useSite();
  const kannadaFirst = locale === "kn";

  /* Kannada carries neither the uppercase transform nor the 0.2em tracking
     the Latin setting gets — both would break its conjuncts apart, see the
     span below. Losing that treatment also loses the visual weight it gives
     the name, so at an identical font-size the Kannada wordmark reads as
     conspicuously smaller and quieter than "TAAMBOOLAM" does, even though the
     glyphs themselves are not shorter. The same trade is made for
     .type-annotation in globals.css, which gives the Kannada setting a ~8%
     size increase in exchange for the tracking it cannot take; this applies
     the same idea here rather than leaving the wordmark looking like it
     shrank when the language switches. */
  /* "column" is the hero setting measured against its CONTAINER instead of
     the viewport, and it exists because the footer put this mark in a 5-of-12
     column while sizing it in vw. Between the md breakpoint and about 1200px
     the two disagree badly: at 900 the name ran 110px past its column and
     straight under the map panel beside it. cqw asks the column how wide it
     is, so the mark can no longer outgrow the box it is in. The hero keeps
     "lg" — it is full-bleed, where vw is the right question.

     The coefficient is measured, not guessed. Set solid with 0.2em tracking,
     TAAMBOOLAM runs about 9.2x its own font-size. The mark is allowed to use
     the gutter beside its column, which is what the original design did and
     is why this looked right on a wide screen — what it must not reach is the
     map panel, and that sits one column further over, so the usable width is
     about 1.2x the column. 9.2 into 1.2 gives 13cqw as the ceiling; 12.5
     keeps roughly 60px of clearance at every width between the md breakpoint
     and the container cap. Measured at 768, 900 and 1280.

     Those three widths are all at or above md, and that was the hole in it.
     Below md the footer stops being a twelve-column grid: the column becomes
     the whole page, so there is no gutter beside it and 1.2x of the column is
     1.2x of the viewport. On a 360px phone the mark set 39.5px and ran 368px
     wide inside a 316px container, pushing the document 30px wider than the
     screen — which is invisible on the page itself but drags the fixed header
     out with it and clips the nav plate off the right edge. That is what the
     owner photographed; the nav was the symptom and this was the cause.

     So the gutter allowance is now claimed only where a gutter exists. Below
     md the mark is held inside its own container: 9.2x a 10cqw setting is 92%
     of the column, which fits with room for the trailing letter-space. At md
     and up nothing changes. */
  const scale =
    size === "column"
      ? kannadaFirst
        ? "text-[clamp(1.9rem,11cqw,4.4rem)] md:text-[clamp(1.9rem,14cqw,4.4rem)]"
        : "text-[clamp(1.5rem,10cqw,3.75rem)] md:text-[clamp(1.5rem,12.5cqw,3.75rem)]"
      : size === "lg"
      ? kannadaFirst
        ? "text-[clamp(2.3rem,7.5vw,4.4rem)]"
        : "text-[clamp(1.95rem,6.4vw,3.75rem)]"
      : kannadaFirst
        ? "text-[clamp(16px,4.8vw,20px)] sm:text-[22px]"
        : "text-[clamp(14px,4.1vw,17px)] sm:text-[19px]";

  const inner = (
    <span
      /* Wraps rather than clips: at the hero size the two scripts do not fit
         on one line on a narrow phone, and the companion drops beneath the
         name instead of running off the edge. */
      className={`inline-flex flex-wrap items-baseline gap-x-2.5 gap-y-1 sm:gap-x-3.5 ${scale}`}
    >
      {/* Open tracking and uppercase belong to the Latin setting only.
          Kannada has no capitals, and letterspacing pulls its conjuncts apart
          into separate marks — ತಾಂಬೂಲಂ must be set solid. */}
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
      {size === "lg" || size === "column" ? (
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
      /* min-h-11 at nav size: the plate around this carries the padding,
         so the link itself was a 26px-tall tap target sitting inside a
         comfortable-looking object. The letterforms do not move; the hit area
         grows to meet the plate. */
      className={`inline-flex items-center transition-opacity duration-200 hover:opacity-70 ${
        size === "sm" ? "min-h-11" : ""
      } ${className}`}
    >
      {inner}
    </Link>
  );
}
