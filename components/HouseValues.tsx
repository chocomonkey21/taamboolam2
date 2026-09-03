"use client";

import { provisional } from "@/lib/config";
import { Datum } from "./Datum";
import { Disclosure } from "./Disclosure";
import { useSite } from "./SiteProvider";

/**
 * The house values, shared by the home page and the Experience page.
 *
 * Set as a plate of terms, not as a card grid. The core values used to be
 * equal boxes in a three-column tray with a hairline over each — the default
 * shape for "three things", and one that makes "no smoking" and "children are
 * welcome" read as interchangeable product features. They are
 * not interchangeable: they are the four or five sentences a person needs in
 * order to know whether this house suits them. So each one is now a row with
 * the statement set large on the left and the qualification hanging beside it,
 * ruled the way terms are ruled on a page — closer to a notice by a door than
 * to a pricing table.
 *
 * What is disclosed and what is not is a deliberate line, not a space-saving
 * one. `t.values.core` — smoking, parties, children, pets — are the ones
 * somebody might actually turn back at, so they stay on the page whatever
 * happens. That now includes the pet policy, which is a refusal and therefore
 * belongs where nobody has to open anything to find it. Everything else the
 * house has to say about itself sits behind named groups instead of one flat
 * "more" dump, so a reader disclosing one knows what they are about to get.
 * The same rule governs the practical block: lift, parking and the private
 * fourth floor can be asked for, but how a room is actually got is never
 * folded away.
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
  const occupancy = provisional.occupancyNote?.[locale] ?? null;

  const embedded = variant === "embedded";

  const terms = (
    <>
      <dl className="rule-atmos border-t">
        {t.values.core.map((item) => (
          <div
            key={item.title}
            className="rule-atmos grid gap-x-10 gap-y-1.5 border-b py-6 md:grid-cols-[minmax(0,17rem)_1fr] md:py-7"
          >
            <dt className="type-h3 text-atmos-ink">{item.title}</dt>
            <dd className="type-body max-w-[52ch] text-ink-soft">
              {item.body}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-8">
        {t.values.groups.map((group) => (
          <Disclosure key={group.label} label={group.label}>
            <dl className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
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
              {occupancy ? (
                <li className="type-body text-ink-soft">{occupancy}</li>
              ) : null}
            </ul>
          </Disclosure>
        ) : null}
      </div>

      {/* How a room is got stays on the page. It is the one practical fact
          that changes what a reader does next, so it is never disclosed away
          and it is set apart from the terms above it. */}
      <p className="type-body rule-atmos mt-8 border-t pt-5 text-ink-soft md:max-w-[64ch]">
        {t.values.enquiryOnly}
      </p>
    </>
  );

  if (embedded) return terms;

  return (
    <Datum note={t.values.eyebrow}>
      <h2 className="type-h1 max-w-[16ch]">{t.values.heading}</h2>
      <p className="type-body measure mt-5 mb-12 text-ink-soft">
        {t.values.intro}
      </p>
      {terms}
    </Datum>
  );
}
