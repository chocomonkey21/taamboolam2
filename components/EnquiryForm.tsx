"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  emptyEnquiry,
  FLOOR_PREFERENCES,
  resolveErrors,
  today,
  validateEnquiry,
  type EnquiryFields,
  type FloorPreference,
  type VisitType,
} from "@/lib/enquiry";
import { site } from "@/lib/site";
import { Button } from "./Button";
import { Field, RadioGroup, selectClass } from "./Field";
import { useSite } from "./SiteProvider";
import { TileGlyph } from "./TileMotif";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent"; delivered: boolean }
  | { kind: "failed"; reason: "network" | "server" | "unconfigured" };

/**
 * The enquiry form.
 *
 * It shows no prices, checks no availability, holds no dates and confirms
 * nothing. It sends a message to a person, and says so. The success state is
 * deliberately careful about what it promises: the enquiry arrived, and
 * somebody will reply — not that anything has been booked.
 */
export function EnquiryForm() {
  const { t, locale } = useSite();
  const uid = useId();
  const [values, setValues] = useState<EnquiryFields>(emptyEnquiry);
  const [errors, setErrors] = useState<
    Partial<Record<keyof EnquiryFields, string>>
  >({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const summaryRef = useRef<HTMLDivElement>(null);
  /**
   * Bumped every time a submission is rejected. The focus move has to happen
   * after React has committed the summary's new content, so it runs in an
   * effect keyed on this counter rather than in a requestAnimationFrame from
   * inside the submit handler — that fires before the commit, and the reader
   * is left at the bottom of the form with no idea what went wrong.
   */
  const [rejectedAt, setRejectedAt] = useState(0);

  useEffect(() => {
    if (rejectedAt > 0) summaryRef.current?.focus();
  }, [rejectedAt]);

  /**
   * Arriving from "Ask about this floor" at the end of a chapter, with that
   * floor already chosen. A reader who has just spent a page deciding they
   * like Floor 3 should not have to remember it and find it again in a menu.
   *
   * Read from the URL in an effect rather than through useSearchParams, so
   * this stays a progressive enhancement — the form is identical without it,
   * and it adds no Suspense boundary to a page that otherwise needs none.
   * Anything unrecognised is ignored; the select cannot be pushed into a
   * state it does not have.
   */
  useEffect(() => {
    const asked = new URLSearchParams(window.location.search).get("floor");
    if (asked && (FLOOR_PREFERENCES as readonly string[]).includes(asked)) {
      setValues((current) => ({
        ...current,
        floorPreference: asked as FloorPreference,
      }));
    }
  }, []);

  const isGathering = values.visitType === "gathering";
  const isStay = values.visitType === "stay";
  const field = (name: string) => `${uid}-${name}`;

  function set<K extends keyof EnquiryFields>(key: K, value: EnquiryFields[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    // Clear a field's error as soon as the reader starts fixing it.
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload: EnquiryFields = { ...values, locale };
    const found = validateEnquiry(payload);

    if (Object.keys(found).length > 0) {
      setErrors(resolveErrors(found, t));
      setStatus({ kind: "idle" });
      // Move the reader to the explanation, not just to a red border.
      setRejectedAt((n) => n + 1);
      return;
    }

    setErrors({});
    setStatus({ kind: "sending" });

    try {
      const response = await fetch("/api/enquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const body = (await response.json()) as { delivered?: boolean };
        setStatus({ kind: "sent", delivered: body.delivered !== false });
        return;
      }

      if (response.status === 422) {
        const body = (await response.json()) as {
          errors?: Record<string, never>;
        };
        setErrors(resolveErrors(body.errors ?? {}, t));
        setStatus({ kind: "idle" });
        setRejectedAt((n) => n + 1);
        return;
      }

      setStatus({
        kind: "failed",
        reason: response.status === 503 ? "unconfigured" : "server",
      });
    } catch {
      setStatus({ kind: "failed", reason: "network" });
    }
  }

  /* The confirmation. It replaces the form rather than sitting above it, so
     there is nothing left to submit twice. */
  if (status.kind === "sent") {
    return (
      <div role="status" aria-live="polite" className="py-6 md:py-10">
        <TileGlyph className="w-10 text-clay opacity-40" />
        <h2 className="type-h1 mt-8 max-w-[14ch]">{t.form.successHeading}</h2>
        <p className="type-lead measure mt-6 text-ink-soft">
          {t.form.successBody}
        </p>
        {!status.delivered ? (
          <p className="type-caption measure mt-5">{t.form.devNote}</p>
        ) : null}

        {/* A hairline, then the way back. The button is quiet on purpose: the
            reader has just done the thing this page exists for, and offering
            them a second loud action would undo the moment. */}
        <div className="rule-atmos mt-10 border-t pt-7">
          <Button
            variant="outline"
            onClick={() => {
              setValues(emptyEnquiry);
              setStatus({ kind: "idle" });
            }}
          >
            {t.form.successAgain}
          </Button>
        </div>
      </div>
    );
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-8">
      {/* Anything that needs saying before a reader starts typing. */}
      <div
        ref={summaryRef}
        tabIndex={-1}
        aria-live="assertive"
        className="focus:outline-none"
      >
        {hasErrors ? (
          <p className="type-body rounded-sm border border-clay bg-clay/[0.06] px-4 py-3 text-clay-deep">
            {t.form.errorCheckFields}
          </p>
        ) : null}
        {status.kind === "failed" ? (
          <div className="rounded-sm border border-clay bg-clay/[0.06] px-4 py-3">
            <p className="type-label text-clay-deep">{t.form.errorHeading}</p>
            <p className="type-body mt-1 text-ink">
              {status.reason === "unconfigured"
                ? t.form.errorConfigured
                : t.form.errorBody}
            </p>
          </div>
        ) : null}
      </div>

      {/* First, because everything under it depends on the answer. Dates and
          a phone number are required for a stay and optional otherwise, and
          the gathering question only exists for one of the three — asking
          "how many adults" before asking what the message is even about made
          the reader fill in fields the form might not want. */}
      <RadioGroup<VisitType>
        name={field("visit")}
        legend={t.form.visitType}
        value={values.visitType}
        onChange={(next) => set("visitType", next)}
        options={[
          { value: "stay", label: t.form.visitStay },
          { value: "gathering", label: t.form.visitGathering },
          { value: "other", label: t.form.visitOther },
        ]}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id={field("name")} label={t.form.name} error={errors.name}>
          {(props) => (
            <input
              {...props}
              type="text"
              name="name"
              autoComplete="name"
              required
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
            />
          )}
        </Field>

        <Field id={field("email")} label={t.form.email} error={errors.email}>
          {(props) => (
            <input
              {...props}
              type="email"
              name="email"
              autoComplete="email"
              required
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
            />
          )}
        </Field>

        <Field
          id={field("phone")}
          label={t.form.phone}
          error={errors.phone}
          optional={!isStay}
        >
          {(props) => (
            <input
              {...props}
              type="tel"
              name="phone"
              autoComplete="tel"
              inputMode="tel"
              required={isStay}
              value={values.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          )}
        </Field>

        {/* text + inputMode + pattern, not type="number".
            iOS Safari ignores inputMode on a real number input and shows the
            full keyboard with a number strip, when what is wanted is the plain
            numeric pad. This combination is what actually produces it, and the
            range is enforced by the shared validator either way — nothing here
            relied on the browser's own min/max. It also loses the spinner,
            which nobody wants on a count of two. */}
        <div className="grid grid-cols-2 gap-4">
          <Field id={field("adults")} label={t.form.adults} error={errors.adults}>
            {(props) => (
              <input
                {...props}
                type="text"
                name="adults"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="off"
                required
                value={values.adults}
                onChange={(e) => set("adults", e.target.value)}
              />
            )}
          </Field>

          <Field
            id={field("children")}
            label={t.form.children}
            error={errors.children}
          >
            {(props) => (
              <input
                {...props}
                type="text"
                name="children"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="off"
                required
                value={values.children}
                onChange={(e) => set("children", e.target.value)}
              />
            )}
          </Field>
        </div>

        {/* Only a stay actually needs dates. A gathering is usually being
            planned before one exists, so they are offered rather than
            demanded — and marked Optional so the form says which it is. */}
        <Field
          id={field("arrival")}
          label={t.form.arrival}
          error={errors.arrival}
          optional={!isStay}
        >
          {(props) => (
            <input
              {...props}
              type="date"
              name="arrival"
              min={today()}
              required={isStay}
              value={values.arrival}
              onChange={(e) => set("arrival", e.target.value)}
            />
          )}
        </Field>

        <Field
          id={field("departure")}
          label={t.form.departure}
          error={errors.departure}
          optional={!isStay}
        >
          {(props) => (
            <input
              {...props}
              type="date"
              name="departure"
              min={values.arrival || today()}
              required={isStay}
              value={values.departure}
              onChange={(e) => set("departure", e.target.value)}
            />
          )}
        </Field>
      </div>

      <Field
        id={field("floor")}
        label={t.form.floorPreference}
        optional
      >
        {(props) => (
          <select
            {...props}
            className={selectClass}
            name="floorPreference"
            value={values.floorPreference}
            onChange={(e) =>
              set("floorPreference", e.target.value as FloorPreference)
            }
          >
            <option value="any">{t.form.floorAny}</option>
            <option value="floor1">{t.floors.floor1.label}</option>
            <option value="floor2">{t.floors.floor2.label}</option>
            <option value="floor3">{t.floors.floor3.label}</option>
            <option value="floor4">{t.floors.floor4.label}</option>
          </select>
        )}
      </Field>

      {/* Only asked when it is relevant, and required only then. */}
      {isGathering ? (
        <Field
          id={field("gathering")}
          label={t.form.gatheringDetails}
          hint={t.form.gatheringHint}
          error={errors.gatheringDetails}
        >
          {(props) => (
            <textarea
              {...props}
              name="gatheringDetails"
              rows={5}
              required
              value={values.gatheringDetails}
              onChange={(e) => set("gatheringDetails", e.target.value)}
            />
          )}
        </Field>
      ) : (
        <Field
          id={field("message")}
          label={t.form.message}
          hint={t.form.messageHint}
          error={errors.message}
          optional
        >
          {(props) => (
            <textarea
              {...props}
              name="message"
              rows={5}
              value={values.message}
              onChange={(e) => set("message", e.target.value)}
            />
          )}
        </Field>
      )}

      <label className="type-body flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          name="whatsappConsent"
          checked={values.whatsappConsent}
          onChange={(e) => set("whatsappConsent", e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-clay)]"
        />
        <span>{t.form.whatsappConsent}</span>
      </label>

      {/* Honeypot. Hidden from people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={field("website")}>Website</label>
        <input
          id={field("website")}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => set("website", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button type="submit" disabled={status.kind === "sending"}>
          {status.kind === "sending"
            ? t.form.submitting
            : isGathering
              ? t.form.submitGathering
              : t.form.submitStay}
        </Button>

        {/* For a house in Bengaluru, WhatsApp is not a fallback — it is how a
            lot of people would rather open a conversation. Offered as a plain
            alternative next to the button rather than a floating bubble, so it
            is available without competing with the form. */}
        <a
          href={`https://wa.me/${site.contact.whatsapp}`}
          target="_blank"
          rel="noreferrer noopener"
          className="type-label inline-flex min-h-11 items-center text-ink-soft underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-200 hover:text-ink hover:decoration-current"
        >
          {t.form.orWhatsapp}
        </a>
      </div>

      <div>
        <p className="type-caption measure">{t.form.noPrices}</p>
      </div>
    </form>
  );
}
