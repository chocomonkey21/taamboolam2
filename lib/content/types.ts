import type { PhotoId } from "@/lib/photos";

/**
 * The shape every language must satisfy. Adding a string here is a compile
 * error in every locale file until it is translated — which is the point.
 * Nothing on this site is machine-translated at runtime.
 */

export type Locale = "en" | "kn";

/**
 * The guest-accessible levels, in the order they are climbed.
 *
 * There is no "floor4" here and there must not be one: the fourth floor is
 * private and is not let to guests. The terrace is the fourth entry because
 * it is the fourth place a guest can go, not because it is a fourth floor —
 * it is shared by everyone staying, and it is never presented as a room.
 *
 * This union is load-bearing. It is the type of the floor-preference field on
 * the enquiry form, of the chapter list on the Experience page and of the
 * ledger on the home page, so re-introducing "floor4" anywhere would be a
 * compile error in every locale file until somebody wrote copy for it.
 */
export type FloorId = "floor1" | "floor2" | "floor3" | "terrace";

export type FloorCopy = {
  /** "Floor 1" — never a theme name, never a room name. */
  label: string;
  /** One line, shown under the label in the preview and the ledger. */
  lead: string;
  /** What stays visible in the Experience chapter. One or two paragraphs. */
  body: string[];
  /** The rest, behind "More about this floor". May be empty. */
  more: string[];
  /**
   * Only what this floor has that the shared arrangement does not already
   * cover. Empty for floors that are simply the standard plan — the
   * arrangement is stated once, for Floors 1 to 3, and never repeated here.
   */
  distinct: string[];
};

export type ValueItem = { title: string; body: string };

export type Content = {
  /** The language's own name, as it names itself. */
  localeName: string;
  languageLabel: string;
  switchTo: string;

  meta: {
    homeTitle: string;
    homeDescription: string;
    experienceTitle: string;
    experienceDescription: string;
    enquireTitle: string;
    enquireDescription: string;
    privacyTitle: string;
    privacyDescription: string;
  };

  nav: {
    home: string;
    experience: string;
    enquire: string;
    skipToContent: string;
    mainLabel: string;
    mobileEnquire: string;
  };

  /** Sits under the wordmark so the name is never unexplained. */
  wordmarkContext: string;

  cta: {
    enquire: string;
    explore: string;
    readTheStory: string;
    /** Ends each floor chapter, and carries that floor into the form. */
    askAboutFloor: string;
    /**
     * The same link at the end of the terrace chapter.
     *
     * A separate string because askAboutFloor says "this floor", and the
     * whole chapter above it is an argument that the terrace is not one.
     */
    askAboutTerrace: string;
    backHome: string;
  };

  photos: Record<PhotoId, { alt: string; caption?: string }>;

  photoViewer: {
    /** Accessible label on the button that enlarges a photograph. */
    enlarge: string;
    close: string;
  };

  /**
   * The physical arrangement of a floor, stated once for the whole site.
   *
   * Every floor is the same plan, so it is described in one place and shown
   * on both pages from here. Repeating it inside each of the four chapters is
   * what made the Experience page read as four copies of one paragraph.
   */
  arrangement: {
    eyebrow: string;
    heading: string;
    body: string;
    /**
     * The rooms, the bathrooms, the balcony and the shared spaces. Four short
     * lines, and no bed sizes in any of them — what a room contains is the
     * owner's to state on enquiry, not this site's to guess.
     */
    items: string[];
    sameNote: string;
    bookingNote: string;
  };

  /**
   * What Taamboolam is, said once and plainly.
   *
   * Not a biography. The house is the subject; the family appears only as the
   * reason it is the way it is.
   */
  about: {
    eyebrow: string;
    heading: string;
    body: string[];
    /**
     * Where the name comes from.
     *
     * The site is named after a ritual and never said so, which is a strange
     * silence for a house whose whole argument is hospitality — and stranger
     * still now that the site's own icon is a betel leaf. Kept to two short
     * paragraphs: this is an origin, not an encyclopaedia entry.
     */
    nameHeading: string;
    nameBody: string[];
    note: string;
  };

  /**
   * The questions a reader would otherwise have to write in and ask.
   *
   * Rendered as native disclosures, so the label has to name what is inside
   * it. Nothing a guest must know before arriving belongs behind one of
   * these — the kitchen having no stove is stated in the answer AND in the
   * house values, because discovering it on arrival would be a bad evening.
   */
  faq: {
    eyebrow: string;
    heading: string;
    intro: string;
    items: { q: string; a: string[] }[];
  };

  home: {
    hero: { location: string; description: string };
    floors: {
      eyebrow: string;
      heading: string;
      body: string;
      link: string;
    };
    craft: { eyebrow: string; heading: string; body: string[] };
    food: { eyebrow: string; heading: string; body: string[]; note: string };
    values: { eyebrow: string; heading: string; body: string };
    invitation: { heading: string; body: string };
  };

  experience: {
    eyebrow: string;
    heading: string;
    opening: string[];
    floorsIntro: string;
    food: { eyebrow: string; heading: string; body: string[] };
    gatherings: {
      eyebrow: string;
      heading: string;
      body: string[];
      note: string;
    };
    close: { heading: string; body: string };
  };

  floors: Record<FloorId, FloorCopy>;

  /** Shared by the home page and the Experience page. */
  values: {
    eyebrow: string;
    heading: string;
    intro: string;
    /**
     * The ones that decide whether this house suits a reader at all — never
     * disclosed away, whatever else changes.
     */
    core: ValueItem[];
    /**
     * The rest, sorted into named groups rather than one flat "more" dump.
     * Each becomes its own disclosure, in order. A group is free to hold one
     * item or several; this is the shape any future long list on the site
     * should reuse rather than inventing another flat array.
     */
    groups: { label: string; items: ValueItem[] }[];
    practicalHeading: string;
    practicalLabel: string;
    practical: string[];
    /** Stays visible. How a room is got is not a detail. */
    enquiryOnly: string;
  };

  /** The page that exists only when a reader has arrived somewhere wrong. */
  notFound: { eyebrow: string; heading: string; body: string };

  /**
   * What the site does with what a guest types into it.
   *
   * Every claim in here is checkable against the code, and must stay that
   * way: if the site ever gains a database, an analytics script or a second
   * cookie, this page is wrong until it is rewritten. It is deliberately
   * short — a page nobody can read is not a disclosure.
   */
  privacy: {
    eyebrow: string;
    heading: string;
    intro: string;
    updated: string;
    /** Each section: a heading, and one or more plain paragraphs. */
    sections: { title: string; body: string[] }[];
    /** The last line: how to ask for it to be deleted. */
    contactHeading: string;
    contactBody: string;
  };

  footer: {
    findUs: string;
    heading: string;
    landmark: string;
    mapLink: string;
    mapPending: string;
    /** Says out loud that the footer map is a drawing, not a survey. */
    mapSchematic: string;
    /** Accessible title on the map frame. */
    mapTitle: string;
    /** Heading over the address block. */
    address: string;
    reachUs: string;
    whatsapp: string;
    email: string;
    instagram: string;
    pages: string;
    privacy: string;
    gatherings: string;
    rights: string;
  };

  form: {
    heading: string;
    intro: string[];
    noPrices: string;
    /** Sits under the submit button, linking to the privacy notice. */
    privacyNote: string;
    privacyLink: string;
    name: string;
    email: string;
    phone: string;
    arrival: string;
    departure: string;
    adults: string;
    children: string;
    /** Sits under the children field, and again in the house values. */
    childrenNote: string;
    visitType: string;
    visitStay: string;
    visitGathering: string;
    visitOther: string;
    floorPreference: string;
    floorAny: string;
    message: string;
    messageHint: string;
    gatheringDetails: string;
    gatheringHint: string;
    whatsappConsent: string;
    optional: string;
    required: string;
    submitStay: string;
    /** Offered beside the submit button, for readers who would rather talk. */
    orWhatsapp: string;
    submitGathering: string;
    submitting: string;
    successHeading: string;
    successBody: string;
    successAgain: string;
    errorHeading: string;
    errorBody: string;
    errorConfigured: string;
    /** Shown when the enquiry endpoint's rate limit has been reached. */
    errorTooMany: string;
    errorCheckFields: string;
    devNote: string;
    errors: {
      name: string;
      emailMissing: string;
      emailInvalid: string;
      phoneMissing: string;
      phoneShort: string;
      arrival: string;
      departure: string;
      departureOrder: string;
      adults: string;
      adultsRange: string;
      children: string;
      childrenRange: string;
      gatheringDetails: string;
      tooLong: string;
    };
  };
};
