import type { PhotoId } from "@/lib/photos";

/**
 * The shape every language must satisfy. Adding a string here is a compile
 * error in every locale file until it is translated — which is the point.
 * Nothing on this site is machine-translated at runtime.
 */

export type Locale = "en" | "kn";

export type FloorId = "floor1" | "floor2" | "floor3" | "floor4";

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
   * arrangement is stated once, for all four floors, and never repeated here.
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
    /** Rooms, bed, shared hall and kitchen, balcony. Four short lines. */
    items: string[];
    sameNote: string;
    bookingNote: string;
  };

  home: {
    hero: { location: string; description: string };
    intro: { eyebrow: string; heading: string; body: string[] };
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
    /** Rendered only when the matching value in lib/config.ts is filled in. */
    pendingBathrooms: string;
  };

  /** The page that exists only when a reader has arrived somewhere wrong. */
  notFound: { eyebrow: string; heading: string; body: string };

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
    gatherings: string;
    rights: string;
    photographyNote: string;
  };

  form: {
    heading: string;
    intro: string[];
    noPrices: string;
    name: string;
    email: string;
    phone: string;
    arrival: string;
    departure: string;
    adults: string;
    children: string;
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
