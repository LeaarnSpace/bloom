import { getActiveDesign } from "@bloom/designs/server";
import { TrackView } from "@bloom/tracking/client";
import { contactEmail } from "@/lib/contact";
import { siteMode } from "@/lib/site-mode";
import { services } from "@/services";
import { setDesign } from "./actions";
import { joinWaitlist } from "./waitlist";

type Params = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  const v = Array.isArray(value) ? value[0] : value;
  return v || undefined;
}

export default async function Home({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;

  if (siteMode() === "coming-soon") {
    const { id, selected, options, ui } = await getActiveDesign();
    return (
      <ui.ComingSoon
        signup={{ action: joinWaitlist, joined: first(params.joined) === "1" }}
        designSwitcher={{ options, selected, activeId: id, action: setDesign }}
        contactEmail={contactEmail()}
      />
    );
  }

  const text = first(params.q);
  const city = first(params.city);

  const [{ ui }, result] = await Promise.all([
    getActiveDesign(),
    services.listingSearch.search({ text, city, sort: "newest" }),
  ]);

  return (
    <>
      <ui.SearchBar value={{ text, city }} cities={result.facets.city?.map((f) => f.value) ?? []} />
      <ui.ListingList listings={result.items} total={result.total} />
      <TrackView events={result.items.map((l) => ({ name: "listing_impression", listingId: l.id }))} />
    </>
  );
}
