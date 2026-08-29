"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/lib/site";
import { Wordmark } from "./Wordmark";

/**
 * Three pages, so there is no menu to open. Wordmark left, links right on
 * desktop; wordmark over links on mobile. No hamburger, no overlay.
 */
export function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <nav
        aria-label="Main"
        className="container-content flex flex-col items-center gap-3 py-4 sm:flex-row sm:justify-between sm:gap-8 sm:py-5"
      >
        <Wordmark />
        <ul className="flex items-center gap-6 sm:gap-8">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`type-caption pb-1 transition-colors duration-200 sm:text-[15px] ${
                    active
                      ? "border-b border-accent-primary text-foreground"
                      : "border-b border-transparent text-foreground-muted hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
