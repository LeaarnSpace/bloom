import { fileURLToPath } from "node:url";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";
import { loadLocalEnv, migrationUrl } from "./env.ts";

// Applies pending migrations from ./drizzle, in order, each recorded in
// drizzle.__drizzle_migrations so it runs once. Runs before every web build
// (turbo.json: @bloom/web#build depends on db:migrate), and via `pnpm db:migrate`.
//
// No database configured: a production deploy fails (sign-ups would be lost);
// anything else (local, preview) skips, since the app then keeps sign-ups in memory.

loadLocalEnv();
const url = migrationUrl();

if (!url) {
  if (process.env.VERCEL_ENV === "production") {
    throw new Error("No database configured: set DATABASE_URL (and DATABASE_URL_UNPOOLED on Neon).");
  }
  console.log("db:migrate: no DATABASE_URL set, skipping.");
} else {
  const client = new pg.Client({ connectionString: url });
  await client.connect();
  try {
    await migrate(drizzle({ client }), { migrationsFolder: fileURLToPath(new URL("./drizzle", import.meta.url)) });
    console.log(`db:migrate: up to date (${new URL(url).host}).`);
  } finally {
    await client.end();
  }
}
