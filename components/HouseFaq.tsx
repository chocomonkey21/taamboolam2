"use client";

import { Datum } from "./Datum";
import { Disclosure } from "./Disclosure";
import { useSite } from "./SiteProvider";

/**
 * The questions people write in and ask.
 *
 * Deliberately built on the same `Disclosure` the house values already use,
 * rather than on a new accordion of its own. A second collapsible pattern on
 * one site is how a page starts looking like it was assembled out of a
 * component library: the reader would meet two different rows, two different
 * plus signs and two different opening speeds, and learn nothing from the
 * difference. This is the same row on a different subject.
 *
 * What that inherits, and what a hand-rolled version would have to re-earn:
 * it is a native <details>, so it opens with JavaScript off, it is already in
 * the tab order, screen readers announce its expanded state without an ARIA
 * attribute anywhere, and browser find-in-page can open a closed row to reveal
 * a match inside it.
 *
 * The rule for what may go behind one of these: the label must name what is
 * inside it, and nothing a guest has to know before arriving may live here
 * ALONE. The kitchen having no stove is the case that matters — it is
 * answered here, and it is also stated in the house values and captioned on
 * the photograph of the kitchen, because a guest who plans to cook and finds
 * out on arrival has had their evening ruined by a disclosure.
 */
export function HouseFaq() {
  const { t } = useSite();

  return (
    <Datum note={t.faq.eyebrow}>
      <h2 className="type-h1 max-w-[16ch]">{t.faq.heading}</h2>
      <p className="type-body measure mt-5 mb-10 text-ink-soft">
        {t.faq.intro}
      </p>

      <div className="rule-atmos border-b">
        {t.faq.items.map((item) => (
          <Disclosure key={item.q} label={item.q}>
            {/* The answer sits in the reading measure, indented to the width
                the summary's own label starts at, so an opened row reads as
                the continuation of the question rather than as a new block
                that happens to be underneath it. */}
            <div className="measure grid gap-4">
              {item.a.map((paragraph, i) => (
                <p key={i} className="type-body text-ink-soft">
                  {paragraph}
                </p>
              ))}
            </div>
          </Disclosure>
        ))}
      </div>
    </Datum>
  );
}
