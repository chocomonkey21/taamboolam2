import { Photo } from "./Photo";
import { TextLink } from "./Button";

/**
 * A photo paired with one short line and a sentence or two under it. Used
 * once or twice per page to break up the stacked sections without turning
 * into a feature grid.
 */
export function FeatureStrip({
  src,
  alt,
  brief,
  eyebrow,
  line,
  body,
  href,
  linkLabel,
  flip = false,
  tone = "background",
}: {
  src: string;
  alt: string;
  brief?: string;
  eyebrow: string;
  /** The one line of copy. Short. Plain words. */
  line: string;
  body: string;
  href?: string;
  linkLabel?: string;
  /** Put the photo on the right instead of the left. */
  flip?: boolean;
  tone?: "background" | "surface";
}) {
  return (
    <section
      className={`section-rhythm ${tone === "surface" ? "bg-surface" : "bg-background"}`}
    >
      <div className="container-content grid items-center gap-10 md:grid-cols-12 md:gap-6 lg:gap-16">
        <div className={`md:col-span-6 ${flip ? "md:order-2" : ""}`}>
          <Photo
            src={src}
            alt={alt}
            brief={brief}
            aspect="1 / 1"
            sizes="(min-width: 768px) 46vw, 100vw"
          />
        </div>

        <div className={`md:col-span-5 ${flip ? "md:order-1" : "md:col-start-8"}`}>
          <p className="type-eyebrow">{eyebrow}</p>
          <h2 className="type-h2 mt-5">{line}</h2>
          <p className="type-body mt-5 text-foreground-muted">{body}</p>
          {href && linkLabel ? (
            <p className="mt-8">
              <TextLink href={href}>{linkLabel}</TextLink>
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
