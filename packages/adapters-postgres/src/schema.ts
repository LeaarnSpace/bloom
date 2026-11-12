import { sql } from "drizzle-orm";
import { bigint, check, pgSchema, text, timestamp } from "drizzle-orm/pg-core";

// Database schema. Source of truth for migrations: change it here, then run
// `pnpm db:generate` to write the SQL migration and `pnpm db:migrate` to apply it.

// All of Bloom's tables live in the "main" Postgres schema.
export const main = pgSchema("main");

// Coming-soon email sign-ups, one row per email (the first sign-up is kept).
// Emails are personal data (NDPA 2023).
export const waitlist = main.table(
  "waitlist",
  {
    id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    // Lower-cased and trimmed by the app (normalizeEmail); the check enforces it.
    email: text("email").notNull().unique("waitlist_email_key"),
    // Which design the visitor saw when signing up ("warm", "clean", ...).
    designId: text("design_id").notNull(),
    // A UTC instant; timestamptz always stores UTC.
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    check(
      "waitlist_email_check",
      sql`${t.email} = lower(btrim(${t.email})) and length(${t.email}) between 3 and 254`,
    ),
  ],
);
