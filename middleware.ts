import { NextResponse, type NextRequest } from "next/server";

/**
 * The Content-Security-Policy.
 *
 * The site had no security headers at all: no CSP, no frame protection, no
 * nosniff, no referrer policy. That was confirmed live rather than assumed —
 * the page loaded happily inside a cross-origin iframe served from another
 * port, which is clickjacking with nothing in the way of it.
 *
 * The policy is nonce-based rather than `'unsafe-inline'`. Next.js injects its
 * own inline bootstrap and streams RSC payloads as inline scripts, so the easy
 * version of this header is `script-src 'self' 'unsafe-inline'` — which is a
 * CSP that stops almost no XSS at all. Generating a nonce per request and
 * letting Next stamp it onto its own tags is the version that actually holds.
 *
 * `'strict-dynamic'` is what lets Next's bootstrap go on to load its chunks:
 * scripts loaded BY an already-trusted script inherit trust, so the chunk URLs
 * do not each need listing. Browsers that do not understand it fall back to the
 * host-source list, which is why `'self'` is still there.
 *
 * Two deliberate loosenings, both scoped as narrowly as the platform allows:
 *
 *  - `style-src` keeps `'unsafe-inline'`. This site sets real inline `style`
 *    attributes in a dozen components — scrims, atmosphere rings, the swatch
 *    widths — and Tailwind and Next both inject inline <style>. Nonces do not
 *    apply to style attributes at all, so the only alternative is rewriting
 *    every one of them into a class. Inline CSS is a far weaker vector than
 *    inline script, and this is the standard trade.
 *  - `img-src` allows `data:`, because the limewash, plaster and Athangudi
 *    textures are inline SVG data URIs in the stylesheet.
 *
 * Development needs more room than production: the dev overlay uses eval and
 * talks to a websocket. Those two allowances are gated on NODE_ENV so they
 * cannot reach a deployed build.
 */
function contentSecurityPolicy(nonce: string): string {
  const dev = process.env.NODE_ENV === "development";

  return [
    "default-src 'self'",
    // 'unsafe-eval' is dev-only: the Next dev overlay and Fast Refresh need it.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${dev ? "'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    // The dev server's HMR channel. Nothing else talks off-origin.
    `connect-src 'self'${dev ? " ws: wss:" : ""}`,
    "object-src 'none'",
    "base-uri 'self'",
    // The enquiry form posts to this origin and nowhere else.
    "form-action 'self'",
    // The footer map, and the only off-origin resource on the site. Narrowed
    // to the one host: without this line `default-src 'self'` blocks the frame
    // silently and the panel renders blank.
    "frame-src https://www.google.com",
    // The modern half of X-Frame-Options. Both are sent; older browsers read
    // only the header, newer ones prefer this.
    "frame-ancestors 'none'",
    "manifest-src 'self'",
    !dev ? "upgrade-insecure-requests" : "",
  ]
    .filter(Boolean)
    .join("; ");
}

export function middleware(request: NextRequest) {
  // 128 bits of randomness, base64'd. crypto.randomUUID would also do, but a
  // nonce wants to be opaque rather than structured.
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = contentSecurityPolicy(nonce);

  /* The nonce travels to the renderer on the REQUEST headers. Next reads
     `x-nonce` and stamps it onto the script tags it generates itself, which is
     what makes a nonce-based policy possible without hand-editing every tag. */
  const headers = new Headers(request.headers);
  headers.set("x-nonce", nonce);
  headers.set("content-security-policy", csp);

  const response = NextResponse.next({ request: { headers } });

  // And on the RESPONSE, where the browser will actually read it.
  response.headers.set("content-security-policy", csp);

  return response;
}

export const config = {
  matcher: [
    /**
     * Documents only.
     *
     * Static assets, the image optimiser and the favicon are excluded: they
     * are not documents, a CSP on them protects nothing, and running
     * middleware on every optimised image is a cost with no return. The API
     * route is excluded too — it answers JSON to same-origin fetches and gets
     * its headers from next.config.ts along with everything else.
     */
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
