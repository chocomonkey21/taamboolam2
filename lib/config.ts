/**
 * Facts the owner has not confirmed yet.
 *
 * The layouts are already built to carry these. Until a value is filled in the
 * site says nothing about it rather than guessing — an unconfirmed claim about
 * a bathroom or an occupancy limit is worse than no claim at all.
 *
 * To publish one: replace `null` with the confirmed copy. Both languages are
 * required, because the site never machine-translates at runtime.
 */
export type Provisional = {
  /**
   * What the bathroom arrangement on each floor actually is. Do NOT write
   * "ensuite" here unless the owner has confirmed every room is ensuite.
   */
  bathrooms: { en: string; kn: string } | null;
  /**
   * Any occupancy limit beyond "a queen bed suitable for two adults", which
   * is confirmed and already in the copy. Leave null if there is none to add.
   */
  occupancyNote: { en: string; kn: string } | null;
};

export const provisional: Provisional = {
  bathrooms: null,
  occupancyNote: null,
};
