"use client";

import Link from "next/link";
import type { FloorId } from "@/lib/content";
import type { PhotoId } from "@/lib/photos";
import { Photo } from "./Photo";
import { useSite } from "./SiteProvider";

const FLOORS: { id: FloorId; photo: PhotoId; atmosphere: string }[] = [
  { id: "floor1", photo: "floor1a", atmosphere: "floor-1" },
  { id: "floor2", photo: "floor2a", atmosphere: "floor-2" },
  { id: "floor3", photo: "floor3a", atmosphere: "floor-3" },
  { id: "floor4", photo: "floor4a", atmosphere: "floor-4" },
];

/**
 * The four floors, read as a section through the building rather than as four
 * cards in a tray.
 *
 * The house's defining fact is that it is stacked, and a row of equal tiles
 * throws that away — it says "four options" when the truth is "one house, four
 * levels". So each floor is a full-width stratum, separated by a hairline, and
 * each carries its own atmosphere token: the ground and the accent warm
 * measurably as the reader climbs, which is the same tonal move the Experience
 * page makes at full scale.
 *
 * Every floor gets identical treatment — same photo size, same type, same
 * space. None of them is presented as the good one.
 */
export function FloorLedger() {
  const { t } = useSite();

  return (
    <ul className="rule-atmos mt-12 border-t md:mt-16">
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
              className="group grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-4 px-2 py-6 sm:gap-x-8 sm:py-7 md:grid-cols-[5.5rem_1fr_13rem] md:px-4 lg:grid-cols-[7rem_1fr_18rem]"
            >
              {/* The floor number, at ledger scale. It is the anchor of the
                  row and the only thing that changes size between breakpoints. */}
              <span className="ledger-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="min-w-0">
                <span className="type-h3 block">{copy.label}</span>
                <span className="type-body mt-1.5 block text-ink-soft">
                  {copy.lead}
                </span>
                {copy.distinct.length > 0 ? (
                  <span className="type-caption mt-2 block text-atmos-accent">
                    {copy.distinct.join(" · ")}
                  </span>
                ) : null}
              </span>

              {/* A wide strip rather than a card: it reads as a slice taken
                  through that level, and it keeps the row's height honest. */}
              <span className="col-span-2 block md:col-span-1">
                <Photo
                  id={floor.photo}
                  ratio="16 / 9"
                  sizes="(min-width: 1024px) 18rem, (min-width: 768px) 13rem, 92vw"
                />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
