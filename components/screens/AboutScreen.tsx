"use client";

import { Datum } from "../Datum";
import { Reveal } from "../Reveal";
import { TaamboolamPlate } from "../TaamboolamPlate";
import { TileCourse } from "../TileMotif";
import { useSite } from "../SiteProvider";

/**
 * About: what the house is, and what its name means.
 *
 * The name explanation used to be two paragraphs at the foot of the home
 * page's About section, in the same measure and the same cream as the house
 * description above it. It is a different register — those describe a house,
 * this explains a word — and giving it no different treatment made it read as
 * an afterthought stapled to a section about something else. It has a page
 * now. The copy came across unchanged; nothing was rewritten to fill a page.
 *
 * Two bands. The first is the house, on the site's own paper. The second is
 * the word, on turmeric — and the colour is doing a job rather than
 * decorating: taamboolam is the one subject on this site that is literally
 * yellow, turmeric being one of the things the paragraph names, so the only
 * strongly coloured ground on the site is the one place where the colour is
 * the subject. Anywhere else it would be a theme. Here, once, it is a fact.
 */
export function AboutScreen() {
  const { t } = useSite();

  return (
    <>
      {/* ── The house ─────────────────────────────────────────────────── */}
      <section className="texture-limewash relative bg-atmos" data-atmosphere="house">
        <div className="container-content section-rhythm-wide">
          <Datum note={t.about.eyebrow} className="md:max-w-[46rem]">
            <Reveal as="h1" variant="wipe" className="type-display max-w-[15ch]">
              {t.about.heading}
            </Reveal>
            {t.about.body.map((paragraph, i) => (
              <p
                key={i}
                className={`type-lead measure text-ink-soft ${i ? "mt-5" : "mt-8"}`}
              >
                {paragraph}
              </p>
            ))}
          </Datum>

          {/* The one line that says who this suits, set apart on a hairline
              rather than folded into the paragraph above it — the same
              treatment it has always had. */}
          <p className="type-annotation rule-atmos mt-12 border-t pt-5 md:mt-14">
            {t.about.note}
          </p>
        </div>
      </section>

      <TileCourse />

      {/* ── The word ──────────────────────────────────────────────────── */}
      <section
        className="texture-limewash relative bg-atmos"
        data-atmosphere="taamboolam"
        aria-labelledby="name-origin"
      >
        <div className="container-content section-rhythm">
          <div className="grid items-center gap-12 md:grid-cols-12 md:gap-10">
            {/* Text left, tray right, on the twelve-column grid the rest of
                the site uses. One column below md, text first. */}
            <div className="md:col-span-5">
              <p className="type-eyebrow text-atmos-accent">{t.about.nameEyebrow}</p>
              <h2 id="name-origin" className="type-h2 mt-5 text-atmos-ink">
                {t.about.nameHeading}
              </h2>
              {t.about.nameBody.map((paragraph, i) => (
                <p
                  key={i}
                  className={`type-body measure text-atmos-ink/80 ${i ? "mt-4" : "mt-6"}`}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Capped hard below md. A tray that fills a phone's width pushes
                the paragraph a screen and a half down and turns a short
                explanation into a scroll. */}
            <div className="md:col-span-6 md:col-start-7">
              <TaamboolamPlate className="mx-auto w-full max-w-[20rem] sm:max-w-[24rem] md:max-w-none" />
            </div>
          </div>

          {/* ── What each part carries ──────────────────────────────────
              The paragraph above already says this in a sentence: "the leaf
              freshness and respect, the nut firmness, the coconut and fruit
              abundance". Set out as a list it becomes a key to the drawing
              beside it — the reader can look from a word to the thing. Kept
              to one line each; this is a gloss, not a glossary. */}
          <ul className="rule-atmos mt-14 grid gap-x-10 gap-y-6 border-t pt-8 sm:grid-cols-2 lg:grid-cols-3">
            {t.about.elements.map((element) => (
              <li key={element.name}>
                <h3 className="type-label text-atmos-accent">{element.name}</h3>
                <p className="type-caption mt-1.5 text-atmos-ink/75">
                  {element.carries}
                </p>
              </li>
            ))}
          </ul>

          <p className="type-annotation mt-10">{t.about.gestureNote}</p>
        </div>
      </section>
    </>
  );
}
