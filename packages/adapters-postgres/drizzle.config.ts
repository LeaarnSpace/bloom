import { defineConfig } from "drizzle-kit";
import { loadLocalEnv, migrationUrl } from "./env.ts";

// drizzle-kit config for generating migrations (`pnpm db:generate`) and
// browsing data (`pnpm db:studio`). Migrations are applied by migrate.ts.
// Connection: DATABASE_DIRECT_URL (see migrationUrl() in env.ts).

loadLocalEnv();
const url = migrationUrl();
if (!url) throw new Error("Set DATABASE_DIRECT_URL (see .env.example).");

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./drizzle",
  schemaFilter: ["main"],
  dbCredentials: { url },
  strict: true,
  verbose: true,
});
