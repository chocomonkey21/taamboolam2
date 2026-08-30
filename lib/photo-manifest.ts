import { photos, type PhotoId } from "./photos";

let cached: Record<string, boolean> | null = null;

/**
 * Photographs arrive in batches. Rather than shipping broken <img> tags while
 * we wait, each slot is checked once and the result is handed to the client,
 * which renders a designed placeholder of the same shape for any file that
 * has not landed. Nothing collapses mid-swap and nothing shifts.
 *
 * The list of files that actually exist is not read here — see the long
 * comment on TAAMBOOLAM_PHOTO_FILES in next.config.ts for why a runtime
 * `fs.readdirSync` silently produced an empty manifest (and therefore every
 * photo on the site) once deployed to Vercel. It is baked into that env var
 * at build time instead, so this function only has to parse a string.
 */
export function readPhotoManifest(): Record<string, boolean> {
  if (cached) return cached;

  let present: Set<string>;
  try {
    present = new Set(JSON.parse(process.env.TAAMBOOLAM_PHOTO_FILES ?? "[]"));
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
