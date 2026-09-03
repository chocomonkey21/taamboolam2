import type { MetadataRoute } from "next";
import { NAV_ITEMS, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...NAV_ITEMS.map((item) => ({
      url: new URL(item.href, site.url).toString(),
      lastModified: now,
      priority: item.href === "/" ? 1 : 0.8,
    })),
    /* Listed so it is discoverable, at a priority that says what it is. The
       page itself carries robots: noindex — a privacy notice should be
       findable from the site and should never compete in a search result
       with the three pages that are actually about the house. */
    {
      url: new URL("/privacy", site.url).toString(),
      lastModified: now,
      priority: 0.1,
    },
  ];
}
