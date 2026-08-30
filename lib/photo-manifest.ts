import fs from "node:fs";
import path from "node:path";
import { photos, type PhotoId } from "./photos";

// TAAMBOOLAM_ROOT is set in next.config.ts from that file's own location, so
// this resolves correctly however the server was started. process.cwd() is the
// fallback for tooling that loads this module outside Next.
const IMAGE_DIR = path.join(
  process.env.TAAMBOOLAM_ROOT ?? process.cwd(),
  "public",
  "images",
);

let cached: Record<string, boolean> | null = null;

/**
 * Photographs arrive in batches. Rather than shipping broken <img> tags while
 * we wait, each slot is checked once on the server and the result is handed to
 * the client, which renders a designed placeholder of the same shape for any
 * file that has not landed. Nothing collapses mid-swap and nothing shifts.
 *
 * Read once per process in production; re-read in development so dropping a
 * photo in shows up on the next refresh.
 */
export function readPhotoManifest(): Record<string, boolean> {
  if (cached && process.env.NODE_ENV === "production") return cached;

  let present: Set<string>;
  try {
    present = new Set(fs.readdirSync(IMAGE_DIR));
  } catch {
    present = new Set();
  }

  const manifest: Record<string, boolean> = {};
  for (const id of Object.keys(photos) as PhotoId[]) {
    manifest[id] = present.has(photos[id].src.replace(/^\/images\//, ""));
  }

  cached = manifest;
  return manifest;
}
