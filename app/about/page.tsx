import type { Metadata } from "next";
import { AboutScreen } from "@/components/screens/AboutScreen";
import { activeCopy } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  const t = await activeCopy();
  return {
    title: t.meta.aboutTitle,
    description: t.meta.aboutDescription,
  };
}

export default function AboutPage() {
  return <AboutScreen />;
}
