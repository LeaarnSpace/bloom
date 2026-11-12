import { CITIES, EVENT_NAMES, PLATFORM_TIME_ZONE, lastLocalDays, type EventName } from "@bloom/core";
import { requireUser } from "@/lib/auth";
import { formatCount, formatDate, formatMoney } from "@/lib/format";
import { services } from "@/services";
import { errorMessage } from "../_components/messages";
import s from "../_components/dashboard.module.css";
import { createProvider } from "./actions";

type Params = Record<string, string | string[] | undefined>;

const DAYS = 30;

const LABELS: Record<EventName, string> = {
  listing_impression: "Times shown",
  listing_click: "Clicks",
  listing_view: "Listing views",
  contact_click: "Contact taps",
  provider_page_view: "Profile views",
};

export default async function DashboardPage({ searchParams }: { searchParams: Promise<Params> }) {
  const user = await requireUser();
  const params = await searchParams;
  const error = errorMessage(params.error);

  if (!user.providerId) {
    return (
      <div className={`${s.panel} ${s.narrow}`}>
        <h1>Set up your provider profile</h1>
        <p className={s.muted}>This is what visitors see on your Bloom page.</p>
        <form action={createProvider} className={s.form}>
          {error && <p className={s.error}>{error}</p>}
          <label className={s.field}>
            Business name
            <input className={s.input} name="name" required minLength={2} maxLength={80} />
          </label>
          <label className={s.field}>
            About your business
            <textarea className={s.input} name="description" rows={4} required minLength={10} maxLength={2000} />
          </label>
          <label className={s.field}>
            City
            <select className={s.input} name="city" defaultValue="" required>
              <option value="" disabled>
                Choose…
              </option>
              {CITIES.map((c) => (
                <option key={c.name}>{c.name}</option>
              ))}
            </select>
          </label>
          <label className={s.field}>
            Public phone number (optional)
            <input className={s.input} name="phone" inputMode="tel" />
          </label>
          <button className={s.button}>Create profile</button>
        </form>
        {user.role === "admin" && (
          <p>
            <a href="/dashboard/review">Go to the review queue</a>
          </p>
        )}
      </div>
    );
  }

  const provider = await services.providers.getById(user.providerId);
  // "Last 30 days" = today plus the 29 previous calendar days in the provider's own zone.
  const range = lastLocalDays(DAYS, provider?.timeZone ?? PLATFORM_TIME_ZONE);
  const [listings, stats] = await Promise.all([
    services.listings.listByProvider(user.providerId),
    services.providerStats.summary(user.providerId, range),
  ]);
  const byListing = new Map(stats.byListing.map((r) => [r.listingId, r.counts]));

  return (
    <>
      <div className={s.row} style={{ justifyContent: "space-between" }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>{provider?.name}</h1>
          {provider && (
            <a href={`/providers/${provider.slug}`} className={s.muted}>
              View your public page
            </a>
          )}
        </div>
        <a href="/dashboard/listings/new" className={s.button}>
          New listing
        </a>
      </div>

      {params.saved && <p className={s.notice}>Saved. Your listing will go live once our team has reviewed it.</p>}

      <h2>Last {DAYS} days</h2>
      <p className={s.muted}>
        {formatDate(range.from)} – {formatDate(range.to)}
      </p>
      <div className={s.stats}>
        {EVENT_NAMES.map((name) => (
          <div key={name} className={s.stat}>
            <span className={s.muted}>{LABELS[name]}</span>
            <span className={s.statValue}>{formatCount(stats.totals[name].count)}</span>
            <span className={s.muted}>{formatCount(stats.totals[name].uniqueVisitors)} people</span>
          </div>
        ))}
      </div>

      <h2>Your listings</h2>
      <div className={`${s.panel} ${s.tableWrap}`}>
        {listings.length === 0 ? (
          <p className={s.muted}>No listings yet.</p>
        ) : (
          <table className={s.table}>
            <thead>
              <tr>
                <th>Listing</th>
                <th>Status</th>
                <th className={s.num}>Shown</th>
                <th className={s.num}>Views</th>
                <th className={s.num}>Contacts</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {listings.map((l) => {
                const counts = byListing.get(l.id);
                return (
                  <tr key={l.id}>
                    <td>
                      <a href={`/listings/${l.id}`}>{l.title}</a>
                      <div className={s.muted}>
                        {l.city} · {formatMoney(l.price)}
                      </div>
                      {l.status === "rejected" && l.reviewNote && <div className={s.error}>{l.reviewNote}</div>}
                    </td>
                    <td>
                      <span className={s[l.status]}>{l.status}</span>
                    </td>
                    <td className={s.num}>{formatCount(counts?.listing_impression ?? 0)}</td>
                    <td className={s.num}>{formatCount(counts?.listing_view ?? 0)}</td>
                    <td className={s.num}>{formatCount(counts?.contact_click ?? 0)}</td>
                    <td>
                      <a href={`/dashboard/listings/${l.id}/edit`}>Edit</a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
