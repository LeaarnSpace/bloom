import { requireAdmin } from "@/lib/auth";
import { formatDateTime, formatMoney } from "@/lib/format";
import { services } from "@/services";
import s from "../../_components/dashboard.module.css";
import { reviewListing } from "../actions";

export default async function ReviewPage() {
  await requireAdmin();
  const pending = await services.listings.listByStatus("pending");
  const providers = new Map(
    await Promise.all(pending.map(async (l) => [l.providerId, await services.providers.getById(l.providerId)] as const)),
  );

  return (
    <>
      <h1>Review queue</h1>
      {pending.length === 0 && <p className={s.muted}>Nothing waiting for review.</p>}
      {pending.map((l) => (
        <div key={l.id} className={s.panel}>
          <h2 style={{ marginTop: 0 }}>{l.title}</h2>
          <p className={s.muted}>
            {providers.get(l.providerId)?.name} · {l.category} · {l.city} · {formatMoney(l.price)} · updated{" "}
            {formatDateTime(l.updatedAt, providers.get(l.providerId)?.timeZone)}
          </p>
          <p>{l.description}</p>
          <form action={reviewListing} className={s.form}>
            <input type="hidden" name="id" value={l.id} />
            <label className={s.field}>
              Note to provider (required if rejecting)
              <input className={s.input} name="note" maxLength={500} />
            </label>
            <div className={s.row}>
              <button className={s.button} name="decision" value="approved">
                Approve
              </button>
              <button className={s.dangerButton} name="decision" value="rejected">
                Reject
              </button>
            </div>
          </form>
        </div>
      ))}
    </>
  );
}
