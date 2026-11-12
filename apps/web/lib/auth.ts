import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import type { User } from "@bloom/core";
import { services } from "@/services";

export const SESSION_COOKIE = "bloom-session";
export const LOGIN_PATH = "/dashboard/login";

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? services.auth.getUser(token) : null;
});

// Call these at the top of every protected page and server action
// (not in layouts, which don't re-run on every navigation).

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect(LOGIN_PATH);
  return user;
}

export async function requireProvider(): Promise<User & { providerId: string }> {
  const user = await requireUser();
  // The dashboard home shows onboarding when there is no provider profile yet.
  if (!user.providerId) redirect("/dashboard");
  return { ...user, providerId: user.providerId };
}

export async function requireAdmin(): Promise<User> {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/dashboard");
  return user;
}

export function canManageListing(user: User | null, listing: { providerId: string }): boolean {
  return !!user && (user.role === "admin" || user.providerId === listing.providerId);
}
