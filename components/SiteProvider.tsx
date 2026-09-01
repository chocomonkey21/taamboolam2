"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  content,
  HTML_LANG,
  LOCALE_COOKIE,
  type Content,
  type Locale,
} from "@/lib/content";

/**
 * Language and photography availability, for the whole site.
 *
 * The locale is seeded on the server from a cookie, so a returning Kannada
 * reader gets Kannada in the very first byte of HTML — no flash, no hydration
 * mismatch. Switching afterwards is instant React state, and the cookie is
 * rewritten so the choice survives the next visit.
 */

type SiteValue = {
  locale: Locale;
  t: Content;
  setLocale: (next: Locale) => void;
  /** Which photo files have actually landed. Read once on the server. */
  photoManifest: Record<string, boolean>;
};

const SiteContext = createContext<SiteValue | null>(null);

const ONE_YEAR = 60 * 60 * 24 * 365;

export function SiteProvider({
  initialLocale,
  photoManifest,
  children,
}: {
  initialLocale: Locale;
  photoManifest: Record<string, boolean>;
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      /* Secure only when the page itself is on HTTPS: setting it on plain
         http://localhost would make the cookie unsettable in development, and
         the flag means nothing there anyway. The value is a language choice
         rather than a credential, but there is no reason to let it travel in
         clear once the site is served over TLS. */
      const secure = window.location.protocol === "https:" ? ";secure" : "";
      document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=${ONE_YEAR};samesite=lax${secure}`;
    } catch {
      // Cookies blocked. The choice still applies for this visit.
    }
  }, []);

  // Keep the document language honest for screen readers and for the browser's
  // own hyphenation and font selection.
  useEffect(() => {
    document.documentElement.lang = HTML_LANG[locale];
  }, [locale]);

  const value = useMemo<SiteValue>(
    () => ({ locale, t: content[locale], setLocale, photoManifest }),
    [locale, setLocale, photoManifest],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite(): SiteValue {
  const value = useContext(SiteContext);
  if (!value) {
    throw new Error("useSite must be used inside SiteProvider.");
  }
  return value;
}

/** Shorthand for the common case: just the copy for the current language. */
export function useCopy(): Content {
  return useSite().t;
}
