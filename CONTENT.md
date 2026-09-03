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

- Taamboolam / ತಾಂಬೂಲಂ  *(corrected — the site previously carried ತಂಬೋಲಂ)*
- 50-1, 46th Cross, Sarakki Main Road, 8th Block, Jayanagar, Bengaluru 560078
- Next to Sampradha Hospitals and Sangeetha Mobiles
- taamboolaminn@gmail.com
- https://www.instagram.com/taamboolam/

---

## 2. The floor plan, and what is confirmed

Confirmed by the owner and now stated plainly on the site:

- Three guest floors: **1, 2 and 3**. The fourth floor is private and is not
  accessible to guests, and the site never offers it.
- The **terrace** is open to everyone staying in the house.
- Every guest floor is the same plan: two guest bedrooms sharing a common
  bathroom; one master bedroom with a walk-in closet, an attached bathroom and
  a balcony; and a living room, dining area and kitchen shared only by that
  floor.
- The kitchens hold a microwave, a bar fridge, a kettle, cutlery and crockery.
  **No stove, no chimney, no cooking setup.** Food is sourced on request.
- South Indian homemade organic food on request; North Indian on request too.
  No fixed menu, no set price.
- Children under 10 stay free when accompanied by a parent.
- **Pets are not accommodated.**

**Bed sizes are deliberately absent.** The site says how a floor is arranged,
not what is in each room — that is answered in your reply to an enquiry. If you
want a room's capacity published, `lib/config.ts` has an `occupancyNote` slot
waiting for it, in both languages.

---

## 3. Photographs

**Every photograph on the site is now yours.** The stock is gone. Twenty-one
images, about 3 MB in total, built from the folder you sent.

`public/images/README.md` lists every slot, what it shows, and where it came
from. `public/images/CREDITS.json` maps each file back to its original.

Two things worth your attention:

1. **Which floor is which is a guess.** Your photographs arrived unlabelled.
   Three visually distinct floors are in them — a maroon-and-white one, a blue
   one, a patterned-tile one — and they were assigned to Floors 1, 2 and 3 in
   that order. Tell us if that is wrong; it is a two-line fix.

2. **Four things have no photograph**: a walk-in closet, a bathroom, a balcony,
   and the terrace in daylight. Nothing was substituted for them. The one
   daylight terrace photograph has eight identifiable people in it and was not
   published for that reason — only the band of pergola and sky above them. If
   everyone in that frame is happy to appear, it is a much better picture and
   we will use it.

Three photographs you sent were deliberately left out: the one of you, the one
of two staff members, and the bank receipt. The first two because nobody has
recorded consent to publish them; the third because it is not a photograph and
it shows account details.

> **One catch:** Next.js caches resized images by filename. After replacing
> photographs, delete the `.next` folder before the next build, or the old
> picture will keep appearing. A fresh deploy does this for you.

---

## 4. Kannada

**Reviewed and approved by the owner on 2026-09-03**, including the corrected
name (ತಾಂಬೂಲಂ) and the vocabulary written for the terrace, the floor plan, the
kitchen and the FAQ.

It is all in one file: `lib/content/kn.ts`. The keys are identical to the
English file (`lib/content/en.ts`) and appear in the same order, so it stays
easy to re-read. Changing a line there changes it everywhere, including
buttons, form labels, validation messages and error screens.

Anything added to the English file from here on is an unreviewed draft in
Kannada until somebody reads it.

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
- No bed sizes and no room capacities — the floor plan is stated, the contents
  of a room are answered by you
- The private fourth floor is named once, as not accessible, and is never
  photographed or offered
