"use client";

import { useEffect } from "react";

/**
 * The last resort: the root layout itself failed.
 *
 * This replaces the entire document, so it has to supply its own <html> and
 * <body>. Nothing from the app is available — not the fonts, not the design
 * tokens, not the providers — because whatever broke may be one of them. The
 * styles below are therefore inline and self-contained, and they are the only
 * place in this project where that is the right call.
 *
 * Colours are the house's own, written literally: paper, ink and clay. A blank
 * white browser error page is the one screen that would look like it belongs to
 * a different site entirely.
 *
 * As in app/error.tsx, nothing about the failure is shown to the reader.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("The root layout failed to render.", { digest: error.digest });
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7f2e8",
          color: "#2a241d",
          fontFamily: "Georgia, 'Times New Roman', serif",
          padding: "24px",
        }}
      >
        <main style={{ maxWidth: "34rem" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Taamboolam
          </h1>
          <p
            style={{
              margin: "20px 0 0",
              fontSize: "1.0625rem",
              lineHeight: 1.6,
              color: "#5f574a",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            The site failed to load. Please try again in a moment — or write to
            us and we will answer.
          </p>

          <div
            style={{
              marginTop: "32px",
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              alignItems: "center",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                appearance: "none",
                border: 0,
                borderRadius: "999px",
                background: "#a8492a",
                color: "#f7f2e8",
                fontSize: "0.9375rem",
                fontWeight: 500,
                padding: "14px 28px",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <a
              href="mailto:taamboolaminn@gmail.com"
              style={{ color: "#883418", fontSize: "0.9375rem" }}
            >
              taamboolaminn@gmail.com
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
