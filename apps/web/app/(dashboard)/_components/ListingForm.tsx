import { CATEGORIES, CITIES, type Listing } from "@bloom/core";
import { saveListing } from "../dashboard/actions";
import s from "./dashboard.module.css";

export function ListingForm({ listing, error }: { listing?: Listing; error?: string }) {
  return (
    <form action={saveListing} className={s.form}>
      {listing && <input type="hidden" name="id" value={listing.id} />}
      {error && <p className={s.error}>{error}</p>}
      <label className={s.field}>
        Title
        <input className={s.input} name="title" defaultValue={listing?.title} required minLength={3} maxLength={120} />
      </label>
      <label className={s.field}>
        Description
        <textarea className={s.input} name="description" defaultValue={listing?.description} rows={5} required minLength={10} maxLength={2000} />
      </label>
      <div className={s.row}>
        <label className={s.field}>
          Category
          <select className={s.input} name="category" defaultValue={listing?.category ?? ""} required>
            <option value="" disabled>
              Choose…
            </option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className={s.field}>
          City
          <select className={s.input} name="city" defaultValue={listing?.city ?? ""} required>
            <option value="" disabled>
              Choose…
            </option>
            {CITIES.map((c) => (
              <option key={c.name}>{c.name}</option>
            ))}
          </select>
        </label>
        <label className={s.field}>
          Price (₦, optional)
          <input className={s.input} name="price" inputMode="numeric" defaultValue={listing?.price?.amount} />
        </label>
      </div>
      <button className={s.button}>{listing ? "Save and resubmit" : "Submit for review"}</button>
    </form>
  );
}
