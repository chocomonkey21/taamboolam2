# Taamboolam

Website for Taamboolam, a homestay in Jayanagar, south Bengaluru. Three pages:
Home, The Experience, and Enquire & Find Us. There is no booking, no pricing and no
availability anywhere on the site — by design. The only conversion is the
enquiry form, which a person reads and answers.

Built by Fluxion Design Studio.

## Running it

```bash
npm install
npm run dev
```

The enquiry form works without any configuration in development: with no
`RESEND_API_KEY` set, the API route logs the enquiry to the terminal and
returns success, and the confirmation screen drops its "we sent you a copy"
line. In production a missing key is a hard error rather than a silent drop.

## Environment

Copy `.env.example` to `.env.local` and fill it in.

| Variable | What it does |
|---|---|
| `RESEND_API_KEY` | Required in production. Without it the form returns 500. |
| `ENQUIRY_TO_EMAIL` | Where enquiries land. Defaults to the address in `lib/site.ts`. |
| `ENQUIRY_FROM_EMAIL` | Sender. Must be on a domain verified in Resend. |

## How it is put together

```
app/
  layout.tsx          fonts, nav, footer, site-wide metadata
  page.tsx            Home
  experience/         The Experience
  enquire/            Enquire & Find Us
  api/enquire/        serverless POST -> Resend, with honeypot
  opengraph-image.tsx social card, generated at build
  globals.css         design tokens + type scale. The visual source of truth.
components/           Photo, Nav, Footer, Button, Field, EnquiryForm,
                      FeatureStrip, StorySection, TileMotif
assets/fonts/          Fraunces, read at build time by the social card
lib/
  site.ts             every changeable detail — phone, address, directions
  enquiry.ts          validation shared by the browser and the server
  photos.ts           which photographs have actually arrived
```

### Design tokens

Colour, type and layout live in `app/globals.css` as CSS custom properties in
Tailwind's `@theme` block. Components reference them by name — `bg-surface`,
`text-foreground-muted`, `.type-h2`. There are no raw hex values in components.

Tailwind's 4px spacing step is unchanged, and the design system's 8px rhythm is
kept by using even steps only: `2/4/6/8/12/16/24/32` map to
`8/16/24/32/48/64/96/128px`.

### Photographs

`components/Photo.tsx` checks whether each image file exists before rendering.
If it does, the photo goes through `next/image` with AVIF/WebP and correct
`sizes`. If it does not, the slot renders a placeholder of the same shape
describing the shot that belongs there. See `public/images/README.md`.

### Motion

There is none, per the brief. Colour transitions on hover and focus only.

## Deploying

Push to a Git remote and import the project into Vercel. Set the three
environment variables above in the Vercel project settings. Then send one real
enquiry through the deployed form and confirm it arrives.

## What is still outstanding

See `CONTENT.md`. In short: every photograph on the site is temporary stock,
and The Experience page makes specific claims about the house and the
neighbourhood that Radha needs to confirm or correct.
