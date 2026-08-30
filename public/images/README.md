# Photography

**Everything in this folder is a temporary stock placeholder.** It is here so
the layout can be reviewed with believable photographs in it — not so it can
ship. All of it gets replaced by the owner's photographs.

The current images are from [Pexels](https://www.pexels.com), whose licence
permits commercial use without attribution. They were chosen to match the mood
of a South Indian home, but **none of them shows this house**. Provenance and
links for every file are in `CREDITS.json`.

## Replacing one

Drop a file in with the same name. That is the whole process.

Any name that is missing falls back to a designed placeholder of exactly the
same shape, describing the shot that belongs there — so the site never breaks
and never shifts while you swap them in one at a time.

The aspect ratios below are fixed in `lib/photos.ts`, not in the page layouts.
Supply roughly the right shape and the crop will take care of itself; supply
something wildly different and it will be centre-cropped, not squashed.

> **After replacing photographs, delete the `.next` folder before rebuilding.**
> Next.js caches resized images by filename, so a same-named replacement will
> otherwise keep serving the old picture. A fresh deploy handles this for you.

## The slots

| File | Where it appears | The shot | Shape |
|---|---|---|---|
| `hero.jpg` | Home — hero | The house from the street. Wide, natural light. This is the largest image on the site — supply it at 2560px on the long edge. | 3:4 (fills the screen) |
| `intro.jpg` | Home — introduction | The heart of the house: a courtyard, a stairwell, or whatever a visitor sees first on coming in. | 4:5 portrait |
| `staying-morning.jpg` | Home — what staying means | Morning light in a room. Unstaged. | 4:5 portrait |
| `staying-shared.jpg` | Home — what staying means | A shared hall on any floor, with somewhere to sit. | 3:2 landscape |
| `staying-balcony.jpg` | Home — what staying means | A balcony, with its plants in frame. | 4:5 portrait |
| `floor-1-a.jpg` | Home preview + Experience, Floor 1 | A guest room on Floor 1. Made bed, window in frame. | 4:5 portrait |
| `floor-1-b.jpg` | Experience — Floor 1 | The shared hall on Floor 1. | 3:2 landscape |
| `floor-2-a.jpg` | Home preview + Experience, Floor 2 | A guest room on Floor 2. | 4:5 portrait |
| `floor-2-b.jpg` | Experience — Floor 2 | The kitchen on Floor 2. | 3:2 landscape |
| `floor-3-a.jpg` | Home preview + Experience, Floor 3 | The Athangudi tiles on Floor 3, shot close and square-on. | 4:5 portrait |
| `floor-3-b.jpg` | Experience — Floor 3 | A room on Floor 3 where the colour and material show. | 3:2 landscape |
| `floor-4-a.jpg` | Home preview + Experience, Floor 4 | The Athangudi tiles on Floor 4. | 4:5 portrait |
| `floor-4-b.jpg` | Experience — Floor 4 | A room on Floor 4. The best light in the house. | 3:2 landscape |
| `stair.jpg` | Experience — opening | The stairwell, or the lift landing. | 3:4 portrait |
| `craft-tiles.jpg` | Home — how it is made | A close detail of a made surface: tile, lime, wood or stone. | 1:1 square |
| `craft-hands.jpg` | Home — how it is made | Hands making something, if any of the artisans will let you photograph them. | 1:1 square |
| `craft-textile.jpg` | Home — how it is made | A textile, a woven thing, or another handmade object in the house. | 1:1 square |
| `food-table.jpg` | Home — eating here | A meal as it is actually served here. | 3:2 landscape |
| `food-detail.jpg` | Experience — food | One dish, close. | 1:1 square |
| `values-corner.jpg` | Home — house values | A quiet corner. Plants, a chair, one strong shadow. | 4:5 portrait |
| `invitation.jpg` | Home — closing invitation | Something wide and calm: the street's trees, or the view up from the terrace. Text sits over the left of this one, so keep the left side simple. | 16:9 wide |
| `experience-opening.jpg` | Experience — opening | The widest, most complete view of the house you have. | 16:9 wide |
| `experience-gathering.jpg` | Experience — gatherings | A room set up for a group, or a gathering that has actually happened here. | 3:2 landscape |
| `experience-close.jpg` | Experience — closing | The house from outside, at the end of the day. Text sits over the left. | 16:9 wide |

## Before you drop files in

- **Natural light.** No flash, nothing staged, no empty show-home rooms.
- **Grade them together** — warm and slightly muted, so twenty-four photographs
  read as one house rather than as twenty-four separate rooms.
- **Supply large.** Next.js resizes down and serves AVIF/WebP; it cannot invent
  detail. 2560px on the long edge is a good target.
- **`.jpg` is what the code expects.** If you supply `.png` or `.webp`, change
  the matching `src` in `lib/photos.ts`.
- **People are welcome, faces need permission.** Hands, backs and figures at a
  distance carry warmth without needing a release.
