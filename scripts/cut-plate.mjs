/**
 * Cuts the taamboolam tray out of the photograph the owner sent, for the
 * footer. Run: node scripts/cut-plate.mjs [outDir]
 *
 * The source is a phone snap: the tray on a dark varnished table, shot from
 * above and slightly off-square, with a packet of nuts overhanging the rim at
 * the top. It cannot go on a limewash page as it is — the table is the darkest
 * thing on the site by a wide margin, and most of the frame is table.
 *
 * ── Why this is not a threshold matte ──
 *
 * The obvious approach is to classify every pixel as table or tray. It was
 * tried three ways and each failed on the same pixels. Varnished wood is warm
 * and mid-dark, which is also a fair description of the coconut husk and the
 * bananas. Where the tray meets the table there is a band of near-colourless
 * shadow, so a warmth test walks straight through the boundary and out into
 * the wood; adding a darkness test to close that gap then classifies the
 * tray's own steel surface — mid-grey, in shadow — as table, which breaks the
 * interior into a dozen fragments, none of which is the tray.
 *
 * Rendering the masks and looking at them is what settled it: every threshold
 * found the RIM cleanly, as a closed bright ring, and none of them described
 * the inside or the outside correctly.
 *
 * ── So fit the ring instead of classifying the pixels ──
 *
 * The subject is a round tray photographed from above. Its true outline is an
 * ellipse. An ellipse cannot fringe with wood and cannot bite a notch out of
 * the rim, which are the only two failures that show on a plain background.
 *
 * The ellipse below was measured off the picture by scanning rows and columns
 * for the ring, then checked against points not used to fit it:
 *
 *      x=270, top rim     predicted 174   measured 173
 *      x=220, bottom rim  predicted 423   measured 424
 *      x=120, bottom rim  predicted 414   measured 417
 *
 * Stored as fractions of the frame so the numbers survive a resize.
 *
 * The cost is the corner of the nut packet that overhangs the rim: it is
 * clipped. That is deliberate. A tray clipped to its own rim reads as framing;
 * a ragged edge reads as a bad cut-out.
 */
import sharp from "sharp";
import path from "node:path";
import { writeFileSync } from "node:fs";

const SRC =
  "C:/Users/User/Downloads/Taamboolam webdesign photos videos-20260902T161613Z-1-001/WhatsApp Image 2026-09-05 at 12.18.29 PM.jpeg";
const OUT = process.argv[2] ?? "public/images";

/** The rim, as fractions of the frame. See the note above. */
const RIM = { cx: 0.475, cy: 0.5488, rx: 0.445, ry: 0.2486 };
/** Take the outer edge of the steel, not the inner. */
const GROW = 1.015;
/** Longest edge of the delivered PNG. A footer motif, not a hero — it is
    displayed around 240px wide, so 760 covers a 3x screen and nothing more. */
const TARGET = 760;

const meta = await sharp(SRC).metadata();
const W = meta.width;
const H = meta.height;

const cx = RIM.cx * W;
const cy = RIM.cy * H;
const rx = RIM.rx * W * GROW;
const ry = RIM.ry * H * GROW;

/* The matte, drawn rather than derived. Anti-aliased by supersampling the
   ellipse test 3x3 per pixel: a hard alpha edge on a photograph reads as a
   sticker, and blurring a hard edge instead would pull table colour inward and
   leave a dark halo once it sits on limewash. */
/* Built as RGBA rather than as a single band. joinChannel looked like the
   direct way to do this and silently does not work: it appends the matte as an
   extra band, the result is still flagged three-channel, and PNG output drops
   the band without complaint — a full-size photograph with the table still on
   it and no error anywhere. Compositing with `dest-in` is the documented way
   to apply a matte and it is checked below. */
const alpha = Buffer.alloc(W * H * 4);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    let hits = 0;
    for (let sy = 0; sy < 3; sy++) {
      for (let sx = 0; sx < 3; sx++) {
        const dx = (x + (sx + 0.5) / 3 - cx) / rx;
        const dy = (y + (sy + 0.5) / 3 - cy) / ry;
        if (dx * dx + dy * dy <= 1) hits++;
      }
    }
    const i = (y * W + x) * 4;
    alpha[i] = 255;
    alpha[i + 1] = 255;
    alpha[i + 2] = 255;
    alpha[i + 3] = Math.round((hits / 9) * 255);
  }
}

const alphaPng = await sharp(alpha, {
  raw: { width: W, height: H, channels: 4 },
})
  .png()
  .toBuffer();

/* The grade. The photograph is cool and a little flat under an overhead bulb;
   the page it lands on is warm limewash. Lifting red and easing blue walks it
   toward the page without tinting the steel orange. The saturation nudge is
   for the flowers and the limes, which are the reason this reads as a
   taamboolam rather than as a bowl of shopping.

   Two passes, and it has to be two: joinChannel matches the matte against the
   pipeline's OUTPUT size, so cropping in the same pass leaves a small image
   joined to a full-size matte, which sharp pads back out — the tray in the
   corner of a black rectangle. Matte first, crop second. */
const graded = await sharp(SRC)
  .removeAlpha()
  .linear([1.06, 1.02, 0.96], [-4, -3, 0])
  .modulate({ saturation: 1.08 })
  .png()
  .toBuffer();

/* The matte goes on in a pass of its own. Graded and matted together, the
   corners come back fully opaque: `linear` and `modulate` in front of
   `dest-in` leave the composite with nothing to bite on, and — as with
   joinChannel — it fails silently rather than erroring. Tested both ways; the
   only difference was those two calls. */
const matted = await sharp(graded)
  .ensureAlpha()
  .composite([{ input: alphaPng, blend: "dest-in" }])
  .png()
  .toBuffer();

const left = Math.max(0, Math.floor(cx - rx));
const top = Math.max(0, Math.floor(cy - ry));
const cut = await sharp(matted)
  .extract({
    left,
    top,
    width: Math.min(W - left, Math.ceil(rx * 2)),
    height: Math.min(H - top, Math.ceil(ry * 2)),
  })
  .resize({ width: TARGET, height: TARGET, fit: "inside", kernel: "lanczos3" })
  /* Palette PNG. The alternative is 1.3MB of truecolour for one small motif —
     nearly half again what all twenty-one photographs cost together. Quantised
     it is 167KB, and on a photograph of flowers and fruit against a cut-out
     edge there is nothing visible to tell them apart. */
  .png({ compressionLevel: 9, palette: true, quality: 85 })
  .toBuffer();

const out = path.join(OUT, "taamboolam-tray.png");
/* Written as bytes, not handed back to sharp. `sharp(cut).toFile(out)` decodes
   and re-encodes with default settings, which throws away the quantisation
   above and puts 224KB on disk while the log cheerfully reports 166. */
writeFileSync(out, cut);
const done = await sharp(out).metadata();
if (!done.hasAlpha) throw new Error("no alpha channel — the matte was dropped");

/* Check the corners are actually gone. They are the four points furthest
   outside an inscribed ellipse, so if the matte were dropped again — or
   inverted — this is where it shows. */
const { data, info } = await sharp(out)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const alphaAt = (x, y) => data[(y * info.width + x) * info.channels + 3];
const corners = [
  alphaAt(2, 2),
  alphaAt(info.width - 3, 2),
  alphaAt(2, info.height - 3),
  alphaAt(info.width - 3, info.height - 3),
];
if (corners.some((a) => a > 8)) {
  throw new Error(`table still in the corners: alpha ${corners.join(", ")}`);
}
const middle = alphaAt(info.width >> 1, info.height >> 1);
if (middle < 250) throw new Error(`tray is transparent: alpha ${middle}`);

console.log(
  `${out}  ${done.width}x${done.height}  ${(cut.length / 1024).toFixed(0)}KB` +
    `  corners ${corners.join("/")}  middle ${middle}`,
);
