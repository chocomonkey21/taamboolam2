import type { ReactNode } from "react";
import { Photo } from "./Photo";

/**
 * One editorial spread on The Experience page. Always the same three beats:
 * a big photo, a short story, and one detail callout. Repeating the pattern
 * is what makes the page read as a magazine rather than a list of amenities.
 */
export function StorySection({
  index,
  eyebrow,
  title,
  src,
  alt,
  brief,
  children,
  detail,
  id,
}: {
  index: string;
  eyebrow: string;
  title: string;
  src: string;
  alt: string;
  brief?: string;
  children: ReactNode;
  /** The one specific fact. Not a summary — a detail. */
  detail: string;
  id: string;
}) {
  return (
    <section id={id} className="section-rhythm scroll-mt-24">
      <div className="container-content">
        <p className="type-eyebrow">
          {index} — {eyebrow}
        </p>
        <h2 className="type-h1 mt-5 max-w-[20ch]">{title}</h2>
      </div>

      <div className="mt-10 md:mt-14">
        <Photo
          src={src}
          alt={alt}
          brief={brief}
          aspect="16 / 9"
          rounded={false}
          sizes="100vw"
        />
      </div>

      <div className="container-content mt-12 md:mt-16">
        <div className="md:grid md:grid-cols-12 md:gap-6 lg:gap-8">
          <div className="measure md:col-span-8 md:col-start-4">
            <div className="space-y-6">{children}</div>

            <aside className="mt-12 rounded-md border border-border bg-surface p-7 md:p-8">
              <p className="type-eyebrow">Detail</p>
              <p className="type-h3 mt-4">{detail}</p>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
