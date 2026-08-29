export type EnquiryFields = {
  name: string;
  email: string;
  phone: string;
  arrival: string;
  departure: string;
  guests: string;
  message: string;
  /** Honeypot. Real people never fill this — it is hidden from them. */
  website: string;
};

export const emptyEnquiry: EnquiryFields = {
  name: "",
  email: "",
  phone: "",
  arrival: "",
  departure: "",
  guests: "2",
  message: "",
  website: "",
};

export type EnquiryErrors = Partial<Record<keyof EnquiryFields, string>>;

/**
 * Shared by the form and the API route, so the browser and the server never
 * disagree about what counts as a valid enquiry.
 */
export function validateEnquiry(values: EnquiryFields): EnquiryErrors {
  const errors: EnquiryErrors = {};

  if (!values.name.trim()) {
    errors.name = "Please tell us your name.";
  }

  if (!values.email.trim()) {
    errors.email = "We need an email address to reply to.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
    errors.email = "That email address does not look right. Please check it.";
  }

  if (values.phone.trim() && values.phone.trim().replace(/\D/g, "").length < 7) {
    errors.phone = "That phone number looks too short.";
  }

  if (values.arrival && values.departure && values.departure < values.arrival) {
    errors.departure = "The date you leave should come after the date you arrive.";
  }

  const guests = Number(values.guests);
  if (!values.guests.trim()) {
    errors.guests = "Please tell us how many people are coming.";
  } else if (!Number.isInteger(guests) || guests < 1 || guests > 20) {
    errors.guests = "Please enter a number between 1 and 20.";
  }

  if (values.message.trim().length > 4000) {
    errors.message = "That message is very long. Please shorten it a little.";
  }

  return errors;
}

/** e.g. "12 March 2027". Plain and unambiguous for any reader. */
export function formatDate(value: string): string {
  if (!value) return "Not given";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
