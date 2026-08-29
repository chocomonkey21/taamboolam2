import Link from "next/link";
import { nav, site } from "@/lib/site";
import { TileGlyph } from "./TileMotif";
import { Wordmark } from "./Wordmark";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-content grid gap-12 py-16 sm:py-20 md:grid-cols-12 md:gap-6 lg:gap-8">
        <div className="md:col-span-5">
          <Wordmark />
          <p className="type-body mt-5 max-w-[38ch] text-foreground-muted">
            {site.tagline}
          </p>
          <TileGlyph className="mt-8 w-10 text-accent-primary opacity-30" />
        </div>

        <div className="md:col-span-3 md:col-start-7">
          <h2 className="type-eyebrow">Pages</h2>
          <ul className="mt-5 space-y-3">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="type-body text-foreground-muted transition-colors duration-200 hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <h2 className="type-eyebrow">Reach us</h2>
          <ul className="mt-5 space-y-3">
            <li>
              <a
                href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
                className="type-body text-foreground-muted transition-colors duration-200 hover:text-foreground"
              >
                {site.contact.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.contact.email}`}
                className="type-body break-all text-foreground-muted transition-colors duration-200 hover:text-foreground"
              >
                {site.contact.email}
              </a>
            </li>
            <li className="type-body text-foreground-muted">
              {site.location.area}, {site.location.region}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-content flex flex-col gap-2 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="type-caption text-foreground-muted">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="type-caption text-foreground-muted">
            A few rooms in a family house, on a quiet Jayanagar street.
          </p>
        </div>
      </div>
    </footer>
  );
}
