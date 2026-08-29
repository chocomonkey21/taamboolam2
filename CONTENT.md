# Content checklist — for Radha

The site is written in the agreed tone of voice: short sentences, plain words,
nothing flowery. Everything below is either waiting on you or needs a yes/no
before we go live.

## 1. Claims the site makes that we need you to confirm

We wrote the pages as if these are true, because vague copy reads worse than
specific copy. If any of them is wrong, tell us and we will change the line.

**The house**

- [ ] Guest rooms have a bed, a fan, storage and a window that opens
- [ ] There is hot water, and wifi that works
- [ ] There is a shared sitting area and a table where guests eat
- [ ] There is a balcony with plants that guests may use
- [ ] Rooms are cleaned daily, and linen is changed between guests
- [ ] How many rooms are there? The site says "a few rooms" and never gives a
      number. Do you want a number, or keep it vague?
- [ ] Is there air conditioning? We currently only mention a fan.

**Breakfast and the day**

- [ ] Breakfast is cooked every morning and included in the room
- [ ] Everyone eats at the same table
- [ ] It is usually South Indian, and there is coffee
- [ ] Guests get a key and can come and go as they like
- [ ] There is no reception, but someone is reachable by phone
- [ ] You can keep food aside for guests who arrive late
- [ ] Do you also serve lunch or dinner? The site currently says breakfast only.

**You**

- [ ] The Experience page says guests are staying in your house, that you
      answer enquiries, and that you are usually around at breakfast. Is that
      accurate, and are you comfortable with it being said that plainly?
- [ ] Would you like a photo of yourself on that section, or a photo of the
      house instead?

## 2. The neighbourhood — please sense-check

We wrote these from general knowledge of Jayanagar, not from the doorstep.

- [ ] Sarakki Lake is "close by" — walkable, or an auto ride?
- [ ] Which is actually the nearest metro station, and how far?
- [ ] Kempegowda airport "about two hours" by cab
- [ ] Bengaluru City station at Majestic "about forty-five minutes"
- [ ] Lalbagh "about twenty minutes"
- [ ] Are there bakeries, small restaurants and coffee places within a walk?
      Naming two or three real ones would make the page much stronger.

## 3. Details to replace

These all live in one file, `lib/site.ts`. Changing them there changes them
everywhere on the site.

- [ ] Phone number (currently a placeholder: `+91 98765 43210`)
- [ ] WhatsApp number (digits only, with country code)
- [ ] Email address (currently `stay@taamboolam.com`)
- [ ] The final domain (currently `taamboolam.com`) — this affects the sitemap
      and the social share card

The postal address is already in and correct:
50-1, 46th Cross, Sarakki Main Road, 8th Block, Jayanagar, Bengaluru 560070.

## 4. Photographs

**Everything on the site right now is temporary stock.** It is there so the
layout can be judged with real photographs in it. None of it shows this house,
and none of it can ship.

`public/images/README.md` lists all eleven slots, the exact filenames, and what
each shot should be. Drop a file in with the matching name and it replaces the
stock immediately. Any name that is missing falls back to a placeholder
describing the shot, so nothing breaks while you swap them in one at a time.

## 5. Email

The enquiry form needs a Resend account before it can deliver mail:

- [ ] Resend account created, and the domain verified in it
- [ ] `RESEND_API_KEY` added to the Vercel project
- [ ] `ENQUIRY_TO_EMAIL` set to the inbox you actually read
- [ ] One test enquiry sent and received, start to finish
