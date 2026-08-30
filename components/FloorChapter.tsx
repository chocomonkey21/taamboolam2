"use client";

import type { FloorId } from "@/lib/content";
import type { PhotoId } from "@/lib/photos";
import { Disclosure } from "./Disclosure";
import { Photo } from "./Photo";
import { Reveal } from "./Reveal";
import { useSite } from "./SiteProvider";
import { TileField, TileRule } from "./TileMotif";

export type FloorChapterSpec = {
  id: FloorId;
  atmosphere: string;
  photos: [PhotoId, PhotoId];
  /**
   * "quiet" is a held, text-led column beside a calm pair of photographs.
   * "material" opens on a full-bleed photograph and lets the pictures lead.
   *
   * This is the structural half of the difference between the floors. Floors 1
   * and 2 are the familiar ones and are laid out the way an ordinary room
   * reads; floors 3 and 4 are where the surfaces start speaking, so the
   * photographs get the width and the text gets out of their way.
   */
  layout: "quiet" | "material";
  /** Mirrors the quiet layout, so the two calm chapters do not march. */
  mirrored: boolean;
  /** Floors 3 and 4 carry the tile field; 1 and 2 stay plain. */
  patterned: boolean;
};

export const FLOOR_CHAPTERS: FloorChapterSpec[] = [
  {
    id: "floor1",
    atmosphere: "floor-1",
    photos: ["floor1a", "floor1b"],
    layout: "quiet",
    mirrored: false,
    patterned: false,
  },
  {
    id: "floor2",
    atmosphere: "floor-2",
    photos: ["floor2a", "floor2b"],
    layout: "quiet",
    mirrored: true,
    patterned: false,
  },
  {
    id: "floor3",
    atmosphere: "floor-3",
    photos: ["floor3a", "floor3b"],
    layout: "material",
    mirrored: false,
    patterned: true,
  },
  {
    id: "floor4",
    atmosphere: "floor-4",
    photos: ["floor4a", "floor4b"],
    layout: "material",
    mirrored: true,
    patterned: true,
  },
];

/**
 * One floor of the house.
 *
 * All four chapters carry equal weight — the same type sizes, the same amount
 * of photography, the same space. What changes is the atmosphere token, the
 * tile field on the two floors that actually have the tiles, and the shape of
 * the layout itself.
 *
 * The arrangement of a floor is NOT repeated here. It is stated once, for all
 * four, on the page above. Only what a floor has that the others do not is
 * named again.
 */
export function FloorChapter({ spec }: { spec: FloorChapterSpec }) {
  const { t } = useSite();
  const copy = t.floors[spec.id];
  const [portrait, landscape] = spec.photos;

  const heading = (
    <Reveal>
      {/* The floor number is the anchor of the chapter. All four are set
          identically — no floor is presented as the good one, and no floor is
          given an invented theme name. */}
      <h2 className="type-h1" id={`${spec.id}-heading`}>
        {copy.label}
      </h2>
      <p className="type-lead mt-4 text-atmos-accent">{copy.lead}</p>
    </Reveal>
  );

  const prose = (
    <>
      {copy.body.map((paragraph, index) => (
        <Reveal key={index} delay={70 + index * 60}>
          <p className="type-body mt-6 text-ink-soft">{paragraph}</p>
        </Reveal>
      ))}

      {copy.distinct.length > 0 ? (
        <Reveal delay={180}>
          <ul className="rule-atmos mt-8 grid gap-2 border-t pt-5">
            {copy.distinct.map((item) => (
              <li
                key={item}
                className="type-body flex gap-3 text-atmos-accent"
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.7em] h-[5px] w-[5px] shrink-0 rotate-45 bg-current opacity-60"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      ) : null}

      {copy.more.length > 0 ? (
        <Reveal delay={220}>
          <Disclosure
            label={t.experience.floorMoreLabel}
            className={copy.distinct.length > 0 ? "mt-8" : "mt-9"}
          >
            {copy.more.map((paragraph, index) => (
              <p
                key={index}
                className={`type-body text-ink-soft ${index ? "mt-4" : ""}`}
              >
                {paragraph}
              </p>
            ))}
          </Disclosure>
        </Reveal>
      ) : null}
    </>
  );

  return (
    <section
      id={spec.id}
      data-atmosphere={spec.atmosphere}
      aria-labelledby={`${spec.id}-heading`}
      className="texture-limewash relative scroll-mt-24 overflow-hidden bg-atmos"
    >
      {spec.patterned ? (
        <TileField
          className={`top-10 h-[420px] w-[420px] ${spec.mirrored ? "-left-28" : "-right-28"}`}
          opacity={0.13}
        />
      ) : null}

      {spec.layout === "quiet" ? (
        /* ── Quiet: a held column beside two photographs ────────────────
           Sticky on desktop, so the floor stays named while its pictures
           scroll past — which is how you actually read a floor, and it closes
           the dead space a short text column leaves beside a tall one.
           self-start is what lets it stick inside a stretch-aligned grid. */
        <div className="container-content section-rhythm relative">
          <div className="grid gap-10 md:grid-cols-12 md:gap-10">
            <div
              className={`md:sticky md:top-28 md:col-span-5 md:self-start ${
                spec.mirrored ? "md:order-2 md:col-start-8" : ""
              }`}
            >
              {heading}
              {prose}
            </div>

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
      ) : (
        /* ── Material: the photograph opens the chapter, full width ────── */
        <div className="relative">
          <div className="container-content pt-[clamp(4.5rem,9vw,8.5rem)]">
            <Reveal className="max-w-[38rem]">
              <h2 className="type-h1" id={`${spec.id}-heading`}>
                {copy.label}
              </h2>
              <p className="type-lead mt-4 text-atmos-accent">{copy.lead}</p>
            </Reveal>
          </div>

          {/* Edge to edge. On these two floors the surface is the subject, so
              it is given the whole width rather than a column.

              The min-height is a floor for narrow screens only, where 21:9
              alone would letterbox this down to a strip. It is dropped from md
              up, where the ratio already gives the image plenty of height —
              unlike a hero, this is inline content, and a viewport-relative
              minimum here opens a void in the middle of the chapter on tall
              screens. */}
          <Reveal variant="photo" className="mt-10 md:mt-14">
            <Photo
              id={portrait}
              ratio="21 / 9"
              rounded={false}
              sizes="100vw"
              className="!min-h-[20rem] md:!min-h-0"
            />
          </Reveal>

          <div className="container-content pb-[clamp(4.5rem,9vw,8.5rem)]">
            <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12 md:gap-10">
              {/* Text offset into the second half, with the detail photograph
                  set against it — the mirror image of the quiet chapters. */}
              <div
                className={`md:col-span-5 ${spec.mirrored ? "md:order-2 md:col-start-8" : ""}`}
              >
                <Reveal variant="photo">
                  <Photo
                    id={landscape}
                    sizes="(min-width: 768px) 42vw, 92vw"
                    caption="below"
                    zoomable
                  />
                </Reveal>
              </div>

              <div
                className={`md:col-span-6 ${spec.mirrored ? "md:order-1 md:col-start-1" : "md:col-start-7"}`}
              >
                {/* The heading already ran above the photograph, so this
                    column opens straight into the prose. */}
                <div className="-mt-6">{prose}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container-content">
        <TileRule tone={spec.patterned ? "accent" : "rule"} />
      </div>
    </section>
  );
}
