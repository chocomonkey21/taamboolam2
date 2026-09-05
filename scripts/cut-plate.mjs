/**
 * Makes the taamboolam medallion for the footer from the photograph the owner
 * sent. Run: node scripts/cut-plate.mjs [outDir]
 *
 * The source is a phone snap: the tray on a dark varnished table, shot from
 * above and slightly off-square, with a packet of nuts overhanging the rim at
 * the top.
 *
 * ── Why this is a round crop and no longer a cut-out ──
 *
 * The previous version matted the tray out of the table with an ellipse fitted
 * to the rim, on the reasoning that a round tray photographed from above has
 * an elliptical outline. The reasoning is sound and the result was not: the
 * tray's RIM is an ellipse, but its CONTENTS are a mound. The coconut stands
 * proud of the rim, the flowers stand proud of it, and the nut packet
 * overhangs it altogether. So an ellipse tight enough to exclude the table
 * decapitated all three, and one loose enough to contain them let the table
 * back in as ragged brown crescents. Rendered on limewash at the size the
 * footer actually shows it, it read as a sticker with the top sliced off.
 *
 * Fitting it more carefully did not help, because the problem is not the fit.
 * There is no ellipse that contains the contents and excludes the table.
 *
 * So the table stays, and the frame becomes the point. A circle centred on the
 * tray reads as a medallion — a deliberate way to show a photograph — where a
 * failed matte reads as a mistake. Two things make it work here rather than
 * being a retreat: the varnished wood is the same warm brown as the site's
 * own wood token, so the ring sits with the palette instead of fighting it,
 * and a circle is not the map's rectangle, so the footer still avoids the pair
 * of panels the original note was right to avoid.
 *
 * ── The grade ──
 *
 * The photograph is cool, contrasty and saturated the way a phone under an
 * overhead bulb is; the page is warm limewash. Red is lifted and blue eased to
 * walk it toward the page, the whole thing is lifted a little so the steel
 * stops reading as grey, and saturation comes DOWN to 0.80. That last one is
 * the correction that mattered most: the earlier grade pushed saturation UP to
 * 1.08, which made the limes and the flowers louder than anything else on the
 * site and was most of why the image looked out of place.
 */
import sharp from "sharp";
import path from "node:path";

const SRC =
  process.env.TRAY_SRC ??
  "C:/Users/ASUS/Downloads/WhatsApp Image 2026-09-05 at 12.18.29 PM.jpeg";
const OUT = process.argv[2] ?? "public/images";

/** Centre of the tray, as fractions of the frame. Measured off the picture. */
const CENTRE = { cx: 0.478, cy: 0.545 };
/** Radius, as a fraction of the frame's width. 0.56 puts the whole tray inside
    with a modest ring of table; tighter than this clips the rim at the left
    and the foot, looser turns the wood into the subject. */
const RADIUS = 0.56;
/** Delivered size. The footer shows it around 240px, so this covers 3x. */
const TARGET = 720;

const meta = await sharp(SRC).metadata();
const W = meta.width;
const H = meta.height;

const cx = CENTRE.cx * W;
const cy = CENTRE.cy * H;
const r = RADIUS * W;

const left = Math.max(0, Math.round(cx - r));
const top = Math.max(0, Math.round(cy - r));
const side = Math.min(Math.round(r * 2), W - left, H - top);

/* Graded and cropped in one pass, then masked in a second.
   Two passes, and it has to be two: sharp applies extract against the
   pipeline's output, so a full-frame mask composited in the same pass as a
   crop is a size mismatch — and where it does not error it pads the result
   back out and leaves the tray in the corner of a black square. */
const square = await sharp(SRC)
  .removeAlpha()
  .linear([1.12, 1.07, 1.0], [10, 9, 8])
  .modulate({ saturation: 0.8 })
  .extract({ left, top, width: side, height: side })
  .resize({ width: TARGET, height: TARGET, fit: "cover" })
  .png()
  .toBuffer();

/* The circle is drawn one pixel inside the edge and composited with dest-in,
   which anti-aliases it. Masking with a hard-edged bitmap instead leaves a
   stair-stepped rim that is plainly visible against flat limewash. */
const mask = Buffer.from(
  `<svg width="${TARGET}" height="${TARGET}" xmlns="http://www.w3.org/2000/svg">` +
    `<circle cx="${TARGET / 2}" cy="${TARGET / 2}" r="${TARGET / 2 - 1}" fill="#fff"/>` +
    `</svg>`,
);

const out = path.join(OUT, "taamboolam-tray.png");
await sharp(square)
  .ensureAlpha()
  .composite([{ input: mask, blend: "dest-in" }])
  .png({ compressionLevel: 9 })
  .toFile(out);

const done = await sharp(out).metadata();
console.log(
  `${out}  ${done.width}x${done.height}  alpha=${done.hasAlpha}  ` +
    `(source ${W}x${H}, circle r=${Math.round(r)} at ${Math.round(cx)},${Math.round(cy)})`,
);
