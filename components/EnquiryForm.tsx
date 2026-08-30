"use client";

import { useId, useRef, useState } from "react";
import {
  emptyEnquiry,
  resolveErrors,
  today,
  validateEnquiry,
  type EnquiryFields,
  type FloorPreference,
  type VisitType,
} from "@/lib/enquiry";
import { Button } from "./Button";
import { Field, RadioGroup } from "./Field";
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

  const isGathering = values.visitType === "gathering";
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
      requestAnimationFrame(() => summaryRef.current?.focus());
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
        requestAnimationFrame(() => summaryRef.current?.focus());
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
      <div
        role="status"
        aria-live="polite"
        className="rounded-md border p-8 sm:p-10"
        style={{
          borderColor: "var(--color-stone)",
          backgroundColor: "var(--color-lime)",
        }}
      >
        <TileGlyph className="w-10 text-clay opacity-45" />
        <h2 className="type-h2 mt-6">{t.form.successHeading}</h2>
        <p className="type-lead measure mt-4">{t.form.successBody}</p>
        {!status.delivered ? (
          <p className="type-caption measure mt-5">{t.form.devNote}</p>
        ) : null}
        <div className="mt-8">
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
          <p className="type-body rounded-sm border border-clay bg-clay/[0.06] px-4 py-3 text-clay">
            {t.form.errorCheckFields}
          </p>
        ) : null}
        {status.kind === "failed" ? (
          <div className="rounded-sm border border-clay bg-clay/[0.06] px-4 py-3">
            <p className="type-label text-clay">{t.form.errorHeading}</p>
            <p className="type-body mt-1 text-ink">
              {status.reason === "unconfigured"
                ? t.form.errorConfigured
                : t.form.errorBody}
            </p>
          </div>
        ) : null}
      </div>

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

        <Field id={field("phone")} label={t.form.phone} error={errors.phone}>
          {(props) => (
            <input
              {...props}
              type="tel"
              name="phone"
              autoComplete="tel"
              inputMode="tel"
              required
              value={values.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          )}
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field id={field("adults")} label={t.form.adults} error={errors.adults}>
            {(props) => (
              <input
                {...props}
                type="number"
                name="adults"
                min={1}
                max={30}
                inputMode="numeric"
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
                type="number"
                name="children"
                min={0}
                max={30}
                inputMode="numeric"
                required
                value={values.children}
                onChange={(e) => set("children", e.target.value)}
              />
            )}
          </Field>
        </div>

        <Field
          id={field("arrival")}
          label={t.form.arrival}
          error={errors.arrival}
        >
          {(props) => (
            <input
              {...props}
              type="date"
              name="arrival"
              min={today()}
              required
              value={values.arrival}
              onChange={(e) => set("arrival", e.target.value)}
            />
          )}
        </Field>

        <Field
          id={field("departure")}
          label={t.form.departure}
          error={errors.departure}
        >
          {(props) => (
            <input
              {...props}
              type="date"
              name="departure"
              min={values.arrival || today()}
              required
              value={values.departure}
              onChange={(e) => set("departure", e.target.value)}
            />
          )}
        </Field>
      </div>

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

      <Field
        id={field("floor")}
        label={t.form.floorPreference}
        optional
      >
        {(props) => (
          <select
            {...props}
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
        <p className="type-caption measure">{t.form.noPrices}</p>
      </div>
    </form>
  );
}
