"use client";

import { useEffect, useRef, useState } from "react";
import { useSite } from "./SiteProvider";

/**
 * The tray the house is named after, drawn rather than photographed.
 *
 * There is no photograph of a taamboolam tray in this house's image bank, and
 * a stock one would be the only stock image left on the site. So it is drawn —
 * in the same flat line-and-fill language as the tile glyph and the site's own
 * icon, from the site's own palette, with no gradient, no shadow and no
 * perspective. It is a diagram of a gesture, not a picture of an object.
 *
 * Every piece in it is named in the copy beside it: betel leaves, areca nut,
 * a coconut, fruit, turmeric and kumkum. Nothing is here that the paragraph
 * does not mention, and nothing the paragraph mentions is missing.
 *
 * ── Why the parts are laid out from one table ──
 *
 * Each piece carries an index and a resting position, and the animation only
 * ever moves it from a small offset back to that position. Nothing is
 * positioned by the animation itself, so the final frame is the same whether
 * the motion ran, was interrupted, or never started — which is the only way
 * "every element visibly sits on the plate" can be guaranteed rather than
 * hoped for. The offsets are all small and inward: pieces arrive onto the
 * tray, they do not fly in from off-screen.
 *
 * The geometry is checked against the plate: the plate is a circle of r=148
 * about (200, 190), and every piece's resting centre is inside r=90 of it.
 */

/** Where each piece rests, and where it comes from. dx/dy are the offset it
 *  travels FROM — small, and pointing outward from the tray's centre. */
type Piece = {
  id: string;
  /** Order of arrival. The tray first, then the bed of leaves, then the rest. */
  i: number;
  from: [number, number];
};

const PIECES: Record<string, Piece> = {
  plate: { id: "plate", i: 0, from: [0, 10] },
  leafLeft: { id: "leafLeft", i: 1, from: [-14, 10] },
  leafRight: { id: "leafRight", i: 2, from: [14, 10] },
  coconut: { id: "coconut", i: 3, from: [0, -14] },
  banana: { id: "banana", i: 4, from: [-16, 4] },
  areca: { id: "areca", i: 5, from: [16, 4] },
  turmeric: { id: "turmeric", i: 6, from: [-8, 12] },
  kumkum: { id: "kumkum", i: 7, from: [8, 12] },
};

/**
 * One betel leaf, drawn once and placed three times.
 *
 * Local coordinates: the stem sits at the origin and the tip points up, so a
 * leaf is positioned by translating to where its stem goes and rotating by how
 * far out it fans. Cordate — a notched base and a point — which is the shape
 * of the leaf in the site's own icon at a larger size.
 */
const LEAF =
  "M0 -112 C 18 -84 34 -54 34 -30 C 34 -6 18 4 3 -4 L0 2 L-3 -4 C -18 4 -34 -6 -34 -30 C -34 -54 -18 -84 0 -112 Z";
const MIDRIB = "M0 -3 L0 -98";

/** One banana. Horizontal crescent, thick enough to read as fruit. */
const BANANA =
  "M-29 -3 C -14 -16 14 -16 29 -1 C 27 6 22 8 17 6 C 6 -3 -9 -3 -22 4 C -27 6 -29 3 -29 -3 Z";

function pieceProps(p: Piece) {
  return {
    className: "plate-piece",
    style: {
      "--i": p.i,
      "--fx": `${p.from[0]}px`,
      "--fy": `${p.from[1]}px`,
    } as React.CSSProperties,
  };
}

export function TaamboolamPlate({ className = "" }: { className?: string }) {
  const { t } = useSite();
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  /* The same contract as Reveal.tsx, and for the same reasons: the hidden
     state is only ever applied by this effect, and only to something that is
     off screen at the time. Server HTML, pre-hydration paint, scripting off,
     reduced motion and "the reader is already looking at it" all render the
     finished tray outright. */
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      return;
    }

    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;

    setArmed(true);

    // Armed before the observer exists, so every failure path still ends with
    // a fully assembled tray. See Reveal.tsx.
    const failsafe = window.setTimeout(() => setShown(true), 1600);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.02, rootMargin: "0px 0px 40% 0px" },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  return (
    <div
      ref={ref}
      data-anim={armed ? "true" : undefined}
      data-shown={shown ? "true" : "false"}
      className={`plate-stage ${className}`}
    >
      <svg
        viewBox="0 0 400 380"
        role="img"
        aria-label={t.about.plateLabel}
        className="h-auto w-full"
      >
        {/* ── The tray ────────────────────────────────────────────────────
            Seen from directly above, which is how a taamboolam is actually
            photographed and the only view in which "everything is on the
            plate" is a fact rather than an illusion of overlap. An earlier
            version drew it in three-quarter view: the leaves read as wings,
            the coconut sat in front of its own bed, and half the arrangement
            had to be argued into place with draw order. Flat on, laid out
            radially, none of that arises.

            Two rings, because a plate has a rim, and the rim is what makes a
            circle read as something you could pick up. */}
        <g {...pieceProps(PIECES.plate)}>
          <circle cx="200" cy="190" r="148" fill="var(--plate-face)" />
          <circle cx="200" cy="190" r="148" fill="none" stroke="var(--plate-rim)" strokeWidth="2.4" />
          <circle cx="200" cy="190" r="131" fill="none" stroke="var(--plate-rim)" strokeWidth="1.2" opacity="0.55" />
        </g>

        {/* Everything ON the tray, scaled about the tray's centre. The parts
            were laid out conservatively and left a wide empty rim, which read
            as a small arrangement lost on a big plate. Scaling here rather
            than re-typing twenty coordinates keeps every piece in exactly the
            same relation to every other. */}
        <g transform="translate(200 190) scale(1.16) translate(-200 -190)">
        {/* ── The bed of betel leaves ─────────────────────────────────────
            Two leaves laid across the tray, stems meeting at the middle and
            tips out to either side. This is the bed: everything else is put
            down on top of it, and because the view is flat, "on top of" is
            simply what the draw order already says.

            The shape is the site icon's leaf at size — cordate, notched base,
            a point — so the mark and this drawing are the same leaf. That is
            the entire reason the mark is a leaf. LEAF is written once and
            placed twice, so the two halves of the bed cannot disagree. */}
        <g {...pieceProps(PIECES.leafLeft)}>
          <g transform="translate(200 233) rotate(-34)">
            <path d={LEAF} fill="var(--color-leaf)" stroke="var(--plate-face)" strokeWidth="3" strokeLinejoin="round" />
            <path d={MIDRIB} stroke="var(--plate-face)" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" fill="none" />
          </g>
        </g>
        <g {...pieceProps(PIECES.leafRight)}>
          <g transform="translate(200 233) rotate(34)">
            <path d={LEAF} fill="#35492f" stroke="var(--plate-face)" strokeWidth="3" strokeLinejoin="round" />
            <path d={MIDRIB} stroke="var(--plate-face)" strokeWidth="1.6" strokeLinecap="round" opacity="0.45" fill="none" />
          </g>
        </g>

        {/* ── The coconut ─────────────────────────────────────────────────
            Dead centre, on the leaves. No germination pores: they are
            anatomically right and they turned a brown circle above a green fan
            into a face, which is the one thing this drawing cannot look like.
            The husk seam is the only marking, and it is off-centre so the
            circle has a direction. */}
        <g {...pieceProps(PIECES.coconut)}>
          <circle cx="200" cy="188" r="34" fill="var(--color-wood)" />
          <path
            d="M200 154 A 34 34 0 0 1 229 171 A 30 30 0 0 0 200 158 Z"
            fill="#7d5836"
          />
        </g>

        {/* ── The fruit ───────────────────────────────────────────────────
            A hand of three bananas lying on the left leaf. Drawn with real
            thickness: the first pass was three hairlines and read as brush
            marks rather than fruit. */}
        <g {...pieceProps(PIECES.banana)}>
          <g transform="translate(126 182) rotate(4)">
            <path d={BANANA} fill="#c98a2e" transform="translate(0 -13)" />
            <path d={BANANA} fill="var(--color-ochre)" />
            <path d={BANANA} fill="#a9701f" transform="translate(-3 13)" />
          </g>
        </g>

        {/* ── The areca nut ───────────────────────────────────────────────
            Three, heaped on the right leaf the way they are actually put
            down rather than set out in a row. */}
        <g {...pieceProps(PIECES.areca)}>
          <ellipse cx="262" cy="166" rx="17" ry="15" fill="#7a5233" transform="rotate(-12 262 166)" />
          <ellipse cx="286" cy="180" rx="17" ry="15" fill="#8a5f3c" transform="rotate(14 286 180)" />
          <ellipse cx="268" cy="192" rx="17" ry="15" fill="#6d4b2f" transform="rotate(-4 268 192)" />
        </g>

        {/* ── Turmeric and kumkum ─────────────────────────────────────────
            Two small heaps at the near edge — the last things placed, and the
            first things a guest is actually given. Seen from above a heap of
            powder is a disc with a denser middle, so that is what they are:
            a ring of the colour with a darker core, rather than a flat dot. */}
        <g {...pieceProps(PIECES.turmeric)}>
          <circle cx="160" cy="250" r="19" fill="var(--color-ochre)" />
          <circle cx="160" cy="250" r="10" fill="#a9701f" />
        </g>
        <g {...pieceProps(PIECES.kumkum)}>
          <circle cx="240" cy="250" r="19" fill="var(--color-clay)" />
          <circle cx="240" cy="250" r="10" fill="#8c3a20" />
        </g>
        </g>
      </svg>
    </div>
  );
}
