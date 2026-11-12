import type { ClientEvent, EventName } from "@bloom/core";

export const EVENTS_ENDPOINT = "/api/events";

export interface TrackAttrs {
  "data-track": EventName;
  "data-listing-id"?: string;
  "data-provider-id"?: string;
}

// Designs spread this onto any clickable element; the global <Tracker> does the rest.
//   <a href={...} {...trackAttrs("listing_click", { listingId: l.id })}>
export function trackAttrs(name: EventName, ids: Omit<ClientEvent, "name"> = {}): TrackAttrs {
  return {
    "data-track": name,
    ...(ids.listingId && { "data-listing-id": ids.listingId }),
    ...(ids.providerId && { "data-provider-id": ids.providerId }),
  };
}
