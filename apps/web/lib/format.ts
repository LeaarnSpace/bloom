import { PLATFORM_TIME_ZONE, startOfLocalDay, type LocalDate, type Money } from "@bloom/core";

const naira = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });
const number = new Intl.NumberFormat("en-NG");

export const formatMoney = (price: Money | undefined) => (price ? naira.format(price.amount) : "—");
export const formatCount = (n: number) => number.format(n);

// Stored instants are UTC; always pass the zone they should be read in.
export function formatDateTime(isoUtc: string, timeZone = PLATFORM_TIME_ZONE): string {
  return new Date(isoUtc).toLocaleString("en-NG", { timeZone, dateStyle: "medium", timeStyle: "short" });
}

// A calendar date is zone-free; format it as such (via UTC so it can't shift a day).
export function formatDate(date: LocalDate): string {
  return startOfLocalDay(date, "UTC").toLocaleDateString("en-NG", { timeZone: "UTC", dateStyle: "medium" });
}
