import type { Metadata } from "next";
import { EnquireScreen } from "@/components/screens/EnquireScreen";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: content.en.meta.enquireTitle,
  description: content.en.meta.enquireDescription,
};

export default function EnquirePage() {
  return <EnquireScreen />;
}
