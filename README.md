# Taamboolam

Website for Taamboolam, a family homestay in Jayanagar, south Bengaluru.

**Live at https://www.taamboolam.com**

Three pages — **Home**, **The Experience**, **Enquire** — plus a **Privacy**
notice, and a shared *Find Us* footer that closes every one of them. There is
no pricing, no availability and no booking anywhere on the site, by design. The
only conversion is an enquiry that a person reads and answers.

Three documents sit beside this one:

- **`HANDOFF.md`** — accounts, deployment, and what to do when something breaks
- **`CONTENT.md`** — for the owner: what is confirmed, and what is still open
- **`SECURITY.md`** — what the code defends against, and what it does not

---

## Running it

```bash
npm install
npm run dev
```

The enquiry form works without any configuration, but it will not pretend to
send: with no `RESEND_API_KEY` the API returns 503 and the form says so plainly.
To review the confirmation screen without a live mail account, set
`ENQUIRY_DRY_RUN=true` in `.env.local` — the enquiry is then logged to the
terminal and the success screen states on screen that nothing was delivered.

```bash
npm run build   # production build
npm start       # serve the production build
```

## Environment

Copy `.env.example` to `.env.local`.

| Variable | What it does |
|---|---|
| `RESEND_API_KEY` | Required in production. Without it, enquiries are refused with an honest error rather than silently dropped. |
| `ENQUIRY_TO_EMAIL` | Optional. Overrides where enquiries land — used for testing, then removed. Defaults to the address in `lib/site.ts`. |
| `ENQUIRY_FROM_EMAIL` | Sender. Must be on a domain verified with the mail provider. |
| `ENQUIRY_DRY_RUN` | Development only. Logs the enquiry instead of sending it, and labels the success screen accordingly. |

---

## How it is put together

```
app/
  layout.tsx          fonts, language cookie, nav, footer, site metadata
  page.tsx            Home
  experience/         The Experience
  enquire/            Enquire
  api/enquire/        POST -> lib/mailer, with a honeypot and server-side validation
  opengraph-image.tsx social card, generated at build
  globals.css         design tokens, type scale, atmospheres, motion. The visual
                      source of truth — no raw hex lives in a component.
components/           screens/ hold the three pages; everything else is shared
lib/
  site.ts             addresses, contact details, placeholders
  config.ts           facts the owner has not confirmed yet (see CONTENT.md)
  content/            en.ts + kn.ts, both satisfying one Content type
  photos.ts           the photography registry: id -> file + aspect ratio
  photo-manifest.ts   which photographs have actually arrived
  enquiry.ts          validation shared by the browser and the server
  mailer.ts           the mail boundary — swap providers here and nowhere else
```

### Language

English and Kannada are **real content variants**, not runtime translation. Both
live in `lib/content/`, and both must satisfy the same `Content` type — adding a
string to one is a compile error until the other has it too.

The reader's choice is stored in a cookie, which the server reads in
`app/layout.tsx`. That means a returning Kannada reader gets Kannada in the first
byte of HTML: no flash of English, no hydration mismatch, and a correct
`<html lang>` for screen readers. Switching afterwards is instant React state.

This is why the three pages render dynamically rather than statically.

The Kannada was **read and approved by the owner**. Anything added to the
English file from here is an unreviewed draft in Kannada until somebody reads
it — the header of `lib/content/kn.ts` says so, and names the one string that
was added after that review.

### Design tokens

Colour, type and layout are CSS custom properties in Tailwind's `@theme` block.
Components reference them by name (`bg-paper`, `text-ink-soft`, `.type-h2`).

**Atmospheres** are the one idea worth knowing. A `data-atmosphere` attribute on
a section shifts four tokens — ground, tint, hairline, accent — so the page's
temperature changes as you climb the house. Floors 1 and 2 stay close to the
default warm white; Floor 3 picks up the Athangudi tiles; and the terrace
breaks the sequence by going cool and open, which is how a reader is told it is
not a fourth floor before reading a word.

Note the pair `--atmos-accent` and `--atmos-accent-ink`. The first is a **fill**
(tile fields, rules, glyphs) and is not always dark enough to set type in; the
second is the same hue pushed down until it clears 4.5:1 on that atmosphere's
own ground, and is the only one of the two that may be used for text.

### Photographs

`lib/photos.ts` maps an id to a file and a **fixed aspect ratio**, so a layout is
identical whether the real photograph has arrived or not — no shift when files
are swapped, and no shift while one loads. `components/Photo.tsx` checks the
manifest: if the file is there it goes through `next/image` with AVIF/WebP; if
it is not, the slot renders a designed placeholder of the same shape describing
the shot that belongs there.

Alt text and captions are translated, and live with the rest of the copy.

Every photograph is the owner's own. `scripts/build-photos.mjs` holds the
source file, crop, grade and size for each of the twenty-one slots and rebuilds
the whole set; `public/images/README.md` lists what each one shows and what has
no photograph yet.

### Motion

Everything is short, opt-in, and collapses to nothing under
`prefers-reduced-motion` — content and its final position never depend on an
animation having run. There is no scroll hijacking, no parallax, no autoplay and
no cursor effect.

- A brief opening wordmark, once per session, non-blocking and never focusable
- The header fades from transparent over the hero to a warm translucent ground
- Photographs settle from a slightly larger crop as they come into view
- A two-pixel reading indicator on The Experience, tinted by each level in turn
- 420ms page transitions that never stand between a reader and the content

### The enquiry

`lib/enquiry.ts` holds one validator, run in the browser and again on the
server, returning message *keys* rather than sentences — the same enquiry may be
shown to a guest in Kannada and mailed to the owner in English.

`lib/mailer.ts` is the only file that knows a mail provider exists. It reports
`unconfigured` rather than a success it did not have.

---

## Deploying

Vercel builds from `main`. **Pushing to `main` deploys** — there is no separate
publish step and no staging site. Any other branch builds a preview at its own
URL and touches nothing public, which is the safe way to try something.

The apex redirects to `www`, and `site.url` in `lib/site.ts` has to match
whichever of the two Vercel redirects *to* — it feeds the sitemap, robots.txt
and every share preview. `npm run build` checks that they still agree.

Full deployment detail, including the account inventory, is in **`HANDOFF.md`**.

## What is still outstanding

See **`CONTENT.md`**. Nothing blocking: which photograph belongs to which floor
is an assumption waiting on the owner; four things named in the copy — a
walk-in closet, a bathroom, a balcony, and the terrace in daylight without
people — have no photograph and have not been substituted for; and a handful of
practical guest questions (check-in times, towels, laundry) are still
unanswered.
