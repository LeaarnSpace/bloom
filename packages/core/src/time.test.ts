import { describe, expect, it } from "vitest";
import { addDays, completedLocalDays, eachLocalDate, lastLocalDays, localDate, startOfLocalDay, utcBounds } from "./time";

const LAGOS = "Africa/Lagos"; // UTC+1 all year, no DST
const BERLIN = "Europe/Berlin"; // UTC+1 winter, UTC+2 summer

describe("localDate", () => {
  it("puts an 11:49pm Lagos visit on that Lagos day", () => {
    expect(localDate(new Date("2026-11-10T22:49:00Z"), LAGOS)).toBe("2026-11-10");
  });

  it("rolls over exactly at Lagos midnight (23:00 UTC)", () => {
    expect(localDate(new Date("2026-11-10T22:59:59Z"), LAGOS)).toBe("2026-11-10");
    expect(localDate(new Date("2026-11-10T23:00:00Z"), LAGOS)).toBe("2026-11-11");
  });

  it("does not follow a German server's day in summer", () => {
    // 22:30 UTC in July: already tomorrow in Berlin, still today in Lagos.
    const instant = new Date("2026-07-10T22:30:00Z");
    expect(localDate(instant, BERLIN)).toBe("2026-07-11");
    expect(localDate(instant, LAGOS)).toBe("2026-07-10");
  });
});

describe("startOfLocalDay", () => {
  it("returns the UTC instant of local midnight", () => {
    expect(startOfLocalDay("2026-11-11", LAGOS).toISOString()).toBe("2026-11-10T23:00:00.000Z");
    expect(startOfLocalDay("2026-11-11", "Asia/Kolkata").toISOString()).toBe("2026-11-10T18:30:00.000Z");
    expect(startOfLocalDay("2026-11-11", "UTC").toISOString()).toBe("2026-11-11T00:00:00.000Z");
  });

  it("handles DST changes", () => {
    // Berlin springs forward on 2026-03-29: that day is 23 hours long.
    expect(startOfLocalDay("2026-03-29", BERLIN).toISOString()).toBe("2026-03-28T23:00:00.000Z");
    expect(startOfLocalDay("2026-03-30", BERLIN).toISOString()).toBe("2026-03-29T22:00:00.000Z");
    // New York falls back on 2026-11-01.
    expect(startOfLocalDay("2026-11-01", "America/New_York").toISOString()).toBe("2026-11-01T04:00:00.000Z");
    expect(startOfLocalDay("2026-11-02", "America/New_York").toISOString()).toBe("2026-11-02T05:00:00.000Z");
  });
});

describe("ranges", () => {
  it("counts 'last 30 days' in the provider's zone, not UTC", () => {
    // 23:30 UTC on Nov 10 is already 00:30 on Nov 11 in Lagos.
    const range = lastLocalDays(30, LAGOS, new Date("2026-11-10T23:30:00Z"));
    expect(range).toEqual({ from: "2026-10-13", to: "2026-11-11", timeZone: LAGOS });
    expect(eachLocalDate(range)).toHaveLength(30);
  });

  it("converts a local range to half-open UTC bounds", () => {
    const { start, end } = utcBounds({ from: "2026-11-10", to: "2026-11-10", timeZone: LAGOS });
    expect(start.toISOString()).toBe("2026-11-09T23:00:00.000Z");
    expect(end.toISOString()).toBe("2026-11-10T23:00:00.000Z");
  });

  it("adds days across month and year ends", () => {
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });
});

describe("completedLocalDays (daily roll-up at a fixed UTC time)", () => {
  const run = new Date("2026-11-11T08:00:00Z"); // 9am Lagos

  it("finalises the days that have ended in each zone", () => {
    expect(completedLocalDays(LAGOS, 3, run)).toEqual({ from: "2026-11-08", to: "2026-11-10", timeZone: LAGOS });
    // Midnight exactly in Los Angeles (UTC-8): Nov 10 has just ended there too.
    expect(completedLocalDays("America/Los_Angeles", 3, run).to).toBe("2026-11-10");
    // 10pm on Nov 11 at UTC+14: Nov 10 is complete, Nov 11 is not.
    expect(completedLocalDays("Pacific/Kiritimati", 3, run).to).toBe("2026-11-10");
  });

  it("never includes a day that is still running in that zone", () => {
    // One minute earlier it is 11:59pm Nov 10 in Los Angeles, so Nov 10 waits for the next run.
    expect(completedLocalDays("America/Los_Angeles", 3, new Date("2026-11-11T07:59:00Z")).to).toBe("2026-11-09");
  });
});
