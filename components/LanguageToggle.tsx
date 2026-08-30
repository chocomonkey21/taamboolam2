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
      className={`inline-flex items-center rounded-full border border-current/25 p-0.5 ${className}`}
      role="group"
      aria-label={t.languageLabel}
    >
      {(["en", "kn"] as const).map((code) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            lang={code}
            onClick={() => setLocale(code)}
            aria-pressed={active}
            className={`type-label inline-flex items-center justify-center rounded-full leading-none transition-colors duration-200 ${size} ${
              active
                ? "bg-current/[0.14] font-medium"
                : "opacity-65 hover:opacity-100"
            }`}
          >
            {content[code].localeName}
          </button>
        );
      })}
    </div>
  );
}
