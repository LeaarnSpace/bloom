import { describe, expect, it } from "vitest";
import type { TrackedEvent } from "@bloom/core";
import { createMemoryAnalytics } from "./analytics";

const view = (at: string, providerId = "p1"): TrackedEvent => ({
  name: "listing_view",
  listingId: "l1",
  providerId,
  visitorId: `v-${at}`,
  at,
});

describe("provider stats day buckets", () => {
  const stats = createMemoryAnalytics([
    view("2026-11-10T22:49:00Z"), // 11:49pm Nov 10 in Lagos
    view("2026-11-10T23:10:00Z"), // 12:10am Nov 11 in Lagos
  ]);

  it("splits days at the provider's midnight", async () => {
    const s = await stats.summary("p1", { from: "2026-11-10", to: "2026-11-11", timeZone: "Africa/Lagos" });
    expect(s.daily.map((d) => [d.date, d.counts.listing_view])).toEqual([
      ["2026-11-10", 1],
      ["2026-11-11", 1],
    ]);
  });

  it("excludes events after the provider's day ends, even if still that day in UTC", async () => {
    const s = await stats.summary("p1", { from: "2026-11-10", to: "2026-11-10", timeZone: "Africa/Lagos" });
    expect(s.totals.listing_view.count).toBe(1);
  });

  it("includes empty days so charts have no gaps", async () => {
    const s = await stats.summary("p1", { from: "2026-11-08", to: "2026-11-11", timeZone: "Africa/Lagos" });
    expect(s.daily.map((d) => d.date)).toEqual(["2026-11-08", "2026-11-09", "2026-11-10", "2026-11-11"]);
    expect(s.daily[0]!.counts.listing_view).toBe(0);
  });

  it("buckets by each provider's own zone", async () => {
    const both = createMemoryAnalytics([view("2026-07-10T22:30:00Z", "lagos"), view("2026-07-10T22:30:00Z", "berlin")]);
    const lagos = await both.summary("lagos", { from: "2026-07-10", to: "2026-07-11", timeZone: "Africa/Lagos" });
    const berlin = await both.summary("berlin", { from: "2026-07-10", to: "2026-07-11", timeZone: "Europe/Berlin" });
    expect(lagos.daily.find((d) => d.counts.listing_view)?.date).toBe("2026-07-10");
    expect(berlin.daily.find((d) => d.counts.listing_view)?.date).toBe("2026-07-11");
  });
});
