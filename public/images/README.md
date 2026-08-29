# Photography

**Everything in this folder right now is a temporary stock placeholder.** It is
here so the layout can be reviewed with real photographs in it, not so it can
ship. All of it gets replaced by Radha's photographs. Provenance and links are
in `CREDITS.json` — the images are from Unsplash, whose licence permits
commercial use, but none of them show this house.

To replace one, drop a file in with the same name. Any name that is missing
falls back to a designed placeholder describing the shot that belongs there,
so the site never breaks mid-swap.

| File | Where it appears | The shot |
|---|---|---|
| `hero.jpg` | Home — hero | The house from the street, or the room that best shows what staying here feels like. Wide, natural light. This is the LCP image — supply it at 2560px wide. |
| `street.jpg` | Home — the neighbourhood | The street outside, or another Jayanagar street. Trees and shade in frame. Square. |
| `living-room.jpg` | Home — the house | The shared living room. Wide, daylight. |
| `room.jpg` | Home — the house | One guest room. Made bed, window in frame. Portrait. |
| `balcony.jpg` | Home — the house | The balcony or terrace, with the plants in frame. Portrait. |
| `corner.jpg` | Home — the house | A quiet corner. A chair, a lamp, one strong shadow. Landscape. |
| `breakfast.jpg` | Home — mornings | Breakfast on the table. Hands in frame if you can. Landscape. |
| `experience-house.jpg` | Experience — 01 | Wide shot of the main shared space. Show how the light falls. 16:9. |
| `experience-street.jpg` | Experience — 02 | A Jayanagar street with its trees. Morning light, low traffic. 16:9. |
| `experience-breakfast.jpg` | Experience — 03 | The table mid-breakfast. People eating, or the table just laid. 16:9. |
| `experience-host.jpg` | Experience — who you are staying with | The sitting area, the kitchen doorway, or a portrait of Radha if she is happy with one. Square. |

## Before you drop files in

- **Natural light only.** No flash, nothing staged.
- **Grade them consistently** — warm, slightly muted, so the set reads as one
  house rather than eleven separate photos.
- **Supply large.** Next.js resizes down and serves AVIF/WebP; it cannot invent
  detail. 2560px on the long edge is a good target.
- `.jpg` is what the code expects. If you supply `.png` or `.webp`, update the
  `src` in the page that uses it.
