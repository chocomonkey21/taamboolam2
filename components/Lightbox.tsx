"use client";

import Image from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { photos, type PhotoId } from "@/lib/photos";
import { useSite } from "./SiteProvider";

/**
 * A viewer for a single photograph.
 *
 * Deliberately not a carousel. There is no next/previous, no thumbnail strip
 * and no counter — a reader who wants the next picture is already scrolling
 * past it. This exists for one reason: on a phone, a detail of a tile or a
 * loom is too small to read at column width, and tapping it should show it
 * properly.
 *
 * It behaves the way a dialog is supposed to: Escape closes it, focus moves
 * into it and is returned to the photograph that opened it, the page behind
 * cannot scroll, and everything behind is hidden from assistive technology.
 */

type LightboxValue = { open: (id: PhotoId, returnTo: HTMLElement | null) => void };

const LightboxContext = createContext<LightboxValue | null>(null);

export function useLightbox(): LightboxValue | null {
  return useContext(LightboxContext);
}

export function LightboxProvider({ children }: { children: ReactNode }) {
  const { t } = useSite();
  const [active, setActive] = useState<PhotoId | null>(null);
  const [closing, setClosing] = useState(false);
  const returnFocusTo = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const open = useCallback((id: PhotoId, returnTo: HTMLElement | null) => {
    returnFocusTo.current = returnTo;
    setClosing(false);
    setActive(id);
  }, []);

  /**
   * Closing runs the exit animation first, then unmounts.
   *
   * Focus goes back to the photograph immediately rather than after the
   * animation — a keyboard reader should never be left waiting on a fade to
   * finish before their focus is somewhere real. The dialog is already
   * inert-by-intent at that point: it is fading and accepts no pointer events.
   */
  const close = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive(null);
      setClosing(false);
    } else {
      setClosing(true);
      window.setTimeout(() => {
        setActive(null);
        setClosing(false);
      }, 180);
    }
    // Put the reader back where they were, not at the top of the document.
    returnFocusTo.current?.focus();
    returnFocusTo.current = null;
  }, []);

  useEffect(() => {
    if (!active) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
      // Two focusable things at most, so the trap is simply: stay on close.
      if (event.key === "Tab") {
        event.preventDefault();
        closeRef.current?.focus();
      }
    };

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [active, close]);

  const copy = active ? t.photos[active] : null;
  const meta = active ? photos[active] : null;

  return (
    <LightboxContext.Provider value={{ open }}>
      {children}

      {active && copy && meta ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={copy.alt}
          data-state={closing ? "closing" : "open"}
          /* zoom-out on the backdrop: this closes on click, and nothing else
             says so. It mirrors the zoom-in cursor on the photograph that
             opened it. */
          className="lightbox fixed inset-0 z-[100] flex cursor-zoom-out flex-col items-center justify-center p-4 sm:p-8"
          style={{ backgroundColor: "rgb(22 17 12 / 0.94)" }}
          onClick={close}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            className="type-label absolute top-4 right-4 rounded-full border border-paper/35 px-4 py-2 text-paper transition-colors duration-200 hover:bg-paper/10 sm:top-6 sm:right-6"
          >
            {t.photoViewer.close}
          </button>

          <div
            className="lightbox-figure flex max-h-full w-full max-w-5xl cursor-default flex-col items-center gap-4"
            /* Clicks on the picture itself should not fall through to close. */
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className="relative w-full overflow-hidden rounded-md"
              style={{ aspectRatio: meta.ratio, maxHeight: "78vh" }}
            >
              <Image
                src={meta.src}
                alt={copy.alt}
                fill
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="object-contain"
              />
            </div>
            {copy.caption ? (
              <p className="type-caption max-w-[60ch] text-center !text-paper/80">
                {copy.caption}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </LightboxContext.Provider>
  );
}
