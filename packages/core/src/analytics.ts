import type { LocalDate, LocalDateRange } from "./time";

// Every event a provider can be shown stats for. Add new names here first;
// the tracker, the ingest endpoint and the stats all key off this list.
export const EVENT_NAMES = [
  "listing_impression", // listing appeared in results / on the main page
  "listing_click", // clicked through to the listing
  "listing_view", // listing page opened
  "contact_click", // call / WhatsApp / email tapped
  "provider_page_view", // provider profile opened
] as const;

export type EventName = (typeof EVENT_NAMES)[number];

export function isEventName(value: unknown): value is EventName {
  return EVENT_NAMES.includes(value as EventName);
}

// What the browser sends. Never trusted for providerId when a listingId is present.
export interface ClientEvent {
  name: EventName;
  listingId?: string;
  providerId?: string;
}

// What gets stored, after the server has validated and enriched it.
export interface TrackedEvent {
  name: EventName;
  providerId: string;
  listingId?: string;
  visitorId: string;
  // UTC instant (ISO 8601 with "Z").
  at: string;
}

export type EventCounts = Record<EventName, number>;

// All dates are calendar dates in `range.timeZone` (the provider's zone).
export interface ProviderStatsSummary {
  providerId: string;
  range: LocalDateRange;
  totals: Record<EventName, { count: number; uniqueVisitors: number }>;
  byListing: { listingId: string; counts: EventCounts }[];
  // One entry per day in the range, including days with no activity.
  daily: { date: LocalDate; counts: EventCounts }[];
}

export function emptyCounts(): EventCounts {
  return Object.fromEntries(EVENT_NAMES.map((n) => [n, 0])) as EventCounts;
}
