"use client";

import type { FloorId } from "@/lib/content";
import type { PhotoId } from "@/lib/photos";
import { Photo } from "./Photo";
import { Reveal } from "./Reveal";
import { useSite } from "./SiteProvider";
import { TileField, TileRule } from "./TileMotif";

export type FloorChapterSpec = {
  id: FloorId;
  atmosphere: string;
  photos: [PhotoId, PhotoId];
  /** Alternating layout, so four chapters of equal weight never march. */
  mirrored: boolean;
  /** Floors 3 and 4 carry the tile field; 1 and 2 stay plain. */
  patterned: boolean;
};

export const FLOOR_CHAPTERS: FloorChapterSpec[] = [
  {
    id: "floor1",
    atmosphere: "floor-1",
    photos: ["floor1a", "floor1b"],
    mirrored: false,
    patterned: false,
  },
  {
    id: "floor2",
    atmosphere: "floor-2",
    photos: ["floor2a", "floor2b"],
    mirrored: true,
    patterned: false,
  },
  {
    id: "floor3",
    atmosphere: "floor-3",
    photos: ["floor3a", "floor3b"],
    mirrored: false,
    patterned: true,
  },
  {
    id: "floor4",
    atmosphere: "floor-4",
    photos: ["floor4a", "floor4b"],
    mirrored: true,
    patterned: true,
  },
];

/**
 * One floor of the house.
 *
 * All four chapters carry the same weight — same type sizes, same amount of
 * photography, same structure. What changes between them is the atmosphere
 * token, which shifts the ground, the hairlines and the accent, and the tile
 * field, which only appears on the two floors that actually have the tiles.
 */
export function FloorChapter({ spec }: { spec: FloorChapterSpec }) {
  const { t } = useSite();
  const copy = t.floors[spec.id];
  const [portrait, landscape] = spec.photos;

  return (
    <section
      data-atmosphere={spec.atmosphere}
      aria-labelledby={`${spec.id}-heading`}
      className="texture-limewash relative overflow-hidden bg-atmos"
    >
      {spec.patterned ? (
        <TileField
          className={`top-10 h-[420px] w-[420px] ${spec.mirrored ? "-left-28" : "-right-28"}`}
          opacity={0.13}
        />
      ) : null}

      <div className="container-content section-rhythm relative">
        <div className="grid gap-10 md:grid-cols-12 md:gap-10">
          {/* Chapter head -------------------------------------------------
              Sticky on desktop: the floor stays named while its photographs
              scroll past, which is how you actually read a floor — and it
              closes the dead space a short text column leaves beside a tall
              column of pictures. self-start is what lets it stick inside a
              stretch-aligned grid. */}
          <div
            className={`md:sticky md:top-28 md:col-span-5 md:self-start ${
              spec.mirrored ? "md:order-2 md:col-start-8" : ""
            }`}
          >
            <Reveal>
              {/* The floor number is the anchor of the chapter. All four are
                  set identically, at the same size — no floor is presented as
                  the good one, and no floor is given an invented theme name. */}
              <h2 className="type-h1" id={`${spec.id}-heading`}>
                {copy.label}
              </h2>
              <p className="type-lead mt-4 text-atmos-accent">{copy.lead}</p>
            </Reveal>

            {copy.body.map((paragraph, index) => (
              <Reveal key={index} delay={70 + index * 60}>
                <p className="type-body mt-6 text-ink-soft">{paragraph}</p>
              </Reveal>
            ))}

            <Reveal delay={240}>
              <ul className="rule-atmos mt-9 grid gap-2 border-t pt-5">
                {copy.facts.map((fact) => (
                  <li key={fact} className="type-body flex gap-3 text-ink-soft">
                    <span
                      aria-hidden="true"
                      className="mt-[0.7em] h-[5px] w-[5px] shrink-0 rotate-45 bg-current opacity-45"
                    />
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Chapter photography ------------------------------------------ */}
          <div
            className={`md:col-span-6 ${spec.mirrored ? "md:order-1 md:col-start-1" : "md:col-start-7"}`}
          >
            <Reveal variant="photo">
              <Photo
                id={portrait}
                sizes="(min-width: 768px) 46vw, 92vw"
                caption="below"
                zoomable
              />
            </Reveal>
            <Reveal variant="photo" delay={110} className="mt-6 md:mt-8">
              <Photo
                id={landscape}
                sizes="(min-width: 768px) 46vw, 92vw"
                caption="below"
                zoomable
              />
            </Reveal>
          </div>
        </div>
      </div>

      <div className="container-content">
        <TileRule tone={spec.patterned ? "accent" : "rule"} />
      </div>
    </section>
  );
}
