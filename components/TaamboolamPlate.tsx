"use client";

import { useEffect, useRef } from "react";
import { useSite } from "./SiteProvider";

/**
 * The tray the house is named after, drawn rather than photographed.
 *
 * There is no photograph of a taamboolam tray in this house's image bank and a
 * stock one would be the only stock image left on the site, so it is drawn: in
 * the site's own palette, in the same family as the icon's betel leaf, and
 * with only as much shading as it takes to say that these are objects lying on
 * a dish rather than shapes printed on one.
 *
 * Every piece is named in the copy beside it — betel leaves, areca nut, a
 * coconut, fruit, turmeric, kumkum. Nothing is drawn that the page does not
 * mention, and nothing it mentions is missing.
 *
 * ── Silhouette first ──
 *
 * An earlier version drew each ingredient as a filled circle in roughly the
 * right colour, and it read as six coloured blobs: nothing was identifiable
 * without the caption underneath it. So each piece here is built from its own
 * silhouette and given the two or three marks that actually distinguish it —
 * the veins and notched base of a betel leaf, the marbled cross-section of a
 * split areca nut, the fibre of a coconut husk, the ridge and black tip of a
 * banana, the knuckled fingers of a turmeric rhizome, the lip of the little
 * pot the kumkum sits in. The detail is spent on identification rather than
 * on decoration, which is why there is no texture anywhere that is not doing
 * that job.
 *
 * ── Why the parts are laid out from one table ──
 *
 * Each piece carries a resting position and the offset and rotation it
 * travels FROM. The animation only ever moves a piece from that offset back
 * to its resting place, so the final frame is identical whether the motion
 * ran, was interrupted, or never started. That is the only way "every object
 * sits on the plate" is a guarantee rather than a hope.
 *
 * Geometry is checked against the dish: the inner surface is r=176 about
 * (220, 220), and every piece rests inside it with room to spare.
 */

type Piece = {
  /** Order of arrival: the dish, then the bed of leaves, then the rest. */
  i: number;
  /** Where it comes in from, in user units. Small, and outward. */
  from: [number, number];
  /** How far off true it arrives, in degrees. It turns into place. */
  spin: number;
  /** Its own centre, so it turns about itself rather than about the dish. */
  origin: [number, number];
};

const PIECES = {
  dish: { i: 0, from: [0, 14], spin: 0, origin: [220, 220] },
  leafBack: { i: 1, from: [0, 16], spin: -7, origin: [220, 250] },
  leafLeft: { i: 2, from: [-18, 12], spin: -9, origin: [190, 250] },
  leafRight: { i: 3, from: [18, 12], spin: 9, origin: [250, 250] },
  coconut: { i: 4, from: [0, -20], spin: -6, origin: [216, 264] },
  banana: { i: 5, from: [-24, 6], spin: -8, origin: [130, 250] },
  areca: { i: 6, from: [24, 6], spin: 8, origin: [312, 244] },
  turmeric: { i: 7, from: [-12, 20], spin: -10, origin: [160, 320] },
  kumkum: { i: 8, from: [12, 20], spin: 9, origin: [280, 320] },
} satisfies Record<string, Piece>;

function piece(p: Piece) {
  return {
    className: "plate-piece",
    style: {
      "--i": p.i,
      "--fx": `${p.from[0]}px`,
      "--fy": `${p.from[1]}px`,
      "--fr": `${p.spin}deg`,
      "--ox": `${p.origin[0]}px`,
      "--oy": `${p.origin[1]}px`,
    } as React.CSSProperties,
  };
}

/**
 * One betel leaf, drawn once and placed three times.
 *
 * Stem at the origin and tip up, so a leaf is placed by translating to where
 * its stem goes and rotating by how far it fans out. Cordate — a notched
 * base, drawn shoulders, a long point — which is the site icon's leaf at size.
 */
const LEAF_BLADE =
  "M0 -150 C 14 -122 30 -96 40 -68 C 50 -40 46 -14 28 -3 C 16 4 6 0 0 -8 C -6 0 -16 4 -28 -3 C -46 -14 -50 -40 -40 -68 C -30 -96 -14 -122 0 -150 Z";

/** A midrib and three pairs of veins sweeping up towards the tip. */
const LEAF_VEINS =
  "M0 -6 L0 -138 M0 -30 C -14 -44 -24 -58 -30 -74 M0 -30 C 14 -44 24 -58 30 -74 M0 -62 C -10 -74 -18 -86 -22 -100 M0 -62 C 10 -74 18 -86 22 -100 M0 -94 C -7 -103 -12 -112 -14 -122 M0 -94 C 7 -103 12 -112 14 -122";

function Leaf({ tone, sheen, vein }: { tone: string; sheen: string; vein: string }) {
  return (
    <>
      <path
        d={LEAF_BLADE}
        fill={tone}
        stroke="var(--dish-face)"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      {/* One lit half. A flat leaf and a folded one share a silhouette; the
          tonal panel down one side is what says the blade has a fold in it. */}
      <path
        d="M0 -150 C 14 -122 30 -96 40 -68 C 50 -40 46 -14 28 -3 C 16 4 6 0 0 -8 Z"
        fill={sheen}
      />
      <path
        d={LEAF_VEINS}
        fill="none"
        stroke={vein}
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.5"
      />
    </>
  );
}

export function TaamboolamPlate({ className = "" }: { className?: string }) {
  const { t } = useSite();
  const ref = useRef<HTMLDivElement>(null);

  /**
   * The tray is laid by the reader, not by a timer.
   *
   * This writes one number — `--p`, from 0 to 1 — onto the stage as the
   * section scrolls through the viewport, and the CSS does the rest: each
   * piece has a start point along that number and fades, slides and turns
   * into place across its own slice of it, so the offering is laid a piece at
   * a time at whatever pace the reader reads.
   *
   * The number only ever goes up. Scrolling back to re-read a line does not
   * unmake the tray in the corner of the eye, and once it is laid the effect
   * stops listening.
   *
   * The section rather than the tray is measured, because the tray is sticky
   * on desktop: its own rectangle stops moving once it pins, so it cannot be
   * its own clock.
   *
   * ── Where the empty dish comes from ──
   *
   * Not from here. The stylesheet starts --p at 0 behind
   * @media (scripting: enabled), so the dish is empty in the very first
   * frame and the only thing that ever happens to it is assembly. This
   * effect used to set that itself and it was wrong to: an effect runs after
   * the first paint, so the finished tray rendered, vanished, and rebuilt —
   * which reads as a glitch rather than as an entrance.
   *
   * The bare rule leaves --p at 1, the finished tray, and the reduced-motion
   * block puts it back to 1. So a browser with no scripting and a reader who
   * has asked for less motion both get the completed arrangement outright,
   * and this effect never runs for either of them.
   */
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let frame = 0;
    let reached = 0;
    let detach: (() => void) | null = null;

    const start = () => {
      const section = node.closest("section");
      if (!section) return;

      const measure = () => {
        frame = 0;
        const rect = section.getBoundingClientRect();
        /* How far the section has travelled through the viewport, 0 to 1. The
           denominator is its scrollable overshoot; on a section shorter than
           the viewport it falls back to the section's own height so the ratio
           stays finite and the tray still assembles. */
        const travel = Math.max(rect.height - window.innerHeight, rect.height * 0.6);
        const raw = Math.min(Math.max(-rect.top / travel, 0), 1);

        /* A high-water mark: the tray only ever gains pieces. Two reasons,
           and the second matters more. Scrolling back up to re-read a line
           should not take the offering apart in the corner of the reader's
           eye — the finished arrangement is the point of it. And it means no
           glitch, no missed event, no throttled frame and no resize mid-scroll
           can leave the dish emptier than it already was: the worst any
           failure can do is stop it early rather than undo it. */
        if (raw <= reached) return;
        reached = raw;
        node.style.setProperty("--p", raw.toFixed(4));

        // Laid. Nothing left to compute, so stop listening.
        if (raw >= 1) detach?.();
      };

      const onScroll = () => {
        /* Cancel and re-request rather than bailing out while one is pending.
           An earlier version returned early if a frame was already booked,
           which deadlocks the moment requestAnimationFrame stops firing — a
           backgrounded tab, a throttled renderer — because the flag is then
           never cleared and every later scroll returns early for good. */
        if (frame) window.cancelAnimationFrame(frame);
        frame = window.requestAnimationFrame(measure);
      };

      measure();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      detach = () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        if (frame) window.cancelAnimationFrame(frame);
      };
    };

    const sync = () => {
      detach?.();
      detach = null;
      if (motion.matches) {
        // Hand the finished tray back and stop listening.
        node.style.removeProperty("--p");
        return;
      }
      start();
    };

    sync();
    motion.addEventListener("change", sync);
    return () => {
      motion.removeEventListener("change", sync);
      detach?.();
    };
  }, []);

  return (
    <div ref={ref} className={`plate-stage ${className}`}>
      <svg
        viewBox="0 0 440 460"
        role="img"
        aria-label={t.about.plateLabel}
        className="h-auto w-full"
      >
        {/* ── The dish ────────────────────────────────────────────────────
            A shadow, a rim, an inner surface, one engraved line. The shadow
            is an offset ellipse rather than a blur filter: it survives being
            scaled down to a phone without going muddy and costs nothing to
            composite. Light falls from the upper left throughout the drawing,
            which is why the rim is lit on its far side. */}
        <g {...piece(PIECES.dish)}>
          <ellipse cx="220" cy="238" rx="196" ry="192" fill="#8a6a2e" opacity="0.16" />
          <circle cx="220" cy="220" r="196" fill="var(--dish-rim)" />
          <path d="M220 24 A 196 196 0 0 1 416 220 A 176 176 0 0 0 220 44 Z" fill="#e9cd92" opacity="0.55" />
          <circle cx="220" cy="220" r="196" fill="none" stroke="#9d7b34" strokeWidth="1.6" opacity="0.4" />
          <circle cx="220" cy="220" r="176" fill="var(--dish-face)" />
          <circle cx="220" cy="220" r="163" fill="none" stroke="#c9a55f" strokeWidth="1.1" opacity="0.38" />
        </g>

        {/* ── The bed of betel leaves ─────────────────────────────────────
            Three, laid back to front so the fan has depth: the back leaf is
            darkest and least of it shows, the front pair are lighter and
            overlap it. Everything else is put down on this. */}
        <g {...piece(PIECES.leafBack)}>
          <g transform="translate(226 284) rotate(-5)">
            <Leaf tone="#2f4229" sheen="#374d2f" vein="#88a06f" />
          </g>
        </g>
        <g {...piece(PIECES.leafLeft)}>
          <g transform="translate(196 296) rotate(-47) scale(0.96)">
            <Leaf tone="#3a5136" sheen="#456043" vein="#9ab183" />
          </g>
        </g>
        <g {...piece(PIECES.leafRight)}>
          <g transform="translate(252 294) rotate(47) scale(0.96)">
            <Leaf tone="var(--color-leaf)" sheen="#4a6849" vein="#a3b98d" />
          </g>
        </g>

        {/* ── The coconut ─────────────────────────────────────────────────
            Husked and brown, with the fibre running the way it grows and a
            tuft at the crown. No germination pores: they are anatomically
            correct, and three dots on a brown circle read as a face, which is
            the one thing this drawing cannot be allowed to look like. */}
        <g {...piece(PIECES.coconut)}>
          <ellipse cx="216" cy="308" rx="41" ry="9" fill="#6b5a34" opacity="0.22" />
          <path d="M203 226 C 206 213 210 206 216 200 C 222 206 226 213 229 226 Z" fill="#5b3e26" />
          <circle cx="216" cy="264" r="42" fill="var(--color-wood)" />
          <path d="M216 222 A 42 42 0 0 1 254 244 A 37 37 0 0 0 216 227 Z" fill="#8a6140" opacity="0.85" />
          <path d="M216 306 A 42 42 0 0 1 178 284 A 37 37 0 0 0 216 301 Z" fill="#54381f" opacity="0.5" />
          <g stroke="#4e3620" strokeWidth="1.5" strokeLinecap="round" opacity="0.42" fill="none">
            <path d="M194 224 C 188 244 188 270 196 290" />
            <path d="M210 216 C 205 240 205 274 211 298" />
            <path d="M226 216 C 231 240 231 274 225 298" />
            <path d="M242 224 C 248 244 248 270 240 290" />
          </g>
        </g>

        {/* ── The fruit ───────────────────────────────────────────────────
            A hand of four bananas, each with its ridge and its dark tip. Drawn
            as a hand rather than as loose crescents: loose ones read as brush
            strokes, which is exactly what the first attempt looked like. */}
        <g {...piece(PIECES.banana)}>
          <ellipse cx="132" cy="288" rx="48" ry="8" fill="#6b5a34" opacity="0.2" />
          <g transform="translate(130 250) rotate(-12)">
            {[
              { y: -21, f: "#d9a03c", s: "#b98426" },
              { y: -7, f: "#cf9430", s: "#ad7a20" },
              { y: 7, f: "#c68a2a", s: "#a1701c" },
              { y: 21, f: "#b87d24", s: "#8f6318" },
            ].map((b) => (
              <g key={b.y} transform={`translate(0 ${b.y})`}>
                <path
                  d="M-46 4 C -34 -16 -2 -24 22 -16 C 36 -11 44 -4 47 3 C 44 8 37 9 30 6 C 8 -3 -18 0 -38 12 C -44 15 -47 11 -46 4 Z"
                  fill={b.f}
                  stroke="var(--dish-face)"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M-38 5 C -22 -6 2 -10 24 -6"
                  fill="none"
                  stroke={b.s}
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  opacity="0.7"
                />
                <path d="M45 2 C 49 1 51 3 50 6 C 48 8 45 7 44 5 Z" fill="#5e4318" />
              </g>
            ))}
          </g>
        </g>

        {/* ── The areca nut ───────────────────────────────────────────────
            Two whole and one split. The split one is what makes it areca and
            not a pebble: the marbled cross-section — pale flesh veined brown —
            is the thing anyone who has seen supari recognises immediately. */}
        <g {...piece(PIECES.areca)}>
          <ellipse cx="312" cy="274" rx="42" ry="8" fill="#6b5a34" opacity="0.2" />
          <g transform="translate(312 244)">
            <g transform="translate(-16 -14) rotate(-14)">
              <ellipse cx="0" cy="0" rx="20" ry="17" fill="#8a5f3c" stroke="var(--dish-face)" strokeWidth="1.8" />
              <path d="M-20 -2 A 20 17 0 0 1 -2 -17" fill="none" stroke="#ac7f55" strokeWidth="2.4" strokeLinecap="round" opacity="0.8" />
              <path d="M14 8 A 20 17 0 0 1 -6 16" fill="none" stroke="#5e3d24" strokeWidth="2" strokeLinecap="round" opacity="0.45" />
            </g>
            <g transform="translate(18 -4) rotate(12)">
              <ellipse cx="0" cy="0" rx="19" ry="16" fill="#7a5233" stroke="var(--dish-face)" strokeWidth="1.8" />
              <path d="M-19 -1 A 19 16 0 0 1 -3 -16" fill="none" stroke="#9c7049" strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />
            </g>
            <g transform="translate(-2 20) rotate(-6)">
              <ellipse cx="0" cy="0" rx="21" ry="18" fill="#6d4b2f" stroke="var(--dish-face)" strokeWidth="1.8" />
              <ellipse cx="0" cy="0" rx="15" ry="12.5" fill="#d8c3a2" />
              <g stroke="#8a5f3c" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" fill="none">
                <path d="M0 0 L-11 -6" />
                <path d="M0 0 L-4 -11" />
                <path d="M0 0 L6 -10" />
                <path d="M0 0 L13 -3" />
                <path d="M0 0 L9 8" />
                <path d="M0 0 L-2 12" />
                <path d="M0 0 L-12 6" />
              </g>
            </g>
          </g>
        </g>

        {/* ── Turmeric ────────────────────────────────────────────────────
            The rhizome, not the powder: a knuckled root with two fingers off
            it and the ring marks it actually carries. A yellow disc would say
            nothing at all — this is the shape that says turmeric. */}
        <g {...piece(PIECES.turmeric)}>
          <ellipse cx="160" cy="342" rx="40" ry="7" fill="#6b5a34" opacity="0.2" />
          <g transform="translate(160 320) rotate(-8)">
            <path
              d="M-40 6 C -44 -6 -34 -16 -20 -16 C -6 -16 4 -12 16 -14 C 30 -17 42 -10 42 2 C 42 13 31 19 18 17 C 6 15 -4 12 -16 14 C -30 17 -37 15 -40 6 Z"
              fill="#c98a2e"
              stroke="var(--dish-face)"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path d="M-6 -13 C -2 -26 8 -32 18 -28 C 26 -24 26 -14 18 -12" fill="#d29a3d" stroke="var(--dish-face)" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M-24 12 C -30 24 -22 32 -12 30 C -5 28 -3 20 -8 14" fill="#bd7f26" stroke="var(--dish-face)" strokeWidth="1.8" strokeLinejoin="round" />
            <g stroke="#8f5f16" strokeWidth="1.4" strokeLinecap="round" opacity="0.5" fill="none">
              <path d="M-24 -12 C -22 -2 -22 6 -25 13" />
              <path d="M-8 -14 C -6 -3 -6 5 -9 14" />
              <path d="M10 -14 C 12 -4 12 6 9 16" />
              <path d="M26 -12 C 28 -3 28 6 25 15" />
            </g>
            <path d="M-30 -8 C -20 -12 -6 -12 4 -9" fill="none" stroke="#e6b76a" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
          </g>
        </g>

        {/* ── Kumkum ──────────────────────────────────────────────────────
            In its little pot, because loose red powder on a dish is a red
            circle and nothing else. The pot gives it a lip, a shadow inside
            the rim, and a heap that stands proud of it — which is what says
            powder rather than paint. */}
        <g {...piece(PIECES.kumkum)}>
          <ellipse cx="280" cy="344" rx="34" ry="7" fill="#6b5a34" opacity="0.2" />
          <g transform="translate(280 320)">
            <path d="M-27 -4 C -27 16 -18 24 0 24 C 18 24 27 16 27 -4 Z" fill="#a9832f" />
            <path d="M-27 -4 C -27 16 -18 24 0 24 C 8 24 14 22 19 18 C 6 18 -6 10 -10 -4 Z" fill="#8a6a24" opacity="0.55" />
            <ellipse cx="0" cy="-4" rx="27" ry="11" fill="#c39a3e" />
            <ellipse cx="0" cy="-4" rx="21" ry="8" fill="#6f5218" />
            <path d="M-21 -5 C -16 -19 16 -19 21 -5 C 12 -1 -12 -1 -21 -5 Z" fill="var(--color-clay)" />
            <path d="M-14 -9 C -9 -15 4 -16 10 -11 C 2 -9 -7 -8 -14 -9 Z" fill="#c25931" opacity="0.85" />
          </g>
        </g>
      </svg>
    </div>
  );
}
