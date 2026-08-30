# For the owner — what the site needs from you

Everything below is either waiting on you, or is a placeholder that must be
replaced before the site goes live. Nothing on this list requires a developer:
each item names the one file it lives in.

---

## 1. Things that are still placeholders

These are **wrong on purpose** — they are stand-ins, and they are obvious so
they cannot be shipped by accident.

| What | Currently | Where it lives |
|---|---|---|
| Phone / WhatsApp number | `+91 98765 43210` | `lib/site.ts` → `contact.phone`, `contact.whatsapp` |
| Google Maps link | A plain address search, not your pin | `lib/site.ts` → `location.mapLink` |

The site says so out loud: under the map link in the footer it prints "The exact
pin is still being confirmed." That line disappears on its own once you set
`mapLinkIsPlaceholder: false` in `lib/site.ts`.

**Already correct and confirmed** — no action needed:

- Taamboolam / ತಂಬೋಲಂ
- 50-1, 46th Cross, Sarakki Main Road, 8th Block, Jayanagar, Bengaluru 560070
- Next to Sampradha Hospitals and Sangeetha Mobiles
- stay@taamboolam.com
- https://www.instagram.com/taamboolam/

---

## 2. Bathrooms — deliberately not answered yet

The site currently says **nothing** about bathrooms, because nobody has
confirmed the arrangement. It does not say "ensuite", it does not say "shared",
and it does not imply either.

In its place, the house-values section prints one honest line:

> "Bathroom arrangements are being confirmed with the owner. Ask in your
> enquiry and you will get a straight answer rather than a guess."

**To publish the real answer**, open `lib/config.ts` and replace the `null`:

```ts
export const provisional: Provisional = {
  bathrooms: {
    en: "Every room has its own bathroom.",   // ← your words
    kn: "ಪ್ರತಿ ಕೊಠಡಿಗೂ ತನ್ನದೇ ಸ್ನಾನಗೃಹವಿದೆ.",  // ← the same, in Kannada
  },
  occupancyNote: null,
};
```

The moment both languages are filled in, the holding line disappears and the
real fact takes its place in the list. Layout is already built for it, so
nothing moves.

`occupancyNote` works the same way, and is there only if you want to add
something beyond "a queen bed in each room, suitable for two adults" — which is
already on the site and already confirmed.

---

## 3. Photographs

**Every photograph on the site today is temporary stock from Pexels.** It was
chosen to match the *mood and composition* of a South Indian home — a
tile-roofed exterior, a courtyard, Athangudi tiles, a verandah, a banana-leaf
meal — so the layout can be judged with believable pictures in it. **None of it
shows this house, and none of it can go live.**

`public/images/README.md` lists all twenty-four slots, the exact filename each
one needs, and what the shot should be. Drop a file in with the matching name
and it replaces the stock immediately. Any name that is missing falls back to a
designed placeholder describing the shot, so nothing breaks while you swap them
in one at a time.

Provenance for every current image is in `public/images/CREDITS.json`.

> **One catch:** Next.js caches resized images by filename. After replacing
> photographs, delete the `.next` folder before the next build, or the old
> picture will keep appearing. A fresh deploy does this for you.

---

## 4. Kannada

The Kannada on the site is a **written first draft that has not been reviewed by
a native speaker.** It is real content, not machine translation at page load —
the site never calls a translation service — but it needs a read-through.

It is all in one file: `lib/content/kn.ts`. The keys are identical to the
English file (`lib/content/en.ts`) and appear in the same order, so a reviewer
can work straight down it with the English open beside it. Changing a line there
changes it everywhere, including buttons, form labels, validation messages and
error screens.

---

## 5. Email

The enquiry form has no mail account behind it yet. Until it does, it **refuses
to pretend**: submitting shows "The enquiry form cannot send mail right now.
Please write to us directly and we will answer." It never shows a thank-you for
a message that went nowhere.

To turn it on:

- [ ] Create a Resend account and verify the sending domain
- [ ] Set `RESEND_API_KEY` in the hosting project
- [ ] Set `ENQUIRY_TO_EMAIL` to the inbox you actually read
- [ ] Set `ENQUIRY_FROM_EMAIL` to an address on the verified domain
- [ ] Send one real enquiry through the live form and confirm it arrives

Once it is on, each enquiry arrives with the subject line
`Enquiry from <name> — 2 adults, 1 child`, with **reply-to set to the guest**, so
hitting reply writes straight back to them. The guest gets a copy in whichever
language they used.

---

## 6. Things the site deliberately does not do

These are decisions, not omissions. If you want any of them changed, it is a
conversation, not a bug:

- No prices, anywhere
- No availability calendar
- No instant booking — every enquiry is read by you
- No analytics, no tracking, no cookie banner (the only cookie stores the
  reader's choice of language)
- No video, no autoplay
- Events and gatherings are mentioned quietly, as a direct-enquiry
  possibility — never presented as a product
