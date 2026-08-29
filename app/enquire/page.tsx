import type { Metadata } from "next";
import { EnquiryForm } from "@/components/EnquiryForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Enquire & Find Us",
  description:
    "Write to Taamboolam about a stay. Radha reads every message and replies herself. Directions, address and phone for the house in Jayanagar, Bengaluru.",
  alternates: { canonical: "/enquire" },
};

export default function EnquirePage() {
  return (
    <>
      {/* Framing — a person replies, not a system --------------------------- */}
      <section className="section-rhythm border-b border-border">
        <div className="container-content">
          <p className="type-eyebrow">Enquire</p>
          <h1 className="type-display mt-6 max-w-[18ch]">
            Tell us a little about your trip.
          </h1>
          <p className="type-body measure mt-7 text-foreground-muted">
            There is no booking system here. {site.host} reads every message and
            replies herself, usually within a day. If a date is already taken,
            she will say so and suggest another.
          </p>
        </div>
      </section>

      {/* Form + contact ---------------------------------------------------- */}
      <section className="section-rhythm">
        <div className="container-content grid gap-16 md:grid-cols-12 md:gap-6 lg:gap-12">
          <div className="md:col-span-7">
            <EnquiryForm />
          </div>

          <aside className="md:col-span-4 md:col-start-9">
            <h2 className="type-h3">Would rather not fill a form?</h2>
            <p className="type-body mt-4 text-foreground-muted">
              Call or write to us directly. Either reaches the same person.
            </p>

            <dl className="mt-8 space-y-6">
              <div>
                <dt className="type-eyebrow">Phone and WhatsApp</dt>
                <dd className="type-body mt-2">
                  <a
                    href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
                    className="transition-colors duration-200 hover:text-accent-primary"
                  >
                    {site.contact.phone}
                  </a>
                </dd>
                <dd className="type-caption mt-2">
                  <a
                    href={`https://wa.me/${site.contact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-primary underline decoration-accent-primary/40 decoration-1 underline-offset-4 transition-colors duration-200 hover:decoration-accent-primary"
                  >
                    Open WhatsApp
                  </a>
                </dd>
              </div>

              <div>
                <dt className="type-eyebrow">Email</dt>
                <dd className="type-body mt-2 break-words">
                  <a
                    href={`mailto:${site.contact.email}`}
                    className="transition-colors duration-200 hover:text-accent-primary"
                  >
                    {site.contact.email}
                  </a>
                </dd>
              </div>

              <div>
                <dt className="type-eyebrow">Address</dt>
                <dd className="type-body mt-2">
                  <address className="not-italic">
                    {site.location.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      {/* Find us ----------------------------------------------------------- */}
      <section className="section-rhythm bg-surface">
        <div className="container-content">
          <p className="type-eyebrow">Find us</p>
          <h2 className="type-h1 mt-5 max-w-[20ch]">
            Off Sarakki Main Road, in 8th Block.
          </h2>
          <p className="type-body measure mt-5 text-foreground-muted">
            {site.location.landmarks}
          </p>

          <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12 md:gap-6 lg:gap-12">
            <div className="md:col-span-7">
              <div className="overflow-hidden rounded-md border border-border bg-background">
                <iframe
                  src={site.location.mapEmbedSrc}
                  title={`Map showing where ${site.name} is, in ${site.location.area}, ${site.location.region}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="block h-[320px] w-full border-0 md:h-[420px]"
                />
              </div>
              <p className="type-caption mt-4">
                <a
                  href={site.location.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-primary underline decoration-accent-primary/40 decoration-1 underline-offset-4 transition-colors duration-200 hover:decoration-accent-primary"
                >
                  Open in Google Maps
                </a>
              </p>
            </div>

            <div className="md:col-span-5">
              <h3 className="type-h3">Getting here</h3>
              <dl className="mt-6 divide-y divide-border border-t border-border">
                {site.location.gettingHere.map((item) => (
                  <div key={item.label} className="py-5">
                    <dt className="type-label text-foreground">{item.label}</dt>
                    <dd className="type-body mt-2 text-foreground-muted">
                      {item.detail}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="type-body mt-6 text-foreground-muted">
                Tell us your arrival time when you write. We will send exact
                directions and meet you if you like.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
