"use client";

import Link from "next/link";
import type { FloorId } from "@/lib/content";
import type { PhotoId } from "@/lib/photos";
import { Photo } from "./Photo";
import { useSite } from "./SiteProvider";

/**
 * The three guest floors, and then the terrace.
 *
 * The fourth row is not a fourth floor and must not read as one. It carries
 * the terrace's own atmosphere — the one that goes cool where the three below
 * it went warm — and its numeral is a mark rather than "04", because
 * numbering it would put it back in the sequence the copy spends a paragraph
 * taking it out of.
 */
const FLOORS: {
  id: FloorId;
  photo: PhotoId;
  atmosphere: string;
  /** Where a 21:9 crop should bite. Only set where the default is wrong. */
  objectPosition?: string;
}[] = [
  /* The room photographs, not the bedrooms.
     Each row crops its picture to a 21:9 strip, and a bedroom shot put
     through that crop comes out as a band of white duvet — three rows of
     anonymous bedding that told a reader nothing about how the floors
     differ, which is the one job this ledger has. The living rooms and
     kitchens are natively landscape, so they survive the strip, and they
     are also the more useful preview: a floor here is a household, and
     this is the part of it you share. */
  { id: "floor1", photo: "floor1b", atmosphere: "floor-1" },
  { id: "floor2", photo: "floor2b", atmosphere: "floor-2" },
  { id: "floor3", photo: "floor3b", atmosphere: "floor-3" },
  /* The terrace band is already a 3.5:1 crop of a taller frame. Squeezing
     it into 21:9 takes the middle, which is corrugated pergola roof and
     reads as a carport. Biting low puts the planters, the sky and the
     rooftops in the strip instead. */
  {
    id: "terrace",
    photo: "terraceOpen",
    atmosphere: "terrace",
    objectPosition: "center 88%",
  },
];

/**
 * The house, read as a section drawn through the building rather than as four
 * cards in a tray.
 *
 * The house's defining fact is that it is stacked, and a row of equal tiles
 * throws that away — it says "four options" when the truth is "one house, four
 * levels". So each floor is a full-width stratum separated by a hairline, each
 * carries its own atmosphere token so the ground and the accent warm
 * measurably as the reader climbs, and each has a bearing line down its
 * leading edge in that level's own colour (see .ledger-row in globals.css).
 *
 * The proportions changed here. The text column used to take all the leftover
 * width and the photograph was pinned to a 13–18rem strip at the end, so every
 * row had a long horizontal hole in the middle between a two-line description
 * and a small picture. Now the text is capped at a readable measure and the
 * photograph takes everything that is left, which closes the hole and lets the
 * pictures do what they are there for: showing that the floors differ.
 *
 * Every floor gets identical treatment — same photo size, same type, same
 * space. None of them is presented as the good one. The terrace gets the same
 * treatment too, so it does not read as a promotion; only its numeral and its
 * ground say it is a different kind of place.
 *
 * Nothing here is hidden and revealed. These four rows are the home page's
 * route into the house; an observer that has not fired yet used to leave them
 * as blank strips, and a stagger is not worth that.
 */
export function FloorLedger() {
  const { t } = useSite();

  return (
    <ul className="rule-atmos mt-10 border-t md:mt-12">
      {FLOORS.map((floor, index) => {
        const copy = t.floors[floor.id];
        return (
          <li
            key={floor.id}
            data-atmosphere={floor.atmosphere}
            className="rule-atmos ledger-row border-b"
          >
            <Link
              href={`/experience#${floor.id}`}
              className="group grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-4 px-3 py-6 sm:gap-x-7 sm:py-7 md:grid-cols-[4.75rem_minmax(0,24rem)_1fr] md:px-5 lg:grid-cols-[6rem_minmax(0,26rem)_1fr]"
            >
              {/* The floor number, at the scale of the drawing rather than of
                  a list marker. It is the anchor of the row.

                  The terrace is not numbered. It is above the count, not the
                  next item in it, and an "04" here would undo the whole point
                  of moving it out of the floor sequence — it is set as a level
                  mark instead, at the same size, so the column still lines up. */}
              <span className="type-numeral" aria-hidden="true">
                {floor.id === "terrace" ? "—" : String(index + 1).padStart(2, "0")}
              </span>

              <span className="min-w-0">
                <span className="type-h3 block text-atmos-ink">
                  {copy.label}
                </span>
                <span className="type-body mt-1.5 block text-ink-soft">
                  {copy.lead}
                </span>
                {copy.distinct.length > 0 ? (
                  <span className="type-caption mt-2.5 block text-atmos-accent">
                    {copy.distinct.join(" · ")}
                  </span>
                ) : null}
              </span>

              {/* A wide strip rather than a card: it reads as a slice taken
                  through that level, and it keeps the row's height honest. */}
              <span className="col-span-2 block md:col-span-1">
                <Photo
                  id={floor.photo}
                  ratio="21 / 9"
                  objectPosition={floor.objectPosition}
                  sizes="(min-width: 1024px) 34vw, (min-width: 768px) 30vw, 92vw"
                />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
