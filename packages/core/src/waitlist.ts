// Coming-soon email sign-ups. Emails are personal data (NDPA 2023): collect only
// what is needed, and only after the visitor has seen the privacy notice.

export interface WaitlistSignup {
  // Lower-cased, trimmed.
  email: string;
  // Which design the visitor saw when they signed up, to compare designs.
  designId: string;
  // UTC instant (ISO 8601 with "Z").
  createdAt: string;
}

// Loose on purpose: the browser's type="email" check does the strict part.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(raw: string): string | null {
  const email = raw.trim().toLowerCase();
  return email.length <= 254 && EMAIL.test(email) ? email : null;
}
