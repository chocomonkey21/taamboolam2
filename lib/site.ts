/**
 * Every changeable fact about the house lives here. Nothing in this file is
 * invented: each value was given by the owner, or is explicitly marked as a
 * placeholder waiting to be confirmed.
 *
 * Language-dependent copy does NOT belong here — see lib/content/.
 */
export const site = {
  name: "Taamboolam",
  /** The name set in Kannada, used beside the wordmark. */
  nameKn: "ತಂಬೋಲಂ",
  url: "https://taamboolam.com",

  contact: {
    /** PLACEHOLDER — replace with the real number. */
    phone: "+91 98765 43210",
    /** Digits only, for the wa.me link. The same number as above. */
    whatsapp: "919876543210",
    email: "stay@taamboolam.com",
    instagram: "https://www.instagram.com/taamboolam/",
  },

  location: {
    addressLines: [
      "50-1, 46th Cross, Sarakki Main Road",
      "8th Block, Jayanagar",
      "Bengaluru 560070",
    ],
    /**
     * PLACEHOLDER — a plain address search, not the owner's own pin. Replace
     * with the real Google Maps link once the pin is confirmed, and set
     * mapLinkIsPlaceholder to false.
     */
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=50-1+46th+Cross+Sarakki+Main+Road+8th+Block+Jayanagar+Bengaluru+560070",
    mapLinkIsPlaceholder: true,
  },
} as const;

export const NAV_ITEMS = [
  { href: "/", key: "home" },
  { href: "/experience", key: "experience" },
  { href: "/enquire", key: "enquire" },
] as const;

export type NavKey = (typeof NAV_ITEMS)[number]["key"];
