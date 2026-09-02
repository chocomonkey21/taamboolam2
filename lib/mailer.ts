import { Resend } from "resend";
import { withTimeout } from "./request-guard";
import { site } from "./site";


/**
 * The mail boundary.
 *
 * Everything the rest of the app knows about sending mail is the shape below.
 * Swapping Resend for SES, Postmark or a Google Workspace relay means editing
 * this file and nothing else.
 *
 * Two rules it will not bend on:
 *
 *  - With no provider configured it reports `unconfigured`. It never reports a
 *    success it did not have. A guest is told plainly to write to us directly
 *    rather than being shown a thank-you for a message that went nowhere.
 *  - It never logs or returns the provider key.
 *
 * `ENQUIRY_DRY_RUN=true` is the one exception, and it exists only so the
 * confirmation screen can be built and reviewed without a live account. It
 * logs the enquiry to the server terminal, returns `dry-run`, and the UI then
 * says on screen that nothing was sent.
 */

export type MailResult =
  | { status: "sent" }
  | { status: "dry-run" }
  | { status: "unconfigured" }
  | { status: "failed" }
  /** The provider accepted the connection and did not answer in time. */
  | { status: "timeout" };

export type MailMessage = {
  subject: string;
  html: string;
  /** Where the owner's copy goes. Defaults to the address in lib/site.ts. */
  to?: string;
  /** So hitting reply in the owner's mail client writes to the guest. */
  replyTo?: string;
};

const TO = process.env.ENQUIRY_TO_EMAIL ?? site.contact.email;
const FROM =
  process.env.ENQUIRY_FROM_EMAIL ?? `Taamboolam <enquiries@taamboolam.com>`;

export function isMailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export function isDryRun(): boolean {
  return process.env.ENQUIRY_DRY_RUN === "true";
}

export async function sendMail(
  message: MailMessage,
  /**
   * How long to wait for the provider before giving up.
   *
   * There was no deadline at all before this. A provider that accepts a
   * connection and then hangs would hold a serverless invocation open until
   * the platform's own timeout — which is both a bill and a way to exhaust
   * the concurrency the rest of the site needs in order to stay up.
   */
  timeoutMs = 10_000,
): Promise<MailResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    if (isDryRun()) {
      console.info(
        `[enquiry: dry run, nothing sent] to=${message.to ?? TO} subject=${message.subject}`,
      );
      return { status: "dry-run" };
    }
    console.error(
      "RESEND_API_KEY is not set. The enquiry was not delivered and the guest was told so.",
    );
    return { status: "unconfigured" };
  }

  try {
    const resend = new Resend(apiKey);
    const outcome = await withTimeout(
      resend.emails.send({
        from: FROM,
        to: message.to ?? TO,
        replyTo: message.replyTo,
        subject: message.subject,
        html: message.html,
      }),
      timeoutMs,
    );

    if (outcome.timedOut) {
      console.error("The mail provider did not answer within the deadline.");
      return { status: "timeout" };
    }

    const sent = outcome.value;
    if (sent.error) {
      console.error("The mail provider rejected the message.", sent.error);
      return { status: "failed" };
    }
    return { status: "sent" };
  } catch (error) {
    console.error("Unexpected error while sending mail.", error);
    return { status: "failed" };
  }
}
