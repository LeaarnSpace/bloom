import { afterAll, describe, expect, it } from "vitest";
import { like } from "drizzle-orm";
import { createDatabase, type Executor } from "./client";
import { waitlist } from "./schema";
import { createPostgresWaitlist } from "./waitlist";

// Integration tests against a migrated database. Disabled for now (user
// request, 2026-11-12: no tests run against any database). To run them, change
// describe.skip to describe and set DATABASE_POOLED_URL. Each test runs in a
// transaction that is rolled back, so nothing is left behind.
describe.skip("postgres waitlist", () => {
  const { db, close } = createDatabase(process.env.DATABASE_POOLED_URL!);
  afterAll(close);

  class Rollback extends Error {}
  async function inRollback(test: (tx: Executor) => Promise<void>) {
    await expect(
      db.transaction(async (tx) => {
        await test(tx);
        throw new Rollback();
      }),
    ).rejects.toBeInstanceOf(Rollback);
  }

  const testRows = (tx: Executor) =>
    tx.select().from(waitlist).where(like(waitlist.email, "%@test.invalid")).orderBy(waitlist.id);

  it("stores a sign-up with its design and UTC time", () =>
    inRollback(async (tx) => {
      await createPostgresWaitlist(tx).add({
        email: "ada@test.invalid",
        designId: "warm",
        createdAt: "2026-11-12T14:03:11.000Z",
      });
      const [row] = await testRows(tx);
      expect(row).toMatchObject({ email: "ada@test.invalid", designId: "warm" });
      expect(row?.createdAt.toISOString()).toBe("2026-11-12T14:03:11.000Z");
    }));

  it("keeps the first sign-up when an email repeats", () =>
    inRollback(async (tx) => {
      const repo = createPostgresWaitlist(tx);
      await repo.add({ email: "ada@test.invalid", designId: "warm", createdAt: "2026-11-12T10:00:00.000Z" });
      await repo.add({ email: "ada@test.invalid", designId: "clean", createdAt: "2026-11-12T11:00:00.000Z" });
      const rows = await testRows(tx);
      expect(rows).toHaveLength(1);
      expect(rows[0]?.designId).toBe("warm");
    }));

  it("rejects an email that isn't normalised", () =>
    inRollback(async (tx) => {
      await expect(
        createPostgresWaitlist(tx).add({ email: " Ada@Test.invalid", designId: "warm", createdAt: "2026-11-12T10:00:00.000Z" }),
      ).rejects.toThrow();
    }));
});
