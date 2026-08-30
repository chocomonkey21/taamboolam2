import { en } from "./en";
import { kn } from "./kn";
import type { Content, Locale } from "./types";

export const content: Record<Locale, Content> = { en, kn };

export const LOCALES: Locale[] = ["en", "kn"];

/** Name of the cookie the language choice is remembered in. */
export const LOCALE_COOKIE = "taamboolam-locale";

export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "kn";
}

/** The value for the html lang attribute. */
export const HTML_LANG: Record<Locale, string> = { en: "en-IN", kn: "kn-IN" };

export type { Content, Locale, FloorId } from "./types";
