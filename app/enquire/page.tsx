import type { Metadata } from "next";
import { EnquireScreen } from "@/components/screens/EnquireScreen";
import { activeCopy } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  const t = await activeCopy();
  return {
    title: t.meta.enquireTitle,
    description: t.meta.enquireDescription,
  };
}

export default function EnquirePage() {
  return <EnquireScreen />;
}
