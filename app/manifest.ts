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
    /* 512 is what Android actually wants for a home-screen icon; the .ico
       was being scaled up from 48 and came out blurred. "maskable" tells the
       launcher it may crop to whatever shape the device uses — safe here,
       because the mark sits well inside the frame with room all round. */
    icons: [
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      { src: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
    ],
  };
}
