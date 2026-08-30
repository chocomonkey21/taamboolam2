"use client";

import { provisional } from "@/lib/config";
import { Reveal } from "./Reveal";
import { useSite } from "./SiteProvider";

/**
 * The house values, shared by the home page and the Experience page.
 *
 * Written as plain statements rather than a list of prohibitions with icons:
 * the point is that a reader recognises whether this house suits them, not
 * that they are warned.
 *
 * The bathroom line only appears once the owner has confirmed what it should
 * say — see lib/config.ts. Until then the layout carries an honest note in its
 * place rather than an invented claim.
 */
export function HouseValues({ compact = false }: { compact?: boolean }) {
  const { t, locale } = useSite();
  const bathrooms = provisional.bathrooms?.[locale] ?? null;
  const occupancy = provisional.occupancyNote?.[locale] ?? null;

  return (
    <div className="grid gap-12 md:grid-cols-12 md:gap-10">
      <div className="md:col-span-4">
        <p className="type-eyebrow">{t.values.eyebrow}</p>
        <h2 className="type-h2 mt-5">{t.values.heading}</h2>
        <p className="type-body measure mt-5 text-ink-soft">{t.values.intro}</p>
      </div>

      <div className="md:col-span-8">
        <dl className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
          {t.values.house.map((item, index) => (
            <Reveal
              key={item.title}
              delay={Math.min(index, 5) * 45}
              className="rule-atmos border-t pt-4"
            >
              <dt className="type-label">{item.title}</dt>
              <dd className="type-body mt-1.5 text-ink-soft">{item.body}</dd>
            </Reveal>
          ))}
        </dl>

        {!compact ? (
          <div
            className="rule-atmos mt-12 border-t pt-8">
            <h3 className="type-eyebrow">{t.values.practicalHeading}</h3>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2 sm:gap-x-10">
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
              <p className="type-caption measure mt-6">
                {t.values.pendingBathrooms}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
