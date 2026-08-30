import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/**
 * Two actions and one link, and no third variant. The solid clay button is the
 * strongest thing on any screen and there is never more than one of it in view.
 *
 * Pill-shaped (rounded-full) to match the nav's own Enquire control, which was
 * the one button on the site already built that way. A button had two
 * different corner treatments depending on where it happened to sit; this is
 * the one place that decides the shape for both.
 */
/**
 * `btn` carries the easing and the press feedback — see globals.css.
 *
 * Two things it fixes. The transition used Tailwind's default curve, which has
 * an ease-in front half: it delays the first moment of movement, which is
 * exactly the moment a reader is watching after a click. The site already
 * defines a proper ease-out and this now uses it. And the press was
 * `translate-y-px` — a one-pixel nudge, below the threshold at which a person
 * registers that the interface heard them. A small scale is what reads as a
 * press.
 */
const base =
  "btn type-label inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-center disabled:cursor-not-allowed disabled:opacity-60";

const variants = {
  /* The solid button is clay on clay when focused, so it takes a paper ring
     instead of the global clay one — otherwise the focus indicator disappears
     into the button it is indicating. */
  solid: "btn-solid bg-clay text-paper hover:bg-clay-deep",
  outline:
    "border border-current/35 hover:border-current/70 hover:bg-current/[0.06]",
} as const;

type Variant = keyof typeof variants;

export function ButtonLink({
  href,
  children,
  variant = "solid",
  className = "",
  ...rest
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">) {
  return (
    <Link
      href={href}
      className={`${base} ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
}

export function Button({
  children,
  variant = "solid",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

/** A quiet inline link with a clay underline that fills in on hover. */
export function TextLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`type-label inline-flex min-h-11 items-center text-clay-deep underline decoration-clay-deep/35 decoration-1 underline-offset-[7px] transition-colors duration-200 hover:decoration-clay-deep ${className}`}
    >
      {children}
    </Link>
  );
}
