import type { Metadata } from "next";
import { ExperienceScreen } from "@/components/screens/ExperienceScreen";
import { activeCopy } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  const t = await activeCopy();
  return {
    title: t.meta.experienceTitle,
    description: t.meta.experienceDescription,
  };
}

export default function ExperiencePage() {
  return <ExperienceScreen />;
}
