import Image from "next/image";
import { photoExists } from "@/lib/photos";
import { TileGlyph } from "./TileMotif";

type PhotoProps = {
  /** Path under /public, e.g. "/images/hero-courtyard.jpg" */
  src: string;
  /** Real alt text. Required — every meaningful image needs one. */
  alt: string;
  /**
   * CSS aspect-ratio value, e.g. "3 / 2". Use "auto" when the parent already
   * sets a height (the hero) and the photo should simply fill it.
   */
  aspect?: string;
  /** Set on the hero only, so the LCP image is not lazy-loaded. */
  priority?: boolean;
  /** Responsive sizes hint. Defaults to full viewport width. */
  sizes?: string;
  className?: string;
  /** Rounded corners off for full-bleed slots. */
  rounded?: boolean;
  /** Shown in the placeholder so Radha knows which photo belongs here. */
  brief?: string;
  /**
   * Placeholder colouring. "dark" keeps overlaid cream text readable in slots
   * that carry text on top of the photo, such as the hero.
   */
  placeholderTone?: "light" | "dark";
};

/**
 * A photo slot. If the file has arrived it renders through next/image with
 * AVIF/WebP and correct sizing; if it has not, it renders a designed
 * placeholder of the same shape. Layouts stay honest while we wait on
 * photography, instead of collapsing or showing a broken image.
 */
export function Photo({
  src,
  alt,
  aspect = "3 / 2",
  priority = false,
  sizes = "100vw",
  className = "",
  rounded = true,
  brief,
  placeholderTone = "light",
}: PhotoProps) {
  const radius = rounded ? "rounded-md" : "";
  const ratio = aspect === "auto" ? undefined : aspect;

  if (!photoExists(src)) {
    const dark = placeholderTone === "dark";
    return (
      <div
        style={{ aspectRatio: ratio }}
        className={`relative flex h-full w-full flex-col items-center gap-4 overflow-hidden px-6 text-center ${
          dark
            ? "justify-start bg-accent-secondary pt-14 md:pt-20"
            : "justify-center border border-border bg-surface"
        } ${radius} ${className}`}
        role="img"
        aria-label={alt}
      >
        <TileGlyph
          className={
            dark
              ? "w-12 text-background opacity-40 sm:w-16"
              : "w-12 text-accent-primary opacity-25 sm:w-16"
          }
        />
        <p
          className={`type-caption measure ${
            dark ? "text-background/80" : "text-foreground-muted"
          }`}
        >
          {brief ?? alt}
        </p>
      </div>
    );
  }

  return (
    <div
      style={{ aspectRatio: ratio }}
      className={`relative h-full w-full overflow-hidden bg-surface ${radius} ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        className="object-cover"
      />
    </div>
  );
}
