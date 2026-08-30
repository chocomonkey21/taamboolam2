"use client";

import { site } from "@/lib/site";
import { EnquiryForm } from "../EnquiryForm";
import { Photo } from "../Photo";
import { Reveal } from "../Reveal";
import { useSite } from "../SiteProvider";
import { TileRule } from "../TileMotif";

/**
 * The enquiry page. Short, warm, and honest about what it is: the beginning of
 * a conversation with a person, not a transaction with a system.
 */
export function EnquireScreen() {
  const { t } = useSite();

  return (
    <section
      className="texture-limewash relative bg-atmos"
      data-atmosphere="house"
    >
      <div className="container-content pt-32 pb-10 sm:pt-40 md:pt-48">
        <div className="grid gap-10 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7">
            <Reveal>
              <p className="type-eyebrow">{t.nav.enquire}</p>
              <h1 className="type-h1 mt-6">{t.form.heading}</h1>
            </Reveal>
            {t.form.intro.map((paragraph, index) => (
              <Reveal key={index} delay={70 + index * 60}>
                <p
                  className={`measure text-ink-soft ${
                    index === 0 ? "type-lead mt-6" : "type-body mt-5"
                  }`}
                >
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>

          <div className="md:col-span-4 md:col-start-9">
            <Reveal variant="photo">
              <Photo
                id="stayingMorning"
                sizes="(min-width: 768px) 32vw, 92vw"
              />
            </Reveal>
            <Reveal delay={90}>
              <ul className="rule-atmos mt-6 grid gap-2 border-t pt-5">
                <li className="type-body text-ink-soft">
                  <a
                    href={`https://wa.me/${site.contact.whatsapp}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="underline decoration-transparent underline-offset-4 transition-colors hover:text-ink hover:decoration-current"
                  >
                    {t.footer.whatsapp} — {site.contact.phone}
                  </a>
                </li>
                <li className="type-body text-ink-soft">
                  <a
                    href={`mailto:${site.contact.email}`}
                    className="underline decoration-transparent underline-offset-4 transition-colors hover:text-ink hover:decoration-current"
                  >
                    {site.contact.email}
                  </a>
                </li>
              </ul>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="container-content">
        <TileRule />
      </div>

      <div className="container-content section-rhythm-sm">
        <div className="max-w-[46rem]">
          <EnquiryForm />
        </div>
      </div>
    </section>
  );
}
