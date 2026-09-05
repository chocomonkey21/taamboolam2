"use client";

import { Datum } from "../Datum";
import { Photo } from "../Photo";
import { Reveal } from "../Reveal";
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

      {/* ── Her words ─────────────────────────────────────────────────────
          The owner wrote this herself and asked for it as written. It is the
          only passage on the site in someone's voice rather than in the house
          style, so it is set as a quotation rather than folded into the prose:
          wider leading, no measure-width column of body text, and an eyebrow
          that says whose voice it is before the first line lands. Read as
          ordinary copy it would look like the writing slipped. Read as hers,
          it is the best thing on the page. */}
      <section
        className="texture-limewash relative bg-atmos"
        data-atmosphere="house"
        aria-labelledby="owner-words"
      >
        <div className="container-content section-rhythm">
          <p id="owner-words" className="type-eyebrow text-atmos-accent">
            {t.about.ownerEyebrow}
          </p>

          <blockquote className="mt-8 max-w-[52rem]">
            {/* Deliberately unanimated. Every other block on this page
                reveals, and six lines wiping in one after another would turn
                a quiet thing into a performance. They just sit there. */}
            {t.about.ownerWords.map((line, i) => (
              <p
                key={i}
                className={`type-lead text-balance text-atmos-ink/85 ${i ? "mt-7" : ""}`}
              >
                {line}
              </p>
            ))}

            {/* She set this apart from the rest with a line of dots. The rule
                is that line of dots. */}
            <p className="rule-atmos type-body measure mt-12 border-t pt-7 text-atmos-ink/75">
              {t.about.ownerEssence}
            </p>
          </blockquote>
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
          {/* The paragraph and the thing it describes, side by side.

              This section explains what a taamboolam is and, until now, showed
              nothing — the prose sat at its own measure and the right half of
              the band was empty turmeric, while the only photograph of an
              actual tray was down in the footer with no words near it. Both
              halves were weaker apart than together.

              Centred against the prose rather than aligned to its top: the
              tray is a circle, and a circle hung from a text baseline reads as
              having slipped. */}
          <div className="grid gap-10 md:grid-cols-12 md:items-center md:gap-12">
            <div className="md:col-span-6">
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

            {/* Wrapped in the site's photo reveal so it settles the way every
                other photograph here does, rather than being the one image
                that simply appears. Capped and centred below md, where it sits
                under the prose instead of beside it. */}
            <Reveal variant="photo" className="md:col-span-5 md:col-start-8">
              <Photo
                id="taamboolamTray"
                rounded={false}
                bare
                sizes="(min-width: 768px) 26rem, 72vw"
                className="mx-auto w-[72%] max-w-[16rem] sm:max-w-[19rem] md:w-full md:max-w-[26rem]"
              />
            </Reveal>
          </div>

          {/* The gloss. Not new material — the paragraph above already says it
              in a sentence. One to a line it becomes a list of what is on the
              tray, which is worth having in words now that the drawing of it
              is gone. */}
          <ul className="rule-atmos mt-12 border-t md:mt-14 md:grid md:grid-cols-2 md:gap-x-12">
            {t.about.elements.map((element) => (
              <li key={element.name} className="rule-atmos border-b py-6 md:py-7">
                <h3 className="type-label text-atmos-accent">{element.name}</h3>
                <p className="type-body mt-2 text-atmos-ink/75">
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
