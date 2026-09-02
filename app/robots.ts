import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Preview deployments must not be indexed.
 *
 * Every push to a branch gets its own public URL on Vercel. Without this,
 * a half-finished branch is as crawlable as the real site, and the owner
 * ends up with duplicate listings pointing at throwaway hostnames.
 *
 * VERCEL_ENV is 'production' only for the production deployment; previews
 * and local development are anything else. Absent (plain `next start`,
 * another host) is treated as production, because the safer default for a
 * site somebody deliberately started is to be findable.
 */
function isProduction(): boolean {
  const env = process.env.VERCEL_ENV;
  return env === undefined || env === "production";
}

export default function robots(): MetadataRoute.Robots {
  if (!isProduction()) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    /* public/images carries two files written for the owner rather than for
       guests: README.md (what each of the twenty-four photo slots should
       show) and CREDITS.json (the provenance of the temporary stock
       photography). Both are served publicly because that is where the
       owner's workflow puts them, and neither holds anything secret — but
       neither belongs in a search index either. This is a request, not a
       control: it keeps them out of results without pretending they are
       private. */
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/images/README.md", "/images/CREDITS.json"],
    },
    sitemap: new URL("/sitemap.xml", site.url).toString(),
  };
}
