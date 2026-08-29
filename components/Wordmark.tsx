import Link from "next/link";

/**
 * The name, set in Fraunces with open tracking. Deliberately plain — the
 * wordmark should read as a nameplate on a house, not a logo on a product.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`font-heading text-[19px] leading-none font-medium tracking-[0.18em] text-foreground uppercase transition-colors duration-200 hover:text-accent-primary sm:text-[21px] ${className}`}
    >
      Taamboolam
    </Link>
  );
}
