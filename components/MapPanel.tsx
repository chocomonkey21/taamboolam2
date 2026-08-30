"use client";

import { site } from "@/lib/site";
import { useSite } from "./SiteProvider";

/**
 * How to find the house — drawn, not embedded.
 *
 * The footer used to carry a Google Maps iframe. Three things were wrong with
 * it. It was a foreign object: Google's own blue links, orange restaurant pins
 * and grey road fills landed in the middle of a limewash-and-clay page and
 * were the loudest colours on the site. It loaded a third-party frame on a
 * site whose whole position is that it sets no cookies and runs no analytics.
 * And it implied a precision nobody has confirmed — a pin dropped by geocoding
 * an address string looks exactly as authoritative as a pin the owner placed.
 *
 * So this is a schematic instead: the block drawn in the house's own ink on
 * its own ground, with the two landmarks the owner actually gave as the way to
 * recognise the turning. It says what it is — a drawing, not a survey — and
 * "Directions" still hands the reader to a real map for the real route. When
 * the owner confirms the pin, nothing here has to change; the link stops
 * carrying its caveat on its own (see lib/site.ts).
 *
 * The street names are set in Latin in both languages. They are the names on
 * the signs, and a reader standing at the junction is matching them against
 * what is painted on the corner.
 */
export function MapPanel({ className = "" }: { className?: string }) {
  const { t } = useSite();

  return (
    <figure className={`relative ${className}`}>
      <svg
        viewBox="0 0 640 400"
        role="img"
        aria-label={t.footer.mapTitle}
        className="block h-auto w-full"
      >
        {/* The ground — the same limewash as the footer it sits in, so the
            panel is part of the page rather than a window cut into it. */}
        <rect width="640" height="400" fill="var(--color-paper)" />

        {/* The block grid, very quiet: enough to say that this is a residential
            grid, and no more. None of these lines is named, because naming a
            street nobody confirmed would be inventing one. */}
        <g
          stroke="var(--color-stone)"
          strokeWidth="1"
          opacity="0.5"
          fill="none"
        >
          <path d="M0 44h640M0 300h640M132 0v400M508 0v400" />
        </g>

        {/* Sarakki Main Road — the wide one, running across. Drawn as a band
            with a hairline on each edge, the way a road is drawn by hand. */}
        <g>
          <rect x="0" y="130" width="640" height="52" fill="var(--color-lime)" />
          <path
            d="M0 130h640M0 182h640"
            stroke="var(--color-ink-soft)"
            strokeWidth="1.25"
            opacity="0.7"
          />
          {/* The centre line, dashed the way a carriageway is marked. */}
          <path
            d="M0 156h640"
            stroke="var(--color-ochre)"
            strokeWidth="1.5"
            strokeDasharray="14 12"
            opacity="0.55"
          />
        </g>

        {/* 46th Cross — the turning, narrower, running down to the house. */}
        <g>
          <rect x="270" y="182" width="34" height="218" fill="var(--color-lime)" />
          <path
            d="M270 182v218M304 182v218"
            stroke="var(--color-ink-soft)"
            strokeWidth="1.25"
            opacity="0.7"
          />
        </g>

        {/* The two landmarks the owner gave. They are how you know you have
            found the turning, so they are drawn as real plots, not as pins. */}
        <g>
          <rect
            x="134"
            y="52"
            width="122"
            height="70"
            fill="var(--color-stone)"
            opacity="0.5"
          />
          <rect
            x="134"
            y="52"
            width="122"
            height="70"
            fill="none"
            stroke="var(--color-ink-soft)"
            strokeWidth="1"
            opacity="0.6"
          />
          <text
            x="195"
            y="82"
            textAnchor="middle"
            fill="var(--color-ink-soft)"
            fontSize="13.5"
            fontFamily="var(--font-sans)"
          >
            Sampradha
          </text>
          <text
            x="195"
            y="100"
            textAnchor="middle"
            fill="var(--color-ink-soft)"
            fontSize="13.5"
            fontFamily="var(--font-sans)"
          >
            Hospitals
          </text>

          <rect
            x="330"
            y="60"
            width="110"
            height="62"
            fill="var(--color-stone)"
            opacity="0.5"
          />
          <rect
            x="330"
            y="60"
            width="110"
            height="62"
            fill="none"
            stroke="var(--color-ink-soft)"
            strokeWidth="1"
            opacity="0.6"
          />
          <text
            x="385"
            y="86"
            textAnchor="middle"
            fill="var(--color-ink-soft)"
            fontSize="13.5"
            fontFamily="var(--font-sans)"
          >
            Sangeetha
          </text>
          <text
            x="385"
            y="104"
            textAnchor="middle"
            fill="var(--color-ink-soft)"
            fontSize="13.5"
            fontFamily="var(--font-sans)"
          >
            Mobiles
          </text>
        </g>

        {/* The house. Drawn as a stack of five, because that is what it is —
            four guest floors and the private fifth on top — and marked with
            the tile motif on the two floors that carry the tiles. */}
        <g transform="translate(322 216)">
          <rect
            x="0"
            y="0"
            width="150"
            height="150"
            fill="var(--color-clay)"
            opacity="0.1"
          />
          <rect
            x="0"
            y="0"
            width="150"
            height="150"
            fill="none"
            stroke="var(--color-clay)"
            strokeWidth="1.75"
          />
          {/* The floor slabs. Five levels: four for guests, and the private
              fifth at the top, which is why the topmost band carries no tile
              and no label. */}
          <path
            d="M0 30h150M0 60h150M0 90h150M0 120h150"
            stroke="var(--color-clay)"
            strokeWidth="1"
            opacity="0.5"
          />
          {/* A tile laid on the two floors that have them. Second and third
              band from the bottom — Floors 3 and 4 of the four guest levels,
              read the way a section is read: upward. */}
          <g
            fill="none"
            stroke="var(--color-ochre)"
            strokeWidth="1.5"
            opacity="0.95"
          >
            <path d="M75 36c3.4 5.2 6.8 8.6 12 12-5.2 3.4-8.6 6.8-12 12-3.4-5.2-6.8-8.6-12-12 5.2-3.4 8.6-6.8 12-12Z" />
            <path d="M75 66c3.4 5.2 6.8 8.6 12 12-5.2 3.4-8.6 6.8-12 12-3.4-5.2-6.8-8.6-12-12 5.2-3.4 8.6-6.8 12-12Z" />
          </g>
        </g>

        {/* The mark. Not a map pin — a plumb line dropped from the road onto
            the plot, which is the same drawing the rest of the site is set
            against. */}
        <g>
          <path
            d="M397 170v46"
            stroke="var(--color-clay)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <circle cx="397" cy="170" r="5" fill="var(--color-clay)" />
        </g>

        {/* Road names, set along the roads the way they are on a drawing. */}
        <text
          x="24"
          y="152"
          fill="var(--color-ink)"
          fontSize="14"
          letterSpacing="0.1em"
          fontFamily="var(--font-sans)"
          opacity="0.85"
        >
          SARAKKI MAIN ROAD
        </text>
        <text
          x="287"
          y="308"
          textAnchor="middle"
          transform="rotate(-90 287 308)"
          fill="var(--color-ink)"
          fontSize="13"
          letterSpacing="0.1em"
          fontFamily="var(--font-sans)"
          opacity="0.8"
        >
          46TH CROSS
        </text>
        <text
          x="24"
          y="32"
          fill="var(--color-ink-soft)"
          fontSize="12.5"
          letterSpacing="0.14em"
          fontFamily="var(--font-sans)"
        >
          8TH BLOCK, JAYANAGAR
        </text>

        {/* North. A hairline and a letter, the way it is drawn on a plan. */}
        <g transform="translate(600 26)">
          <path
            d="M0 26V2M0 2l-6 8M0 2l6 8"
            stroke="var(--color-ink-soft)"
            strokeWidth="1.25"
            fill="none"
          />
          <text
            x="0"
            y="44"
            textAnchor="middle"
            fill="var(--color-ink-soft)"
            fontSize="12"
            fontFamily="var(--font-sans)"
          >
            N
          </text>
        </g>

        {/* The house's own name, hung off the plot. */}
        <text
          x="486"
          y="240"
          fill="var(--color-clay-deep)"
          fontSize="18"
          fontFamily="var(--font-heading)"
          letterSpacing="0.06em"
        >
          {site.name}
        </text>
      </svg>

      <figcaption className="type-caption mt-3">
        {t.footer.mapSchematic}
      </figcaption>
    </figure>
  );
}
