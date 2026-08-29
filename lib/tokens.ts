/**
 * A mirror of the colour tokens in `app/globals.css`, for the two places that
 * cannot read CSS custom properties:
 *
 *   1. HTML email — mail clients strip <style> and do not resolve var().
 *   2. The OG image — Satori renders inline styles only.
 *
 * Everywhere else, use the Tailwind token classes. If a colour changes in
 * globals.css, change it here too.
 */
export const tokens = {
  background: "#FAF6EF",
  surface: "#F1EADC",
  foreground: "#2B2622",
  foregroundMuted: "#6B6255",
  accentPrimary: "#A64B2A",
  accentSecondary: "#37503F",
  border: "#DDD2BE",
} as const;
