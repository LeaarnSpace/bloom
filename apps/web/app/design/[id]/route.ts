import { NextResponse, type NextRequest } from "next/server";
import { AUTO_DESIGN } from "@bloom/design-kit";
import { writeDesignCookie } from "@bloom/design-kit/next";
import { isKnownDesign } from "@bloom/designs";

// Preview link: /design/warm or /design/clean picks that design (cookie),
// /design/auto goes back to the default/seasonal choice. Then shows the home page.
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === AUTO_DESIGN || isKnownDesign(id)) await writeDesignCookie(id);
  return NextResponse.redirect(new URL("/", request.url), 303);
}
