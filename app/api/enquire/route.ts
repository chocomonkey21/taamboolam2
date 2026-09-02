import { NextResponse } from "next/server";
import { content, isLocale } from "@/lib/content";
import {
  emptyEnquiry,
  formatDate,
  validateEnquiry,
  type EnquiryFields,
} from "@/lib/enquiry";
import { isDryRun, sendMail } from "@/lib/mailer";
import { site } from "@/lib/site";
import { tokens } from "@/lib/tokens";

export const runtime = "nodejs";

/**
 * A fixed-window rate limit, per client address.
 *
 * This endpoint sends mail. Before this, the only thing between it and an
 * unlimited number of POSTs was a honeypot field, which stops naive bots and
 * nothing else — a trivial script could fill the owner's inbox and burn a mail
 * quota. Five in ten minutes is far more than a real guest needs and far less
 * than an abuser wants.
 *
 * KNOWN LIMIT, stated rather than hidden: this counter lives in the memory of
 * one server process. On a platform that runs several instances, or freezes
 * and thaws them per request, each instance keeps its own count and the
 * effective limit is looser than the number below. It raises the cost of abuse;
 * it does not make abuse impossible. A shared store is the real fix and that is
 * a deployment decision, not a code one.
 */
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, { count: number; resetAt: number }>();

function clientKey(request: Request): string {
  /* On Vercel the client address arrives in x-forwarded-for. Take the FIRST
     entry: the left-most is the original client and anything after it is a
     proxy. A caller can forge this header, so it is a throttle on ordinary
     abuse, never an identity. */
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function rateLimited(request: Request): number | null {
  const key = clientKey(request);
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    /* Opportunistic sweep, so the map cannot grow without bound on a
       long-lived process. It only runs when a new window opens. */
    if (hits.size > 5000) {
      for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k);
    }
    return null;
  }

  if (entry.count >= RATE_LIMIT) {
    return Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
  }

  entry.count += 1;
  return null;
}

/**
 * Strip anything that could break out of a mail header line.
 *
 * The validator already rejects whitespace inside an email address and caps
 * every short field. This is the second lock on the same door: even if a
 * future edit loosens that regex, nothing carrying a carriage return, a line
 * feed or a control character reaches a Subject or a Reply-To from here.
 */
function sanitiseHeader(value: string): string {
  return value.replace(/[\r\n\u0000-\u001f\u007f]/g, " ").trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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
  let payload: Partial<EnquiryFields>;
  try {
    payload = (await request.json()) as Partial<EnquiryFields>;
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const retryAfter = rateLimited(request);
  if (retryAfter !== null) {
    return NextResponse.json(
      { error: "rate-limited" },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  const values: EnquiryFields = { ...emptyEnquiry, ...payload };

  // A bot filled in a field no person can see. Accept and drop it silently, so
  // the bot learns nothing from the response.
  if (values.website.trim()) {
    return NextResponse.json({ ok: true, delivered: true });
  }

  // The same validator the browser ran. Never trust that it did.
  const errors = validateEnquiry(values);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const guestLocale = isLocale(values.locale) ? values.locale : "en";
  const guestCopy = content[guestLocale];
  // The owner's copy is always in English, whichever language the guest used.
  const owner = content.en;

  /* Sanitised, not merely trimmed: these two are the only guest-supplied
     values that leave this function inside a mail header. */
  const name = sanitiseHeader(values.name);
  const email = sanitiseHeader(values.email);

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
     <p style="margin:32px 0 0"><a href="mailto:${escapeHtml(email)}" style="color:${tokens.clay}">Reply to ${escapeHtml(name)}</a></p>`,
  );

  const result = await sendMail({
    subject: `Enquiry from ${name} — ${values.adults} adult${values.adults === "1" ? "" : "s"}, ${values.children} ${values.children === "1" ? "child" : "children"}`,
    html: toOwner,
    replyTo: email,
  });

  if (result.status === "unconfigured") {
    // Honest: nothing was sent, and the UI says so and offers a direct address.
    return NextResponse.json({ error: "unconfigured" }, { status: 503 });
  }

  if (result.status === "failed") {
    return NextResponse.json({ error: "failed" }, { status: 502 });
  }

  if (result.status === "dry-run") {
    /* Was: the whole enquiry object, which put the guest's name, email
       address, phone number and free text into the server log on every dry
       run. A log line should say the path was taken and nothing more. */
    console.info(
      "[enquiry: dry run] a valid enquiry was accepted and not sent",
      { visitType: values.visitType, locale: values.locale },
    );
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

  const copySent = await sendMail({
    to: email,
    subject: `${guestCopy.form.successHeading} — Taamboolam`,
    html: guestConfirmation,
  });

  if (copySent.status === "failed") {
    console.error("The guest's confirmation copy did not send.");
  }

  return NextResponse.json({ ok: true, delivered: !isDryRun() });
}
