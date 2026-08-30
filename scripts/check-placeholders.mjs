/**
 * Warns, at build time, about anything still standing in for a real fact.
 *
 * The site is written so that unconfirmed things are visibly unconfirmed
 * rather than quietly guessed — the footer says the map pin is provisional,
 * and the house values say bathrooms are unanswered. That protects a visitor,
 * but it does not protect the owner from shipping a placeholder phone number
 * because nobody remembered it was still there.
 *
 * This prints a list at every build, including Vercel's. It deliberately does
 * NOT fail the build: preview deploys are exactly when you want to look at the
 * site with placeholders still in it. The exit code stays 0 and the warning
 * stays loud.
 *
 * Regex-read rather than imported, so this stays a plain node script with no
 * TypeScript build step in front of it.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read = (p) => readFileSync(path.join(root, p), "utf8");

const site = read("lib/site.ts");
const config = read("lib/config.ts");

const pending = [];

if (site.includes("+91 98765 43210")) {
  pending.push([
    "Phone / WhatsApp number is the placeholder +91 98765 43210",
    "lib/site.ts → contact.phone, contact.whatsapp",
  ]);
}

if (/mapLinkIsPlaceholder:\s*true/.test(site)) {
  pending.push([
    "Map pin is a geocoded address search, not the owner's own pin",
    "lib/site.ts → location.mapLink, then set mapLinkIsPlaceholder: false",
  ]);
}

if (/bathrooms:\s*null/.test(config)) {
  pending.push([
    "Bathroom arrangement is unconfirmed — the site says so rather than guessing",
    "lib/config.ts → provisional.bathrooms (both languages required)",
  ]);
}

if (site.includes("https://taamboolam.com")) {
  pending.push([
    "Site URL is assumed to be taamboolam.com — confirm before launch",
    "lib/site.ts → url (affects sitemap, robots and share previews)",
  ]);
}

if (pending.length === 0) {
  console.log("\n  Taamboolam — no placeholders left. Good to launch.\n");
} else {
  const label = pending.length === 1 ? "item" : "items";
  console.log(
    `\n  ⚠  Taamboolam — ${pending.length} ${label} still waiting on the owner:\n`,
  );
  for (const [what, where] of pending) {
    console.log(`     • ${what}`);
    console.log(`       ${where}\n`);
  }
  console.log("     See CONTENT.md. This does not block the build.\n");
}
