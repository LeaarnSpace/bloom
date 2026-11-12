"use server";

import { redirect } from "next/navigation";
import { normalizeEmail } from "@bloom/core";
import { getActiveDesign } from "@bloom/designs/server";
import { services } from "@/services";

// Works without JavaScript: a plain form post, then a redirect back to the page.
// The response never says whether the email was already on the list.
export async function joinWaitlist(formData: FormData) {
  const honeypot = String(formData.get("website") ?? "");
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  // The browser's type="email" check normally stops bad input before it gets here.
  if (!email) redirect("/#signup");
  if (!honeypot) {
    const { id } = await getActiveDesign();
    await services.waitlist.add({ email, designId: id, createdAt: new Date().toISOString() });
  }
  redirect("/?joined=1#signup");
}
