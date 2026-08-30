"use client";

import { Photo } from "./Photo";
import { Reveal } from "./Reveal";
import { useSite } from "./SiteProvider";

/**
 * The plan of a floor, stated once for the whole site.
 *
 * Every floor is the same arrangement, so it is described here and nowhere
 * else. Previously each of the four chapters carried its own identical list of
 * facts — the same four lines, four times — which read as padding and made the
 * floors seem interchangeable when the point is that only their atmosphere
 * differs.
 *
 * Set as a numbered plan rather than a bulleted list: these are the parts of
 * one thing, not an unordered set of features.
 *
 * `compact` drops the photographs. The Experience page uses it, because the
 * two pictures here would be the third and fourth of that page's photographs
 * before the reader has reached a single floor — and they are already on the
 * home page. There the block runs wide instead, text against list.
 */
export function Arrangement({ compact = false }: { compact?: boolean }) {
  const { t } = useSite();
  const a = t.arrangement;

  const intro = (
    <Reveal>
      <p className="type-eyebrow">{a.eyebrow}</p>
      <h2 className="type-h2 mt-5">{a.heading}</h2>
      <p className="type-body measure mt-5 text-ink-soft">{a.body}</p>
    </Reveal>
  );

  const plan = (
    <Reveal delay={90}>
      <ol className="rule-atmos border-t">
        {a.items.map((item, index) => (
          <li
            key={item}
            className="rule-atmos flex items-baseline gap-4 border-b py-3.5"
          >
            <span
              aria-hidden="true"
              className="type-caption w-4 shrink-0 tabular-nums text-atmos-accent"
            >
              {index + 1}
            </span>
            <span className="type-body">{item}</span>
          </li>
        ))}
      </ol>
      <p className="type-caption mt-4">{a.sameNote}</p>
    </Reveal>
  );

  const booking = (
    <Reveal delay={150}>
      <p className="type-lead max-w-[34ch]">{a.bookingNote}</p>
    </Reveal>
  );

  if (compact) {
    return (
      <div className="grid gap-10 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          {intro}
          <div className="mt-8">{booking}</div>
        </div>
        <div className="md:col-span-6 md:col-start-7">{plan}</div>
      </div>
    );
  }

  return (
    <div className="grid gap-10 md:grid-cols-12 md:gap-10">
      <div className="md:col-span-5">
        {intro}
        <div className="mt-8">{plan}</div>
        <div className="mt-8">{booking}</div>
      </div>

      {/* Two photographs at different weights and heights, so the right side
          is a composition rather than a single balancing block. */}
      <div className="md:col-span-6 md:col-start-7">
        <Reveal variant="photo">
          <Photo
            id="stayingShared"
            sizes="(min-width: 768px) 46vw, 92vw"
            caption="below"
          />
        </Reveal>
        {/* Offset right and smaller — a detail set against the wide shot
            above it, not a second panel balancing it. */}
        <Reveal variant="photo" delay={90} className="mt-6 ml-auto w-[68%]">
          <Photo
            id="stayingBalcony"
            ratio="4 / 3"
            sizes="(min-width: 768px) 31vw, 63vw"
          />
        </Reveal>
      </div>
    </div>
  );
}
