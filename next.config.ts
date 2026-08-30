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

const nextConfig: NextConfig = {
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
