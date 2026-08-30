"use client";

import type { ReactNode } from "react";
import { useCopy } from "./SiteProvider";

/**
 * The `stone` token is a 1.4:1 hairline — correct for a divider, but a form
 * control's boundary has to reach 3:1 to be identifiable (WCAG 1.4.11), so
 * inputs use ink-soft at 70%, which lands just past 3:1 in the same warm hue.
 */
export const controlClass =
  "type-body w-full rounded-sm border bg-paper px-4 py-3.5 text-ink transition-colors duration-200 placeholder:text-ink-soft/55 focus:border-clay";

/**
 * A <select> keeps its native menu — the platform's own picker is better on
 * touch than anything rebuilt from divs, and it is keyboard-complete for free.
 * Only the closed control is restyled: the default arrow is replaced with one
 * drawn in the house's ink, so it matches the hairlines around it.
 *
 * The chevron itself lives in `.select-control` in globals.css. It has to:
 * a data URI of that shape does not survive Tailwind's arbitrary-value parser,
 * and silently produces a select with `appearance: none` and no arrow at all.
 */
export const selectClass = `${controlClass} select-control pr-11`;

export function fieldBorder(error?: string) {
  return error ? "border-clay" : "border-ink-soft/70";
}

/**
 * Every control gets a visible label above it — never a placeholder standing in
 * for one. Errors sit under the field, are announced, and are pointed at by
 * aria-describedby rather than by colour alone.
 */
export function Field({
  id,
  label,
  error,
  hint,
  optional = false,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: (props: {
    id: string;
    className: string;
    "aria-invalid": true | undefined;
    "aria-describedby": string | undefined;
  }) => ReactNode;
}) {
  const t = useCopy();
  const describedBy =
    [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div>
      <label htmlFor={id} className="type-label block text-ink">
        {label}
        {optional ? (
          <span className="type-caption ml-2 font-normal">
            {t.form.optional}
          </span>
        ) : null}
      </label>

      {hint ? (
        <p id={`${id}-hint`} className="type-caption mt-1.5">
          {hint}
        </p>
      ) : null}

      <div className="mt-2.5">
        {children({
          id,
          className: `${controlClass} ${fieldBorder(error)}`,
          "aria-invalid": error ? true : undefined,
          "aria-describedby": describedBy,
        })}
      </div>

      {error ? (
        <p id={`${id}-error`} className="type-caption mt-2 text-clay">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** A grouped set of radio inputs with a real fieldset and legend. */
export function RadioGroup<T extends string>({
  name,
  legend,
  value,
  options,
  onChange,
}: {
  name: string;
  legend: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (next: T) => void;
}) {
  return (
    <fieldset>
      <legend className="type-label text-ink">{legend}</legend>
      <div className="mt-3 grid gap-2.5">
        {options.map((option) => {
          const id = `${name}-${option.value}`;
          const active = value === option.value;
          return (
            <label
              key={option.value}
              htmlFor={id}
              className={`type-body flex cursor-pointer items-center gap-3 rounded-sm border px-4 py-3 transition-colors duration-200 ${
                active
                  ? "border-clay bg-clay/[0.05]"
                  : "border-ink-soft/40 hover:border-ink-soft/70"
              }`}
            >
              <input
                type="radio"
                id={id}
                name={name}
                value={option.value}
                checked={active}
                onChange={() => onChange(option.value)}
                className="h-4 w-4 accent-[var(--color-clay)]"
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
