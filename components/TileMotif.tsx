/**
 * Geometric motif — a four-petal centre inside a square, with quarter-arcs cut
 * into each corner. Drawn from an Athangudi tile, which was the agreed VISUAL
 * reference for this site. The tiles are not a feature of the homestay, so
 * this is ornament only: never write copy about tiles, craft or artisans.
 *
 * Used as a quiet signature — a hairline section divider, and a watermark on
 * photo placeholders. Never as a full-page pattern; that reads as wallpaper.
 */
export function TileGlyph({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect x="6" y="6" width="88" height="88" />
      <path d="M6 38a32 32 0 0 0 32-32M62 6a32 32 0 0 0 32 32M94 62a32 32 0 0 0-32 32M38 94A32 32 0 0 0 6 62" />
      <path d="M50 22c8 12 16 20 28 28-12 8-20 16-28 28-8-12-16-20-28-28 12-8 20-16 28-28Z" />
      <circle cx="50" cy="50" r="7" />
    </svg>
  );
}

/**
 * A hairline strip of the repeated tile line-motif, used only between major
 * sections. The motif is a CSS mask so its colour comes from a token rather
 * than being baked into the artwork. See `.tile-rule` in globals.css.
 */
export function TileDivider({
  tone = "primary",
  className = "",
}: {
  tone?: "primary" | "secondary";
  className?: string;
}) {
  return (
    <div className={`container-content ${className}`} role="presentation">
      <div
        className={`tile-rule ${
          tone === "primary" ? "bg-accent-primary" : "bg-accent-secondary"
        }`}
        aria-hidden="true"
      />
    </div>
  );
}
