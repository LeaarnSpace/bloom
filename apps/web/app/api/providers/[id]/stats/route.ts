import { lastLocalDays } from "@bloom/core";
import { getCurrentUser } from "@/lib/auth";
import { services } from "@/services";

// Stats for one provider. Only that provider's users and admins may read it.
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  if (user.role !== "admin" && user.providerId !== id) return Response.json({ error: "forbidden" }, { status: 403 });
  const provider = await services.providers.getById(id);
  if (!provider) return Response.json({ error: "not found" }, { status: 404 });

  const days = Math.min(365, Math.max(1, Number(new URL(request.url).searchParams.get("days")) || 30));
  return Response.json(await services.providerStats.summary(id, lastLocalDays(days, provider.timeZone)));
}
