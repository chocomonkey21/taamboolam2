"use client";

import { TaamboolamPlate } from "./TaamboolamPlate";
import { useSite } from "./SiteProvider";

/**
 * What the word means.
 *
 * This was two paragraphs at the bottom of the About section, in the same
 * measure and the same cream as everything above it — a different register
 * (those describe a house, this explains a word) given no different treatment,
 * so it read as an afterthought stapled to the end of a section about
 * something else.
 *
 * It is now its own band, and the band is turmeric. That colour is doing a
 * job rather than decorating: taamboolam is the one thing on this site that is
 * literally yellow — turmeric is one of the six things named in the paragraph
 * — so the only strongly coloured ground on the whole site is the one place
 * the colour is the subject. Used anywhere else it would be a theme; used
 * here, once, it is a fact.
 *
 * Text left, tray right, on a twelve-column grid that becomes one column
 * under `md`. The tray is capped rather than fluid on small screens: a
 * full-bleed circle on a phone pushes the paragraph a screen and a half down
 * and turns a short aside into a scroll.
 */
export function NameOrigin() {
  const { t } = useSite();

  return (
    <section
      className="texture-limewash relative bg-atmos"
      data-atmosphere="taamboolam"
      aria-labelledby="name-origin"
    >
      <div className="container-content section-rhythm">
        <div className="grid items-center gap-10 md:grid-cols-12 md:gap-8">
          {/* ── The word ─────────────────────────────────────────────── */}
          <div className="md:col-span-6 lg:col-span-5">
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

          {/* ── The tray ─────────────────────────────────────────────────
              Offset a column on desktop so the drawing is not jammed against
              the paragraph, and centred with a hard cap below md so it never
              becomes the tallest thing on a phone. */}
          <div className="md:col-span-6 md:col-start-7 lg:col-span-6 lg:col-start-7">
            <TaamboolamPlate className="mx-auto w-full max-w-[19rem] sm:max-w-[22rem] md:max-w-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
