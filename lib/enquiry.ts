import type { Content, Locale } from "./content";

export const VISIT_TYPES = ["stay", "gathering", "other"] as const;
export type VisitType = (typeof VISIT_TYPES)[number];

export const FLOOR_PREFERENCES = [
  "any",
  "floor1",
  "floor2",
  "floor3",
  "floor4",
] as const;
export type FloorPreference = (typeof FLOOR_PREFERENCES)[number];

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

/** Today, as a yyyy-mm-dd string, for the date inputs' `min`. */
export function today(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}
