/**
 * The tile motif — a four-petal centre in a square, with quarter-arcs cut into
 * the corners. Drawn from Athangudi tile traditions, which are a real material
 * in this house (Floors 3 and 4), so the ornament and the building agree.
 *
 * It is drawn slightly off-true on purpose. Handmade tiles are not identical
 * and a perfectly regular field would say the opposite of what the house says.
 */
export function TileGlyph({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect x="6" y="5.5" width="88" height="89" />
      <path d="M6 37.5a31.5 31.5 0 0 0 31.5-32M62.5 5.5A32 32 0 0 0 94 38M94 62a32 32 0 0 0-31.5 32.5M37.5 94.5A31 31 0 0 0 6 62.5" />
      <path d="M50.5 21.5c7.8 12.2 15.8 20 28 28-12.2 8-20.2 15.8-28 28-8-12.2-16-20-28-28 12-8 20-15.8 28-28Z" />
      <circle cx="50" cy="49.5" r="7.2" />
    </svg>
  );
}

/**
 * A hairline rule carrying a slice of the motif. Used between major sections.
 * The artwork is a CSS mask, so its colour always comes from a token.
 */
export function TileRule({
  className = "",
  tone = "rule",
}: {
  className?: string;
  /** "rule" follows the current atmosphere; "accent" is deliberately louder. */
  tone?: "rule" | "accent";
}) {
  return (
    <div
      className={`tile-rule ${className}`}
      style={{
        backgroundColor:
          tone === "accent" ? "var(--atmos-accent)" : "var(--atmos-rule)",
        opacity: tone === "accent" ? 0.55 : 0.85,
      }}
      aria-hidden="true"
    />
  );
}

/**
 * A soft-edged field of the pattern, for the corner of a section. Never behind
 * body text, and never at full strength — it is a watermark, not wallpaper.
 */
export function TileField({
  className = "",
  opacity = 0.09,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className={`tile-field pointer-events-none absolute ${className}`}
      style={{
        opacity,
        color: "var(--atmos-accent)",
        backgroundBlendMode: "multiply",
        maskImage:
          "radial-gradient(ellipse at center, rgb(0 0 0 / 1), transparent 72%)",
        WebkitMaskImage:
          "radial-gradient(ellipse at center, rgb(0 0 0 / 1), transparent 72%)",
      }}
    />
  );
}
