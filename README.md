# Taamboolam

Website for Taamboolam, a family homestay in Jayanagar, south Bengaluru.

Three pages — **Home**, **The Experience**, **Enquire** — and a shared *Find Us*
footer that closes every one of them. There is no pricing, no availability and
no booking anywhere on the site, by design. The only conversion is an enquiry
that a person reads and answers.

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
| `ENQUIRY_TO_EMAIL` | Where enquiries land. Defaults to the address in `lib/site.ts`. |
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

The Kannada is a **written first draft awaiting native review** — see
`CONTENT.md`.

### Design tokens

Colour, type and layout are CSS custom properties in Tailwind's `@theme` block.
Components reference them by name (`bg-paper`, `text-ink-soft`, `.type-h2`).

**Atmospheres** are the one idea worth knowing. A `data-atmosphere` attribute on
a section shifts four tokens — ground, tint, hairline, accent — so the page's
temperature changes as you climb the house. Floors 1 and 2 stay close to the
default warm white; Floors 3 and 4 pick up the Athangudi tiles.

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

See `public/images/README.md` for all twenty-four slots.

### Motion

Everything is short, opt-in, and collapses to nothing under
`prefers-reduced-motion` — content and its final position never depend on an
animation having run. There is no scroll hijacking, no parallax, no autoplay and
no cursor effect.

- A brief opening wordmark, once per session, non-blocking and never focusable
- The header fades from transparent over the hero to a warm translucent ground
- Photographs settle from a slightly larger crop as they come into view
- A two-pixel reading indicator on The Experience, tinted by the four floors
- 420ms page transitions that never stand between a reader and the content

### The enquiry

`lib/enquiry.ts` holds one validator, run in the browser and again on the
server, returning message *keys* rather than sentences — the same enquiry may be
shown to a guest in Kannada and mailed to the owner in English.

`lib/mailer.ts` is the only file that knows a mail provider exists. It reports
`unconfigured` rather than a success it did not have.

---

## Deploying

Push to a Git remote and import the project. Set the environment variables
above, then send one real enquiry through the deployed form and confirm it
arrives in the inbox and that replying reaches the guest.

## What is still outstanding

See **`CONTENT.md`**. In short: every photograph is temporary stock, the phone
number and the map pin are placeholders, the bathroom arrangement is
deliberately unstated until confirmed, and the Kannada needs a native read.
