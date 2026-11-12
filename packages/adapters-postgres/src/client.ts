import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export type Database = NodePgDatabase<typeof schema>;

// What a repository needs to run queries. Both the database and a transaction
// satisfy it, so repositories work inside transactions and tests can roll back.
export type Executor = Pick<Database, "insert" | "select" | "update" | "delete">;

// A small pool: the site runs on serverless functions, where each instance
// serves few requests at once. Idle connections close quickly so a database
// that scales to zero (e.g. Neon) can go back to sleep.
export function createDatabase(connectionString: string): { db: Database; close: () => Promise<void> } {
  const pool = new Pool({ connectionString, max: 3, idleTimeoutMillis: 10_000 });
  return { db: drizzle({ client: pool, schema }), close: () => pool.end() };
}
