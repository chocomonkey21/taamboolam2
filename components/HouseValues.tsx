"use client";

import { provisional } from "@/lib/config";
import { Disclosure } from "./Disclosure";
import { Reveal } from "./Reveal";
import { useSite } from "./SiteProvider";

/** The values that decide whether this house suits a reader. Never disclosed. */
const ALWAYS_VISIBLE = 5;

/**
 * The house values, shared by the home page and the Experience page.
 *
 * Written as plain statements rather than a list of prohibitions with icons:
 * the point is that a reader recognises whether this house suits them, not
 * that they are warned.
 *
 * What is disclosed and what is not is a deliberate line, not a space-saving
 * one. The first five — smoking, children and pets, noise, parties, cooking —
 * are the ones somebody might turn back at, so they stay on the page whatever
 * happens. The rest are the house explaining itself, and they sit behind a
 * summary that says exactly what it holds. The same rule governs the practical
 * block: lift, parking and the private fifth floor can be asked for, but how a
 * room is actually got is never folded away.
 *
 * The bathroom line only appears once the owner has confirmed what it should
 * say — see lib/config.ts. Until then the layout carries an honest note in its
 * place rather than an invented claim.
 */
export function HouseValues({
  compact = false,
  /**
   * "section" carries its own heading column. "embedded" does not — used on
   * the home page, where the section around it already has a heading and a
   * second one two blocks later read as the page repeating itself.
   */
  variant = "section",
}: {
  compact?: boolean;
  variant?: "section" | "embedded";
}) {
  const { t, locale } = useSite();
  const bathrooms = provisional.bathrooms?.[locale] ?? null;
  const occupancy = provisional.occupancyNote?.[locale] ?? null;

  const core = t.values.house.slice(0, ALWAYS_VISIBLE);
  const rest = t.values.house.slice(ALWAYS_VISIBLE);
  const embedded = variant === "embedded";

  return (
    <div
      className={
        embedded ? "" : "grid gap-12 md:grid-cols-12 md:gap-10"
      }
    >
      {!embedded ? (
        <div className="md:col-span-4">
          <p className="type-eyebrow">{t.values.eyebrow}</p>
          <h2 className="type-h2 mt-5">{t.values.heading}</h2>
          <p className="type-body measure mt-5 text-ink-soft">
            {t.values.intro}
          </p>
        </div>
      ) : null}

      <div className={embedded ? "" : "md:col-span-7 md:col-start-6"}>
        <dl
          className={`grid gap-x-10 gap-y-7 sm:grid-cols-2 ${
            embedded ? "lg:grid-cols-3" : ""
          }`}
        >
          {core.map((item, index) => (
            <Reveal
              key={item.title}
              delay={Math.min(index, 4) * 45}
              className="rule-atmos border-t pt-4"
            >
              <dt className="type-label">{item.title}</dt>
              <dd className="type-body mt-1.5 text-ink-soft">{item.body}</dd>
            </Reveal>
          ))}
        </dl>

        <div className="mt-10">
          {rest.length > 0 ? (
            <Disclosure label={t.values.moreLabel}>
              <dl
                className={`grid gap-x-10 gap-y-6 sm:grid-cols-2 ${
                  embedded ? "lg:grid-cols-3" : ""
                }`}
              >
                {rest.map((item) => (
                  <div key={item.title}>
                    <dt className="type-label">{item.title}</dt>
                    <dd className="type-body mt-1.5 text-ink-soft">
                      {item.body}
                    </dd>
                  </div>
                ))}
              </dl>
            </Disclosure>
          ) : null}

          {!compact ? (
            <Disclosure label={t.values.practicalLabel}>
              <ul className="grid gap-2.5 sm:grid-cols-2 sm:gap-x-10">
                {t.values.practical.map((line) => (
                  <li key={line} className="type-body text-ink-soft">
                    {line}
                  </li>
                ))}
                {bathrooms ? (
                  <li className="type-body text-ink-soft">{bathrooms}</li>
                ) : null}
                {occupancy ? (
                  <li className="type-body text-ink-soft">{occupancy}</li>
                ) : null}
              </ul>

              {/* Nothing is claimed about bathrooms until the owner confirms it. */}
              {!bathrooms ? (
                <p className="type-caption measure mt-5">
                  {t.values.pendingBathrooms}
                </p>
              ) : null}
            </Disclosure>
          ) : null}
        </div>

        {/* How a room is got stays on the page. It is the one practical fact
            that changes what a reader does next. */}
        <p className="rule-atmos type-body mt-8 border-t pt-5 text-ink-soft">
          {t.values.enquiryOnly}
        </p>
      </div>
    </div>
  );
}
