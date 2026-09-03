/**
 * Facts the owner has not confirmed yet.
 *
 * The layouts are already built to carry these. Until a value is filled in the
 * site says nothing about it rather than guessing — an unconfirmed claim about
 * an occupancy limit is worse than no claim at all.
 *
 * The bathroom entry that used to live here is gone: the arrangement is now
 * confirmed and stated plainly in the floor plan, so a second, hedged version
 * of it behind a disclosure was stale copy rather than caution.
 *
 * To publish one: replace `null` with the confirmed copy. Both languages are
 * required, because the site never machine-translates at runtime.
 */
export type Provisional = {
  /**
   * Any occupancy limit the owner wants stated.
   *
   * The site says nothing about how many people a room sleeps, and it says
   * nothing about bed sizes: the owner has confirmed the *plan* of a floor —
   * two guest bedrooms sharing a bathroom, a master with a walk-in closet, an
   * attached bathroom and a balcony — and that is all the site claims. What a
   * given room holds is answered in the reply to an enquiry.
   *
   * Leave null unless there is a real limit to publish. Both languages are
   * required, because the site never machine-translates at runtime.
   */
  occupancyNote: { en: string; kn: string } | null;
};

export const provisional: Provisional = {
  occupancyNote: null,
};
