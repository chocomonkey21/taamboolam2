import { content, type Locale } from "@/lib/content";
import { site } from "@/lib/site";

/**
 * schema.org LodgingBusiness, as JSON-LD.
 *
 * This house is not listed on a booking platform, by choice — which removes
 * the usual way a search engine learns that a URL is a *place* rather than a
 * page about one. This is the remaining way to say it: the address, the
 * contact routes, the languages spoken, and explicitly that reservations do
 * not happen here.
 *
 * Everything below is already stated in the visible page. Nothing is asserted
 * that a reader cannot also see, and nothing unconfirmed is included at all —
 * there is no `geo` block, because the exact pin has not been confirmed and a
 * guessed latitude is exactly the kind of quiet lie the rest of the site
 * refuses to tell.
 */
export function StructuredData({ locale }: { locale: Locale }) {
  const t = content[locale];

  const data = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: site.name,
    alternateName: site.nameKn,
    description: t.meta.homeDescription,
    url: site.url,
    email: site.contact.email,
    telephone: site.contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "50-1, 46th Cross, Sarakki Main Road",
      addressLocality: "Jayanagar, Bengaluru",
      addressRegion: "Karnataka",
      postalCode: "560070",
      addressCountry: "IN",
    },
    sameAs: [site.contact.instagram],
    availableLanguage: ["en", "kn"],
    /* The whole point of the site, said in the one vocabulary a crawler
       reads: enquiries are answered by a person, not by a booking engine. */
    potentialAction: {
      "@type": "CommunicateAction",
      name: t.cta.enquire,
      target: `${site.url}/enquire`,
    },
  };

  return (
    <script
      type="application/ld+json"
      // The payload is built from our own content constants, never from user
      // input. `<` is escaped anyway so the string can never close the tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
