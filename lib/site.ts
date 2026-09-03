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
     * STILL A SEARCH, NOT A PIN.
     *
     * The address was put through a geocoder and does not resolve: neither
     * "46th Cross, Sarakki Main Road" nor the landmark returns a result, and
     * the only thing that does is the centroid of Jayanagar 8th Block — a
     * point some hundreds of metres from the door. Dropping that on the map
     * would be a pin that is confidently wrong, which for somebody arriving
     * after dark is worse than no pin at all.
     *
     * So this stays a search, with the landmark folded into the query because
     * Sampradha Hospitals is a far stronger local signal than a cross number
     * and materially improves what Google lands on.
     *
     * To replace it with the real thing: open Google Maps on the phone,
     * long-press the house, Share, Copy link, and paste it here — then set
     * mapLinkIsPlaceholder to false and the "still being confirmed" line
     * disappears from the footer on its own.
     */
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Sampradha+Hospitals+46th+Cross+Sarakki+Main+Road+8th+Block+Jayanagar+Bengaluru+560070",
    mapLinkIsPlaceholder: true,
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
