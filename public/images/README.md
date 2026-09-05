# The photographs

Every image on this site is the owner's own. The stock photography the site was
built against is gone.

Each file here was produced from one of the originals in the owner's folder by
`scripts/build-photos.mjs`, which holds the source filename, the crop, the
grade and the output size for every slot. **That script is where a photograph
is changed.** Run it again and the whole set is rebuilt consistently:

```bash
node scripts/build-photos.mjs
```

It reads the source folder and only writes into this directory. It never
modifies, renames or deletes anything in the source folder.

---

## What was done to them

One grade, applied to all of them, so photographs taken on different days under
different light read as one house: a small warm tilt, about 5% more contrast
pivoted at mid-grey, a light saturation lift, and a light sharpen. Nothing is
retouched, nothing is composited, and nothing is added to a room that was not
in it.

Two files come from the owner's videos rather than from a still, and are 760px
wide rather than 1500. The layouts hold them at sizes that resolution can
actually carry — see the notes in `HomeScreen.tsx` and `ExperienceScreen.tsx`.

Total: 21 files, about 3 MB. The stock set it replaced was 24 files and 27 MB.

---

## Two source batches

Most of these were built from the folder the owner sent on 2 September 2026.
Four were rebuilt on 5 September from a second batch — marked *(Sept batch)*
below, and sourced from a different root in `scripts/build-photos.mjs`.

The two roots are on different machines, so a full rebuild is only possible
where both are mounted. `node scripts/build-photos.mjs --only=craft-cane.jpg`
builds a subset; without `--only` the script errors on the first source it
cannot see, rather than skipping it and reporting a rebuild that did not
happen.

## The slots

| File | Where it appears | What it shows |
|---|---|---|
| `hero.jpg` | Home — full screen | The cane living room |
| `intro.jpg` | Home — wide band | Kitchen and dining, patterned floor |
| `values-corner.jpg` | Home — About | A framed Kalamkari on a plain wall *(Sept batch)* |
| `plan-living.jpg` | Home — the plan | A floor's shared living room |
| `plan-kitchen.jpg` | Home — the plan | The kitchen: kettle, microwave, fridge, **no stove** |
| `craft-tiles.jpg` | Home — how it is made | Cane chairs on the painted tile border *(Sept batch)* |
| `craft-joinery.jpg` | Home — how it is made | Cabinets and woven pendant shades |
| `craft-cane.jpg` | Home — how it is made | A woven cane pendant, lit *(Sept batch)* |
| `food-still.jpg` | Home + Experience | A vegetarian steel thali on dark wood — **the one photograph here that is not the owner's.** See `assets/stock/README.md` |
| `arrival-night.jpg` | Home — closing band, and Experience — closing band | The covered ground floor at night |
| `floor-1-a.jpg` | Home ledger + Experience | Floor 1 — a bedroom |
| `floor-1-b.jpg` | Experience — Floor 1 | Floor 1 — the living room |
| `floor-2-a.jpg` | Home ledger + Experience | Floor 2 — a bedroom *(Sept batch)* |
| `floor-2-b.jpg` | Experience — Floor 2 | Floor 2 — kitchen and dining |
| `floor-3-a.jpg` | Home ledger + Experience | Floor 3 — a bedroom on the patterned floor |
| `floor-3-b.jpg` | Experience — Floor 3 | Floor 3 — kitchen and dining |
| `terrace-open.jpg` | Home ledger + Experience | The terrace: pergola, planters, sky |
| `house-section.jpg` | Experience — opening | Panelled wall, shelf, tile border |
| `experience-opening.jpg` | Experience — wide band | Living room on the red tiled floor |
| `gathering-sky.jpg` | Experience — gatherings | Sunset from the terrace |

---

## Two things the owner should know

**Which photograph is which floor is an assumption.** The originals arrived
unlabelled. Three visually distinct floors are visible in them — one with a
maroon-and-white floor, one finished in blue, one with patterned tiles
throughout — and they were assigned to Floors 1, 2 and 3 in that order, to
match copy that already said the materials get louder as you climb. **If that
is wrong, it is a two-line fix:** swap the `src` values in `lib/photos.ts` and
the matching entries in `scripts/build-photos.mjs`. Nothing else in the site
refers to a filename.

**Four things in the brief have no photograph.** Nothing has been substituted
for them, because a wardrobe captioned as a walk-in closet is worse than no
photograph at all:

- a walk-in closet
- any bathroom
- a balcony
- the terrace in daylight with anything happening on it

The one daylight photograph of the terrace has eight identifiable people
standing in the middle of it, and is not published for that reason. What is
published is the band above them — the pergola, the hanging planters and the
sky. If the owner has consent from everyone in that frame, the full photograph
is a much better image and can be swapped in.

---

## Not used, and why

From the folder as supplied: the ChatGPT screenshots and the bank receipt
(not photographs, and the receipt carries account details); the paint-colour
swatches (reference, not imagery); the photograph of the owner and the one of
two staff members (people, no consent on file); the car porch and three weaker
bedroom frames (kept in reserve — usable if a slot needs re-shooting).

---

## After replacing a photograph

Next.js caches resized images by filename. Delete the `.next` folder before the
next local build, or the old picture keeps appearing. A fresh deploy does this
for you.
