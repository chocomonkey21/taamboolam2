import type { Metadata } from "next";
import { PrivacyScreen } from "@/components/screens/PrivacyScreen";
import { activeCopy } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  const t = await activeCopy();
  return {
    title: t.meta.privacyTitle,
    description: t.meta.privacyDescription,
    /* Useful to a reader, useless in a search result — and it should never
       outrank the three pages that are actually about the house. */
    robots: { index: false, follow: true },
  };
}

export default function PrivacyPage() {
  return <PrivacyScreen />;
}
