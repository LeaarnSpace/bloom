import { describe, expect, it } from "vitest";
import { normalizeEmail } from "./waitlist";

describe("normalizeEmail", () => {
  it("trims and lower-cases", () => {
    expect(normalizeEmail("  Ada@Example.NG ")).toBe("ada@example.ng");
  });
  it("rejects anything that isn't an email", () => {
    for (const bad of ["", "ada", "ada@", "@example.ng", "ada@example", "a b@example.ng"]) {
      expect(normalizeEmail(bad)).toBeNull();
    }
  });
  it("rejects over-long input", () => {
    expect(normalizeEmail(`${"a".repeat(250)}@example.ng`)).toBeNull();
  });
});
