import { cookies } from "next/headers";
import { DESIGN_COOKIE } from "./resolve";

const ONE_YEAR = 60 * 60 * 24 * 365;

export async function readDesignCookie(): Promise<string | undefined> {
  return (await cookies()).get(DESIGN_COOKIE)?.value;
}

// Set COOKIE_DOMAIN=.bloom.ng in production so the choice is shared with the subdomain apps.
export async function writeDesignCookie(value: string): Promise<void> {
  (await cookies()).set(DESIGN_COOKIE, value, {
    path: "/",
    maxAge: ONE_YEAR,
    sameSite: "lax",
    domain: process.env.COOKIE_DOMAIN || undefined,
  });
}
