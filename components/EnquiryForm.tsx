"use client";

import { useRef, useState } from "react";
import { Button } from "./Button";
import { Field } from "./Field";
import { TileGlyph } from "./TileMotif";
import {
  emptyEnquiry,
  validateEnquiry,
  type EnquiryErrors,
  type EnquiryFields,
} from "@/lib/enquiry";
import { site } from "@/lib/site";

type Status = "idle" | "sending" | "sent" | "failed";

export function EnquiryForm() {
  const [values, setValues] = useState<EnquiryFields>(emptyEnquiry);
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  // False when the server accepted the enquiry but could not email a copy,
  // so the confirmation never claims something that did not happen.
  const [copySent, setCopySent] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);

  function set<K extends keyof EnquiryFields>(key: K, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    // Clear an error as soon as the guest starts fixing it.
    setErrors((current) =>
      current[key] ? { ...current, [key]: undefined } : current,
    );
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validateEnquiry(values);
    setErrors(found);

    const firstError = Object.keys(found)[0];
    if (firstError) {
      formRef.current
        ?.querySelector<HTMLElement>(`[id="${firstError}"]`)
        ?.focus();
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/enquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (response.status === 422) {
        // The server disagreed with the browser. Show its errors rather than a
        // generic failure, so the guest knows what to change.
        const body = await response.json();
        setErrors(body.errors ?? {});
        setStatus("idle");
        return;
      }
      if (!response.ok) throw new Error("Request failed");
      const body = await response.json().catch(() => ({}));
      setCopySent(body.delivered !== false);
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-md border border-border bg-surface p-8 md:p-12">
        <TileGlyph className="w-10 text-accent-primary opacity-40" />
        <h2 className="type-h2 mt-7">Your message is with us.</h2>
        <p className="type-body mt-5 max-w-[46ch] text-foreground-muted">
          {site.host} reads every enquiry herself and usually writes back within
          a day. If you do not hear from us, check your spam folder, then call
          or send a message on WhatsApp.
        </p>
        {copySent ? (
          <p className="type-body mt-5 max-w-[46ch] text-foreground-muted">
            We have sent a copy to {values.email} so you have it.
          </p>
        ) : null}
        <p className="type-body mt-8">
          <a
            className="type-label text-accent-primary underline decoration-accent-primary/40 decoration-1 underline-offset-[6px] transition-colors duration-200 hover:decoration-accent-primary"
            href={`https://wa.me/${site.contact.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Message us on WhatsApp
          </a>
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-8">
      {/* Honeypot. Hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(event) => set("website", event.target.value)}
        />
      </div>

      <Field id="name" label="Your name" error={errors.name}>
        {(props) => (
          <input
            {...props}
            type="text"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(event) => set("name", event.target.value)}
          />
        )}
      </Field>

      <div className="grid gap-8 sm:grid-cols-2">
        <Field id="email" label="Email" error={errors.email}>
          {(props) => (
            <input
              {...props}
              type="email"
              name="email"
              autoComplete="email"
              value={values.email}
              onChange={(event) => set("email", event.target.value)}
            />
          )}
        </Field>

        <Field id="phone" label="Phone" optional error={errors.phone}>
          {(props) => (
            <input
              {...props}
              type="tel"
              name="phone"
              autoComplete="tel"
              value={values.phone}
              onChange={(event) => set("phone", event.target.value)}
            />
          )}
        </Field>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <Field
          id="arrival"
          label="Arriving"
          optional
          hint="If you know the dates."
          error={errors.arrival}
        >
          {(props) => (
            <input
              {...props}
              type="date"
              name="arrival"
              value={values.arrival}
              onChange={(event) => set("arrival", event.target.value)}
            />
          )}
        </Field>

        <Field id="departure" label="Leaving" optional error={errors.departure}>
          {(props) => (
            <input
              {...props}
              type="date"
              name="departure"
              min={values.arrival || undefined}
              value={values.departure}
              onChange={(event) => set("departure", event.target.value)}
            />
          )}
        </Field>
      </div>

      <Field id="guests" label="How many people" error={errors.guests}>
        {(props) => (
          <input
            {...props}
            type="number"
            name="guests"
            inputMode="numeric"
            min={1}
            max={20}
            className={`${props.className} sm:max-w-[180px]`}
            value={values.guests}
            onChange={(event) => set("guests", event.target.value)}
          />
        )}
      </Field>

      <Field
        id="message"
        label="Your message"
        optional
        hint="Anything you want us to know. What you eat, how you are travelling, why you are coming."
        error={errors.message}
      >
        {(props) => (
          <textarea
            {...props}
            name="message"
            rows={6}
            className={`${props.className} resize-y`}
            value={values.message}
            onChange={(event) => set("message", event.target.value)}
          />
        )}
      </Field>

      {status === "failed" ? (
        <p role="alert" className="type-body text-accent-primary">
          Something went wrong on our side and the message did not send. Please
          try again, or write to us at{" "}
          <a className="underline underline-offset-4" href={`mailto:${site.contact.email}`}>
            {site.contact.email}
          </a>
          .
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-6 pt-2">
        <Button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send this to Radha"}
        </Button>
        <p className="type-caption text-foreground-muted">
          We only use this to reply to you.
        </p>
      </div>
    </form>
  );
}
