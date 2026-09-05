/**
 * Enlarge the photographs that are smaller than the slot they are shown in.
 *
 * ── What this can and cannot do ──
 *
 * It cannot invent detail. The originals for these frames are gone, and no
 * resampler recovers information that was never in the file. What it does is
 * take the enlargement away from the browser and do it better: next/image will
 * not generate a variant wider than its source, so a 1599px hero was being
 * served at 1599 and stretched to roughly 2500 device pixels by the browser's
 * own filter. Lanczos with a measured unsharp pass is a visibly cleaner
 * enlargement than that, and it is done once at build time rather than on
 * every device.
 *
 * So: the same detail, resolved more cleanly. Not a sharper photograph.
 *
 * ── Which files ──
 *
 * Only the ones rendered at 100vw, where the gap is real. A photograph in a
 * 30vw column at 1066px already exceeds what a 1440px viewport at 2x asks of
 * it, and enlarging it would add bytes and halos for nothing.
 *
 * ── When this runs ──
 *
 * build-photos.mjs calls it as its last step, because that script writes these
 * same filenames at their original sizes and would otherwise undo this pass
 * without saying so. Running it twice is harmless: anything already at its
 * target width is skipped, so it never enlarges an enlargement.
 *
 * Run: node scripts/upscale-photos.mjs [--check]
 * --check reports what it would do and writes nothing.
 */
import sharp from "sharp";
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

/**
 * Full-bleed photographs and the width they should reach.
 *
 * 2560 is the largest entry in next.config's deviceSizes, so it is the widest
 * variant next/image will ever be asked for. Going beyond it would produce a
 * file nothing requests.
 */
const FULL_BLEED = 2560;

const TARGETS = {
  "hero.jpg": FULL_BLEED,
  "intro.jpg": FULL_BLEED,
  "arrival-night.jpg": FULL_BLEED,
  "experience-opening.jpg": FULL_BLEED,
  "gathering-sky.jpg": FULL_BLEED,
  "terrace-open.jpg": FULL_BLEED,
  "floor-1-b.jpg": FULL_BLEED,
  "floor-2-b.jpg": FULL_BLEED,
  "floor-3-b.jpg": FULL_BLEED,
};

/**
 * Sharpening calibrated for an enlargement, not for a photograph.
 *
 * Enlarging softens edges uniformly, so what is wanted back is acutance at the
 * scale of the interpolation — a small radius. m1 is kept low so flat areas
 * (limewash walls, sky, the ceilings in most of these frames) are not given
 * texture they never had, which is how an upscale starts to look synthetic.
 */
const SHARPEN = { sigma: 0.7, m1: 0.4, m2: 2.2 };

/**
 * @param dir   Where the built photographs are. build-photos.mjs passes its own
 *              output directory rather than letting this default, so the two
 *              scripts cannot end up working on different folders.
 * @param check Report and write nothing.
 */
export async function upscalePhotos(
  dir = "public/images",
  { check = false } = {},
) {
  const DIR = dir;
  const CHECK = check;
  const rows = [];

  for (const [file, target] of Object.entries(TARGETS)) {
    const full = path.join(DIR, file);
    let meta;
    try {
      meta = await sharp(full).metadata();
    } catch {
      rows.push([file, "MISSING", "", "", "skipped"]);
      continue;
    }

    if (meta.width >= target) {
      rows.push([
        file,
        `${meta.width}x${meta.height}`,
        "—",
        "—",
        "already large enough",
      ]);
      continue;
    }

    const before = readFileSync(full).length;
    const factor = (target / meta.width).toFixed(2);

    if (CHECK) {
      rows.push([
        file,
        `${meta.width}x${meta.height}`,
        `→ ${target}`,
        `${factor}x`,
        "would upscale",
      ]);
      continue;
    }

    /* Encoded from the buffer and written back over the same path, so the file
     name, and therefore every reference to it in lib/photos.ts, is untouched.
     Read fully into memory first: sharp cannot stream a file onto itself. */
    const out = await sharp(readFileSync(full))
      .resize({ width: target, kernel: "lanczos3", withoutEnlargement: false })
      .sharpen(SHARPEN)
      .jpeg({ quality: 86, chromaSubsampling: "4:4:4", mozjpeg: true })
      .toBuffer();

    writeFileSync(full, out);
    const after = out.length;
    rows.push([
      file,
      `${meta.width}x${meta.height}`,
      `${target}x${Math.round((target / meta.width) * meta.height)}`,
      `${factor}x`,
      `${Math.round(before / 1024)}KB → ${Math.round(after / 1024)}KB`,
    ]);
  }

  const w = [26, 12, 12, 7, 26];
  const line = (r) => r.map((c, i) => String(c).padEnd(w[i])).join(" ");
  console.log(line(["file", "was", "now", "factor", "size"]));
  console.log("-".repeat(w.reduce((a, b) => a + b + 1, 0)));
  rows.forEach((r) => console.log(line(r)));

  /* Anything left in the folder that was not considered, so a photograph added
   later is not silently missed by this list. */
  const known = new Set(Object.keys(TARGETS));
  const others = readdirSync(DIR).filter(
    (f) => /\.jpe?g$/i.test(f) && !known.has(f),
  );
  console.log(
    `\nNot in the list (column photographs, judged large enough): ${others.length}`,
  );
}

// Only when run as a command, not when build-photos.mjs imports it.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await upscalePhotos("public/images", {
    check: process.argv.includes("--check"),
  });
}
