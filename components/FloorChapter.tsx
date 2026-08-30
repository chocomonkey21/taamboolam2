"use client";

import type { FloorId } from "@/lib/content";
import type { PhotoId } from "@/lib/photos";
import { TextLink } from "./Button";
import { Disclosure } from "./Disclosure";
import { Photo } from "./Photo";
import { Reveal } from "./Reveal";
import { useSite } from "./SiteProvider";
import { TileCourse } from "./TileMotif";

/**
 * One of the four layouts. They are named for what the floor is, not numbered,
 * because the difference between them is meant to be a difference in feeling
 * rather than a variation counter:
 *
 *  settle   — Floor 1. Two pictures side by side at rest. The calmest
 *             arrangement on the page, for the floor that is meant to be the
 *             easiest to arrive on.
 *  landing  — Floor 2. The wide shot first, then the room, offset upward into
 *             it. A floor you come up to.
 *  surface  — Floor 3. The material takes the full width of the page before
 *             anything is said about it.
 *  summit   — Floor 4. The room first and large, the view last and edge to
 *             edge. The top of the house, so the page opens out at the end.
 *
 * All four carry equal weight: the same number of photographs, the same type
 * sizes, the same space, the same disclosure, the same link into the form. No
 * floor is presented as the good one and none is given an invented theme name
 * — `label` is "Floor 3" and nothing else.
 */
type FloorLayout = "settle" | "landing" | "surface" | "summit";

export type FloorChapterSpec = {
  id: FloorId;
  atmosphere: string;
  photos: [PhotoId, PhotoId];
  layout: FloorLayout;
};

export const FLOOR_CHAPTERS: FloorChapterSpec[] = [
  {
    id: "floor1",
    atmosphere: "floor-1",
    photos: ["floor1a", "floor1b"],
    layout: "settle",
  },
  {
    id: "floor2",
    atmosphere: "floor-2",
    photos: ["floor2a", "floor2b"],
    layout: "landing",
  },
  {
    id: "floor3",
    atmosphere: "floor-3",
    photos: ["floor3a", "floor3b"],
    layout: "surface",
  },
  {
    id: "floor4",
    atmosphere: "floor-4",
    photos: ["floor4a", "floor4b"],
    layout: "summit",
  },
];

/**
 * One floor of the house.
 *
 * The arrangement of a floor is NOT repeated here. It is stated once, for all
 * four, on the page above. Only what a floor has that the others do not is
 * named again.
 *
 * The ornament is not decoration distributed evenly down the page: the tile
 * course at each chapter boundary takes its strength from that floor's own
 * `--atmos-pattern`, so it is barely a shadow on Floors 1 and 2, which have no
 * Athangudi tiles, and clearly laid on Floors 3 and 4, which do. The pattern
 * appears where the material actually is.
 */
export function FloorChapter({
  spec,
  index,
}: {
  spec: FloorChapterSpec;
  index: number;
}) {
  const { t } = useSite();
  const copy = t.floors[spec.id];
  const [portrait, landscape] = spec.photos;

  /* The numeral is the chapter's anchor, hung in the margin at the scale of a
     drawing rather than set as a label above the heading. */
  const heading = (
    <div className="datum">
      <span aria-hidden="true" className="type-numeral datum-note !mt-0">
        {String(index + 1).padStart(2, "0")}
      </span>
      <Reveal
        as="h2"
        variant="wipe"
        id={`${spec.id}-heading`}
        className="type-h1 text-atmos-ink"
      >
        {copy.label}
      </Reveal>
      <p className="type-lead mt-3 text-atmos-accent">{copy.lead}</p>
    </div>
  );

  const prose = (
    <>
      {copy.body.map((paragraph, i) => (
        <p key={i} className={`type-body text-ink-soft ${i ? "mt-5" : ""}`}>
          {paragraph}
        </p>
      ))}

      {copy.distinct.length > 0 ? (
        <ul className="rule-atmos mt-7 grid gap-2 border-t pt-4">
          {copy.distinct.map((item) => (
            <li key={item} className="type-body flex gap-3 text-atmos-accent">
              <span
                aria-hidden="true"
                className="mt-[0.7em] h-[5px] w-[5px] shrink-0 rotate-45 bg-current opacity-60"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {copy.more.length > 0 ? (
        <Disclosure
          label={t.experience.floorMoreLabel}
          className={copy.distinct.length > 0 ? "mt-7" : "mt-8"}
        >
          {copy.more.map((paragraph, i) => (
            <p
              key={i}
              className={`type-body text-ink-soft ${i ? "mt-4" : ""}`}
            >
              {paragraph}
            </p>
          ))}
        </Disclosure>
      ) : null}

      {/* The one moment a reader is most likely to want this floor: they have
          just finished reading about it. The floor travels with the link, so
          the form arrives with it already chosen rather than asking them to
          remember which one they liked. */}
      <p className="mt-8">
        <TextLink href={`/enquire?floor=${spec.id}`}>
          {t.cta.askAboutFloor}
        </TextLink>
      </p>
    </>
  );

  return (
    <section
      id={spec.id}
      data-atmosphere={spec.atmosphere}
      aria-labelledby={`${spec.id}-heading`}
      className="texture-limewash relative scroll-mt-24 overflow-hidden bg-atmos"
    >
      {/* The course laid at the threshold of the chapter. Its strength is the
          floor's own --atmos-pattern, so this single element is nearly a
          shadow on Floors 1 and 2 and clearly laid on Floors 3 and 4 — which
          is the whole ornament system, and the reason the corner tile fields
          that used to sit in these two chapters are gone. Rendered, those were
          hard-edged squares of repeated pattern: wallpaper, not a floor. */}
      <TileCourse />

      {/* ── settle ─────────────────────────────────────────────────────
          Two photographs at rest, side by side and at different heights, with
          the words underneath. Nothing overlaps and nothing bleeds: the floor
          that is meant to feel like a house you have stayed in before gets the
          layout that asks the least of the reader. */}
      {spec.layout === "settle" ? (
        <div className="container-content section-rhythm relative">
          {heading}

          <div className="mt-10 grid gap-6 md:mt-12 md:grid-cols-12 md:gap-8">
            <Reveal variant="photo" className="md:col-span-5">
              <Photo
                id={portrait}
                sizes="(min-width: 768px) 40vw, 92vw"
                zoomable
              />
            </Reveal>
            <Reveal
              variant="photo"
              delay={100}
              className="md:col-span-6 md:col-start-7 md:mt-20"
            >
              <Photo
                id={landscape}
                sizes="(min-width: 768px) 46vw, 92vw"
                caption="below"
                zoomable
              />
            </Reveal>
          </div>

          <div className="datum mt-12 md:mt-14">
            <div className="max-w-[38rem]">{prose}</div>
          </div>
        </div>
      ) : null}

      {/* ── landing ────────────────────────────────────────────────────
          The wide shot arrives first and runs to both edges of the container,
          then the room is set into its lower edge, overlapping upward, with
          the words beside it. A floor you come up to. */}
      {spec.layout === "landing" ? (
        <div className="container-content section-rhythm relative">
          {heading}

          <Reveal variant="photo" className="mt-10 md:mt-12">
            <Photo
              id={landscape}
              ratio="21 / 9"
              sizes="(min-width: 768px) 92vw, 92vw"
              caption="below"
              zoomable
            />
          </Reveal>

          <div className="grid gap-8 md:grid-cols-12 md:gap-8">
            <Reveal
              variant="photo"
              delay={90}
              className="w-[70%] md:col-span-4 md:-mt-24 md:w-full"
            >
              <Photo
                id={portrait}
                ratio="4 / 3"
                sizes="(min-width: 768px) 30vw, 70vw"
                className="ring-8 ring-[var(--atmos-bg)]"
                zoomable
              />
            </Reveal>

            <div className="md:col-span-7 md:col-start-6 md:pt-6">{prose}</div>
          </div>
        </div>
      ) : null}

      {/* ── surface ────────────────────────────────────────────────────
          On this floor the surface is the subject, so it is given the whole
          width before a word is said about it, and the second photograph is
          set against the text rather than beside it. */}
      {spec.layout === "surface" ? (
        <div className="relative">
          <div className="container-content pt-[clamp(3.75rem,7vw,6.5rem)]">
            {heading}
          </div>

          <Reveal variant="photo" className="mt-10 md:mt-12">
            <Photo
              id={portrait}
              ratio="21 / 9"
              rounded={false}
              sizes="100vw"
              className="!min-h-[18rem] md:!min-h-0"
              caption="below"
            />
          </Reveal>

          <div className="container-content pb-[clamp(3.75rem,7vw,6.5rem)]">
            <div className="mt-12 grid gap-8 md:mt-14 md:grid-cols-12 md:gap-8">
              <div className="md:col-span-5">{prose}</div>
              <Reveal
                variant="photo"
                className="md:col-span-6 md:col-start-7 md:mt-10"
              >
                <Photo
                  id={landscape}
                  sizes="(min-width: 768px) 46vw, 92vw"
                  zoomable
                />
              </Reveal>
            </div>
          </div>
        </div>
      ) : null}

      {/* ── summit ─────────────────────────────────────────────────────
          The room first and large, the words in the margin beside it, and the
          last photograph edge to edge with nothing after it. The top of the
          house, so the page opens out rather than closing down. */}
      {spec.layout === "summit" ? (
        <div className="relative">
          <div className="container-content pt-[clamp(3.75rem,7vw,6.5rem)]">
            {heading}

            <div className="mt-10 grid gap-8 md:mt-12 md:grid-cols-12 md:gap-8">
              <Reveal variant="photo" className="md:col-span-7">
                <Photo
                  id={portrait}
                  ratio="4 / 3"
                  sizes="(min-width: 768px) 56vw, 92vw"
                  caption="below"
                  zoomable
                />
              </Reveal>
              <div className="md:col-span-4 md:col-start-9">{prose}</div>
            </div>
          </div>

          <Reveal variant="photo" className="mt-12 md:mt-16">
            <Photo
              id={landscape}
              ratio="21 / 9"
              rounded={false}
              sizes="100vw"
              className="!min-h-[16rem] md:!min-h-0"
            />
          </Reveal>
        </div>
      ) : null}
    </section>
  );
}
