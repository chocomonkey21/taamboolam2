/**
 * Shown while a route is being rendered on the server.
 *
 * Every page here is per-request (the locale cookie makes them dynamic), so on
 * a slow connection there is a real gap before anything paints. This fills it
 * with the house's own ground rather than white, and holds the space the
 * header will occupy so nothing jumps when the page arrives.
 *
 * Deliberately not a skeleton of boxes: a shimmering wireframe of a page that
 * has not loaded is a SaaS convention, and it would be the least quiet thing
 * on the site. Warm paper and the wordmark's own tile mark, breathing gently,
 * says the same thing without pretending to be content.
 */
export default function Loading() {
  return (
    <div
      className="flex min-h-[70svh] items-center justify-center"
      style={{ backgroundColor: "var(--color-paper)" }}
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Loading</span>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.1}
        aria-hidden="true"
        className="loading-mark w-10 text-clay"
      >
        <rect x="6" y="6" width="88" height="88" />
        <path d="M6 38a32 32 0 0 0 32-32M62 6a32 32 0 0 0 32 32M94 62a32 32 0 0 0-32 32M38 94A32 32 0 0 0 6 62" />
        <circle cx="50" cy="50" r="7" />
      </svg>
    </div>
  );
}
