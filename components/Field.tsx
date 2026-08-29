import type { ReactNode } from "react";

// The design system's `border` token is a 1.39:1 hairline — right for
// dividers, but a form control's boundary needs 3:1 to be identifiable
// (WCAG 1.4.11). foreground-muted at 70% lands exactly on 3:1 and keeps the
// same warm hue.
const control =
  "type-body w-full rounded-sm border bg-background px-4 py-4 text-foreground transition-colors duration-200 placeholder:text-foreground-muted/60 focus:border-accent-primary";

/**
 * Every input gets a visible label above it — never a placeholder standing in
 * for one. Errors sit under the field and are announced to screen readers.
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
    "aria-invalid": boolean | undefined;
    "aria-describedby": string | undefined;
  }) => ReactNode;
}) {
  const describedBy =
    [error ? `${id}-error` : null, hint ? `${id}-hint` : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div>
      <label htmlFor={id} className="type-label block text-foreground">
        {label}
        {optional ? (
          <span className="type-caption ml-2 font-normal text-foreground-muted">
            Optional
          </span>
        ) : null}
      </label>

      {hint ? (
        <p id={`${id}-hint`} className="type-caption mt-1.5 text-foreground-muted">
          {hint}
        </p>
      ) : null}

      <div className="mt-2.5">
        {children({
          id,
          className: `${control} ${error ? "border-accent-primary" : "border-foreground-muted/70"}`,
          "aria-invalid": error ? true : undefined,
          "aria-describedby": describedBy,
        })}
      </div>

      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="type-caption mt-2 text-accent-primary"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
