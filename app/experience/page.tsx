import type { Metadata } from "next";
import { ExperienceScreen } from "@/components/screens/ExperienceScreen";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: content.en.meta.experienceTitle,
  description: content.en.meta.experienceDescription,
};

export default function ExperiencePage() {
  return <ExperienceScreen />;
}
