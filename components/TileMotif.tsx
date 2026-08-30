/**
 * The Athangudi system.
 *
 * Athangudi tiles are poured by hand onto a glass plate, one at a time, and
 * laid in courses. They are a real material in this house — Floors 3 and 4 —
 * so the ornament and the building agree, and the ornament behaves the way the
 * material does: it is laid at a threshold, underfoot, and no two are quite
 * identical.
 *
 * What is deliberately NOT here any more: the dashed diamond rule the site
 * used between sections. It was a divider from a stationery set — a shape with
 * no relationship to this house at all — and it appeared five times a page.
 */

/**
 * The single tile. A four-petal centre in a square with quarter-arcs cut into
 * the corners, drawn slightly off-true on purpose: handmade tiles are not
 * identical and a perfectly regular figure would say the opposite of what the
 * house says.
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
 * A laid course of tiles.
 *
 * This is the site's one section boundary. Four different tiles in the repeat,
 * so a long run never locks into a machine grid, and its strength comes from
 * the surrounding atmosphere's `--atmos-pattern` rather than from a prop — on
 * Floors 1 and 2, which have no Athangudi tiles, it is almost invisible; on
 * Floors 3 and 4, which do, it is clearly laid. The pattern is not decoration
 * distributed evenly over the page; it is a material that appears where the
 * material actually is.
 */
export function TileCourse({
  className = "",
  /** "thin" is for a boundary inside a section rather than between two. */
  size = "full",
  /** Fades out at both ends, so it reads as a floor continuing past the frame. */
  fade = true,
}: {
  className?: string;
  size?: "full" | "thin";
  fade?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={`tile-course ${size === "thin" ? "tile-course-thin" : ""} ${
        fade ? "tile-course-fade" : ""
      } ${className}`}
    />
  );
}

/**
 * The material strip.
 *
 * Five bands of what the house is actually made of, in the order you meet them
 * climbing it: limewash and stone downstairs, wood through the middle, then
 * the ochre and indigo that arrive with the tiles on Floors 3 and 4. It is the
 * page's opening statement of the palette and the site's one animated moment —
 * the bands lay themselves in once, left to right, in half a second.
 *
 * Every band carries a label that is only ever read aloud or seen at width;
 * the strip is decoration, so it is hidden from assistive technology, and the
 * names exist for the owner reading the source, not for a visitor.
 */
const MATERIALS = [
  { name: "limewash", color: "var(--color-lime)" },
  { name: "stone", color: "var(--color-stone-deep)" },
  { name: "wood", color: "var(--color-wood)" },
  { name: "ochre", color: "var(--color-ochre)" },
  { name: "indigo", color: "var(--color-indigo)" },
] as const;

export function MaterialStrip({
  className = "",
  height = "0.5rem",
  /** Widths are deliberately unequal — a laid course, not a chart. */
  weights = [5, 3, 4, 6, 2],
}: {
  className?: string;
  height?: string;
  weights?: number[];
}) {
  return (
    <div
      aria-hidden="true"
      className={`flex w-full overflow-hidden ${className}`}
      style={{ height }}
    >
      {MATERIALS.map((material, index) => (
        <span
          key={material.name}
          className="swatch block h-full"
          style={
            {
              flex: `${weights[index] ?? 1} 1 0%`,
              backgroundColor: material.color,
              "--swatch-index": index,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
