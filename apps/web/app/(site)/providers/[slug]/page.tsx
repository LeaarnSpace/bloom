import { notFound } from "next/navigation";
import { getActiveDesign } from "@bloom/designs/server";
import { TrackView } from "@bloom/tracking/client";
import { services } from "@/services";

export default async function ProviderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const provider = await services.providers.getBySlug(slug);
  if (!provider) notFound();
  const [{ ui }, all] = await Promise.all([getActiveDesign(), services.listings.listByProvider(provider.id)]);
  const listings = all.filter((l) => l.status === "approved");

  return (
    <>
      <ui.ProviderProfile provider={provider} listings={listings} />
      <TrackView events={[{ name: "provider_page_view", providerId: provider.id }]} />
    </>
  );
}
