"use client";

import Link from "next/link";
import { NAV_ITEMS, site } from "@/lib/site";
import { ButtonLink } from "./Button";
import { LanguageToggle } from "./LanguageToggle";
import { useSite } from "./SiteProvider";
import { TileField, TileRule } from "./TileMotif";
import { Wordmark } from "./Wordmark";

/**
 * Find Us — the closing section of every page, not a page of its own.
 *
 * It carries the address, the ways to reach a person, the language choice, and
 * the last invitation. It is the only place on the site where the wordmark is
 * set large.
 */
export function Footer() {
  const { t } = useSite();

  const linkClass =
    "type-body text-ink-soft underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-200 hover:text-ink hover:decoration-current";

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

      <div className="container-content relative section-rhythm">
        {/* The last invitation ------------------------------------------- */}
        <div className="measure">
          <p className="type-eyebrow">{t.footer.findUs}</p>
          <div className="mt-6">
            <Wordmark size="lg" asLink={false} />
          </div>
          <p className="type-lead mt-5 text-ink-soft">{t.wordmarkContext}</p>
          <div className="mt-8">
            <ButtonLink href="/enquire">{t.cta.enquire}</ButtonLink>
          </div>
          <p className="type-caption mt-5 max-w-[52ch]">{t.footer.gatherings}</p>
        </div>

        <TileRule className="my-12 md:my-16" />

        {/* The details ---------------------------------------------------- */}
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <section className="md:col-span-5">
            <h2 className="type-eyebrow">{t.footer.findUs}</h2>
            <address className="type-body mt-5 not-italic">
              {site.location.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            <p className="type-body mt-3 text-ink-soft">{t.footer.landmark}</p>
            <p className="mt-5">
              <a
                href={site.location.mapLink}
                target="_blank"
                rel="noreferrer noopener"
                className={linkClass}
              >
                {t.footer.mapLink}
              </a>
            </p>
            {site.location.mapLinkIsPlaceholder ? (
              <p className="type-caption mt-2">{t.footer.mapPending}</p>
            ) : null}
          </section>

          <section className="md:col-span-4">
            <h2 className="type-eyebrow">{t.footer.reachUs}</h2>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href={`https://wa.me/${site.contact.whatsapp}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={linkClass}
                >
                  {t.footer.whatsapp} — {site.contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.contact.email}`} className={linkClass}>
                  {site.contact.email}
                </a>
              </li>
              <li>
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
          </section>

          <nav className="md:col-span-3" aria-label={t.footer.pages}>
            <h2 className="type-eyebrow">{t.footer.pages}</h2>
            <ul className="mt-5 space-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {labels[item.key]}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <h2 className="type-eyebrow">{t.languageLabel}</h2>
              <LanguageToggle className="mt-4" tone="footer" />
            </div>
          </nav>
        </div>
      </div>

      <div className="border-t" style={{ borderColor: "var(--color-stone)" }}>
        <div className="container-content flex flex-col gap-2 py-6 pb-24 md:flex-row md:items-center md:justify-between md:pb-6">
          <p className="type-caption">
            © {new Date().getFullYear()} {site.name}. {t.footer.rights}
          </p>
          <p className="type-caption">{t.footer.photographyNote}</p>
        </div>
      </div>
    </footer>
  );
}
