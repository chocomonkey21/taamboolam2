/**
 * Build the site's photographs from the client's originals.
 *
 * Reads only. Nothing in the source folder is written, renamed or deleted.
 */
import sharp from "sharp";
import { mkdirSync, existsSync } from "node:fs";
import path from "node:path";

const SRC =
  "C:/Users/User/Downloads/Taamboolam webdesign photos videos-20260902T161613Z-1-001/Taamboolam webdesign photos videos";
const FRAMES =
  "C:/Users/User/AppData/Local/Temp/claude/C--Users-User--claude/091edb96-ba42-4118-9e5b-d8e68016bc85/scratchpad/vf";
const OUT = process.argv[2] ?? "C:/Vibe Coding/Real Stuff/taamboolam2/public/images";

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
  { out: "floor-2-a.jpg", src: "IMG-20260902-WA0016.jpg", w: 1100, ar: 4 / 5 },
  { out: "floor-2-b.jpg", src: "IMG-20260902-WA0009.jpg", w: 1500, ar: 3 / 2 },
  { out: "floor-3-a.jpg", src: "IMG-20260902-WA0017.jpg", w: 1100, ar: 4 / 5 },
  { out: "floor-3-b.jpg", src: "IMG-20260902-WA0018.jpg", w: 1500, ar: 3 / 2 },

  // ── The terrace ─────────────────────────────────────────────────────
  // The only daylight photograph of the terrace has eight identifiable
  // people in it. This takes the band above them: the pergola, the hanging
  // planters and the sky. Nobody in the frame, and nothing invented.
  {
    out: "terrace-open.jpg",
    src: "IMG-20260901-WA0003.jpg",
    crop: { left: 0, top: 40, width: 1200, height: 345 },
    w: 1200,
  },
  {
    out: "terrace-swing.jpg",
    frame: "sw_17.jpg",
    w: 760,
    ar: 4 / 5,
    tone: night,
    upscale: true,
  },
  // "south": the sun and the treeline sit low in the frame, and a centred
  // 21:9 band cut both out and left an abstract orange field.
  { out: "gathering-sky.jpg", src: "IMG-20260902-WA0029.jpg", w: 1200, ar: 21 / 9, position: "south" },

  // ── Materials and detail ────────────────────────────────────────────
  { out: "house-section.jpg", src: "IMG-20260902-WA0019.jpg", w: 1014, ar: 3 / 4 },
  {
    out: "craft-tiles.jpg",
    src: "IMG-20260902-WA0021.jpg",
    crop: { left: 60, top: 420, width: 640, height: 640 },
    w: 900,
    upscale: true,
  },
  {
    out: "craft-joinery.jpg",
    src: "IMG-20260902-WA0018.jpg",
    crop: { left: 300, top: 20, width: 640, height: 640 },
    w: 900,
    upscale: true,
  },
  {
    out: "craft-cane.jpg",
    src: "IMG-20260902-WA0002.jpg",
    crop: { left: 1150, top: 230, width: 450, height: 450 },
    w: 900,
    upscale: true,
  },
  { out: "values-corner.jpg", src: "IMG-20260902-WA0022.jpg", w: 1066, ar: 4 / 5 },

  // ── Food ────────────────────────────────────────────────────────────
  { out: "food-still.jpg", frame: "food_11.jpg", w: 760, ar: 4 / 5, upscale: true },

  // ── The Experience page ─────────────────────────────────────────────
  { out: "experience-opening.jpg", src: "IMG-20260902-WA0005.jpg", w: 1600, ar: 21 / 9 },
];

const results = [];

for (const job of jobs) {
  const from = job.frame
    ? path.join(FRAMES, job.frame)
    : path.join(SRC, job.src);
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
console.log(
  `total ${Math.round(results.reduce((a, r) => a + r.kb, 0) / 1024)} MB`,
);
