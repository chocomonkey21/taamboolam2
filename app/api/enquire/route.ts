import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  emptyEnquiry,
  formatDate,
  validateEnquiry,
  type EnquiryFields,
} from "@/lib/enquiry";
import { site } from "@/lib/site";
import { tokens } from "@/lib/tokens";

export const runtime = "nodejs";

const TO = process.env.ENQUIRY_TO_EMAIL ?? site.contact.email;
const FROM =
  process.env.ENQUIRY_FROM_EMAIL ?? `Taamboolam <enquiries@taamboolam.com>`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Shared shell so both emails look like they came from the same house. */
function wrap(body: string): string {
  return `<div style="background:${tokens.background};padding:32px 16px;font-family:Helvetica,Arial,sans-serif;color:${tokens.foreground};line-height:1.6">
  <div style="max-width:560px;margin:0 auto;background:${tokens.background}">
    <p style="margin:0 0 28px;font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:${tokens.foregroundMuted}">Taamboolam</p>
    ${body}
  </div>
</div>`;
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:10px 16px 10px 0;vertical-align:top;color:${tokens.foregroundMuted};font-size:14px;white-space:nowrap">${escapeHtml(label)}</td>
    <td style="padding:10px 0;vertical-align:top;font-size:15px">${escapeHtml(value)}</td>
  </tr>`;
}

export async function POST(request: Request) {
  let payload: Partial<EnquiryFields>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const values: EnquiryFields = { ...emptyEnquiry, ...payload };

  // Honeypot: a bot filled a field no person can see. Accept and drop it, so
  // the bot does not learn anything from the response.
  if (values.website.trim()) {
    return NextResponse.json({ ok: true });
  }

  const errors = validateEnquiry(values);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const name = values.name.trim();
  const email = values.email.trim();
  const message = values.message.trim();

  const details = `<table style="border-collapse:collapse;width:100%;margin:0 0 24px">
    ${row("Name", name)}
    ${row("Email", email)}
    ${row("Phone", values.phone.trim() || "Not given")}
    ${row("Arriving", formatDate(values.arrival))}
    ${row("Leaving", formatDate(values.departure))}
    ${row("Guests", values.guests)}
  </table>`;

  const toRadha = wrap(
    `<h1 style="margin:0 0 24px;font-size:24px;font-weight:500">New enquiry from ${escapeHtml(name)}</h1>
     ${details}
     <p style="margin:0 0 8px;font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:${tokens.foregroundMuted}">Message</p>
     <p style="margin:0;white-space:pre-wrap;font-size:15px">${escapeHtml(message) || "<span style='color:${tokens.foregroundMuted}'>No message.</span>"}</p>
     <p style="margin:32px 0 0"><a href="mailto:${escapeHtml(email)}" style="color:${tokens.accentPrimary}">Reply to ${escapeHtml(name)}</a></p>`,
  );

  const toGuest = wrap(
    `<h1 style="margin:0 0 24px;font-size:24px;font-weight:500">Thank you, ${escapeHtml(name.split(" ")[0])}.</h1>
     <p style="margin:0 0 20px;font-size:16px">Your message reached us. ${site.host} reads every enquiry herself and usually writes back within a day.</p>
     <p style="margin:0 0 28px;font-size:16px">Here is what you sent, so you have a copy.</p>
     ${details}
     ${message ? `<p style="margin:0 0 8px;font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:${tokens.foregroundMuted}">Your message</p><p style="margin:0 0 28px;white-space:pre-wrap;font-size:15px">${escapeHtml(message)}</p>` : ""}
     <p style="margin:0;font-size:16px">If you would rather talk, call or send a message on WhatsApp: ${escapeHtml(site.contact.phone)}.</p>`,
  );

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // No key configured. In development that is expected, so log the enquiry
    // and let the flow be testable. In production it is a real failure.
    if (process.env.NODE_ENV === "production") {
      console.error("RESEND_API_KEY is not set. Enquiry was not delivered.");
      return NextResponse.json(
        { error: "Email is not configured." },
        { status: 500 },
      );
    }
    console.info("[enquiry — not sent, no RESEND_API_KEY]", {
      name,
      email,
      phone: values.phone,
      arrival: values.arrival,
      departure: values.departure,
      guests: values.guests,
      message,
    });
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const resend = new Resend(apiKey);

    const sent = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `Enquiry from ${name} — ${values.guests} guest${values.guests === "1" ? "" : "s"}`,
      html: toRadha,
    });

    if (sent.error) {
      console.error("Resend failed to deliver the enquiry.", sent.error);
      return NextResponse.json({ error: "Could not send." }, { status: 502 });
    }

    // The guest's copy is a courtesy. If it fails, the enquiry still landed,
    // so do not fail the request over it.
    const confirmation = await resend.emails.send({
      from: FROM,
      to: email,
      subject: "We have your message — Taamboolam",
      html: toGuest,
    });

    if (confirmation.error) {
      console.error("Confirmation email failed.", confirmation.error);
    }

    return NextResponse.json({ ok: true, delivered: true });
  } catch (error) {
    console.error("Unexpected error while sending the enquiry.", error);
    return NextResponse.json({ error: "Could not send." }, { status: 502 });
  }
}
