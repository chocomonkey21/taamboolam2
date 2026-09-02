import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
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
