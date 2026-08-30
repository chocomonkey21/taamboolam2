"use client";

import { useEffect, useState } from "react";
import type { FloorId } from "@/lib/content";
import { useSite } from "./SiteProvider";

const PHASES: { id: FloorId; atmosphere: string }[] = [
  { id: "floor1", atmosphere: "floor-1" },
  { id: "floor2", atmosphere: "floor-2" },
  { id: "floor3", atmosphere: "floor-3" },
  { id: "floor4", atmosphere: "floor-4" },
];

/**
 * A very quiet reading indicator for the Experience page.
 *
 * Two pixels tall, and split into the four floors so its colour drifts as the
 * reader climbs — the same tonal shift the page itself is making, at 1/400th
 * the size. It reports progress to assistive technology properly rather than
 * relying on the colour, and it disappears under reduced motion, where a bar
 * that creeps is a distraction rather than an orientation.
 */
export function ExperienceProgress() {
  const { t } = useSite();
  const [progress, setProgress] = useState(0);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setEnabled(true);

    let frame = 0;
    const measure = () => {
      frame = 0;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(
        scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0,
      );
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]"
      role="progressbar"
      aria-label={t.experience.progressLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
    >
      <div
        className="flex h-full origin-left"
        style={{
          width: "100%",
          transform: `scaleX(${progress})`,
          transition: "transform 120ms linear",
        }}
      >
        {PHASES.map((phase) => (
          <span
            key={phase.id}
            data-atmosphere={phase.atmosphere}
            className="h-full flex-1"
            style={{ backgroundColor: "var(--atmos-accent)", opacity: 0.5 }}
          />
        ))}
      </div>
    </div>
  );
}
