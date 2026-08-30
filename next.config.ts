import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

/**
 * The project root, resolved from this file rather than from process.cwd().
 *
 * Next.js normally runs with the project as the working directory, but it does
 * not have to — `next dev <dir>` and some process managers start it elsewhere,
 * and then anything built on process.cwd() silently resolves to the wrong
 * place. The photograph manifest depends on reading public/images, so it takes
 * this value instead and cannot be fooled by how the server was launched.
 */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  images: {
    // This site is photography-first. Serve modern formats by default.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [375, 640, 768, 1024, 1280, 1440, 1920, 2560],
  },
  env: {
    TAAMBOOLAM_ROOT: projectRoot,
  },
  poweredByHeader: false,
};

export default nextConfig;
