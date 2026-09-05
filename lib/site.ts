/**
 * Every changeable fact about the house lives here. Nothing in this file is
 * invented: each value was given by the owner, or is explicitly marked as a
 * placeholder waiting to be confirmed.
 *
 * Language-dependent copy does NOT belong here — see lib/content/.
 */
export const site = {
  name: "Taamboolam",
  /**
   * The name set in Kannada, used beside the wordmark.
   *
   * ತಾಂಬೂಲಂ — long aa on the first syllable, long uu on the third. The site
   * previously carried ತಂಬೋಲಂ, which is a different word and not the house's
   * name. Corrected by the owner.
   */
  nameKn: "ತಾಂಬೂಲಂ",
  /**
   * The canonical origin, and it must match what the host actually serves.
   *
   * Vercel is configured with www as canonical: https://taamboolam.com answers
   * 308 and sends everything to https://www.taamboolam.com. This value feeds
   * the sitemap, robots.txt and every share preview, so while it said the
   * apex, every URL a crawler was handed redirected before it resolved.
   *
   * If the redirect is ever flipped the other way in Vercel, flip this too —
   * they are one decision recorded in two places, and only one of them is
   * visible from the browser.
   */
  url: "https://www.taamboolam.com",

  contact: {
    /** The owner's number. Confirmed. */
    phone: "+91 91082 40269",
    /** Digits only with the country code, for the wa.me link. Same number. */
    whatsapp: "919108240269",
    /**
     * Where enquiries land. Confirmed.
     *
     * This is also the default recipient — ENQUIRY_TO_EMAIL overrides it, but
     * with nothing set the mailer falls back to here, so the address is right
     * even if the hosting project is misconfigured.
     *
     * Note it is a Gmail address, which makes it a fine place to RECEIVE mail
     * and an impossible place to SEND from: Resend will only send from a
     * domain you have verified, and nobody can verify gmail.com. See the note
     * on FROM in lib/mailer.ts.
     */
    email: "taamboolaminn@gmail.com",
    instagram: "https://www.instagram.com/taamboolam/",
  },

  /**
   * Who built the site. Not a fact about the house, but a changeable fact
   * about this site, and it belongs here rather than as a literal inside the
   * footer — same reason every other address in this file does.
   */
  credit: {
    studio: "Fluxion Studios",
    url: "https://fluxion-studios.vercel.app/#top",
  },

  location: {
    addressLines: [
      "50-1, 46th Cross, Sarakki Main Road",
      "1st Phase, JP Nagar",
      "Bengaluru 560078",
    ],
    /**
     * The pin, supplied by the owner from the house's own Google Maps record
     * — not derived. It replaced a geocoded guess that had sat 23m off.
     *
     * The address above now follows Google rather than diverging from it.
     * It used to read "8th Block, Jayanagar", which this note recorded as a
     * known discrepancy on the grounds that it was the owner's own wording.
     * That was the wrong call: a guest routing to the house reads the address
     * on the site and the address in Maps side by side, and two different
     * neighbourhoods for one pin reads as an error in the listing. Google
     * files this stretch of Sarakki Main Road as "1st Phase, J. P. Nagar" —
     * verified against the Sammprada Hospital record next door, "Sarakki Main
     * Rd, VR Layout, 1st Phase, J. P. Nagar, Bengaluru, Karnataka 560078".
     *
     * Rendered "JP Nagar" rather than Google's formal "J. P. Nagar": it is
     * the form in Google's own business titles for the area, the form
     * everyone local writes, and it does not collide with the full stops that
     * end sentences in body copy, where this name also appears.
     *
     * The layout line (TMC / VR) is deliberately not carried into the address.
     * Nobody has confirmed which one the house sits in, and an invented one is
     * worse than an omitted one when the postcode already resolves it.
     *
     * The landmark is "Sammprada Hospital", the name the business is
     * registered under and therefore the one a guest searching will find. The
     * postcode is 560078, confirmed by the owner.
     */
    /**
     * "Directions", not "search". A dir/ link opens Google's routing straight
     * to the door instead of dropping the reader on a results page they then
     * have to act on themselves.
     */
    mapLink:
      "https://www.google.com/maps/dir/?api=1&destination=12.9167449%2C77.5796137",
    /**
     * The footer map. `output=embed` is Google's keyless embed — no API key to
     * hold, expire or leak, and nothing to bill.
     *
     * A coordinate query rather than a place id on purpose: a place record can
     * be merged, renamed or retired by Google, and a latitude and longitude
     * cannot. Moving the pin means changing this and `coordinates` together.
     */
    mapEmbed:
      "https://www.google.com/maps?q=12.9167449,77.5796137&z=17&hl=en&output=embed",
    /**
     * The same point, for schema.org. Kept as numbers rather than parsed back
     * out of a URL so there is one place to correct if the owner moves the
     * pin.
     */
    coordinates: { lat: 12.9167449, lng: 77.5796137 },
    mapLinkIsPlaceholder: false,
  },
} as const;

export const NAV_ITEMS = [
  { href: "/", key: "home" },
  { href: "/experience", key: "experience" },
  { href: "/about", key: "about" },
  { href: "/enquire", key: "enquire" },
] as const;

export type NavKey = (typeof NAV_ITEMS)[number]["key"];
