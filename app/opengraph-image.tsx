import fs from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { content } from "@/lib/content";
import { site } from "@/lib/site";
import { tokens } from "@/lib/tokens";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} — a homestay in Jayanagar, Bengaluru`;

/**
 * Social card. Same restraint as the site: ivory ground, the wordmark, one
 * line, and a single terracotta rule. Generated at build time.
 *
 * Satori cannot read the font that next/font loads for the browser, so
 * Fraunces is committed to the repo and read from disk here.
 */
export default async function OpengraphImage() {
  const fraunces = await fs.readFile(
    path.join(process.cwd(), "assets", "fonts", "Fraunces-Medium.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: tokens.paper,
          color: tokens.ink,
          padding: "80px",
          fontFamily: "Fraunces",
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: 10,
            textTransform: "uppercase",
            color: tokens.inkSoft,
          }}
        >
          {site.name}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 66, lineHeight: 1.15, maxWidth: 900 }}>
            {content.en.about.heading}
          </div>
          <div
            style={{
              marginTop: 44,
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <div style={{ width: 110, height: 3, background: tokens.clay }} />
            <div style={{ fontSize: 25, color: tokens.inkSoft }}>
              {content.en.home.hero.location}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Fraunces", data: fraunces, style: "normal", weight: 500 }],
    },
  );
}
