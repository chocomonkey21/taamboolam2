"use client";

import { ButtonLink } from "../Button";
import { ExperienceProgress } from "../ExperienceProgress";
import { FLOOR_CHAPTERS, FloorChapter } from "../FloorChapter";
import { HouseValues } from "../HouseValues";
import { Photo } from "../Photo";
import { Reveal } from "../Reveal";
import { useSite } from "../SiteProvider";
import { TileGlyph, TileRule } from "../TileMotif";

/**
 * One continuous story, read the way the house is climbed. Not four pages, not
 * a tabbed selector, and no floor presented as the good one.
 */
export function ExperienceScreen() {
  const { t } = useSite();

  return (
    <>
      <ExperienceProgress />

      {/* ── Opening ──────────────────────────────────────────────────────── */}
      <section
        className="texture-limewash relative bg-atmos"
        data-atmosphere="house"
      >
        <div className="container-content pt-32 pb-14 sm:pt-40 md:pt-48 md:pb-20">
          <Reveal className="measure">
            <p className="type-eyebrow">{t.experience.eyebrow}</p>
            <h1 className="type-display mt-6">{t.experience.heading}</h1>
          </Reveal>
        </div>

        <div className="container-content">
          <Reveal variant="photo">
            <Photo id="experienceOpening" sizes="100vw" />
          </Reveal>
        </div>

        <div className="container-content section-rhythm">
          <div className="grid gap-10 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-7 md:col-start-1">
              {t.experience.opening.map((paragraph, index) => (
                <Reveal key={index} delay={index * 70}>
                  <p
                    className={`text-ink-soft ${
                      index === 0 ? "type-lead" : "type-body mt-6"
                    }`}
                  >
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>

            <div className="md:col-span-4 md:col-start-9">
              <Reveal variant="photo">
                <Photo
                  id="stair"
                  sizes="(min-width: 768px) 32vw, 92vw"
                  caption="below"
                />
              </Reveal>
            </div>
          </div>

          <Reveal className="rule-atmos mt-14 border-t pt-6">
            <p className="type-eyebrow">{t.experience.floorsIntro}</p>
          </Reveal>
        </div>
      </section>

      {/* ── The four floors ──────────────────────────────────────────────── */}
      {FLOOR_CHAPTERS.map((spec) => (
        <FloorChapter key={spec.id} spec={spec} />
      ))}

      {/* ── Food ─────────────────────────────────────────────────────────── */}
      <section className="bg-atmos" data-atmosphere="house">
        <div className="container-content section-rhythm">
          <div className="grid gap-10 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-4">
              <Reveal>
                <p className="type-eyebrow">{t.experience.food.eyebrow}</p>
                <h2 className="type-h2 mt-5">{t.experience.food.heading}</h2>
              </Reveal>
              <Reveal delay={90} className="mt-8">
                <Photo id="foodDetail" sizes="(min-width: 768px) 30vw, 92vw" />
              </Reveal>
            </div>
            <div className="md:col-span-7 md:col-start-6 md:pt-2">
              {t.experience.food.body.map((paragraph, index) => (
                <Reveal key={index} delay={index * 70}>
                  <p
                    className={`text-ink-soft ${
                      index === 0 ? "type-lead" : "type-body mt-6"
                    }`}
                  >
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
        <div className="container-content">
          <TileRule />
        </div>
      </section>

      {/* ── Gatherings ───────────────────────────────────────────────────── */}
      <section
        className="texture-limewash relative bg-atmos-tint"
        data-atmosphere="house"
      >
        <div className="container-content section-rhythm">
          <div className="grid gap-10 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-6">
              <Reveal variant="photo">
                <Photo
                  id="experienceGathering"
                  sizes="(min-width: 768px) 46vw, 92vw"
                  caption="below"
                />
              </Reveal>
            </div>
            <div className="md:col-span-5 md:col-start-8">
              <Reveal>
                <p className="type-eyebrow">{t.experience.gatherings.eyebrow}</p>
                <h2 className="type-h2 mt-5">
                  {t.experience.gatherings.heading}
                </h2>
              </Reveal>
              {t.experience.gatherings.body.map((paragraph, index) => (
                <Reveal key={index} delay={70 + index * 60}>
                  <p className="type-body mt-6 text-ink-soft">{paragraph}</p>
                </Reveal>
              ))}
              <Reveal delay={220}>
                <p className="type-body rule-atmos mt-8 border-t pt-5">
                  {t.experience.gatherings.note}
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── House values ─────────────────────────────────────────────────── */}
      <section className="bg-atmos" data-atmosphere="house">
        <div className="container-content section-rhythm">
          <HouseValues />
        </div>
      </section>

      {/* ── Closing invitation ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden" data-atmosphere="house">
        <div className="relative">
          <Photo
            id="experienceClose"
            ratio="21 / 9"
            rounded={false}
            sizes="100vw"
            className="!min-h-[55svh]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgb(24 19 14 / 0.84) 0%, rgb(24 19 14 / 0.5) 58%, rgb(24 19 14 / 0.28) 100%)",
            }}
          />
          <div className="absolute inset-0 flex items-center">
            <div className="container-content">
              <Reveal className="max-w-[32rem] text-paper">
                <TileGlyph className="w-9 text-paper/50" />
                <h2 className="type-h1 mt-6 !text-paper">
                  {t.experience.close.heading}
                </h2>
                <p className="type-lead mt-5 text-paper/90">
                  {t.experience.close.body}
                </p>
                <div className="mt-8">
                  <ButtonLink href="/enquire">{t.cta.enquire}</ButtonLink>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
