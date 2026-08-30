import { cookies } from "next/headers";
import {
  content,
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_COOKIE,
  type Content,
  type Locale,
} from "./content";

/**
 * The language this request should be answered in, read on the server.
 *
 * Used by the layout to seed the provider, and by every page's
 * generateMetadata so that a returning Kannada reader gets a Kannada
 * <title> and description too. Those used to be hardcoded to `content.en`,
 * which meant Kannada readers got Kannada content under an English browser
 * tab, and shared a Kannada page as an English link preview.
 */
export async function activeLocale(): Promise<Locale> {
  const stored = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(stored) ? stored : DEFAULT_LOCALE;
}

/** The copy for this request's language. */
export async function activeCopy(): Promise<Content> {
  return content[await activeLocale()];
}
