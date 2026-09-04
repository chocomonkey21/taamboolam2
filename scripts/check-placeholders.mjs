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

const pending = [];

/* The phone number and the enquiry address are confirmed. What is not is a
   domain to SEND from: the owner's address is a Gmail one, which can receive
   but can never be a verified sender. Until that exists the form cannot mail
   anybody, and it says so rather than pretending. */
/* Mail is configured in the hosting project, not here, so this can only check
   that a local run has it — and a local run usually should not. Warn only when
   somebody is building for production without it. */
if (process.env.NODE_ENV === "production" && !process.env.ENQUIRY_FROM_EMAIL) {
  pending.push([
    "ENQUIRY_FROM_EMAIL is not set for this build — the form cannot send",
    "Set it in the hosting project to an address on the verified domain",
  ]);
}

if (/mapLinkIsPlaceholder:\s*true/.test(site)) {
  pending.push([
    "Map pin is a geocoded address search, not the owner's own pin",
    "lib/site.ts → location.mapLink, then set mapLinkIsPlaceholder: false",
  ]);
}

/* The domain is live and confirmed. What can still go wrong is the canonical
   drifting from what the host serves, so this checks the two agree rather than
   checking the value is filled in at all. */
if (!site.includes('url: "https://www.taamboolam.com"')) {
  pending.push([
    "site.url no longer matches the canonical origin",
    "lib/site.ts → url must equal whichever of www / apex Vercel redirects TO",
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
