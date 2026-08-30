"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Wraps each page so that arriving on it is a short, immediate fade and rise
 * rather than a hard cut. Keyed on the path, so the animation restarts on
 * navigation; 420ms, so it never stands between a reader and the content.
 */
export function PageShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}
