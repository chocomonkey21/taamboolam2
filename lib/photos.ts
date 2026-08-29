import fs from "node:fs";
import path from "node:path";

const IMAGE_DIR = path.join(process.cwd(), "public", "images");

let cached: Set<string> | null = null;

/**
 * Photography arrives from Radha in batches. Rather than shipping broken
 * <img> tags while we wait, every photo slot checks whether its file has
 * landed yet and falls back to a designed placeholder if it has not.
 *
 * The listing is read once per process in production, where the folder is
 * fixed at build time. In development it is re-read every time, so dropping a
 * photo in shows up on the next refresh without restarting the server.
 */
function manifest(): Set<string> {
  if (cached && process.env.NODE_ENV === "production") return cached;
  try {
    cached = new Set(fs.readdirSync(IMAGE_DIR));
  } catch {
    cached = new Set();
  }
  return cached;
}

export function photoExists(src: string): boolean {
  const file = src.replace(/^\/images\//, "");
  return manifest().has(file);
}
