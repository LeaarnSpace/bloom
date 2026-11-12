import { requireProvider } from "@/lib/auth";
import { ListingForm } from "../../../_components/ListingForm";
import { errorMessage } from "../../../_components/messages";
import s from "../../../_components/dashboard.module.css";

type Params = Record<string, string | string[] | undefined>;

export default async function NewListingPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requireProvider();
  const { error } = await searchParams;
  return (
    <div className={s.panel}>
      <h1>New listing</h1>
      <p className={s.muted}>Our team reviews every listing before it appears on Bloom.</p>
      <ListingForm error={errorMessage(error)} />
    </div>
  );
}
