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
  url: "https://taamboolam.com",

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

  location: {
    addressLines: [
      "50-1, 46th Cross, Sarakki Main Road",
      "8th Block, Jayanagar",
      "Bengaluru 560070",
    ],
    /**
     * The pin, derived rather than supplied — and corroborated before it was
     * trusted.
     *
     * Geocoding the address alone had failed: nothing resolved, and the only
     * thing that did was the centroid of Jayanagar 8th Block, 373m from the
     * door. Searching the address *anchored near the landmark* resolves it
     * properly, to "50, 46th Cross Rd, 8th Block, TMC Layout, 1st Phase,
     * Jayanagar".
     *
     * What makes it believable is the cross-check, not the geocoder: the
     * resolved point sits 63m from Sammprada Hospital, and the owner's own
     * description of the place is "next to Sampradha Hospitals". Two
     * independent facts agreeing is the difference between a pin and a guess.
     *
     * A coordinate query rather than a place link on purpose — a place id can
     * be merged or retired by Google, a latitude and longitude cannot.
     *
     * TWO THINGS THE OWNER SHOULD CHECK, both left as the owner wrote them:
     *   - Google returns 560078 for this address; addressLines below say
     *     560070. One of them is wrong and it is not this file's place to
     *     decide which.
     *   - The hospital's registered name is "Sammprada Hospital"
     *     (sammprada.com). The landmark copy says "Sampradha Hospitals". A
     *     guest searching the second spelling may not find the first.
     */
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=12.9169526%2C77.5795849",
    /**
     * The same point, for schema.org. Kept as numbers rather than parsed back
     * out of the URL so there is one place to correct if the owner moves the
     * pin.
     */
    coordinates: { lat: 12.9169526, lng: 77.5795849 },
    mapLinkIsPlaceholder: false,
    /**
     * The embedded map.
     *
     * This geocodes the confirmed address string — it does NOT assert a
     * latitude and longitude we have not been given, so the panel cannot
     * silently show a wrong pin. When the owner confirms the exact location,
     * replace this with their own share link and set mapLinkIsPlaceholder to
     * false; nothing else has to change.
     *
     * The frame is lazy-loaded and carries no cookies until it is scrolled to.
     */
    mapEmbed:
      "https://www.google.com/maps?q=50-1,+46th+Cross,+Sarakki+Main+Road,+8th+Block,+Jayanagar,+Bengaluru+560070&output=embed",
  },
} as const;

export const NAV_ITEMS = [
  { href: "/", key: "home" },
  { href: "/experience", key: "experience" },
  { href: "/enquire", key: "enquire" },
] as const;

export type NavKey = (typeof NAV_ITEMS)[number]["key"];
