// Database settings for tooling that runs outside Next.js (migrations,
// drizzle-kit), which is what normally loads apps/web/.env.local.

// Loads apps/web/.env.local like Next.js does: variables already set in the
// environment win, and a missing file is fine (e.g. on Vercel).
export function loadLocalEnv(): void {
  try {
    process.loadEnvFile(new URL("../../apps/web/.env.local", import.meta.url));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}

// The URL to run migrations with, or undefined when no database is configured.
//
// Migrations need a direct connection: Neon's pooler runs PgBouncer in
// transaction mode, which doesn't suit schema changes. So this prefers
// DATABASE_URL_UNPOOLED (Neon's direct URL; the name the Vercel–Neon integration
// sets) and falls back to DATABASE_URL where there's only one (local Postgres).
export function migrationUrl(): string | undefined {
  const direct = process.env.DATABASE_URL_UNPOOLED;
  if (direct) return direct;
  const url = process.env.DATABASE_URL;
  if (url && new URL(url).hostname.includes("-pooler.")) {
    throw new Error("DATABASE_URL is Neon's pooled URL. Set DATABASE_URL_UNPOOLED to the direct URL for migrations.");
  }
  return url || undefined;
}
