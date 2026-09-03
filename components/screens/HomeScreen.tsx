"use client";

import { Arrangement } from "../Arrangement";
import { ButtonLink, TextLink } from "../Button";
import { Datum } from "../Datum";
import { FloorLedger } from "../FloorLedger";
import { HouseValues } from "../HouseValues";
import { Parallax } from "../Parallax";
import { Photo } from "../Photo";
import { Reveal } from "../Reveal";
import { useSite } from "../SiteProvider";
import { MaterialStrip, TileCourse, TileGlyph } from "../TileMotif";
import { Wordmark } from "../Wordmark";

/**
 * The home page.
 *
 * Seven stretches, and no two of them are the same shape. That is the point:
 * the page this replaced was a stack of near-identical twelve-column blocks —
 * label, heading, two paragraphs, photograph in the other column, repeat — and
 * a reader scrolling it could not tell one section from the next without
 * reading the words. Here the shapes carry the meaning:
 *
 *   1  the house, whole, and its materials laid across the foot of the frame
 *   2  what this place is, one object beside it, then one wide photograph
 *   3  the plan, and the levels read as a section drawing
 *   4  a cluster of details at three crops
 *   5  the one dark room on the site
 *   6  a wide frame, then the house's terms as plain statements
 *   7  space, a name, and a way to write
 *
 * The one thing repeated on purpose is the material strip: it opens the page
 * and it closes it.
 */
export function HomeScreen() {
  const { t } = useSite();

  return (
    <>
      {/* ── 1 · The house ────────────────────────────────────────────────
          Anchored to the lower left rather than centred. A centred wordmark
          over a centred paragraph over two centred buttons is the composition
          every hotel landing page in the world already has, and it puts the
          name in the middle of whatever the photograph is doing. Set into the
          corner, the name has a frame to sit in, the photograph keeps its own
          subject, and the eye has one place to start. */}
      <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
        <div className="absolute inset-0">
          <Photo
            id="hero"
            ratio="auto"
            rounded={false}
            priority
            sizes="100vw"
            className="!h-full"
            objectPosition="center 55%"
          />
          {/* Two scrims, not a filter, and both directional. The lower-left one
              carries everything that is set on the photograph; the top one
              exists only so the two header plates stay legible whatever is
              behind them.

              The diagonal's mid stops were raised when the owner's own
              photograph replaced the stock one. The stock hero was a dark
              exterior among trees and the scrim barely had to work; this is a
              bright interior with a pale green wall directly behind the end of
              the lead paragraph. Measured against the composited pixels rather
              than guessed at: the lead was landing at 4.33:1, which fails AA
              for 21px text. At 0.86/0.60/0.24 it measures 5.0:1, and the
              wordmark — large text, so its floor is 3:1 — sits at 5.5:1.

              The old third scrim — a radial vignette pooled under centred text
              — is gone with the centred text. It was darkening the middle of
              the photograph purely to hold up a paragraph. */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgb(22 17 12 / 0.55) 0%, rgb(22 17 12 / 0.22) 14%, rgb(22 17 12 / 0) 30%)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top right, rgb(22 17 12 / 0.94) 0%, rgb(22 17 12 / 0.86) 26%, rgb(22 17 12 / 0.60) 48%, rgb(22 17 12 / 0.24) 70%, rgb(22 17 12 / 0) 88%)",
            }}
          />

          {/* A third scrim, phones only.

              The diagonal above is the right shape for a wide viewport, where
              the text sits in the left 45% of the frame and the gradient is
              densest exactly there. On a 375px screen the same text runs to
              90% of the width — the last words of every line land out where
              the diagonal has already faded, and the Kannada setting is the
              worst case because it wraps to four full-measure lines.

              Measured, not assumed: at 375x812 the lead was 3.38:1 before the
              diagonal was retuned and still only 4.33:1 after, against a 4.5
              floor for 17px text. Anchoring a second gradient to the bottom
              edge — which is where the text actually is on a phone — puts it
              at 5.5:1. Hidden from md up, where it would only muddy a
              composition that already measures clean. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 md:hidden"
            style={{
              background:
                "linear-gradient(to top, rgb(22 17 12 / 0.42) 0%, rgb(22 17 12 / 0.16) 40%, rgb(22 17 12 / 0) 70%)",
            }}
          />
        </div>

        {/* The location, set along the left edge of the frame like a note
            written up the margin of a photograph. It is the same words that
            used to sit in a centred uppercase label under the name. */}
        <p className="edge-note bottom-[16rem] left-6 z-10 text-paper/70">
          {t.home.hero.location}
        </p>

        <div className="relative z-10 container-content pb-16 sm:pb-20 md:pb-24">
          <div
            className="max-w-[42rem] text-paper"
            /* A last guarantee for the wordmark. The scrim already carries the
               contrast; this only matters if a future photograph puts
               something bright directly behind the name. */
            style={{ textShadow: "0 1px 26px rgb(22 17 12 / 0.5)" }}
          >
            {/* The wordmark is the page's h1. The name is what this page is
                about, and a second invented headline above a photograph of the
                house would only be decoration.

                !text-paper is load-bearing: the base layer gives every h1 the
                ink colour outright, so inheriting from the parent is not
                enough to make the name legible over a photograph. */}
            <h1 className="!text-paper">
              <Wordmark size="lg" asLink={false} className="block" />
            </h1>

            <p className="type-lead mt-6 max-w-[34rem] text-paper/90">
              {t.home.hero.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <ButtonLink href="/enquire">{t.cta.enquire}</ButtonLink>
              <ButtonLink href="/experience" variant="outline">
                {t.cta.explore}
              </ButtonLink>
            </div>
          </div>
        </div>

        {/* The materials, laid across the foot of the frame. Limewash, stone,
            wood, ochre, indigo — in the order you meet them climbing the
            house. It is the page's first statement of the palette, the site's
            one animated moment, and the seam between the photograph and the
            paper the rest of the page is printed on. */}
        <MaterialStrip className="relative z-10" height="0.6875rem" />
      </section>

      {/* ── 2 · About ────────────────────────────────────────────────────
          What this place is, said once and early.

          Nearly a typographic pause: after a full-bleed photograph the page
          needs somewhere quiet to land, and two short paragraphs in a lot of
          paper are that. The one object beside them is deliberate and small —
          a water bowl somebody put in a corner — because "a house that was
          made rather than fitted out" is a claim best supported by a thing
          rather than by an adjective. The wide photograph follows, once the
          reader knows what they are looking at. */}
      <section
        className="texture-limewash relative bg-atmos"
        data-atmosphere="house"
      >
        <div className="container-content section-rhythm-wide">
          <div className="grid gap-10 md:grid-cols-12 md:gap-8">
            {/* The heading is capped at a measure rather than left to fill the
                column. At display size on a wide screen an uncapped forty
                characters wrapped to four ragged lines across nine hundred
                pixels while the paragraph under it stopped at a readable
                sixty — a heading and a body that visibly did not belong to the
                same block. Capped, it breaks where a person would break it. */}
            <Datum note={t.about.eyebrow} className="md:col-span-7">
              <Reveal
                as="h2"
                variant="wipe"
                className="type-display max-w-[15ch]"
              >
                {t.about.heading}
              </Reveal>
              <p className="type-lead measure mt-8 text-ink-soft">
                {t.about.body[0]}
              </p>
              <p className="type-body measure mt-5 text-ink-soft">
                {t.about.body[1]}
              </p>
            </Datum>

            {/* Set against the paragraphs rather than floating beside the
                heading, and given a real column instead of a sliver — it was
                a small picture high in a tall empty corner, which is the exact
                hole this page's other sections were composed to avoid. */}
            <Reveal
              variant="photo"
              delay={80}
              className="w-[62%] md:col-span-4 md:col-start-9 md:mt-32 md:w-full"
            >
              <Photo
                id="valuesCorner"
                sizes="(min-width: 768px) 30vw, 62vw"
                zoomable
              />
            </Reveal>
          </div>

          {/* Where the name comes from.

              A different register from the paragraphs above — those describe a
              house, this explains a word — so it gets its own column rather
              than another paragraph in the same measure. The site is named
              after a gesture of hospitality and said so nowhere, which was a
              strange silence on a page about hospitality, and stranger still
              once the site's own icon became a betel leaf. */}
          <div className="rule-atmos mt-14 grid gap-x-8 gap-y-5 border-t pt-8 md:mt-16 md:grid-cols-12">
            <h3 className="type-h3 text-atmos-ink md:col-span-3">
              {t.about.nameHeading}
            </h3>
            <div className="md:col-span-7 md:col-start-5">
              {t.about.nameBody.map((paragraph, i) => (
                <p
                  key={i}
                  className={`type-body text-ink-soft ${i ? "mt-4" : ""}`}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* The one line that says who this suits, set apart on a hairline
              rather than folded into the paragraph above it. */}
          <p className="type-annotation rule-atmos mt-12 border-t pt-5 md:mt-14">
            {t.about.note}
          </p>
        </div>

        <div className="relative">
          <Reveal variant="photo">
            <Photo
              id="intro"
              ratio="21 / 9"
              rounded={false}
              sizes="100vw"
              className="!min-h-[16rem] md:!min-h-0"
            />
          </Reveal>
        </div>

        {/* The caption, set against the right edge of the container under the
            frame it belongs to. It was briefly run UP the edge of the
            photograph itself in blend-difference, which looked like an idea
            and read like nothing: a whole sentence turned on its side over
            foliage, at 11px, in whatever colour the difference blend happened
            to produce. An edge note can carry two or three words over a
            controlled crop — the hero's location does — and nothing longer. */}
        <div className="container-content pt-4">
          <p className="type-caption ml-auto max-w-[46ch] text-right">
            {t.photos.intro.caption}
          </p>
        </div>
      </section>

      {/* ── 3 · The plan, and the levels ─────────────────────────────────
          One section, because they are one idea: every guest floor is the
          same plan, and what differs is atmosphere. The terrace closes the
          ledger without being numbered into it. */}
      <section
        className="texture-limewash relative overflow-hidden bg-atmos-tint"
        data-atmosphere="house"
      >
        <div className="container-content section-rhythm relative">
          <Arrangement />
        </div>

        {/* The boundary between the plan and the floors it describes: a laid
            course, not a rule. */}
        <div className="container-content">
          <TileCourse />
        </div>

        <div className="container-content section-rhythm relative">
          <Datum note={t.home.floors.eyebrow}>
            <h2 className="type-h1 max-w-[20ch]">{t.home.floors.heading}</h2>
            <p className="type-body measure mt-5 text-ink-soft">
              {t.home.floors.body}
            </p>
          </Datum>

          <FloorLedger />

          <div className="mt-8">
            <TextLink href="/experience">{t.home.floors.link}</TextLink>
          </div>
        </div>
      </section>

      {/* ── 4 · How it is made ───────────────────────────────────────────
          The details at three different crops, stepped so the eye moves
          through them, with the words hung in the margin rather than set in a
          column of their own. On the floor-3 atmosphere, because this is where
          the tiles come from. */}
      {/* The tile field that used to sit in this corner is gone. Rendered, it
          was a hard-edged square of repeated pattern parked at the edge of the
          section — a swatch of wallpaper rather than a fragment of a floor,
          and the one piece of ornament on the site that had nothing to do with
          the thing beside it. The laid courses carry the material now, at a
          strength that follows whether the floor in question actually has the
          tiles. */}
      <section
        className="texture-limewash relative overflow-hidden bg-atmos"
        data-atmosphere="floor-3"
      >
        <TileCourse />

        <div className="container-content section-rhythm-wide relative">
          <Datum note={t.home.craft.eyebrow} className="max-w-[46rem]">
            <Reveal as="h2" variant="wipe" className="type-h1 text-atmos-ink">
              {t.home.craft.heading}
            </Reveal>
          </Datum>

          <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-12 md:gap-8">
            {/* The wide shot, offset right and running past the column the
                text sits in.

                This slot needs a photograph that is natively wide. It used to
                hold craftTiles, which is a square detail of a tile border —
                cover-cropped to 16:9 it lost the border entirely and came out
                as the corner of a bed, which is not what "how it is made"
                should open with. The joinery is the right lead: cabinet
                fronts, glass, and three woven shades, all of it made rather
                than bought. The tile border keeps its square below, where a
                detail belongs. */}
            <Reveal variant="photo" className="md:col-span-8 md:col-start-5">
              <Photo
                id="craftJoinery"
                sizes="(min-width: 768px) 62vw, 92vw"
                zoomable
              />
            </Reveal>

            {/* Two squares stepped under it, and the paragraph set beside them
                as a note rather than as a column of body copy. */}
            <Reveal
              variant="photo"
              delay={80}
              className="col-span-1 md:col-span-3 md:col-start-2 md:-mt-24"
            >
              <Photo
                id="craftTiles"
                sizes="(min-width: 768px) 24vw, 92vw"
                zoomable
              />
            </Reveal>

            <div className="md:col-span-4 md:col-start-5 md:self-end md:pb-6">
              <p className="type-body text-ink-soft">{t.home.craft.body[0]}</p>
            </div>

            <Reveal
              variant="photo"
              delay={140}
              className="col-span-1 md:col-span-3 md:col-start-10 md:mt-12"
            >
              <Photo
                id="craftCane"
                sizes="(min-width: 768px) 24vw, 92vw"
                zoomable
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 5 · Eating here ──────────────────────────────────────────────
          The one dark room on the site.

          Food was the worst offender on the old page: a label, a heading, a
          paragraph and a photograph in the next column — the exact block the
          rest of the page was already made of, applied to the one subject
          with a genuine still life in it. So this is composed as a table
          instead. The ground goes to slate, the words are set as a heading, a
          line and a condition rather than as a column of body copy, and the
          photograph is a single object laid on the dark, ringed in the ground
          colour so it reads as something placed there.

          It is one photograph now, not two. The owner's food photography is a
          single frame lifted from a phone video — genuinely good, and 760px
          wide. Enlarging it to fill half the section would have shown the
          reader the compression rather than the food, so the composition puts
          the weight on the type and lets the picture be exactly as big as it
          can afford to be. Fewer, stronger. */}
      <section
        className="texture-plaster relative overflow-hidden bg-atmos"
        data-atmosphere="night"
      >
        <TileCourse className="absolute inset-x-0 top-0" fade={false} />

        <div className="relative container-content section-rhythm-wide">
          <div className="grid items-center gap-12 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-6 lg:col-span-5">
              <Reveal as="h2" variant="wipe" className="type-h1 text-atmos-ink">
                {t.home.food.heading}
              </Reveal>
              <p className="type-lead mt-6 max-w-[34ch] text-atmos-soft">
                {t.home.food.body[0]}
              </p>

              {/* The note. Set against a hairline in this ground's own accent,
                  at caption scale — it is the smallest type in the section and
                  the only thing in it that is a condition rather than a
                  description. */}
              <p className="type-caption rule-atmos mt-9 border-t pt-4 text-atmos-accent">
                {t.home.food.note}
              </p>
            </div>

            {/* Set toward the outer edge and kept to its own true size. The
                caption carries the second half of the offer — that it is
                cooked when asked for, on nobody's timetable. */}
            <div className="md:col-span-5 md:col-start-8">
              <Reveal variant="photo" className="w-[68%] sm:w-[54%] md:w-full">
                <Photo
                  id="foodStill"
                  sizes="(min-width: 768px) 34vw, 68vw"
                  caption="below"
                  zoomable
                />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6 · How the house is lived in ────────────────────────────────
          A wide frame first, then the terms in plain language. The photograph
          opens the chapter rather than sitting beside it, which is the third
          different relationship between picture and text on this page. */}
      <section
        className="texture-limewash relative bg-atmos-tint"
        data-atmosphere="house"
      >
        <div className="relative">
          <Parallax>
            <Photo
              id="invitation"
              ratio="21 / 9"
              rounded={false}
              sizes="100vw"
              className="!min-h-[15rem] md:!min-h-0"
            />
          </Parallax>
        </div>

        <div className="container-content section-rhythm">
          {/* No photograph beside this heading any more. The corner it used
              to show now opens the About section, where it is doing work; here
              it was a decorative portrait next to a plate of terms, and this
              section already has the largest photograph on the page directly
              above it. What follows is the one stretch of the site that is
              purely conditions, and it reads better as exactly that. */}
          <Datum note={t.home.values.eyebrow}>
            <h2 className="type-h1 max-w-[18ch]">{t.home.values.heading}</h2>
            <p className="type-body measure mt-5 text-ink-soft">
              {t.home.values.body}
            </p>
          </Datum>

          <div className="mt-14 md:mt-16">
            <HouseValues variant="embedded" />
          </div>
        </div>
      </section>

      {/* ── 7 · The invitation ───────────────────────────────────────────
          No photograph. By this point the page has shown the reader eleven of
          them, and what is left to do is small: say the name once more and
          give them somewhere to write. The old closing block was a wide dark
          photograph with a heading and two buttons over it — which is exactly
          what the Experience page ends with, so the site said goodbye twice in
          the same voice. This one is space. */}
      <section
        className="texture-limewash relative overflow-hidden bg-atmos"
        data-atmosphere="house"
      >
        <div className="container-content section-rhythm-wide">
          <div className="mx-auto max-w-[34rem] text-center">
            <TileGlyph className="mx-auto w-8 text-clay opacity-35" />
            <h2 className="type-h1 mt-8">{t.home.invitation.heading}</h2>
            <p className="type-body mt-5 text-ink-soft">
              {t.home.invitation.body}
            </p>
            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <ButtonLink href="/enquire">{t.cta.enquire}</ButtonLink>
              <ButtonLink href="/experience" variant="outline">
                {t.cta.readTheStory}
              </ButtonLink>
            </div>
          </div>
        </div>

        {/* The materials again, closing the page the way they opened it. */}
        <MaterialStrip height="0.5rem" />
      </section>
    </>
  );
}
