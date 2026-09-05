# The one photograph that is not the owner's

Everything in `public/images/` is built from the owner's own photographs and
videos, except one. This folder holds that exception, and exists so it cannot
be forgotten.

| File | `thali.jpg` |
|---|---|
| Shows | A steel compartment thali on dark wood: potato curry, mixed vegetables, chapatis, a sweet, cashews, curd and a spice powder. Vegetarian. |
| Source | Unsplash — https://images.unsplash.com/photo-1711153419402-336ee48f2138 |
| Found via | https://unsplash.com/s/photos/south-indian-thali |
| Licence | Unsplash License — free for commercial use, no attribution required |
| Built into | `public/images/food-still.jpg`, by `scripts/build-photos.mjs` |

## Why it is here

The food photograph used to be a frame lifted from a video the owner sent. It
was 474px wide and shown at 1200, so it was soft and blocky — and it showed a
roti cooking on a clay tawa on sand, which is not this house's kitchen and is
not "South Indian home cooking, made fresh and organic" as the page beside it
says. It arrived as a WhatsApp forward. It was already not the owner's food;
it was just worse.

The owner has no usable photograph of a meal. This stands in until she sends
one.

## What to check if you replace it

The copy beside this image promises **"All of it vegetarian, like the house."**
Several otherwise good thali photographs have a meat or fish dish somewhere in
frame, including at the edges. That was the reason two closer-looking
candidates were rejected. Whatever replaces this must be vegetarian in every
part of the frame, not just in the middle of it.

## When the owner sends a real photograph

Drop it in the folder `SRC` points at in `scripts/build-photos.mjs`, change the
`food-still.jpg` job back to `src:` instead of `root: STOCK`, delete this
folder, and put the claim back in the header of `lib/photos.ts` — it currently
says one photograph is not hers, and that line is the only thing keeping the
rest of that file honest.
