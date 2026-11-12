import { normalizeEmail } from "@bloom/core";

// The address "Contact us" links to, from CONTACT_EMAIL (e.g. info@bloom.ng).
// Unset or invalid: undefined, and the link shows as plain text.
export function contactEmail(): string | undefined {
  const raw = process.env.CONTACT_EMAIL;
  if (!raw) return undefined;
  const email = normalizeEmail(raw);
  if (!email) console.warn("CONTACT_EMAIL is not a valid email address; the Contact us link is hidden.");
  return email ?? undefined;
}
