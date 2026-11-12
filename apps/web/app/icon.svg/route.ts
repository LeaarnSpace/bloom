import { tabIconSvg } from "@/lib/brand-icon";

export const dynamic = "force-static";

export async function GET() {
  return new Response(await tabIconSvg(), { headers: { "Content-Type": "image/svg+xml" } });
}
