import { notFound } from "next/navigation";
import { canManageListing, requireProvider } from "@/lib/auth";
import { services } from "@/services";
import { ListingForm } from "../../../../_components/ListingForm";
import { errorMessage } from "../../../../_components/messages";
import s from "../../../../_components/dashboard.module.css";

type Params = Record<string, string | string[] | undefined>;

export default async function EditListingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Params>;
}) {
  const user = await requireProvider();
  const [{ id }, { error }] = await Promise.all([params, searchParams]);
  const listing = await services.listings.getById(id);
  if (!listing || !canManageListing(user, listing)) notFound();

  return (
    <div className={s.panel}>
      <h1>Edit listing</h1>
      {listing.status === "approved" && (
        <p className={s.notice}>Saving changes takes this listing off Bloom until our team reviews it again.</p>
      )}
      <ListingForm listing={listing} error={errorMessage(error)} />
    </div>
  );
}
