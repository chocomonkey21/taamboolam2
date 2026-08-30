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

  const name = values.name.trim();
  const email = values.email.trim();

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
    console.info("[enquiry: dry run]", {
      ...values,
      website: undefined,
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
