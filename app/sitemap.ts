import type { MetadataRoute } from "next";
import { NAV_ITEMS, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return NAV_ITEMS.map((item) => ({
    url: new URL(item.href, site.url).toString(),
    lastModified: now,
    priority: item.href === "/" ? 1 : 0.8,
  }));
}
