"use client";

import { site } from "@/lib/site";
import { Datum } from "../Datum";
import { EnquiryForm } from "../EnquiryForm";
import { Photo } from "../Photo";
import { Reveal } from "../Reveal";
import { useSite } from "../SiteProvider";
import { MaterialStrip } from "../TileMotif";

/**
 * The enquiry page. Short, warm, and honest about what it is: the beginning of
 * a conversation with a person, not a transaction with a system.
 *
 * The page used to open with a heading, two paragraphs and a photograph across
 * a full viewport, then a divider, then the form far below the fold — so the
 * one thing a reader came here to do was the last thing they reached. The
 * heading and the first field are now in the same screen, and everything that
 * is context rather than instruction — the photograph, the two direct ways to
 * reach a person — sits in a column beside the form and stays with it as the
 * reader works down.
 */
export function EnquireScreen() {
  const { t } = useSite();

  return (
    <section
      className="texture-limewash relative bg-atmos"
      data-atmosphere="house"
    >
      <div className="container-content pt-32 pb-6 sm:pt-40 md:pt-44">
        <Datum note={t.nav.enquire} className="max-w-[46rem]">
          <Reveal as="h1" variant="wipe" className="type-h1">
            {t.form.heading}
          </Reveal>
          <p className="type-lead measure mt-5 text-ink-soft">
            {t.form.intro[0]}
          </p>
        </Datum>
      </div>

      <div className="container-content">
        <MaterialStrip height="0.375rem" />
      </div>

      <div className="container-content section-rhythm">
        <div className="grid gap-12 md:grid-cols-12 md:gap-10">
          {/* The form leads. Everything else on this page is beside it. */}
          <div className="md:col-span-7">
            <EnquiryForm />
          </div>

          {/* Context, and the two ways round the form. Sticky on desktop so a
              reader who decides halfway down that they would rather just send
              a message does not have to scroll back up to find out how. */}
          <aside className="md:col-span-4 md:col-start-9 md:sticky md:top-28 md:self-start">
            {/* The living room of a floor, not a bedroom. What somebody is
                enquiring about here is a household, and the photograph beside
                the form should be the thing the form is actually asking them
                to describe themselves into. */}
            <Reveal variant="photo">
              <Photo id="planLiving" sizes="(min-width: 768px) 30vw, 92vw" />
            </Reveal>

            <p className="type-body rule-atmos mt-6 border-t pt-5 text-ink-soft">
              {t.form.intro[1]}
            </p>

            <ul className="mt-5 grid gap-2">
              <li className="type-body">
                <a
                  href={`https://wa.me/${site.contact.whatsapp}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex min-h-11 items-center text-ink-soft underline decoration-transparent underline-offset-4 transition-colors hover:text-ink hover:decoration-current"
                >
                  {t.footer.whatsapp} — {site.contact.phone}
                </a>
              </li>
              <li className="type-body">
                <a
                  href={`mailto:${site.contact.email}`}
                  className="inline-flex min-h-11 items-center text-ink-soft underline decoration-transparent underline-offset-4 transition-colors hover:text-ink hover:decoration-current"
                >
                  {site.contact.email}
                </a>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
