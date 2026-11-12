"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { parseIdentifier, type Identifier } from "@bloom/core";
import { LOGIN_PATH, SESSION_COOKIE } from "@/lib/auth";
import { services } from "@/services";

// Remembers who is signing in between the two steps, so the email/phone isn't put in the URL.
const PENDING_COOKIE = "bloom-login";
const secure = process.env.NODE_ENV === "production";

export async function requestCode(formData: FormData) {
  const identifier = parseIdentifier(String(formData.get("identifier") ?? ""));
  if (!identifier) redirect(`${LOGIN_PATH}?error=identifier`);

  const result = await services.auth.requestCode(identifier);
  (await cookies()).set(PENDING_COOKIE, JSON.stringify(identifier), {
    path: LOGIN_PATH,
    maxAge: 10 * 60,
    httpOnly: true,
    sameSite: "lax",
    secure,
  });
  redirect(`${LOGIN_PATH}?step=code${result.ok ? "" : "&error=wait"}`);
}

export async function verifyCode(formData: FormData) {
  const jar = await cookies();
  let identifier: Identifier | null = null;
  try {
    identifier = parseIdentifier((JSON.parse(jar.get(PENDING_COOKIE)?.value ?? "{}") as Identifier).value ?? "");
  } catch {}
  if (!identifier) redirect(`${LOGIN_PATH}?error=expired`);

  const session = await services.auth.verifyCode(identifier, String(formData.get("code") ?? ""));
  if (!session) redirect(`${LOGIN_PATH}?step=code&error=code`);

  jar.delete({ name: PENDING_COOKIE, path: LOGIN_PATH });
  jar.set(SESSION_COOKIE, session.token, {
    path: "/",
    expires: new Date(session.expiresAt),
    httpOnly: true,
    sameSite: "lax",
    secure,
  });
  redirect("/dashboard");
}
