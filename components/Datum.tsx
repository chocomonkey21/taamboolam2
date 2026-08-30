import type { ReactNode } from "react";

/**
 * A block drawn against the datum.
 *
 * The house is a stack, so the page is set against a level: a plumb line down
 * the left margin of the reading column, with short ticks reaching across to
 * notes written in the margin beside what they refer to.
 *
 * This replaces the eyebrow — the small uppercase label the site used to stack
 * above every single heading. Seven of those down one page is a table of
 * contents pretending to be a design, and each one pushed the actual heading
 * a line further from the top of its section. In the margin the same words
 * stop competing with the heading and start annotating it.
 *
 * Below md the line and the margin are dropped: a 22px gutter is an edge, not
 * a margin, and the note simply falls inline above the heading where it reads
 * as a quiet opening line.
 */
export function Datum({
  note,
  children,
  className = "",
}: {
  /** The margin note. Omit it and this is just a block on the datum line. */
  note?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`datum ${className}`}>
      {note ? <span className="type-annotation datum-note">{note}</span> : null}
      {children}
    </div>
  );
}
