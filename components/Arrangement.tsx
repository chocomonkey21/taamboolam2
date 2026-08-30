"use client";

import { Datum } from "./Datum";
import { Photo } from "./Photo";
import { Reveal } from "./Reveal";
import { useSite } from "./SiteProvider";

/**
 * The plan of a floor, stated once for the whole site.
 *
 * Every floor is the same arrangement, so it is described here and nowhere
 * else. Each of the four chapters used to carry its own identical list of the
 * same four facts, which read as padding and made the floors seem
 * interchangeable when the point is that only their atmosphere differs.
 *
 * Set as a numbered plan rather than a bulleted list: these are the parts of
 * one thing, not an unordered set of features. The numerals are set in the
 * display face and hung outside the text column, so the list reads as a
 * schedule on a drawing rather than as an ordered list in a document.
 *
 * `compact` drops the photographs. The Experience page uses it, because the
 * two pictures here would be the third and fourth of that page's photographs
 * before the reader has reached a single floor — and they are already on the
 * home page.
 */
export function Arrangement({ compact = false }: { compact?: boolean }) {
  const { t } = useSite();
  const a = t.arrangement;

  const intro = (
    <>
      <h2 className="type-h1 max-w-[14ch]">{a.heading}</h2>
      <p className="type-body measure mt-5 text-ink-soft">{a.body}</p>
    </>
  );

  const plan = (
    <ol className="rule-atmos border-t">
      {a.items.map((item, index) => (
        <li
          key={item}
          className="rule-atmos flex items-baseline gap-5 border-b py-4"
        >
          <span
            aria-hidden="true"
            className="type-caption w-5 shrink-0 tabular-nums text-atmos-accent"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="type-body">{item}</span>
        </li>
      ))}
    </ol>
  );

  /* The one thing in this block that changes what a reader does next, so it
     is the only thing set at lead scale. */
  const booking = <p className="type-lead max-w-[32ch]">{a.bookingNote}</p>;

  if (compact) {
    return (
      <Datum note={a.eyebrow}>
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            {intro}
            <div className="mt-8">{booking}</div>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            {plan}
            <p className="type-caption mt-4">{a.sameNote}</p>
          </div>
        </div>
      </Datum>
    );
  }

  return (
    <Datum note={a.eyebrow}>
      <div className="grid gap-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          {intro}
          <div className="mt-9">{plan}</div>
          <p className="type-caption mt-4">{a.sameNote}</p>
          <div className="mt-8">{booking}</div>
        </div>

        {/* Two photographs, overlapped rather than stacked.
            The detail used to float alone under the wide shot, which left a
            hole to its left and read as an afterthought — it was near the
            other picture without belonging to it. Pulling it up into the wide
            shot's lower edge and letting it break the column's left margin
            makes the pair one object: the detail is now clearly a fragment of
            the room above it, and the overlap is what says so. It stacks
            plainly below md, where there is no column to break out of and an
            overlap would only crowd. */}
        <div className="md:col-span-6 md:col-start-7">
          <Reveal variant="photo">
            <Photo id="stayingShared" sizes="(min-width: 768px) 46vw, 92vw" />
          </Reveal>
          <Reveal
            variant="photo"
            delay={90}
            className="mt-6 w-[72%] md:-mt-20 md:-ml-16 md:w-[56%]"
          >
            <Photo
              id="stayingBalcony"
              ratio="4 / 3"
              sizes="(min-width: 768px) 26vw, 66vw"
              className="ring-8 ring-[var(--atmos-bg)]"
            />
          </Reveal>
          <p className="type-caption mt-4 md:ml-[6%]">
            {t.photos.stayingBalcony.caption}
          </p>
        </div>
      </div>
    </Datum>
  );
}
