export type IdentifierKind = "email" | "phone";

export interface Identifier {
  kind: IdentifierKind;
  value: string;
}

export type Role = "provider" | "admin";

export interface User {
  id: string;
  email?: string;
  phone?: string;
  role: Role;
  providerId?: string;
}

export interface Session {
  token: string;
  userId: string;
  expiresAt: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Nigerian mobile numbers in E.164: +234 then 7/8/9, 0/1, then 8 digits.
const NG_MOBILE = /^\+234[789][01]\d{8}$/;

// Accepts an email, or a Nigerian mobile number written as 0803..., 234803... or +234803...
export function parseIdentifier(raw: string): Identifier | null {
  const input = raw.trim();
  if (input.includes("@")) {
    const email = input.toLowerCase();
    return EMAIL.test(email) ? { kind: "email", value: email } : null;
  }
  const digits = input.replace(/[\s()-]/g, "");
  const phone = digits.startsWith("+")
    ? digits
    : digits.startsWith("234")
      ? `+${digits}`
      : digits.startsWith("0")
        ? `+234${digits.slice(1)}`
        : digits;
  return NG_MOBILE.test(phone) ? { kind: "phone", value: phone } : null;
}
