"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { whatsappLink } from "@/lib/enquiry";
import { NAV_ITEMS, site } from "@/lib/site";
import { LanguageToggle } from "./LanguageToggle";
import { useSite } from "./SiteProvider";
import { Wordmark } from "./Wordmark";

/**
 * The header: two small plates on the wall, one at each end of the page.
 *
 * It used to be a single centred oval that hugged its contents — which meant a
 * translucent pill roughly 580px wide sat permanently over the MIDDLE of the
 * page. On a site whose reading column is centred, that is exactly where the
 * words are: captions, floor headings and body copy scrolled underneath it and
 * were unreadable for the whole time they passed behind it. It was the single
 * worst thing on the site and it was invisible in a static screenshot of the
 * top of a page.
 *
 * Splitting it fixes that outright — the middle of the viewport is now clear
 * from edge to edge — and it is also the better object: a nameplate by the
 * door and a small set of controls, rather than one floating capsule that
 * belongs to a web application.
 *
 * There is no hamburger. With three pages there is nothing worth hiding: on
 * small screens the plates keep the wordmark and the two links, and Enquire
 * lives in a persistent strip at the bottom of the screen where a thumb is.
 */
export function Nav() {
  const pathname = usePathname();
  const { t } = useSite();
  const [scrolled, setScrolled] = useState(false);
  const [retracted, setRetracted] = useState(false);

  const isHome = pathname === "/";

  /**
   * Two pieces of state from one listener.
   *
   * `scrolled` settles the plates onto a ground once the page has moved.
   *
   * `retracted` lifts them out of the way while the reader is going down the
   * page, and puts them back the moment the reader goes up. A fixed header
   * covers content by definition, and on a page whose reading column starts at
   * the container's own left edge the nameplate lands squarely on the first
   * words of every heading it passes. Retracting is the only fix that does not
   * involve making the header worse: while you are reading it is not there,
   * and the instant you look for it — which is an upward flick — it is.
   *
   * It never retracts near the top of the page, so the header a reader arrives
   * to is always present, and never under reduced motion, where a control that
   * comes and goes is a nuisance rather than an accommodation.
   */
  useEffect(() => {
    const mayRetract = !window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    let last = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 56);
      if (mayRetract) {
        // A small threshold, so a trackpad's jitter at rest does not flicker it.
        if (Math.abs(y - last) > 8) {
          setRetracted(y > last && y > 240);
          last = y;
        }
      }
    };

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

  const plate = `nav-plate rounded-full border ${
    overHero ? "text-paper" : "text-ink"
  }`;
  const plateState = {
    "data-scrolled": scrolled ? "true" : "false",
    "data-over-hero": overHero ? "true" : "false",
  } as const;

  return (
    <header
      data-retracted={retracted ? "true" : "false"}
      className="nav-header pointer-events-none fixed inset-x-0 top-0 z-50 pt-3 sm:pt-5"
    >
      <div className="container-content">
        <nav
          aria-label={t.nav.mainLabel}
          className="flex items-center justify-between gap-3"
        >
          {/* ── The nameplate ─────────────────────────────────────────── */}
          <div
            {...plateState}
            className={`${plate} pointer-events-auto px-4 py-2 sm:px-5 sm:py-2.5`}
          >
            <Wordmark />
          </div>

          {/* ── The controls ──────────────────────────────────────────── */}
          <div
            {...plateState}
            className={`${plate} pointer-events-auto flex items-center gap-1 py-1 pr-2 pl-2 sm:gap-3 sm:py-2 sm:pr-2 sm:pl-5`}
          >
            {/* gap-4 until lg: at exactly 768 the old gap-5 pushed the plate
                past the space it had and "The Experience" wrapped onto a
                second line, turning a small object on the wall into a tall
                lozenge. Measured, not guessed — the link reported 75x49 at
                768 and 104x21 at 1024. */}
            <ul className="hidden items-center gap-4 md:flex lg:gap-5">
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
                      className={`type-label tap-target border-b pb-0.5 whitespace-nowrap transition-colors duration-200 ${
                        active
                          ? "border-current/60"
                          : "border-transparent opacity-75 hover:opacity-100"
                      }`}
                    >
                      {labels[item.key]}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* On small screens the one page a reader might be looking for.
                whitespace-nowrap is load-bearing: the plate is sized by its
                contents, and at 390px "The Experience" wrapped to two lines,
                which turned a small object on the wall into a tall lozenge
                nearly touching the nameplate. */}
            <Link
              href="/experience"
              aria-current={
                pathname.startsWith("/experience") ? "page" : undefined
              }
              className="type-label inline-flex min-h-11 items-center px-1.5 whitespace-nowrap opacity-80 transition-opacity duration-200 hover:opacity-100 md:hidden"
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
              className="btn btn-solid type-label hidden min-h-11 items-center rounded-full bg-clay px-5 text-paper hover:bg-clay-deep md:inline-flex"
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
  const isHome = pathname === "/";
  // The home hero already carries its own "Enquire about a stay" button. Until
  // a reader scrolls past it, showing this bar too means the same words twice
  // on one screen — a duplication, not a helpful reminder.
  const [pastHero, setPastHero] = useState(!isHome);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // On the enquiry page itself the form is the action.
  if (pathname.startsWith("/enquire")) return null;
  if (!pastHero) return null;

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
        {/* Two ways to start, because on a phone in India they are genuinely
            two ways and not a primary and a fallback. WhatsApp used to appear
            only on the enquiry page, which meant somebody browsing on a phone
            never saw the option they were most likely to want — they had to
            find the form first to be told they did not have to fill it in.

            The form keeps the solid button: it is the one that carries dates
            and numbers, and it is what the owner would rather receive.
            WhatsApp sits beside it as an outline, and opens with one line
            already written so nobody faces an empty chat.

            The labels shorten here. "Enquire about a stay" and "WhatsApp"
            together overflow a 375px bar once the language toggle is in it,
            and a wrapped action bar reads as a bug. */}
        <div className="flex items-center gap-2.5">
          <span className="sm:hidden">
            <LanguageToggle />
          </span>

          <a
            href={whatsappLink(site.contact.whatsapp, t.nav.whatsappOpener)}
            target="_blank"
            rel="noreferrer noopener"
            className="btn type-label ml-auto inline-flex min-h-11 items-center rounded-full border border-stone-deep px-4 text-ink active:bg-lime"
          >
            {t.footer.whatsapp}
          </a>

          <Link
            href="/enquire"
            className="btn btn-solid type-label inline-flex min-h-11 items-center rounded-full bg-clay px-5 text-paper active:bg-clay-deep"
          >
            {t.nav.enquire}
          </Link>
        </div>
      </div>
    </div>
  );
}
