"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CATEGORIES, CITIES, PLATFORM_TIME_ZONE, parseIdentifier, type ListingInput, type ProviderInput } from "@bloom/core";
import { LOGIN_PATH, SESSION_COOKIE, canManageListing, requireAdmin, requireProvider, requireUser } from "@/lib/auth";
import { services } from "@/services";

type Parsed<T> = { ok: true; value: T } | { ok: false; error: string };

function text(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim();
}

function between(value: string, min: number, max: number): boolean {
  return value.length >= min && value.length <= max;
}

function parseProvider(formData: FormData): Parsed<ProviderInput> {
  const name = text(formData, "name");
  const description = text(formData, "description");
  const city = text(formData, "city");
  const rawPhone = text(formData, "phone");
  if (!between(name, 2, 80)) return { ok: false, error: "name" };
  if (!between(description, 10, 2000)) return { ok: false, error: "description" };
  if (!CITIES.some((c) => c.name === city)) return { ok: false, error: "city" };
  const phone = rawPhone ? parseIdentifier(rawPhone) : undefined;
  if (phone === null || (phone && phone.kind !== "phone")) return { ok: false, error: "phone" };
  // All supported cities are in Nigeria; ask for a zone once providers can be elsewhere.
  return { ok: true, value: { name, description, city, phone: phone?.value, timeZone: PLATFORM_TIME_ZONE } };
}

function parseListing(formData: FormData): Parsed<ListingInput> {
  const title = text(formData, "title");
  const description = text(formData, "description");
  const category = text(formData, "category");
  const city = CITIES.find((c) => c.name === text(formData, "city"));
  const rawPrice = text(formData, "price").replace(/[,\s₦]/g, "");
  if (!between(title, 3, 120)) return { ok: false, error: "title" };
  if (!between(description, 10, 2000)) return { ok: false, error: "description" };
  if (!CATEGORIES.includes(category)) return { ok: false, error: "category" };
  if (!city) return { ok: false, error: "city" };
  const amount = rawPrice ? Number(rawPrice) : undefined;
  if (amount !== undefined && !(Number.isInteger(amount) && amount >= 0 && amount <= 1e11)) {
    return { ok: false, error: "price" };
  }
  return {
    ok: true,
    value: {
      title,
      description,
      category,
      city: city.name,
      // TODO: replace the city centre with a map picker / geocoded address once the maps provider is chosen.
      location: city.centre,
      price: amount === undefined ? undefined : { amount, currency: "NGN" },
    },
  };
}

export async function createProvider(formData: FormData) {
  const user = await requireUser();
  if (user.providerId) redirect("/dashboard");
  const parsed = parseProvider(formData);
  if (!parsed.ok) redirect(`/dashboard?error=${parsed.error}`);
  const provider = await services.providers.create(parsed.value);
  await services.auth.linkProvider(user.id, provider.id);
  redirect("/dashboard");
}

export async function saveListing(formData: FormData) {
  const user = await requireProvider();
  const id = text(formData, "id");
  const formPath = id ? `/dashboard/listings/${encodeURIComponent(id)}/edit` : "/dashboard/listings/new";
  const parsed = parseListing(formData);
  if (!parsed.ok) redirect(`${formPath}?error=${parsed.error}`);

  if (id) {
    const existing = await services.listings.getById(id);
    if (!existing || !canManageListing(user, existing)) redirect("/dashboard");
    await services.listings.update(id, parsed.value);
  } else {
    await services.listings.create(user.providerId, parsed.value);
  }
  redirect("/dashboard?saved=1");
}

export async function reviewListing(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const status = text(formData, "decision");
  const note = text(formData, "note").slice(0, 500) || undefined;
  if (status !== "approved" && status !== "rejected") redirect("/dashboard/review");
  await services.listings.review(id, { status, note });
  redirect("/dashboard/review");
}

export async function signOut() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await services.auth.signOut(token);
  jar.delete(SESSION_COOKIE);
  redirect(LOGIN_PATH);
}
