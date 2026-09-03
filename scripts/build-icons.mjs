/**
 * Build the icon set from one drawing.
 *
 *   node scripts/build-icons.mjs
 *
 * The source of truth is app/icon.svg — the house roofline and a betel leaf,
 * redrawn from the owner's Instagram badge. That badge is the right mark and
 * the wrong icon: it carries the Kannada name, the Latin name and a three-line
 * tagline, all of which turn to mud below about 96px, and the only copy that
 * exists publicly is 150px square. So this keeps the two elements that survive
 * a browser tab and drops everything that does not.
 *
 * Outputs, all regenerated from that one file:
 *   app/apple-icon.png    180x180, square and opaque — iOS applies its own
 *                         corner mask, and rounding it here would show white
 *                         wedges in the corners.
 *   app/favicon.ico       16/32/48, for browsers that ignore an SVG favicon.
 *   public/icon-512.png    Android home screen and the web manifest.
 */
import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const svg = readFileSync(path.join(root, "app", "icon.svg"));

/** The same drawing without the rounded corner, for platforms that mask. */
const squared = Buffer.from(
  svg.toString("utf8").replace(' rx="14"', ""),
  "utf8",
);

const png = (source, size) =>
  sharp(source, { density: 900 })
    .resize(size, size, { fit: "contain" })
    .png({ compressionLevel: 9 })
    .toBuffer();

/**
 * A minimal ICO container.
 *
 * The format allows each entry to be a whole PNG rather than a raw DIB, which
 * every browser since IE11 understands — so this is a 22-byte header per size
 * around images sharp has already produced, and needs no extra dependency.
 */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + images.length * 16;
  const entries = [];
  for (const { size, data } of images) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // width  (0 means 256)
    e.writeUInt8(size >= 256 ? 0 : size, 1); // height
    e.writeUInt8(0, 2); // palette
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    entries.push(e);
    offset += data.length;
  }

  return Buffer.concat([
    header,
    ...entries,
    ...images.map((i) => i.data),
  ]);
}

const written = [];
const write = (rel, buf) => {
  writeFileSync(path.join(root, rel), buf);
  written.push([rel, `${(buf.length / 1024).toFixed(1)} KB`]);
};

write("app/apple-icon.png", await png(squared, 180));
write("public/icon-512.png", await png(squared, 512));
write(
  "app/favicon.ico",
  ico(
    await Promise.all(
      [16, 32, 48].map(async (size) => ({ size, data: await png(svg, size) })),
    ),
  ),
);

for (const [name, size] of written) {
  console.log(`${name.padEnd(24)} ${size.padStart(9)}`);
}
console.log(`\n${written.length} icons written from app/icon.svg`);
