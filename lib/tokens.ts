/**
 * A mirror of the colour tokens in app/globals.css, for the two places that
 * cannot read CSS custom properties:
 *
 *   1. HTML email — mail clients strip <style> and do not resolve var().
 *   2. The social card — Satori renders inline styles only.
 *
 * Everywhere else, use the Tailwind token classes. If a colour changes in
 * globals.css, change it here too.
 */
export const tokens = {
  paper: "#F7F2E8",
  lime: "#ECE2CF",
  stone: "#DDD2BD",
  ink: "#2A241D",
  inkSoft: "#5F574A",
  clay: "#A8492A",
  leaf: "#3F5940",
} as const;
