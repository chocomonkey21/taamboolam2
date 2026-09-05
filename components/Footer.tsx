"use client";

import Link from "next/link";
import { NAV_ITEMS, site, type NavKey } from "@/lib/site";
import { ButtonLink } from "./Button";
import { LanguageToggle } from "./LanguageToggle";
import { MapPanel } from "./MapPanel";
import { useSite } from "./SiteProvider";
import { MaterialStrip, TileCourse } from "./TileMotif";
import { Wordmark } from "./Wordmark";

/**
 * Find Us — the closing scene of every page, not a page of its own and not a
 * drawer of links.
 *
 * Three things changed here.
 *
 * The map was a drawing for most of this project, because the pin was a
 * geocoded guess and a schematic could not overstate a precision nobody had
 * confirmed. The owner has since given the house's own Google Maps record, so
 * it is the real map — the one third-party thing on the site, which cost a
 * `frame-src` in middleware.ts and a rewritten paragraph on the privacy page.
 * See MapPanel.
 *
 * The panel carries the page's own hairline and radius, and the address is
 * ruled underneath it in the same column, so the map reads as part of the
 * composition rather than as a window cut through it. That framing matters
 * more now than it did when the panel was a drawing: it is Google's artwork
 * inside it, and the border is what keeps it from looking pasted on.
 *
 * And the left half is no longer three quarters empty. It used to hold a
 * wordmark, one line and a button in a column six units wide, which left a
 * large rectangle of nothing beside the map. It now carries everything a
 * reader might want at the end of a page: the name, the invitation, the way to
 * reach a person, and the one sentence about gatherings.
 */
export function Footer() {
  const { t } = useSite();

  /* inline-block + py is what lifts these inline links to a comfortable touch
     target; the text does not move, only the hit area grows. */
  const linkClass =
    "type-body inline-flex min-h-11 items-center text-ink-soft underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-200 hover:text-ink hover:decoration-current";

  /* Keyed on NavKey rather than string, so a page added to NAV_ITEMS cannot
     be forgotten here. It already was once: About went into the list, the
     footer looked it up in a Record<string, string> that had no entry for it,
     and rendered a link with no text — invisible on the page and still
     reachable by keyboard. Typed this way that is a build error instead. */
  const labels: Record<NavKey, string> = {
    home: t.nav.home,
    about: t.nav.about,
    experience: t.nav.experience,
    enquire: t.nav.enquire,
  };

  return (
    <footer
      className="texture-plaster relative mt-auto"
      style={{ backgroundColor: "var(--color-lime)" }}
      data-atmosphere="house"
    >
      {/* A laid course closes the page the way one opens each chapter. */}
      <TileCourse className="relative z-10" />

      <div className="relative z-10 container-content pt-10 pb-14 md:pt-14 md:pb-16">
        <div className="grid gap-14 md:grid-cols-12 md:gap-10">
          {/* ── The last invitation ───────────────────────────────────── */}
          <div className="md:col-span-5">
            <p className="type-annotation">{t.footer.findUs}</p>

            {/* container-type makes this div the thing the wordmark measures
                itself against, so the name is sized by its own column rather
                than by the window. See the note in Wordmark.tsx. */}
            <div className="mt-5 [container-type:inline-size]">
              <Wordmark size="column" asLink={false} />
            </div>
            <p className="type-lead mt-4 max-w-[26ch] text-ink-soft">
              {t.wordmarkContext}
            </p>

            <div className="mt-8">
              <ButtonLink href="/enquire">{t.cta.enquire}</ButtonLink>
            </div>

            {/* Reaching a person. Set as a ruled list rather than as a row of
                inline links, because these are four different ways to do one
                thing and a reader is picking, not scanning. */}
            <ul className="rule-atmos mt-10 border-t">
              <li className="rule-atmos border-b py-2.5">
                <a
                  href={`https://wa.me/${site.contact.whatsapp}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={linkClass}
                >
                  {t.footer.whatsapp} — {site.contact.phone}
                </a>
              </li>
              <li className="rule-atmos border-b py-2.5">
                <a href={`mailto:${site.contact.email}`} className={linkClass}>
                  {site.contact.email}
                </a>
              </li>
              <li className="rule-atmos border-b py-2.5">
                <a
                  href={site.contact.instagram}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={linkClass}
                >
                  {t.footer.instagram}
                </a>
              </li>
            </ul>

            <p className="type-caption mt-6 max-w-[46ch]">
              {t.footer.gatherings}
            </p>

            {/* The tray used to sit here, on the argument that a taamboolam
                is what a household hands you on the way out and so belongs at
                the end of a page. Fair, but it was doing that work next to
                nothing that explained it, while the About page had a section
                literally titled "Where the name comes from" with an empty half
                beside the paragraph. It went there. */}
          </div>

          {/* ── Arriving ──────────────────────────────────────────────── */}
          <div className="md:col-span-6 md:col-start-7">
            <MapPanel />

            <div className="rule-atmos mt-7 border-t pt-6">
              <h2 className="type-annotation">{t.footer.address}</h2>
              <address className="type-h3 mt-3 not-italic">
                {site.location.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              <p className="type-body mt-4 max-w-[42ch] text-ink-soft">
                {t.footer.landmark}
              </p>

              <p className="mt-4">
                <a
                  href={site.location.mapLink}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="type-label inline-flex min-h-11 items-center text-clay-deep underline decoration-clay-deep/35 decoration-1 underline-offset-[7px] transition-colors duration-200 hover:decoration-clay-deep"
                >
                  {t.footer.mapLink}
                </a>
              </p>

              {site.location.mapLinkIsPlaceholder ? (
                <p className="type-caption mt-3">{t.footer.mapPending}</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* ── The base line ─────────────────────────────────────────────────
          pb-24 on small screens clears the persistent Enquire strip, which is
          fixed over the bottom of the viewport there. */}
      <div
        className="relative z-10 border-t"
        style={{ borderColor: "var(--color-stone)" }}
      >
        <div className="container-content flex flex-col gap-5 py-6 pb-24 md:flex-row md:items-center md:justify-between md:pb-6">
          <nav aria-label={t.footer.pages}>
            <ul className="flex flex-wrap items-center gap-x-7 gap-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="type-caption inline-flex min-h-11 items-center hover:text-ink"
                  >
                    {labels[item.key]}
                  </Link>
                </li>
              ))}
              {/* Not in NAV_ITEMS: the privacy notice is not one of the three
                  pages about the house, and putting it in the header nav would
                  say it was. It belongs exactly here — findable, at the bottom,
                  where a reader goes looking for it. */}
              <li>
                <Link
                  href="/privacy"
                  className="type-caption inline-flex min-h-11 items-center hover:text-ink"
                >
                  {t.footer.privacy}
                </Link>
              </li>
              <li>
                <LanguageToggle tone="footer" />
              </li>
            </ul>
          </nav>

          {/* Ownership, then authorship. Two lines rather than one: the
              copyright belongs to the house and the credit does not, and
              running them together would blur whose footer this is. The link
              takes the same min-h-11 target as every other control here. */}
          <div className="flex flex-col md:items-end md:text-right">
            <p className="type-caption">
              © {new Date().getFullYear()} {site.name}. {t.footer.rights}
            </p>
            <p className="type-caption">
              {t.footer.designedBy}{" "}
              <a
                href={site.credit.url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex min-h-11 items-center underline decoration-current/30 decoration-1 underline-offset-4 transition-colors duration-200 hover:text-ink hover:decoration-current"
              >
                {site.credit.studio}
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* The materials, one last time, as the very bottom edge of the page. */}
      <MaterialStrip height="0.375rem" />
    </footer>
  );
}
