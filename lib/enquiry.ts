import type { Content, Locale } from "./content";

export const VISIT_TYPES = ["stay", "gathering", "other"] as const;
export type VisitType = (typeof VISIT_TYPES)[number];

/**
 * What a guest may ask for.
 *
 * "floor4" is here and "floor5" is not, which looks arbitrary and is not. The
 * house has five floors. Three are let. The fifth is the family's and is never
 * offered. The fourth is private too, but the owner will sometimes arrange it,
 * so a guest is allowed to ask for it — in this form, and nowhere else: the
 * fourth floor is not a chapter on the Experience page and has no `floors`
 * entry, which is why its label lives in `form.floorFourth` rather than in
 * `floors.floor4`. Do not "tidy" it into the floor chapters. "terrace" is
 * here because guests do ask for it — it is shared by everyone staying, and
 * saying so in an enquiry tells the owner something useful.
 *
 * This array is also the allow-list the API route checks a submitted value
 * against, so adding to it is the only way a new option becomes accepted.
 */
export const FLOOR_PREFERENCES = [
  "any",
  "floor1",
  "floor2",
  "floor3",
  "floor4",
  "terrace",
] as const;
export type FloorPreference = (typeof FLOOR_PREFERENCES)[number];

/**
 * The human name for a floor preference, in the reader's language.
 *
 * Not every preference is a floor chapter. "any" is not a floor at all, and
 * the fourth floor is private — it is offered in the form and has no entry in
 * `floors`, so indexing that record with the raw value throws. Both the
 * owner's email and the WhatsApp message need this, so it lives here rather
 * than twice.
 */
export function floorPreferenceLabel(
  preference: FloorPreference,
  t: Content,
): string {
  if (preference === "any") return t.form.floorAny;
  if (preference === "floor4") return t.form.floorFourth;
  return t.floors[preference].label;
}

export type EnquiryFields = {
  name: string;
  email: string;
  phone: string;
  arrival: string;
  departure: string;
  adults: string;
  children: string;
  visitType: VisitType;
  floorPreference: FloorPreference;
  message: string;
  /** Only asked for, and only required, when the visit is a gathering. */
  gatheringDetails: string;
  whatsappConsent: boolean;
  /** Which language the guest wrote in, so the owner can reply in it. */
  locale: Locale;
  /** Honeypot. Real people never fill this in — it is hidden from them. */
  website: string;
};

export const emptyEnquiry: EnquiryFields = {
  name: "",
  email: "",
  phone: "",
  arrival: "",
  departure: "",
  adults: "2",
  children: "0",
  visitType: "stay",
  floorPreference: "any",
  message: "",
  gatheringDetails: "",
  whatsappConsent: false,
  locale: "en",
  website: "",
};

/** Which translated message to show. Never a literal string — see resolve(). */
export type ErrorKey = keyof Content["form"]["errors"];
export type EnquiryErrors = Partial<Record<keyof EnquiryFields, ErrorKey>>;

const MAX_TEXT = 4000;

/**
 * Caps on the short fields.
 *
 * The two long fields were already bounded; name, email and phone were not
 * bounded at all. Two of those three end up inside a mail header — the name
 * in the Subject, the address in Reply-To — and an unbounded header is a
 * denial-of-service shaped problem before it is anything else. 254 is the
 * longest an email address may be per RFC 5321; the other two are simply far
 * more than any real answer needs.
 */
const MAX_NAME = 120;
const MAX_EMAIL = 254;
const MAX_PHONE = 40;

/**
 * One validator, used by the browser and again by the server, so the two can
 * never disagree about what a valid enquiry is. It returns message *keys*
 * rather than sentences, because the same enquiry may be shown to the guest in
 * Kannada and mailed to the owner in English.
 */
export function validateEnquiry(values: EnquiryFields): EnquiryErrors {
  const errors: EnquiryErrors = {};

  if (!values.name.trim()) {
    errors.name = "name";
  } else if (values.name.length > MAX_NAME) {
    errors.name = "tooLong";
  }

  const email = values.email.trim();
  if (!email) {
    errors.email = "emailMissing";
  } else if (email.length > MAX_EMAIL) {
    errors.email = "tooLong";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    /* \s covers CR and LF, so an address that passes this can never carry a
       line break into the Reply-To header. That is load-bearing rather than
       incidental — sanitiseHeader() in the API route is the other half. */
    errors.email = "emailInvalid";
  }

  /**
   * A number is worth insisting on when somebody is actually coming to stay —
   * arrivals get coordinated by phone here, not by email. For a gathering
   * enquiry or a general question, an email address is enough to reply to, and
   * demanding a phone number is friction on a form whose whole claim is that
   * it only starts a conversation. Validated whenever it is given, either way.
   */
  const phoneDigits = values.phone.replace(/\D/g, "");
  if (!values.phone.trim()) {
    if (values.visitType === "stay") errors.phone = "phoneMissing";
  } else if (values.phone.length > MAX_PHONE) {
    errors.phone = "tooLong";
  } else if (phoneDigits.length < 7) {
    errors.phone = "phoneShort";
  }

  /**
   * Dates are only demanded of somebody actually asking to stay. A gathering
   * is often being planned before a date exists, and "Something else" may not
   * involve a date at all — requiring them there turned a form that says it
   * "starts a conversation" into one that refused to send without an itinerary.
   *
   * They are still validated whenever they are supplied, whatever the reason
   * for writing: a departure before an arrival is wrong in every case.
   */
  if (values.visitType === "stay") {
    if (!values.arrival) errors.arrival = "arrival";
    if (!values.departure) errors.departure = "departure";
  }

  if (
    values.arrival &&
    values.departure &&
    values.departure < values.arrival
  ) {
    errors.departure = "departureOrder";
  }

  /* Digits only. Number() would otherwise accept "0x10" as 16 and "1e1"
     as 10 — both inside the range below, so both would have reached the
     owner's email looking like that. A number input really does let
     somebody type 1e1. */
  const digits = /^\d{1,2}$/;
  const adults = Number(values.adults);
  if (!values.adults.trim()) {
    errors.adults = "adults";
  } else if (!digits.test(values.adults.trim())) {
    errors.adults = "adultsRange";
  } else if (!Number.isInteger(adults) || adults < 1 || adults > 30) {
    errors.adults = "adultsRange";
  }

  const children = Number(values.children);
  if (!values.children.trim()) {
    errors.children = "children";
  } else if (!digits.test(values.children.trim())) {
    errors.children = "childrenRange";
  } else if (!Number.isInteger(children) || children < 0 || children > 30) {
    errors.children = "childrenRange";
  }

  if (values.visitType === "gathering" && !values.gatheringDetails.trim()) {
    errors.gatheringDetails = "gatheringDetails";
  }

  if (values.message.length > MAX_TEXT) errors.message = "tooLong";
  if (values.gatheringDetails.length > MAX_TEXT) {
    errors.gatheringDetails = "tooLong";
  }

  return errors;
}

/** Turn a validation result into sentences in the reader's own language. */
export function resolveErrors(
  errors: EnquiryErrors,
  t: Content,
): Partial<Record<keyof EnquiryFields, string>> {
  const out: Partial<Record<keyof EnquiryFields, string>> = {};
  for (const [field, key] of Object.entries(errors) as [
    keyof EnquiryFields,
    ErrorKey,
  ][]) {
    out[field] = t.form.errors[key];
  }
  return out;
}

/** e.g. "12 March 2027". Plain and unambiguous for any reader. */
export function formatDate(value: string): string {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * The same enquiry, written out for WhatsApp.
 *
 * Why this exists: for a homestay in Bengaluru, WhatsApp is not a fallback for
 * people who cannot use a form — it is how a lot of guests would rather open a
 * conversation in the first place. The link beside the submit button used to
 * open an empty chat, which meant a reader who had just filled in eight fields
 * had to type it all again. Now it carries what they wrote.
 *
 * Deliberately NOT an API integration. Sending WhatsApp messages from a server
 * needs a Meta or Twilio business account, a registered sender and template
 * approval, and it would put the house's messages behind a vendor. A wa.me
 * link opens the guest's own WhatsApp with the text ready and them in control
 * of sending it — no account, no key, no third party in the middle, and it
 * works on a phone and in a desktop browser alike.
 *
 * Only fields the guest actually filled in are included: a message listing six
 * blank labels reads like a form, and the point is that it reads like a person
 * wrote it. The free text is capped because a wa.me URL is still a URL.
 */
export function whatsappEnquiry(values: EnquiryFields, t: Content): string {
  const lines: string[] = [];
  const push = (value: string) => {
    if (value && value.trim()) lines.push(value.trim());
  };

  const visit = {
    stay: t.form.visitStay,
    gathering: t.form.visitGathering,
    other: t.form.visitOther,
  }[values.visitType];

  /* Written the way a person writes a message, not the way a form prints
     itself. Labels only where a bare value would be ambiguous: a name and a
     visit type explain themselves, an email address in a list of dates does
     not. "Your name: Tanishk" is what a form says; a person just says their
     name. */
  push(`${t.form.heading} · Taamboolam`);
  lines.push("");
  push(values.name);
  push(visit);

  if (values.arrival || values.departure) {
    const span = [
      values.arrival && `${t.form.arrival} ${formatDate(values.arrival)}`,
      values.departure && `${t.form.departure} ${formatDate(values.departure)}`,
    ]
      .filter(Boolean)
      .join(" · ");
    push(span);
  }

  const people = [
    values.adults && `${values.adults} ${t.form.adults.toLowerCase()}`,
    values.children &&
      values.children !== "0" &&
      `${values.children} ${t.form.children.toLowerCase()}`,
  ]
    .filter(Boolean)
    .join(", ");
  push(people);

  if (values.floorPreference !== "any") {
    push(
      `${t.form.floorPreference}: ${floorPreferenceLabel(values.floorPreference, t)}`,
    );
  }

  push(values.email);

  const free =
    values.visitType === "gathering" ? values.gatheringDetails : values.message;
  if (free.trim()) {
    lines.push("");
    /* Capped because a wa.me link is still a URL, and a guest who pastes an
       essay should get a message that opens rather than one that is silently
       truncated by the browser. */
    push(free.slice(0, 700));
  }

  return lines.join("\n").replace(/\n{3,}/g, "\n\n");
}

/** The wa.me link that opens that message in the guest's own WhatsApp. */
export function whatsappLink(number: string, text: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

/** Today, as a yyyy-mm-dd string, for the date inputs' `min`. */
export function today(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}
