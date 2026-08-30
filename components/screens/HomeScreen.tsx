"use client";

import { Arrangement } from "../Arrangement";
import { ButtonLink, TextLink } from "../Button";
import { FloorLedger } from "../FloorLedger";
import { HouseValues } from "../HouseValues";
import { Photo } from "../Photo";
import { Reveal } from "../Reveal";
import { useSite } from "../SiteProvider";
import { TileField, TileGlyph, TileRule } from "../TileMotif";
import { Wordmark } from "../Wordmark";

export function HomeScreen() {
  const { t } = useSite();

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
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
          {/* Two scrims, not a filter: the photograph stays a photograph, but
              nothing set on top of it is ever left to chance.

              The lower one carries the wordmark, the location line, the
              description and the buttons — it is dense enough that white type
              clears 4.5:1 over the brightest pixel in that band. The upper one
              exists only so the floating header stays legible while it is
              transparent, whatever the sky in the photograph happens to do. */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgb(22 17 12 / 0.62) 0%, rgb(22 17 12 / 0.30) 12%, rgb(22 17 12 / 0.10) 24%, rgb(22 17 12 / 0) 34%)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgb(22 17 12 / 0.95) 0%, rgb(22 17 12 / 0.93) 30%, rgb(22 17 12 / 0.88) 48%, rgb(22 17 12 / 0.72) 62%, rgb(22 17 12 / 0.40) 76%, rgb(22 17 12 / 0) 93%)",
            }}
          />
        </div>

        <div className="relative container-content pb-24 sm:pb-20 md:pb-28">
          <div
            className="max-w-[46rem] text-paper"
            /* A last guarantee for the wordmark. The scrim already carries the
               contrast; this only matters if a future photograph puts something
               bright directly behind the name, and it is invisible when the
               ground is dark. */
            style={{ textShadow: "0 1px 26px rgb(22 17 12 / 0.55)" }}
          >
            {/* The wordmark is the page's h1. The name is what this page is
                about, and a second invented headline above a photograph of the
                house would only be decoration. */}
            {/* !text-paper is load-bearing: the base layer gives every h1 the
                ink colour outright, so inheriting `text-paper` from the parent
                is not enough to make the name legible over a photograph. */}
            <Reveal as="h1" className="!text-paper">
              <Wordmark size="lg" asLink={false} className="block" />
            </Reveal>

            <Reveal delay={110}>
              <p className="type-eyebrow mt-6 !text-paper/75">
                {t.home.hero.location}
              </p>
            </Reveal>

            <Reveal delay={180}>
              <p className="type-lead mt-5 max-w-[38rem] text-paper/92">
                {t.home.hero.description}
              </p>
            </Reveal>

            <Reveal delay={260}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <ButtonLink href="/enquire">{t.cta.enquire}</ButtonLink>
                <ButtonLink href="/experience" variant="outline">
                  {t.cta.explore}
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Introduction ─────────────────────────────────────────────────── */}
      <section className="texture-limewash relative bg-atmos" data-atmosphere="house">
        <div className="container-content section-rhythm">
          <div className="grid gap-12 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-5 md:col-start-1">
              <Reveal variant="photo">
                <Photo
                  id="intro"
                  sizes="(min-width: 768px) 40vw, 92vw"
                  caption="below"
                />
              </Reveal>
            </div>

            <div className="md:col-span-6 md:col-start-7 md:pt-10">
              <Reveal>
                <p className="type-eyebrow">{t.home.intro.eyebrow}</p>
                <h2 className="type-h1 mt-6">{t.home.intro.heading}</h2>
              </Reveal>
              {t.home.intro.body.map((paragraph, index) => (
                <Reveal key={index} delay={90 + index * 70}>
                  <p className="type-body measure mt-6 text-ink-soft">
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── The house, floor by floor ────────────────────────────────────
          The arrangement (stated once) and the four floors now sit in one
          section, because they are one idea: every floor is the same plan, and
          what differs is atmosphere. Splitting them across two sections meant
          saying the plan twice and reading as two marketing blocks. */}
      <section
        className="texture-limewash relative overflow-hidden bg-atmos-tint"
        data-atmosphere="house"
      >
        <TileField className="-bottom-24 -left-20 h-[340px] w-[340px]" />

        <div className="container-content section-rhythm relative">
          <Arrangement />

          <div className="mt-20 md:mt-28">
            <Reveal className="measure">
              <p className="type-eyebrow">{t.home.floors.eyebrow}</p>
              <h2 className="type-h1 mt-6">{t.home.floors.heading}</h2>
              <p className="type-body mt-6 text-ink-soft">
                {t.home.floors.body}
              </p>
            </Reveal>

            <FloorLedger />

            <Reveal className="mt-10">
              <TextLink href="/experience">{t.home.floors.link}</TextLink>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Craft and materials ──────────────────────────────────────────── */}
      <section
        className="texture-limewash relative overflow-hidden bg-atmos"
        data-atmosphere="floor-3"
      >
        <div className="container-content section-rhythm">
          {/* The heading runs wide across the top here rather than sitting in
              a column beside the pictures. It breaks the left-text/right-image
              rhythm the page has settled into by this point, and it gives a
              long line somewhere to go. */}
          {/* Sized in rem, not ch: a `ch` on this wrapper measures the body
              font, not the display font inside it, which collapses the heading
              into a one-word ladder. */}
          <Reveal className="max-w-[44rem]">
            <p className="type-eyebrow">{t.home.craft.eyebrow}</p>
            <h2 className="type-h1 mt-6">{t.home.craft.heading}</h2>
          </Reveal>

          <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-4">
              {t.home.craft.body.map((paragraph, index) => (
                <Reveal key={index} delay={index * 60}>
                  <p className={`type-body text-ink-soft ${index ? "mt-6" : ""}`}>
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>

            {/* Three square details, stepped, so the eye moves through them. */}
            <div className="md:col-span-7 md:col-start-6">
              <div className="grid grid-cols-2 gap-5 sm:gap-6">
                <Reveal variant="photo" className="col-span-2">
                  <Photo
                    id="craftTiles"
                    ratio="16 / 10"
                    sizes="(min-width: 768px) 52vw, 92vw"
                    zoomable
                  />
                </Reveal>
                <Reveal variant="photo" delay={90}>
                  <Photo
                    id="craftHands"
                    sizes="(min-width: 768px) 26vw, 45vw"
                    zoomable
                  />
                </Reveal>
                <Reveal variant="photo" delay={160} className="pt-8">
                  <Photo
                    id="craftTextile"
                    sizes="(min-width: 768px) 26vw, 45vw"
                    zoomable
                  />
                </Reveal>
              </div>
            </div>
          </div>
        </div>

        <div className="container-content">
          <TileRule tone="accent" />
        </div>
      </section>

      {/* ── Food ─────────────────────────────────────────────────────────
          Deliberately the quietest section on the page, and the only one that
          is mostly empty. It comes straight after the densest stretch (craft,
          three photographs and a column of text), so it works as a pause in
          the page's rhythm.

          The photograph bleeds off the right edge rather than sitting in a
          column, which is what keeps this from being another image-beside-text
          block: the picture is not balanced against the words, it runs past
          them and off the page. */}
      <section className="bg-atmos" data-atmosphere="floor-3">
        <div className="section-rhythm relative overflow-hidden">
          <div className="container-content">
            <div className="grid items-center gap-10 md:grid-cols-12">
              <div className="md:col-span-5 lg:col-span-4">
                <Reveal>
                  <p className="type-eyebrow">{t.home.food.eyebrow}</p>
                  <h2 className="type-h1 mt-6">{t.home.food.heading}</h2>
                </Reveal>
                {t.home.food.body.map((paragraph, index) => (
                  <Reveal key={index} delay={80}>
                    <p className="type-body mt-6 text-ink-soft">{paragraph}</p>
                  </Reveal>
                ))}
                <Reveal delay={160}>
                  <p className="type-caption rule-atmos mt-8 border-t pt-4">
                    {t.home.food.note}
                  </p>
                </Reveal>
              </div>
            </div>
          </div>

          {/* Positioned out of flow on desktop so it can run past the container
              edge. On small screens it returns to the flow underneath, where
              there is no edge to run off. */}
          <div className="container-content mt-12 md:mt-0">
            <Reveal
              variant="photo"
              className="md:absolute md:top-1/2 md:left-[52%] md:w-[48vw] md:-translate-y-1/2 lg:left-[50%] lg:w-[46vw]"
            >
              <Photo
                id="foodTable"
                ratio="4 / 3"
                sizes="(min-width: 768px) 48vw, 92vw"
                zoomable
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── House values and guest fit ───────────────────────────────────── */}
      <section
        className="texture-limewash relative overflow-hidden bg-atmos-tint"
        data-atmosphere="house"
      >
        <div className="container-content section-rhythm">
          <div className="grid gap-12 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-4">
              <Reveal variant="photo">
                <Photo
                  id="valuesCorner"
                  sizes="(min-width: 768px) 32vw, 92vw"
                />
              </Reveal>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <Reveal>
                <p className="type-eyebrow">{t.home.values.eyebrow}</p>
                <h2 className="type-h1 mt-6">{t.home.values.heading}</h2>
                <p className="type-lead mt-6 text-ink-soft">
                  {t.home.values.body}
                </p>
              </Reveal>
            </div>
          </div>

          <div className="mt-16">
            <HouseValues variant="embedded" />
          </div>
        </div>
      </section>

      {/* ── The invitation ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" data-atmosphere="house">
        <div className="relative">
          <Photo
            id="invitation"
            ratio="21 / 9"
            rounded={false}
            sizes="100vw"
            className="!min-h-[60svh]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgb(24 19 14 / 0.82) 0%, rgb(24 19 14 / 0.55) 52%, rgb(24 19 14 / 0.3) 100%)",
            }}
          />
          <div className="absolute inset-0 flex items-center">
            <div className="container-content">
              <Reveal className="max-w-[34rem] text-paper">
                <TileGlyph className="w-9 text-paper/50" />
                <h2 className="type-h1 mt-6 !text-paper">
                  {t.home.invitation.heading}
                </h2>
                <p className="type-lead mt-5 text-paper/90">
                  {t.home.invitation.body}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                  <ButtonLink href="/enquire">{t.cta.enquire}</ButtonLink>
                  <ButtonLink href="/experience" variant="outline">
                    {t.cta.readTheStory}
                  </ButtonLink>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
