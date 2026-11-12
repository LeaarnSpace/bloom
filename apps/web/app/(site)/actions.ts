"use server";

import { revalidatePath } from "next/cache";
import { AUTO_DESIGN } from "@bloom/design-kit";
import { writeDesignCookie } from "@bloom/design-kit/next";
import { isKnownDesign } from "@bloom/designs";

export async function setDesign(formData: FormData) {
  const value = String(formData.get("design") ?? AUTO_DESIGN);
  if (value !== AUTO_DESIGN && !isKnownDesign(value)) return;
  await writeDesignCookie(value);
  revalidatePath("/", "layout");
}
