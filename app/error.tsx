"use client";

import { useEffect } from "react";
import { ButtonLink } from "@/components/Button";
import { TileGlyph } from "@/components/TileMotif";

/**
 * The page that appears when a route throws.
 *
 * There was no error boundary at all before this — an unhandled render error
 * fell through to the framework's own screen, which belongs to Next rather than
 * to this house and offers no way back into it.
 *
 * Two rules it holds to:
 *
 *  - It shows the reader nothing about the failure. No message, no stack, no
 *    digest. The `error` object is deliberately not rendered: in development it
 *    carries a stack, and a screen that prints one is a screen that will
 *    eventually print one in production.
 *  - It offers the two things that are actually useful from here — the way home
 *    and a way to reach a person — rather than only a retry.
 *
 * Copy is hardcoded English. This file renders when something has already gone
 * wrong, and reaching into the locale provider is exactly the kind of extra
 * moving part that turns an error screen into a second error.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    /* The digest is the framework's own correlation id — a short hash, not the
       message and not the stack. Enough to find the matching server log, and it
       carries nothing a guest typed. */
    console.error("A page failed to render.", { digest: error.digest });
  }, [error]);

  return (
    <section
      className="texture-limewash relative bg-atmos"
      data-atmosphere="house"
    >
      <div className="container-content flex min-h-[70svh] flex-col justify-center pt-32 pb-20 sm:pt-40">
        <div className="datum max-w-[46rem]">
          <span className="type-annotation datum-note">Something broke</span>
          <TileGlyph className="w-9 text-clay opacity-40" />
          <h1 className="type-h1 mt-7">This page did not load</h1>
          <p className="type-lead measure mt-5 text-ink-soft">
            Not something you did. Try again, and if it keeps happening, write
            to us and we will sort it out.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <button
              type="button"
              onClick={reset}
              className="btn btn-solid type-label inline-flex items-center justify-center rounded-full bg-clay px-7 py-3.5 text-paper hover:bg-clay-deep"
            >
              Try again
            </button>
            <ButtonLink href="/" variant="outline">
              Back to the beginning
            </ButtonLink>
          </div>

          <p className="type-caption mt-8">
            <a
              href="mailto:taamboolaminn@gmail.com"
              className="underline decoration-transparent underline-offset-4 transition-colors hover:text-ink hover:decoration-current"
            >
              taamboolaminn@gmail.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
