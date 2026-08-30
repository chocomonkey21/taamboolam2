"use client";

import { provisional } from "@/lib/config";
import { Disclosure } from "./Disclosure";
import { Reveal } from "./Reveal";
import { useSite } from "./SiteProvider";

/**
 * The house values, shared by the home page and the Experience page.
 *
 * Written as plain statements rather than a list of prohibitions with icons:
 * the point is that a reader recognises whether this house suits them, not
 * that they are warned.
 *
 * What is disclosed and what is not is a deliberate line, not a space-saving
 * one. `t.values.core` — smoking, parties, children and pets — are the ones
 * somebody might actually turn back at, so they stay on the page whatever
 * happens. Everything else the house has to say about itself sits behind
 * named groups instead of one flat "more" dump, so a reader disclosing one
 * knows what they are about to get, not just that there is more. The same
 * rule governs the practical block: lift, parking and the private fifth floor
 * can be asked for, but how a room is actually got is never folded away.
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

  const embedded = variant === "embedded";
  const colClass = embedded ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2";

  return (
    <div className={embedded ? "" : "grid gap-12 md:grid-cols-12 md:gap-10"}>
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
        <dl className={`grid gap-x-10 gap-y-7 ${colClass}`}>
          {t.values.core.map((item, index) => (
            <Reveal
              key={item.title}
              delay={index * 45}
              className="rule-atmos border-t pt-4"
            >
              <dt className="type-label">{item.title}</dt>
              <dd className="type-body mt-1.5 text-ink-soft">{item.body}</dd>
            </Reveal>
          ))}
        </dl>

        <div className="mt-10">
          {t.values.groups.map((group) => (
            <Disclosure key={group.label} label={group.label}>
              <dl className={`grid gap-x-10 gap-y-6 ${colClass}`}>
                {group.items.map((item) => (
                  <div key={item.title}>
                    <dt className="type-label">{item.title}</dt>
                    <dd className="type-body mt-1.5 text-ink-soft">
                      {item.body}
                    </dd>
                  </div>
                ))}
              </dl>
            </Disclosure>
          ))}

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
        <div className="rule-atmos mt-8 border-t pt-5">
          <p className="type-body measure text-ink-soft">
            {t.values.enquiryOnly}
          </p>
        </div>
      </div>
    </div>
  );
}
