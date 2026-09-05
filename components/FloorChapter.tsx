"use client";

import type { FloorId } from "@/lib/content";
import type { PhotoId } from "@/lib/photos";
import { TextLink } from "./Button";
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
 *  open     — The terrace. Not a floor, so not a floor's layout: the band of
 *             sky runs edge to edge above everything, the words sit under it
 *             in a single centred measure rather than in a column beside a
 *             photograph, and there is no room shot at all. It is the one
 *             chapter here that is not built around an interior, because the
 *             terrace is not one.
 *
 * The three floors carry equal weight: the same number of photographs, the
 * same type sizes, the same space, the same link into the form. No floor is
 * presented as the good one and none is given an invented theme name —
 * `label` is "Floor 3" and nothing else.
 */
type FloorLayout = "settle" | "landing" | "surface" | "open";

/* Two photographs per chapter, except the terrace, which has one. The count
   is tied to the layout rather than left optional, so `open` cannot silently
   grow a second slot and the other three cannot lose theirs. */
export type FloorChapterSpec = {
  id: FloorId;
  atmosphere: string;
} & (
  | { layout: Exclude<FloorLayout, "open">; photos: [PhotoId, PhotoId] }
  | { layout: "open"; photos: [PhotoId] }
);

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
  /* The terrace closes the sequence without joining it. Its atmosphere goes
     cool where the three floors warmed, and it is the one chapter with a
     single photograph: the carved swing that used to sit beside this text is
     on the fourth floor portico, which guests do not have. */
  {
    id: "terrace",
    atmosphere: "terrace",
    photos: ["terraceOpen"],
    layout: "open",
  },
];

/**
 * One floor of the house.
 *
 * The arrangement of a floor is NOT repeated here. It is stated once, for all
 * three guest floors, on the page above. Only what a floor has that the
 * others do not is named again.
 *
 * The ornament is not decoration distributed evenly down the page: the tile
 * course at each chapter boundary takes its strength from that level's own
 * `--atmos-pattern`, so it is barely a shadow on Floors 1 and 2, which have no
 * Athangudi tiles, clearly laid on Floor 3, which does, and back to almost
 * nothing on the terrace, which has pavers and sky. The pattern appears where
 * the material actually is.
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
  /* The lead photograph of every chapter. Its shape depends on the layout,
     which is why it is named by position rather than by orientation:
     `settle`, `landing` and `surface` open on a room, `open` on the sky
     band. The second photograph, where there is one, is read off `spec`
     inside each layout so the union above can narrow it. */
  const first = spec.photos[0];

  /* The numeral is the chapter's anchor, hung in the margin at the scale of a
     drawing rather than set as a label above the heading. */
  const centred = spec.layout === "open";

  const heading = (
    /* `datum` hangs its note out in the left margin, which is exactly wrong
       under a centred measure — the note would sit alone off to the side of
       text that is not aligned to that edge. The terrace chapter is the only
       centred one, so it drops the plumb line and lets the mark sit above
       the label. */
    <div className={centred ? "" : "datum"}>
      {/* Not numbered for the terrace — see the note in FloorLedger. A level
          mark keeps the column aligned without putting it back in the count. */}
      <span
        aria-hidden="true"
        className={`type-numeral !mt-0 ${centred ? "block" : "datum-note"}`}
      >
        {spec.id === "terrace" ? "—" : String(index + 1).padStart(2, "0")}
      </span>
      <Reveal
        as="h2"
        variant="wipe"
        id={`${spec.id}-heading`}
        className="type-h1 text-atmos-ink"
      >
        {copy.label}
      </Reveal>
      <p
        className={`type-lead mt-3 text-atmos-accent ${
          centred ? "mx-auto max-w-[34ch]" : ""
        }`}
      >
        {copy.lead}
      </p>
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

      {/* What used to sit behind "More about this floor". It is set exactly
          like the paragraph above it, because it IS that paragraph continued
          — the split is a note to the owner about which half is essential,
          not a distinction a reader has any use for. Shrinking it to caption
          scale, which is what the first pass at removing the disclosure did,
          only replaced a click with a squint. */}
      {copy.more.map((paragraph, i) => (
        <p key={i} className="type-body mt-5 text-ink-soft">
          {paragraph}
        </p>
      ))}

      {/* The one moment a reader is most likely to want this floor: they have
          just finished reading about it. The floor travels with the link, so
          the form arrives with it already chosen rather than asking them to
          remember which one they liked. */}
      <p className="mt-8">
        <TextLink href={`/enquire?floor=${spec.id}`}>
          {spec.id === "terrace" ? t.cta.askAboutTerrace : t.cta.askAboutFloor}
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
                id={first}
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
                id={spec.photos[1]}
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
              id={spec.photos[1]}
              ratio="21 / 9"
              sizes="(min-width: 768px) 92vw, 92vw"
              caption="below"
              /* Out from under the photograph that overlaps this one. The
                 small frame below is pulled up six rems to sit on this band,
                 and it covered the caption completely on desktop — the words
                 were behind the picture, not missing, which is why it read as
                 a broken overlap rather than as absent text. It takes the
                 left third, so the caption clears it and lands under the
                 prose column instead. Below md nothing overlaps and the
                 caption sits where it always did. */
              captionClassName="md:pl-[42%]"
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
                id={first}
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
              id={first}
              ratio="21 / 9"
              rounded={false}
              sizes="100vw"
              className="!min-h-[18rem] md:!min-h-0"
              caption="below"
              /* This photograph is deliberately full-bleed, outside the
                 container, and the caption was inheriting that: it began at
                 the very edge of the window with none of the page's padding,
                 so the first word was cut in half by the screen. The picture
                 stays full width; its caption takes the page's own measure
                 and lines up with the heading above it. */
              captionClassName="container-content"
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
                  id={spec.photos[1]}
                  sizes="(min-width: 768px) 46vw, 92vw"
                  zoomable
                />
              </Reveal>
            </div>
          </div>
        </div>
      ) : null}

      {/* ── open ───────────────────────────────────────────────────────
          The terrace, and the one chapter on this page that is not built
          around a room.

          The band of pergola and sky runs the full width above everything —
          it is a strip, not a frame, and giving it the whole page width is
          the only way a 3.5:1 crop reads as an opening rather than as a
          letterboxed photograph. Under it the words sit in one centred
          measure instead of in a column beside a picture, because there is
          no second interior to set them against and inventing a two-column
          grid here would make the terrace look like a fourth floor with a
          missing photograph.

          There is no second photograph. The prose keeps the centred measure
          the heading sits in rather than shifting left to leave a gap where
          one used to be. */}
      {spec.layout === "open" ? (
        <div className="relative">
          <Reveal variant="photo" className="pt-[clamp(3rem,5vw,4.5rem)]">
            <Photo
              id={first}
              rounded={false}
              sizes="100vw"
              className="!min-h-[9rem] md:!min-h-0"
            />
          </Reveal>

          <div className="container-content pt-10 pb-[clamp(3.75rem,7vw,6.5rem)] md:pt-14">
            <div className="mx-auto max-w-[46rem] text-center">{heading}</div>

            <div className="mx-auto mt-10 max-w-[46rem] md:mt-12">{prose}</div>
          </div>
        </div>
      ) : null}

    </section>
  );
}
