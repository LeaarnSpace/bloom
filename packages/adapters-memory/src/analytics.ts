import {
  EVENT_NAMES,
  eachLocalDate,
  emptyCounts,
  localDate,
  utcBounds,
  type AnalyticsSink,
  type EventCounts,
  type ProviderStats,
  type ProviderStatsSummary,
  type TrackedEvent,
} from "@bloom/core";

export function createMemoryAnalytics(events: TrackedEvent[] = []): AnalyticsSink & ProviderStats {
  return {
    async record(batch) {
      events.push(...batch);
    },

    async summary(providerId, range): Promise<ProviderStatsSummary> {
      // Filter on exact UTC instants for the provider's local days, then bucket in their zone.
      const { start, end } = utcBounds(range);
      const startIso = start.toISOString();
      const endIso = end.toISOString();
      const matching = events.filter((e) => e.providerId === providerId && e.at >= startIso && e.at < endIso);

      const visitors = Object.fromEntries(EVENT_NAMES.map((n) => [n, new Set<string>()]));
      const totals = emptyCounts();
      const byListing = new Map<string, EventCounts>();
      const daily = new Map<string, EventCounts>(eachLocalDate(range).map((d) => [d, emptyCounts()]));

      for (const e of matching) {
        totals[e.name]++;
        visitors[e.name]!.add(e.visitorId);
        if (e.listingId) {
          const counts = byListing.get(e.listingId) ?? emptyCounts();
          counts[e.name]++;
          byListing.set(e.listingId, counts);
        }
        daily.get(localDate(new Date(e.at), range.timeZone))![e.name]++;
      }

      return {
        providerId,
        range,
        totals: Object.fromEntries(
          EVENT_NAMES.map((n) => [n, { count: totals[n], uniqueVisitors: visitors[n]!.size }]),
        ) as ProviderStatsSummary["totals"],
        byListing: [...byListing].map(([listingId, counts]) => ({ listingId, counts })),
        daily: [...daily].map(([date, counts]) => ({ date, counts })),
      };
    },
  };
}
