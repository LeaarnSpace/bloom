import { describe, expect, it } from "vitest";
import { createMemoryWaitlist } from "./waitlist";

describe("memory waitlist", () => {
  it("keeps the first sign-up and accepts repeats silently", async () => {
    const list = createMemoryWaitlist();
    await list.add({ email: "ada@example.ng", designId: "clean", createdAt: "2026-11-11T10:00:00.000Z" });
    await expect(
      list.add({ email: "ada@example.ng", designId: "warm", createdAt: "2026-11-12T10:00:00.000Z" }),
    ).resolves.toBeUndefined();
    expect(list.all()).toEqual([{ email: "ada@example.ng", designId: "clean", createdAt: "2026-11-11T10:00:00.000Z" }]);
  });
});
