/**
 * Build the site's photographs from the client's originals.
 *
 * Reads only. Nothing in the source folder is written, renamed or deleted.
 */
import sharp from "sharp";
import { mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import { upscalePhotos } from "./upscale-photos.mjs";

const SRC =
  "C:/Users/User/Downloads/Taamboolam webdesign photos videos-20260902T161613Z-1-001/Taamboolam webdesign photos videos";
const FRAMES =
  "C:/Users/User/AppData/Local/Temp/claude/C--Users-User--claude/091edb96-ba42-4118-9e5b-d8e68016bc85/scratchpad/vf";
/**
 * A second batch, sent 5 September 2026, after the site was already built.
 * Kept as its own root rather than merged into the folder above: these are the
 * owner's files exactly as they arrived, and nothing here writes to either
 * directory.
 */
const SRC_SEPT = "C:/Users/ASUS/Downloads/new pictures";

/**
 * The one source that is not the owner's, and the only one committed to this
 * repository rather than living on somebody's machine. See
 * assets/stock/README.md for what it is, where it came from, and what has to
 * be true of anything that replaces it.
 */
const STOCK = "assets/stock";

/**
 * `--only=a.jpg,b.jpg` builds just those outputs.
 *
 * The two source roots live on different machines, so a full run is only
 * possible where both are mounted. Without a way to build a subset the choice
 * was between rebuilding nothing and hand-editing files outside this script,
 * and the second is how a registry stops describing what is actually on disk.
 */
const args = process.argv.slice(2);
const only = args
  .find((a) => a.startsWith("--only="))
  ?.slice("--only=".length)
  .split(",")
  .map((v) => v.trim())
  .filter(Boolean);
const OUT = args.find((a) => !a.startsWith("--")) ?? "public/images";

mkdirSync(OUT, { recursive: true });

/**
 * One grade for every photograph, so twenty-one files shot on different days
 * under different light read as one house.
 *
 * The originals are flash-lit interiors: slightly cool, slightly flat. This is
 * a small warm tilt (red up, blue down) with about 5% more contrast pivoted at
 * mid-grey, and a light saturation lift. Deliberately gentle — the site's job
 * is to show the house, not to apply a look to it.
 */
const grade = (p, { warmth = 1, contrast = 1, sat = 1.07 } = {}) => {
  const c = 1 + 0.06 * contrast;
  const mul = [c * (1 + 0.022 * warmth), c, c * (1 - 0.022 * warmth)];
  return p
    .linear(mul, mul.map((m) => 128 - m * 128))
    .modulate({ saturation: sat });
};

/** Night frames need the shadows opened rather than the midtones pushed. */
const night = (p) =>
  p
    .linear([1.14, 1.09, 1.0], [4, 4, 2])
    .modulate({ saturation: 0.94 });

const jobs = [
  // ── The house ───────────────────────────────────────────────────────
  { out: "hero.jpg", src: "IMG-20260902-WA0002.jpg", w: 1600, ar: 3 / 2 },
  { out: "intro.jpg", src: "IMG-20260902-WA0004.jpg", w: 1600, ar: 21 / 9 },
  { out: "arrival-night.jpg", src: "IMG-20260902-WA0014.jpg", w: 1600, ar: 21 / 9, tone: night },

  // ── The plan ────────────────────────────────────────────────────────
  { out: "plan-living.jpg", src: "IMG-20260902-WA0012.jpg", w: 1500, ar: 3 / 2 },
  { out: "plan-kitchen.jpg", src: "IMG-20260902-WA0013.jpg", w: 1400, ar: 4 / 3 },

  // ── The floors ──────────────────────────────────────────────────────
  { out: "floor-1-a.jpg", src: "IMG-20260902-WA0007.jpg", w: 1100, ar: 4 / 5 },
  { out: "floor-1-b.jpg", src: "IMG-20260902-WA0003.jpg", w: 1500, ar: 3 / 2 },
  /* Was IMG-20260902-WA0016: a bare mattress against a curtain in flat olive
     light, and comfortably the weakest photograph on the site — it made the
     second floor look like the room nobody wanted. This is the same kind of
     room shot properly: a turned wooden bed, a yellow wall, daylight, and the
     patterned floor showing.

     A landscape source in a portrait slot, so it cannot hold the whole bed.
     Cropped from x140, which keeps the headboard whole and loses the foot: a
     bed cut off at the foot reads as a crop, one cut off at the head reads as
     a mistake. */
  {
    out: "floor-2-a.jpg",
    root: SRC_SEPT,
    src: "WhatsApp Image 2026-09-05 at 7.05.58 AM.jpeg",
    crop: { left: 140, top: 0, width: 719, height: 899 },
    w: 719,
    tone: (p) => grade(p, { sat: 0.98 }),
  },
  { out: "floor-2-b.jpg", src: "IMG-20260902-WA0009.jpg", w: 1500, ar: 3 / 2 },
  { out: "floor-3-a.jpg", src: "IMG-20260902-WA0017.jpg", w: 1100, ar: 4 / 5 },
  { out: "floor-3-b.jpg", src: "IMG-20260902-WA0018.jpg", w: 1500, ar: 3 / 2 },

  // ── The terrace ─────────────────────────────────────────────────────
  // The only daylight photograph of the terrace has eight identifiable
  // people in it. This takes the band above them: the pergola, the hanging
  // planters and the sky. Nobody in the frame, and nothing invented.
  // The terrace, in use.
  //
  // This was a thin band cropped from above the heads of eight people,
  // because nobody had recorded their permission to publish it. The owner has
  // since confirmed it. So the crop drops to include them, and the terrace
  // stops being a photograph of an empty pergola roof and becomes what the
  // chapter beside it actually claims: the place people end up.
  //
  // 16:9 from y330 keeps the group whole, head to feet, with the planters
  // above them and the terracotta floor below. A wider band cut them off at
  // the calf; a taller one was mostly floor.
  //
  // Saturation is pulled back a little rather than a lot: the phone rendered
  // the sky electric cyan under a white roof, but there is far less sky in
  // this crop and plenty of warm terracotta to balance it.
  {
    out: "terrace-open.jpg",
    src: "IMG-20260901-WA0003.jpg",
    crop: { left: 0, top: 330, width: 1200, height: 675 },
    w: 1200,
    tone: (p) =>
      p.linear([1.05, 1.03, 0.99], [-5, -4, -1]).modulate({ saturation: 0.95 }),
  },
  // No swing frame. The carved swing in the owner's video is on the fourth
  // floor portico, which is the family's and not open to guests, so it is not
  // on the site at all.
  // "south": the sun and the treeline sit low in the frame, and a centred
  // 21:9 band cut both out and left an abstract orange field.
  { out: "gathering-sky.jpg", src: "IMG-20260902-WA0029.jpg", w: 1200, ar: 21 / 9, position: "south" },

  // ── Materials and detail ────────────────────────────────────────────
  { out: "house-section.jpg", src: "IMG-20260902-WA0019.jpg", w: 1014, ar: 3 / 4 },
  // Low and tight on the painted border where it meets the red oxide floor.
  // A squarer crop higher up put half a bed in the frame, and a bed under a
  // heading that says "how it is made" reads as a bedroom, not a material.
  /* Was a 446px detail of a painted border against red oxide, enlarged 2x to
     fill the slot, with the corner of a bed intruding at the top. It showed
     the material and nothing else.

     This frame argues the same point better and at native size: the painted
     border, the yellow tile panel, cane chairs standing on it, and a doorway
     behind. It is the bottom square of the source — the lowest the crop can
     sit — so the dark doorway at the top is unavoidable, and small.

     Saturation down rather than up. The wall is already a strong red and the
     house grade would have made it the loudest thing on the page. */
  {
    out: "craft-tiles.jpg",
    root: SRC_SEPT,
    src: "WhatsApp Image 2026-09-05 at 7.05.57 AM.jpeg",
    crop: { left: 0, top: 700, width: 899, height: 899 },
    w: 900,
    upscale: true,
    tone: (p) => grade(p, { sat: 0.95 }),
  },
  // 16:9, because this is now the wide photograph that opens "how it is
  // made" on the home page. It was a square, and the layout cover-cropped
  // it to 16:9 and threw the joinery away.
  {
    out: "craft-joinery.jpg",
    src: "IMG-20260902-WA0018.jpg",
    crop: { left: 40, top: 30, width: 1520, height: 855 },
    w: 1520,
  },
  /* Was a 450px corner lifted out of the hero and doubled in size: the back
     of a cane chair with a palm behind it. Cane was in the frame, but as
     furniture in a room rather than as the thing being shown.

     A woven pendant lit from inside is the argument itself — the weave is the
     subject — and it is the one photograph in the house already in the site's
     palette, ochre on near-black.

     Not the night tone, which lifts shadows: here the black around the lamp is
     the composition, and opening it would leave grey. Contrast is nudged and
     saturation pulled back instead, because the phone rendered the glow a
     harder orange than the room was. */
  {
    out: "craft-cane.jpg",
    root: SRC_SEPT,
    src: "WhatsApp Image 2026-09-05 at 7.00.01 AM.jpeg",
    crop: { left: 60, top: 265, width: 820, height: 820 },
    w: 900,
    upscale: true,
    tone: (p) =>
      p.linear([1.02, 1.0, 0.98], [0, 0, 0]).modulate({ saturation: 0.92 }),
  },
  /* Was a bamboo water feature in a stone bowl. Well shot, but a
     garden-centre object that could stand in any courtyard in the city, under
     a section about what this house values.

     A framed Kalamkari on a plain wall says the specific thing instead: one
     hand-drawn object, chosen and hung, which is what the About copy claims
     about everything here. Cream wall, so the house grade applies unchanged.

     899 is the source's full width. The slot used to ask for 1066 and this
     cannot supply it without inventing pixels — and the frame fills the crop,
     so there is nothing to gain by enlarging. */
  {
    out: "values-corner.jpg",
    root: SRC_SEPT,
    src: "WhatsApp Image 2026-09-05 at 7.05.58 AM (2).jpeg",
    crop: { left: 0, top: 47, width: 899, height: 1124 },
    w: 899,
  },

  // ── Food ────────────────────────────────────────────────────────────
  /* The only photograph on this site that the owner did not take.
     
     It was a frame from a video she sent: 474px wide, shown at 1200, so it was
     soft and blocky. Worse than soft, it was wrong — a roti on a clay tawa on
     sand, which is not this house's kitchen and is not the "South Indian home
     cooking, made fresh and organic" that the page beside it promises. It came
     in as a WhatsApp forward, so it had never been her food either. All twelve
     frames of that clip are the same shot, so there was nothing better to cut
     to, and her only real food photograph is a flash-lit tiffin of vermicelli.
     
     Chosen for more than looks. The copy says "All of it vegetarian, like the
     house", and several better-composed thali photographs carry a meat or fish
     dish somewhere in frame — two candidates were rejected on exactly that.
     This one is vegetarian in every compartment. It is also steel on dark
     wood, which is the palette this section already sits in, and a steel plate
     rhymes with the taamboolam tray on the About page.
     
     `position: "left"` because the tray runs off the right of the frame into a
     bowl of cashews and a glass of curd: the food is on the left, and a
     centred 4:5 crop halves the chapatis. No `upscale` — this is a genuine
     1200 out of a 2400px source. */
  {
    out: "food-still.jpg",
    root: STOCK,
    src: "thali.jpg",
    w: 1200,
    ar: 4 / 5,
    position: "left",
  },

  // ── The Experience page ─────────────────────────────────────────────
  { out: "experience-opening.jpg", src: "IMG-20260902-WA0005.jpg", w: 1600, ar: 21 / 9 },
];

const results = [];

const selected = only ? jobs.filter((j) => only.includes(j.out)) : jobs;
if (only) {
  const unknown = only.filter((o) => !jobs.some((j) => j.out === o));
  if (unknown.length)
    throw new Error(`--only names no such output: ${unknown.join(", ")}`);
  console.log(`--only: building ${selected.length} of ${jobs.length}\n`);
}

for (const job of selected) {
  const from = job.frame
    ? path.join(FRAMES, job.frame)
    : path.join(job.root ?? SRC, job.src);
  /* Still a hard error, never a skip. A missing source means the photograph on
     the site right now was built from something this machine cannot see, and
     quietly leaving the old file in place would report a rebuild that did not
     happen. Use --only to build the subset whose sources you have. */
  if (!existsSync(from)) throw new Error(`missing source: ${from}`);

  let pipe = sharp(from).rotate();
  if (job.crop) pipe = pipe.extract(job.crop);

  const meta = await sharp(from).rotate().metadata();
  const inW = job.crop ? job.crop.width : meta.width;
  const inH = job.crop ? job.crop.height : meta.height;

  // Never upscale unless the job says to — a bigger file is not a better
  // photograph, and the client's originals are 1600px on the long edge.
  // The widest this source can fill the target shape without inventing
  // pixels. Taking min(job.w, inW) is not enough: a 4/5 crop out of a
  // 1600x1066 original can only supply 853px, and the first pass upscaled
  // every portrait by 1.3x without saying so.
  const nativeW = job.ar ? Math.min(inW, Math.round(inH * job.ar)) : inW;
  const targetW = job.upscale ? job.w : Math.min(job.w, nativeW);
  const targetH = job.ar
    ? Math.round(targetW / job.ar)
    : Math.round((targetW * inH) / inW);

  pipe = pipe.resize(targetW, targetH, {
    fit: "cover",
    position: job.position ?? "centre",
    kernel: "lanczos3",
  });

  pipe = (job.tone ?? grade)(pipe);
  // Upscaled sources (the two video frames, the tight detail crops) carry
  // more of the sharpen; everything else gets just enough to survive JPEG.
  pipe = pipe.sharpen({ sigma: job.upscale ? 1.1 : 0.6 });

  const info = await pipe
    .jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(path.join(OUT, job.out));

  results.push({ out: job.out, w: info.width, h: info.height, kb: Math.round(info.size / 1024) });
}

for (const r of results) {
  console.log(
    `${r.out.padEnd(26)} ${String(r.w).padStart(5)}x${String(r.h).padEnd(5)} ${String(r.kb).padStart(5)} KB`,
  );
}
console.log(`\n${results.length} photographs written to ${OUT}`);
if (only)
  console.log(`(subset build — ${jobs.length - selected.length} left untouched)`);
console.log(
  `total ${Math.round(results.reduce((a, r) => a + r.kb, 0) / 1024)} MB`,
);

/* Then enlarge the ones that need it, in the same run.
 *
 * This script and upscale-photos.mjs write the same filenames. This one builds
 * them from the owner's originals, at the size the original allows; that one
 * enlarges the ten shown full-bleed, in place. So running this alone silently
 * reverted that pass — ten photographs quietly went back to being too small
 * for the slots they fill, with nothing on screen or in the console to say so,
 * and HANDOFF.md tells the owner to run exactly this script to swap a photo.
 *
 * Chaining them is the fix rather than a warning to remember: a warning is
 * only as good as whoever is reading the terminal, and this failure is
 * invisible in the browser. Anything already at its target width is skipped,
 * so this cannot enlarge an enlargement.
 */
console.log("");
console.log("Enlarging the full-bleed photographs:");
console.log("");
await upscalePhotos(OUT);
