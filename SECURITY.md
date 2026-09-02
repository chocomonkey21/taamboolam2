# Security

What this repository protects against, what it does not, and what has to be
configured outside it before the site is public.

Nothing here claims the site is "secure" in absolute terms. It lists what was
tested and what was left.

---

## Reporting a problem

`stay@taamboolam.com`. There is no bug bounty — this is a homestay's website,
run by the family — but the address is read by a person who will answer. Also
published at `/.well-known/security.txt`.

---

## What the code does

### The enquiry endpoint

`POST /api/enquire` is the only endpoint that accepts input, sends mail, and
handles personal data. Checks run cheapest-first, so an abusive request is
turned away before the server does work worth the attacker's time.

| Order | Check | Rejects with |
|---|---|---|
| 1 | Origin, when one is sent, must be our own host | `403` |
| 2 | Declared `Content-Length` over 16KB | `413` |
| 3 | Per-address throttle — 5 per 10 minutes | `429` + `Retry-After` |
| 4 | Body read with a hard 16KB ceiling | `413` / `400` |
| 5 | Every field forced to its declared type | — |
| 6 | Honeypot field filled | `200`, silently dropped |
| 7 | Full server-side validation | `422` |
| 8 | Per-email throttle — 3 per hour | `429` |
| 9 | Duplicate within 5 minutes | `200`, marked duplicate |
| 10 | Mail send, 10s deadline | `502` on timeout or failure |

The whole invocation is capped at 15 seconds (`maxDuration`).

**Why the per-email limit exists.** The endpoint sends a confirmation copy to
an address the sender chooses, which makes it a small mail relay pointed at a
stranger. A per-address limit alone does not cover somebody rotating IPs to
target one victim — the shape of abuse that gets a sending domain blocklisted.

**Why the duplicate window exists.** A double click or a retry after a flaky
connection arrives as two identical enquiries. The second is answered as
success, because it is true that their message reached us, and telling them
otherwise invites a third.

### Mail

- Every interpolated value is HTML-escaped. No guest input is placed in the
  message as raw markup.
- The two values that reach a mail header — the name in the Subject, the
  address in Reply-To — are stripped of control characters. The validator
  separately refuses whitespace inside an address, so a CRLF cannot reach
  Reply-To even if that stripping were removed.
- Delivery is never claimed unless the provider confirms it. With no API key
  the endpoint answers `503` and the interface tells the guest plainly to write
  directly. There is no thank-you for a message that went nowhere.

### Data handling

- Nothing is stored. No database, no session, no file writes.
- Logs carry the visit type and the language, never a name, address, phone
  number or free text.
- Throttle state holds a non-reversible fingerprint of the email address, not
  the address itself, so a running process is not also a list of everyone who
  has written in.
- One cookie exists: the language preference. `SameSite=Lax`, and `Secure` once
  the page is on HTTPS.
- No analytics, no tracking, no third-party scripts. Deliberate, and it should
  stay that way.

### Headers

Set in `next.config.ts` (constant) and `middleware.ts` (per-request CSP):

- `Content-Security-Policy` — nonce-based with `'strict-dynamic'`. Not the
  `'unsafe-inline'` version, which stops almost no XSS. `'unsafe-eval'` and the
  websocket origins are gated on `NODE_ENV` and are absent from production
  builds.
- `X-Frame-Options: DENY` and `frame-ancestors 'none'`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` — every device permission denied
- `Strict-Transport-Security` — two years, subdomains included, **preload not
  claimed** (see below)
- `Cross-Origin-Opener-Policy: same-origin`

`style-src` keeps `'unsafe-inline'`. A dozen components set real inline `style`
attributes and nonces do not apply to style attributes; inline CSS is a far
weaker vector than inline script. This is the standard trade, recorded rather
than hidden.

### Availability, at the code level

- Photographs answer `max-age=3600, stale-while-revalidate=604800`. They
  previously answered `max-age=0`, so every view revalidated all twenty-four.
  Not `immutable`: the owner replaces photographs by filename, and a year-long
  immutable cache would strand visitors on the stock imagery.
- No unbounded loops, no unbounded memory. The throttle map sweeps expired keys
  once it passes 5000 entries.
- No synchronous blocking work in the request path.
- Preview deployments serve `Disallow: /`, so branch URLs are not indexed.

---

## What the code cannot do

**The in-memory throttle is not durable.** It lives in one process. On a
platform that runs several instances, or freezes and thaws them between
requests, each instance counts separately and the effective limit is looser
than the numbers above — by roughly the instance count. It raises the cost of
casual abuse and does nothing against a distributed one.

`lib/request-guard.ts` defines a `ThrottleStore` interface for exactly this
reason. Swapping in Vercel KV, Upstash or Redis means implementing that
interface and returning it from `throttleStore()`. Nothing else changes, and no
dependency has been added until somebody chooses a provider.

**Until that is configured, the enquiry endpoint is protected against one
abuser and not against a coordinated one.**

**A codebase cannot provide DDoS protection.** Rate limiting inside the
function still costs an invocation. Everything that actually absorbs a flood
sits in front of the application.

---

## Before going live — operational checklist

Nothing below is in this repository. All of it is the owner's or the deployer's.

### DNS and TLS
- [ ] Domain registered to the owner, registrar lock on, 2FA on the registrar
- [ ] DNS behind a provider with DDoS absorption (Cloudflare, Vercel's own)
- [ ] HTTPS enforced, HTTP redirected
- [ ] Consider HSTS preload **only** when certain every subdomain will be HTTPS
      forever — submission is close to irreversible
- [ ] CAA record limiting who may issue certificates

### Edge protection
- [ ] CDN/WAF in front of the origin
- [ ] Bot protection on `/api/enquire` specifically
- [ ] Edge rate limiting — the real fix for the durability gap above
- [ ] Origin not reachable except through the CDN

### Mail
- [ ] `RESEND_API_KEY` set in the hosting project, never committed
- [ ] `ENQUIRY_TO_EMAIL` set to an inbox somebody reads
- [ ] `ENQUIRY_FROM_EMAIL` on a domain with SPF, DKIM and DMARC published
- [ ] Sending quota and alerting configured, so a flood is visible
- [ ] One real enquiry sent end to end and confirmed to arrive

### Application configuration
- [ ] `NEXT_PUBLIC_SITE_HOST` set to the production host, so the origin check
      covers the real domain as well as the Vercel URL
- [ ] Environment variables set per-environment, production values not shared
      with preview

### Repository and access
- [ ] Branch protection on `main` — no direct pushes, review required
- [ ] 2FA on every account with write access
- [ ] Deployment access limited to people who need it
- [ ] Secret scanning enabled on the repository

### Operations
- [ ] Uptime monitoring with alerts to somebody who will act
- [ ] Error alerting from the hosting platform
- [ ] Someone named as the contact for an incident
- [ ] The owner knows how to take the site down if it is ever necessary

---

## Known and accepted

| Item | Why it is left |
|---|---|
| In-memory throttle | Needs a provider decision; boundary is in place |
| `style-src 'unsafe-inline'` | Nonces do not apply to style attributes |
| No CSRF token | No cookie-based auth and no authenticated state to abuse |
| `x-forwarded-for` is forgeable | A throttle key, never an identity |
| `/images/README.md` and `CREDITS.json` are public | Owner's working notes, no secrets; kept out of search by `robots.txt` |
| HSTS preload not claimed | Effectively irreversible; the owner's call |

---

## Tested

Against a local build: malformed and mistyped payloads, oversized bodies,
cross-origin posts, per-address and per-email flooding, duplicate submission,
header-injection attempts in the name and address, honeypot behaviour,
production header output, dependency audit, secret scan, and the absence of
client source maps.

Not tested, and outside this repository: the live hosting configuration, TLS,
DNS, the CDN, and the mail provider account.
