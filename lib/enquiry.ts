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
 * One validator, used by the browser and again by the server, so the two can
 * never disagree about what a valid enquiry is. It returns message *keys*
 * rather than sentences, because the same enquiry may be shown to the guest in
 * Kannada and mailed to the owner in English.
 */
export function validateEnquiry(values: EnquiryFields): EnquiryErrors {
  const errors: EnquiryErrors = {};

  if (!values.name.trim()) errors.name = "name";

  const email = values.email.trim();
  if (!email) {
    errors.email = "emailMissing";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
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

  const adults = Number(values.adults);
  if (!values.adults.trim()) {
    errors.adults = "adults";
  } else if (!Number.isInteger(adults) || adults < 1 || adults > 30) {
    errors.adults = "adultsRange";
  }

  const children = Number(values.children);
  if (!values.children.trim()) {
    errors.children = "children";
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
