import { NextResponse } from "next/server";
import { content, isLocale } from "@/lib/content";
import {
  emptyEnquiry,
  formatDate,
  validateEnquiry,
  type EnquiryFields,
} from "@/lib/enquiry";
import { isDryRun, sendMail } from "@/lib/mailer";
import {
  asCleanStrings,
  clientKey,
  declaredTooLarge,
  enumsValid,
  fingerprint,
  originAllowed,
  readJsonLimited,
  throttleStore,
} from "@/lib/request-guard";
import { site } from "@/lib/site";
import { tokens } from "@/lib/tokens";

export const runtime = "nodejs";

/**
 * A ceiling on how long one enquiry may occupy an invocation.
 *
 * The mail call now has its own 10-second deadline, so 15 leaves room for
 * the two sends and the surrounding work without letting a wedged request
 * sit on the platform's much longer default. Concurrency is the resource
 * that runs out first under load; this is what stops one slow request from
 * holding a slot the rest of the site needs.
 */
export const maxDuration = 15;

/* ══════════════════════════════════════════════════════════════════════
   Limits

   Five enquiries per address per ten minutes is far more than a real guest
   needs and far less than an abuser wants.

   The per-email limit exists for a specific reason: this endpoint sends a
   confirmation copy to an address the sender chooses, which makes it a small
   mail relay pointed at a stranger. The IP limit alone does not cover somebody
   rotating addresses, and repeatedly targeting one victim is the shape of
   abuse that damages a sending domain's reputation.

   The duplicate window catches the ordinary case instead: a double click, or a
   retry after a flaky connection, arriving as two identical enquiries.
   ══════════════════════════════════════════════════════════════════════ */
const IP_LIMIT = 5;
const IP_WINDOW_MS = 10 * 60 * 1000;
const EMAIL_LIMIT = 3;
const EMAIL_WINDOW_MS = 60 * 60 * 1000;
const DUPLICATE_WINDOW_MS = 5 * 60 * 1000;

/** A provider that accepts a connection and then hangs must not hold the
    invocation open until the platform's own timeout. */
const MAIL_TIMEOUT_MS = 10_000;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Strip anything that could break out of a mail header line.
 *
 * The validator already refuses whitespace inside an email address and caps
 * every short field. This is the second lock on the same door: even if a
 * future edit loosens that regex, nothing carrying a carriage return, a line
 * feed or a control character reaches a Subject or a Reply-To from here.
 */
function sanitiseHeader(value: string): string {
  return value
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .trim();
}

/** One shell, so both emails read as coming from the same house. */
function wrap(body: string): string {
  return `<div style="background:${tokens.paper};padding:32px 16px;font-family:Helvetica,Arial,sans-serif;color:${tokens.ink};line-height:1.6">
  <div style="max-width:560px;margin:0 auto">
    <p style="margin:0 0 28px;font-size:12px;letter-spacing:0.22em;text-transform:uppercase;color:${tokens.inkSoft}">Taamboolam</p>
    ${body}
  </div>
</div>`;
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:9px 16px 9px 0;vertical-align:top;color:${tokens.inkSoft};font-size:14px;white-space:nowrap">${escapeHtml(label)}</td>
    <td style="padding:9px 0;vertical-align:top;font-size:15px">${escapeHtml(value)}</td>
  </tr>`;
}

export async function POST(request: Request) {
  /* ── 1 · The cheapest refusals first ────────────────────────────────
     Everything in this block costs a header lookup. None of it reads the
     body, because the whole point is to turn a flood away before the server
     has done anything worth the attacker's time. The previous version parsed
     the JSON first and checked the rate limit afterwards. */

  if (!originAllowed(request)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  if (declaredTooLarge(request)) {
    return NextResponse.json({ error: "too-large" }, { status: 413 });
  }

  const throttle = throttleStore();
  const byAddress = await throttle.hit(
    `ip:${clientKey(request)}`,
    IP_LIMIT,
    IP_WINDOW_MS,
  );
  if (!byAddress.allowed) {
    return NextResponse.json(
      { error: "rate-limited" },
      { status: 429, headers: { "Retry-After": String(byAddress.retryAfter) } },
    );
  }

  /* ── 2 · Read the body, bounded ─────────────────────────────────────
     A 2MB body used to be buffered and parsed in full before the length
     validator rejected it. This stops reading at the ceiling. */

  const body = await readJsonLimited(request);
  if (!body.ok) {
    return body.reason === "too-large"
      ? NextResponse.json({ error: "too-large" }, { status: 413 })
      : NextResponse.json({ error: "malformed" }, { status: 400 });
  }

  /* ── 3 · Force the payload into the shape the validator expects ─────
     Without this, `{"website": 12345}` reached `.trim()` on a number and the
     route answered 500. Three such bodies were confirmed against the running
     site; all three now fall through to ordinary validation. */

  const values: EnquiryFields = asCleanStrings(emptyEnquiry, body.value);

  // A bot filled in a field no person can see. Accept and drop it silently, so
  // the bot learns nothing from the response.
  if (values.website.trim()) {
    return NextResponse.json({ ok: true, delivered: true });
  }

  /* Closed-set fields, checked before anything indexes an object with them.
     A real browser cannot send a value outside these sets, so this is a
     malformed request rather than a correctable one. */
  if (!enumsValid(values)) {
    return NextResponse.json({ error: "malformed" }, { status: 400 });
  }

  // The same validator the browser ran. Never trust that it did.
  const errors = validateEnquiry(values);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  /* Sanitised, not merely trimmed: these two are the only guest-supplied
     values that leave this function inside a mail header. */
  const name = sanitiseHeader(values.name);
  const email = sanitiseHeader(values.email);
  const emailKey = fingerprint(email);

  /* ── 4 · Now that the address is known to be well-formed, throttle it ── */

  const byEmail = await throttle.hit(
    `email:${emailKey}`,
    EMAIL_LIMIT,
    EMAIL_WINDOW_MS,
  );
  if (!byEmail.allowed) {
    return NextResponse.json(
      { error: "rate-limited" },
      { status: 429, headers: { "Retry-After": String(byEmail.retryAfter) } },
    );
  }

  /* A second identical enquiry inside five minutes is a double click or a
     retry, not a second enquiry. Answered as success: it is true that their
     message reached us, and telling them otherwise would invite a third. */
  const duplicateKey = `dup:${fingerprint(
    email,
    values.visitType,
    values.arrival,
    values.departure,
    values.message,
    values.gatheringDetails,
  )}`;
  const firstTime = await throttle.hit(duplicateKey, 1, DUPLICATE_WINDOW_MS);
  if (!firstTime.allowed) {
    return NextResponse.json({ ok: true, delivered: true, duplicate: true });
  }

  const guestLocale = isLocale(values.locale) ? values.locale : "en";
  const guestCopy = content[guestLocale];
  // The owner's copy is always in English, whichever language the guest used.
  const owner = content.en;

  const visitLabel = {
    stay: owner.form.visitStay,
    gathering: owner.form.visitGathering,
    other: owner.form.visitOther,
  }[values.visitType];

  const floorLabel =
    values.floorPreference === "any"
      ? owner.form.floorAny
      : owner.floors[values.floorPreference].label;

  const details = `<table style="border-collapse:collapse;width:100%;margin:0 0 24px">
    ${row("Name", name)}
    ${row("Email", email)}
    ${row("Phone", values.phone.trim())}
    ${row("Arriving", formatDate(values.arrival))}
    ${row("Leaving", formatDate(values.departure))}
    ${row("Adults", values.adults)}
    ${row("Children", values.children)}
    ${row("Visit type", visitLabel)}
    ${row("Floor preference", floorLabel)}
    ${row("WhatsApp", values.whatsappConsent ? "Yes, may be contacted" : "Not consented")}
    ${row("Wrote in", guestCopy.localeName)}
  </table>`;

  const freeText =
    values.visitType === "gathering"
      ? { label: "About the gathering", body: values.gatheringDetails.trim() }
      : { label: "Message", body: values.message.trim() };

  const toOwner = wrap(
    `<h1 style="margin:0 0 6px;font-size:23px;font-weight:500">Enquiry from ${escapeHtml(name)}</h1>
     <p style="margin:0 0 24px;font-size:14px;color:${tokens.inkSoft}">${escapeHtml(visitLabel)}</p>
     ${details}
     <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.22em;text-transform:uppercase;color:${tokens.inkSoft}">${escapeHtml(freeText.label)}</p>
     <p style="margin:0;white-space:pre-wrap;font-size:15px">${escapeHtml(freeText.body) || "—"}</p>
     <p style="margin:32px 0 0"><a href="mailto:${encodeURI(email)}" style="color:${tokens.clay}">Reply to ${escapeHtml(name)}</a></p>`,
  );

  const result = await sendMail(
    {
      subject: `Enquiry from ${name} — ${values.adults} adult${values.adults === "1" ? "" : "s"}, ${values.children} ${values.children === "1" ? "child" : "children"}`,
      html: toOwner,
      replyTo: email,
    },
    MAIL_TIMEOUT_MS,
  );

  if (result.status === "unconfigured") {
    // Honest: nothing was sent, and the UI says so and offers a direct address.
    return NextResponse.json({ error: "unconfigured" }, { status: 503 });
  }

  if (result.status === "failed" || result.status === "timeout") {
    return NextResponse.json({ error: "failed" }, { status: 502 });
  }

  if (result.status === "dry-run") {
    /* A log line should say the path was taken and nothing more. It carries
       no name, address, phone number or free text. */
    console.info("[enquiry: dry run] a valid enquiry was accepted and not sent", {
      visitType: values.visitType,
      locale: values.locale,
    });
    return NextResponse.json({ ok: true, delivered: false });
  }

  // The guest's copy is a courtesy in their own language. If it fails, the
  // enquiry still reached the owner, so it does not fail the request.
  const guestConfirmation = wrap(
    `<h1 style="margin:0 0 20px;font-size:23px;font-weight:500">${escapeHtml(guestCopy.form.successHeading)}</h1>
     <p style="margin:0 0 24px;font-size:16px">${escapeHtml(guestCopy.form.successBody)}</p>
     ${details}
     <p style="margin:0;font-size:15px">${escapeHtml(site.contact.phone)} · ${escapeHtml(site.contact.email)}</p>`,
  );

  const copySent = await sendMail(
    {
      to: email,
      subject: `${guestCopy.form.successHeading} — Taamboolam`,
      html: guestConfirmation,
    },
    MAIL_TIMEOUT_MS,
  );

  if (copySent.status === "failed" || copySent.status === "timeout") {
    console.error("The guest's confirmation copy did not send.");
  }

  return NextResponse.json({ ok: true, delivered: !isDryRun() });
}
