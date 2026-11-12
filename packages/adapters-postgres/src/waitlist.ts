import type { WaitlistRepository } from "@bloom/core";
import type { Executor } from "./client";
import { waitlist } from "./schema";

export function createPostgresWaitlist(db: Executor): WaitlistRepository {
  return {
    async add({ email, designId, createdAt }) {
      // Keep the first sign-up; a repeat is silently accepted (the page never
      // reveals whether an email was already on the list).
      await db
        .insert(waitlist)
        .values({ email, designId, createdAt: new Date(createdAt) })
        .onConflictDoNothing({ target: waitlist.email });
    },
  };
}
