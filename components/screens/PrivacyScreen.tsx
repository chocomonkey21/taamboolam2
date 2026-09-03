"use client";

import { Datum } from "../Datum";
import { useSite } from "../SiteProvider";
import { MaterialStrip } from "../TileMotif";

/**
 * What the site does with what a guest types into it.
 *
 * Set as a document rather than as a designed page: one column at the reading
 * measure, ruled headings, no photographs and no ornament except the material
 * strip that closes every other page. That restraint is the point — a privacy
 * notice that has been art-directed reads as marketing, and this one is
 * trying to be believed.
 *
 * It is short enough to read in a minute, which is the only property of a
 * privacy notice that actually protects anybody. Every claim in it is
 * checkable against the code: no database, one cookie, no third-party script,
 * logs that carry the visit type and the language and nothing else. If any of
 * that changes, this page is wrong until somebody rewrites it — see the note
 * on `privacy` in lib/content/types.ts.
 */
export function PrivacyScreen() {
  const { t } = useSite();

  return (
    <section
      className="texture-limewash relative bg-atmos"
      data-atmosphere="house"
    >
      <div className="container-content pt-32 pb-6 sm:pt-40 md:pt-44">
        <Datum note={t.privacy.eyebrow} className="max-w-[46rem]">
          <h1 className="type-h1 max-w-[18ch]">{t.privacy.heading}</h1>
          <p className="type-lead measure mt-5 text-ink-soft">
            {t.privacy.intro}
          </p>
        </Datum>
      </div>

      <div className="container-content">
        <MaterialStrip height="0.375rem" />
      </div>

      <div className="container-content section-rhythm">
        <div className="measure">
          {t.privacy.sections.map((section) => (
            <section key={section.title} className="rule-atmos border-t pt-7 pb-9">
              <h2 className="type-h3 text-atmos-ink">{section.title}</h2>
              {section.body.map((paragraph, i) => (
                <p key={i} className="type-body mt-4 text-ink-soft">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          {/* The one thing a reader might actually want to act on, so it is
              the last thing on the page and it is not inside a rule. */}
          <div className="rule-atmos border-t pt-7">
            <h2 className="type-h3 text-atmos-ink">
              {t.privacy.contactHeading}
            </h2>
            <p className="type-body mt-4 text-ink-soft">
              {t.privacy.contactBody}
            </p>
          </div>

          <p className="type-caption mt-10">{t.privacy.updated}</p>
        </div>
      </div>
    </section>
  );
}
