"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_ITEMS } from "@/lib/site";
import { LanguageToggle } from "./LanguageToggle";
import { useSite } from "./SiteProvider";
import { Wordmark } from "./Wordmark";

/**
 * A floating oval header.
 *
 * Over the home page's hero it is transparent and light, so the photograph is
 * uninterrupted. As soon as the page moves it settles onto a warm, slightly
 * translucent ground. Enquire is the only filled control anywhere in it.
 *
 * There is no hamburger. With three pages there is nothing worth hiding: on
 * small screens the header keeps the wordmark and the language, and Enquire
 * lives in a persistent strip at the bottom of the screen where a thumb is.
 */
export function Nav() {
  const pathname = usePathname();
  const { t } = useSite();
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 56);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Light type only while floating over the hero photograph.
  const overHero = isHome && !scrolled;

  const labels: Record<string, string> = {
    home: t.nav.home,
    experience: t.nav.experience,
    enquire: t.nav.enquire,
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 pt-3 sm:pt-5">
      <div className="container-content">
        <nav
          aria-label={t.nav.mainLabel}
          data-scrolled={scrolled ? "true" : "false"}
          data-over-hero={overHero ? "true" : "false"}
          /* The oval hugs its contents and centres, rather than stretching the
             full width — a bar pinned to both edges is a chrome, and this is
             meant to read as an object floating over the photograph. On small
             screens it still spans, because there it genuinely is the width of
             the content. */
          className={`nav-shell pointer-events-auto mx-auto flex w-full items-center justify-between gap-4 rounded-full border py-2 pr-2 pl-4 sm:w-fit sm:gap-8 sm:py-2.5 sm:pr-2.5 sm:pl-7 ${
            overHero ? "text-paper" : "text-ink"
          }`}
        >
          <Wordmark />

          <div className="flex items-center gap-1 sm:gap-4">
            <ul className="hidden items-center gap-5 md:flex">
              {NAV_ITEMS.filter((item) => item.key !== "enquire").map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`type-label border-b pb-0.5 transition-colors duration-200 ${
                        active
                          ? "border-current/60"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      {labels[item.key]}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* On small screens the one page a reader might be looking for. */}
            <Link
              href="/experience"
              aria-current={
                pathname.startsWith("/experience") ? "page" : undefined
              }
              className="type-label border-b border-transparent pb-0.5 opacity-75 transition-opacity duration-200 hover:opacity-100 md:hidden"
            >
              {t.nav.experience}
            </Link>

            {/* Wrapped, not given a `hidden` class of its own: LanguageToggle
                already sets display, and two display utilities on one element
                are decided by stylesheet order rather than by intent. */}
            <span className="hidden sm:block">
              <LanguageToggle />
            </span>

            <Link
              href="/enquire"
              aria-current={pathname.startsWith("/enquire") ? "page" : undefined}
              className="type-label hidden rounded-full bg-clay px-5 py-2.5 text-paper transition-colors duration-200 hover:bg-clay-deep md:inline-flex"
            >
              {t.nav.enquire}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

/**
 * The mobile Enquire action. A quiet strip along the bottom rather than a
 * floating circle — it names what it does, and it never covers content it is
 * sitting on because the page reserves space for it.
 */
export function MobileEnquire() {
  const pathname = usePathname();
  const { t } = useSite();

  // On the enquiry page itself the form is the action.
  if (pathname.startsWith("/enquire")) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 md:hidden">
      <div
        className="pointer-events-auto border-t px-4 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]"
        style={{
          borderColor: "var(--color-stone)",
          backgroundColor: "color-mix(in srgb, var(--color-paper) 94%, transparent)",
          backdropFilter: "saturate(1.1) blur(12px)",
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="sm:hidden">
            <LanguageToggle />
          </span>
          <Link
            href="/enquire"
            className="type-label ml-auto rounded-full bg-clay px-5 py-2.5 text-paper transition-colors duration-200 active:bg-clay-deep"
          >
            {t.nav.mobileEnquire}
          </Link>
        </div>
      </div>
    </div>
  );
}
