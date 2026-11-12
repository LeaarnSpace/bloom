import { createMemoryServices } from "@bloom/adapters-memory";
import { createDatabase, createPostgresWaitlist } from "@bloom/adapters-postgres";
import { parseIdentifier, type Services } from "@bloom/core";

// The one place adapters are chosen. Swap an implementation here (e.g. Typesense
// for search, Postgres for listings) without touching pages or designs.
// Kept on globalThis so in-memory stores and the database pool survive dev
// reloads and are shared by pages and route handlers.
const adminIdentifiers = (process.env.ADMIN_IDENTIFIERS ?? "")
  .split(",")
  .map((raw) => parseIdentifier(raw)?.value)
  .filter((v) => v !== undefined);

function createServices(): Services {
  const services = createMemoryServices({ adminIdentifiers });
  // Waitlist sign-ups go to Postgres when a database is configured
  // (table main.waitlist; schema in packages/adapters-postgres/src/schema.ts).
  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl) services.waitlist = createPostgresWaitlist(createDatabase(databaseUrl).db);
  return services;
}

const g = globalThis as { bloomServices?: Services };
export const services: Services = (g.bloomServices ??= createServices());
