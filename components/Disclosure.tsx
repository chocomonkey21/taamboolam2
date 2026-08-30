import type { ReactNode } from "react";

/**
 * A disclosure, built on native <details>/<summary>.
 *
 * Native on purpose: it opens with no JavaScript, it is already in the tab
 * order, screen readers already announce its expanded state, and browser
 * find-in-page can open it to reveal a match. A custom button-and-region
 * version would have to re-earn all four.
 *
 * The rule for using one: the summary must name what is inside it. These are
 * for detail a reader may not need on a first pass — never for hiding copy
 * that the page is obliged to say plainly.
 */
export function Disclosure({
  label,
  children,
  className = "",
  tone = "rule",
}: {
  label: string;
  children: ReactNode;
  className?: string;
  /** "rule" sits on a hairline; "plain" carries no border of its own. */
  tone?: "rule" | "plain";
}) {
  return (
    <details
      className={`disclosure group ${
        tone === "rule" ? "rule-atmos border-t" : ""
      } ${className}`}
    >
      <summary className="type-label flex w-full cursor-pointer list-none items-center justify-between gap-4 py-4 text-left transition-colors duration-200 hover:text-atmos-accent">
        <span>{label}</span>
        {/* A hairline cross that becomes a minus. Drawn, not an icon font, and
            hidden from assistive tech — <details> already announces state. */}
        <span
          aria-hidden="true"
          className="relative block h-3 w-3 shrink-0 opacity-60"
        >
          <span className="absolute top-1/2 left-0 block h-px w-3 -translate-y-1/2 bg-current" />
          <span className="disclosure-tick absolute top-0 left-1/2 block h-3 w-px -translate-x-1/2 bg-current" />
        </span>
      </summary>

      <div className="disclosure-panel pb-6">{children}</div>
    </details>
  );
}
