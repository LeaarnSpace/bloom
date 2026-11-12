import { describe, expect, it } from "vitest";
import { activeSeason } from "./resolve";

describe("seasons use the platform (Lagos) day", () => {
  const rules = [{ design: "festive", start: "12-15", end: "01-05" }];

  it("starts at Lagos midnight, not UTC midnight", () => {
    expect(activeSeason(rules, new Date("2026-12-14T22:59:00Z"))).toBeUndefined();
    expect(activeSeason(rules, new Date("2026-12-14T23:00:00Z"))).toBe("festive");
  });

  it("wraps past New Year and ends after the last Lagos day", () => {
    expect(activeSeason(rules, new Date("2027-01-05T22:59:00Z"))).toBe("festive");
    expect(activeSeason(rules, new Date("2027-01-05T23:00:00Z"))).toBeUndefined();
  });
});
