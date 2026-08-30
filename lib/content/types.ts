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
  /** One line, shown under the label in the preview. */
  lead: string;
  /** Two or three short paragraphs for the Experience chapter. */
  body: string[];
  /** Short factual lines: rooms, beds, shared spaces, balcony. */
  facts: string[];
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
    backHome: string;
  };

  photos: Record<PhotoId, { alt: string; caption?: string }>;

  photoViewer: {
    /** Accessible label on the button that enlarges a photograph. */
    enlarge: string;
    close: string;
  };

  home: {
    hero: { location: string; description: string };
    intro: { eyebrow: string; heading: string; body: string[] };
    staying: {
      eyebrow: string;
      heading: string;
      body: string;
      points: ValueItem[];
    };
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
    progressLabel: string;
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
    house: ValueItem[];
    practicalHeading: string;
    practical: string[];
    /** Rendered only when the matching value in lib/config.ts is filled in. */
    pendingBathrooms: string;
  };

  footer: {
    findUs: string;
    heading: string;
    landmark: string;
    mapLink: string;
    mapPending: string;
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
    submitGathering: string;
    submitting: string;
    successHeading: string;
    successBody: string;
    successAgain: string;
    errorHeading: string;
    errorBody: string;
    errorConfigured: string;
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
