import type { MetadataRoute } from "next";
import { content } from "@/lib/content";
import { site } from "@/lib/site";
import { tokens } from "@/lib/tokens";

/**
 * For a guest who saves the site to their home screen before a trip.
 *
 * `display: "browser"` on purpose. This is a three-page site that wants to be
 * read, not an app pretending to be installed — a standalone window would take
 * away the back button and the address bar for no gain. The theme colour is
 * the house's own paper, so the browser chrome warms to match the page instead
 * of framing it in white.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: content.en.meta.homeTitle,
    short_name: site.name,
    description: content.en.meta.homeDescription,
    start_url: "/",
    display: "browser",
    background_color: tokens.paper,
    theme_color: tokens.paper,
    lang: "en-IN",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
