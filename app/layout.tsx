import type { Metadata } from "next";
import {
  Figtree,
  Fraunces,
  Noto_Sans_Kannada,
  Noto_Serif_Kannada,
} from "next/font/google";
import { Footer } from "@/components/Footer";
import { HashScroll } from "@/components/HashScroll";
import { LightboxProvider } from "@/components/Lightbox";
import { MobileEnquire, Nav } from "@/components/Nav";
import { Opening } from "@/components/Opening";
import { PageShell } from "@/components/PageShell";
import { SiteProvider } from "@/components/SiteProvider";
import { SkipLink } from "@/components/SkipLink";
import { StructuredData } from "@/components/StructuredData";
import { content, HTML_LANG } from "@/lib/content";
import { readPhotoManifest } from "@/lib/photo-manifest";
import { activeLocale } from "@/lib/server-locale";
import { site } from "@/lib/site";
import "./globals.css";

/* Headlines: a refined editorial serif, with its optical sizes and a little
   softening on the terminals so it reads as made rather than issued. */
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  display: "swap",
  variable: "--font-fraunces",
});

/* Body and forms: warm, humanist, and very legible at small sizes. */
const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-figtree",
});

/* Kannada has its own faces. Neither Latin family covers the script, so the
   site loads real Kannada type rather than leaving it to a system fallback. */
const kannadaSerif = Noto_Serif_Kannada({
  subsets: ["kannada"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-kannada-serif",
});

const kannadaSans = Noto_Sans_Kannada({
  subsets: ["kannada"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-kannada-sans",
});

/**
 * Built per request rather than exported as a constant, so the tab title and
 * the link preview follow the reader's language the way the page itself does.
 */
export async function generateMetadata(): Promise<Metadata> {
  const locale = await activeLocale();
  const t = content[locale];
  const ogLocale = locale === "kn" ? "kn_IN" : "en_IN";

  return {
    metadataBase: new URL(site.url),
    title: {
      default: t.meta.homeTitle,
      template: `%s · ${site.name}`,
    },
    description: t.meta.homeDescription,
    openGraph: {
      type: "website",
      siteName: site.name,
      title: t.meta.homeTitle,
      description: t.meta.homeDescription,
      locale: ogLocale,
      alternateLocale: locale === "kn" ? "en_IN" : "kn_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.homeTitle,
      description: t.meta.homeDescription,
    },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Seeded on the server so a returning Kannada reader gets Kannada in the
  // first byte of HTML, rather than a flash of English after hydration.
  const locale = await activeLocale();

  return (
    <html
      lang={HTML_LANG[locale]}
      className={`${fraunces.variable} ${figtree.variable} ${kannadaSerif.variable} ${kannadaSans.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <StructuredData locale={locale} />
        <SiteProvider initialLocale={locale} photoManifest={readPhotoManifest()}>
          <LightboxProvider>
            <SkipLink />
            <HashScroll />
            <Opening />
            <Nav />
            <main id="main" className="flex-1">
              <PageShell>{children}</PageShell>
            </main>
            <Footer />
            <MobileEnquire />
          </LightboxProvider>
        </SiteProvider>
      </body>
    </html>
  );
}
