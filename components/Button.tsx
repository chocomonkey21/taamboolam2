import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

const base =
  "type-label inline-flex items-center justify-center rounded-sm px-8 py-4 transition-colors duration-200";

const variants = {
  /** Solid terracotta. One per screen — see the rule of restraint. */
  solid:
    "bg-accent-primary text-background hover:bg-accent-primary-dark disabled:opacity-60",
  /** Hairline outline, for the secondary action next to a solid one. */
  outline:
    "border border-border text-foreground hover:border-foreground-muted hover:bg-surface",
} as const;

type Variant = keyof typeof variants;

export function ButtonLink({
  href,
  children,
  variant = "solid",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
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

/** Quiet inline link with a terracotta underline. */
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
      className={`type-label text-accent-primary underline decoration-accent-primary/40 decoration-1 underline-offset-[6px] transition-colors duration-200 hover:decoration-accent-primary ${className}`}
    >
      {children}
    </Link>
  );
}
