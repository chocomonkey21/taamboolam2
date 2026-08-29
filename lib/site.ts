/**
 * Single source of truth for site-wide content that Radha may want to change
 * without touching page layout. Update here, it updates everywhere.
 */
export const site = {
  name: "Taamboolam",
  tagline: "A quiet house in Jayanagar, kept like a home.",
  description:
    "A small homestay in Jayanagar, south Bengaluru. A few rooms in a family house on a tree-lined street, with breakfast in the morning and a real person to talk to.",
  url: "https://taamboolam.com",

  host: "Radha",

  contact: {
    phone: "+91 98765 43210",
    // digits only, for the wa.me link
    whatsapp: "919876543210",
    email: "stay@taamboolam.com",
  },

  location: {
    area: "Jayanagar",
    region: "Bengaluru",
    addressLines: [
      "Taamboolam",
      "50-1, 46th Cross, Sarakki Main Road",
      "8th Block, Jayanagar",
      "Bengaluru 560070",
    ],
    // Plain embed — no API key needed.
    mapEmbedSrc:
      "https://www.google.com/maps?q=50-1,+46th+Cross,+Sarakki+Main+Road,+8th+Block,+Jayanagar,+Bengaluru+560070&output=embed",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=50-1+46th+Cross+Sarakki+Main+Road+8th+Block+Jayanagar+Bengaluru+560070",
    gettingHere: [
      {
        label: "From the airport",
        detail:
          "Kempegowda airport is at the north end of the city. A cab takes about two hours, longer in traffic.",
      },
      {
        label: "By metro",
        detail:
          "The Green Line runs down this side of the city. From the nearest station it is a short auto ride to the house.",
      },
      {
        label: "By train",
        detail:
          "Bengaluru City station at Majestic is about forty-five minutes away by cab.",
      },
      {
        label: "By road",
        detail:
          "We are on 46th Cross, just off Sarakki Main Road. Send us a message when you set off and we will share a pin.",
      },
    ],
    landmarks:
      "We are in 8th Block, a few streets off Sarakki Main Road. Sarakki Lake is close by, and the Jayanagar 4th Block market and Lalbagh are both a short drive.",
  },
} as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/experience", label: "The Experience" },
  { href: "/enquire", label: "Enquire" },
] as const;
