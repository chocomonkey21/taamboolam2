"use client";

import type { FloorId } from "@/lib/content";
import type { PhotoId } from "@/lib/photos";
import { ButtonLink, TextLink } from "../Button";
import { HouseValues } from "../HouseValues";
import { Photo } from "../Photo";
import { Reveal } from "../Reveal";
import { useSite } from "../SiteProvider";
import { TileField, TileGlyph, TileRule } from "../TileMotif";
import { Wordmark } from "../Wordmark";

/** Which photograph and which atmosphere stands for each floor in the preview. */
const FLOOR_PREVIEW: {
  id: FloorId;
  photo: PhotoId;
  atmosphere: string;
}[] = [
  { id: "floor1", photo: "floor1a", atmosphere: "floor-1" },
  { id: "floor2", photo: "floor2a", atmosphere: "floor-2" },
  { id: "floor3", photo: "floor3a", atmosphere: "floor-3" },
  { id: "floor4", photo: "floor4a", atmosphere: "floor-4" },
];

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

      {/* ── What staying here means ──────────────────────────────────────── */}
      <section
        className="texture-limewash relative overflow-hidden bg-atmos-tint"
        data-atmosphere="house"
      >
        <TileField className="-bottom-24 -left-20 h-[340px] w-[340px]" />

        <div className="container-content section-rhythm relative">
          <Reveal className="measure">
            <p className="type-eyebrow">{t.home.staying.eyebrow}</p>
            <h2 className="type-h1 mt-6">{t.home.staying.heading}</h2>
            <p className="type-lead mt-6 text-ink-soft">{t.home.staying.body}</p>
          </Reveal>

          <div className="mt-14 grid gap-10 md:grid-cols-12 md:gap-10">
            <dl className="order-2 grid gap-7 md:order-1 md:col-span-5 md:content-start">
              {t.home.staying.points.map((point, index) => (
                <Reveal
                  key={point.title}
                  delay={index * 60}
                  className="rule-atmos border-t pt-4"
                >
                  <dt className="type-h3">{point.title}</dt>
                  <dd className="type-body mt-2 text-ink-soft">{point.body}</dd>
                </Reveal>
              ))}
            </dl>

            {/* Two photographs at different weights, offset — a spread, not a
                row of equal cards. */}
            <div className="order-1 grid gap-6 md:order-2 md:col-span-6 md:col-start-7">
              <Reveal variant="photo">
                <Photo
                  id="stayingShared"
                  sizes="(min-width: 768px) 46vw, 92vw"
                  caption="below"
                />
              </Reveal>
              <div className="grid grid-cols-2 gap-6">
                <Reveal variant="photo" delay={80}>
                  <Photo id="stayingBalcony" sizes="(min-width: 768px) 23vw, 45vw" />
                </Reveal>
                <Reveal variant="photo" delay={150} className="md:pt-10">
                  <Photo
                    id="stayingMorning"
                    sizes="(min-width: 768px) 23vw, 45vw"
                  />
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── The four floors ──────────────────────────────────────────────── */}
      <section className="bg-atmos" data-atmosphere="house">
        <div className="container-content section-rhythm">
          <Reveal className="measure">
            <p className="type-eyebrow">{t.home.floors.eyebrow}</p>
            <h2 className="type-h1 mt-6">{t.home.floors.heading}</h2>
            <p className="type-body mt-6 text-ink-soft">{t.home.floors.body}</p>
          </Reveal>

          {/* All four carry equal weight — same crop, same type, same space.
              The only things that separate them are the atmosphere each one
              brings with it, and a small stepped offset that makes the row
              read as a climb rather than as four cards in a tray. */}
          <ul className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:items-start lg:gap-6">
            {FLOOR_PREVIEW.map((floor, index) => {
              const copy = t.floors[floor.id];
              const step = ["lg:mt-0", "lg:mt-8", "lg:mt-16", "lg:mt-24"][index];
              return (
                <li
                  key={floor.id}
                  data-atmosphere={floor.atmosphere}
                  className={step}
                >
                  <Reveal variant="photo" delay={index * 70}>
                    <Photo
                      id={floor.photo}
                      sizes="(min-width: 1024px) 23vw, (min-width: 640px) 46vw, 92vw"
                    />
                  </Reveal>
                  <Reveal delay={index * 70 + 60}>
                    <p className="type-eyebrow mt-5 text-atmos-accent">
                      {copy.label}
                    </p>
                    <p className="type-body mt-2.5">{copy.lead}</p>
                  </Reveal>
                </li>
              );
            })}
          </ul>

          <Reveal className="mt-12">
            <TextLink href="/experience">{t.home.floors.link}</TextLink>
          </Reveal>
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

      {/* ── Food ─────────────────────────────────────────────────────────── */}
      <section className="bg-atmos" data-atmosphere="floor-3">
        <div className="container-content section-rhythm">
          <div className="grid items-center gap-12 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-7">
              <Reveal variant="photo">
                <Photo
                  id="foodTable"
                  sizes="(min-width: 768px) 56vw, 92vw"
                  caption="below"
                />
              </Reveal>
            </div>
            <div className="md:col-span-4 md:col-start-9">
              <Reveal>
                <p className="type-eyebrow">{t.home.food.eyebrow}</p>
                <h2 className="type-h2 mt-5">{t.home.food.heading}</h2>
              </Reveal>
              {t.home.food.body.map((paragraph, index) => (
                <Reveal key={index} delay={70 + index * 60}>
                  <p className="type-body mt-5 text-ink-soft">{paragraph}</p>
                </Reveal>
              ))}
              <Reveal delay={200}>
                <p className="type-caption rule-atmos mt-7 border-t pt-4">
                  {t.home.food.note}
                </p>
              </Reveal>
            </div>
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
            <HouseValues />
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
