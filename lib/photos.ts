/**
 * The photography registry.
 *
 * Every image on the site is referenced by its id, never by a raw path. To
 * replace one, drop a file in with the matching name (or change `src` here)
 * and the whole site updates — aspect ratios, gallery behaviour, captions and
 * reveals are all defined against the id, not against the file.
 *
 * THESE ARE THE OWNER'S OWN PHOTOGRAPHS. The stock imagery this site shipped
 * with is gone. Each file is built from one of the originals the owner sent by
 * scripts/build-photos.mjs, which holds the source filename, the crop and the
 * grade for every slot — that script is where an image is swapped, and running
 * it again regenerates the whole set consistently. See public/images/README.md
 * for what came from where and what is still missing.
 *
 * Alt text and captions are translated and live in lib/content/en.ts and
 * lib/content/kn.ts, under `photos`.
 *
 * WHICH PHOTOGRAPH IS WHICH FLOOR IS AN ASSUMPTION. The originals arrived
 * unlabelled. Three visually distinct floors are visible in them — one with
 * a maroon-and-white floor, one finished in blue, one with patterned tiles
 * throughout — and they are assigned to Floors 1, 2 and 3 in that order. If
 * the owner says the blue floor is the third and not the second, the fix is
 * to swap two `src` values here and two in the build script. Nothing else
 * refers to a filename.
 */
export type PhotoId =
  | "hero"
  | "intro"
  | "planLiving"
  | "planKitchen"
  | "floor1a"
  | "floor1b"
  | "floor2a"
  | "floor2b"
  | "floor3a"
  | "floor3b"
  | "terraceOpen"
  | "houseSection"
  | "craftTiles"
  | "craftJoinery"
  | "craftCane"
  | "foodStill"
  | "valuesCorner"
  | "invitation"
  | "experienceOpening"
  | "experienceGathering"
  | "experienceClose"
  | "taamboolamTray";

export type PhotoMeta = {
  src: string;
  /** CSS aspect-ratio. Fixed here, so swapping the file causes no layout shift. */
  ratio: string;
};

export const photos: Record<PhotoId, PhotoMeta> = {
  hero: { src: "/images/hero.jpg", ratio: "3 / 2" },
  intro: { src: "/images/intro.jpg", ratio: "21 / 9" },

  planLiving: { src: "/images/plan-living.jpg", ratio: "3 / 2" },
  planKitchen: { src: "/images/plan-kitchen.jpg", ratio: "4 / 3" },

  floor1a: { src: "/images/floor-1-a.jpg", ratio: "4 / 5" },
  floor1b: { src: "/images/floor-1-b.jpg", ratio: "3 / 2" },
  floor2a: { src: "/images/floor-2-a.jpg", ratio: "4 / 5" },
  floor2b: { src: "/images/floor-2-b.jpg", ratio: "3 / 2" },
  floor3a: { src: "/images/floor-3-a.jpg", ratio: "4 / 5" },
  floor3b: { src: "/images/floor-3-b.jpg", ratio: "3 / 2" },

  /* The terrace with people on it. This was a thin strip cropped from above
     their heads while nobody had recorded their permission; the owner has
     since confirmed it, so the frame drops to include them and the terrace
     stops looking like an empty roof. */
  terraceOpen: { src: "/images/terrace-open.jpg", ratio: "16 / 9" },

  houseSection: { src: "/images/house-section.jpg", ratio: "3 / 4" },

  craftTiles: { src: "/images/craft-tiles.jpg", ratio: "1 / 1" },
  /* Wide, not square: this is the photograph that opens the craft section. */
  craftJoinery: { src: "/images/craft-joinery.jpg", ratio: "16 / 9" },
  craftCane: { src: "/images/craft-cane.jpg", ratio: "1 / 1" },

  foodStill: { src: "/images/food-still.jpg", ratio: "4 / 5" },

  valuesCorner: { src: "/images/values-corner.jpg", ratio: "4 / 5" },

  /* One photograph, two places, two different jobs: the warm night band that
     closes the home page, and the dark ground the Experience page sets its
     last words on. They carry different alt text because they are doing
     different things. */
  invitation: { src: "/images/arrival-night.jpg", ratio: "21 / 9" },
  experienceClose: { src: "/images/arrival-night.jpg", ratio: "21 / 9" },

  experienceOpening: { src: "/images/experience-opening.jpg", ratio: "21 / 9" },
  experienceGathering: { src: "/images/gathering-sky.jpg", ratio: "21 / 9" },

  /* The tray the house is named after, cut off the table it was photographed
     on so it can sit straight on the footer's limewash. The only PNG here, and
     the only image with an alpha channel — see scripts/cut-plate.mjs, which is
     where it is regenerated. Do not run it through build-photos.mjs: that
     script writes JPEGs and would fill the transparency with black. */
  taamboolamTray: { src: "/images/taamboolam-tray.png", ratio: "760 / 566" },
};
