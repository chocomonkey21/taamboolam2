# For the owner

The site is live. Nothing here is blocking it — this is a record of what is
confirmed, what the site deliberately does not do, and the few things that
would still improve it. Nothing on this list requires a developer to
understand: each item names the one file it lives in.

For accounts, logins and what to do when something breaks, see `HANDOFF.md`.

---

## 1. The site is live

**https://www.taamboolam.com**

Nothing on the site is a placeholder any more. The phone number, the enquiry
address, the map pin and the postcode are all yours and all confirmed:

- Taamboolam / ತಾಂಬೂಲಂ  *(corrected — the site previously carried ತಂಬೋಲಂ)*
- +91 91082 40269, on the site and behind the WhatsApp button
- taamboolaminn@gmail.com
- 50-1, 46th Cross, Sarakki Main Road, 8th Block, Jayanagar, Bengaluru 560070
- Next to Sammprada Hospital and Sangeetha Mobiles
- https://www.instagram.com/taamboolam/

The map now drops a real pin rather than running a search. It was worked out
from the address and then checked against the landmark — the point it resolves
to is 63 metres from Sammprada Hospital, which is why we were willing to
publish it. **If it is wrong, it is thirty seconds to fix:** open Google Maps
on your phone, long-press the house, Share, Copy link, and send us the link.

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

## 5. Email — connected

The enquiry form sends. Each enquiry arrives with the subject line
`Enquiry from <name> — 2 adults, 1 child`, with **reply-to set to the guest**,
so hitting reply in Gmail writes straight back to them. The guest gets their
own copy in whichever language they filled the form in.

Two things worth knowing:

- **Nothing is stored.** The record of an enquiry is the email in your inbox.
  If you delete it, it is gone — there is no database behind the site.
- **If the mail service ever fails**, the form says so plainly rather than
  showing a thank-you for a message that went nowhere. A guest who sees that
  message is being told the truth, and the WhatsApp button still works.

Guests can also send the whole enquiry over WhatsApp instead — the button fills
in everything they have typed, so it arrives as a written message rather than
an empty chat.

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

---

## 7. Still open — none of it blocking

**Practical questions guests ask, that the site cannot yet answer.** Wi-Fi, air
conditioning and hot water are now mentioned, but without saying where. These
are the ones still missing entirely:

- [ ] Is the air conditioning in **every** bedroom, or some?
- [ ] Hot water in **every** bathroom?
- [ ] Check-in and check-out times
- [ ] Are towels and bed linen provided? Is there daily housekeeping?
- [ ] Is laundry possible?
- [ ] May guests bring non-vegetarian food into the house, or is that also not
      permitted?

**Naturopathy.** Your Instagram mentions naturo-treatment. It is deliberately
not on the site, because describing a treatment wrongly is worse than omitting
it. Send a sentence or two in your own words and it goes in.

**Which floor is which.** The photographs arrived unlabelled. We assumed Floor
1 is the one with maroon-and-white tiled bedrooms, Floor 2 the blue kitchen,
Floor 3 the patterned tiles throughout. **Please confirm or correct** — it is a
two-line fix.

**Four photographs that do not exist.** A bathroom, a balcony, a walk-in
closet, and the terrace in daylight without people in it. Nothing has been
substituted for them. A guest deciding on a whole floor genuinely does want to
see a bathroom; even good phone photographs in daylight would help.

**The neighbourhood.** Three or four lines from you about Jayanagar — what is
worth walking to, the nearest metro, where you would actually send a guest for
breakfast — and we will write it into the Experience page.
