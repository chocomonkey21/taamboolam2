"use client";

import { Arrangement } from "../Arrangement";
import { ButtonLink } from "../Button";
import { Datum } from "../Datum";
import { ExperienceProgress } from "../ExperienceProgress";
import { FLOOR_CHAPTERS, FloorChapter } from "../FloorChapter";
import { HouseValues } from "../HouseValues";
import { Parallax } from "../Parallax";
import { Photo } from "../Photo";
import { Reveal } from "../Reveal";
import { useSite } from "../SiteProvider";
import { MaterialStrip, TileCourse, TileGlyph } from "../TileMotif";

/**
 * One continuous story, read the way the house is climbed. Not four pages, not
 * a tabbed selector, and no floor presented as the good one.
 */
export function ExperienceScreen() {
  const { t } = useSite();

  return (
    <>
      <ExperienceProgress />

      {/* ── Opening ──────────────────────────────────────────────────────
          The title, alone, in a lot of paper. Then the house. The only thing
          above the photograph is the heading itself — atmosphere before
          practicalities. */}
      <section
        className="texture-limewash relative bg-atmos"
        data-atmosphere="house"
      >
        <div className="container-content pt-32 pb-12 sm:pt-40 md:pt-48 md:pb-16">
          <Datum note={t.experience.eyebrow} className="max-w-[52rem]">
            <Reveal as="h1" variant="wipe" className="type-display">
              {t.experience.heading}
            </Reveal>
          </Datum>
        </div>

        <Reveal variant="photo">
          <Photo
            id="experienceOpening"
            ratio="21 / 9"
            rounded={false}
            sizes="100vw"
            className="!min-h-[42svh] md:!min-h-0"
          />
        </Reveal>

        <MaterialStrip height="0.5rem" />

        <div className="container-content section-rhythm">
          <div className="grid gap-10 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-7">
              <p className="type-lead text-ink-soft">
                {t.experience.opening[0]}
              </p>
            </div>

            {/* The stair, offset upward so it breaks the line the paragraph
                sits on — the one vertical thing on a page about a stack. */}
            <Reveal
              variant="photo"
              className="md:col-span-4 md:col-start-9 md:-mt-24"
            >
              <Photo
                id="stair"
                sizes="(min-width: 768px) 30vw, 92vw"
                caption="below"
                className="ring-8 ring-[var(--atmos-bg)]"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── The arrangement ──────────────────────────────────────────────
          Stated once, immediately before the chapters, so that none of the
          four has to repeat it. */}
      <section
        className="texture-limewash ground-tint relative"
        data-atmosphere="house"
      >
        <div className="container-content section-rhythm">
          <Arrangement compact />

          <p className="type-annotation rule-atmos mt-12 border-t pt-5">
            {t.experience.floorsIntro}
          </p>
        </div>
      </section>

      {/* ── The four floors ──────────────────────────────────────────────── */}
      {FLOOR_CHAPTERS.map((spec, index) => (
        <FloorChapter key={spec.id} spec={spec} index={index} />
      ))}

      {/* ── Food ─────────────────────────────────────────────────────────
          A still life, and the words set around it as notes rather than under
          it as a column. The home page gives food a dark room; here it is the
          quietest stretch on a long page, which is the other half of the same
          idea: it is not a service with a layout of its own, it is something
          that happens on a table in this house. */}
      <section
        className="texture-limewash relative bg-atmos"
        data-atmosphere="house"
      >
        <TileCourse />

        <div className="container-content section-rhythm">
          <Datum note={t.experience.food.eyebrow} className="max-w-[44rem]">
            <h2 className="type-h1">{t.experience.food.heading}</h2>
          </Datum>

          <div className="relative mt-10 grid gap-8 md:mt-14 md:grid-cols-12 md:gap-8">
            <Reveal variant="photo" className="md:col-span-8">
              <Photo
                id="foodTable"
                ratio="3 / 2"
                sizes="(min-width: 768px) 62vw, 92vw"
                caption="below"
                zoomable
              />
            </Reveal>

            <div className="md:col-span-4 md:pt-4">
              <p className="type-body text-ink-soft">
                {t.experience.food.body[0]}
              </p>
              <p className="type-body mt-5 text-ink-soft">
                {t.experience.food.body[1]}
              </p>

              <Reveal variant="photo" className="mt-8 w-[58%] md:w-full">
                <Photo
                  id="foodDetail"
                  sizes="(min-width: 768px) 30vw, 58vw"
                  zoomable
                />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Gatherings ──────────────────────────────────────────────────
          A gathering is the exception here, not an offering, so the section
          reads as an aside: the explanation first in a narrow column, the one
          hard limit pulled out beside it, and the photograph last and wide —
          the room as evidence after the point has been made, rather than a
          picture being sold alongside it. */}
      <section
        className="texture-limewash ground-tint relative"
        data-atmosphere="house"
      >
        <div className="container-content section-rhythm">
          <div className="grid gap-10 md:grid-cols-12 md:gap-8">
            <Datum
              note={t.experience.gatherings.eyebrow}
              className="md:col-span-7"
            >
              <h2 className="type-h2 max-w-[18ch]">
                {t.experience.gatherings.heading}
              </h2>
              <p className="type-body measure mt-5 text-ink-soft">
                {t.experience.gatherings.body[0]}
              </p>
            </Datum>

            {/* The one thing this section has to be unambiguous about, set
                apart so it cannot be skimmed past with the rest. */}
            <p className="type-lead rule-atmos md:col-span-4 md:col-start-9 md:mt-10 md:border-l md:pl-8">
              {t.experience.gatherings.note}
            </p>
          </div>
        </div>

        <div className="relative">
          <Reveal variant="photo">
            <Photo
              id="experienceGathering"
              ratio="21 / 9"
              rounded={false}
              sizes="100vw"
              className="!min-h-[16rem] md:!min-h-0"
            />
          </Reveal>
        </div>

        <div className="container-content pt-4 pb-10">
          <p className="type-caption ml-auto max-w-[46ch] text-right">
            {t.photos.experienceGathering.caption}
          </p>
        </div>
      </section>

      {/* ── House values ─────────────────────────────────────────────────── */}
      <section
        className="texture-limewash relative bg-atmos"
        data-atmosphere="house"
      >
        <div className="container-content section-rhythm">
          <HouseValues />
        </div>
      </section>

      {/* ── Closing invitation ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden" data-atmosphere="house">
        <div className="relative">
          <Parallax>
            <Photo
              id="experienceClose"
              ratio="21 / 9"
              rounded={false}
              sizes="100vw"
              className="!min-h-[55svh]"
            />
          </Parallax>
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgb(24 19 14 / 0.86) 0%, rgb(24 19 14 / 0.5) 58%, rgb(24 19 14 / 0.26) 100%)",
            }}
          />
          <div className="absolute inset-0 flex items-center">
            <div className="container-content">
              <div className="max-w-[32rem] text-paper">
                <TileGlyph className="w-8 text-paper/45" />
                <h2 className="type-h1 mt-6 !text-paper">
                  {t.experience.close.heading}
                </h2>
                <p className="type-lead mt-4 text-paper/90">
                  {t.experience.close.body}
                </p>
                <div className="mt-8">
                  <ButtonLink href="/enquire">{t.cta.enquire}</ButtonLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
