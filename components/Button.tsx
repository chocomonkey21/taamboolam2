import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/**
 * Two actions and one link, and no third variant. The solid clay button is the
 * strongest thing on any screen and there is never more than one of it in view.
 */

const base =
  "type-label inline-flex items-center justify-center gap-2 rounded-sm px-7 py-3.5 text-center transition-[background-color,border-color,color,transform] duration-200 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60 disabled:active:translate-y-0";

const variants = {
  solid: "bg-clay text-paper hover:bg-clay-deep",
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
      className={`type-label text-clay underline decoration-clay/35 decoration-1 underline-offset-[7px] transition-colors duration-200 hover:decoration-clay ${className}`}
    >
      {children}
    </Link>
  );
}
