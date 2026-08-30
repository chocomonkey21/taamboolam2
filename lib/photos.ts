/**
 * The photography registry.
 *
 * Every image on the site is referenced by its id, never by a raw path. When
 * the owner's real photographs arrive, drop a file in with the matching name
 * (or change `src` here) and the whole site updates — the aspect ratios,
 * gallery behaviour, captions and reveals are all defined against the id, not
 * against the file.
 *
 * EVERYTHING CURRENTLY LISTED IS TEMPORARY STOCK. See public/images/README.md.
 * Alt text and captions are translated and live in lib/content/en.ts and
 * lib/content/kn.ts, under `photos`.
 */
export type PhotoId =
  | "hero"
  | "intro"
  | "stayingMorning"
  | "stayingShared"
  | "stayingBalcony"
  | "floor1a"
  | "floor1b"
  | "floor2a"
  | "floor2b"
  | "floor3a"
  | "floor3b"
  | "floor4a"
  | "floor4b"
  | "stair"
  | "craftTiles"
  | "craftHands"
  | "craftTextile"
  | "foodTable"
  | "foodDetail"
  | "valuesCorner"
  | "invitation"
  | "experienceOpening"
  | "experienceGathering"
  | "experienceClose";

export type PhotoMeta = {
  src: string;
  /** CSS aspect-ratio. Fixed here, so swapping the file causes no layout shift. */
  ratio: string;
};

export const photos: Record<PhotoId, PhotoMeta> = {
  hero: { src: "/images/hero.jpg", ratio: "3 / 4" },
  intro: { src: "/images/intro.jpg", ratio: "4 / 5" },
  stayingMorning: { src: "/images/staying-morning.jpg", ratio: "4 / 5" },
  stayingShared: { src: "/images/staying-shared.jpg", ratio: "3 / 2" },
  stayingBalcony: { src: "/images/staying-balcony.jpg", ratio: "4 / 5" },
  floor1a: { src: "/images/floor-1-a.jpg", ratio: "4 / 5" },
  floor1b: { src: "/images/floor-1-b.jpg", ratio: "3 / 2" },
  floor2a: { src: "/images/floor-2-a.jpg", ratio: "4 / 5" },
  floor2b: { src: "/images/floor-2-b.jpg", ratio: "3 / 2" },
  floor3a: { src: "/images/floor-3-a.jpg", ratio: "4 / 5" },
  floor3b: { src: "/images/floor-3-b.jpg", ratio: "3 / 2" },
  floor4a: { src: "/images/floor-4-a.jpg", ratio: "4 / 5" },
  floor4b: { src: "/images/floor-4-b.jpg", ratio: "3 / 2" },
  stair: { src: "/images/stair.jpg", ratio: "3 / 4" },
  craftTiles: { src: "/images/craft-tiles.jpg", ratio: "1 / 1" },
  craftHands: { src: "/images/craft-hands.jpg", ratio: "1 / 1" },
  craftTextile: { src: "/images/craft-textile.jpg", ratio: "1 / 1" },
  foodTable: { src: "/images/food-table.jpg", ratio: "3 / 2" },
  foodDetail: { src: "/images/food-detail.jpg", ratio: "1 / 1" },
  valuesCorner: { src: "/images/values-corner.jpg", ratio: "4 / 5" },
  invitation: { src: "/images/invitation.jpg", ratio: "16 / 9" },
  experienceOpening: { src: "/images/experience-opening.jpg", ratio: "16 / 9" },
  experienceGathering: {
    src: "/images/experience-gathering.jpg",
    ratio: "3 / 2",
  },
  experienceClose: { src: "/images/experience-close.jpg", ratio: "16 / 9" },
};
