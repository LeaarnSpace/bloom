import { notFound } from "next/navigation";
import { getActiveDesign } from "@bloom/designs/server";
import { TrackView } from "@bloom/tracking/client";
import { canManageListing, getCurrentUser } from "@/lib/auth";
import { services } from "@/services";

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await services.listings.getById(id);
  // Unapproved listings are visible only to their provider and admins, as a preview.
  if (!listing || (listing.status !== "approved" && !canManageListing(await getCurrentUser(), listing))) notFound();
  const [{ ui }, provider] = await Promise.all([getActiveDesign(), services.providers.getById(listing.providerId)]);
  if (!provider) notFound();

  return (
    <>
      <ui.ListingDetail listing={listing} provider={provider} />
      <TrackView events={[{ name: "listing_view", listingId: listing.id }]} />
    </>
  );
}
