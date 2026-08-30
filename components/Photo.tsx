"use client";

import Image from "next/image";
import { photos, type PhotoId } from "@/lib/photos";
import { useLightbox } from "./Lightbox";
import { useSite } from "./SiteProvider";
import { TileGlyph } from "./TileMotif";

/**
 * A photograph slot.
 *
 * The aspect ratio is fixed in lib/photos.ts, not here, so the layout is
 * identical whether the real photograph has arrived or not — no shift when the
 * owner's files replace the stock, and no shift while one loads. Alt text and
 * captions come from the current language's copy.
 */
export function Photo({
  id,
  priority = false,
  sizes = "100vw",
  className = "",
  rounded = true,
  ratio,
  caption = "none",
  objectPosition,
  zoomable = false,
}: {
  id: PhotoId;
  priority?: boolean;
  sizes?: string;
  className?: string;
  rounded?: boolean;
  /** Override the registry ratio, e.g. for the full-height hero. */
  ratio?: string;
  /** "below" prints the caption under the image when the copy provides one. */
  caption?: "none" | "below";
  objectPosition?: string;
  /** Offer this photograph at full size when it is tapped or clicked. */
  zoomable?: boolean;
}) {
  const { t, photoManifest } = useSite();
  const lightbox = useLightbox();
  const meta = photos[id];
  const copy = t.photos[id];
  const aspect = ratio ?? meta.ratio;
  const radius = rounded ? "rounded-md" : "";

  const frame = photoManifest[id] ? (
    <Image
      src={meta.src}
      alt={copy.alt}
      fill
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : "lazy"}
      className="object-cover"
      style={objectPosition ? { objectPosition } : undefined}
    />
  ) : (
    /* The file has not landed yet. Hold the exact shape and say what belongs
       here, rather than collapsing or showing a broken image. */
    <div
      data-placeholder=""
      role="img"
      aria-label={copy.alt}
      className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center"
      style={{
        backgroundColor: "var(--atmos-tint)",
        color: "var(--atmos-accent)",
      }}
    >
      <TileGlyph className="w-10 opacity-30 sm:w-14" />
      <p className="type-caption measure">{copy.alt}</p>
    </div>
  );

  const image = (
    <div
      style={{
        // "auto" means the parent already sets the height (the hero).
        aspectRatio: aspect === "auto" ? undefined : aspect,
        backgroundColor: "var(--atmos-tint)",
      }}
      className={`relative w-full overflow-hidden ${radius} ${className}`}
    >
      {frame}
    </div>
  );

  /* Enlargeable photographs are wrapped in a real button, so they are
     reachable by keyboard and announced as an action rather than as decoration.
     Only offered when the file has actually arrived — there is nothing to
     enlarge about a placeholder. */
  const framed =
    zoomable && photoManifest[id] && lightbox ? (
      <button
        type="button"
        aria-label={`${t.photoViewer.enlarge}: ${copy.alt}`}
        onClick={(event) => lightbox.open(id, event.currentTarget)}
        className="group block w-full cursor-zoom-in"
      >
        <span className="block overflow-hidden rounded-md">{image}</span>
      </button>
    ) : (
      image
    );

  if (caption === "below" && copy.caption) {
    return (
      <figure className="w-full">
        {framed}
        <figcaption className="type-caption mt-3 max-w-[46ch]">
          {copy.caption}
        </figcaption>
      </figure>
    );
  }

  return framed;
}
