"use client";

import Link from "next/link";
import { NAV_ITEMS, site } from "@/lib/site";
import { ButtonLink } from "./Button";
import { LanguageToggle } from "./LanguageToggle";
import { useSite } from "./SiteProvider";
import { TileField } from "./TileMotif";
import { Wordmark } from "./Wordmark";

/**
 * Find Us — the closing scene of every page, not a page of its own and not a
 * drawer of links.
 *
 * It is composed as two halves that belong together: the last invitation on
 * the left, and the map with everything needed to actually arrive on the
 * right. The map is part of the composition rather than an embed dropped
 * underneath it — same panel, same hairline, same ground.
 */
export function Footer() {
  const { t } = useSite();

  /* inline-block + py is what lifts these inline links to a comfortable
     touch target; the text does not move, only the hit area grows. */
  const linkClass =
    "type-body inline-block py-1 text-ink-soft underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-200 hover:text-ink hover:decoration-current";

  const labels: Record<string, string> = {
    home: t.nav.home,
    experience: t.nav.experience,
    enquire: t.nav.enquire,
  };

  return (
    <footer
      className="texture-limewash relative mt-auto overflow-hidden"
      style={{ backgroundColor: "var(--color-lime)" }}
      data-atmosphere="house"
    >
      <TileField className="-top-16 -right-24 h-[380px] w-[380px]" opacity={0.1} />

      <div className="container-content section-rhythm relative">
        <div className="grid gap-14 md:grid-cols-12 md:gap-10">
          {/* ── The last invitation ───────────────────────────────────── */}
          <div className="md:col-span-5 md:pt-2">
            <p className="type-eyebrow">{t.footer.findUs}</p>
            <div className="mt-6">
              <Wordmark size="lg" asLink={false} />
            </div>
            <p className="type-lead mt-5 max-w-[26ch] text-ink-soft">
              {t.wordmarkContext}
            </p>
            <div className="mt-8">
              <ButtonLink href="/enquire">{t.cta.enquire}</ButtonLink>
            </div>
            <p className="type-caption mt-6 max-w-[44ch]">
              {t.footer.gatherings}
            </p>
          </div>

          {/* ── Arriving ──────────────────────────────────────────────── */}
          <div className="md:col-span-6 md:col-start-7">
            <div
              className="overflow-hidden rounded-md border"
              style={{ borderColor: "var(--color-stone)" }}
            >
              <iframe
                src={site.location.mapEmbed}
                title={t.footer.mapTitle}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-[240px] w-full border-0 sm:h-[280px]"
              />

              <div
                className="border-t p-6"
                style={{
                  borderColor: "var(--color-stone)",
                  backgroundColor: "var(--color-paper)",
                }}
              >
                <h2 className="type-eyebrow">{t.footer.address}</h2>
                <address className="type-body mt-4 not-italic">
                  {site.location.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
                <p className="type-body mt-3 text-ink-soft">
                  {t.footer.landmark}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
                  <a
                    href={site.location.mapLink}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={linkClass}
                  >
                    {t.footer.mapLink}
                  </a>
                  <a
                    href={`https://wa.me/${site.contact.whatsapp}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={linkClass}
                  >
                    {t.footer.whatsapp}
                  </a>
                  <a href={`mailto:${site.contact.email}`} className={linkClass}>
                    {t.footer.email}
                  </a>
                  <a
                    href={site.contact.instagram}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={linkClass}
                  >
                    {t.footer.instagram}
                  </a>
                </div>

                {site.location.mapLinkIsPlaceholder ? (
                  <p className="type-caption mt-4">{t.footer.mapPending}</p>
                ) : null}
              </div>
            </div>

            {/* Contact in full, under the panel it belongs to. */}
            <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-2">
              <li>
                <a
                  href={`https://wa.me/${site.contact.whatsapp}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={linkClass}
                >
                  {site.contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.contact.email}`} className={linkClass}>
                  {site.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── The base line ─────────────────────────────────────────────────
          pb-24 on small screens clears the persistent Enquire strip, which is
          fixed over the bottom of the viewport there. */}
      <div className="border-t" style={{ borderColor: "var(--color-stone)" }}>
        <div className="container-content flex flex-col gap-5 py-6 pb-24 md:flex-row md:items-center md:justify-between md:pb-6">
          <nav aria-label={t.footer.pages}>
            <ul className="flex flex-wrap items-center gap-x-7 gap-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="type-caption inline-block py-1.5 hover:text-ink"
                  >
                    {labels[item.key]}
                  </Link>
                </li>
              ))}
              <li>
                <LanguageToggle tone="footer" />
              </li>
            </ul>
          </nav>

          <div className="flex flex-col gap-1 md:items-end">
            <p className="type-caption">
              © {new Date().getFullYear()} {site.name}. {t.footer.rights}
            </p>
            <p className="type-caption">{t.footer.photographyNote}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
