import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

/**
 * The project root, resolved from this file rather than from process.cwd().
 *
 * Next.js normally runs with the project as the working directory, but it does
 * not have to — `next dev <dir>` and some process managers start it elsewhere,
 * and then anything built on process.cwd() silently resolves to the wrong
 * place.
 */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/**
 * The list of files actually present in public/images, read once here — while
 * this config file is evaluated by Node on the machine doing the build — and
 * baked into the app as a literal string.
 *
 * This used to be a plain `fs.readdirSync("public/images")` call inside the
 * app itself, run again on every request. That worked in dev and on a normal
 * Node server, and it silently broke on Vercel: a serverless function ships
 * only the files its bundler can prove it needs, and it proves that by
 * statically tracing `fs`/`require` calls with literal paths. A path built at
 * runtime from an env var is invisible to that trace, so `public/images` was
 * never included in the deployed function, the read threw ENOENT, and every
 * photograph on the live site fell back to its placeholder — nothing was
 * actually missing, the manifest just came back empty on every request.
 *
 * Reading the directory here instead, at build time, sidesteps the tracer
 * entirely: by the time the app runs, this is just a string literal baked
 * into the bundle by Next's `env` inlining, the same mechanism NEXT_PUBLIC_*
 * variables use. There is no fs call left for anything to fail to trace.
 *
 * The cost is that adding a photo now requires a rebuild to be picked up
 * (`next dev` included — restart it after dropping a file in), where the old
 * approach re-read the directory on every request in development. Given the
 * alternative was photos silently vanishing in production, that trade is the
 * right one.
 */
function readImageFileList(): string {
  try {
    return JSON.stringify(
      fs.readdirSync(path.join(projectRoot, "public", "images")),
    );
  } catch {
    return "[]";
  }
}

/**
 * The security headers that do not need a per-request value.
 *
 * The Content-Security-Policy is NOT here — it carries a nonce and so has to
 * be built per request, which is middleware.ts's whole job. Everything below
 * is constant, so it is set here instead, where it also covers the API route
 * and anything else middleware's matcher skips.
 *
 * None of these existed before. Verified by reading the live response, not by
 * assuming: the site was answering with no frame protection, no nosniff and no
 * referrer policy at all.
 */
const securityHeaders = [
  /* Belt to the CSP's frame-ancestors brace. Older browsers read only this
     one, and the site was demonstrably framable without it. */
  { key: "X-Frame-Options", value: "DENY" },
  /* Stop a browser second-guessing a Content-Type. Matters most for the
     owner-facing JSON and Markdown under /images. */
  { key: "X-Content-Type-Options", value: "nosniff" },
  /* Send the full URL to ourselves, only the origin to anyone else, and
     nothing at all when leaving HTTPS. The outbound links here are WhatsApp,
     Instagram and Google Maps; none of them needs our paths. */
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  /* This site asks for no device permissions whatsoever. Say so, so that
     injected content cannot ask on its behalf either. */
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), interest-cohort=()",
  },
  /* Ignored over plain HTTP, so it is inert in local development and takes
     effect only once the site is served over TLS. Two years, subdomains
     included. Preloading is deliberately NOT claimed here: submitting a domain
     to the preload list is close to irreversible and is the owner's call, not
     a default. */
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  images: {
    // This site is photography-first. Serve modern formats by default.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [375, 640, 768, 1024, 1280, 1440, 1920, 2560],
  },
  env: {
    TAAMBOOLAM_PHOTO_FILES: readImageFileList(),
  },
  poweredByHeader: false,
};

export default nextConfig;
