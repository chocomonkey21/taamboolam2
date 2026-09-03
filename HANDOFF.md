# Handover

The site is live at **https://www.taamboolam.com**.

This page is for whoever looks after it next — the owner, or a developer they
bring in. It says who owns what, what to do when something needs changing, and
what breaks if nobody does anything.

`README.md` explains how the code is built. `CONTENT.md` is for the owner and
lists what the site still needs from them. This one is about custody.

---

## 1. Accounts — fill this in and keep it somewhere safe

Four accounts keep the site alive. **If any of them is owned by an email
address nobody at the house controls, the house does not really own its
website.** That is the single most important thing on this page.

| What | Where | Owned by | Cost |
|---|---|---|---|
| Domain `taamboolam.com` | *registrar:* ______________ | ______________ | ~₹800–1,200 / year |
| Hosting | Vercel | ______________ | Free (Hobby) |
| Enquiry email | Resend | ______________ | Free (3,000/month) |
| Source code | GitHub — `chocomonkey21/taamboolam2` | ______________ | Free |
| Enquiry inbox | `taamboolaminn@gmail.com` | The owner | — |

**Before the project is considered handed over:**

- [ ] Every row above has a name in it
- [ ] The domain auto-renews, and the card on file is one that will not expire
- [ ] Two-factor authentication is on the registrar, Vercel, Resend and GitHub
- [ ] The owner has a written note of the four logins, offline
- [ ] The Vercel project and the GitHub repository are transferred to, or at
      minimum shared with, an account the owner controls

**The domain is the one that actually bites.** Hosting going down is an hour's
work to restore. A lapsed domain can be bought by somebody else within days,
and there is no way to get it back.

---

## 2. Where things live

```
Domain (registrar)  ──DNS──▶  Vercel  ──builds from──▶  GitHub: main
                                 │
                                 └── enquiry form ──▶ Resend ──▶ taamboolaminn@gmail.com
```

- **Pushing to `main` deploys.** There is no separate publish step, and no
  staging site. A bad push is live in about ninety seconds.
- **A push to any other branch** builds a preview at its own URL and touches
  nothing public. That is the safe way to try something.
- **The apex redirects to www.** `https://taamboolam.com` answers 308 and sends
  everything to `https://www.taamboolam.com`. If that is ever flipped in
  Vercel, `site.url` in `lib/site.ts` has to be flipped with it — see the note
  on that value.

### Environment variables

Set in **Vercel → the project → Settings → Environment Variables**. They are
not in the repository and must never be.

| Name | Purpose |
|---|---|
| `RESEND_API_KEY` | Lets the form send. Without it every enquiry is refused with an honest error. |
| `ENQUIRY_FROM_EMAIL` | Must be on the verified domain. Gmail cannot be a sender. |
| `ENQUIRY_TO_EMAIL` | Optional. Overrides where enquiries land — used for testing, then removed. |

**Changing one needs a redeploy.** Vercel → Deployments → the latest → ⋯ →
Redeploy. Editing the value alone does nothing to the running site.

---

## 3. Changing the site

Everything an owner is likely to want changed lives in four files. None of them
requires understanding the rest of the code.

| To change | File |
|---|---|
| Any English wording | `lib/content/en.ts` |
| Any Kannada wording | `lib/content/kn.ts` |
| Phone, email, address, map pin, Instagram | `lib/site.ts` |
| A photograph | drop a file into `public/images/` with the same name |

**The two language files are locked together on purpose.** They both satisfy
one `Content` type, so adding a line to the English file is a build error until
the Kannada exists too. That is deliberate: it makes a half-translated site
impossible to ship by accident. It also means **every content change needs
somebody who can write Kannada**, or the site will not build.

### Photographs

`scripts/build-photos.mjs` holds the source file, crop, grade and output size
for all twenty-one images, and regenerates the whole set:

```bash
node scripts/build-photos.mjs
```

It reads the owner's originals and only writes into `public/images/`. To swap a
photograph, change the entry in that script and run it — not by hand-editing
files in `public/images/`, or the next run will overwrite the change.

`public/images/README.md` lists what each photograph shows and what still has
none.

### The icon

`app/icon.svg` is the drawing. Everything else — the iOS icon, the Android
icon, `favicon.ico` — is generated from it:

```bash
node scripts/build-icons.mjs
```

---

## 4. When something breaks

**The form stops sending.** The guest sees an honest error, not a false
thank-you — that is by design, so nothing is silently lost. Check in this
order: Resend's dashboard for a failed send or an exhausted quota; whether
`RESEND_API_KEY` is still set in Vercel; whether the domain is still verified
in Resend. Enquiries submitted during an outage **are not stored anywhere** and
cannot be recovered. If the form is down, the WhatsApp button still works.

**The site is down.** Check Vercel → Deployments for a failed build. The
previous successful deployment can be promoted back in one click — use that
first and diagnose afterwards.

**The site is up but wrong.** Same fix: roll back to the last good deployment,
then work out what happened on a branch.

**The domain stops resolving.** Almost always an expired registration or a
changed DNS record. Nothing in this repository can cause it.

### Deliberate behaviours that look like faults

- **No analytics.** There is no traffic data at all. This was a choice.
- **No prices, no availability, no booking.** Also choices — see `CONTENT.md`.
- **The form refuses rather than pretends.** A 503 with a real message is
  correct behaviour when mail is misconfigured.
- **A guest submitting many enquiries quickly is rate-limited.** Five per ten
  minutes per address, three per hour per email.

---

## 5. Known limits

Honest, and none of them urgent.

**Rate limiting is per-instance.** The counter lives in one server's memory, so
on a platform that runs several, the real limit is looser than the numbers
above. `lib/request-guard.ts` has a `ThrottleStore` interface ready for a
shared store — a one-file change once somebody picks a provider. Until then the
form is protected against one abuser and not a coordinated one.

**`middleware.ts` is deprecated in Next 16** and will stop working in Next 17.
It generates the per-request nonce for the Content-Security-Policy. The
migration is `npx @next/codemod@canary middleware-to-proxy .` — do it on a
branch, check a preview deploy, and do not do it the week of anything
important. If it goes wrong the site stops loading.

**No automated tests.** The site is small and content-heavy, and was verified by
reading rendered pages and measuring contrast rather than by a suite. A change
to `lib/enquiry.ts` or `lib/request-guard.ts` deserves manual care.

**No backups of enquiries.** Nothing is stored. The record of an enquiry is the
email, in the owner's inbox.

`SECURITY.md` documents what the code defends against, what it does not, and
the hosting checklist that sits outside this repository.

---

## 6. Running it locally

```bash
npm install
npm run dev
```

The form works without configuration and will not pretend to send. To see the
confirmation screen without a live mail account, put `ENQUIRY_DRY_RUN=true` in
`.env.local` — the enquiry is logged to the terminal and the success screen
says on screen that nothing was delivered.

```bash
npm run build        # production build; also runs the placeholder check
npx tsc --noEmit     # type check, including that both languages are complete
```

**Never test against the live site with the owner's inbox as the recipient.**
Set `ENQUIRY_TO_EMAIL` to your own address first, and remove it afterwards.
