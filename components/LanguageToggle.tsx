"use client";

import { content } from "@/lib/content";
import { useSite } from "./SiteProvider";

/**
 * English / ಕನ್ನಡ, both spelled out in full. A two-letter code would be smaller
 * and worse: a reader looking for their own language should see their own
 * language, written the way they write it.
 *
 * The choice is remembered in a cookie, which is also what lets the server
 * render the right language on the next visit without a flash.
 */
export function LanguageToggle({
  className = "",
  tone = "quiet",
}: {
  className?: string;
  /** "quiet" for the header, "footer" for the larger footer treatment. */
  tone?: "quiet" | "footer";
}) {
  const { locale, setLocale, t } = useSite();

  /* min-h-11 rather than padding alone: the toggle is the one control on the
     site a reader may hit before they have read anything, and at py-1.5 it was
     a 30px target. The label does not move; only the hit area grows. */
  const size =
    tone === "footer"
      ? "min-h-11 px-4 text-[14px]"
      : "min-h-11 px-3.5 text-[13px]";

  return (
    <div
      /* inline-grid with two equal columns, so the indicator below can be
         exactly half the track and travel exactly its own width. An
         inline-flex row sized to each label would need measuring in JS,
         and "English" and "ಕನ್ನಡ" are not the same width. */
      className={`relative isolate inline-grid grid-cols-2 items-center rounded-full border border-current/25 p-0.5 ${className}`}
      role="group"
      aria-label={t.languageLabel}
    >
      {/* The indicator. Purely decorative — the buttons carry aria-pressed,
         so a screen reader never depends on this. */}
      <span
        aria-hidden="true"
        data-at={locale}
        className="lang-indicator absolute inset-y-0.5 left-0.5 -z-10 w-[calc(50%-0.125rem)] rounded-full bg-current/[0.14]"
      />
      {(["en", "kn"] as const).map((code) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            lang={code}
            onClick={() => setLocale(code)}
            aria-pressed={active}
            /* The background moved to the shared indicator above; what is
               left here is only the type's own weight and opacity. */
            className={`type-label inline-flex items-center justify-center rounded-full leading-none transition-[opacity,font-weight] duration-200 ${size} ${
              active ? "font-medium" : "opacity-65 hover:opacity-100"
            }`}
          >
            {content[code].localeName}
          </button>
        );
      })}
    </div>
  );
}
